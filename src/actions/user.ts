"use server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/server-utils";
import { formatDurationMinutes } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { format, differenceInDays, differenceInMinutes } from "date-fns";
import { rawMinuteOptions } from "@/components/duration-picker";


export async function getUserProfile() {
  const userId = await getAuthenticatedUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) throw new Error("User not found");

  const joinDate = format(user.createdAt, "MMM yyyy");
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  const currencySymbol = currencySymbols[user.currency] || "₹";

  return {
    name: user.name || "User",
    memberSince: joinDate,
    premium: user.subscription?.status === "ACTIVE",
    avatar: user.image,
    smokingProfile: {
      dailyCigarettes: user.dailyCigarettes || 10,
      pricePerCigarette: user.cigarettePrice || 20,
      currencySymbol,
      gapTarget: formatDurationMinutes(user.defaultGapTargetMinutes),
      currency: user.currency,
      defaultGapTargetMinutes: user.defaultGapTargetMinutes,
    },
  };
}

export async function getUserStats() {
  const userId = await getAuthenticatedUserId();

  const [stats, user, activeSession] = await Promise.all([
    prisma.userStats.findUnique({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.gapSession.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { startedAt: "desc" },
    }),
  ]);

  if (!user) throw new Error("User not found");

  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  const currencySymbol = currencySymbols[user.currency] || "₹";

  // If no stats yet (fresh user), return zeros with real currency
  if (!stats) {
    return {
      longestGap: "0m",
      longestGapMinutes: 0,
      totalSaved: 0,
      currencySymbol,
      oxygenLevel: 95,
      totalCigarettesLogged: 0,
      defaultGapTargetMinutes: user.defaultGapTargetMinutes,
    };
  }

  const daysSinceJoin = Math.max(
    1,
    differenceInDays(new Date(), user.createdAt)
  );
  const dailyCigs = user.dailyCigarettes || 10;
  const expectedSmoked = dailyCigs * daysSinceJoin;
  const avoided = Math.max(0, expectedSmoked - stats.totalCigarettesLogged);
  const saved = Math.floor(avoided * (user.cigarettePrice || 20));

  let oxygen = 95;
  if (activeSession) {
    const elapsedMinutes = differenceInMinutes(new Date(), activeSession.startedAt);
    if (elapsedMinutes > 480) oxygen = 100;
    else if (elapsedMinutes > 20) oxygen = 98;
  }

  return {
    longestGap: formatDurationMinutes(stats.longestGapMinutes),
    longestGapMinutes: stats.longestGapMinutes,
    totalSaved: saved,
    currencySymbol,
    oxygenLevel: oxygen,
    totalCigarettesLogged: stats.totalCigarettesLogged,
    defaultGapTargetMinutes: user.defaultGapTargetMinutes,
  };
}

export async function updateUserProfile(data: {
  dailyCigarettes: number;
  cigarettePrice: number;
  currency: "INR" | "USD" | "EUR" | "GBP";
  defaultGapTargetMinutes: number;
}) {
  const userId = await getAuthenticatedUserId();

  const { dailyCigarettes, cigarettePrice, currency, defaultGapTargetMinutes } =
    data;

  const minGap = rawMinuteOptions[0];

  if (
    dailyCigarettes < 1 ||
    dailyCigarettes > 200 ||
    cigarettePrice <= 0 ||
    defaultGapTargetMinutes < minGap
  ) {
    return { error: "Invalid data. Please check your inputs." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      dailyCigarettes,
      cigarettePrice,
      currency,
      defaultGapTargetMinutes,
    },
  });

  // Also update active session's target minutes to align with the new default
  const activeSession = await prisma.gapSession.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
  });

  if (activeSession) {
    await prisma.gapSession.update({
      where: { id: activeSession.id },
      data: { targetMinutes: defaultGapTargetMinutes },
    });
  }

  revalidatePath("/home");
  revalidatePath("/profile");

  return { success: true };
}

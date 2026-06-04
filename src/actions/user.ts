"use server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/server-utils";
import { formatDurationMinutes } from "@/lib/format";


export async function getUserProfile() {
  const userId = await getAuthenticatedUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) throw new Error("User not found");

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
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
      totalSaved: 0,
      currencySymbol,
      oxygenLevel: 95,
      totalCigarettesLogged: 0,
    };
  }

  const daysSinceJoin = Math.max(
    1,
    (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dailyCigs = user.dailyCigarettes || 10;
  const expectedSmoked = dailyCigs * daysSinceJoin;
  const avoided = Math.max(0, expectedSmoked - stats.totalCigarettesLogged);
  const saved = Math.floor(avoided * (user.cigarettePrice || 20));

  let oxygen = 95;
  if (activeSession) {
    const elapsedMinutes =
      (Date.now() - activeSession.startedAt.getTime()) / (1000 * 60);
    if (elapsedMinutes > 480) oxygen = 100;
    else if (elapsedMinutes > 20) oxygen = 98;
  }

  return {
    longestGap: formatDurationMinutes(stats.longestGapMinutes),
    totalSaved: saved,
    currencySymbol,
    oxygenLevel: oxygen,
    totalCigarettesLogged: stats.totalCigarettesLogged,
  };
}

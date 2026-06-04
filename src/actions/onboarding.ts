"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Currency } from "@/generated/prisma/client";

export type OnboardingData = {
  dailyCigarettes: number;
  cigarettePrice: number;
  currency: Currency;
  defaultGapTargetMinutes: number;
};

export type OnboardingResult =
  | { success: true }
  | { error: string };

export async function completeOnboarding(
  data: OnboardingData
): Promise<OnboardingResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { dailyCigarettes, cigarettePrice, currency, defaultGapTargetMinutes } =
    data;

  if (
    dailyCigarettes < 1 ||
    dailyCigarettes > 200 ||
    cigarettePrice <= 0 ||
    defaultGapTargetMinutes < 30
  ) {
    return { error: "Invalid data. Please check your inputs." };
  }

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          dailyCigarettes,
          cigarettePrice,
          currency,
          defaultGapTargetMinutes,
          onboardingCompleted: true,
        },
      }),
      prisma.userStats.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          longestGapMinutes: 0,
          totalCigarettesLogged: 0,
          totalCravingsResisted: 0,
        },
        update: {},
      }),
    ]);
  } catch (err) {
    console.error("Onboarding save error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  // Return success — the dialog closes and the page refreshes
  return { success: true };
}

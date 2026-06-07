import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/server-utils";
import { rawMinuteOptions } from "@/components/duration-picker";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dailyCigarettes, cigarettePrice, currency, defaultGapTargetMinutes } = await req.json();
    const minGap = rawMinuteOptions[0];

    if (
      dailyCigarettes < 1 ||
      dailyCigarettes > 200 ||
      cigarettePrice <= 0 ||
      defaultGapTargetMinutes < minGap
    ) {
      return NextResponse.json({ error: "Invalid data. Please check your inputs." }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          dailyCigarettes,
          cigarettePrice,
          currency,
          defaultGapTargetMinutes,
          onboardingCompleted: true,
        },
      }),
      prisma.userStats.upsert({
        where: { userId },
        create: {
          userId,
          longestGapMinutes: 0,
          totalCigarettesLogged: 0,
        },
        update: {},
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding save error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

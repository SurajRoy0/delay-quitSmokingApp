import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/server-utils";
import { formatDurationMs } from "@/lib/format";
import { differenceInMinutes } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const reasons = body.reasons || [];
    const customPrice = body.price;

    const now = new Date();

    const [activeSession, previousLog, user, stats] = await Promise.all([
      prisma.gapSession.findFirst({
        where: { userId, status: "ACTIVE" },
        orderBy: { startedAt: "desc" },
      }),
      prisma.smokeLog.findFirst({
        where: { userId },
        orderBy: { smokedAt: "desc" },
      }),
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.userStats.findUnique({ where: { userId } }),
    ]);

    const defaultTarget = user?.defaultGapTargetMinutes || 240;
    const priceToLog = customPrice ?? user?.cigarettePrice ?? 20;
    let gapMinutes = 0;

    if (activeSession) {
      gapMinutes = differenceInMinutes(now, activeSession.startedAt);
    }

    const sessionStatus =
      activeSession && gapMinutes >= activeSession.targetMinutes
        ? "COMPLETED"
        : "BROKEN";

    const VALID_REASONS = [
      "STRESS",
      "WORK",
      "THINKING",
      "BOREDOM",
      "SOCIAL",
      "HABIT",
      "OTHER",
    ] as const;

    const validReasons = reasons.filter((r: string) => 
      VALID_REASONS.includes(r as any)
    );

    const result = await prisma.$transaction(async (tx) => {
      if (activeSession) {
        await tx.gapSession.update({
          where: { id: activeSession.id },
          data: {
            endedAt: now,
            actualMinutes: gapMinutes,
            status: sessionStatus,
          },
        });
      }

      const newSmokeLog = await tx.smokeLog.create({
        data: {
          userId,
          smokedAt: now,
          reasons: validReasons,
          price: priceToLog,
          gapMinutes: gapMinutes > 0 ? gapMinutes : null,
          previousLogId: previousLog?.id,
          endedGapSessionId: activeSession?.id ?? null,
        },
      });

      await tx.gapSession.create({
        data: {
          userId,
          targetMinutes: defaultTarget,
          startedAt: now,
          startedBySmokeLogId: newSmokeLog.id,
          status: "ACTIVE",
        },
      });

      if (stats) {
        await tx.userStats.update({
          where: { userId },
          data: {
            totalCigarettesLogged: { increment: 1 },
            longestGapMinutes: gapMinutes > stats.longestGapMinutes ? gapMinutes : stats.longestGapMinutes,
          },
        });
      } else {
        await tx.userStats.create({
          data: {
            userId,
            totalCigarettesLogged: 1,
            longestGapMinutes: gapMinutes,
          },
        });
      }

      return {
        sessionSummary: activeSession ? {
          totalSmokeFreeTime: formatDurationMs(gapMinutes * 60 * 1000),
          gapMinutes,
          targetMinutes: activeSession.targetMinutes,
          status: sessionStatus,
          longestGapEver: stats ? Math.max(stats.longestGapMinutes, gapMinutes) : gapMinutes,
        } : null
      };
    });

    return NextResponse.json({ success: true, ...result });

  } catch (error) {
    console.error("Error logging smoke event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

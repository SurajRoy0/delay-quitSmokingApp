"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUserId } from "@/lib/server-utils";
import { formatDurationMs } from "@/lib/format";
import { differenceInMinutes } from "date-fns";
import { rawMinuteOptions } from "@/components/duration-picker";


// ─── Data for the home page live timer ───────────────────────────────

export async function getActiveSessionData() {
  const userId = await getAuthenticatedUserId();

  const activeSession = await prisma.gapSession.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
  });

  if (!activeSession) return null;

  return {
    startedAt: activeSession.startedAt.toISOString(),
    targetMinutes: activeSession.targetMinutes,
  };
}

// ─── Data for the health page ────────────────────────────────────────

export async function getSmokeFreeMinutes(): Promise<number> {
  const userId = await getAuthenticatedUserId();

  const activeSession = await prisma.gapSession.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
  });

  if (!activeSession) return 0;

  return differenceInMinutes(new Date(), activeSession.startedAt);
}

// ─── Data for the "Next Milestone" card on home page ─────────────────

export async function getNextMilestoneProgress(): Promise<{
  label: string;
  progressPercent: number;
}> {
  const userId = await getAuthenticatedUserId();

  const activeSession = await prisma.gapSession.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
  });

  // Milestones in minutes — matches health-milestones.json
  const MILESTONES = [
    { label: "20 Minutes — Heart rate normalises", minutes: 20 },
    { label: "8 Hours — CO levels halved", minutes: 480 },
    { label: "24 Hours of Pure Air", minutes: 1440 },
    { label: "48 Hours — Nicotine free", minutes: 2880 },
    { label: "72 Hours — Breathing easier", minutes: 4320 },
    { label: "1 Week — Circulation improves", minutes: 10080 },
    { label: "1 Month — 30% more lung capacity", minutes: 43200 },
  ];

  if (!activeSession) {
    return { label: MILESTONES[0].label, progressPercent: 0 };
  }

  const elapsedMinutes = differenceInMinutes(new Date(), activeSession.startedAt);

  // Find the next unachieved milestone
  for (const m of MILESTONES) {
    if (elapsedMinutes < m.minutes) {
      const pct = Math.min(100, (elapsedMinutes / m.minutes) * 100);
      return { label: m.label, progressPercent: Math.round(pct) };
    }
  }

  // All milestones achieved
  return { label: "All milestones achieved! 🎉", progressPercent: 100 };
}

// ─── Log "I Smoked" event ────────────────────────────────────────────

export async function logSmokeEvent(reason?: string) {
  const userId = await getAuthenticatedUserId();
  const now = new Date();

  // Read-only lookups before the transaction
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

  const validReason = VALID_REASONS.includes(reason as (typeof VALID_REASONS)[number])
    ? (reason as (typeof VALID_REASONS)[number])
    : null;

  // All writes in a single transaction
  await prisma.$transaction(async (tx) => {
    // 1. End active session
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

    // 2. Create smoke log
    const newSmokeLog = await tx.smokeLog.create({
      data: {
        userId,
        smokedAt: now,
        reason: validReason,
        gapMinutes: gapMinutes > 0 ? gapMinutes : null,
        previousLogId: previousLog?.id,
        endedGapSessionId: activeSession?.id ?? null,
      },
    });

    // 3. Start new gap session
    await tx.gapSession.create({
      data: {
        userId,
        targetMinutes: defaultTarget,
        startedAt: now,
        startedBySmokeLogId: newSmokeLog.id,
        status: "ACTIVE",
      },
    });

    // 4. Upsert user stats
    if (stats) {
      await tx.userStats.update({
        where: { userId },
        data: {
          totalCigarettesLogged: { increment: 1 },
          longestGapMinutes:
            gapMinutes > stats.longestGapMinutes
              ? gapMinutes
              : stats.longestGapMinutes,
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
  });

  revalidatePath("/home");
  revalidatePath("/health");
  revalidatePath("/profile");

  return {
    success: true,
    sessionSummary: activeSession
      ? {
          totalSmokeFreeTime: formatDurationMs(gapMinutes * 60 * 1000),
          gapMinutes,
          targetMinutes: activeSession.targetMinutes,
          status: sessionStatus,
          longestGapEver: stats
            ? Math.max(stats.longestGapMinutes, gapMinutes)
            : gapMinutes,
        }
      : null,
  };
}

export async function updateActiveSessionTarget(targetMinutes: number) {
  const userId = await getAuthenticatedUserId();

  const minGap = rawMinuteOptions[0];

  if (targetMinutes < minGap) {
    return { error: `Target gap must be at least ${minGap} minutes.` };
  }

  // 1. Update the user's default preference
  await prisma.user.update({
    where: { id: userId },
    data: { defaultGapTargetMinutes: targetMinutes },
  });

  // 2. Update active gap session if one exists
  const activeSession = await prisma.gapSession.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
  });

  if (activeSession) {
    await prisma.gapSession.update({
      where: { id: activeSession.id },
      data: { targetMinutes },
    });
  }

  revalidatePath("/home");
  revalidatePath("/health");
  revalidatePath("/profile");

  return { success: true };
}

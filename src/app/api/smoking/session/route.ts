import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/server-utils";
import { differenceInMinutes } from "date-fns";
import { rawMinuteOptions } from "@/components/duration-picker";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeSession = await prisma.gapSession.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { startedAt: "desc" },
    });

    if (!activeSession) {
      return NextResponse.json({
        session: null,
        milestone: {
          label: "20 Minutes — Heart rate normalises",
          progressPercent: 0
        }
      });
    }

    const elapsedMinutes = differenceInMinutes(new Date(), activeSession.startedAt);

    // Milestones logic
    const MILESTONES = [
      { label: "20 Minutes — Heart rate normalises", minutes: 20 },
      { label: "8 Hours — CO levels halved", minutes: 480 },
      { label: "24 Hours of Pure Air", minutes: 1440 },
      { label: "48 Hours — Nicotine free", minutes: 2880 },
      { label: "72 Hours — Breathing easier", minutes: 4320 },
      { label: "1 Week — Circulation improves", minutes: 10080 },
      { label: "1 Month — 30% more lung capacity", minutes: 43200 },
    ];

    let milestoneLabel = "All milestones achieved! 🎉";
    let milestoneProgress = 100;

    for (const m of MILESTONES) {
      if (elapsedMinutes < m.minutes) {
        milestoneProgress = Math.min(100, (elapsedMinutes / m.minutes) * 100);
        milestoneLabel = m.label;
        break;
      }
    }

    return NextResponse.json({
      session: {
        startedAt: activeSession.startedAt.toISOString(),
        targetMinutes: activeSession.targetMinutes,
        elapsedMinutes,
      },
      milestone: {
        label: milestoneLabel,
        progressPercent: Math.round(milestoneProgress),
      }
    });

  } catch (error) {
    console.error("Error fetching active session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetMinutes } = await req.json();
    const minGap = rawMinuteOptions[0];

    if (!targetMinutes || targetMinutes < minGap) {
      return NextResponse.json({ error: `Target gap must be at least ${minGap} minutes.` }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { defaultGapTargetMinutes: targetMinutes },
    });

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

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating active session target:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import Link from "next/link";
import { Flame, Wind, Wallet, Trophy } from "lucide-react";
import { ConfirmSmokeButton } from "./confirm-button";
import { getActiveSessionData, getNextMilestoneProgress } from "@/actions/smoking";
import { getUserStats } from "@/actions/user";
import { LiveTimer } from "@/components/live-timer";
import { NextMilestoneCard } from "@/components/next-milestone-card";

import { differenceInMinutes } from "date-fns";
import { formatDurationMinutes } from "@/lib/format";
import { getCurrentSurviveMessage } from "@/lib/survive";
import { SurviveSection } from "@/components/survive-section";

export default async function HomePage() {
  const [sessionData, stats, milestone] = await Promise.all([
    getActiveSessionData(),
    getUserStats(),
    getNextMilestoneProgress(),
  ]);

  // Calculate elapsed time in minutes for the current session
  const elapsedMinutes = sessionData?.startedAt
    ? differenceInMinutes(new Date(), new Date(sessionData.startedAt))
    : 0;

  // Active target minutes (falls back to default target preference)
  const target = sessionData?.targetMinutes ?? stats.defaultGapTargetMinutes;

  // Compute metrics required by the Survive Message builder
  const progressPercent = target > 0 ? Math.min(100, Math.floor((elapsedMinutes / target) * 100)) : 0;
  const remainingMinutes = Math.max(0, target - elapsedMinutes);
  const extraMinutes = elapsedMinutes - target;
  const blockMinutes = target * 0.25;
  const completedBlocks = extraMinutes > 0 && blockMinutes > 0 ? Math.floor(extraMinutes / blockMinutes) : 0;
  const recordRemaining = Math.max(0, stats.longestGapMinutes - elapsedMinutes);

  // Fetch the contextual dynamic Survive Message for the current hour
  const surviveEntry = getCurrentSurviveMessage({
    currentGap: formatDurationMinutes(elapsedMinutes),
    progressPercent,
    remainingMinutes,
    completedBlocks,
    recordRemaining,
    suggestedDelay: 15,
  });

  return (
    <div className="flex flex-col min-h-screen px-6 py-6 pb-24 md:max-w-md md:mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand" />
          <span className="text-xl">Delay</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-light/10 rounded-full border border-brand-light/20">
          <Trophy className="w-3.5 h-3.5 text-brand-light" />
          <span className="text-brand-light text-xs font-medium tracking-wider">
            {stats.longestGap}
          </span>
        </div>
      </header>

      {/* Live-Ticking Timer + Challenge Stack + Circular Progress */}
      <LiveTimer
        startedAt={sessionData?.startedAt ?? null}
        targetMinutes={sessionData?.targetMinutes ?? stats.defaultGapTargetMinutes}
        totalCigarettesLogged={stats.totalCigarettesLogged}
        initialElapsedMs={
          sessionData?.startedAt
            ? Date.now() - new Date(sessionData.startedAt).getTime()
            : 0
        }
      />

      {/* Stats Cards */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card/40 border border-border/40 rounded-2xl p-5 flex flex-col">
          <Wind className="w-5 h-5 text-brand mb-4" />
          <span className="text-2xl mb-1">{stats.oxygenLevel}%</span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Oxygen Level
          </span>
        </div>
        <div className="bg-card/40 border border-border/40 rounded-2xl p-5 flex flex-col">
          <Wallet className="w-5 h-5 text-brand mb-4" />
          <span className="text-2xl mb-1">
            {stats.currencySymbol}{stats.totalSaved}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Total Saved
          </span>
        </div>
      </section>

      {/* Next Milestone — dynamic */}
      <div className="flex items-center justify-between mb-3 ml-2">
        <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          Next Milestone
        </h3>
        <Link
          href="/health"
          className="text-[10px] uppercase tracking-widest text-brand-light font-medium hover:underline flex items-center gap-1"
        >
          View All &rarr;
        </Link>
      </div>
      <NextMilestoneCard
        label={milestone.label}
        progressPercent={milestone.progressPercent}
      />

      {/* Survive Section */}
      <SurviveSection entry={surviveEntry} />

      {/* I Smoked Button */}
      <ConfirmSmokeButton isFirst={stats.totalCigarettesLogged === 0} />
    </div>
  );
}

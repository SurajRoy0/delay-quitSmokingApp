import { Flame, Wind, Wallet } from "lucide-react";
import { ConfirmSmokeButton } from "./confirm-button";
import { getActiveSessionData, getNextMilestoneProgress } from "@/actions/smoking";
import { getUserStats } from "@/actions/user";
import { LiveTimer } from "@/components/live-timer";
import { NextMilestoneCard } from "@/components/next-milestone-card";

export default async function HomePage() {
  const [sessionData, stats, milestone] = await Promise.all([
    getActiveSessionData(),
    getUserStats(),
    getNextMilestoneProgress(),
  ]);

  return (
    <div className="flex flex-col min-h-screen px-6 py-6 pb-24 md:max-w-md md:mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand" />
          <span className="text-xl">Delay</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-light/10 rounded-full border border-brand-light/20">
          <span className="text-brand-light text-xs font-medium tracking-wider">
            🏆 {stats.longestGap}
          </span>
        </div>
      </header>

      {/* Live-Ticking Timer + Challenge Stack + Circular Progress */}
      <LiveTimer
        startedAt={sessionData?.startedAt ?? null}
        targetMinutes={sessionData?.targetMinutes ?? 240}
        totalCigarettesLogged={stats.totalCigarettesLogged}
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
      <NextMilestoneCard
        label={milestone.label}
        progressPercent={milestone.progressPercent}
      />

      {/* Evening Reflection */}
      <section className="relative h-40 bg-card rounded-2xl overflow-hidden mb-6 flex flex-col justify-end p-5 border border-border/40">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
        <div className="absolute inset-0 bg-muted z-0 opacity-50" />
        <div className="relative z-20">
          <h3 className="text-lg text-white mb-2">Evening Reflection</h3>
          <p className="text-[10px] text-white/80 mb-3 max-w-[200px]">
            Your lung capacity is significantly improving during rest. Breathe
            deeply tonight.
          </p>
          <button className="text-[10px] uppercase tracking-wider text-brand-light font-medium flex items-center gap-1">
            Read More <span className="text-lg leading-none">&rarr;</span>
          </button>
        </div>
      </section>

      {/* I Smoked Button */}
      <ConfirmSmokeButton isFirst={stats.totalCigarettesLogged === 0} />
    </div>
  );
}

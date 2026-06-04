"use client";

import { useEffect, useState } from "react";
import { CircularProgress } from "@/components/circular-progress";
import { CheckCircle2 } from "lucide-react";
import { formatDurationMs } from "@/lib/format";
import { EditTargetModal } from "@/app/(app)/home/edit-target-modal";

interface LiveTimerProps {
  startedAt: string | null; // ISO string
  targetMinutes: number;
  totalCigarettesLogged?: number;
  initialElapsedMs: number;
}

function getElapsed(startedAt: string | null): number {
  if (!startedAt) return 0;
  return Math.max(0, Date.now() - new Date(startedAt).getTime());
}

export function LiveTimer({
  startedAt,
  targetMinutes,
  totalCigarettesLogged,
  initialElapsedMs,
}: LiveTimerProps) {
  const [elapsedMs, setElapsedMs] = useState(initialElapsedMs);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!startedAt) return;
    setElapsedMs(getElapsed(startedAt));
    const id = setInterval(() => {
      setElapsedMs(getElapsed(startedAt));
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  if (!startedAt) {
    const isFirstTime = totalCigarettesLogged === 0;
    return (
      <>
        {/* Timer */}
        <section className="flex flex-col items-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Smoke-free for
          </span>
          <h1 className="text-4xl text-brand-light tracking-tight mb-4 animate-pulse">00h 00m 00s</h1>
          <p className="text-xs text-muted-foreground text-center max-w-[280px]">
            {isFirstTime ? (
              <span className="text-brand font-semibold block mb-1">Welcome! Ready to start? 🚀</span>
            ) : null}
            {isFirstTime 
              ? "Press the button below when you smoke your next cigarette (or your last one) to start your first delay session!" 
              : 'Press "I Smoked" to start tracking your first gap.'}
          </p>
        </section>

        {/* Empty progress / First-smoke onboarding card */}
        <section className="flex flex-col items-center mb-10 relative w-full">
          {isFirstTime ? (
            <div className="w-full bg-gradient-to-br from-brand/10 via-brand-dark/5 to-card border border-brand/20 rounded-[2rem] p-6 text-center shadow-lg backdrop-blur-md relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full filter blur-xl -mr-6 -mt-6"></div>
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center mb-4 border border-brand/30 animate-bounce">
                <span className="text-xl">🚀</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">First Step: Log to Start</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mb-4">
                Delay uses a Smoke-Free timer to track the interval between your cigarettes. To start tracking your progress, let us know when you last smoked.
              </p>
              <div className="flex flex-col gap-1 items-center">
                <span className="text-[10px] text-brand uppercase tracking-widest font-semibold">Your Target Goal</span>
                <span className="text-xl font-bold text-foreground">
                  {targetMinutes >= 60 ? `${Math.floor(targetMinutes / 60)}h` : `${targetMinutes}m`}
                </span>
              </div>
            </div>
          ) : (
            <CircularProgress value={0} max={100} size={220} strokeWidth={8}>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">No Goal</span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                  START A SESSION
                </span>
              </div>
            </CircularProgress>
          )}
        </section>
      </>
    );
  }

  const elapsedMinutes = elapsedMs / (1000 * 60);
  const targetMs = targetMinutes * 60 * 1000;

  // Calculate current goal and progress
  let goalLabel: string;
  let goalSub: string;
  let progressValue: number;
  const challenges: { id: string; label: string }[] = [];

  if (elapsedMinutes < targetMinutes) {
    // Still working on main goal
    const remainingMs = targetMs - elapsedMs;
    progressValue = (elapsedMinutes / targetMinutes) * 100;
    const h = Math.floor(remainingMs / (1000 * 60 * 60));
    const m = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    goalLabel = `${h > 0 ? h + "h " : ""}${m}m`;
    goalSub = "CURRENT GOAL";
  } else {
    // Progressive mode
    const progressiveBlockMinutes = targetMinutes * 0.25;
    const extraMinutes = elapsedMinutes - targetMinutes;
    const completedBlocks = Math.floor(extraMinutes / progressiveBlockMinutes);
    const blockElapsed = extraMinutes - completedBlocks * progressiveBlockMinutes;
    const remainingMinutes = progressiveBlockMinutes - blockElapsed;
    progressValue = (blockElapsed / progressiveBlockMinutes) * 100;

    const h = Math.floor(remainingMinutes / 60);
    const m = Math.floor(remainingMinutes % 60);
    goalLabel = `${h > 0 ? h + "h " : ""}${m}m`;
    goalSub = "PROGRESSIVE MODE";

    // Build challenge stack
    const mainH = Math.floor(targetMinutes / 60);
    const mainM = targetMinutes % 60;
    const mainLabel = `${mainH > 0 ? mainH + "H" : ""}${mainM > 0 ? mainM + "M" : ""} GOAL`;
    challenges.push({ id: "main", label: mainLabel });

    const blockH = Math.floor(progressiveBlockMinutes / 60);
    const blockM = progressiveBlockMinutes % 60;
    const blockLabel = `${blockH > 0 ? blockH + "H" : ""}${blockM > 0 ? blockM + "M" : ""} GOAL`;
    for (let i = 0; i < completedBlocks; i++) {
      challenges.push({ id: `block-${i}`, label: blockLabel });
    }
  }

  return (
    <>
      {/* Smoke-Free Timer */}
      <section className="flex flex-col items-center mb-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Smoke-free for
        </span>
        <h1 className="text-4xl text-brand-light tracking-tight mb-4 tabular-nums">
          {formatDurationMs(elapsedMs)}
        </h1>
        <p className="text-xs text-muted-foreground text-center max-w-[200px]">
          The urge is a cloud. Watch it drift.
        </p>
      </section>

      {/* Completed Challenges Stack */}
      {challenges.length > 0 && (
        <section className="flex flex-wrap justify-center gap-2 mb-6">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-card/50 rounded-full border border-border/50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
              <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
                {c.label}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Circular Progress */}
      <section className="flex flex-col items-center mb-10 relative">
        <CircularProgress value={progressValue} max={100} size={220} strokeWidth={8}>
          <button
            onClick={() => setEditOpen(true)}
            className="flex flex-col items-center group focus:outline-none cursor-pointer"
          >
            <span className="text-3xl font-bold tracking-tight mb-0.5 flex items-center gap-1.5 group-hover:text-brand transition-colors pl-3">
              {goalLabel}
              <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">✏️</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-medium group-hover:text-brand-light transition-colors">
              {goalSub}
            </span>
          </button>
        </CircularProgress>
      </section>

      <EditTargetModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        currentTargetMinutes={targetMinutes}
      />
    </>
  );
}

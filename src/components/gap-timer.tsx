"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GapTimerProps {
  lastSmokeAt: Date | null;
  targetMinutes: number;
}

function getElapsedSeconds(lastSmokeAt: Date | null): number {
  if (!lastSmokeAt) return 0;
  return Math.floor((Date.now() - new Date(lastSmokeAt).getTime()) / 1000);
}

function formatDuration(totalSeconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return {
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    seconds: String(s).padStart(2, "0"),
  };
}

export function GapTimer({ lastSmokeAt, targetMinutes }: GapTimerProps) {
  const [elapsed, setElapsed] = useState(() => getElapsedSeconds(lastSmokeAt));

  useEffect(() => {
    if (!lastSmokeAt) return;
    const id = setInterval(() => {
      setElapsed(getElapsedSeconds(lastSmokeAt));
    }, 1000);
    return () => clearInterval(id);
  }, [lastSmokeAt]);

  const targetSeconds = targetMinutes * 60;
  const progress = Math.min(elapsed / targetSeconds, 1);
  const beaten = elapsed >= targetSeconds;

  const { hours, minutes, seconds } = formatDuration(elapsed);

  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - progress);

  if (!lastSmokeAt) {
    return (
      <div className="flex flex-col items-center py-4">
        <p className="text-muted-foreground text-sm font-medium">
          Log your first smoke to start tracking your gap.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Circular progress */}
      <div className="relative w-[120px] h-[120px] mb-4 drop-shadow-sm">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-black/5 dark:text-white/10"
          />
          {/* Progress arc */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={beaten ? "#34C759" : "var(--color-ember-1)"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "text-3xl font-bold tracking-tighter leading-none mb-1",
              beaten
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-foreground"
            )}
          >
            {hours}:{minutes}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
            {seconds}s
          </span>
        </div>
      </div>

      {beaten ? (
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">
          Goal beaten! 🎉 Keep going.
        </p>
      ) : (
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Target:{" "}
          <span className="text-foreground">
            {targetMinutes >= 60
              ? `${targetMinutes / 60}h`
              : `${targetMinutes}m`}
          </span>
        </p>
      )}
    </div>
  );
}

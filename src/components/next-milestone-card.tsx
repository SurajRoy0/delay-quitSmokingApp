"use client";

import { Wind, Lock, CheckCircle2 } from "lucide-react";

interface NextMilestoneCardProps {
  label: string;
  progressPercent: number;
}

export function NextMilestoneCard({ label, progressPercent }: NextMilestoneCardProps) {
  const isComplete = progressPercent >= 100;

  return (
    <section className="bg-card/40 border border-border/40 rounded-2xl p-5 mb-6 relative overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-5 scale-150 transform translate-x-4 translate-y-4">
        <Wind className="w-32 h-32" />
      </div>
      <div className="relative z-10 flex justify-end items-start mb-2">
        {isComplete ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
        ) : (
          <Lock className="w-3 h-3 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-xl text-foreground mb-4 relative z-10">{label}</h3>
      <div className="w-full bg-muted/50 h-1.5 rounded-full relative z-10 overflow-hidden">
        <div
          className="bg-brand h-1.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {progressPercent > 0 && !isComplete && (
        <span className="text-[9px] text-muted-foreground mt-2 block relative z-10">
          {progressPercent}% complete
        </span>
      )}
    </section>
  );
}

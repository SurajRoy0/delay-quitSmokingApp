"use client";

import Link from "next/link";
import { Flame, Trophy, ChevronRight, BookOpen, Clock } from "lucide-react";
import { useUserStats } from "@/hooks/use-smoking";
import { TIPS } from "@/lib/tips";

export default function TipsPage() {
  const { data: stats } = useUserStats();

  if (!stats) {
    return (
      <div className="flex flex-col min-h-screen px-6 py-6 pb-24 md:max-w-md md:mx-auto animate-pulse">
        <div className="h-10 bg-card rounded mb-8 w-full" />
        <div className="h-20 bg-card rounded-2xl mb-10 w-full" />
        <div className="h-40 bg-card rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-6 pb-24 md:max-w-md md:mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
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

      {/* Page Title */}
      <section className="mb-8">
        <h1 className="text-3xl mb-3">Survival Guide</h1>
        <p className="text-muted-foreground text-sm leading-relaxed pr-4">
          Tactical advice, behavioral science, and mental triggers to help you delay smoking longer.
        </p>
      </section>

      {/* Tips List */}
      <div className="flex flex-col gap-4">
        {TIPS.map((tip) => (
          <Link
            key={tip.id}
            href={`/tips/${tip.id}`}
            className="group relative bg-card/40 border border-border/40 hover:border-brand-light/30 rounded-2xl overflow-hidden flex gap-4 p-4 transition-all hover:bg-card/60 active:scale-[0.99]"
          >
            {/* Thumbnail Image */}
            {tip.image && (
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted relative">
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            {/* Description Info */}
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] uppercase tracking-wider bg-brand-light/10 text-brand-light px-2 py-0.5 rounded-full font-semibold">
                    {tip.category}
                  </span>
                  <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {tip.readTime}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground/90 leading-snug line-clamp-2 group-hover:text-brand-light transition-colors">
                  {tip.title}
                </h3>
              </div>
              
              <div className="text-[10px] text-brand-light font-medium flex items-center gap-1 mt-2">
                Read Article <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SurviveMessage {
  id: string;
  image: string;
  title: string;
  message: string;
  tip: string;
}

interface SurviveSectionProps {
  entry: SurviveMessage;
}

export function SurviveSection({ entry }: SurviveSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="relative h-40 bg-card rounded-2xl overflow-hidden mb-6 flex flex-col justify-end p-5 border border-border/40 group">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20 z-10 transition-opacity duration-300" />
        
        {/* Background Image */}
        {entry.image && (
          <img
            src={entry.image}
            alt={entry.title}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Content */}
        <div className="relative z-20">
          <h3 className="text-lg text-white font-medium mb-1 tracking-tight">
            {entry.title}
          </h3>
          <p className="text-[10px] text-white/80 mb-3 max-w-[280px] leading-relaxed line-clamp-2">
            {entry.message}
          </p>
          <button
            onClick={() => setOpen(true)}
            className="text-[10px] uppercase tracking-wider text-brand-light font-semibold flex items-center gap-1.5 active:scale-95 transition-all hover:text-brand-light/80"
          >
            Read More <span className="text-xs transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </button>
        </div>
      </section>

      {/* Dynamic survive modal details */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border/50 shadow-2xl p-0 overflow-hidden rounded-[2rem] gap-0">
          {/* Header Image overlay */}
          {entry.image && (
            <div className="relative h-48 w-full shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent z-10" />
              <img
                src={entry.image}
                alt={entry.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-5">
            <DialogHeader className="text-left space-y-1">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {entry.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-foreground/90 leading-relaxed">
                {entry.message}
              </p>

              {entry.tip && (
                <div className="p-4 rounded-2xl bg-brand-light/10 border border-brand-light/25 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h4 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span>💡</span> Survival Tip
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {entry.tip}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="pt-3">
              <Button
                onClick={() => setOpen(false)}
                className="w-full rounded-full h-12 bg-brand hover:bg-brand-dark text-white font-semibold shadow-md transition-all active:scale-95"
              >
                GOT IT
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

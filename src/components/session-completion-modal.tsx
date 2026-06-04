"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trophy, Clock } from "lucide-react";

interface SessionSummary {
  totalSmokeFreeTime: string;
  gapMinutes: number;
  targetMinutes: number;
  status: string;
  longestGapEver: number;
}

interface SessionCompletionModalProps {
  open: boolean;
  onClose: () => void;
  summary: SessionSummary | null;
}

function formatMinutes(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function SessionCompletionModal({
  open,
  onClose,
  summary,
}: SessionCompletionModalProps) {
  if (!summary) return null;

  const completedChallenges: string[] = [];
  if (summary.gapMinutes >= summary.targetMinutes) {
    completedChallenges.push(formatMinutes(summary.targetMinutes) + " Goal");
    const blockMinutes = summary.targetMinutes * 0.25;
    const extra = summary.gapMinutes - summary.targetMinutes;
    const blocks = Math.floor(extra / blockMinutes);
    for (let i = 0; i < blocks; i++) {
      completedChallenges.push(formatMinutes(blockMinutes) + " Block");
    }
  }

  const hours = Math.floor(summary.gapMinutes / 60);
  const mins = summary.gapMinutes % 60;
  const friendlyTime =
    hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : `${mins} minutes`;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md bg-card border-border/50 flex flex-col items-center text-center"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col items-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-brand-light/20 flex items-center justify-center mb-2">
            <Trophy className="w-7 h-7 text-brand-light" />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tight font-sans">
            Session Completed
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm font-sans max-w-sm">
            Great job. You delayed smoking for {friendlyTime}. Every delay
            matters. Let&apos;s try to beat this next time.
          </DialogDescription>
        </DialogHeader>

        {/* Stats */}
        <div className="w-full mt-4 space-y-4">
          {/* Smoke free time */}
          <div className="bg-muted/30 rounded-2xl p-4 flex items-center gap-4">
            <Clock className="w-5 h-5 text-brand shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Total Smoke-Free Time
              </span>
              <span className="text-lg font-medium">
                {summary.totalSmokeFreeTime}
              </span>
            </div>
          </div>

          {/* Completed challenges */}
          {completedChallenges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {completedChallenges.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-light/10 rounded-full border border-brand-light/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                  <span className="text-[10px] font-medium tracking-wider uppercase text-brand-light">
                    {c}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Longest gap ever */}
          <div className="bg-muted/30 rounded-2xl p-4 flex items-center gap-4">
            <Trophy className="w-5 h-5 text-brand-light shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Longest Gap Ever
              </span>
              <span className="text-lg font-medium">
                {formatMinutes(summary.longestGapEver)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="w-full mt-6">
          <Button
            className="w-full bg-brand hover:bg-brand-dark text-white font-medium rounded-full py-6 transition-colors"
            onClick={onClose}
          >
            START NEW SESSION
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

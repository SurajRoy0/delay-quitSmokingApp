"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Cigarette } from "lucide-react";
import { toast } from "sonner";
import { ButtonLoader } from "@/components/button-loader";

interface ConfirmSmokeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reasons: string[], price?: number) => Promise<void>;
  isFirst?: boolean;
  defaultPrice?: number;
  currencySymbol?: string;
}

const REASONS = [
  { value: "STRESS", label: "Stress", emoji: "😰" },
  { value: "WORK", label: "Work", emoji: "💼" },
  { value: "THINKING", label: "Thinking", emoji: "🤔" },
  { value: "BOREDOM", label: "Boredom", emoji: "😐" },
  { value: "SOCIAL", label: "Social", emoji: "🍻" },
  { value: "HABIT", label: "Habit", emoji: "🔄" },
  { value: "OTHER", label: "Other", emoji: "💭" },
] as const;

export function ConfirmSmokeModal({
  open,
  onOpenChange,
  onConfirm,
  isFirst,
  defaultPrice,
  currencySymbol = "₹",
}: ConfirmSmokeModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [priceStr, setPriceStr] = useState<string>("");

  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (selectedReasons.length === 0) {
      toast.error("Please tell us what triggered it. Select at least one reason.");
      return;
    }
    const parsedPrice = priceStr ? parseFloat(priceStr) : defaultPrice;

    setIsPending(true);
    try {
      await onConfirm(selectedReasons, parsedPrice);
      onOpenChange(false);
      setSelectedReasons([]);
      setPriceStr("");
    } finally {
      setIsPending(false);
    }
  };

  const handleKeepGoing = () => {
    onOpenChange(false);
    setSelectedReasons([]);
    setPriceStr("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/50 text-center flex flex-col items-center">
        <DialogHeader className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
            <Cigarette className="w-6 h-6 text-muted-foreground" />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tight font-sans">
            {isFirst ? "Ready to start your journey?" : "Did you smoke a cigarette?"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm font-sans max-w-sm">
            {isFirst ? (
              <>
                Logging your last cigarette sets your start baseline. Once logged, your smoke-free timer will begin ticking and your first gap target will start.
                <br />
                <br />
                It is completely fine to start right now. We are here to support you.
              </>
            ) : (
              <>
                If you haven&apos;t smoked yet, try waiting a little longer. You
                have already completed several challenges and every extra minute
                counts.
                <br />
                <br />
                If you did smoke, that&apos;s completely okay. You have already made
                meaningful progress.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full mt-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-medium">
            {isFirst ? "Any specific mood right now? (Optional)" : "What triggered it? (Select all that apply)"}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {REASONS.map((r) => {
              const isSelected = selectedReasons.includes(r.value);
              return (
                <button
                  key={r.value}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedReasons(selectedReasons.filter(v => v !== r.value));
                    } else {
                      setSelectedReasons([...selectedReasons, r.value]);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-medium transition-all",
                    isSelected
                      ? "bg-brand/10 border-brand/30 text-brand"
                      : "bg-muted/30 border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
                  <span>{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full mt-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-medium">
            Price for this cigarette (Optional)
          </p>
          <div className="relative flex items-center justify-center max-w-xs mx-auto">
            <span className="absolute left-3 text-muted-foreground">{currencySymbol}</span>
            <Input
              type="number"
              placeholder={`Default: ${defaultPrice || 20}`}
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              className="pl-8 text-center"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-3 w-full mt-6">
          <Button
            className="w-full bg-brand hover:bg-brand-dark text-white font-medium rounded-full py-6 transition-colors"
            onClick={handleKeepGoing}
          >
            {isFirst ? "CANCEL" : "KEEP GOING"}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground font-medium rounded-full py-6 transition-colors"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? <div className="flex items-center justify-center gap-2"><ButtonLoader /> Logging...</div> : (isFirst ? "LOG CIGARETTE & START" : "I SMOKED")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

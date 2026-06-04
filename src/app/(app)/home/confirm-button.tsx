"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmSmokeModal } from "@/components/confirm-smoke-modal";
import { logSmokeEvent } from "@/actions/smoking";
import { Cigarette } from "lucide-react";

import { cn } from "@/lib/utils";

interface ConfirmSmokeButtonProps {
  isFirst?: boolean;
}

export function ConfirmSmokeButton({ isFirst }: ConfirmSmokeButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleConfirm = async (reason?: string) => {
    await logSmokeEvent(reason);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={cn(
          "w-full transition-all border rounded-2xl py-8 flex flex-col items-center justify-center gap-3",
          isFirst
            ? "bg-brand/10 hover:bg-brand/20 border-brand/50 shadow-lg shadow-brand/10 animate-pulse scale-[1.02] hover:scale-100"
            : "bg-card/40 hover:bg-card/60 border-border/40"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          isFirst ? "bg-brand/20" : "bg-brand-dark/20"
        )}>
          <Cigarette className="w-5 h-5 text-brand" />
        </div>
        <div className="flex flex-col items-center">
          <span className={cn(
            "text-lg tracking-wide font-semibold",
            isFirst && "text-brand"
          )}>
            {isFirst ? "LOG LAST CIGARETTE" : "I SMOKED"}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">
            {isFirst ? "Start your smoke-free timeline" : "Reset the ritual"}
          </span>
        </div>
      </button>

      <ConfirmSmokeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleConfirm}
        isFirst={isFirst}
      />
    </>
  );
}

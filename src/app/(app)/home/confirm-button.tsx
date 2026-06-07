"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmSmokeModal } from "@/components/confirm-smoke-modal";
import { useLogSmoke, useUserStats } from "@/hooks/use-smoking";
import { Cigarette, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ConfirmSmokeButtonProps {
  isFirst?: boolean;
}

export function ConfirmSmokeButton({ isFirst }: ConfirmSmokeButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { mutateAsync: logSmoke } = useLogSmoke();
  const { data: stats } = useUserStats();

  const handleConfirm = async (reasons: string[], price?: number) => {
    await logSmoke({ reasons, price });
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={cn(
          "w-full relative overflow-hidden transition-all duration-200 border rounded-2xl p-4 flex items-center gap-4 text-left active:scale-[0.98]",
          isFirst
            ? "bg-gradient-to-r from-brand to-brand-light border-transparent shadow-lg shadow-brand/20 animate-pulse"
            : "bg-card/80 backdrop-blur-xl border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:shadow-inner"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          isFirst 
            ? "bg-white/20 text-white shadow-inner" 
            : "bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 text-brand shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
        )}>
          <Cigarette className="w-6 h-6" />
        </div>
        
        <div className="flex flex-col flex-1">
          <span className={cn(
            "text-base tracking-wide font-bold",
            isFirst ? "text-white drop-shadow-sm" : "text-foreground"
          )}>
            {isFirst ? "LOG LAST CIGARETTE" : "I SMOKED"}
          </span>
          <span className={cn(
            "text-[10px] uppercase tracking-wider mt-0.5 font-medium",
            isFirst ? "text-white/80" : "text-muted-foreground/70"
          )}>
            {isFirst ? "Start your timeline" : "Reset the ritual"}
          </span>
        </div>

        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          isFirst ? "bg-white/20 text-white" : "bg-foreground/5 text-muted-foreground"
        )}>
          <ChevronRight className="w-5 h-5 ml-0.5" />
        </div>
      </button>

      <ConfirmSmokeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleConfirm}
        isFirst={isFirst}
        defaultPrice={stats?.cigarettePrice || 20}
        currencySymbol={stats?.currencySymbol || "₹"}
      />
    </>
  );
}

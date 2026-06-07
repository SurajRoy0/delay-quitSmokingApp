"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ButtonLoader } from "@/components/button-loader";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DurationPicker } from "@/components/duration-picker";
import { useQueryClient } from "@tanstack/react-query";

interface EditTargetModalProps {
  open: boolean;
  onClose: () => void;
  currentTargetMinutes: number;
}

export function EditTargetModal({
  open,
  onClose,
  currentTargetMinutes,
}: EditTargetModalProps) {
  const [minutes, setMinutes] = useState(currentTargetMinutes);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/smoking/session", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetMinutes: minutes }),
      });
      const result = await res.json();
      
      if (!res.ok || result.error) {
        toast.error(result.error || "Failed to update target.");
        return;
      }

      toast.success("Gap target updated!");
      queryClient.invalidateQueries({ queryKey: ["activeSession"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[2rem] bg-card border border-border shadow-lg p-6">
        <DialogHeader className="text-left space-y-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Adjust Gap Target
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Change the delay target for your current session. Future sessions will also default to this target.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <DurationPicker value={minutes} onChange={setMinutes} />
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-full h-11 border border-border/40 font-medium"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 rounded-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md transition-all active:scale-95"
          >
            {isSaving ? (
              <ButtonLoader className="mr-2" />
            ) : (
              "Update Target"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

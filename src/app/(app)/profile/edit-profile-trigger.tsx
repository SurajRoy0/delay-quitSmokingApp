"use client";

import { useState } from "react";
import { EditProfileModal } from "./edit-profile-modal";

interface EditProfileTriggerProps {
  smokingProfile: {
    dailyCigarettes: number;
    pricePerCigarette: number;
    currency: "INR" | "USD" | "EUR" | "GBP";
    defaultGapTargetMinutes: number;
  };
}

export function EditProfileTrigger({ smokingProfile }: EditProfileTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[10px] uppercase tracking-wider text-brand font-medium hover:text-brand-dark transition-colors px-2 py-1 rounded-md"
      >
        Edit Settings
      </button>

      <EditProfileModal
        open={open}
        onOpenChange={setOpen}
        initialValues={{
          dailyCigarettes: smokingProfile.dailyCigarettes,
          pricePerCigarette: smokingProfile.pricePerCigarette,
          currency: smokingProfile.currency,
          defaultGapTargetMinutes: smokingProfile.defaultGapTargetMinutes,
        }}
      />
    </>
  );
}

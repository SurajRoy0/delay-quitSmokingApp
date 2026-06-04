"use client";

import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { OnboardingDialog } from "@/components/onboarding-dialog";

interface AppShellProps {
  children: React.ReactNode;
  needsOnboarding: boolean;
}

export function AppShell({ children, needsOnboarding }: AppShellProps) {
  const [onboardingOpen, setOnboardingOpen] = useState(needsOnboarding);

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1 pb-28">
        {children}
      </main>

      <BottomNav />

      <OnboardingDialog
        open={onboardingOpen}
        onComplete={() => setOnboardingOpen(false)}
      />
    </div>
  );
}

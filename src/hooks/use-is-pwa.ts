"use client";

import { usePWA } from "@/components/pwa/pwa-provider";

/**
 * A reusable hook to check if the application is running as an installed standalone PWA.
 * @returns boolean - true if running in standalone display mode (launched from home screen), false otherwise.
 */
export function useIsPWA(): boolean {
  const { isPWA } = usePWA();
  return isPWA;
}

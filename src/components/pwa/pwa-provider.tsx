"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  trackAppOpened,
  trackPWAInstallPromptShown,
  trackPWAInstallClicked,
  trackPWAInstalled,
} from "@/lib/analytics";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAContextType {
  isPWA: boolean;
  isInstallable: boolean;
  isIOS: boolean;
  isSafari: boolean;
  installApp: () => Promise<boolean>;
}

const PWAContext = createContext<PWAContextType>({
  isPWA: false,
  isInstallable: false,
  isIOS: false,
  isSafari: false,
  installApp: async () => false,
});

export const usePWA = () => useContext(PWAContext);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Detect standalone mode
    const checkIsPWA = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsPWA(isStandalone || isIOSStandalone);
    };

    checkIsPWA();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPWA(e.matches || (window.navigator as any).standalone === true);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // 2. Detect OS & Browser
    const ua = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const safari = /^((?!chrome|android).)*safari/i.test(ua);
    setIsIOS(ios);
    setIsSafari(safari);

    // 3. Track app_opened
    const isRunningAsPWA = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    trackAppOpened(isRunningAsPWA ? "pwa" : "browser");

    // 4. Handle install prompt availability
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      trackPWAInstallPromptShown();
    };

    // 5. Handle successful installation detection
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsPWA(true);
      trackPWAInstalled();
      toast.success("Delay has been successfully installed on your device!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 6. Service Worker Registration & Update Handling
    if ("serviceWorker" in navigator) {
      // Register service worker in production and development (with safety guards in sw.js)
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service worker registered with scope:", reg.scope);

          // helper to prompt user to reload / activate the new sw
          const promptUserToReload = (worker: ServiceWorker) => {
            toast.info("A new version of the app is available.", {
              description: "Update now to load the latest improvements.",
              action: {
                label: "Update",
                onClick: () => {
                  worker.postMessage({ type: "SKIP_WAITING" });
                  navigator.serviceWorker.addEventListener("controllerchange", () => {
                    window.location.reload();
                  });
                },
              },
              duration: Infinity,
            });
          };

          // Check if there is already a waiting worker on page load
          if (reg.waiting) {
            promptUserToReload(reg.waiting);
          }

          // Monitor for future service worker updates
          reg.addEventListener("updatefound", () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.addEventListener("statechange", () => {
                if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                  promptUserToReload(installingWorker);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("[PWA] Service worker registration failed:", error);
        });
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      console.warn("[PWA] No deferred prompt available for manual install");
      return false;
    }

    trackPWAInstallClicked();
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User choice outcome: ${outcome}`);

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
      return true;
    }

    return false;
  };

  return (
    <PWAContext.Provider value={{ isPWA, isInstallable, isIOS, isSafari, installApp }}>
      {children}
    </PWAContext.Provider>
  );
}

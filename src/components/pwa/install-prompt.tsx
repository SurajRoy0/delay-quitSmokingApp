"use client";

import { usePWA } from "./pwa-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Sparkles, AlertCircle } from "lucide-react";
import { IOSInstructions } from "./ios-instructions";

export function InstallPrompt() {
  const { isPWA, isInstallable, isIOS, isSafari, installApp } = usePWA();

  // If already running in PWA mode, hide the entire installation section (per requirement 6)
  if (isPWA) {
    return null;
  }

  return (
    <Card className="bg-card/40 border-border/40 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand/10 border border-brand/20 rounded-2xl text-brand shrink-0">
            <Download className="w-6 h-6 text-brand" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              Install Delay
              <Sparkles className="w-4 h-4 text-brand-light animate-pulse" />
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get faster access from your home screen and use the app like a native app.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-border/40">
          {isIOS ? (
            <IOSInstructions />
          ) : isInstallable ? (
            <Button
              onClick={installApp}
              className="w-full bg-brand text-white hover:bg-brand/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-medium py-5 rounded-xl flex items-center justify-center gap-2"
            >
              <Download className="w-4.5 h-4.5" />
              Install App
            </Button>
          ) : (
            // Graceful fallback for unsupported browsers / environments
            <div className="flex items-start gap-2.5 p-3.5 bg-muted/30 rounded-xl border border-border/20 text-xs text-muted-foreground">
              <AlertCircle className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <div>
                {isSafari ? (
                  "PWA installation is supported in Safari. Tap the Share icon on your browser tool bar, then tap 'Add to Home Screen'."
                ) : (
                  "To install Delay as an app, please open this website in Google Chrome (for Android/Desktop) or Apple Safari (for iOS)."
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

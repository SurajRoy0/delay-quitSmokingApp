"use client";

import { WifiOff, RotateCw, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0a09] text-foreground justify-center items-center px-6">
      <div className="flex flex-col items-center max-w-sm text-center">
        {/* Branded Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <Flame className="w-10 h-10 text-brand" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <WifiOff className="w-4 h-4" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Delay is currently unable to reach the server. Some features are unavailable, but your progress is still safe. Please check your internet connection.
        </p>

        {/* Retry Action */}
        <Button
          onClick={handleRetry}
          className="w-full bg-brand text-white hover:bg-brand/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-medium py-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <RotateCw className="w-4 h-4 animate-spin-slow" />
          Try Again
        </Button>
      </div>
    </div>
  );
}

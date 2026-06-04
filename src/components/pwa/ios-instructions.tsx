"use client";

import { Share, PlusSquare, Sparkles } from "lucide-react";

export function IOSInstructions() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-light tracking-wide uppercase">
        <Sparkles className="w-3.5 h-3.5 text-brand-light" />
        iOS Installation Instructions
      </div>
      <ol className="space-y-3 text-sm text-muted-foreground">
        <li className="flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold shrink-0">
            1
          </span>
          <span className="flex items-center gap-1.5 flex-wrap">
            Tap the <span className="font-semibold text-foreground inline-flex items-center gap-1">Share <Share className="w-3.5 h-3.5 text-brand-light" /></span> icon in Safari's bottom toolbar.
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold shrink-0">
            2
          </span>
          <span className="flex items-center gap-1.5 flex-wrap">
            Scroll down the options list and tap <span className="font-semibold text-foreground inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="w-3.5 h-3.5 text-brand-light" /></span>.
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold shrink-0">
            3
          </span>
          <span className="flex items-center gap-1.5 flex-wrap">
            Tap <span className="font-semibold text-foreground">Add</span> in the top-right corner to complete installation.
          </span>
        </li>
      </ol>
    </div>
  );
}

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[120px] h-[28px] bg-muted rounded-full" />;
  }

  const options = ["dark", "light", "system"] as const;

  return (
    <div className="flex bg-muted/50 rounded-full p-0.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setTheme(opt)}
          className={cn(
            "text-[10px] uppercase tracking-wider font-medium px-3 py-1.5 rounded-full transition-all",
            theme === opt 
              ? "bg-brand text-white shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt === "system" ? "Auto" : opt}
        </button>
      ))}
    </div>
  );
}

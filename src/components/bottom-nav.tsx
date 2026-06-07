"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Heart, User, Lightbulb, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Flame },
  { href: "/health", label: "Health", icon: Heart },
  { href: "/analytics", label: "Stats", icon: Activity },
  { href: "/tips", label: "Tips", icon: Lightbulb },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-6 inset-x-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-full md:max-w-md z-40 bg-card border border-border shadow-lg rounded-full px-2"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/home" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-all duration-300",
                isActive
                  ? "text-brand"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300",
                  isActive ? "scale-110 -translate-y-1" : "scale-100"
                )}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={isActive ? 2.5 : 2}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "text-[10px] font-medium tracking-wide mt-1 transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-0 h-0 mt-0 overflow-hidden"
                  )}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

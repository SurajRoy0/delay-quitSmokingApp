"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Flame },
  { href: "/health", label: "Health", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile top header — visible only on small screens */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-16 bg-background border-b border-border shadow-sm flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-white"
              aria-hidden="true"
            >
              <path d="M12 2C12 2 7 7.5 7 12.5C7 15.538 9.239 18 12 18C14.761 18 17 15.538 17 12.5C17 11 16.5 9.5 15.5 8.5C15.5 8.5 15 10.5 13.5 11C13.5 11 14 8 12 2Z" />
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight">Delay</span>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-muted border border-border/50 flex items-center justify-center overflow-hidden active:scale-95 transition-transform">
              {session?.user.image ? (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-medium">
                  {session?.user.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
          </Link>
        </div>
      </header>

      {/* Mobile bottom nav — floating glass dock */}
      <nav
        className="md:hidden fixed bottom-6 inset-x-4 z-40 bg-card border border-border shadow-lg rounded-full px-2"
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

      {/* Desktop top header — hidden on mobile */}
      <header className="hidden md:flex fixed top-0 inset-x-0 z-40 h-16 items-center justify-between px-8 bg-background border-b border-border shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center gap-2 mr-10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-white"
                aria-hidden="true"
              >
                <path d="M12 2C12 2 7 7.5 7 12.5C7 15.538 9.239 18 12 18C14.761 18 17 15.538 17 12.5C17 11 16.5 9.5 15.5 8.5C15.5 8.5 15 10.5 13.5 11C13.5 11 14 8 12 2Z" />
              </svg>
            </div>
            <span className="font-semibold text-xl tracking-tight">
              Delay
            </span>
          </div>

          <nav className="flex items-center gap-2" aria-label="Main navigation">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== "/home" && pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/profile">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border/50">
              <span className="text-sm font-medium px-2">
                {session?.user.name?.split(" ")[0] || "Profile"}
              </span>
              <div className="w-8 h-8 rounded-full bg-muted border border-border/50 flex items-center justify-center overflow-hidden">
                {session?.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-medium">
                    {session?.user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </header>
    </>
  );
}

"use client";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLoader } from "@/components/button-loader";
import { Flame } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn.social({
      provider: "google",
      callbackURL: "/home",
      newUserCallbackURL: "/home",
    });
    // loading stays true — page will redirect
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden px-4">
      {/* Removed ambient glows */}

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-0">
        {/* App Logo */}
        <div className="mb-8 relative flex items-center justify-center">
          <div className="absolute w-[80px] h-[80px] rounded-full opacity-20 animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_180deg,var(--color-ember-1)_0%,var(--color-ember-2)_40%,var(--color-ember-3)_70%,transparent_100%)]" />
          <div className="relative w-[60px] h-[60px] rounded-full bg-gradient-to-br from-ember-1 to-ember-2 flex items-center justify-center shadow-lg shadow-ember-1/20">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-white"
              aria-hidden="true"
            >
              <path d="M12 2C12 2 7 7.5 7 12.5C7 15.538 9.239 18 12 18C14.761 18 17 15.538 17 12.5C17 11 16.5 9.5 15.5 8.5C15.5 8.5 15 10.5 13.5 11C13.5 11 14 8 12 2Z" />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold tracking-tight leading-tight text-foreground">
            Delay. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ember-1 to-ember-3">
              Don&apos;t quit.
            </span>
          </h1>
        </div>
        <p className="text-sm font-medium text-muted-foreground text-center mb-10 tracking-wide leading-relaxed">
          Every minute you wait is a victory.
          <br />
          Start small. Build streaks.
        </p>

        {/* Auth card (Solid) */}
        <Card className="w-full rounded-3xl border border-border shadow-md bg-card">
          <CardContent className="flex flex-col gap-6 pt-8 pb-8 px-7">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground text-center">
              Begin your journey
            </p>

            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-2xl border-border bg-background text-foreground hover:bg-accent hover:shadow-md active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed h-14"
              onClick={handleGoogleSignIn}
              disabled={loading}
              aria-label="Sign in with Google"
            >
              {loading ? (
                <ButtonLoader />
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 18 18"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <path
                    fill="#4285F4"
                    d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
                  />
                  <path
                    fill="#34A853"
                    d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"
                  />
                  <path
                    fill="#EA4335"
                    d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
                  />
                </svg>
              )}
              <span className="ml-3 font-semibold text-base">
                {loading ? "Signing you in…" : "Continue with Google"}
              </span>
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-muted-foreground text-xs font-medium">
              <span className="flex-1 h-px bg-border/50" />
              free forever • no credit card
              <span className="flex-1 h-px bg-border/50" />
            </div>

            {/* Stats strip */}
            <div className="flex justify-around pt-2">
              {[
                { num: "4.7×", label: "more effective" },
                { num: "64%", label: "avg reduction" },
                { num: "30d", label: "to feel change" },
              ].map(({ num, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="text-xl font-bold text-ember-1 leading-none tracking-tight">
                    {num}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase text-center w-16">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-xs font-medium text-muted-foreground text-center leading-relaxed">
          By continuing, you agree to our{" "}
          <a
            href="/terms"
            className="text-foreground underline underline-offset-4 hover:text-ember-1 transition-colors"
          >
            Terms
          </a>{" "}
          &amp;{" "}
          <a
            href="/privacy"
            className="text-foreground underline underline-offset-4 hover:text-ember-1 transition-colors"
          >
            Privacy
          </a>
          .
          <br />
          No spam. No subscriptions. Just progress.
        </p>
      </div>
    </div>
  );
}

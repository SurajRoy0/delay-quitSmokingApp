import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Removed ambient glows */}

      {/* Solid Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border bg-background shadow-sm">
        <div className="max-w-5xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ember-1 to-ember-2 flex items-center justify-center shadow-sm">
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

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <Link href="/home">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/15 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-medium">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium pr-1">Dashboard</span>
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="default" className="rounded-full shadow-sm hover:shadow-md transition-all">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 z-10 relative">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-ember-1 mr-2"></span>
            A new way to quit smoking
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Don't quit forever. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ember-1 to-ember-3">
              Delay the next one.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every minute you wait is a victory. Start small, build your streaks, 
            and naturally reduce your habit over time without the pressure of quitting cold turkey.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href={session ? "/home" : "/login"}>
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all w-full sm:w-auto">
                {session ? "Go to Dashboard" : "Start Your Journey"}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Mockup / Visual representation of glass feel */}
        <div className="mt-20 relative w-full max-w-lg mx-auto">
          <div className="aspect-[9/19] bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col p-6">
            <div className="w-20 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-8" />
            <div className="flex-1 space-y-4">
              <div className="h-24 rounded-2xl bg-muted border border-border shadow-sm" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 rounded-2xl bg-muted border border-border shadow-sm" />
                <div className="h-24 rounded-2xl bg-muted border border-border shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

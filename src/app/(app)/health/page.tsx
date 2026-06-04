import { Flame, CheckCircle2, Trophy } from "lucide-react";
import milestones from "@/lib/health-milestones.json";
import { getUserStats } from "@/actions/user";
import { getSmokeFreeMinutes } from "@/actions/smoking";

export default async function HealthPage() {
  const stats = await getUserStats();
  const currentMinutes = await getSmokeFreeMinutes();

  return (
    <div className="flex flex-col min-h-screen px-6 py-6 pb-24 md:max-w-md md:mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand" />
          <span className="text-xl">Delay</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-light/10 rounded-full border border-brand-light/20">
          <Trophy className="w-3.5 h-3.5 text-brand-light" />
          <span className="text-brand-light text-xs font-medium tracking-wider">{stats.longestGap}</span>
        </div>
      </header>

      {/* Title */}
      <section className="mb-10">
        <h1 className="text-3xl mb-3">Your Body Healing</h1>
        <p className="text-muted-foreground text-sm pr-4">
          The transformative journey of restoration starts now.
        </p>
      </section>

      {/* Timeline */}
      <section className="relative">
        <div className="absolute left-[11px] top-4 bottom-4 w-px bg-border/50" />
        
        <div className="flex flex-col gap-6">
          {milestones.map((m, idx) => {
            const isAchieved = currentMinutes >= m.minutesRequired;
            const isNext = !isAchieved && (idx === 0 || currentMinutes >= milestones[idx-1].minutesRequired);
            
            return (
              <div key={m.id} className="relative flex items-start gap-6">
                {/* Node */}
                <div className="relative z-10 mt-1.5 flex items-center justify-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isAchieved 
                      ? 'bg-brand-light text-background' 
                      : isNext 
                        ? 'border border-brand-light bg-background' 
                        : 'border border-border/50 bg-background'
                  }`}>
                    {isAchieved ? (
                      <CheckCircle2 className="w-4 h-4 text-brand-dark" />
                    ) : isNext ? (
                      <div className="w-2 h-2 rounded-full bg-brand-light" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-border/50" />
                    )}
                  </div>
                </div>

                {/* Card */}
                <div className={`flex-1 bg-card/40 border rounded-2xl p-5 ${
                  isAchieved || isNext ? 'border-brand-light/30' : 'border-border/30 opacity-60'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                      {m.timeLabel}
                    </span>
                    {isAchieved ? (
                      <span className="text-[9px] bg-brand-light/10 text-brand-light px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">
                        Achieved
                      </span>
                    ) : isNext ? (
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
                        in progress
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {m.description}
                  </p>
                  
                  {isNext && (
                    <div className="mt-4 w-full bg-muted/50 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-light h-1 rounded-full transition-all" 
                        style={{ width: `${(currentMinutes / m.minutesRequired) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

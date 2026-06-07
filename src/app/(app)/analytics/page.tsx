"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/use-smoking";
import { Activity, Wallet, Target, CalendarDays, Filter } from "lucide-react";
import { PageLoader } from "@/components/page-loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsPage() {
  const [daysFilter, setDaysFilter] = useState("30");
  const [reasonFilter, setReasonFilter] = useState("ALL");
  
  const { data: analytics, isLoading, error } = useAnalytics(parseInt(daysFilter, 10), reasonFilter);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Failed to load analytics.</p>
      </div>
    );
  }

  const chartConfig = {
    count: {
      label: "Cigarettes",
      color: "hsl(var(--primary))",
    },
    spent: {
      label: "Spent",
      color: "hsl(var(--destructive))",
    },
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-6 pb-24 md:max-w-md md:mx-auto space-y-6">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand" />
          <span className="text-xl font-semibold">Analytics</span>
        </div>
      </header>

      {/* Filters Section */}
      <div className="flex items-center gap-3 bg-card/60 p-3 rounded-2xl border border-border/40 sticky top-4 z-10 backdrop-blur-md">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0 ml-1" />
        <div className="flex-1 grid grid-cols-2 gap-2">
          <Select value={daysFilter} onValueChange={setDaysFilter}>
            <SelectTrigger className="h-9 bg-background/50 border-border/50 text-xs rounded-xl">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50 bg-card">
              <SelectItem value="7" className="text-xs rounded-lg">Last 7 Days</SelectItem>
              <SelectItem value="14" className="text-xs rounded-lg">Last 14 Days</SelectItem>
              <SelectItem value="30" className="text-xs rounded-lg">Last 30 Days</SelectItem>
              <SelectItem value="90" className="text-xs rounded-lg">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger className="h-9 bg-background/50 border-border/50 text-xs rounded-xl">
              <SelectValue placeholder="Trigger" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50 bg-card">
              <SelectItem value="ALL" className="text-xs rounded-lg">All Triggers</SelectItem>
              <SelectItem value="STRESS" className="text-xs rounded-lg">Stress</SelectItem>
              <SelectItem value="WORK" className="text-xs rounded-lg">Work</SelectItem>
              <SelectItem value="THINKING" className="text-xs rounded-lg">Thinking</SelectItem>
              <SelectItem value="BOREDOM" className="text-xs rounded-lg">Boredom</SelectItem>
              <SelectItem value="SOCIAL" className="text-xs rounded-lg">Social</SelectItem>
              <SelectItem value="HABIT" className="text-xs rounded-lg">Habit</SelectItem>
              <SelectItem value="OTHER" className="text-xs rounded-lg">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 24-Hour Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card/40 border-border/40">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Last 24h
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex flex-col gap-1">
            <span className="text-2xl font-medium">{analytics.last24h.count}</span>
            <span className="text-xs text-muted-foreground">Cigarettes</span>
          </CardContent>
        </Card>
        <Card className="bg-card/40 border-border/40">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Spent 24h
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex flex-col gap-1">
            <span className="text-2xl font-medium">{analytics.currencySymbol}{analytics.last24h.spent}</span>
            <span className="text-xs text-muted-foreground">Money Spent</span>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/40 border-border/40">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Avg Gap
            </CardTitle>
            <CardDescription className="text-xs mt-1">Average time between cigarettes in last 24h</CardDescription>
          </div>
          <Target className="w-5 h-5 text-brand/70" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <span className="text-2xl font-medium">{Math.floor(analytics.last24h.avgGapMinutes / 60)}h {analytics.last24h.avgGapMinutes % 60}m</span>
        </CardContent>
      </Card>

      {/* Historical Chart */}
      <Card className="bg-card/40 border-border/40">
        <CardHeader className="p-4 pb-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-brand" />
            Last {daysFilter} Days {reasonFilter !== "ALL" ? `(${reasonFilter.toLowerCase()})` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 pl-0">
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <BarChart data={analytics.historical} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.split(" ")[1]} // just show day
                fontSize={10}
                tickMargin={8}
                minTickGap={20}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                fontSize={10} 
                tickFormatter={(val) => `${val}`} 
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Triggers Breakdown */}
      {reasonFilter === "ALL" && (
        <Card className="bg-card/40 border-border/40">
          <CardHeader className="p-4 pb-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              Top Triggers (Last {daysFilter} Days)
            </CardTitle>
            <CardDescription className="text-xs">Your most common reasons for smoking</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {analytics.triggers30d && analytics.triggers30d.length > 0 ? (
              <div className="flex flex-col gap-5 mt-2">
                {analytics.triggers30d.map((trigger: any, index: number) => {
                  const maxCount = Math.max(...analytics.triggers30d.map((t: any) => t.count));
                  const percentage = Math.round((trigger.count / maxCount) * 100);
                  
                  const gradients = [
                    "from-brand to-brand-light",
                    "from-blue-500 to-cyan-400",
                    "from-purple-500 to-pink-500",
                    "from-emerald-500 to-teal-400",
                    "from-amber-500 to-orange-400",
                  ];
                  const gradient = gradients[index % gradients.length];

                  return (
                    <div key={trigger.name} className="flex flex-col gap-2 group cursor-default">
                      <div className="flex items-center justify-between text-xs font-semibold px-1">
                        <span className="uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          {trigger.name}
                        </span>
                        <div className="flex items-center gap-1.5 bg-background border border-border/50 px-2 py-0.5 rounded-md shadow-sm">
                          <span className="text-foreground">{trigger.count}</span>
                          <span className="text-[9px] text-muted-foreground uppercase">logged</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden border border-border/20 shadow-inner">
                        <div 
                          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground text-center py-6 border border-dashed border-border/50 rounded-xl">
                No triggers logged yet.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overall Stats */}
      <Card className="bg-card/40 border-border/40">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-medium">{analytics.overall.totalLogged}</span>
            <span className="text-xs text-muted-foreground">Total Logged</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-medium">
              {Math.floor(analytics.overall.longestGapMinutes / 60)}h {analytics.overall.longestGapMinutes % 60}m
            </span>
            <span className="text-xs text-muted-foreground">Longest Gap</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

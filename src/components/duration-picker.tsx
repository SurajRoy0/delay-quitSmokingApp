"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const rawMinuteOptions = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

interface DurationPickerProps {
  value: number; // total minutes
  onChange: (minutes: number) => void;
  className?: string;
  minMinutes?: number; // defaults to 1
}

export function DurationPicker({
  value,
  onChange,
  className,
  minMinutes = rawMinuteOptions[0],
}: DurationPickerProps) {
  // Derive hours and minutes from total minutes
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  // Generate Hour options: 0 to 72 hours
  const hourOptions = Array.from({ length: 73 }, (_, i) => ({
    label: `${i} ${i === 1 ? "hour" : "hours"}`,
    value: String(i),
  }));

  const filteredMinutes = hours === 0
    ? rawMinuteOptions.filter((m) => m >= minMinutes)
    : rawMinuteOptions;

  const minuteOptions = filteredMinutes.map((val) => ({
    label: `${val} ${val === 1 ? "minute" : "minutes"}`,
    value: String(val),
  }));

  const handleHoursChange = (hStr: string) => {
    const newHours = parseInt(hStr, 10);
    const newTotal = newHours * 60 + minutes;
    // Enforce min minutes constraint
    onChange(Math.max(minMinutes, newTotal));
  };

  const handleMinutesChange = (mStr: string) => {
    const newMinutes = parseInt(mStr, 10);
    const newTotal = hours * 60 + newMinutes;
    // Enforce min minutes constraint
    onChange(Math.max(minMinutes, newTotal));
  };

  return (
    <div className={cn("flex items-center gap-3 w-full", className)}>
      {/* Hours Selector */}
      <div className="flex-1 flex flex-col gap-1.5 text-left">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold pl-1">
          Hours
        </label>
        <Select value={String(hours)} onValueChange={handleHoursChange}>
          <SelectTrigger className="w-full bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 rounded-xl h-11 text-sm">
            <SelectValue placeholder="Hours" />
          </SelectTrigger>
          <SelectContent className="max-h-[220px] rounded-xl bg-popover border-border">
            {hourOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="rounded-lg"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Minutes Selector */}
      <div className="flex-1 flex flex-col gap-1.5 text-left">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold pl-1">
          Minutes
        </label>
        <Select value={String(minutes)} onValueChange={handleMinutesChange}>
          <SelectTrigger className="w-full bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 rounded-xl h-11 text-sm">
            <SelectValue placeholder="Minutes" />
          </SelectTrigger>
          <SelectContent className="max-h-[220px] rounded-xl bg-popover border-border">
            {minuteOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="rounded-lg"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

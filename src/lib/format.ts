import { intervalToDuration } from "date-fns";

/**
 * Formats duration in milliseconds to "HHh MMm SSs" format.
 */
export function formatDurationMs(ms: number): string {
  const { hours = 0, minutes = 0, seconds = 0 } = intervalToDuration({ start: 0, end: ms });
  return `${hours.toString().padStart(2, "0")}h ${minutes
    .toString()
    .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
}

/**
 * Formats duration in minutes to "Hh Mm" or "Mm" or "Hh" format.
 */
export function formatDurationMinutes(minutes: number): string {
  const { hours = 0, minutes: mins = 0 } = intervalToDuration({
    start: 0,
    end: minutes * 60 * 1000,
  });
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

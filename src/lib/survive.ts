import { getHours } from "date-fns";

export const SURVIVE_MESSAGES = [
  {
    id: "early_morning",
    startHour: 5,
    endHour: 7,
    image: "/survive/screen_1.png",
    title: "Start The Day On Your Terms",
    message:
      "You've already stayed smoke-free for {{currentGap}}. Try delaying your first cigarette by {{suggestedDelay}} more minutes.",
    tip:
      "The first cigarette of the day often feels the most important, but delaying it even slightly can significantly reduce nicotine dependence over time."
  },

  {
    id: "morning_focus",
    startHour: 7,
    endHour: 9,
    image: "/survive/screen_2.png",
    title: "Build Momentum First",
    message:
      "Before smoking, try completing one small task. You're currently {{progressPercent}}% through today's target.",
    tip:
      "Cravings are often linked to routine rather than nicotine. Breaking the routine weakens the habit."
  },

  {
    id: "deep_work",
    startHour: 9,
    endHour: 11,
    image: "/survive/screen_3.png",
    title: "Focus Creates Distance",
    message:
      "You have already stayed smoke-free for {{currentGap}}. Protect that progress while working.",
    tip:
      "Many smokers associate thinking with smoking. In reality, the brain is seeking stimulation, not nicotine itself."
  },

  {
    id: "pre_lunch",
    startHour: 11,
    endHour: 13,
    image: "/survive/screen_4.png",
    title: "You're Closer Than You Think",
    message:
      "Only {{remainingMinutes}} minutes remain before today's target gap is reached.",
    tip:
      "The strongest cravings often occur right before a goal is achieved. This is exactly when waiting matters most."
  },

  {
    id: "after_lunch",
    startHour: 13,
    endHour: 15,
    image: "/survive/screen_5.png",
    title: "A Common Trigger",
    message:
      "After lunch cravings are normal. You've already completed {{progressPercent}}% of today's challenge.",
    tip:
      "Drinking water and walking for a few minutes can reduce the intensity of post-meal cravings."
  },

  {
    id: "afternoon_dip",
    startHour: 15,
    endHour: 17,
    image: "/survive/screen_6.png",
    title: "Tired Doesn't Mean Nicotine",
    message:
      "Your current streak is {{currentGap}}. Fatigue is often mistaken for a nicotine craving.",
    tip:
      "A short walk, stretching, or hydration can provide the mental boost many people mistakenly seek through smoking."
  },

  {
    id: "work_finish",
    startHour: 17,
    endHour: 19,
    image: "/survive/screen_7.png",
    title: "Finish Strong",
    message:
      "You've completed {{completedBlocks}} challenge blocks today. See if you can add one more.",
    tip:
      "Evening cigarettes are often habit-driven rather than craving-driven."
  },

  {
    id: "evening_peak",
    startHour: 19,
    endHour: 21,
    image: "/survive/screen_8.png",
    title: "This Is The Hardest Window",
    message:
      "Most smokers consume more cigarettes during the evening. You've already stayed smoke-free for {{currentGap}}.",
    tip:
      "If you can delay smoking during the evening, you'll often achieve your longest gaps."
  },

  {
    id: "late_evening",
    startHour: 21,
    endHour: 23,
    image: "/survive/screen_9.png",
    title: "Protect Today's Progress",
    message:
      "You're only {{recordRemaining}} minutes away from beating your longest gap.",
    tip:
      "Many people regret cigarettes they smoke late at night. Very few regret waiting longer."
  },

  {
    id: "night_reflection",
    startHour: 23,
    endHour: 24,
    image: "/survive/screen_10.png",
    title: "One More Delay",
    message:
      "You completed {{completedBlocks}} challenge blocks today. Every extra minute counts.",
    tip:
      "Success isn't measured by perfection. It's measured by how much longer you waited than yesterday."
  },

  {
    id: "overnight",
    startHour: 0,
    endHour: 5,
    image: "/survive/screen_11.png",
    title: "Recovery In Progress",
    message:
      "Your body continues recovering while you sleep. Current streak: {{currentGap}}.",
    tip:
      "Many health milestones happen overnight while your smoke-free timer continues running."
  }
];



export function getCurrentSurviveMessage(params: {
  currentGap: string;
  progressPercent: number;
  remainingMinutes: number;
  completedBlocks: number;
  recordRemaining: number;
  suggestedDelay: number;
}) {
  const currentHour = getHours(new Date());

  const entry = SURVIVE_MESSAGES.find(
    item =>
      currentHour >= item.startHour &&
      currentHour < item.endHour
  );

  if (!entry) return SURVIVE_MESSAGES[0];

  return {
    ...entry,
    message: entry.message
      .replace("{{currentGap}}", params.currentGap)
      .replace(
        "{{progressPercent}}",
        String(params.progressPercent)
      )
      .replace(
        "{{remainingMinutes}}",
        String(params.remainingMinutes)
      )
      .replace(
        "{{completedBlocks}}",
        String(params.completedBlocks)
      )
      .replace(
        "{{recordRemaining}}",
        String(params.recordRemaining)
      )
      .replace(
        "{{suggestedDelay}}",
        String(params.suggestedDelay)
      )
  };
}

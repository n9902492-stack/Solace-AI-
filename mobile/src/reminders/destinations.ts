export const reminders = {
  checkIn: { title: "Mood check-in", body: "Take a moment to notice how you feel.", page: "Check-in" },
  breathe: { title: "Breathing break", body: "Make time for a quiet pause.", page: "Breathe" },
} as const;

export type Reminder = keyof typeof reminders;
export type ReminderDestination = typeof reminders[Reminder]["page"];

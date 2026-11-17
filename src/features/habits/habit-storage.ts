const storageKey = "solace-daily-habits-v1";

type DailyProgress = {
  day: string;
  completed: string[];
};

export function readDailyHabits(day: string): string[] {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return [];

  const progress = JSON.parse(saved) as DailyProgress | null;
  if (progress?.day !== day) return [];
  if (!Array.isArray(progress.completed) || !progress.completed.every(id => typeof id === "string")) {
    throw new Error("Invalid daily habit progress");
  }
  return progress.completed;
}

export function saveDailyHabits(day: string, completed: string[]) {
  localStorage.setItem(storageKey, JSON.stringify({ day, completed }));
}

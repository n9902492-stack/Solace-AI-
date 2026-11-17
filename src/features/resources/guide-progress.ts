function progressKey(guide: string) {
  return `solace-guide-progress-v1:${guide}`;
}

export function readGuideProgress(guide: string, stepCount: number): number[] {
  const saved: unknown = JSON.parse(localStorage.getItem(progressKey(guide)) ?? "[]");
  if (!Array.isArray(saved)) return [];

  return [...new Set(saved.filter(
    step => Number.isInteger(step) && step >= 0 && step < stepCount,
  ))];
}

export function saveGuideProgress(guide: string, completed: number[]) {
  localStorage.setItem(progressKey(guide), JSON.stringify(completed));
}

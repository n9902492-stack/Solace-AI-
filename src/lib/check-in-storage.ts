import { moods, type CheckIn } from "../types/check-in";

const key = "solace-check-ins-v1";

function isCheckIn(value: unknown): value is CheckIn {
  if (!value || typeof value !== "object") return false;

  const entry = value as Partial<CheckIn>;
  return typeof entry.id === "string"
    && moods.some(mood => mood === entry.mood)
    && typeof entry.note === "string"
    && typeof entry.createdAt === "string"
    && Number.isFinite(Date.parse(entry.createdAt));
}

export function readCheckIns(): CheckIn[] {
  const entries: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
  if (!Array.isArray(entries) || !entries.every(isCheckIn)) {
    throw new Error("Invalid check-in history");
  }
  return entries;
}

export function saveCheckIn(entry: CheckIn) {
  localStorage.setItem(key, JSON.stringify([entry, ...readCheckIns()]));
}

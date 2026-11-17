import type { Answer, Topic } from "./questions";

const key = "solace-guided-check-ins-v1";

export type GuidedCheckIn = {
  id: string;
  topic: Topic;
  answers: Answer[];
  createdAt: string;
};

export function readGuidedCheckIns(): GuidedCheckIn[] {
  return JSON.parse(localStorage.getItem(key) ?? "[]");
}

export function saveGuidedCheckIn(topic: Topic, answers: Answer[]) {
  const entry = { id: crypto.randomUUID(), topic, answers, createdAt: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify([entry, ...readGuidedCheckIns()]));
}

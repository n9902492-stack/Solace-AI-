export const topics = {
  mood: {
    title: "Mood vibes",
    description: "Reflect on your mood, energy, and enjoyment.",
    questions: [
      "How often did you find it hard to enjoy things you usually like?",
      "How often did you feel low or discouraged?",
      "How often did you feel short on energy?",
      "How often did everyday tasks feel harder than usual?",
    ],
    moves: ["Name one small thing that went well today.", "Take a short walk or stretch if it feels comfortable.", "Send a message to someone you trust."],
  },
  anxiety: {
    title: "Anxiety check",
    description: "Notice worry, tension, and how easy it feels to unwind.",
    questions: [
      "How often did you feel tense or on edge?",
      "How often did worries keep coming back?",
      "How often did you find it hard to relax?",
      "How often did worry make it hard to focus?",
    ],
    moves: ["Notice three things you can see around you.", "Write down one worry and one small next step.", "Take a short break from what you are doing."],
  },
} as const;

export type Topic = keyof typeof topics;
export const options = ["Not at all", "A little", "Often", "Nearly always"] as const;
export type Answer = typeof options[number];

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

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
  "self-love": {
    title: "Self-love check",
    description: "Reflect on how you speak to and care for yourself.",
    questions: [
      "How often did you speak kindly to yourself when you made a mistake?",
      "How often did you give yourself permission to rest?",
      "How often did you acknowledge something you did well?",
      "How often did you make time for something that mattered to you?",
    ],
    moves: [
      "Write one kind sentence you would say to a friend in your situation.",
      "Name one small effort you want to give yourself credit for.",
      "Set aside five minutes for something you enjoy.",
    ],
  },
} as const;

export type Topic = keyof typeof topics;
export const topicIds = Object.keys(topics) as Topic[];
export const options = ["Not at all", "A little", "Often", "Nearly always"] as const;
export type Answer = typeof options[number];

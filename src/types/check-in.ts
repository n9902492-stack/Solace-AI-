export const moods = ["Low", "Uneasy", "Okay", "Good", "Great"] as const;
export type Mood = typeof moods[number];

export type CheckIn = {
  id: string;
  mood: Mood;
  note: string;
  createdAt: string;
};

"use client";

import { useEffect, useState } from "react";
import { readDailyHabits, saveDailyHabits } from "./habit-storage";

const habits = [
  { id: "water", title: "Drink a glass of water" },
  { id: "move", title: "Take a short walk or stretch" },
  { id: "pause", title: "Take a minute to breathe" },
];

export default function DailyHabits() {
  const [completed, setCompleted] = useState<string[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    function refresh() {
      try {
        setCompleted(readDailyHabits(new Date().toDateString()));
        setError("");
      } catch {
        setCompleted(null);
        setError("Daily habits could not be loaded.");
      }
    }

    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function toggle(id: string) {
    try {
      const day = new Date().toDateString();
      const current = readDailyHabits(day);
      const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
      saveDailyHabits(day, next);
      setCompleted(next);
      setError("");
    } catch {
      setError("Your change could not be saved. Please try again.");
    }
  }

  const count = habits.filter(habit => completed?.includes(habit.id)).length;

  return (
    <>
      {error && <p role="alert">{error}</p>}
      {completed && (
        <div className="wellness-card">
          <p role="status">{count} of {habits.length} completed today</p>
          <progress aria-label="Daily habit progress" value={count} max={habits.length} />
          {habits.map(habit => (
            <label className="answer-button resourceStep" key={habit.id}>
              <input type="checkbox" checked={completed.includes(habit.id)}
                onChange={() => toggle(habit.id)} />
              {habit.title}
            </label>
          ))}
        </div>
      )}
    </>
  );
}

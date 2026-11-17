"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { moods, type Mood } from "../types/check-in";
import { saveCheckIn } from "../lib/check-in-storage";

export default function CheckInForm() {
  const router = useRouter();
  const [mood, setMood] = useState<Mood>();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mood) return;
    try {
      saveCheckIn({
        id: crypto.randomUUID(),
        mood,
        note: note.trim(),
        createdAt: new Date().toISOString(),
      });
      router.push("/history");
    } catch {
      setError("Your check-in could not be saved. Please try again.");
    }
  }

  return (
    <form onSubmit={submit}>
      <fieldset>
        <legend>Choose your mood</legend>
        <div className="choices">
          {moods.map(option => (
            <label key={option} className="choice">
              <input type="radio" name="mood" checked={mood === option}
                onChange={() => setMood(option)} />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      <label htmlFor="note">Anything on your mind? (optional)</label>
      <textarea id="note" rows={4} maxLength={500} value={note}
        onChange={event => setNote(event.target.value)} />
      <button className="button" disabled={!mood}>Save check-in</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

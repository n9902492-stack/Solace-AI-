"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readGuidedCheckIns, type GuidedCheckIn } from "../lib/guided-check-ins";

const shortcuts = [
  ["/companion", "Zen Monk", "Guided reflection"],
  ["/today", "Check-in", "Notice how you feel"],
  ["/breathe", "Breathe", "Take a short pause"],
  ["/resources", "Resources", "Explore wellness tools"],
];

function dateKey(date: Date) {
  return date.toDateString();
}

export default function Dashboard() {
  const [entries, setEntries] = useState<GuidedCheckIn[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      setEntries(readGuidedCheckIns());
    } catch {
      setError(true);
    }
  }, []);

  const cursor = new Date();
  const days = new Set(entries?.map(entry => dateKey(new Date(entry.createdAt))));
  const checkedIn = days.has(dateKey(cursor));
  if (!checkedIn) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  const xp = (entries?.length ?? 0) * 48;

  return (
    <section className="guided dashboard">
      <h1>A moment for yourself.</h1>
      {entries && (
        <div className="topic-card mood">
          <span>Self-Love Level · {streak} {streak === 1 ? "day" : "days"} streak</span>
          <h2>Level {Math.floor(xp / 100) + 1}</h2>
          <progress aria-label="Progress to next level" max={100} value={xp % 100} />
          <span>{xp % 100} / 100 XP toward next level</span>
        </div>
      )}
      {error && <p role="alert">Your check-in progress could not be loaded.</p>}
      <div className="topic-card anxiety">
        <strong>Today’s affirmation</strong>
        <p>You can begin again, as many times as it takes.</p>
      </div>
      <Link className="wellness-card dashboard-link" href="/today">
        <span>Daily check-in</span>
        <strong>{checkedIn ? "You showed up today" : "Take a moment to check in"}</strong>
      </Link>
      <h2>Quick start</h2>
      <div className="quick-start">
        {shortcuts.map(([href, title, description]) => (
          <Link key={href} href={href} className="topic-card dashboard-link">
            <strong>{title}</strong><span>{description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

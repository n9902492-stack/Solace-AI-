"use client";

import { useEffect, useState } from "react";
import { readCheckIns } from "./mood-storage";
import { readGuidedCheckIns, type GuidedCheckIn } from "./guided-storage";
import { topics } from "./questions";
import type { CheckIn } from "./mood";

export default function CheckInHistory() {
  const [history, setHistory] = useState<Array<CheckIn | GuidedCheckIn> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      setHistory([...readCheckIns(), ...readGuidedCheckIns()].sort(
        (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt),
      ));
    } catch {
      setFailed(true);
    }
  }, []);

  if (failed) return <p role="alert">Your check-ins could not be loaded.</p>;
  if (!history) return <p role="status">Loading check-ins…</p>;
  if (!history.length) return <p>Your first check-in will appear here.</p>;

  return (
    <ul className="history">
      {history.map(entry => (
        <li key={entry.id}>
          <strong>{"topic" in entry ? topics[entry.topic].title : entry.mood}</strong>
          <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time>
          {"answers" in entry ? <span>{entry.answers.length} questions answered</span> : entry.note && <p>{entry.note}</p>}
        </li>
      ))}
    </ul>
  );
}

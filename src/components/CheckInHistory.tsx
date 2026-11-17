"use client";

import { useEffect, useState } from "react";
import { readCheckIns } from "../lib/check-in-storage";
import type { CheckIn } from "../types/check-in";

export default function CheckInHistory() {
  const [history, setHistory] = useState<CheckIn[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      setHistory(readCheckIns());
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
          <strong>{entry.mood}</strong>
          <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time>
          {entry.note && <p>{entry.note}</p>}
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useEffect, useState } from "react";
import { readCheckIns } from "./mood-storage";
import { readGuidedCheckIns, type GuidedCheckIn } from "./guided-storage";
import { topicIds, topics, type Topic } from "./questions";
import type { CheckIn } from "./mood";

export default function CheckInHistory() {
  const [history, setHistory] = useState<Array<CheckIn | GuidedCheckIn> | null>(null);
  const [filter, setFilter] = useState<"all" | Topic>("all");
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

  const visible = filter === "all" ? history : history.filter(
    entry => "topic" in entry && entry.topic === filter,
  );

  return (
    <>
      <label className="history-filter">
        Filter check-ins
        <select value={filter} onChange={event => {
          const value = event.currentTarget.value;
          setFilter(topicIds.find(id => id === value) ?? "all");
        }}>
          <option value="all">All check-ins</option>
          {topicIds.map(id => <option key={id} value={id}>{topics[id].title}</option>)}
        </select>
      </label>
      {!visible.length ? <p role="status">No check-ins for this topic yet.</p> : (
        <ul className="history">
          {visible.map(entry => (
            <li key={entry.id}>
              <strong>{"topic" in entry ? topics[entry.topic].title : entry.mood}</strong>
              <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time>
              {"topic" in entry ? (
                <details>
                  <summary>View {entry.answers.length} answers</summary>
                  <dl className="history-answers">
                    {entry.answers.map((answer, index) => (
                      <div key={index}>
                        <dt>{topics[entry.topic].questions[index] ?? `Question ${index + 1}`}</dt>
                        <dd>{answer}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ) : entry.note && <p>{entry.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

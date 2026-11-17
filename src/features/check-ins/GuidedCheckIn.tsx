"use client";

import Link from "next/link";
import { useState } from "react";
import { options, topicIds, topics, type Answer, type Topic } from "./questions";
import { saveGuidedCheckIn } from "./guided-storage";

export default function GuidedCheckIn() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState("");

  function answer(option: Answer) {
    if (!topic || answers.length >= topics[topic].questions.length) return;
    const next = [...answers, option];

    if (next.length === topics[topic].questions.length) {
      try {
        saveGuidedCheckIn(topic, next);
      } catch {
        setError("Your check-in could not be saved. Please try again.");
        return;
      }
    }

    setError("");
    setAnswers(next);
  }

  if (!topic) return (
    <section className="guided">
      <h1>Check-ins</h1>
      <p>Take a moment to reflect on how you have been feeling.</p>
      {topicIds.map(id => (
        <button key={id} className={`topic-card ${id}`} onClick={() => setTopic(id)}>
          <strong>{topics[id].title}</strong>
          <span>{topics[id].description}</span>
        </button>
      ))}
    </section>
  );

  const { title, questions, moves } = topics[topic];
  const step = answers.length;
  if (step === questions.length) return (
    <section className="guided">
      <div className={`topic-card ${topic}`}><h1>Check-in saved</h1><p>{title} · {step} of {questions.length} questions</p></div>
      <div className="wellness-card">
        <h2>Your wellness moves</h2>
        <ol>{moves.map(move => <li key={move}>{move}</li>)}</ol>
      </div>
      <Link className="button" href="/history">Done</Link>
    </section>
  );

  return (
    <section className="guided">
      <button className="guided-back" onClick={() => {
        setError("");
        if (step === 0) setTopic(null);
        else setAnswers(answers.slice(0, -1));
      }}>← Back</button>
      <div className={`topic-card ${topic}`} aria-live="polite">
        <span>Question {step + 1} of {questions.length}</span>
        <progress aria-label="Check-in progress" value={step} max={questions.length} />
        <h1>Over the past 2 weeks…</h1>
        <p>{questions[step]}</p>
      </div>
      {options.map(option => (
        <button className="answer-button" key={option} onClick={() => answer(option)}>{option}</button>
      ))}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}

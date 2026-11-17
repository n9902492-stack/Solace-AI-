"use client";

import Link from "next/link";
import { useState } from "react";

const reflections = [
  ["I want to name what I’m feeling", "What word comes closest to how you feel right now?"],
  ["I need a small next step", "What is one thing you could do in the next five minutes that feels manageable?"],
  ["I want to end my day gently", "What is one thing you can give yourself permission to leave for tomorrow?"],
];

export default function Companion() {
  const [prompt, setPrompt] = useState("");
  return (
    <section className="guided">
      <Link href="/">← Home</Link>
      <h1>Zen Monk</h1>
      <p>Choose a guided reflection.</p>
      {reflections.map(([label, question]) => (
        <button key={label} className="answer-button" aria-pressed={prompt === question}
          onClick={() => setPrompt(question)}>{label}</button>
      ))}
      {prompt && <p className="wellness-card" aria-live="polite">{prompt}</p>}
    </section>
  );
}

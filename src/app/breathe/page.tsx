"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const cycleLength = 14;
const duration = cycleLength * 4;

export default function Breathe() {
  const [started, setStarted] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (started === null) return;
    const timer = window.setInterval(() => {
      const seconds = Math.min(duration, Math.floor((Date.now() - started) / 1000));
      setElapsed(seconds);
      if (seconds === duration) {
        window.clearInterval(timer);
        setStarted(null);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [started]);

  const running = started !== null;
  const completed = elapsed === duration;
  const position = elapsed % cycleLength;
  const phase = position < 4 ? "Breathe in" : position < 8 ? "Hold gently" : "Breathe out";
  const remaining = (position < 4 ? 4 : position < 8 ? 8 : 14) - position;

  return (
    <section className="guided">
      <Link href="/">← Home</Link>
      <h1>Guided breathing</h1>
      <p>4 seconds in · 4 hold · 6 out · 4 cycles. Breathe at your own pace if you prefer.</p>
      <div className="breathing-circle">
        <strong aria-live="polite">{running ? phase : completed ? "Session complete" : "Ready?"}</strong>
        {running && <span>{remaining}s · Cycle {Math.floor(elapsed / cycleLength) + 1}/4</span>}
      </div>
      <button className="button" onClick={() => {
        setElapsed(0);
        setStarted(running ? null : Date.now());
      }}>{running ? "Stop" : completed ? "Start again" : "Start"}</button>
    </section>
  );
}

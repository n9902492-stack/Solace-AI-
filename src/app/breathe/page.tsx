"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const phases = [
  { id: "inhale", label: "Breathe in", endsAt: 4 },
  { id: "hold", label: "Hold gently", endsAt: 8 },
  { id: "exhale", label: "Breathe out", endsAt: 14 },
] as const;

const cycleLength = phases[2].endsAt;
const cycles = 4;
const duration = cycleLength * cycles;

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
  const phase = phases.find(item => position < item.endsAt) ?? phases[0];
  const remaining = phase.endsAt - position;
  const cycle = Math.floor(elapsed / cycleLength) + 1;

  return (
    <section className="guided">
      <Link href="/">← Home</Link>
      <h1>Guided breathing</h1>
      <p>4 seconds in · 4 hold · 6 out · 4 cycles. Breathe at your own pace if you prefer.</p>
      <div className="breathing-circle" data-phase={running ? phase.id : "rest"}>
        <strong aria-live="polite">{running ? phase.label : completed ? "Session complete" : "Ready?"}</strong>
        {running && <span>{remaining}s · Cycle {cycle}/{cycles}</span>}
      </div>
      <progress aria-label="Breathing session progress" value={elapsed} max={duration} />
      <button className="button" onClick={() => {
        setElapsed(0);
        setStarted(running ? null : Date.now());
      }}>{running ? "Stop" : completed ? "Start again" : "Start"}</button>
    </section>
  );
}

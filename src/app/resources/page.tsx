"use client";

import Link from "next/link";
import { useState } from "react";

const guides = {
  "Mindfulness 101": ["Feel your feet resting on the floor.", "Notice one sound nearby.", "Notice the sensation of your next natural breath."],
  "Anxiety toolkit": ["Name five things you can see.", "Notice four things you can touch.", "Listen for three sounds around you.", "Name one small thing you can do next."],
  "Small steps for low days": ["Choose one familiar activity that feels manageable.", "Make a little time for it.", "Notice how you feel afterward."],
  "Sleep wind-down": ["Dim the lights.", "Set aside tomorrow’s first task on paper.", "Choose a quiet activity before bed."],
};

type Guide = keyof typeof guides;

export default function Resources() {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [done, setDone] = useState<number[]>([]);

  return (
    <section className="guided">
      {guide ? <button className="guided-back" onClick={() => setGuide(null)}>← Resources</button> : <Link href="/">← Home</Link>}
      <h1>{guide ?? "Resources"}</h1>
      {guide ? <>
        <p>{done.length} of {guides[guide].length} steps tried</p>
        <progress aria-label="Guide progress" max={guides[guide].length} value={done.length} />
        {guides[guide].map((step, index) => (
          <label className="answer-button resourceStep" key={step}>
            <input type="checkbox" checked={done.includes(index)}
              onChange={event => {
                const checked = event.currentTarget.checked;
                setDone(previous => checked ? [...previous, index] : previous.filter(item => item !== index));
              }} /> {step}
          </label>
        ))}
      </> : (Object.keys(guides) as Guide[]).map((title, index) => (
        <button key={title} className={`topic-card ${index % 2 === 0 ? "mood" : "anxiety"}`}
          onClick={() => { setDone([]); setGuide(title); }}>{title}</button>
      ))}
    </section>
  );
}

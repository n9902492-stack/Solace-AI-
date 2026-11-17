import Link from "next/link";

export default function Welcome() {
  return (
    <section>
      <h1>A moment for yourself.</h1>
      <p>Take a pause, notice how you feel, and see how your moods change over time.</p>
      <Link className="button" href="/today">Get started</Link>
    </section>
  );
}

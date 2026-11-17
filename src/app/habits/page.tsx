import Link from "next/link";
import DailyHabits from "../../features/habits/DailyHabits";

export default function HabitsPage() {
  return (
    <section className="guided">
      <Link href="/">← Home</Link>
      <h1>Daily habits</h1>
      <p>Pick a small action and check it off when you’re done.</p>
      <DailyHabits />
    </section>
  );
}

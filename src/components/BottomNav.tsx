import Link from "next/link";

export default function BottomNav() {
  return (
    <nav aria-label="Main navigation">
      <Link href="/today">Today</Link>
      <Link href="/history">History</Link>
    </nav>
  );
}

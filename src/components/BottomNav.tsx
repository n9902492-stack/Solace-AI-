"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/today", label: "Today" },
  { href: "/history", label: "History" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {links.map(({ href, label }) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

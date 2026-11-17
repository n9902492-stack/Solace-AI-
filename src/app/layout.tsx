import type { ReactNode } from "react";
import BottomNav from "../components/BottomNav";
import "./globals.css";

export const metadata = { title: "Solace AI", description: "A daily wellness companion" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header>Solace</header>
          <main>{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

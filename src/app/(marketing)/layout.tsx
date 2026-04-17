import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../marketing.css";

const marketingSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/**
 * Shared marketing shell (font + theme CSS) so `/`, `/feedback`, etc. look identical for every
 * visitor — no per-user or per-session branching here.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${marketingSans.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}
    >
      {children}
    </div>
  );
}

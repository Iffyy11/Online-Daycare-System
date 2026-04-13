import { Plus_Jakarta_Sans } from "next/font/google";
import "./marketing.css";

const marketingSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${marketingSans.className} min-h-screen bg-[var(--brand-surface)] text-slate-900 antialiased`}
    >
      {children}
    </div>
  );
}

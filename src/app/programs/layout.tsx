import { Plus_Jakarta_Sans } from "next/font/google";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import "../marketing.css";

const marketingSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${marketingSans.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}
    >
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  );
}

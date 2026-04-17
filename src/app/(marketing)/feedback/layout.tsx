import type { ReactNode } from "react";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";

export default function FeedbackChromeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </>
  );
}

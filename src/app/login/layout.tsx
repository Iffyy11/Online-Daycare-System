import { MarketingHeader } from "@/components/marketing-header";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--brand-mist)]/40 via-white to-[var(--brand-surface)] text-slate-900">
      <MarketingHeader />
      {children}
    </div>
  );
}

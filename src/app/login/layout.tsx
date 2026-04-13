import { MarketingHeader } from "@/components/marketing-header";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <MarketingHeader />
      {children}
    </div>
  );
}

import { MarketingHeader } from "@/components/marketing-header";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <MarketingHeader />
      {children}
    </div>
  );
}

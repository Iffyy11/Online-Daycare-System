import { ParentHeader } from "@/components/parent-header";

export async function ParentPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--brand-mist)]/80 via-white to-[var(--brand-surface)] text-slate-900">
      <ParentHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}

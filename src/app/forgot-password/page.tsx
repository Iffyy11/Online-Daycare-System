import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SITE_PUBLIC_EMAIL } from "@/lib/site-contact";

export const metadata = {
  title: "Forgot password | Daycare Pro",
};

export default function ForgotPasswordPage() {
  const mailto = `mailto:${SITE_PUBLIC_EMAIL}?subject=${encodeURIComponent("Password reset request")}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--brand-mist)]/80 via-white to-[var(--brand-surface)] text-slate-900">
      <header className="border-b border-violet-100 bg-white/90 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <BrandLogo className="h-9 w-9 shrink-0" />
          Daycare Pro
        </Link>
      </header>

      <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Forgot your password?</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          We don&apos;t offer automated reset yet. Send a short email from the address you used to sign up,
          and we&apos;ll help you get back in.
        </p>
        <div className="mt-6 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-slate-800">Contact the center</p>
          <p className="mt-2 text-sm text-slate-600">
            Email{" "}
            <a href={mailto} className="font-semibold text-violet-800 underline-offset-2 hover:underline">
              {SITE_PUBLIC_EMAIL}
            </a>{" "}
            with subject &quot;Password reset request&quot; and mention the email on your account.
          </p>
          <p className="mt-4 text-center text-sm text-slate-500">
            <Link href="/login" className="font-semibold text-violet-700 hover:text-violet-900">
              ← Back to log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

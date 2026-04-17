import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SITE_PUBLIC_EMAIL } from "@/lib/site-contact";

export const metadata = {
  title: "Forgot password | Daycare Pro",
};

export default function ForgotPasswordPage() {
  const mailto = `mailto:${SITE_PUBLIC_EMAIL}?subject=${encodeURIComponent("Password reset request")}&body=${encodeURIComponent(
    "Hi,\n\nPlease help me reset the password for this account email: \n\nThanks",
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--brand-mist)]/80 via-white to-[var(--brand-surface)] text-slate-900">
      <header className="border-b border-violet-100 bg-white/90 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <BrandLogo className="h-9 w-9 shrink-0" />
          Daycare Pro
        </Link>
      </header>

      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-14">
        <div className="rounded-3xl border border-violet-100 bg-white p-8 shadow-[0_20px_60px_-28px_rgba(91,33,182,0.35)] sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Reset your password</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Password reset is handled by our team. Send one email from the <strong>same address you used to sign up</strong>{" "}
            so we can verify your account.
          </p>

          <a
            href={mailto}
            className="mt-8 flex w-full items-center justify-center rounded-2xl bg-[#6d28d9] px-5 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-[#5b21b6]"
          >
            Open email draft
          </a>
          <p className="mt-3 text-center text-xs text-slate-500">
            Uses your mail app · To: {SITE_PUBLIC_EMAIL}
          </p>

          <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Include in your message</p>
            <ul className="mt-3 list-inside list-disc space-y-1 text-slate-600">
              <li>The email address on your parent account</li>
              <li>Subject line can stay &quot;Password reset request&quot;</li>
            </ul>
          </div>

          <p className="mt-8 text-center">
            <Link href="/login" className="text-sm font-semibold text-violet-700 hover:text-violet-900">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

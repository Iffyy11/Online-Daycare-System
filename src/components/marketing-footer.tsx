import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SocialLinks } from "@/components/social-links";

export function MarketingFooter() {
  return (
    <footer className="border-t border-violet-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <BrandLogo className="h-9 w-9" />
              <p className="font-bold text-slate-900">Daycare Pro</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Warm, modern care with clear communication for families — bookings, updates, and peace of
              mind in one place.
            </p>
            <p className="mt-5 text-xs text-slate-500">Full address and phone are provided to enrolled families.</p>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Follow us</p>
              <SocialLinks className="mt-3" />
            </div>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-x-10">
            <div className="flex flex-col gap-2 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Navigate</span>
              <Link href="/programs" className="text-slate-600 transition hover:text-violet-700">
                Programs
              </Link>
              <Link href="/feedback" className="text-slate-600 transition hover:text-violet-700">
                Parent feedback
              </Link>
              <Link href="/register" className="text-slate-600 transition hover:text-violet-700">
                Parent sign up
              </Link>
              <Link href="/login" className="text-slate-600 transition hover:text-violet-700">
                Log in
              </Link>
              <Link href="/dashboard" className="text-slate-600 transition hover:text-violet-700">
                Admin portal
              </Link>
              <a href="/#contact" className="text-slate-600 transition hover:text-violet-700">
                Contact
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 space-y-2 border-t border-slate-100 pt-8 text-xs text-slate-500 sm:mt-12">
          <p>
            © {new Date().getFullYear()} Daycare Pro demo. Independent project for showcasing daycare
            operations software.
          </p>
        </div>
      </div>
    </footer>
  );
}

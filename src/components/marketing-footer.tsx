import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import {
  SITE_LOCATION_FULL,
  SITE_MAILTO_HREF,
  SITE_MAPS_URL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_PUBLIC_EMAIL,
} from "@/lib/site-contact";

export function MarketingFooter() {
  return (
    <footer className="border-t border-violet-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <BrandLogo className="h-9 w-9" />
              <p className="font-bold text-slate-900">Daycare Pro</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Warm, modern care with clear communication for families — bookings, updates, and peace of
              mind in one place.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-800">Location:</span>{" "}
                <a
                  href={SITE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-700 underline-offset-2 hover:underline"
                >
                  {SITE_LOCATION_FULL}
                </a>
              </p>
              <p>
                <span className="font-medium text-slate-800">Phone:</span>{" "}
                <a href={SITE_PHONE_HREF} className="text-violet-700 underline-offset-2 hover:underline">
                  {SITE_PHONE_DISPLAY}
                </a>
              </p>
              <p>
                <span className="font-medium text-slate-800">Email:</span>{" "}
                <a href={SITE_MAILTO_HREF} className="text-violet-700 underline-offset-2 hover:underline">
                  {SITE_PUBLIC_EMAIL}
                </a>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
            <Link href="/register" className="text-slate-600 transition hover:text-violet-700">
              Parent sign up
            </Link>
            <Link href="/login" className="text-slate-600 transition hover:text-violet-700">
              Log in
            </Link>
            <Link href="/dashboard" className="text-slate-600 transition hover:text-violet-700">
              Admin portal
            </Link>
            <a href="#contact" className="text-slate-600 transition hover:text-violet-700">
              Contact
            </a>
          </div>
        </div>
        <p className="mt-12 border-t border-slate-100 pt-8 text-xs text-slate-500">
          © {new Date().getFullYear()} Daycare Pro demo. Independent project for showcasing daycare
          operations software.
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const nav = [
  { href: "/#home", label: "Home" },
  { href: "/#programs", label: "Programs" },
  { href: "/feedback", label: "Feedback" },
];

/** Same header for every visitor (logged in or not) so the marketing site stays consistent. */
export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <Link href="/#home" className="flex min-w-0 items-center gap-2.5 font-semibold text-slate-900">
          <BrandLogo className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
          <span className="truncate text-sm font-bold tracking-tight sm:text-base">Daycare Pro</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/#contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <details className="relative lg:hidden">
            <summary className="list-none cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </a>
              ))}
              <a href="/#contact" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                Contact
              </a>
            </div>
          </details>

          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:inline-block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:px-4"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

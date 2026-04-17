import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { getSession } from "@/lib/auth";
import { SITE_MAILTO_HREF } from "@/lib/site-contact";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/#home", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/#concerns", label: "Concerns" },
  { href: "/#testimonials", label: "Families" },
];

export async function MarketingHeader() {
  const session = await getSession();
  const dashboardHref =
    session?.role === "parent" ? "/parent/dashboard" : session ? "/dashboard" : "/login";
  const ctaHref = session ? dashboardHref : "/register";
  const ctaLabel = session ? "My portal" : "Sign up";

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/80 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <Link href="/#home" className="flex min-w-0 items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
          <BrandLogo className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
          <span className="truncate text-sm font-bold tracking-tight sm:text-base">Daycare Pro</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-900"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/#contact"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-900"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <details className="relative lg:hidden">
            <summary className="list-none cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50"
                >
                  {item.label}
                </a>
              ))}
              <a href="/#contact" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50">
                Contact
              </a>
            </div>
          </details>

          <a
            href={SITE_MAILTO_HREF}
            className="hidden rounded-full border border-violet-200 bg-white px-3 py-2 text-xs font-medium text-violet-900 shadow-sm transition hover:bg-violet-50 sm:inline-flex sm:text-sm"
          >
            Email
          </a>

          <Link
            href="/login"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-violet-50 sm:inline-block"
          >
            Log in
          </Link>
          <Link
            href={ctaHref}
            className="rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-900 transition hover:bg-violet-100 sm:px-4"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}

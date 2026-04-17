import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

const adminLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/bookings", label: "Bookings" },
  { href: "/children", label: "Children" },
  { href: "/chat", label: "Messages" },
  { href: "/reports", label: "Reports" },
];

function roleLabel(role: string) {
  if (role === "parent") return "Parent";
  if (role === "teacher") return "Teacher";
  return "Admin";
}

export async function AppHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"
        >
          <BrandLogo className="h-9 w-9 shrink-0" />
          <span className="hidden sm:inline">
            Daycare Pro · {session?.role === "admin" ? "Admin" : "Staff"}
          </span>
        </Link>

        <nav className="order-3 flex w-full flex-wrap items-center gap-1 sm:order-2 sm:w-auto sm:gap-0 md:gap-1">
          {adminLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="order-2 flex items-center gap-2 sm:order-3 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="hidden text-sm font-medium text-slate-500 hover:text-violet-800 dark:text-slate-400 dark:hover:text-violet-300 sm:inline"
          >
            Website
          </Link>
          {session ? (
            <>
              <span className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-900 dark:border-violet-800 dark:bg-violet-950/80 dark:text-violet-100 sm:px-3">
                {session.name}
                <span className="text-violet-400"> · </span>
                {roleLabel(session.role)}
              </span>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-[#6d28d9] px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#5b21b6] sm:px-4"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

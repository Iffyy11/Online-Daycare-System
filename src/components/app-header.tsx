import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

const adminLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/bookings", label: "Bookings" },
  { href: "/children", label: "Children" },
  { href: "/chat", label: "Messages" },
  { href: "/reports", label: "Reports" },
];

function roleLabel(role: string) {
  return role === "parent" ? "Parent" : "Admin";
}

export async function AppHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg text-white">
            S
          </span>
          <span className="hidden sm:inline">Daycare Pro · Admin</span>
        </Link>

        <nav className="order-3 flex w-full flex-wrap items-center gap-1 sm:order-2 sm:w-auto sm:gap-0 md:gap-1">
          {adminLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="order-2 flex items-center gap-2 sm:order-3 sm:gap-3">
          <Link href="/" className="hidden text-sm font-medium text-slate-500 hover:text-slate-800 sm:inline">
            Website
          </Link>
          {session ? (
            <>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 sm:px-3">
                {session.name}
                <span className="text-slate-400"> · </span>
                {roleLabel(session.role)}
              </span>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 sm:px-4"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

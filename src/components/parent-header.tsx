import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

const links = [
  { href: "/parent/dashboard", label: "Home" },
  { href: "/parent/my-children", label: "My children" },
  { href: "/parent/bookings", label: "Book care" },
  { href: "/parent/messages", label: "Messages" },
  { href: "/parent/feedback", label: "Feedback" },
];

export async function ParentHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/parent/dashboard" className="flex items-center gap-2 font-semibold text-slate-900">
          <BrandLogo className="h-9 w-9 shrink-0" />
          <span className="hidden sm:inline">Parent portal</span>
        </Link>
        <nav className="order-3 flex w-full flex-wrap gap-1 sm:order-2 sm:w-auto md:gap-1">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="order-2 flex items-center gap-2 sm:order-3">
          <Link href="/" className="hidden text-sm text-slate-500 hover:text-violet-800 sm:inline">
            Website
          </Link>
          {session ? (
            <>
              <span className="max-w-[10rem] truncate rounded-lg border border-violet-200 bg-violet-50 px-2 py-1 text-xs font-medium text-violet-900 sm:max-w-xs sm:px-3">
                {session.email}
              </span>
              <LogoutButton />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

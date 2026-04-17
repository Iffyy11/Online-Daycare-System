import Image from "next/image";
import Link from "next/link";
import { AdminBookingActions } from "@/components/admin-booking-actions";
import { AppPageShell } from "@/components/app-page-shell";
import { CreateStaffAccountForm } from "@/components/create-staff-account-form";
import { getSession } from "@/lib/auth";
import { paymentMethodLabel, paymentStatusLabel } from "@/lib/booking-labels";
import { formatVisitDateLabel } from "@/lib/nairobi-time";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

function statusPill(status: string) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-900 ring-amber-200";
    case "declined":
      return "bg-rose-50 text-rose-800 ring-rose-200";
    default:
      return "bg-slate-50 text-slate-800 ring-slate-200";
  }
}

function payPill(status: string) {
  switch (status) {
    case "paid":
      return "text-emerald-700";
    case "pending_verification":
      return "text-amber-700";
    default:
      return "text-slate-600";
  }
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  const db = await readDb();
  const pendingBookings = db.bookings.filter((b) => b.status === "pending");
  const paymentsToVerify = db.bookings.filter((b) => b.paymentStatus === "pending_verification");
  const parentAccounts = db.users.filter((u) => u.role === "parent").length;
  const occupancyRate = Math.round((db.children.length / 40) * 100);
  const approvedCount = db.bookings.filter((b) => b.status === "approved").length;
  const declinedCount = db.bookings.filter((b) => b.status === "declined").length;
  const unpaidCount = db.bookings.filter((b) => b.paymentStatus === "unpaid").length;

  const parentThreads = new Set(
    db.messages.filter((m) => m.threadParentUserId).map((m) => m.threadParentUserId),
  ).size;

  return (
    <AppPageShell>
      <section className="relative overflow-hidden rounded-2xl border border-violet-200/80 bg-slate-900 shadow-sm">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1600&q=80"
            alt="Daycare classroom"
            fill
            className="object-cover opacity-90"
            sizes="(max-width: 1152px) 100vw, 1152px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/92 via-violet-950/80 to-indigo-900/55" />
        </div>
        <div className="relative px-6 py-12 sm:px-10 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">Admin control center</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Bookings, payments, and families — one dashboard
          </h1>
          <p className="mt-4 max-w-xl text-slate-200">
            Approve requests, verify M-Pesa and other payments, and jump to rosters, messages, or reports
            in a click.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/bookings"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-900 shadow-sm hover:bg-violet-50"
            >
              All bookings
            </Link>
            <Link
              href="/children"
              className="inline-flex rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
            >
              Children &amp; progress
            </Link>
            <Link
              href="/reports"
              className="inline-flex rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
            >
              Reports
            </Link>
            <Link href="/" className="inline-flex items-center text-sm font-medium text-violet-200 underline decoration-violet-300 underline-offset-2 hover:text-white">
              Public website
            </Link>
          </div>
        </div>
      </section>

      <header className="mt-10 space-y-2 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">Overview</p>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Operations at a glance</h2>
        <p className="max-w-2xl text-slate-600">
          Parents use their own portal after signing up. Admins and teachers use staff logins to run the
          center from here.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm ring-1 ring-amber-100/80">
          <p className="text-sm font-medium text-amber-900/80">Pending approval</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{pendingBookings.length}</p>
          <p className="mt-1 text-xs text-amber-800/90">Booking requests awaiting your decision</p>
        </article>
        <article className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm ring-1 ring-violet-100/80">
          <p className="text-sm font-medium text-violet-900/80">Payments to verify</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{paymentsToVerify.length}</p>
          <p className="mt-1 text-xs text-violet-800/90">Confirm receipts &amp; references</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <p className="text-sm font-medium text-slate-500">Unpaid (cash / not yet verified)</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{unpaidCount}</p>
          <p className="mt-1 text-xs text-slate-600">Follow up from Bookings or Messages</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Children on roster</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{db.children.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Registered parents</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{parentAccounts}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Occupancy (demo cap 40)</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{occupancyRate}%</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Approved bookings</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{approvedCount}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Declined</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{declinedCount}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active message threads</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{parentThreads}</p>
          <Link href="/chat" className="mt-2 inline-block text-xs font-semibold text-violet-700 hover:underline">
            Open messages →
          </Link>
        </article>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Pending bookings</h2>
              <p className="text-sm text-slate-600">Approve or decline — updates instantly for families.</p>
            </div>
            <Link href="/bookings" className="text-sm font-semibold text-violet-700 hover:underline">
              Full table
            </Link>
          </div>
          {pendingBookings.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No pending requests. New parent bookings appear here.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pendingBookings.slice(0, 6).map((booking) => (
                <li
                  key={booking.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {booking.childName} · {formatVisitDateLabel(booking.date)}
                      </p>
                      <p className="text-sm text-slate-600">{booking.parentName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {booking.programType} · {paymentMethodLabel(booking.paymentMethod)} ·{" "}
                        <span className={payPill(booking.paymentStatus)}>
                          {paymentStatusLabel(booking.paymentStatus)}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusPill(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <AdminBookingActions
                      bookingId={booking.id}
                      status={booking.status}
                      paymentStatus={booking.paymentStatus}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Payment verification</h2>
              <p className="text-sm text-slate-600">
                Mark paid when you&apos;ve confirmed the reference, or send back to unpaid.
              </p>
            </div>
          </div>
          {paymentsToVerify.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">Nothing waiting on payment proof right now.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {paymentsToVerify.slice(0, 6).map((booking) => (
                <li
                  key={booking.id}
                  className="rounded-xl border border-violet-100 bg-violet-50/40 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.parentName}</p>
                      <p className="text-sm text-slate-700">
                        {booking.childName} · {formatVisitDateLabel(booking.date)}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {paymentMethodLabel(booking.paymentMethod)}
                        {booking.paymentReference ? ` · Ref: ${booking.paymentReference}` : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusPill(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <AdminBookingActions
                      bookingId={booking.id}
                      status={booking.status}
                      paymentStatus={booking.paymentStatus}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent bookings</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {db.bookings.slice(0, 5).map((booking) => (
              <li
                key={booking.id}
                className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3"
              >
                <p className="font-medium text-slate-900">
                  {booking.childName} · {formatVisitDateLabel(booking.date)}
                </p>
                <p className="text-slate-600">
                  {booking.parentName}
                  {booking.parentUserId ? (
                    <span className="ml-1 rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-800">
                      Linked account
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {booking.programType} · {paymentMethodLabel(booking.paymentMethod)} ·{" "}
                  {paymentStatusLabel(booking.paymentStatus)}
                </p>
                <span className="mt-2 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium capitalize text-slate-700 ring-1 ring-slate-200">
                  {booking.status}
                </span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent messages</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {db.messages.slice(-6).map((message) => (
              <li
                key={message.id}
                className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3"
              >
                <p className="font-medium text-slate-900">{message.from}</p>
                <p className="text-slate-600">{message.message}</p>
                {message.threadParentUserId ? (
                  <p className="mt-1 text-xs text-violet-600">Thread: parent {message.threadParentUserId}</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">Internal note</p>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/chat"
            className="mt-4 inline-block text-sm font-semibold text-violet-700 hover:underline"
          >
            Go to Messages
          </Link>
        </article>
      </section>

      {session?.role === "admin" ? (
        <div className="mt-10">
          <CreateStaffAccountForm />
        </div>
      ) : null}

      <section className="mt-8 rounded-2xl border border-violet-100 bg-violet-50/50 p-5 text-sm text-violet-950">
        <strong>Tip:</strong> Log child progress under <Link className="font-semibold underline" href="/children">Children</Link>{" "}
        and message a family from{" "}
        <Link className="font-semibold underline" href="/chat">Messages</Link> by selecting their parent account.
      </section>
    </AppPageShell>
  );
}

import { AdminBookingActions } from "@/components/admin-booking-actions";
import { AppPageShell } from "@/components/app-page-shell";
import { BookingForm } from "@/components/booking-form";
import { getSession } from "@/lib/auth";
import { paymentMethodLabel, paymentStatusLabel } from "@/lib/booking-labels";
import { formatVisitDateLabel } from "@/lib/nairobi-time";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

function statusStyle(status: string) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-900 ring-1 ring-amber-200";
    case "declined":
      return "bg-rose-50 text-rose-800 ring-1 ring-rose-200";
    default:
      return "bg-slate-50 text-slate-800 ring-1 ring-slate-200";
  }
}

export default async function StaffBookingsPage() {
  const session = await getSession();
  const db = await readDb();
  const bookings = db.bookings;

  return (
    <AppPageShell>
      <header className="space-y-2 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Scheduling</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          All booking requests
        </h1>
        <p className="max-w-2xl text-slate-600">
          Requests from the parent portal are tagged with a linked account. You can also enter a
          walk-in request below (no linked account). Dates and visit times follow{" "}
          <strong>Nairobi (EAT)</strong>.
        </p>
      </header>

      <div className="mt-8">
        <BookingForm key={session?.email ?? "admin"} defaultParentEmail="" defaultParentName="" />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Child</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Parent</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Portal</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Email</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Phone</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Date</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Times</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Program</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Payment</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Status</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-slate-100 bg-white">
                <td className="px-3 py-3 align-top">
                  <p className="font-medium text-slate-900">{booking.childName}</p>
                  <p className="text-xs text-slate-500">Age {booking.childAge}</p>
                  {booking.childAllergies ? (
                    <p className="mt-1 max-w-[10rem] text-xs text-slate-600">{booking.childAllergies}</p>
                  ) : null}
                </td>
                <td className="px-3 py-3 align-top text-slate-700">{booking.parentName}</td>
                <td className="px-3 py-3 align-top">
                  {booking.parentUserId ? (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                      Linked
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="max-w-[8rem] truncate px-3 py-3 align-top text-slate-600">
                  {booking.parentEmail || "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3 align-top text-slate-600">
                  {booking.parentPhone || "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3 align-top text-slate-700">
                  {formatVisitDateLabel(booking.date)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 align-top text-slate-600">
                  {booking.dropOffTime}–{booking.pickUpTime}
                </td>
                <td className="px-3 py-3 align-top text-slate-700">{booking.programType}</td>
                <td className="px-3 py-3 align-top text-xs text-slate-600">
                  <span className="font-medium text-slate-800">
                    {paymentMethodLabel(booking.paymentMethod)}
                  </span>
                  <br />
                  {paymentStatusLabel(booking.paymentStatus)}
                  {booking.paymentReference ? (
                    <span className="mt-0.5 block text-slate-500">Ref: {booking.paymentReference}</span>
                  ) : null}
                </td>
                <td className="px-3 py-3 align-top">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="min-w-[200px] px-3 py-3 align-top">
                  <AdminBookingActions
                    bookingId={booking.id}
                    status={booking.status}
                    paymentStatus={booking.paymentStatus}
                    compact
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppPageShell>
  );
}

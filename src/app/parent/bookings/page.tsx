import { getSession } from "@/lib/auth";
import { formatVisitDateLabel } from "@/lib/nairobi-time";
import { BookingForm } from "@/components/booking-form";
import { paymentMethodLabel, paymentStatusLabel } from "@/lib/booking-labels";
import { readDb } from "@/lib/db";

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

export default async function ParentBookingsPage() {
  const session = await getSession();
  const db = await readDb();
  const mine = db.bookings.filter((b) => b.parentUserId === session!.userId);

  return (
    <>
      <header className="space-y-2 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">Care requests</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Book care</h1>
        <p className="max-w-2xl text-slate-600">
          Submit a request tied to <strong>your</strong> account. Only your rows appear in the table
          below — the admin approves from the dashboard. Visit date and times use the center&apos;s
          schedule in <strong>Nairobi time (EAT)</strong>.
        </p>
      </header>

      <div className="mt-8">
        <BookingForm
          key={session!.email}
          defaultParentEmail={session!.email}
          defaultParentName={session!.name}
          successRedirectHref="/parent/dashboard"
        />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-3 py-3 font-semibold">Child</th>
              <th className="px-3 py-3 font-semibold">Date</th>
              <th className="px-3 py-3 font-semibold">Program</th>
              <th className="px-3 py-3 font-semibold">Payment</th>
              <th className="px-3 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {mine.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                  No requests yet. Submit the form above to book your first visit.
                </td>
              </tr>
            ) : (
              mine.map((b) => (
                <tr key={b.id} className="border-t border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-900">{b.childName}</td>
                  <td className="px-3 py-3 text-slate-600">
                    {formatVisitDateLabel(b.date)}
                    <br />
                    <span className="text-xs">
                      {b.dropOffTime}–{b.pickUpTime}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{b.programType}</td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {paymentMethodLabel(b.paymentMethod)}
                    <br />
                    {paymentStatusLabel(b.paymentStatus)}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusStyle(b.status)}`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

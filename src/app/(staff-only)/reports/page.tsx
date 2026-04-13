import { AppPageShell } from "@/components/app-page-shell";
import { readDb } from "@/lib/db";

export default async function StaffReportsPage() {
  const db = await readDb();
  const pendingBookings = db.bookings.filter((item) => item.status === "pending").length;
  const occupancyRate = Math.round((db.children.length / 40) * 100);
  const parentCount = db.users.filter((u) => u.role === "parent").length;

  const reportRows = [
    { label: "Attendance trend", value: `${occupancyRate}% average occupancy (demo cap 40)` },
    { label: "Booking throughput", value: `${pendingBookings} pending approvals` },
    { label: "Registered parents", value: `${parentCount} accounts` },
    { label: "Progress entries", value: `${db.progress.length} logged` },
  ];

  return (
    <AppPageShell>
      <header className="space-y-2 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Business management
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Reports</h1>
        <p className="max-w-2xl text-slate-600">
          Export includes linked parent account ids for reconciling portal bookings.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ul className="space-y-3 text-sm">
          {reportRows.map((item) => (
            <li
              key={item.label}
              className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-4"
            >
              <p className="font-semibold text-slate-900">{item.label}</p>
              <p className="mt-1 text-slate-600">{item.value}</p>
            </li>
          ))}
        </ul>
        <a
          href="/api/reports/bookings"
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Download bookings CSV
        </a>
      </section>
    </AppPageShell>
  );
}

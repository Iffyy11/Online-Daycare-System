import { AppPageShell } from "@/components/app-page-shell";
import { StaffProgressForm } from "@/components/staff-progress-form";
import { formatNairobiDateTime } from "@/lib/nairobi-time";
import { readDb } from "@/lib/db";

function parentLabel(
  users: { id: string; name: string; email: string; role: string }[],
  parentUserId: string,
) {
  if (!parentUserId) return "No parent account linked";
  const u = users.find((x) => x.id === parentUserId);
  return u ? `${u.name} (${u.email})` : parentUserId;
}

export default async function StaffChildrenPage() {
  const db = await readDb();
  const users = db.users;

  return (
    <AppPageShell>
      <header className="space-y-2 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Class management
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Children &amp; progress
        </h1>
        <p className="max-w-2xl text-slate-600">
          Full roster including parent-registered children. Log progress — it appears on the parent&apos;s
          child page.
        </p>
      </header>

      <div className="mt-8 max-w-xl">
        <StaffProgressForm childrenList={db.children.map((c) => ({ id: c.id, name: c.name }))} />
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        {db.children.map((child) => {
          const entries = db.progress.filter((p) => p.childId === child.id);
          return (
            <article
              key={child.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-1 w-12 rounded-full bg-indigo-600" />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{child.name}</h2>
              <p className="mt-1 text-sm text-slate-600">Age: {child.age}</p>
              <p className="text-sm text-slate-600">Classroom: {child.classroom}</p>
              <p className="mt-2 text-xs text-slate-500">
                Parent account: {parentLabel(users, child.parentUserId)}
              </p>
              <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                Allergies: {child.allergies ?? "None recorded"}
              </p>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Progress log
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {entries.length === 0 ? (
                    <li className="text-slate-500">No entries yet.</li>
                  ) : (
                    entries.slice(0, 6).map((e) => (
                      <li key={e.id} className="rounded-lg bg-slate-50 px-3 py-2">
                        <p className="font-medium text-slate-900">{e.title}</p>
                        <p className="text-xs text-slate-600">{e.detail}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {e.category} · {e.recordedByName} ·{" "}
                          {formatNairobiDateTime(e.recordedAt)}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </article>
          );
        })}
      </section>
    </AppPageShell>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { formatNairobiDateTime } from "@/lib/nairobi-time";
import { readDb } from "@/lib/db";

function catClass(c: string) {
  if (c === "learning") return "bg-blue-100 text-blue-900";
  if (c === "social") return "bg-amber-100 text-amber-900";
  if (c === "wellbeing") return "bg-emerald-100 text-emerald-900";
  return "bg-slate-100 text-slate-800";
}

type Props = { params: Promise<{ childId: string }> };

export default async function ParentChildDetailPage({ params }: Props) {
  const { childId } = await params;
  const session = await getSession();
  const db = await readDb();
  const child = db.children.find((c) => c.id === childId);
  if (!child || child.parentUserId !== session!.userId) {
    notFound();
  }
  const entries = db.progress
    .filter((p) => p.childId === child.id)
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

  return (
    <>
      <Link
        href="/parent/my-children"
        className="text-sm font-medium text-violet-600 hover:text-violet-800"
      >
        ← Back to my children
      </Link>
      <header className="mt-4 space-y-2 border-b border-slate-200 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{child.name}</h1>
        <p className="text-slate-600">
          Age {child.age} · {child.classroom}
        </p>
        <p className="text-sm text-slate-500">Allergies: {child.allergies ?? "None recorded"}</p>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Progress timeline</h2>
        <p className="text-sm text-slate-600">
          Updates from teachers for {child.name} — visible only to you and the center.
        </p>
        <ul className="mt-6 space-y-4 border-l-2 border-violet-200 pl-6">
          {entries.length === 0 ? (
            <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 pl-2 text-sm text-slate-600">
              No updates yet. When teachers log progress, it appears here.
            </li>
          ) : (
            entries.map((e) => (
              <li key={e.id} className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span
                  className={`absolute -left-[1.4rem] top-5 flex h-3 w-3 rounded-full border-2 border-white bg-violet-500`}
                />
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${catClass(e.category)}`}
                >
                  {e.category}
                </span>
                <h3 className="mt-2 font-semibold text-slate-900">{e.title}</h3>
                <p className="mt-1 text-slate-700">{e.detail}</p>
                <p className="mt-3 text-xs text-slate-500">
                  {e.recordedByName} · {formatNairobiDateTime(e.recordedAt)}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </>
  );
}

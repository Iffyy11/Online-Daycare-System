import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { formatNairobiDateTime } from "@/lib/nairobi-time";
import { readDb } from "@/lib/db";
import { MARKETING_OFFERINGS } from "@/lib/marketing-offerings";

export const dynamic = "force-dynamic";

function categoryStyle(cat: string) {
  switch (cat) {
    case "learning":
      return "bg-blue-50 text-blue-800";
    case "social":
      return "bg-amber-50 text-amber-900";
    case "wellbeing":
      return "bg-emerald-50 text-emerald-900";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default async function ParentDashboardPage() {
  const session = await getSession();
  const db = await readDb();
  const first = session?.name?.split(/\s+/)[0] ?? "there";

  const myChildren = db.children.filter((c) => c.parentUserId === session!.userId);
  const myBookings = db.bookings.filter((b) => b.parentUserId === session!.userId);
  const pending = myBookings.filter((b) => b.status === "pending").length;
  const childIds = new Set(myChildren.map((c) => c.id));
  const myProgress = db.progress
    .filter((p) => childIds.has(p.childId))
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
    .slice(0, 5);

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-violet-200 bg-slate-900">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative bg-gradient-to-r from-violet-950/95 to-indigo-900/90 px-6 py-10 sm:px-8">
          <p className="text-sm font-medium text-violet-200">Your family hub</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Hi {first} — here&apos;s what&apos;s happening
          </h1>
          <p className="mt-3 max-w-xl text-violet-100/90">
            This portal is unique to <strong>{session!.email}</strong>. Add your children, book care, and
            follow their progress — the center uses a separate admin dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/parent/my-children"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50"
            >
              My children ({myChildren.length})
            </Link>
            <Link
              href="/parent/bookings"
              className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Book care {pending > 0 ? `· ${pending} pending` : ""}
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Children on your account</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{myChildren.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Your booking requests</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{myBookings.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Latest updates from teachers</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{myProgress.length}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Recent progress on your children</h2>
        <p className="text-sm text-slate-600">
          Pulled from classroom logs — newest first. Open a child for the full timeline.
        </p>
        <ul className="mt-4 space-y-3">
          {myProgress.length === 0 ? (
            <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-center text-sm text-slate-600">
              No progress yet. Add a child, then your teachers can log milestones — or check back after enrollment.
            </li>
          ) : (
            myProgress.map((p) => {
              const child = myChildren.find((c) => c.id === p.childId);
              return (
                <li
                  key={p.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${categoryStyle(p.category)}`}
                    >
                      {p.category}
                    </span>
                    <p className="mt-2 font-medium text-slate-900">{p.title}</p>
                    <p className="text-sm text-slate-600">{p.detail}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {child?.name ?? "Child"} · {p.recordedByName} ·{" "}
                      {formatNairobiDateTime(p.recordedAt)}
                    </p>
                  </div>
                  {child ? (
                    <Link
                      href={`/parent/my-children/${child.id}`}
                      className="shrink-0 text-sm font-medium text-violet-600 hover:text-violet-800"
                    >
                      View child →
                    </Link>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">What we offer</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {MARKETING_OFFERINGS.map((o) => (
            <article
              key={o.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[5/3]">
                <Image src={o.img} alt="" fill className="object-cover" sizes="33vw" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{o.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{o.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

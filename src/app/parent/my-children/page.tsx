import Link from "next/link";
import { getSession } from "@/lib/auth";
import { AddChildForm } from "@/components/add-child-form";
import { readDb } from "@/lib/db";

export default async function ParentMyChildrenPage() {
  const session = await getSession();
  const db = await readDb();
  const mine = db.children.filter((c) => c.parentUserId === session!.userId);

  return (
    <>
      <header className="space-y-2 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">Your family</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">My children</h1>
        <p className="max-w-2xl text-slate-600">
          Profiles belong only to your account. When the center <strong>approves a booking</strong> you
          submitted while logged in, we add that child here automatically (or add one manually below).
          Staff assign classrooms and post progress on each child&apos;s page.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <AddChildForm />
        <div className="space-y-4">
          {mine.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              You haven&apos;t added a child yet. Use the form to create a profile — then book care and
              watch for teacher updates.
            </p>
          ) : (
            mine.map((child) => (
              <Link
                key={child.id}
                href={`/parent/my-children/${child.id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-slate-900">{child.name}</h2>
                <p className="text-sm text-slate-600">Age {child.age}</p>
                <p className="text-sm text-slate-600">Classroom: {child.classroom}</p>
                <p className="mt-2 text-sm text-slate-500">
                  Allergies: {child.allergies ?? "None recorded"}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-violet-600">
                  See progress timeline →
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { formatNairobiDateShort } from "@/lib/nairobi-time";
import { readDb } from "@/lib/db";

export const metadata = {
  title: "Parent feedback | Daycare Pro",
  description: "Notes shared by registered parents in our community.",
};

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const db = await readDb();
  const items = [...db.communityFeedback].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <main className="border-b border-slate-100 px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">Community</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Parent feedback
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Messages posted by signed-in parents from their portal. These are real voices from families
          registered with us — not sample quotes.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Have an account?{" "}
          <Link href="/parent/feedback" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            Share your own feedback
          </Link>
          .
        </p>

        {items.length === 0 ? (
          <p className="mx-auto mt-14 max-w-lg rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 px-6 py-10 text-center text-slate-600">
            No feedback yet. When parents post from the portal, it will show up here for everyone.
            <span className="mt-3 block">
              <Link href="/register" className="font-semibold text-violet-800 hover:underline">
                Register as a parent
              </Link>{" "}
              to join the community.
            </span>
          </p>
        ) : (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <li
                key={c.id}
                className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-violet-50"
              >
                <p className="flex-1 text-sm leading-relaxed text-slate-700">&ldquo;{c.content}&rdquo;</p>
                <p className="mt-5 text-xs font-semibold text-violet-900">— {c.authorName}</p>
                <p className="mt-1 text-xs text-slate-400">{formatNairobiDateShort(c.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

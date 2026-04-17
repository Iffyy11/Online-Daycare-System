import Image from "next/image";
import Link from "next/link";
import { formatNairobiDateShort } from "@/lib/nairobi-time";
import { readDb } from "@/lib/db";
import { MARKETING_OFFERINGS } from "@/lib/marketing-offerings";

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
        <section>
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">Parent feedback</h1>
          <p className="mt-1 text-sm text-slate-600">
            Messages from signed-in parents — real voices from our community, not sample quotes.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Have an account?{" "}
            <Link href="/parent/feedback" className="font-medium text-slate-900 underline-offset-2 hover:underline">
              Share your own feedback
            </Link>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">What families are saying</h2>
          <p className="text-sm text-slate-600">
            Newest first — same card layout as your parent dashboard home.
          </p>

          {items.length === 0 ? (
            <ul className="mt-4">
              <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-center text-sm text-slate-600">
                No feedback yet. When parents post from the portal, it will show up here for everyone.
                <span className="mt-2 block">
                  <Link href="/register" className="font-medium text-slate-900 hover:underline">
                    Register as a parent
                  </Link>{" "}
                  to join the community.
                </span>
              </li>
            </ul>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c, i) => (
                <article
                  key={c.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-[5/3]">
                    <Image
                      src={MARKETING_OFFERINGS[i % MARKETING_OFFERINGS.length]!.img}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900">{c.authorName}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">&ldquo;{c.content}&rdquo;</p>
                    <p className="mt-2 text-xs text-slate-400">{formatNairobiDateShort(c.createdAt)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

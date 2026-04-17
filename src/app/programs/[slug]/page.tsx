import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatKes, HOURLY_RATE_BANDS } from "@/lib/pricing";
import { PROGRAMS, getProgramBySlug } from "@/lib/programs-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = getProgramBySlug(slug);
  if (!p) return { title: "Program" };
  return { title: `${p.title} | Daycare Pro`, description: p.summary };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  return (
    <main className="px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/programs"
          className="text-sm font-medium text-slate-900 underline-offset-2 hover:underline"
        >
          ← All programs
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{program.title}</h1>
          <p className="mt-3 text-lg text-slate-600">{program.summary}</p>
          <p className="mt-4 inline-flex flex-wrap items-baseline gap-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-emerald-950">
            <span className="text-sm font-semibold">From KES {formatKes(program.priceFromKes)}</span>
            <span className="text-sm text-emerald-800/90">/ {program.priceUnitLabel}</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Bookings use time-of-day hourly rates for the hours your child is on site; packages above are
            typical anchors. Staff confirms the final fee.
          </p>
        </header>

        <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <Image
            src={program.image}
            alt={program.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {program.highlights.map((h) => (
            <li
              key={h}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-200"
            >
              {h}
            </li>
          ))}
        </ul>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
          <h2 className="text-lg font-bold text-slate-900">Hourly rates by time (KES)</h2>
          <p className="mt-2 text-sm text-slate-600">
            Peak drop-off and pick-up windows cost a bit more per hour than mid-day care. Your booking form
            shows an estimate from your drop-off and pick-up times.
          </p>
          <ul className="mt-4 divide-y divide-slate-200 text-sm">
            {HOURLY_RATE_BANDS.map((row) => (
              <li key={row.range} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="text-slate-700">{row.range}</span>
                <span className="font-semibold text-slate-900">{formatKes(row.kesPerHour)}/hr</span>
                <span className="w-full text-xs text-slate-500 sm:w-auto">{row.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 space-y-10">
          {program.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-bold text-slate-900">{s.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-800">Ready to enroll or ask a question?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Parent sign up
            </Link>
            <Link
              href="/#contact"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Contact us
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

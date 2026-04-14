import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
          className="text-sm font-semibold text-violet-700 underline-offset-2 hover:underline"
        >
          ← All programs
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{program.title}</h1>
          <p className="mt-3 text-lg text-slate-600">{program.summary}</p>
        </header>

        <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden rounded-2xl ring-1 ring-violet-100">
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
              className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-900 ring-1 ring-violet-100"
            >
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-10 space-y-10">
          {program.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-bold text-slate-900">{s.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-violet-100 bg-violet-50/50 p-6 text-center">
          <p className="text-sm font-medium text-slate-800">Ready to enroll or ask a question?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex rounded-full bg-[#6d28d9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5b21b6]"
            >
              Parent sign up
            </Link>
            <Link
              href="/#contact"
              className="inline-flex rounded-full border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-900 hover:bg-violet-50"
            >
              Contact us
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

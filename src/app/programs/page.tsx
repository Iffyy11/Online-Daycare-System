import Image from "next/image";
import Link from "next/link";
import { PROGRAMS } from "@/lib/programs-data";

export const metadata = {
  title: "Programs | Daycare Pro",
  description: "Explore full day, half day, after school, infant care, preschool prep, and holiday camps.",
};

export default function ProgramsIndexPage() {
  return (
    <main className="px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">Programs</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Care options built around your family
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Tap a program to read schedules, highlights, and how we partner with parents. Prefer to talk it
          through?{" "}
          <Link href="/#contact" className="font-semibold text-violet-700 underline-offset-2 hover:underline">
            Reach out anytime
          </Link>
          .
        </p>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/programs/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-violet-800">{p.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{p.summary}</p>
                  <span className="mt-4 text-sm font-semibold text-violet-700">
                    View details <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

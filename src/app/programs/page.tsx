import Image from "next/image";
import Link from "next/link";
import { formatKes } from "@/lib/pricing";
import { PROGRAMS } from "@/lib/programs-data";

export const metadata = {
  title: "Programs | Daycare Pro",
  description: "Explore full day, half day, after school, infant care, preschool prep, and holiday camps.",
};

export default function ProgramsIndexPage() {
  return (
    <main className="bg-gradient-to-b from-[var(--brand-mist)]/40 via-white to-white px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Care options built around your family
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          Tap a program to read schedules, highlights, and how we partner with parents. Prefer to talk it
          through?{" "}
          <Link href="/#contact" className="font-semibold text-violet-700 underline-offset-2 hover:underline">
            Reach out anytime
          </Link>
          .
        </p>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/programs/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-violet-500/10"
              >
                <div className="relative aspect-[5/3] w-full">
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="font-bold text-violet-900 sm:text-lg">{p.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    From KES {formatKes(p.priceFromKes)}{" "}
                    <span className="font-normal text-slate-500">/ {p.priceUnitLabel}</span>
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{p.summary}</p>
                  <span className="mt-3 text-sm font-semibold text-violet-700">
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

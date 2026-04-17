import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { MarketingContactForm } from "@/components/marketing-contact-form";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { formatKes } from "@/lib/pricing";
import { PROGRAMS } from "@/lib/programs-data";
import "./marketing.css";

const marketingSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 3v-3H6a2 2 0 01-2-2V6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div
      className={`${marketingSans.className} min-h-screen bg-[var(--brand-surface)] text-slate-900 antialiased`}
    >
      <MarketingHeader />

      <main className="relative overflow-x-hidden">
        <section
          id="home"
          className="relative scroll-mt-24 border-b border-violet-100/60 bg-gradient-to-b from-[var(--brand-mist)] via-white to-white"
        >
          <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-10 h-56 w-56 rounded-full bg-sky-200/35 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 shadow-sm">
              Kenya
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Meet the people helping little ones grow with{" "}
              <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
                confidence
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Hi — we&apos;re the team behind Daycare Pro: educators and operators who believe warm
              routines, clear communication, and joyful play belong in every classroom.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#6d28d9] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:-translate-y-0.5 hover:bg-[#5b21b6]"
              >
                Parent sign up
              </Link>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/80"
              >
                Contact us
              </a>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Admin? Use your work email on{" "}
              <Link href="/login" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                Log in
              </Link>
              .
            </p>
          </div>
        </section>

        <section id="programs" className="scroll-mt-24 border-b border-slate-100 py-14 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mx-auto max-w-3xl text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Programs &amp; everyday care
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-600 sm:text-base">
              Thoughtful routines for every age — tap a card for full details or{" "}
              <Link href="/programs" className="font-semibold text-violet-700 underline-offset-2 hover:underline">
                browse all programs
              </Link>
              .
            </p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {PROGRAMS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/programs/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] w-full shrink-0">
                      <Image
                        src={p.image}
                        alt={p.imageAlt}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <h3 className="text-base font-bold text-violet-900 sm:text-lg">{p.title}</h3>
                      <p className="mt-1 text-xs font-semibold text-slate-800 sm:text-sm">
                        From KES {formatKes(p.priceFromKes)}{" "}
                        <span className="font-normal text-slate-500">/ {p.priceUnitLabel}</span>
                      </p>
                      <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {p.summary}
                      </p>
                      <span className="mt-3 text-xs font-semibold text-violet-700 sm:text-sm">
                        Learn more →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="concerns" className="scroll-mt-24 border-b border-slate-100 bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=900&q=80"
                  alt="Children learning together at a table"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Common daycare concerns, answered with clarity
              </h2>
              <ul className="mt-8 space-y-5 text-slate-600">
                {[
                  "Ratios, supervision, and how we document daily moments for families.",
                  "Illness policies and what happens when your child needs extra comfort.",
                  "How we introduce new caregivers and keep transitions gentle.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                className="mt-10 inline-flex rounded-full bg-[#6d28d9] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#5b21b6]"
              >
                Ask us anything
              </Link>
            </div>
          </div>
        </section>

        <section
          id="feedback"
          className="scroll-mt-24 border-b border-slate-100 bg-gradient-to-b from-white to-[var(--brand-mist)]/40 py-14 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Hear from registered parents
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              We publish feedback shared by signed-in parents — real messages from our community, not sample
              quotes.
            </p>
            <Link
              href="/feedback"
              className="mt-8 inline-flex rounded-full bg-[#6d28d9] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#5b21b6]"
            >
              View parent feedback
            </Link>
            <p className="mt-6 text-sm text-slate-500">
              Registered?{" "}
              <Link href="/parent/feedback" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                Post feedback from your portal
              </Link>
              .
            </p>
          </div>
        </section>

        <section
          id="contact"
          className="scroll-mt-24 border-b border-slate-100 bg-gradient-to-b from-[var(--brand-mist)]/50 to-white py-20 sm:py-24"
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Reach out and start your child&apos;s journey with us
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Send a message using the form — we&apos;ll get back to you soon. Campus address and direct line
                are shared with enrolled families.
              </p>
            </div>
            <MarketingContactForm />
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-violet-100 bg-white p-10 text-center shadow-[0_24px_60px_-30px_rgba(109,40,217,0.35)] sm:p-14">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Ready when you are</h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-600">
                Create a parent account to explore bookings and messages — or log in as admin to see the
                full operations workspace.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex rounded-full bg-[#6d28d9] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#5b21b6]"
                >
                  Parent sign up
                </Link>
                <Link
                  href="/login"
                  className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-7 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-white"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />

      <a
        href="/#contact"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#6d28d9] text-white shadow-[0_12px_40px_-8px_rgba(91,33,182,0.65)] transition hover:scale-105 hover:bg-[#5b21b6] sm:bottom-8 sm:right-8"
        aria-label="Contact us"
      >
        <ChatBubbleIcon className="h-6 w-6" />
      </a>
    </div>
  );
}

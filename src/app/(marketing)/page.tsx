import Image from "next/image";
import Link from "next/link";
import { MarketingContactForm } from "@/components/marketing-contact-form";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { MARKETING_OFFERINGS } from "@/lib/marketing-offerings";
import { formatKes } from "@/lib/pricing";
import { PROGRAMS } from "@/lib/programs-data";

/** One static HTML snapshot for `/` — same for anonymous visitors and logged-in parents. */
export const dynamic = "force-static";

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

const heroImage = "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&q=80";

export default function HomePage() {
  return (
    <>
      <MarketingHeader />

      <main className="relative overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
          {/* Hero — same structure as parent dashboard welcome band */}
          <section id="home" className="scroll-mt-24">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm">
              <div className="absolute inset-0 opacity-40">
                <Image src={heroImage} alt="" fill className="object-cover" sizes="100vw" priority />
              </div>
              <div className="relative bg-gradient-to-r from-slate-950/95 to-slate-800/90 px-6 py-10 sm:px-8">
                <p className="text-sm font-medium text-slate-300">Nairobi · Kenya</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Meet the people helping little ones grow with confidence
                </h1>
                <p className="mt-3 max-w-xl text-slate-200/90">
                  Warm routines, clear communication, and joyful play — the same family-first experience you
                  see inside the parent portal.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
                  >
                    Parent sign up
                  </Link>
                  <a
                    href="/#contact"
                    className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Contact us
                  </a>
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  Staff or admin?{" "}
                  <Link href="/login" className="font-medium text-white underline-offset-2 hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* Metric cards — same grid + card shell as parent dashboard */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Program options</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{PROGRAMS.length}+</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Built for families</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">Bookings &amp; chat</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Where we are</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">Nairobi</p>
            </div>
          </div>

          {/* Programs */}
          <section id="programs" className="scroll-mt-24 pt-14 sm:pt-20">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Programs &amp; everyday care</h2>
            <p className="mt-1 text-sm text-slate-600">
              Thoughtful routines for every age — tap a card for full details or{" "}
              <Link href="/programs" className="font-medium text-slate-900 underline-offset-2 hover:underline">
                browse all programs
              </Link>
              .
            </p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PROGRAMS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/programs/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative aspect-[5/3] w-full shrink-0">
                      <Image
                        src={p.image}
                        alt={p.imageAlt}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-semibold text-slate-900">{p.title}</h3>
                      <p className="mt-1 text-xs font-medium text-slate-700 sm:text-sm">
                        From KES {formatKes(p.priceFromKes)}{" "}
                        <span className="font-normal text-slate-500">/ {p.priceUnitLabel}</span>
                      </p>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{p.summary}</p>
                      <span className="mt-3 text-sm font-medium text-slate-900">Learn more →</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Concerns */}
          <section id="concerns" className="scroll-mt-24 pt-14 sm:pt-20">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="order-2 lg:order-1">
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=900&q=80"
                      alt="Children learning together at a table"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </article>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  Common daycare concerns, answered with clarity
                </h2>
                <ul className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {[
                    "Ratios, supervision, and how we document daily moments for families.",
                    "Illness policies and what happens when your child needs extra comfort.",
                    "How we introduce new caregivers and keep transitions gentle.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#contact"
                  className="mt-8 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Ask us anything
                </Link>
              </div>
            </div>
          </section>

          {/* What we offer — identical card pattern to parent dashboard */}
          <section id="feedback" className="scroll-mt-24 pt-14 sm:pt-20">
            <h2 className="text-lg font-semibold text-slate-900">What we offer</h2>
            <p className="text-sm text-slate-600">
              The same pillars we highlight in the parent portal — care, safety, and communication.
            </p>
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
            <p className="mt-6 text-center text-sm text-slate-600">
              <Link href="/feedback" className="font-medium text-slate-900 underline-offset-2 hover:underline">
                Read feedback from enrolled parents →
              </Link>
            </p>
          </section>

          {/* Contact */}
          <section id="contact" className="scroll-mt-24 border-t border-slate-200 pt-14 sm:pt-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  Reach out and start your child&apos;s journey with us
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Send a message using the form — we&apos;ll get back to you soon. Campus address and direct line
                  are shared with enrolled families.
                </p>
              </div>
              <MarketingContactForm />
            </div>
          </section>

          {/* Final CTA */}
          <section className="pt-14 sm:pt-20">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Ready when you are</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
                Create a parent account to explore bookings and messages — or log in as admin to see the full
                operations workspace.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Parent sign up
                </Link>
                <Link
                  href="/login"
                  className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <MarketingFooter />

      <a
        href="/#contact"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:scale-105 hover:bg-slate-800 sm:bottom-8 sm:right-8"
        aria-label="Contact us"
      >
        <ChatBubbleIcon className="h-6 w-6" />
      </a>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { MarketingContactForm } from "@/components/marketing-contact-form";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import {
  SITE_LOCATION_FULL,
  SITE_LOCATION_SHORT,
  SITE_MAILTO_HREF,
  SITE_MAPS_URL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_PUBLIC_EMAIL,
} from "@/lib/site-contact";

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 7H3v9h6v-5l-3-4zm12 0h-3v9h6v-5l-3-4z" />
    </svg>
  );
}

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

const testimonials = [
  {
    quote:
      "Daycare Pro has been a blessing for our family. My son is always excited to go, and I love the activities that encourage his development.",
    name: "Sarah K.",
    role: "Parent of two",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
  },
  {
    quote:
      "The care and attention my daughter receives is unmatched. Healthy snacks and a fun, engaging learning environment — we see it every day.",
    name: "Michael P.",
    role: "First-time dad",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop",
  },
  {
    quote:
      "It's comforting to know our children are safe and growing every day. The team communicates clearly — highly recommended.",
    name: "Linda J.",
    role: "Working parent",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop",
  },
];

export default function MarketingHomePage() {
  return (
    <>
      <MarketingHeader />

      <main className="relative overflow-x-hidden">
        {/* Hero */}
        <section
          id="home"
          className="relative scroll-mt-24 border-b border-violet-100/60 bg-gradient-to-b from-[var(--brand-mist)] via-white to-white"
        >
          <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-10 h-56 w-56 rounded-full bg-sky-200/35 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 shadow-sm">
                {SITE_LOCATION_SHORT} · Kenya
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
                <a
                  href={SITE_PHONE_HREF}
                  className="inline-flex items-center gap-2 rounded-full bg-[#6d28d9] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:-translate-y-0.5 hover:bg-[#5b21b6]"
                >
                  Call {SITE_PHONE_DISPLAY}
                </a>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/80"
                >
                  Parent sign up
                </Link>
              </div>
              <p className="mt-6 text-sm text-slate-500">
                Admin? Use your work email on{" "}
                <Link href="/login" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                  Log in
                </Link>
                .
              </p>
            </div>
            <div className="relative lg:justify-self-end">
              <div className="marketing-float relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-[0_32px_64px_-24px_rgba(91,33,182,0.45)] ring-1 ring-violet-100 sm:mx-auto lg:mx-0">
                <Image
                  src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80"
                  alt="Educator welcoming children in a bright classroom"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-950/25 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur sm:block lg:-left-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Today</p>
                <p className="mt-1 text-sm font-bold text-slate-900">Circle time · Outdoor play · Story</p>
              </div>
            </div>
          </div>
        </section>

        {/* Unique needs */}
        <section id="programs" className="scroll-mt-24 border-b border-slate-100 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Support every child&apos;s unique needs, including:
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
              Thoughtful routines and documentation so every family feels seen — from snacks to sleep.
            </p>
            <div className="mt-14 grid gap-8 lg:grid-cols-2">
              <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(109,40,217,0.25)] sm:flex-row">
                <div className="relative aspect-[4/3] w-full shrink-0 sm:max-w-[240px] sm:aspect-auto sm:min-h-[220px]">
                  <Image
                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80"
                    alt="Children enjoying a colorful snack together"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 240px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-8">
                  <h3 className="text-lg font-bold text-violet-800 underline decoration-violet-200 decoration-2 underline-offset-4">
                    Food allergies &amp; dietary care
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    We label, double-check, and partner with families on safe snack options. Substitutions
                    are planned ahead — never an afterthought.
                  </p>
                </div>
              </article>
              <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(109,40,217,0.25)] sm:flex-row">
                <div className="relative aspect-[4/3] w-full shrink-0 sm:max-w-[240px] sm:aspect-auto sm:min-h-[220px]">
                  <Image
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80"
                    alt="Peaceful nap area with soft lighting"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 240px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-8">
                  <h3 className="text-lg font-bold text-violet-800 underline decoration-violet-200 decoration-2 underline-offset-4">
                    Naps &amp; sleep rhythms
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    Cozy spaces, predictable transitions, and flexible schedules that respect how each
                    child winds down and wakes up.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Concerns strip */}
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
                href="#contact"
                className="mt-10 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Ask us anything
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="marketing-gradient-purple scroll-mt-24 py-20 text-white sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold leading-tight sm:text-4xl">
              What families are saying about Daycare Pro
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-sm text-violet-100 sm:text-base">
              Real words from a demo experience — your center can make this story your own.
            </p>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {testimonials.map((t) => (
                <blockquote
                  key={t.name}
                  className="stamp-edge flex h-full flex-col bg-white p-7 text-slate-800 transition hover:-translate-y-1"
                >
                  <QuoteIcon className="h-8 w-8 text-violet-200" />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <Image
                      src={t.src}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-violet-100"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="scroll-mt-24 border-b border-slate-100 bg-gradient-to-b from-[var(--brand-mist)]/50 to-white py-20 sm:py-24"
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Reach out and start your child&apos;s journey with us
              </h2>
              <p className="mt-5 max-w-lg text-slate-600">
                We&apos;re in {SITE_LOCATION_FULL}. Call, email, or use the form — we&apos;ll get back to you
                about programs, schedules, and the parent portal.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li>
                  <span className="font-semibold text-slate-900">Address</span>
                  <br />
                  <a
                    href={SITE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-700 underline-offset-2 hover:underline"
                  >
                    {SITE_LOCATION_FULL}
                  </a>
                </li>
                <li>
                  <span className="font-semibold text-slate-900">Phone</span>
                  <br />
                  <a
                    href={SITE_PHONE_HREF}
                    className="text-violet-700 underline-offset-2 hover:underline"
                  >
                    {SITE_PHONE_DISPLAY}
                  </a>
                </li>
                <li>
                  <span className="font-semibold text-slate-900">Email</span>
                  <br />
                  <a
                    href={SITE_MAILTO_HREF}
                    className="text-violet-700 underline-offset-2 hover:underline"
                  >
                    {SITE_PUBLIC_EMAIL}
                  </a>
                </li>
              </ul>
              <a
                href={SITE_PHONE_HREF}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#6d28d9] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-[#5b21b6]"
              >
                Call {SITE_PHONE_DISPLAY}
              </a>
            </div>
            <MarketingContactForm />
          </div>
        </section>

        {/* Final CTA */}
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
        href="#contact"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#6d28d9] text-white shadow-[0_12px_40px_-8px_rgba(91,33,182,0.65)] transition hover:scale-105 hover:bg-[#5b21b6]"
        aria-label="Contact us"
      >
        <ChatBubbleIcon className="h-6 w-6" />
      </a>
    </>
  );
}

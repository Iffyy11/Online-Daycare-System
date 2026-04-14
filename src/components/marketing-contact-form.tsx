"use client";

import { FormEvent, useState } from "react";
import {
  SITE_LOCATION_SHORT,
  SITE_MAILTO_HREF,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_PUBLIC_EMAIL,
} from "@/lib/site-contact";

export function MarketingContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "ok_saved" | "err">("idle");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    if (!res.ok) {
      setStatus("err");
      return;
    }
    const data = (await res.json()) as { emailDispatched?: boolean };
    setStatus(data.emailDispatched ? "ok" : "ok_saved");
    setName("");
    setEmail("");
    setMessage("");
  };

  const input =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200";

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(91,33,182,0.25)] sm:p-8">
      <div className="mb-5 rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-3 text-sm text-slate-700">
        <p className="font-semibold text-violet-900">Visit &amp; contact</p>
        <p className="mt-1">{SITE_LOCATION_SHORT}, Kenya</p>
        <p className="mt-2">
          <a href={SITE_PHONE_HREF} className="font-medium text-violet-800 underline-offset-2 hover:underline">
            {SITE_PHONE_DISPLAY}
          </a>
          <span className="text-slate-400"> · </span>
          <a href={SITE_MAILTO_HREF} className="font-medium text-violet-800 underline-offset-2 hover:underline">
            {SITE_PUBLIC_EMAIL}
          </a>
        </p>
      </div>

      <form onSubmit={submit}>
        <p className="text-sm leading-relaxed text-slate-600">
          Send a message — we read every inquiry and usually reply within one business day. You can also
          email us directly at{" "}
          <a href={SITE_MAILTO_HREF} className="font-medium text-violet-700 underline-offset-2 hover:underline">
            {SITE_PUBLIC_EMAIL}
          </a>
          .
        </p>
        <div className="mt-5 space-y-4">
          <input
            className={input}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className={input}
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            className={`${input} min-h-[120px] resize-y`}
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        {status === "ok" ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Thank you — your message was sent to our inbox and we&apos;ll get back to you soon.
          </p>
        ) : null}
        {status === "ok_saved" ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Thank you — we received your message. Email delivery is not set up on this server yet; please
            use the phone or email above if you need a quick reply.
          </p>
        ) : null}
        {status === "err" ? (
          <p className="mt-4 text-sm text-rose-600">
            Something went wrong. Please try again, call us, or email{" "}
            <a href={SITE_MAILTO_HREF} className="font-medium underline">
              {SITE_PUBLIC_EMAIL}
            </a>
            .
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-6 w-full rounded-full bg-[#6d28d9] py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-[#5b21b6] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}

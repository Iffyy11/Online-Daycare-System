"use client";

import { FormEvent, useState } from "react";
export function MarketingContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "ok_saved" | "err">("idle");
  const [errDetail, setErrDetail] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrDetail("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      hint?: string;
      emailDispatched?: boolean;
    };
    if (!res.ok) {
      setStatus("err");
      const base =
        body.error ?? (res.status === 400 ? "Message must be at least 10 characters." : "");
      const hint = body.hint ? ` ${body.hint}` : "";
      setErrDetail((base + hint).trim());
      return;
    }
    const data = body as { emailDispatched?: boolean };
    setStatus(data.emailDispatched ? "ok" : "ok_saved");
    setName("");
    setEmail("");
    setMessage("");
  };

  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <form onSubmit={submit}>
        <div className="space-y-4">
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
            placeholder="Your message (at least 10 characters)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
          />
        </div>
        {status === "ok" ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Thank you — your message was sent to our inbox and we&apos;ll get back to you soon.
          </p>
        ) : null}
        {status === "ok_saved" ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span className="font-semibold text-amber-950">Thank you — we received your message.</span>{" "}
            This deployment is not sending copies by email yet (no{" "}
            <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs">RESEND_API_KEY</code> on the
            server). If you are on <strong>Vercel</strong>, open{" "}
            <strong>Project → Settings → Environment Variables</strong>, add the same keys you use in{" "}
            <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs">.env.local</code> (
            <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs">RESEND_API_KEY</code>,{" "}
            <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs">RESEND_FROM</code>, optional{" "}
            <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs">CONTACT_INBOX_EMAIL</code>
            ), then <strong>Redeploy</strong>. Until then, we still save your message on the server.
          </p>
        ) : null}
        {status === "err" ? (
          <p className="mt-4 text-sm text-rose-600">
            <span className="block font-medium">
              {errDetail || "Something went wrong. Please try again."}
            </span>
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-6 w-full rounded-lg bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}

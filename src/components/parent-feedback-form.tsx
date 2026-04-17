"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ParentFeedbackForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    try {
      const res = await fetch("/api/community-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; hint?: string };
      if (!res.ok) {
        setStatus("err");
        const detail = [body.error, body.hint].filter(Boolean).join(" ");
        setMsg(detail || "Could not save feedback.");
        return;
      }
      setStatus("ok");
      setContent("");
      router.refresh();
    } catch {
      setStatus("err");
      setMsg("Could not save feedback. Check your connection and try again.");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <label className="block text-sm font-medium text-slate-700">
        Your message for the homepage
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          minLength={15}
          maxLength={800}
          rows={5}
          placeholder="Share what you love about the center, teachers, or app — it may appear in the community section on our public site."
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
        />
      </label>
      <p className="mt-2 text-xs text-slate-500">{content.length}/800 characters · minimum 15</p>
      {status === "ok" ? (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Thank you! Your note is live on the website for other families to see.
        </p>
      ) : null}
      {status === "err" ? <p className="mt-3 text-sm text-rose-600">{msg}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 w-full rounded-full bg-[#6d28d9] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#5b21b6] disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === "sending" ? "Publishing…" : "Publish to homepage"}
      </button>
    </form>
  );
}

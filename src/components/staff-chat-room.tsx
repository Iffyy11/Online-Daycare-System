"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatNairobiDateTime } from "@/lib/nairobi-time";
import type { ChatMessage } from "@/lib/types";

type ParentOption = { id: string; name: string; email: string };

type Props = {
  initialMessages: ChatMessage[];
  parents: ParentOption[];
};

export function StaffChatRoom({ initialMessages, parents }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [threadParentUserId, setThreadParentUserId] = useState(parents[0]?.id ?? "");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(async () => {
      const res = await fetch("/api/messages");
      if (!res.ok) return;
      const j = (await res.json()) as { data: ChatMessage[] };
      setMessages(j.data);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!threadParentUserId) {
      setError("Choose a parent to message.");
      return;
    }
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, threadParentUserId }),
    });
    if (!res.ok) {
      setError("Failed to send.");
      return;
    }
    setText("");
  };

  const parentName = (id: string) => parents.find((p) => p.id === id)?.name ?? id;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <p className="text-sm text-slate-600">
        Staff messages go to <strong>one parent&apos;s private thread</strong>. Internal notes use{" "}
        <code className="rounded bg-slate-100 px-1 text-xs">threadParentUserId</code> empty via DB only —
        use Reports for exports.
      </p>
      <div className="mt-4 max-h-[380px] space-y-3 overflow-y-auto">
        {messages.map((m) => (
          <article
            key={m.id}
            className={`rounded-xl border p-3 text-sm ${
              m.role === "staff"
                ? "border-slate-200 bg-slate-50"
                : "border-indigo-100 bg-indigo-50/80"
            }`}
          >
            <p className="text-xs font-semibold text-indigo-700">
              {m.from} · {m.role}
              {m.threadParentUserId ? (
                <span className="ml-2 font-normal text-slate-600">
                  → {parentName(m.threadParentUserId)}
                </span>
              ) : (
                <span className="ml-2 font-normal text-slate-500">(internal)</span>
              )}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">{formatNairobiDateTime(m.sentAt)}</p>
            <p className="mt-1 text-slate-800">{m.message}</p>
          </article>
        ))}
      </div>
      <form onSubmit={send} className="mt-4 space-y-3 border-t border-slate-100 pt-4">
        <label className="block text-sm font-medium text-slate-700">
          Message to parent
          <select
            value={threadParentUserId}
            onChange={(e) => setThreadParentUserId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {parents.length === 0 ? (
              <option value="">No registered parents yet</option>
            ) : (
              parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))
            )}
          </select>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your message…"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            required
          />
          <button
            type="submit"
            disabled={parents.length === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </form>
    </section>
  );
}

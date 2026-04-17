"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatNairobiDateTime } from "@/lib/nairobi-time";
import { ChatMessage } from "@/lib/types";

type Props = {
  initialMessages: ChatMessage[];
};

export function ChatRoom({ initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setInterval(async () => {
      const response = await fetch("/api/messages");
      if (!response.ok) return;
      const result = (await response.json()) as { data: ChatMessage[] };
      setMessages(result.data);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    if (!response.ok) {
      setError("Failed to send message.");
      return;
    }
    setText("");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[85%] rounded-2xl border p-3 text-sm shadow-sm sm:max-w-xl ${
              message.role === "staff"
                ? "self-start border-slate-200 bg-slate-50 text-slate-900"
                : "self-end border-indigo-100 bg-indigo-50 text-slate-900"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {message.from}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">{formatNairobiDateTime(message.sentAt)}</p>
            <p className="mt-1 text-slate-700">{message.message}</p>
          </article>
        ))}
      </div>
      <form onSubmit={send} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
      {error ? <p className="mt-2 text-sm font-medium text-rose-600">{error}</p> : null}
    </section>
  );
}

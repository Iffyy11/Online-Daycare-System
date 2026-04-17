"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CreateStaffAccountForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setOk(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "teacher" }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; hint?: string; data?: { email: string } };
      if (!res.ok) {
        const hint = body.hint ? ` ${body.hint}` : "";
        setError((body.error ?? "Request failed.") + hint);
        return;
      }
      setOk(true);
      setName("");
      setEmail("");
      setPassword("");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

  return (
    <section className="rounded-2xl border border-violet-200 bg-white p-6 shadow-sm dark:border-violet-800 dark:bg-slate-900/40">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add teacher account</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Create login credentials for a teacher. Share the email and password with them securely — they
        sign in at the same page as you and land on the staff dashboard.
      </p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} required className={input} />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Work email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            className={input}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Initial password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={input}
          />
        </label>
        {error ? <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p> : null}
        {ok ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
            Teacher account created. Ask them to log in at <strong>/login</strong> with that email and
            password.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#6d28d9] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#5b21b6] disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create teacher account"}
        </button>
      </form>
    </section>
  );
}

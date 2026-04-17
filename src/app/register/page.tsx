"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; hint?: string };
      if (!res.ok) {
        const base = data.error ?? "Registration failed.";
        const hint = data.hint ? ` ${data.hint}` : "";
        setError((base + hint).trim());
        return;
      }
      router.push("/login?registered=1");
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <BrandLogo className="h-9 w-9 shrink-0" />
          Daycare Pro
        </Link>
      </header>

      <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Create your parent account
        </h1>
        <p className="mt-2 text-sm text-slate-600">Sign up with your email, then sign in anytime.</p>
        <form
          onSubmit={submit}
          className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-8 sm:p-6"
        >
          <label className="block text-sm font-medium text-slate-700">
            Your name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
              minLength={2}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
              autoComplete="email"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password (min 8 characters)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-slate-900 hover:underline">
            Log in
          </Link>
        </p>
        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

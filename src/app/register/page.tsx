"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      return;
    }
    router.push("/login?registered=1");
    router.refresh();
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-white">
      <header className="border-b border-slate-200 bg-white/90 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-lg text-white">
            D
          </span>
          Daycare Pro
        </Link>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-6">
        <div className="hidden lg:block">
          <div className="relative aspect-square max-w-md overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80"
              alt="Welcoming daycare"
              fill
              className="object-cover"
              sizes="400px"
              priority
            />
          </div>
          <ul className="mt-8 space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="text-violet-600">✓</span>
              Your own secure parent account — not shared with other families.
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600">✓</span>
              Add children, book care, and track teacher progress in one place.
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600">✓</span>
              Staff use a separate portal; you only ever see your data.
            </li>
          </ul>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Create your parent account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            No shared demo login — sign up with your email, then sign in anytime.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
              className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-800">
              Log in
            </Link>
          </p>
          <p className="mt-4 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

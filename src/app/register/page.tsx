"use client";

import Image from "next/image";
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
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--brand-mist)]/80 via-white to-[var(--brand-surface)] text-slate-900">
      <header className="border-b border-violet-100 bg-white/90 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <BrandLogo className="h-9 w-9 shrink-0" />
          Daycare Pro
        </Link>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto aspect-[4/3] max-w-lg overflow-hidden rounded-2xl border border-violet-100 shadow-md sm:aspect-square lg:mx-0 lg:max-w-md">
            <Image
              src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80"
              alt="Welcoming daycare"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 400px"
              priority
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Create your parent account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            No shared demo login — sign up with your email, then sign in anytime.
          </p>
          <form
            onSubmit={submit}
            className="mt-6 space-y-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:mt-8 sm:p-6"
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
              className="w-full rounded-full bg-[#6d28d9] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#5b21b6] disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-violet-700 hover:text-violet-900">
              Log in
            </Link>
          </p>
          <p className="mt-4 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-violet-800">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

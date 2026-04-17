"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginPayload = {
  userId: string;
  email: string;
  role: string;
  name: string;
};

export function LoginForm({ registered }: { registered: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = (await response.json()) as { data?: LoginPayload; error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(body.error ?? "Login failed.");
      return;
    }

    const role = body.data?.role;
    if (role === "parent") {
      router.push("/parent/dashboard");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {registered ? (
          <p className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Account created. Sign in with your new email and password.
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </label>
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-violet-700 underline-offset-2 hover:text-violet-900 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#6d28d9] py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#5b21b6] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="font-medium text-violet-700 hover:text-violet-900">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ChildOption = { id: string; name: string };

export function StaffProgressForm({ childrenList }: { childrenList: ChildOption[] }) {
  const router = useRouter();
  const [childId, setChildId] = useState(childrenList[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState<"learning" | "social" | "wellbeing" | "general">("general");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setOk(false);
    const res = await fetch("/api/staff/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, title, detail, category }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string; hint?: string };
    if (!res.ok) {
      const hint = body.hint ? ` ${body.hint}` : "";
      setError(
        (body.error ??
          (res.status === 403
            ? "You don’t have permission to save progress (staff only)."
            : res.status === 404
              ? "Child not found on the roster."
              : "Could not save progress. Try again.")) + hint,
      );
      return;
    }
    setTitle("");
    setDetail("");
    setOk(true);
    router.refresh();
  };

  const input =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  if (!childrenList.length) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Add children to the roster (or wait for parents to register) before logging progress.
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
    >
      <h2 className="text-sm font-semibold text-slate-900">Log child progress</h2>
      <p className="text-xs text-slate-600">
        Parents see these updates on their child&apos;s page in the parent portal.
      </p>
      <select value={childId} onChange={(e) => setChildId(e.target.value)} className={`w-full ${input}`}>
        {childrenList.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (e.g. Great participation today)"
        className={`w-full ${input}`}
        required
      />
      <textarea
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="Details for parents"
        rows={3}
        className={`w-full ${input}`}
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as typeof category)}
        className={`w-full ${input}`}
      >
        <option value="learning">Learning</option>
        <option value="social">Social</option>
        <option value="wellbeing">Wellbeing</option>
        <option value="general">General</option>
      </select>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {ok ? <p className="text-sm text-emerald-700">Saved.</p> : null}
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Save progress entry
      </button>
    </form>
  );
}

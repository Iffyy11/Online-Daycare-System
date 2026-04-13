"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AddChildForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [allergies, setAllergies] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/parent/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age: Number(age), allergies }),
    });
    if (!res.ok) {
      setError("Could not add child.");
      return;
    }
    setName("");
    setAge("");
    setAllergies("");
    router.refresh();
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm space-y-3"
    >
      <h2 className="text-sm font-semibold text-slate-900">Add a child to your account</h2>
      <p className="text-xs text-slate-600">
        Only you see these profiles. Staff will assign a classroom after enrollment.
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Child full name"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        required
      />
      <input
        type="number"
        min={0}
        max={18}
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        required
      />
      <input
        value={allergies}
        onChange={(e) => setAllergies(e.target.value)}
        placeholder="Allergies (or None)"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button
        type="submit"
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
      >
        Add child
      </button>
    </form>
  );
}

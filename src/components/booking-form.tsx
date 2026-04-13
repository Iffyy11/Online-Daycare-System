"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  defaultParentEmail?: string;
  defaultParentName?: string;
};

const emptyForm = {
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  childName: "",
  childAge: "",
  childAllergies: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  date: "",
  dropOffTime: "",
  pickUpTime: "",
  programType: "Full day",
  notes: "",
  paymentMethod: "pay_later" as
    | "card"
    | "mpesa"
    | "bank_transfer"
    | "cash"
    | "pay_later",
  paymentReference: "",
};

export function BookingForm({ defaultParentEmail = "", defaultParentName = "" }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    parentEmail: defaultParentEmail,
    parentName: defaultParentName,
  }));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError("Unable to create booking. Check all required fields.");
      return;
    }

    setForm({ ...emptyForm, parentEmail: defaultParentEmail, parentName: defaultParentName });
    setSuccess(true);
    router.refresh();
  };

  const inputClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <form
      onSubmit={submit}
      className="space-y-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Request a care slot</h2>
        <p className="mt-1 text-sm text-slate-600">
          Add parent and child details, schedule, and how you plan to pay. Staff will confirm your
          booking and payment.
        </p>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-indigo-600">Parent / guardian</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Full name
            <input
              value={form.parentName}
              onChange={(e) => setForm({ ...form, parentName: e.target.value })}
              className={`mt-1 ${inputClass} w-full`}
              required
            />
          </label>
          <label className={labelClass}>
            Email
            <input
              type="email"
              value={form.parentEmail}
              onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
              className={`mt-1 ${inputClass} w-full`}
              required
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Phone (include country code)
            <input
              type="tel"
              value={form.parentPhone}
              onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
              placeholder="+254…"
              className={`mt-1 ${inputClass} w-full`}
              required
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-indigo-600">Child</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Child&apos;s full name
            <input
              value={form.childName}
              onChange={(e) => setForm({ ...form, childName: e.target.value })}
              className={`mt-1 ${inputClass} w-full`}
              required
            />
          </label>
          <label className={labelClass}>
            Age
            <input
              value={form.childAge}
              onChange={(e) => setForm({ ...form, childAge: e.target.value })}
              placeholder="e.g. 4"
              className={`mt-1 ${inputClass} w-full`}
              required
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Allergies or medical notes (if none, write &quot;None&quot;)
            <textarea
              value={form.childAllergies}
              onChange={(e) => setForm({ ...form, childAllergies: e.target.value })}
              rows={2}
              className={`mt-1 ${inputClass} w-full resize-y`}
              required
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-indigo-600">Emergency contact</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Contact name
            <input
              value={form.emergencyContactName}
              onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
              className={`mt-1 ${inputClass} w-full`}
              required
            />
          </label>
          <label className={labelClass}>
            Contact phone
            <input
              type="tel"
              value={form.emergencyContactPhone}
              onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })}
              className={`mt-1 ${inputClass} w-full`}
              required
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-indigo-600">Visit</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Program
            <select
              value={form.programType}
              onChange={(e) => setForm({ ...form, programType: e.target.value })}
              className={`mt-1 ${inputClass} w-full`}
            >
              <option value="Full day">Full day</option>
              <option value="Half day">Half day</option>
              <option value="After school">After school</option>
              <option value="Drop-in">Drop-in</option>
            </select>
          </label>
          <label className={labelClass}>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={`mt-1 ${inputClass} w-full`}
              required
            />
          </label>
          <label className={labelClass}>
            Drop-off time
            <input
              type="time"
              value={form.dropOffTime}
              onChange={(e) => setForm({ ...form, dropOffTime: e.target.value })}
              className={`mt-1 ${inputClass} w-full`}
              required
            />
          </label>
          <label className={labelClass}>
            Pick-up time
            <input
              type="time"
              value={form.pickUpTime}
              onChange={(e) => setForm({ ...form, pickUpTime: e.target.value })}
              className={`mt-1 ${inputClass} w-full`}
              required
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Special instructions (optional)
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              placeholder="Pickup password, nap routine, etc."
              className={`mt-1 ${inputClass} w-full resize-y`}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-indigo-600">Payment (demo)</legend>
        <p className="text-xs text-slate-500">
          No real money is charged here. In production you would connect M-Pesa, card, or bank APIs.
          Staff can mark invoices as paid after they verify payment.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={`${labelClass} md:col-span-2`}>
            Payment method
            <select
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({
                  ...form,
                  paymentMethod: e.target.value as typeof form.paymentMethod,
                })
              }
              className={`mt-1 ${inputClass} w-full`}
            >
              <option value="pay_later">I&apos;ll decide later</option>
              <option value="mpesa">M-Pesa</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="cash">Cash at the center</option>
            </select>
          </label>
          {form.paymentMethod !== "pay_later" ? (
            <label className={`${labelClass} md:col-span-2`}>
              Reference (M-Pesa code, last 4 digits, or transfer note)
              <input
                value={form.paymentReference}
                onChange={(e) => setForm({ ...form, paymentReference: e.target.value })}
                className={`mt-1 ${inputClass} w-full`}
                placeholder="Optional for demo"
              />
            </label>
          ) : null}
        </div>
      </fieldset>

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {success ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Booking submitted. You&apos;ll see it below as pending until the center approves it.
        </p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 md:w-auto md:px-8"
      >
        Submit booking request
      </button>
    </form>
  );
}

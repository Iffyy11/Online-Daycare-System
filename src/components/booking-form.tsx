"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { estimateBookingKes, formatKes } from "@/lib/pricing";

type Props = {
  defaultParentEmail?: string;
  defaultParentName?: string;
  /** After success, go here (e.g. parent dashboard). Staff booking form should omit this. */
  successRedirectHref?: string;
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
  paymentMethod: "mpesa" as "mpesa" | "cash",
  paymentReference: "",
};

export function BookingForm({
  defaultParentEmail = "",
  defaultParentName = "",
  successRedirectHref,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    parentEmail: defaultParentEmail,
    parentName: defaultParentName,
  }));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const priceEstimate = useMemo(
    () => estimateBookingKes(form.programType, form.dropOffTime, form.pickUpTime),
    [form.programType, form.dropOffTime, form.pickUpTime],
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string; hint?: string };

      if (!response.ok) {
        const base = body.error ?? "Unable to create booking. Check all required fields.";
        const hint = body.hint ? ` ${body.hint}` : "";
        setError((base + hint).trim());
        return;
      }

      setForm({ ...emptyForm, parentEmail: defaultParentEmail, parentName: defaultParentName });
      setSuccess(true);
      router.refresh();
      if (successRedirectHref) {
        router.push(successRedirectHref);
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    }
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
        {priceEstimate ? (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 text-sm text-slate-800">
            <p className="font-semibold text-indigo-900">
              Estimated care fee: KES {formatKes(priceEstimate.displayTotalKes)}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              ~{priceEstimate.durationHours}h on site · time-of-day hourly math (peak drop-off / pick-up
              hours higher). {priceEstimate.summary}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Reference package for this program: KES {formatKes(priceEstimate.packageAnchorKes)}. Final
              amount is confirmed when staff approves your booking.
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Enter drop-off and pick-up times to see a fee estimate.</p>
        )}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-indigo-600">Payment</legend>
        <p className="text-xs text-slate-500">
          Choose how you will pay. M-Pesa payments stay pending until staff verifies the reference.
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
              <option value="mpesa">M-Pesa</option>
              <option value="cash">Cash at the center</option>
            </select>
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            {form.paymentMethod === "mpesa" ? "M-Pesa reference code" : "Receipt / note (optional)"}
            <input
              value={form.paymentReference}
              onChange={(e) => setForm({ ...form, paymentReference: e.target.value })}
              className={`mt-1 ${inputClass} w-full`}
              placeholder={form.paymentMethod === "mpesa" ? "e.g. QAB1CDE2" : "Optional"}
            />
          </label>
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

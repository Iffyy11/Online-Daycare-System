"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  bookingId: string;
  status: string;
  paymentStatus: string;
  compact?: boolean;
};

export function AdminBookingActions({ bookingId, status, paymentStatus, compact }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [hint, setHint] = useState("");

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string; hint?: string };
        if (res.status === 401) {
          setErr("Your session expired. Please log in again.");
          return;
        }
        setErr(j.error ?? `Update failed (${res.status})`);
        if (j.hint) setHint(j.hint);
        return;
      }
      router.refresh();
    } catch {
      setErr("Update failed. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const btn = compact
    ? "rounded-lg px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50"
    : "rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50";

  const showBookingActions = status === "pending" || status === "declined" || status === "approved";
  const showPaymentActions = paymentStatus !== "paid";

  if (!showBookingActions && !showPaymentActions) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  return (
    <div className="space-y-1">
      {err ? <p className="text-xs text-rose-600">{err}</p> : null}
      {hint ? <p className="mt-1 text-xs leading-relaxed text-slate-600">{hint}</p> : null}
      <div className="flex flex-wrap gap-1.5">
        {status === "pending" ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => patch({ status: "approved" })}
              className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}
            >
              Approve / Accept
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => patch({ status: "declined" })}
              className={`${btn} bg-rose-50 text-rose-800 ring-1 ring-rose-200 hover:bg-rose-100`}
            >
              Decline
            </button>
          </>
        ) : null}
        {status === "declined" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => patch({ status: "pending" })}
            className={`${btn} bg-slate-100 text-slate-800 ring-1 ring-slate-200 hover:bg-slate-200`}
          >
            Reopen
          </button>
        ) : null}
        {status === "approved" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => patch({ status: "pending" })}
            className={`${btn} bg-slate-100 text-slate-800 ring-1 ring-slate-200 hover:bg-slate-200`}
          >
            Move to pending
          </button>
        ) : null}
        {paymentStatus !== "paid" ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => patch({ paymentStatus: "paid" })}
              className={`${btn} bg-violet-600 text-white hover:bg-violet-700`}
            >
              Mark paid
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => patch({ paymentStatus: "unpaid" })}
              className={`${btn} bg-amber-50 text-amber-900 ring-1 ring-amber-200 hover:bg-amber-100`}
            >
              Mark unpaid
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

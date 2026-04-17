/**
 * Care pricing (KES). Hourly rates vary by clock hour (peak drop-off / pickup windows).
 * Package prices on programs are typical day/session anchors — final fees are confirmed by staff.
 */

/** KES per hour for the hour starting at `hour` (0–23, local time). */
export function hourlyRateKesForClockHour(hour: number): number {
  const h = ((hour % 24) + 24) % 24;
  // Peak drop-off 07:00–09:59, core day 10:00–14:59, peak pickup 15:00–17:59, early/late otherwise
  if (h >= 7 && h < 10) return 520;
  if (h >= 10 && h < 15) return 400;
  if (h >= 15 && h < 18) return 500;
  if (h >= 6 && h < 7) return 480;
  if (h >= 18 && h < 20) return 460;
  if (h >= 5 && h < 6) return 450;
  return 380;
}

/** Human-readable bands for marketing / tooltips */
export const HOURLY_RATE_BANDS: { range: string; kesPerHour: number; note: string }[] = [
  { range: "05:00–05:59", kesPerHour: 380, note: "Night / off-peak" },
  { range: "06:00–06:59", kesPerHour: 450, note: "Early opening" },
  { range: "07:00–09:59", kesPerHour: 520, note: "Peak drop-off" },
  { range: "10:00–14:59", kesPerHour: 400, note: "Core day" },
  { range: "15:00–17:59", kesPerHour: 500, note: "Peak pick-up" },
  { range: "18:00–19:59", kesPerHour: 460, note: "Extended evening" },
  { range: "20:00–04:59", kesPerHour: 380, note: "Late / overnight window" },
];

function parseTimeToMinutes(t: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

export type BookingEstimate = {
  /** Pure time-based total from hourly tiers */
  hourlyTotalKes: number;
  /** Decimal hours between drop-off and pick-up */
  durationHours: number;
  /** Typical package for this program (reference) */
  packageAnchorKes: number;
  /** What we show as headline estimate */
  displayTotalKes: number;
  /** Short explanation */
  summary: string;
};

/** Typical package anchors (KES) — used with hourly math */
export function packageAnchorKes(programType: string): number {
  switch (programType) {
    case "Full day":
      return 9800;
    case "Half day":
      return 5600;
    case "After school":
      return 3200;
    case "Drop-in":
      return 0;
    default:
      return 9800;
  }
}

/**
 * Sum (minutes/60)*rate for each clock hour touched between drop-off and pick-up same day.
 * If pick <= drop, assumes pick is next day (adds 24h) for estimate only.
 */
export function estimateBookingKes(
  programType: string,
  dropOffTime: string,
  pickUpTime: string,
): BookingEstimate | null {
  const drop = parseTimeToMinutes(dropOffTime);
  const pick = parseTimeToMinutes(pickUpTime);
  if (drop === null || pick === null) return null;

  let pickM = pick;
  if (pickM <= drop) pickM += 24 * 60;

  let hourlyTotal = 0;
  let t = drop;
  while (t < pickM) {
    const hourStart = Math.floor(t / 60) % 24;
    const nextBoundary = Math.ceil(t / 60) * 60;
    const segmentEnd = Math.min(pickM, nextBoundary);
    const mins = segmentEnd - t;
    hourlyTotal += (mins / 60) * hourlyRateKesForClockHour(hourStart);
    t = segmentEnd;
  }

  const durationHours = (pickM - drop) / 60;
  const anchor = packageAnchorKes(programType);
  let displayTotal = Math.round(hourlyTotal);
  let summary = "Based on hours × time-of-day rates.";

  if (programType === "Full day") {
    // Encourage package when visit is long; otherwise hourly
    displayTotal = Math.min(Math.round(hourlyTotal), anchor);
    if (durationHours >= 8) {
      displayTotal = anchor;
      summary = "Standard full-day window — typical day package applied.";
    } else {
      summary = "Shorter visit: estimated from hourly tiers (capped by typical full-day rate).";
    }
  } else if (programType === "Half day") {
    displayTotal = Math.min(Math.round(hourlyTotal), anchor);
    summary = "Half-day window — estimate capped by typical half-day package where lower.";
  } else if (programType === "After school") {
    displayTotal = Math.max(anchor, Math.round(hourlyTotal));
    summary = "After-school includes a session minimum; longer stays add time-based care.";
  } else {
    const raw = Math.round(hourlyTotal);
    const startH = Math.floor(drop / 60) % 24;
    const minTwoHour = Math.round(2 * hourlyRateKesForClockHour(startH));
    displayTotal = Math.max(raw, minTwoHour);
    summary = "Drop-in: hourly by time of day; short visits use a two-hour minimum.";
  }

  return {
    hourlyTotalKes: Math.round(hourlyTotal),
    durationHours: Math.round(durationHours * 100) / 100,
    packageAnchorKes: anchor,
    displayTotalKes: displayTotal,
    summary,
  };
}

export function formatKes(n: number): string {
  return new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n);
}

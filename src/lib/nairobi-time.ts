/**
 * Display timestamps in East Africa Time (Nairobi, EAT, UTC+3) across the app.
 * Stored values remain ISO UTC strings; formatting happens at render time.
 */

export const APP_TIMEZONE = "Africa/Nairobi";
export const APP_LOCALE = "en-KE";

function toValidDate(input: string | Date | number): Date | null {
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatInNairobi(
  input: string | Date | number,
  options: Intl.DateTimeFormatOptions,
): string {
  const d = toValidDate(input);
  if (!d) return "—";
  return new Intl.DateTimeFormat(APP_LOCALE, { timeZone: APP_TIMEZONE, ...options }).format(d);
}

/** e.g. 17 Apr 2026, 14:30 */
export function formatNairobiDateTime(input: string | Date | number): string {
  return formatInNairobi(input, { dateStyle: "medium", timeStyle: "short" });
}

/** e.g. 17 Apr 2026 */
export function formatNairobiDate(input: string | Date | number): string {
  return formatInNairobi(input, { dateStyle: "medium" });
}

/** e.g. 17 Apr 2026 (short month) — matches previous homepage community cards */
export function formatNairobiDateShort(input: string | Date | number): string {
  return formatInNairobi(input, { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Visit date stored as YYYY-MM-DD (center calendar day).
 * Anchor at midday EAT so the calendar day matches Nairobi.
 */
export function formatVisitDateLabel(ymd: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd;
  return formatInNairobi(`${ymd}T12:00:00+03:00`, { dateStyle: "medium" });
}

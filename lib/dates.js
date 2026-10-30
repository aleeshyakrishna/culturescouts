// Date helpers. All dates are plain "YYYY-MM-DD" strings in Kerala time (IST).
export function todayISO(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export const isISODate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

/** "tonight" = happening today; "week" = overlaps the next 7 days; "upcoming" = not finished yet */
export function matchesFilter(ev, filter) {
  const today = todayISO();
  const start = ev.start_date || ev.end_date;
  const end = ev.end_date || ev.start_date;
  if (!start) return filter === "all";
  if (filter === "tonight") return start <= today && end >= today;
  if (filter === "week") return start <= todayISO(7) && end >= today;
  if (filter === "upcoming") return end >= today;
  return true;
}

export function prettyDate(iso) {
  if (!isISODate(iso)) return iso || "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function prettyRange(start, end) {
  if (!start) return "Date to be confirmed";
  if (!end || end === start) return prettyDate(start);
  return `${prettyDate(start)} – ${prettyDate(end)}`;
}

/** Returns today's local date as YYYY-MM-DD string */
export function getTodayStr(): string {
  return toLocalDateStr(new Date());
}

/** Converts a Date to local YYYY-MM-DD string (avoids UTC timezone shift) */
export function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

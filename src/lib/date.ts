/** Local-calendar-day key (YYYY-MM-DD). Deliberately not `toISOString()`,
 * which is UTC-based and would roll the day over at UTC midnight - e.g. 8pm
 * Eastern - instead of the user's actual local midnight. */
export function todayKey(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

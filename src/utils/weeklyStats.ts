import type { JobApplication } from '../types'

/** Returns ISO date strings for the Sunday and Saturday bounding the given date.
 *  Uses UTC methods so that date-only strings (YYYY-MM-DD) round-trip correctly
 *  regardless of the local timezone. */
export function getWeekBounds(date: Date): { start: string; end: string } {
  const day = date.getUTCDay() // 0 = Sunday, 6 = Saturday
  const sunday = new Date(date)
  sunday.setUTCDate(date.getUTCDate() - day)
  const saturday = new Date(sunday)
  saturday.setUTCDate(sunday.getUTCDate() + 6)

  return {
    start: sunday.toISOString().slice(0, 10),
    end: saturday.toISOString().slice(0, 10),
  }
}

/** Counts applications whose dateApplied falls within the current week (Sun–Sat). */
export function countApplicationsThisWeek(
  applications: JobApplication[],
  today: Date = new Date(),
): number {
  const { start, end } = getWeekBounds(today)
  return applications.filter(
    (app) => app.dateApplied >= start && app.dateApplied <= end,
  ).length
}

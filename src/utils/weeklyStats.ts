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

/** Returns the start/end of a 1- or 2-week reporting period beginning on the
 *  Sunday of the week containing `date`. */
export function getPeriodBounds(
  date: Date,
  weeks: 1 | 2,
): { start: string; end: string } {
  const { start } = getWeekBounds(date)
  const end = new Date(`${start}T00:00:00Z`)
  end.setUTCDate(end.getUTCDate() + weeks * 7 - 1)
  return { start, end: end.toISOString().slice(0, 10) }
}

/** Counts applications whose dateApplied falls within the given period. */
export function countApplicationsThisWeek(
  applications: JobApplication[],
  today: Date = new Date(),
  weeks: 1 | 2 = 1,
): number {
  const { start, end } = getPeriodBounds(today, weeks)
  return applications.filter(
    (app) => app.dateApplied >= start && app.dateApplied <= end,
  ).length
}

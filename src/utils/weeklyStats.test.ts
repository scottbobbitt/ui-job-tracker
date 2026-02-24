import { describe, it, expect } from 'vitest'
import { getWeekBounds, getPeriodBounds, countApplicationsThisWeek } from './weeklyStats'
import type { JobApplication } from '../types'

function makeApp(dateApplied: string): JobApplication {
  return {
    id: dateApplied,
    dateApplied,
    companyName: 'Co',
    jobTitle: 'Role',
    applicationMethod: 'online',
    status: 'applied',
    notes: '',
    createdAt: `${dateApplied}T00:00:00.000Z`,
    updatedAt: `${dateApplied}T00:00:00.000Z`,
  }
}

describe('getWeekBounds', () => {
  it('returns Sunday–Saturday bounds for a midweek Wednesday', () => {
    // 2026-02-18 is a Wednesday
    const bounds = getWeekBounds(new Date('2026-02-18'))
    expect(bounds.start).toBe('2026-02-15') // Sunday
    expect(bounds.end).toBe('2026-02-21')   // Saturday
  })

  it('returns the same day as start when given a Sunday', () => {
    // 2026-02-15 is a Sunday
    const bounds = getWeekBounds(new Date('2026-02-15'))
    expect(bounds.start).toBe('2026-02-15')
    expect(bounds.end).toBe('2026-02-21')
  })

  it('returns the same day as end when given a Saturday', () => {
    // 2026-02-21 is a Saturday
    const bounds = getWeekBounds(new Date('2026-02-21'))
    expect(bounds.start).toBe('2026-02-15')
    expect(bounds.end).toBe('2026-02-21')
  })

  it('handles a week that crosses a month boundary', () => {
    // 2026-03-03 is a Tuesday; week is Mar 1 (Sun) – Mar 7 (Sat)
    const bounds = getWeekBounds(new Date('2026-03-03'))
    expect(bounds.start).toBe('2026-03-01')
    expect(bounds.end).toBe('2026-03-07')
  })

  it('handles a week that crosses a year boundary', () => {
    // 2026-01-01 is a Thursday; week is Dec 28 (Sun) – Jan 3 (Sat)
    const bounds = getWeekBounds(new Date('2026-01-01'))
    expect(bounds.start).toBe('2025-12-28')
    expect(bounds.end).toBe('2026-01-03')
  })
})

describe('getPeriodBounds', () => {
  it('with weeks=1 matches getWeekBounds', () => {
    const date = new Date('2026-02-18')
    expect(getPeriodBounds(date, 1)).toEqual(getWeekBounds(date))
  })

  it('with weeks=2 starts on the same Sunday and ends 13 days later', () => {
    // 2026-02-18 is Wednesday; week starts Feb 15 (Sun)
    const bounds = getPeriodBounds(new Date('2026-02-18'), 2)
    expect(bounds.start).toBe('2026-02-15')
    expect(bounds.end).toBe('2026-02-28') // Feb 15 + 13 days
  })

  it('biweekly period crosses a month boundary correctly', () => {
    // 2026-03-03 is Tuesday; week starts Mar 1 (Sun); +13 days = Mar 14
    const bounds = getPeriodBounds(new Date('2026-03-03'), 2)
    expect(bounds.start).toBe('2026-03-01')
    expect(bounds.end).toBe('2026-03-14')
  })
})

describe('countApplicationsThisWeek', () => {
  const today = new Date('2026-02-18') // Wednesday; week = Feb 15–21

  it('counts applications within the current week', () => {
    const apps = [makeApp('2026-02-15'), makeApp('2026-02-18'), makeApp('2026-02-21')]
    expect(countApplicationsThisWeek(apps, today)).toBe(3)
  })

  it('ignores applications before the week start', () => {
    const apps = [makeApp('2026-02-14'), makeApp('2026-02-18')]
    expect(countApplicationsThisWeek(apps, today)).toBe(1)
  })

  it('ignores applications after the week end', () => {
    const apps = [makeApp('2026-02-22'), makeApp('2026-02-18')]
    expect(countApplicationsThisWeek(apps, today)).toBe(1)
  })

  it('returns 0 when no applications fall in the current week', () => {
    const apps = [makeApp('2026-02-01'), makeApp('2026-03-01')]
    expect(countApplicationsThisWeek(apps, today)).toBe(0)
  })

  it('returns 0 for an empty list', () => {
    expect(countApplicationsThisWeek([], today)).toBe(0)
  })

  it('includes applications on exactly the Sunday boundary', () => {
    expect(countApplicationsThisWeek([makeApp('2026-02-15')], today)).toBe(1)
  })

  it('includes applications on exactly the Saturday boundary', () => {
    expect(countApplicationsThisWeek([makeApp('2026-02-21')], today)).toBe(1)
  })

  it('counts a full 2-week period when weeks=2', () => {
    // period: Feb 15 – Feb 28
    const apps = [makeApp('2026-02-15'), makeApp('2026-02-21'), makeApp('2026-02-28')]
    expect(countApplicationsThisWeek(apps, today, 2)).toBe(3)
  })

  it('excludes entries outside the 2-week period', () => {
    const apps = [makeApp('2026-02-14'), makeApp('2026-03-01')]
    expect(countApplicationsThisWeek(apps, today, 2)).toBe(0)
  })
})

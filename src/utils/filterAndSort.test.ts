import { describe, it, expect } from 'vitest'
import { filterAndSort } from './filterAndSort'
import type { JobApplication } from '../types'

function makeApp(
  id: string,
  dateApplied: string,
  status?: JobApplication['status'],
  companyName?: string,
  jobTitle?: string,
): JobApplication {
  return { id, dateApplied, status, companyName, jobTitle, createdAt: '', updatedAt: '' }
}

const APPS = [
  makeApp('1', '2026-01-15', 'applied', 'Globex', 'Engineer'),
  makeApp('2', '2026-01-10', 'interview', 'Initech', 'Developer'),
  makeApp('3', '2026-01-20', 'applied', 'Globex', 'Manager'),
  makeApp('4', '2026-01-05', undefined, 'Acme', 'Designer'),
]

describe('filterAndSort', () => {
  it('sorts newest-first by default (desc)', () => {
    const result = filterAndSort(APPS, { statusFilter: '', sortDirection: 'desc' })
    expect(result.map((a) => a.id)).toEqual(['3', '1', '2', '4'])
  })

  it('sorts oldest-first when direction is asc', () => {
    const result = filterAndSort(APPS, { statusFilter: '', sortDirection: 'asc' })
    expect(result.map((a) => a.id)).toEqual(['4', '2', '1', '3'])
  })

  it('filters by status', () => {
    const result = filterAndSort(APPS, { statusFilter: 'applied', sortDirection: 'desc' })
    expect(result).toHaveLength(2)
    expect(result.every((a) => a.status === 'applied')).toBe(true)
  })

  it('returns all when statusFilter is empty string', () => {
    const result = filterAndSort(APPS, { statusFilter: '', sortDirection: 'desc' })
    expect(result).toHaveLength(4)
  })

  it('does not mutate the original array', () => {
    const copy = [...APPS]
    filterAndSort(APPS, { statusFilter: '', sortDirection: 'asc' })
    expect(APPS).toEqual(copy)
  })

  it('filters by company name search (case-insensitive)', () => {
    const result = filterAndSort(APPS, { statusFilter: '', sortDirection: 'desc', search: 'globex' })
    expect(result).toHaveLength(2)
    expect(result.every((a) => a.companyName === 'Globex')).toBe(true)
  })

  it('filters by job title search', () => {
    const result = filterAndSort(APPS, { statusFilter: '', sortDirection: 'desc', search: 'Engineer' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('returns all when search is empty', () => {
    const result = filterAndSort(APPS, { statusFilter: '', sortDirection: 'desc', search: '' })
    expect(result).toHaveLength(4)
  })

  it('combines search and status filter', () => {
    // Globex has 2 entries; only 1 has status 'applied' and title 'Engineer'
    const result = filterAndSort(APPS, { statusFilter: 'applied', sortDirection: 'desc', search: 'Engineer' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })
})

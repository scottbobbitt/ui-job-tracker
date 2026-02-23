import { describe, it, expect } from 'vitest'
import { filterAndSort } from './filterAndSort'
import type { JobApplication } from '../types'

function makeApp(id: string, dateApplied: string, status?: JobApplication['status']): JobApplication {
  return { id, dateApplied, status, createdAt: '', updatedAt: '' }
}

const APPS = [
  makeApp('1', '2026-01-15', 'applied'),
  makeApp('2', '2026-01-10', 'interview'),
  makeApp('3', '2026-01-20', 'applied'),
  makeApp('4', '2026-01-05'),
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
})

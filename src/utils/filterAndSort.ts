import type { JobApplication, ApplicationStatus } from '../types'

export type SortField = 'dateApplied'
export type SortDirection = 'asc' | 'desc'

export interface FilterSortOptions {
  statusFilter: ApplicationStatus | ''
  sortDirection: SortDirection
}

export function filterAndSort(
  applications: JobApplication[],
  { statusFilter, sortDirection }: FilterSortOptions
): JobApplication[] {
  const filtered = statusFilter
    ? applications.filter((a) => a.status === statusFilter)
    : applications

  return [...filtered].sort((a, b) => {
    const diff = a.dateApplied.localeCompare(b.dateApplied)
    return sortDirection === 'asc' ? diff : -diff
  })
}

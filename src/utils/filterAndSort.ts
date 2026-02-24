import type { JobApplication, ApplicationStatus } from '../types'

export type SortField = 'dateApplied'
export type SortDirection = 'asc' | 'desc'

export interface FilterSortOptions {
  statusFilter: ApplicationStatus | ''
  sortDirection: SortDirection
  search?: string
}

export function filterAndSort(
  applications: JobApplication[],
  { statusFilter, sortDirection, search }: FilterSortOptions
): JobApplication[] {
  const needle = search?.trim().toLowerCase() ?? ''
  const filtered = applications.filter((a) => {
    if (statusFilter && a.status !== statusFilter) return false
    if (needle) {
      const hay = `${a.companyName ?? ''} ${a.jobTitle ?? ''}`.toLowerCase()
      if (!hay.includes(needle)) return false
    }
    return true
  })

  return [...filtered].sort((a, b) => {
    const diff = a.dateApplied.localeCompare(b.dateApplied)
    return sortDirection === 'asc' ? diff : -diff
  })
}

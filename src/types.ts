export type ApplicationMethod = 'online' | 'email' | 'in-person' | 'phone' | 'other'

export type ApplicationStatus =
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export interface JobApplication {
  id: string
  dateApplied: string        // ISO 8601 date, e.g. "2026-02-23"
  jobUrl?: string            // URL to the job listing
  companyName?: string
  jobTitle?: string
  applicationMethod?: ApplicationMethod
  status?: ApplicationStatus
  notes?: string
  createdAt: string          // ISO 8601 datetime
  updatedAt: string
}

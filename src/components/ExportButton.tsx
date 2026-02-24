import type { JobApplication } from '../types'

const STATUS_LABELS: Record<string, string> = {
  applied: 'Applied',
  phone_screen: 'Phone Screen',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

const METHOD_LABELS: Record<string, string> = {
  online: 'Online',
  email: 'Email',
  'in-person': 'In-person',
  phone: 'Phone',
  other: 'Other',
}

function escapeCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function buildCsv(applications: JobApplication[]): string {
  const header = ['Date Applied', 'Company', 'Job Title', 'Job URL', 'Method', 'Status', 'Notes']
  const rows = applications.map((app) => [
    app.dateApplied,
    app.companyName ?? '',
    app.jobTitle ?? '',
    app.jobUrl ?? '',
    app.applicationMethod ? METHOD_LABELS[app.applicationMethod] : '',
    app.status ? STATUS_LABELS[app.status] : '',
    app.notes ?? '',
  ])
  return [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n')
}

interface Props {
  applications: JobApplication[]
  onExport?: () => void
}

export function ExportButton({ applications, onExport }: Props) {
  function handleExport() {
    const csv = buildCsv(applications)
    const date = new Date().toISOString().slice(0, 10)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `job-applications-${date}.csv`
    a.click()
    URL.revokeObjectURL(url)
    onExport?.()
  }

  return (
    <button
      onClick={handleExport}
      disabled={applications.length === 0}
      className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Export CSV
    </button>
  )
}

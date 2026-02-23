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

interface Props {
  applications: JobApplication[]
  onDelete: (id: string) => void
  onEdit: (app: JobApplication) => void
}

export function ApplicationTable({ applications, onDelete, onEdit }: Props) {
  if (applications.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No applications yet. Add one above.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-600">
            <th className="pb-2 pr-4 font-medium">Date</th>
            <th className="pb-2 pr-4 font-medium">Company</th>
            <th className="pb-2 pr-4 font-medium">Title</th>
            <th className="pb-2 pr-4 font-medium">Method</th>
            <th className="pb-2 pr-4 font-medium">Status</th>
            <th className="pb-2 pr-4 font-medium">Link</th>
            <th className="pb-2 font-medium sr-only">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 pr-4 whitespace-nowrap">{app.dateApplied}</td>
              <td className="py-2 pr-4">{app.companyName ?? '—'}</td>
              <td className="py-2 pr-4">{app.jobTitle ?? '—'}</td>
              <td className="py-2 pr-4">{app.applicationMethod ? METHOD_LABELS[app.applicationMethod] : '—'}</td>
              <td className="py-2 pr-4">{app.status ? STATUS_LABELS[app.status] : '—'}</td>
              <td className="py-2 pr-4">
                {app.jobUrl ? (
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td className="py-2 flex gap-3">
                <button
                  onClick={() => onEdit(app)}
                  aria-label={`Edit application for ${app.companyName ?? app.dateApplied}`}
                  className="text-blue-500 hover:text-blue-700 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(app.id)}
                  aria-label={`Delete application for ${app.companyName ?? app.dateApplied}`}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

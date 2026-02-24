import { useState } from 'react'
import { useApplications } from './hooks/useApplications'
import { ApplicationForm } from './components/ApplicationForm'
import { ApplicationTable } from './components/ApplicationTable'
import { ExportButton } from './components/ExportButton'
import { EditModal } from './components/EditModal'
import { WeeklySummary } from './components/WeeklySummary'
import { filterAndSort } from './utils/filterAndSort'
import type { JobApplication, ApplicationStatus } from './types'
import type { SortDirection } from './utils/filterAndSort'

export default function App() {
  const { applications, add, update, remove } = useApplications()
  const [editingApp, setEditingApp] = useState<JobApplication | undefined>()
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const visible = filterAndSort(applications, { statusFilter, sortDirection })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Job Application Tracker</h1>

        <WeeklySummary applications={applications} />

        {/* Add form */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Add Application</h2>
          <ApplicationForm onSubmit={add} />
        </section>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm text-gray-600">Filter:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
              className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All statuses</option>
              <option value="applied">Applied</option>
              <option value="phone_screen">Phone Screen</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sortDirection" className="text-sm text-gray-600">Sort:</label>
            <select
              id="sortDirection"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value as SortDirection)}
              className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>

          <div className="ml-auto">
            <ExportButton applications={visible} />
          </div>
        </div>

        {/* Table */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Applications{' '}
            <span className="text-gray-400 font-normal">({visible.length})</span>
          </h2>
          <ApplicationTable
            applications={visible}
            onDelete={remove}
            onEdit={setEditingApp}
          />
        </section>
      </div>

      {/* Edit modal — rendered outside the layout flow so it sits above everything */}
      {editingApp && (
        <EditModal
          app={editingApp}
          onSave={(data) => { update(editingApp.id, data); setEditingApp(undefined) }}
          onClose={() => setEditingApp(undefined)}
        />
      )}
    </div>
  )
}

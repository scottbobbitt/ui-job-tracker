import { useState, useEffect } from 'react'
import type { JobApplication } from '../types'

type FormData = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>

function toFormData(app?: JobApplication): FormData {
  if (!app) {
    return {
      dateApplied: new Date().toISOString().slice(0, 10),
      jobUrl: '',
      companyName: '',
      jobTitle: '',
      applicationMethod: undefined,
      status: undefined,
      notes: '',
    }
  }
  return {
    dateApplied: app.dateApplied,
    jobUrl: app.jobUrl ?? '',
    companyName: app.companyName ?? '',
    jobTitle: app.jobTitle ?? '',
    applicationMethod: app.applicationMethod,
    status: app.status,
    notes: app.notes ?? '',
  }
}

interface Props {
  onSubmit: (data: FormData) => void
  initialData?: JobApplication
  onCancel?: () => void
}

export function ApplicationForm({ onSubmit, initialData, onCancel }: Props) {
  const [form, setForm] = useState<FormData>(() => toFormData(initialData))

  useEffect(() => {
    setForm(toFormData(initialData))
  }, [initialData])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      ...form,
      jobUrl: form.jobUrl || undefined,
      companyName: form.companyName || undefined,
      jobTitle: form.jobTitle || undefined,
      applicationMethod: form.applicationMethod || undefined,
      status: form.status || undefined,
      notes: form.notes || undefined,
    })
    if (!initialData) setForm(toFormData())
  }

  const isEditing = Boolean(initialData)

  return (
    <form onSubmit={handleSubmit} aria-label={isEditing ? 'Edit job application' : 'Add job application'}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dateApplied" className="block text-sm font-medium text-gray-700 mb-1">
            Date Applied <span className="text-red-500">*</span>
          </label>
          <input
            id="dateApplied"
            name="dateApplied"
            type="date"
            required
            value={form.dateApplied}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            value={form.companyName ?? ''}
            onChange={handleChange}
            placeholder="Acme Corp"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            type="text"
            value={form.jobTitle ?? ''}
            onChange={handleChange}
            placeholder="Software Engineer"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Job Listing URL
          </label>
          <input
            id="jobUrl"
            name="jobUrl"
            type="url"
            value={form.jobUrl ?? ''}
            onChange={handleChange}
            placeholder="https://example.com/jobs/123"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="applicationMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Application Method
          </label>
          <select
            id="applicationMethod"
            name="applicationMethod"
            value={form.applicationMethod ?? ''}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— select —</option>
            <option value="online">Online</option>
            <option value="email">Email</option>
            <option value="in-person">In-person</option>
            <option value="phone">Phone</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status ?? ''}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— select —</option>
            <option value="applied">Applied</option>
            <option value="phone_screen">Phone Screen</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            value={form.notes ?? ''}
            onChange={handleChange}
            placeholder="Any additional notes…"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isEditing ? 'Save Changes' : 'Add Application'}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

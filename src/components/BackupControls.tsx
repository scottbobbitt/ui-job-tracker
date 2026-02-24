import { useRef } from 'react'
import type { JobApplication } from '../types'

function isValidApp(x: unknown): x is JobApplication {
  if (typeof x !== 'object' || x === null) return false
  const a = x as Record<string, unknown>
  return (
    typeof a.id === 'string' &&
    typeof a.dateApplied === 'string' &&
    typeof a.createdAt === 'string' &&
    typeof a.updatedAt === 'string'
  )
}

interface Props {
  applications: JobApplication[]
  onImport: (apps: JobApplication[]) => void
  onExport?: () => void
}

export function BackupControls({ applications, onImport, onExport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    const date = new Date().toISOString().slice(0, 10)
    const blob = new Blob([JSON.stringify(applications, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `job-applications-backup-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
    onExport?.()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data: unknown = JSON.parse(text)
      if (!Array.isArray(data)) return
      onImport(data.filter(isValidApp))
    } catch {
      // invalid JSON — ignore
    } finally {
      e.target.value = ''
    }
  }

  const btnClass =
    'rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        disabled={applications.length === 0}
        className={`${btnClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Export JSON
      </button>
      <button onClick={() => fileInputRef.current?.click()} className={btnClass}>
        Import JSON
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        aria-label="Import JSON backup"
        className="sr-only"
      />
    </div>
  )
}

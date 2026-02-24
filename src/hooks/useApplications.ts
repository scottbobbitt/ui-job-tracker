import { useState } from 'react'
import type { JobApplication } from '../types'

const STORAGE_KEY = 'job-applications'

function load(): JobApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as JobApplication[]) : []
  } catch {
    return []
  }
}

function save(applications: JobApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
}

export function useApplications() {
  const [applications, setApplications] = useState<JobApplication[]>(load)
  // Dirty from the moment we have any data — cleared only after an export.
  const [isDirty, setIsDirty] = useState(() => load().length > 0)

  function add(data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const entry: JobApplication = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    const next = [entry, ...applications]
    save(next)
    setApplications(next)
    setIsDirty(true)
  }

  function update(id: string, data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) {
    const next = applications.map((a) =>
      a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
    )
    save(next)
    setApplications(next)
    setIsDirty(true)
  }

  function remove(id: string) {
    const next = applications.filter((a) => a.id !== id)
    save(next)
    setApplications(next)
    setIsDirty(true)
  }

  function importAll(apps: JobApplication[]) {
    save(apps)
    setApplications(apps)
    setIsDirty(true)
  }

  function markClean() {
    setIsDirty(false)
  }

  return { applications, add, update, remove, importAll, isDirty, markClean }
}

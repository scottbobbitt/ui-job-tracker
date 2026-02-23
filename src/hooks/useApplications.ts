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
  }

  function update(id: string, data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) {
    const next = applications.map((a) =>
      a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
    )
    save(next)
    setApplications(next)
  }

  function remove(id: string) {
    const next = applications.filter((a) => a.id !== id)
    save(next)
    setApplications(next)
  }

  return { applications, add, update, remove }
}

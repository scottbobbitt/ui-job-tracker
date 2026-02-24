import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApplications } from './useApplications'

const STORAGE_KEY = 'job-applications'

const BASE = {
  dateApplied: '2026-02-23',
  companyName: 'Acme Corp',
  jobTitle: 'Engineer',
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('useApplications', () => {
  it('starts empty when localStorage is empty', () => {
    const { result } = renderHook(() => useApplications())
    expect(result.current.applications).toHaveLength(0)
  })

  it('loads existing data from localStorage on mount', () => {
    const existing = [
      { ...BASE, id: 'abc', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    const { result } = renderHook(() => useApplications())
    expect(result.current.applications).toHaveLength(1)
    expect(result.current.applications[0].id).toBe('abc')
  })

  it('add() prepends a new entry with generated id and timestamps', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add(BASE) })
    expect(result.current.applications).toHaveLength(1)
    const entry = result.current.applications[0]
    expect(entry.id).toBeTruthy()
    expect(entry.companyName).toBe('Acme Corp')
    expect(entry.createdAt).toBeTruthy()
    expect(entry.updatedAt).toBe(entry.createdAt)
  })

  it('add() persists to localStorage', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add(BASE) })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(1)
    expect(stored[0].companyName).toBe('Acme Corp')
  })

  it('add() prepends so newest entry is first', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add({ ...BASE, companyName: 'First' }) })
    act(() => { result.current.add({ ...BASE, companyName: 'Second' }) })
    expect(result.current.applications[0].companyName).toBe('Second')
    expect(result.current.applications[1].companyName).toBe('First')
  })

  it('update() changes fields and bumps updatedAt', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add(BASE) })
    const id = result.current.applications[0].id
    const originalUpdatedAt = result.current.applications[0].updatedAt

    vi.advanceTimersByTime(1000)
    act(() => { result.current.update(id, { ...BASE, companyName: 'New Corp' }) })

    const updated = result.current.applications[0]
    expect(updated.companyName).toBe('New Corp')
    expect(updated.updatedAt).not.toBe(originalUpdatedAt)
    vi.useRealTimers()
  })

  it('update() persists changes to localStorage', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add(BASE) })
    const id = result.current.applications[0].id
    act(() => { result.current.update(id, { ...BASE, companyName: 'Updated' }) })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored[0].companyName).toBe('Updated')
  })

  it('remove() deletes the entry by id', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add({ ...BASE, companyName: 'A' }) })
    act(() => { result.current.add({ ...BASE, companyName: 'B' }) })
    const idToRemove = result.current.applications[0].id
    act(() => { result.current.remove(idToRemove) })
    expect(result.current.applications).toHaveLength(1)
    expect(result.current.applications[0].companyName).toBe('A')
  })

  it('remove() persists the deletion to localStorage', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add(BASE) })
    const id = result.current.applications[0].id
    act(() => { result.current.remove(id) })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(0)
  })

  it('handles corrupt localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json')
    const { result } = renderHook(() => useApplications())
    expect(result.current.applications).toHaveLength(0)
  })

  it('isDirty starts false when localStorage is empty', () => {
    const { result } = renderHook(() => useApplications())
    expect(result.current.isDirty).toBe(false)
  })

  it('isDirty starts true when localStorage already has applications', () => {
    const existing = [
      { ...BASE, id: 'abc', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    const { result } = renderHook(() => useApplications())
    expect(result.current.isDirty).toBe(true)
  })

  it('isDirty becomes true after add()', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add(BASE) })
    expect(result.current.isDirty).toBe(true)
  })

  it('isDirty becomes true after update()', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add(BASE) })
    const id = result.current.applications[0].id
    act(() => { result.current.update(id, { ...BASE, companyName: 'New' }) })
    expect(result.current.isDirty).toBe(true)
  })

  it('isDirty becomes true after remove()', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add(BASE) })
    const id = result.current.applications[0].id
    act(() => { result.current.remove(id) })
    expect(result.current.isDirty).toBe(true)
  })

  it('isDirty becomes true after importAll()', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.importAll([]) })
    expect(result.current.isDirty).toBe(true)
  })

  it('markClean() resets isDirty to false', () => {
    const { result } = renderHook(() => useApplications())
    act(() => { result.current.add(BASE) })
    expect(result.current.isDirty).toBe(true)
    act(() => { result.current.markClean() })
    expect(result.current.isDirty).toBe(false)
  })
})

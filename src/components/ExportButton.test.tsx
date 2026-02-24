import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildCsv, ExportButton } from './ExportButton'
import type { JobApplication } from '../types'

const APPS: JobApplication[] = [
  {
    id: '1',
    dateApplied: '2026-02-20',
    companyName: 'Globex',
    jobTitle: 'Engineer',
    applicationMethod: 'online',
    status: 'applied',
    jobUrl: 'https://example.com/job/1',
    notes: 'Great company',
    createdAt: '2026-02-20T10:00:00.000Z',
    updatedAt: '2026-02-20T10:00:00.000Z',
  },
  {
    id: '2',
    dateApplied: '2026-02-21',
    createdAt: '2026-02-21T10:00:00.000Z',
    updatedAt: '2026-02-21T10:00:00.000Z',
  },
]

describe('buildCsv', () => {
  it('includes a header row', () => {
    const csv = buildCsv([])
    expect(csv).toBe('Date Applied,Company,Job Title,Job URL,Method,Status,Notes')
  })

  it('produces a row for each application', () => {
    const csv = buildCsv(APPS)
    const lines = csv.split('\n')
    expect(lines).toHaveLength(3) // header + 2 rows
  })

  it('outputs human-readable labels for status and method', () => {
    const csv = buildCsv(APPS)
    expect(csv).toContain('Applied')
    expect(csv).toContain('Online')
  })

  it('fills empty strings for missing optional fields', () => {
    const csv = buildCsv(APPS)
    const lines = csv.split('\n')
    // Second row (id=2) has no company, title, etc — should be empty columns
    expect(lines[2]).toMatch(/^2026-02-21,,,,,,$/)
  })

  it('escapes cells that contain commas', () => {
    const app: JobApplication = {
      id: '3',
      dateApplied: '2026-02-22',
      companyName: 'Acme, Inc',
      createdAt: '',
      updatedAt: '',
    }
    const csv = buildCsv([app])
    expect(csv).toContain('"Acme, Inc"')
  })

  it('escapes cells that contain double quotes', () => {
    const app: JobApplication = {
      id: '4',
      dateApplied: '2026-02-22',
      notes: 'Said "great fit"',
      createdAt: '',
      updatedAt: '',
    }
    const csv = buildCsv([app])
    expect(csv).toContain('"Said ""great fit"""')
  })
})

describe('ExportButton', () => {
  beforeEach(() => {
    // jsdom doesn't implement URL.createObjectURL
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    })
  })

  it('renders the Export CSV button', () => {
    render(<ExportButton applications={APPS} />)
    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument()
  })

  it('is disabled when there are no applications', () => {
    render(<ExportButton applications={[]} />)
    expect(screen.getByRole('button', { name: /export csv/i })).toBeDisabled()
  })

  it('is enabled when there are applications', () => {
    render(<ExportButton applications={APPS} />)
    expect(screen.getByRole('button', { name: /export csv/i })).not.toBeDisabled()
  })

  it('triggers a download when clicked', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<ExportButton applications={APPS} />)
    await user.click(screen.getByRole('button', { name: /export csv/i }))
    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
  })

  it('calls onExport after a successful download', async () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const onExport = vi.fn()
    const user = userEvent.setup()
    render(<ExportButton applications={APPS} onExport={onExport} />)
    await user.click(screen.getByRole('button', { name: /export csv/i }))
    expect(onExport).toHaveBeenCalledOnce()
  })
})

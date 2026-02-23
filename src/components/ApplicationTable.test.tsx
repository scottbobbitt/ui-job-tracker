import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApplicationTable } from './ApplicationTable'
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

describe('ApplicationTable', () => {
  it('shows empty state when there are no applications', () => {
    render(<ApplicationTable applications={[]} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByText(/no applications yet/i)).toBeInTheDocument()
  })

  it('renders a row per application', () => {
    render(<ApplicationTable applications={APPS} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('2026-02-20')).toBeInTheDocument()
    expect(screen.getByText('2026-02-21')).toBeInTheDocument()
  })

  it('renders "—" for missing optional fields', () => {
    render(<ApplicationTable applications={APPS} onDelete={vi.fn()} onEdit={vi.fn()} />)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThan(0)
  })

  it('renders a link for jobUrl', () => {
    render(<ApplicationTable applications={APPS} onDelete={vi.fn()} onEdit={vi.fn()} />)
    const link = screen.getByRole('link', { name: /view/i })
    expect(link).toHaveAttribute('href', 'https://example.com/job/1')
  })

  it('calls onDelete with the correct id when Delete is clicked', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<ApplicationTable applications={APPS} onDelete={onDelete} onEdit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /delete application for globex/i }))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('renders delete and edit buttons for each row', () => {
    render(<ApplicationTable applications={APPS} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(2)
  })

  it('calls onEdit with the correct application when Edit is clicked', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<ApplicationTable applications={APPS} onDelete={vi.fn()} onEdit={onEdit} />)
    await user.click(screen.getByRole('button', { name: /edit application for globex/i }))
    expect(onEdit).toHaveBeenCalledWith(APPS[0])
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApplicationForm } from './ApplicationForm'
import type { JobApplication } from '../types'

const EXISTING: JobApplication = {
  id: 'abc',
  dateApplied: '2026-01-10',
  companyName: 'Globex',
  jobTitle: 'Engineer',
  applicationMethod: 'online',
  status: 'applied',
  notes: 'Good role',
  createdAt: '2026-01-10T00:00:00.000Z',
  updatedAt: '2026-01-10T00:00:00.000Z',
}

describe('ApplicationForm — add mode', () => {
  it('renders all fields', () => {
    render(<ApplicationForm onSubmit={vi.fn()} />)
    expect(screen.getByLabelText(/date applied/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/job listing url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/application method/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  })

  it('dateApplied defaults to today', () => {
    render(<ApplicationForm onSubmit={vi.fn()} />)
    const today = new Date().toISOString().slice(0, 10)
    expect(screen.getByLabelText(/date applied/i)).toHaveValue(today)
  })

  it('shows "Add Application" submit button', () => {
    render(<ApplicationForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('button', { name: /add application/i })).toBeInTheDocument()
  })

  it('calls onSubmit with entered values', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<ApplicationForm onSubmit={onSubmit} />)

    await user.clear(screen.getByLabelText(/date applied/i))
    await user.type(screen.getByLabelText(/date applied/i), '2026-01-15')
    await user.type(screen.getByLabelText(/company/i), 'Acme')
    await user.type(screen.getByLabelText(/job title/i), 'Developer')
    await user.click(screen.getByRole('button', { name: /add application/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
    const arg = onSubmit.mock.calls[0][0]
    expect(arg.dateApplied).toBe('2026-01-15')
    expect(arg.companyName).toBe('Acme')
    expect(arg.jobTitle).toBe('Developer')
  })

  it('resets the form after submission', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm onSubmit={vi.fn()} />)
    await user.type(screen.getByLabelText(/company/i), 'Acme')
    await user.click(screen.getByRole('button', { name: /add application/i }))
    expect(screen.getByLabelText(/company/i)).toHaveValue('')
  })

  it('submits with only dateApplied filled (all other fields optional)', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<ApplicationForm onSubmit={onSubmit} />)
    await user.click(screen.getByRole('button', { name: /add application/i }))
    expect(onSubmit).toHaveBeenCalledOnce()
    const arg = onSubmit.mock.calls[0][0]
    expect(arg.dateApplied).toBeTruthy()
    expect(arg.companyName).toBeUndefined()
    expect(arg.jobUrl).toBeUndefined()
  })
})

describe('ApplicationForm — edit mode', () => {
  it('pre-fills all fields from initialData', () => {
    render(<ApplicationForm onSubmit={vi.fn()} initialData={EXISTING} onCancel={vi.fn()} />)
    expect(screen.getByLabelText(/date applied/i)).toHaveValue('2026-01-10')
    expect(screen.getByLabelText(/company/i)).toHaveValue('Globex')
    expect(screen.getByLabelText(/job title/i)).toHaveValue('Engineer')
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Good role')
  })

  it('shows "Save Changes" submit button', () => {
    render(<ApplicationForm onSubmit={vi.fn()} initialData={EXISTING} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })

  it('shows a Cancel button', () => {
    render(<ApplicationForm onSubmit={vi.fn()} initialData={EXISTING} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<ApplicationForm onSubmit={vi.fn()} initialData={EXISTING} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('calls onSubmit with updated values', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<ApplicationForm onSubmit={onSubmit} initialData={EXISTING} onCancel={vi.fn()} />)

    await user.clear(screen.getByLabelText(/company/i))
    await user.type(screen.getByLabelText(/company/i), 'New Corp')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit.mock.calls[0][0].companyName).toBe('New Corp')
  })
})

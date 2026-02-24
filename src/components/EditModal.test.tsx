import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditModal } from './EditModal'
import type { JobApplication } from '../types'

const APP: JobApplication = {
  id: '1',
  dateApplied: '2026-01-15',
  companyName: 'Globex',
  jobTitle: 'Engineer',
  applicationMethod: 'online',
  status: 'applied',
  notes: 'Good role',
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: '2026-01-15T00:00:00.000Z',
}

describe('EditModal', () => {
  it('renders the dialog with the form pre-filled', () => {
    render(<EditModal app={APP} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/company/i)).toHaveValue('Globex')
    expect(screen.getByLabelText(/job title/i)).toHaveValue('Engineer')
    expect(screen.getByLabelText(/date applied/i)).toHaveValue('2026-01-15')
  })

  it('shows the "Edit Application" heading', () => {
    render(<EditModal app={APP} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText('Edit Application')).toBeInTheDocument()
  })

  it('calls onSave with updated values when Save Changes is clicked', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()
    render(<EditModal app={APP} onSave={onSave} onClose={vi.fn()} />)

    await user.clear(screen.getByLabelText(/company/i))
    await user.type(screen.getByLabelText(/company/i), 'New Corp')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(onSave).toHaveBeenCalledOnce()
    expect(onSave.mock.calls[0][0].companyName).toBe('New Corp')
  })

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<EditModal app={APP} onSave={vi.fn()} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when the ✕ button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<EditModal app={APP} onSave={vi.fn()} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})

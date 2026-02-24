import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BackupControls } from './BackupControls'
import type { JobApplication } from '../types'

function makeApp(dateApplied: string): JobApplication {
  return {
    id: dateApplied,
    dateApplied,
    companyName: 'Co',
    jobTitle: 'Role',
    applicationMethod: 'online',
    status: 'applied',
    notes: '',
    createdAt: `${dateApplied}T00:00:00.000Z`,
    updatedAt: `${dateApplied}T00:00:00.000Z`,
  }
}

describe('BackupControls', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    })
  })
  it('renders Export JSON and Import JSON buttons', () => {
    render(<BackupControls applications={[]} onImport={vi.fn()} />)
    expect(screen.getByRole('button', { name: /export json/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /import json/i })).toBeInTheDocument()
  })

  it('Export JSON button is disabled when there are no applications', () => {
    render(<BackupControls applications={[]} onImport={vi.fn()} />)
    expect(screen.getByRole('button', { name: /export json/i })).toBeDisabled()
  })

  it('Export JSON button is enabled when there are applications', () => {
    render(<BackupControls applications={[makeApp('2026-02-18')]} onImport={vi.fn()} />)
    expect(screen.getByRole('button', { name: /export json/i })).not.toBeDisabled()
  })

  it('calls onImport with parsed applications after valid file upload', async () => {
    const user = userEvent.setup()
    const onImport = vi.fn()
    const apps = [makeApp('2026-02-18')]
    render(<BackupControls applications={[]} onImport={onImport} />)

    const file = new File([JSON.stringify(apps)], 'backup.json', { type: 'application/json' })
    const input = screen.getByLabelText(/import json backup/i)
    await user.upload(input, file)

    await waitFor(() => expect(onImport).toHaveBeenCalledWith(apps))
  })

  it('filters out entries that are missing required fields', async () => {
    const user = userEvent.setup()
    const onImport = vi.fn()
    const validApp = makeApp('2026-02-18')
    const badEntry = { companyName: 'No ID or date' }
    render(<BackupControls applications={[]} onImport={onImport} />)

    const file = new File(
      [JSON.stringify([validApp, badEntry])],
      'backup.json',
      { type: 'application/json' },
    )
    const input = screen.getByLabelText(/import json backup/i)
    await user.upload(input, file)

    await waitFor(() => expect(onImport).toHaveBeenCalledWith([validApp]))
  })

  it('does not call onImport when JSON is not an array', async () => {
    const user = userEvent.setup()
    const onImport = vi.fn()
    render(<BackupControls applications={[]} onImport={onImport} />)

    const file = new File(['{"foo":"bar"}'], 'backup.json', { type: 'application/json' })
    const input = screen.getByLabelText(/import json backup/i)
    await user.upload(input, file)

    // Give the async file.text() a tick to resolve, then verify no call
    await new Promise((r) => setTimeout(r, 0))
    expect(onImport).not.toHaveBeenCalled()
  })

  it('does not call onImport when the file contains invalid JSON', async () => {
    const user = userEvent.setup()
    const onImport = vi.fn()
    render(<BackupControls applications={[]} onImport={onImport} />)

    const file = new File(['not json'], 'backup.json', { type: 'application/json' })
    const input = screen.getByLabelText(/import json backup/i)
    await user.upload(input, file)

    await new Promise((r) => setTimeout(r, 0))
    expect(onImport).not.toHaveBeenCalled()
  })

  it('calls onExport after JSON export download', async () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const onExport = vi.fn()
    const user = userEvent.setup()
    render(
      <BackupControls
        applications={[makeApp('2026-02-18')]}
        onImport={vi.fn()}
        onExport={onExport}
      />,
    )
    await user.click(screen.getByRole('button', { name: /export json/i }))
    expect(onExport).toHaveBeenCalledOnce()
  })

  it('does not call onExport after an import', async () => {
    const onExport = vi.fn()
    const user = userEvent.setup()
    const apps = [makeApp('2026-02-18')]
    render(
      <BackupControls applications={[]} onImport={vi.fn()} onExport={onExport} />,
    )
    const file = new File([JSON.stringify(apps)], 'backup.json', { type: 'application/json' })
    const input = screen.getByLabelText(/import json backup/i)
    await user.upload(input, file)
    await new Promise((r) => setTimeout(r, 0))
    expect(onExport).not.toHaveBeenCalled()
  })
})

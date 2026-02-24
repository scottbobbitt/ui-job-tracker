import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WeeklySummary } from './WeeklySummary'
import type { JobApplication } from '../types'

// 2026-02-18T12:00:00Z is a Wednesday; week = Feb 15 (Sun) – Feb 21 (Sat).
const TODAY = new Date('2026-02-18T12:00:00Z')

beforeEach(() => {
  localStorage.clear()
})

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

describe('WeeklySummary', () => {
  it('displays the week date range', () => {
    render(<WeeklySummary applications={[]} today={TODAY} />)
    expect(screen.getByText(/feb 15/i)).toBeInTheDocument()
    expect(screen.getByText(/feb 21/i)).toBeInTheDocument()
  })

  it('counts only applications in the current week', () => {
    const apps = [
      makeApp('2026-02-14'), // before — excluded
      makeApp('2026-02-15'), // Sunday boundary — included
      makeApp('2026-02-18'), // midweek — included
      makeApp('2026-02-22'), // after — excluded
    ]
    render(<WeeklySummary applications={apps} today={TODAY} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows count 0 when no applications this week', () => {
    render(<WeeklySummary applications={[makeApp('2026-02-01')]} today={TODAY} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('defaults goal to 5', () => {
    render(<WeeklySummary applications={[]} today={TODAY} />)
    expect(screen.getByRole('button', { name: /edit weekly goal/i })).toHaveTextContent('5')
  })

  it('persists a changed goal to localStorage', async () => {
    const user = userEvent.setup()
    render(<WeeklySummary applications={[]} today={TODAY} />)

    await user.click(screen.getByRole('button', { name: /edit weekly goal/i }))
    const input = screen.getByRole('spinbutton', { name: /weekly goal/i })
    await user.clear(input)
    await user.type(input, '3')
    await user.keyboard('{Enter}')

    expect(localStorage.getItem('weekly-goal')).toBe('3')
    expect(screen.getByRole('button', { name: /edit weekly goal/i })).toHaveTextContent('3')
  })

  it('loads a previously saved goal from localStorage', () => {
    localStorage.setItem('weekly-goal', '4')
    render(<WeeklySummary applications={[]} today={TODAY} />)
    expect(screen.getByRole('button', { name: /edit weekly goal/i })).toHaveTextContent('4')
  })

  it('progress bar is gray when count is 0', () => {
    render(<WeeklySummary applications={[]} today={TODAY} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.className).toMatch(/bg-gray/)
  })

  it('progress bar is red when count < 50% of goal', () => {
    // goal=5, count=1 → 20%
    render(<WeeklySummary applications={[makeApp('2026-02-18')]} today={TODAY} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.className).toMatch(/bg-red/)
  })

  it('progress bar is amber when count is 50–99% of goal', () => {
    // goal=5, count=3 → 60%
    const apps = ['2026-02-15', '2026-02-16', '2026-02-17'].map(makeApp)
    render(<WeeklySummary applications={apps} today={TODAY} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.className).toMatch(/bg-amber/)
  })

  it('progress bar is green when count meets goal', () => {
    // goal=5, count=5 → 100%
    const apps = ['2026-02-15', '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19'].map(makeApp)
    render(<WeeklySummary applications={apps} today={TODAY} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.className).toMatch(/bg-green/)
  })
})

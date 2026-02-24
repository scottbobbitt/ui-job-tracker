import { useState, useRef, useEffect } from 'react'
import type { JobApplication } from '../types'
import { getPeriodBounds, countApplicationsThisWeek } from '../utils/weeklyStats'

const GOAL_KEY = 'weekly-goal'
const PERIOD_KEY = 'weekly-period'
const DEFAULT_GOAL = 5

function loadGoal(): number {
  const raw = localStorage.getItem(GOAL_KEY)
  const parsed = raw !== null ? parseInt(raw, 10) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_GOAL
}

function loadPeriod(): 1 | 2 {
  return localStorage.getItem(PERIOD_KEY) === '2' ? 2 : 1
}

function formatRange(start: string, end: string): string {
  const fmt = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
  return `${fmt(start)} – ${fmt(end)}`
}

function progressColor(count: number, goal: number): string {
  if (count === 0) return 'bg-gray-300'
  const pct = count / goal
  if (pct >= 1) return 'bg-green-500'
  if (pct >= 0.5) return 'bg-amber-400'
  return 'bg-red-400'
}

interface Props {
  applications: JobApplication[]
  /** Injected in tests to pin "today" without fake timers. */
  today?: Date
}

export function WeeklySummary({ applications, today = new Date() }: Props) {
  const [period, setPeriod] = useState<1 | 2>(loadPeriod)
  const { start, end } = getPeriodBounds(today, period)
  const count = countApplicationsThisWeek(applications, today, period)
  const [goal, setGoal] = useState<number>(loadGoal)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function setPeriodAndStore(value: 1 | 2) {
    setPeriod(value)
    localStorage.setItem(PERIOD_KEY, String(value))
  }

  function startEditing() {
    setDraft(String(goal))
    setEditing(true)
  }

  function commitEdit() {
    const value = parseInt(draft, 10)
    if (Number.isFinite(value) && value > 0) {
      setGoal(value)
      localStorage.setItem(GOAL_KEY, String(value))
    }
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  const pct = Math.min(count / goal, 1)
  const barColor = progressColor(count, goal)

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex rounded border border-gray-200 text-xs font-medium overflow-hidden">
            <button
              onClick={() => setPeriodAndStore(1)}
              aria-pressed={period === 1}
              className={`px-2 py-1 ${period === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriodAndStore(2)}
              aria-pressed={period === 2}
              className={`px-2 py-1 border-l border-gray-200 ${period === 2 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Biweekly
            </button>
          </div>
          <span className="text-sm text-gray-400">{formatRange(start, end)}</span>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">{count}</span>
          {' / '}
          {editing ? (
            <input
              ref={inputRef}
              type="number"
              min={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              aria-label="Weekly goal"
              className="w-12 rounded border border-blue-400 px-1 text-center text-sm font-semibold focus:outline-none"
            />
          ) : (
            <button
              onClick={startEditing}
              aria-label="Edit weekly goal"
              title="Click to change goal"
              className="font-semibold text-blue-600 underline decoration-dotted hover:text-blue-800 focus:outline-none"
            >
              {goal}
            </button>
          )}{' '}
          applications
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.round(pct * 100)}%` }}
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={goal}
        />
      </div>
    </div>
  )
}

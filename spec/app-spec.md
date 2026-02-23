# Job Application Tracker — App Spec

## Overview

An open-source web app that helps job seekers — particularly those receiving
unemployment insurance (UI) — log and manage their job applications. Users
can record each application, track its status, and export a report to submit
to their unemployment jurisdiction.

---

## Goals

- Simple to use: add a job application in under 30 seconds
- Privacy-first: data stays on the user's device by default
- Exportable: generate a printable/downloadable report for UI reporting
- Open-source and self-hostable

---

## Requirements

### Core (MVP)

| # | Requirement |
|---|-------------|
| 1 | Add a job application with at minimum: date applied |
| 2 | Additional fields: company name, job title, application method, notes |
| 3 | View all applications in a list, sorted by date (newest first) |
| 4 | Edit or delete any existing entry |
| 5 | Export the application list as a CSV file for UI reporting |

### Application Fields

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| Date applied | Yes | Date | Defaults to today |
| Job listing URL | No | URL | Link to the job posting |
| Company name | No | Text | |
| Job title | No | Text | |
| Application method | No | Select | Online, Email, In-person, Phone, Other |
| Status | No | Select | Applied, Phone screen, Interview, Offer, Rejected, Withdrawn |
| Notes | No | Textarea | Any freeform notes |

### UI Requirements

- Responsive — works on desktop and mobile
- Table/list view of all applications with key columns visible
- Inline "Add application" form or modal
- Filter by status; sort by date
- "Export CSV" button that downloads a file named `job-applications-YYYY-MM-DD.csv`

### Out of Scope (v1)

- User accounts / authentication
- Multi-device sync
- Email reminders
- Backend server (Phase 1 uses localStorage)

---

## Design Approach

### Phase 1 — Client-only (recommended starting point)

- Single-page React app
- All data stored in `localStorage`
- No server required — open `index.html` or run `npm run dev`
- Deployable as a static site (GitHub Pages, Netlify, Vercel — free tier)
- Testable immediately after `npm install && npm run dev`

### Phase 2 — Add a backend (optional, later)

- Swap localStorage for a REST API (Node.js + Express)
- SQLite database (`better-sqlite3`) — single file, zero config
- Same React frontend, swap the data layer only
- Enables multi-device access and data backup

---

## Recommended Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18 + Vite | Fast dev server, minimal boilerplate, huge ecosystem |
| Language | TypeScript | Catches bugs early, good for open-source contributors |
| Styling | Tailwind CSS | Utility-first, no CSS files to manage, easy theming |
| State | React `useState` + custom hook | No Redux needed for this scale |
| Storage (Phase 1) | `localStorage` | Zero setup, works offline, data stays private |
| Storage (Phase 2) | SQLite via `better-sqlite3` | Embedded, file-based, no separate DB server |
| Backend (Phase 2) | Node.js + Express | Minimal, familiar, easy to extend |
| CSV export | Vanilla JS | No library needed for simple tabular data |
| Testing | Vitest + React Testing Library | Fast, Vite-native, good component testing |
| Linting | ESLint + Prettier | Standard open-source quality bar |

---

## Project Structure (Phase 1)

```
job-search/
├── spec/
│   └── app-spec.md
├── src/
│   ├── components/
│   │   ├── ApplicationForm.tsx   # Add/edit form
│   │   ├── ApplicationTable.tsx  # List view
│   │   └── ExportButton.tsx      # CSV export
│   ├── hooks/
│   │   └── useApplications.ts    # CRUD + localStorage logic
│   ├── types.ts                  # JobApplication type
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Data Model

```typescript
type ApplicationMethod = 'online' | 'email' | 'in-person' | 'phone' | 'other';
type ApplicationStatus =
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

interface JobApplication {
  id: string;               // uuid
  dateApplied: string;      // ISO 8601 date, e.g. "2026-02-23"
  jobUrl?: string;          // URL to the job listing
  companyName?: string;
  jobTitle?: string;
  applicationMethod?: ApplicationMethod;
  status?: ApplicationStatus;
  notes?: string;
  createdAt: string;        // ISO 8601 datetime
  updatedAt: string;
}
```

---

## CSV Export Format

Columns exported (in order):
`Date Applied, Company, Job Title, Job URL, Method, Status, Notes`

Filename: `job-applications-2026-02-23.csv`

---

## Incremental Build Order (for testability)

1. Scaffold Vite + React + TypeScript + Tailwind
2. Define `JobApplication` type and `useApplications` hook (localStorage CRUD)
3. Build `ApplicationForm` (add only) — test adding entries
4. Build `ApplicationTable` — test display and delete
5. Add edit functionality to form
6. Add CSV export
7. Add filter by status + sort controls
8. *(Phase 2)* Add Express + SQLite backend; swap hook data layer

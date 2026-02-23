# UI Job Tracker

An open-source web app for tracking job applications — built specifically for people on unemployment insurance (UI) who need to log and report their job search activity.

Data stays entirely on your device (browser `localStorage`). No account, no server, no setup beyond `npm install`.

## Features

- Log applications with date, company, job title, URL, method, and status
- Edit or delete any entry
- Filter by application status; sort by date
- Export to CSV for submitting to your UI jurisdiction

## Quickstart

```bash
npm install
npm run dev       # http://localhost:5173
```

## Other commands

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm test          # run all tests (Vitest)
npm run lint      # ESLint
```

To run a single test file:
```bash
npx vitest run src/hooks/useApplications.test.ts
```

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Storage | `localStorage` (Phase 1) |
| Testing | Vitest + React Testing Library |

## Project structure

```
src/
├── components/
│   ├── ApplicationForm.tsx   # add/edit form
│   ├── ApplicationTable.tsx  # sortable list with edit + delete
│   └── ExportButton.tsx      # CSV download
├── hooks/
│   └── useApplications.ts    # CRUD + localStorage (swap here for Phase 2 backend)
├── utils/
│   └── filterAndSort.ts      # pure filter/sort logic
├── types.ts                  # JobApplication interface
└── App.tsx
spec/
└── app-spec.md               # full product spec
```

## Contributing

Issues and pull requests welcome. See [spec/app-spec.md](spec/app-spec.md) for the full product spec and planned Phase 2 backend.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Job Application Tracker — an open-source React SPA for logging job applications, aimed at users on unemployment insurance who need to report applications to their jurisdiction. Full spec in [spec/app-spec.md](spec/app-spec.md).

## Commands

Once the project is scaffolded (Phase 1):

```bash
npm run dev      # start Vite dev server
npm run build    # production build
npm run preview  # preview production build locally
npm run test     # run Vitest tests
npm run lint     # ESLint
```

To run a single test file:
```bash
npx vitest run src/hooks/useApplications.test.ts
```

## Architecture

**Phase 1 (current target):** Client-only SPA — no server, no auth.

- `src/types.ts` — `JobApplication` interface and `ApplicationMethod`/`ApplicationStatus` union types; the single source of truth for the data shape
- `src/hooks/useApplications.ts` — all CRUD logic + `localStorage` persistence; swap this file's internals in Phase 2 to add a backend without touching components
- `src/components/ApplicationForm.tsx` — add/edit form (shared for both operations)
- `src/components/ApplicationTable.tsx` — sortable list view with inline delete
- `src/components/ExportButton.tsx` — client-side CSV generation (no library)

**Data flow:** `useApplications` hook owns state and `localStorage` sync → passes data and handlers down to components via props. No global state library needed.

**Only required field:** `dateApplied`. All other fields (`jobUrl`, `companyName`, `jobTitle`, `applicationMethod`, `status`, `notes`) are optional.

**CSV export columns (in order):** Date Applied, Company, Job Title, Job URL, Method, Status, Notes. Filename: `job-applications-YYYY-MM-DD.csv`.

**Phase 2 (future):** Add Node.js + Express + SQLite backend; only `useApplications.ts` needs to change (replace `localStorage` calls with `fetch`).

## Development Practices

**Tests:** Each build step in the incremental order has a testable milestone — write tests before moving to the next step. Hook logic goes in unit tests (`useApplications.test.ts`); component behavior goes in React Testing Library tests. Run the full suite before committing.

**Commits:** One logical change per commit. Write the message in the imperative mood and include *why* when it's not obvious (e.g. `make jobUrl optional to support offline/walk-in applications`, not `update types`).

**Patterns:** Follow what's already in the codebase before adding new abstractions. New fields belong in `src/types.ts` first; components consume the type, not ad-hoc prop shapes. Keep components focused on rendering — business logic lives in hooks.

**Code quality:** Run `npm run lint` before committing. Keep components small; if a component needs more than ~100 lines, consider splitting it. Prefer explicit TypeScript types over `any`.

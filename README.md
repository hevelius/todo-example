# todo-example

A minimal to-do list app built with React 19, Vite, and TypeScript. Client-only: all
task data is persisted in `localStorage`, there is no backend.

This repository also serves as a testbed for **"loop engineering"** — using opencode
subagents and a GitHub Actions workflow to autonomously pick up, implement, test, and
ship small tasks. See [Loop engineering](#loop-engineering) below.

## Commands

- Dev server: `npm run dev`
- Lint: `npm run lint` (oxlint, not eslint)
- Type check: `npx tsc -b` (uses TS project references; plain `tsc --noEmit` won't
  pick up `tsconfig.app.json`/`tsconfig.node.json` correctly)
- Build: `npm run build` (runs `tsc -b` then `vite build`)
- Test: `npm test` (Vitest + React Testing Library)

## Project structure

- `src/components/` — UI components, one `.module.css` file per component
- `src/hooks/` — reusable logic (e.g. `useLocalStorage`, `useTasks`)
- `src/types/` — shared TypeScript interfaces
- `tasks.md` — the backlog of tasks the loop works through
- `progress.md` — generated log of failed automated attempts (created by the workflow)

## Loop engineering

### Subagents (`.opencode/agents/`)

- **`planner`** — breaks a feature request into ordered tasks and flags risks/ambiguities.
  Read-only (no edit, no bash).
- **`component-tester`** — writes and runs Vitest/React Testing Library tests that verify
  behavior, not implementation. Restricted to editing `src/**/*.test.tsx`; cannot touch
  `src/components/` logic. Limited bash access (`npm test`, `npm install`, `npx vitest`,
  and read-only inspection commands).
- **`a11y-reviewer`** — reviews components for accessibility and React/UX issues
  (missing labels/ARIA, contrast, focus management, list keys, unnecessary re-renders).
  Read-only (no edit, no bash); reports findings with file/line references.

### Task queue (`tasks.md`)

Tasks are tracked as a checklist in `tasks.md`. The automation always targets the first
unchecked (`- [ ]`) item.

### Workflow (`.github/workflows/opencode-copilot-test.yml`)

A manually-triggered (`workflow_dispatch`) GitHub Actions job that runs one iteration of
the loop:

1. **Pick a task** — reads the first unchecked line in `tasks.md` and derives a stable
   task ID (md5 hash of the line). Skips if there are no tasks left, or if a PR is
   already open for that task ID.
2. **Stuck check** — looks up the attempt count for that task ID in `progress.md`; if it
   has already failed `MAX_STUCK` times, opens a GitHub issue flagging it for manual
   intervention instead of retrying.
3. **Run the task** — invokes `opencode run` to implement the task, delegating testing to
   `@component-tester` and an accessibility pass to `@a11y-reviewer`. It does not mark
   the task complete in `tasks.md`.
4. **Verify** — runs `npm test` and `tsc --noEmit` as the real pass/fail check.
5. **On success** — marks the task done in `tasks.md`, clears its entry from
   `progress.md`, commits to a new `task-<id>-<run>` branch, and opens a PR.
6. **On failure** — appends the attempt count and last error output to `progress.md` and
   commits directly, so the next run can see the stuck count and decide whether to retry
   or flag it.

## CODEOWNERS

Code review ownership is defined in [`.github/CODEOWNERS`](.github/CODEOWNERS).

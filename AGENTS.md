# AGENTS.md

## Project
To-do app: React 19 + Vite + TypeScript, client-only with localStorage persistence.
Currently just the default Vite+React scaffold (`src/App.tsx`) — no todo feature, components/hooks/types directories, or test tooling exist yet.

## Commands
- Dev: `npm run dev`
- Lint: `npm run lint` (oxlint, not eslint)
- Type check: `npx tsc -b` (project uses TS project references — plain `tsc --noEmit` won't pick up `tsconfig.app.json`/`tsconfig.node.json` correctly)
- Build: `npm run build` (runs `tsc -b` then `vite build`)
- Test: no test script or test runner is installed yet. If asked to add tests, you must first install Vitest + React Testing Library and add a `test` script — don't assume it's already configured.

## Conventions (intended, not yet all in place)
- Functional components, no class components
- State: useState/useReducer; no Redux/Zustand for now
- Styling: CSS modules, one `.module.css` file per component
- Testing (once set up): one test file per component in `src/components/__tests__/`; test behavior, not implementation

## Architectural notes
- `src/hooks/` for reusable logic (e.g., `useLocalStorage`) — directory doesn't exist yet, create when adding the first hook
- `src/types/` for shared TypeScript interfaces — directory doesn't exist yet, create when adding the first shared type
- Lint config (`.oxlintrc.json`) enables react/typescript/oxc plugins with `react/rules-of-hooks` as error
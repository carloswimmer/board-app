# Unit testing plan: 100% coverage (`src/`)

This document mirrors the approved testing strategy for this repo. Keep it updated when tooling or scope changes.

## Package manager (pnpm)

This project uses **pnpm** (see `pnpm-lock.yaml`). Use **pnpm only** for installs and scripts — not npm or yarn.

| Action | Command |
|--------|---------|
| Install dependencies | `pnpm install` |
| Add dev dependency | `pnpm add -D <package>` |
| Run tests (watch) | `pnpm test` |
| Run tests once (CI) | `pnpm run test:run` |
| Run tests with coverage | `pnpm run test:coverage` |
| Run a binary once | `pnpm exec <command>` (replaces `npx`) |
| Ad-hoc package runner | `pnpm dlx <package>` |

## Scope

- **In coverage thresholds:** all `src/**/*.ts` and `src/**/*.tsx` except `src/api/db/seed.ts`.
- **Out of coverage gates:** root `next.config.ts`, `drizzle.config.ts`, and other non-`src/` files.

## Tooling

| Piece | Choice | Role |
|--------|--------|------|
| Runner | Vitest | TS-native runner |
| Coverage | `@vitest/coverage-v8` | Enforce thresholds on the include glob |
| DOM / React | `@testing-library/react` + `@testing-library/user-event` | Components and hooks |
| Environment | `jsdom` (or `happy-dom`) for UI; `node` for API-only tests | Optional split via Vitest projects |

Scripts live in `package.json` and are always invoked with **pnpm** (see table above).

Vitest config (repo root) should include: `test` match for `**/*.{test,spec}.{ts,tsx}` under `src/`, `coverage.provider` v8, `coverage.include` for `src/**/*.{ts,tsx}`, exclude `src/api/db/seed.ts`, `coverage.thresholds` at 100% for lines/functions/branches/statements, and `coverage.all: true`.

## Cross-cutting test setup

- Set `process.env` / `vi.stubEnv` before modules that parse env at import (`src/api-env.ts`, `src/client-env.ts`); use `vi.resetModules()` + dynamic `import()` when needed.
- Mock `next/cache`, `next/headers`, and neutralize `server-only` for server `src/http` tests.
- Stub global `fetch` for HTTP client tests.
- Mock `auth.api.getSession` for Hono session behavior without real OAuth.

## Implementation order

1. Tooling + global setup + env/fetch mocks.
2. Pure modules and Zod schemas.
3. Hono routes with mocked `db`.
4. `src/http` with Next mocks.
5. Hooks and components.
6. `src/app` pages, layouts, loadings, route bridge, OpenGraph.
7. Raise coverage thresholds to 100% and close gaps.

## CI (optional)

Use **pnpm** in the pipeline, e.g. `pnpm install --frozen-lockfile` then `pnpm run test:coverage` or `pnpm exec vitest run --coverage`.

## Risks

| Risk | Mitigation |
|------|------------|
| `"use cache"` / RSC | Mock `next/cache`; keep server tests in `node` project |
| Env parse on import | Centralize `vi.stubEnv` + `vi.resetModules()` |
| React Query timing | `waitFor`; fake timers only when needed |
| Branch coverage on large pages | Test each branch; extract helpers only if unavoidable |

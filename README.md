# Board App

<p align="center">
  <strong>Kanban-style board for tracking issues — backlog, to-do, in progress, and done.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

---

A web app focused on **clarity and productivity**: see work flow in columns, open each issue’s detail page, comment, and react with likes. Dark UI, built-in search, and data persisted in PostgreSQL.

This is a **public** repository — clone it, run it locally, and use it as a reference for your own projects.

> **Architecture note:** the backend bundled with this repo is **temporary** and meant for development and learning. The plan is to replace it with a **Java Spring** API later — the frontend is structured so it can evolve in that direction without tying this README to internal implementation details.

---

## Features

| Area | What you get |
|------|----------------|
| **Board** | Kanban columns with issues grouped by status |
| **Search** | Text filter on the board listing |
| **Issue** | Detail page with title, description, and status |
| **Comments** | Comments list and flow per issue |
| **Interactions** | Likes with UI feedback |
| **Authentication** | GitHub sign-in (Better Auth) |

---

## Tech stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI:** React 19, Tailwind CSS 4, [Lucide](https://lucide.dev/) icons
- **Client data:** [TanStack Query](https://tanstack.com/query) for caching and mutations
- **URL state:** [nuqs](https://nuqs.47ng.com/) for search params
- **Database:** PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/)
- **Auth:** [Better Auth](https://www.better-auth.com/) + GitHub OAuth
- **Tooling:** [Biome](https://biomejs.dev/) for linting and formatting

---

## Prerequisites

- **Node.js** (a version compatible with the project — current LTS is recommended)
- **pnpm** (this project uses `pnpm-lock.yaml`)
- **Docker** (optional but recommended) to run PostgreSQL locally

---

## Getting started

### 1. Clone and install

This repository is **public**. Clone it and install dependencies:

```bash
git clone https://github.com/carloswimmer/board-app.git
cd board-app
pnpm install
```

### 2. Database (PostgreSQL)

With Docker:

```bash
docker compose up -d
```

This starts Postgres on port **5432** with database `board-db` (see `docker-compose.yml` for user and password).

### 3. Environment variables

Create a `.env` or `.env.local` file in the project root with at least:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection URL (e.g. `postgres://postgres:postgres@localhost:5432/board-db`) |
| `BETTER_AUTH_SECRET` | Better Auth secret (minimum 32 characters) |
| `BETTER_AUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app credentials |

Optional for the client:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API URL used by the browser (default: `http://localhost:3000`) |

### 4. Migrations and seed (optional)

```bash
pnpm db:migrate
pnpm db:seed
```

### 5. Development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Start server after build |
| `pnpm lint` | Run Biome checks |
| `pnpm format` | Format with Biome |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push schema (dev) |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm db:seed` | Seed sample data |

---

## Project layout (overview)

- `src/app/` — Next.js routes and layouts (board, issue, API route handler)
- `src/components/` — Reusable UI components
- `src/http/` — Client HTTP calls to the app-exposed backend
- `src/lib/` — Providers and helpers (e.g. React Query)
- `src/api/` — Server layer (routes, auth, database) — internal details intentionally omitted here

---

## License

This project is released under the [MIT License](LICENSE).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo structure

pnpm workspaces (`pnpm-workspace.yaml`) with two packages:
- `client/` — React 19 + Vite 8 SPA
- `server/` — NestJS 10 REST API

Run `pnpm install` from the **root** to install all workspace deps.

## Commands

From the root:
```bash
pnpm dev          # start client (port 5173) and server (port 3000)
pnpm dev:client   # client only
pnpm dev:server   # server only
```

Inside `client/`:
```bash
pnpm dev      # Vite dev server with HMR
pnpm build    # production build → dist/
pnpm preview  # serve production build
pnpm lint     # ESLint
```

Inside `server/`:
```bash
pnpm start:dev    # NestJS with file-watch
pnpm build        # tsc → dist/
pnpm start:prod   # run compiled dist/main.js
pnpm lint         # ESLint
```

## Environment variables

Copy `.env.example` in each package before running:
- `client/.env.example` — `VITE_API_URL`
- `server/.env.example` — `PORT`, `CLIENT_URL` (used for CORS whitelist)

## TypeScript

Both `client/` and `server/` are fully TypeScript. The client uses a split tsconfig (`tsconfig.app.json` for `src/`, `tsconfig.node.json` for `vite.config.ts`). Run `tsc --noEmit` inside either package to type-check without building.

## Client architecture

**Structure** — domain-based. Each feature owns its own components and hooks. Truly shared UI and utilities live in `shared/`.

```
src/
├── features/<domain>/
│   ├── components/   ← components used only by this feature
│   ├── hooks/        ← TanStack Query hooks + local state hooks for this feature
│   └── <Domain>Page.tsx
├── shared/
│   ├── components/   ← generic UI primitives (Button, Input, …); barrel-exported from index.ts
│   ├── api/          ← axios client + per-resource fetch functions
│   └── hooks/        ← query hooks shared across multiple features
└── App.tsx           ← QueryClientProvider + BrowserRouter + route definitions
```

**Routing** — React Router v7. Routes are defined directly in `App.tsx`; each feature exposes a `<Domain>Page.tsx` as its route entry point.

**Data fetching** — TanStack Query v5. `QueryClient` is created once in `App.tsx`. Hooks follow the pattern in `shared/hooks/useHealth.ts`: import raw fetch fn from `shared/api/`, wrap in `useQuery`/`useMutation`.

**API layer:**
- `shared/api/client.ts` — Axios instance pointed at `VITE_API_URL`, single response interceptor
- `shared/api/<resource>.ts` — typed fetch functions that return `res.data`

**Styling** — Tailwind v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed). `@import "tailwindcss"` is at the top of `src/index.css`.

**UI libraries** — [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind). Components live in `src/shared/components/ui/` and are barrel-exported from `src/shared/components/index.ts`. Add new components with `pnpm dlx shadcn@latest add <name>`. The `cn()` utility is at `src/shared/lib/utils.ts`. Icons via `lucide-react` (installed at root).

## Server architecture

Global API prefix: `/api`. All routes are therefore `/api/<path>`.

CORS is handled by a whitelist middleware at `src/common/middleware/cors.middleware.ts` — add allowed origins to `CLIENT_URL` env var (single value today; extend the whitelist array as needed). The middleware is applied in `main.ts` before route registration.

Feature modules go under `src/<feature>/` following NestJS conventions (`module`, `controller`, `service`).

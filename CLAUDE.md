# RS Flow

Trading Journal & Analytics platform for traders: import/log trades, review performance, identify
patterns, track P&L. Multi-user, each user's data fully isolated. Broker integrations (e.g. Colmex
Pro) and an AI insights layer are planned but not yet implemented — the architecture must stay
ready for them without building them prematurely.

Full architecture rationale lives in `.claude/plans/cozy-snuggling-sundae.md` (Stack choice,
Entities, Relationships, phased roadmap). Read it for the "why"; this file is the "how to work here."

## Stack

- **Monorepo**: pnpm workspaces — `apps/api`, `apps/web`, `packages/shared`
- **Frontend**: React 19 + TypeScript + Vite, Tailwind v4, shadcn/ui-style components, TanStack
  Query, TanStack Table, React Router v7, Zustand, Recharts
- **Backend**: Node + TypeScript + Express, Prisma ORM, Zod, JWT (httpOnly cookies) + bcryptjs
- **Database**: PostgreSQL (local dev via `docker-compose.yml`, host port **5433** — 5432 is used
  by another project's container on this machine, don't change this back)
- **Testing**: Vitest

## Project structure

```
apps/api/src/modules/<name>/    routes → controller → service → prisma
apps/api/src/common/            error handling, validation, logging, async wrapper
apps/api/prisma/schema.prisma   single source of truth for the DB schema
apps/web/src/pages/             one file per route, thin — composition only
apps/web/src/features/<name>/   api.ts + hooks.ts (TanStack Query) per domain
apps/web/src/components/ui/     shared design system primitives
apps/web/src/app/               router, layout, query client, protected-route
packages/shared/src/            Zod schemas + types shared between api and web
```

New backend feature = new module folder under `apps/api/src/modules/`, same shape as `auth/` and
`trading-accounts/`. New frontend domain = new folder under `apps/web/src/features/`.

## Dev commands

```
docker compose up -d                 # start local Postgres (port 5433)
pnpm install                         # install all workspace deps
pnpm --filter @rs-flow/api dev       # run API (localhost:4000)
pnpm --filter @rs-flow/web dev       # run web (localhost:5173)
pnpm --filter @rs-flow/api prisma:migrate   # create+apply a migration after schema.prisma changes
pnpm --filter @rs-flow/api prisma:studio    # inspect DB visually
pnpm typecheck / pnpm lint / pnpm test      # run across all workspaces
```

Env files: copy `apps/api/.env.example` → `.env` and `apps/web/.env.example` → `.env`. Never commit
`.env`, never put secrets in code.

## Conventions

- **Database**: every user-owned table carries `userId` (direct or via its parent) and every query
  must filter by it — there is no other isolation boundary between users. Money/price fields use
  Prisma `Decimal`, not `Float`. Schema changes go through `prisma migrate dev`, never hand-edited SQL.
- **API**: REST under `/api/<resource>`, JSON responses. Errors are always
  `{ error: { code, message, details? } }` — throw `AppError` (see `common/app-error.ts`), never
  hand-roll a `res.status().json()` error. Validate all input with Zod (`validateBody`/`validateQuery`).
  List endpoints must paginate — never return an unbounded `findMany`.
- **Auth**: `requireAuth` middleware injects `req.userId`; every non-auth route must use it. Domain/
  calculation logic (P&L, analytics, import normalization) belongs in pure, DB-free functions so it
  stays unit-testable — see the pattern this is heading toward in `modules/analytics` once it exists.
- **Frontend**: Server state goes through TanStack Query only, never `useEffect` + manual fetch. Every
  data view needs explicit loading / error / empty states (see `trading-accounts-page.tsx` for the
  pattern). Reuse `components/ui/*` before adding a new primitive.
- **Broker integrations**: go through the `BrokerAdapter` interface (`modules/import/adapters/`) — the
  rest of the app never depends on a specific broker's format. Do not invent a broker's API/export
  format from guesswork; it must come from that broker's real, verified documentation.

## Security

No plaintext passwords (bcrypt only), no secrets in code or git, no `dotenv` values hardcoded as
fallbacks in source. Cookies are httpOnly + sameSite. CORS is locked to `WEB_ORIGIN`.

## Working efficiently

- Read only the files relevant to the current task; don't re-scan the whole repo after small edits.
- Don't refactor unrelated code, don't add dependencies that aren't needed for the task at hand.
- Match existing module structure instead of introducing a new pattern for one feature.

## Autonomy

Proceed without asking for routine, reversible engineering decisions (file/module creation, running
installs/builds/tests, following an established pattern). Stop and ask before: destructive git/DB
operations, schema changes with real data at stake, adding a new major dependency or architectural
pattern not already established here, anything touching auth/security assumptions, or implementing a
broker integration without confirmed official documentation for that broker.

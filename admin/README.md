# Abadan Haly Admin

Stack: Next.js 14 (App Router) + TypeScript, Tailwind + shadcn/ui, Prisma, NextAuth, next-intl

## Setup

1. Install pnpm and Node 20
2. Install deps:

```bash
pnpm install
```

3. Create `.env` (dev SQLite):

```bash
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET=dev-secret
NEXTAUTH_URL=http://localhost:3000
DEFAULT_LOCALE=tk
SUPPORTED_LOCALES=tk,ru,en,de
STORAGE_PROVIDER=local
PREVIEW_SECRET=dev-preview
```

4. Migrate & seed:

```bash
pnpm prisma:migrate
pnpm run seed
```

5. Run dev:

```bash
pnpm dev
```

Users:
- admin@abadan.haly / AdminPassw0rd!! (ADMIN)
- editor@abadan.haly / AdminPassw0rd!! (EDITOR)
- translator@abadan.haly / AdminPassw0rd!! (TRANSLATOR)
- manager@abadan.haly / AdminPassw0rd!! (STOREMANAGER)

## Scripts
- dev, build, start
- typecheck, lint
- prisma:generate, prisma:migrate, prisma:studio
- seed

## Tests
- Unit: `pnpm exec vitest`
- E2E: `pnpm exec playwright test` (requires server running)

## Deploy
- Set envs: DATABASE_URL (Postgres), NEXTAUTH_SECRET, NEXTAUTH_URL, DEFAULT_LOCALE, SUPPORTED_LOCALES, STORAGE_PROVIDER, and optional S3/Blob values.
- Build command: `pnpm install && pnpm run build`

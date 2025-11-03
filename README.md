# Abadan Haly — Website

Modern Next.js website with admin panel (Products + Translations), AR/3D viewer, and multi-language (EN/TK/RU).

## Tech
- Next.js (App Router), TypeScript, Tailwind
- Prisma (SQLite dev / Postgres prod)
- Git LFS for /public/Images/Halylar/** product assets

## Local Dev
1) Copy .env.example to .env and fill secrets.
2) npm i
3) npx prisma migrate dev
4) npm run dev

## Build
npm run build && npm start

## Deploy
- Add CI/CD via GitHub Actions (see .github/workflows/ci.yml).
- Set repository secrets (ADMIN_PASSWORD, DATABASE_URL, MAIL_*).
- Point your host to this repo; configure environment variables on host.

## Asset policy
All product images live under /public/Images/Halylar/** and are tracked via Git LFS.

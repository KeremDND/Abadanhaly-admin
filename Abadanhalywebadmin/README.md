# Abadan Haly Admin Panel

A production-ready admin dashboard for managing the Abadan Haly website content, built with Next.js, Prisma, and NextAuth.

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Prisma** ORM with SQLite (dev) / PostgreSQL (prod)
- **NextAuth** for authentication & RBAC
- **Zod** for validation
- **Tailwind CSS** + **sonner** for toasts
- **React Hook Form** for complex forms

## Features

- ✅ **Pages Management**: Edit content blocks with live preview
- ✅ **Products CRUD**: Import from images, drag-drop uploads, manage visibility
- ✅ **Translations (i18n)**: Inline editing for TK/RU/EN across all pages
- ✅ **Stores Management**: Edit locations, contact info, maps (Gurtly removed)
- ✅ **Settings**: Global site configuration
- ✅ **Live Updates**: All changes revalidate and update the public site instantly
- ✅ **Toast Notifications**: Bottom-center feedback for every action

## Setup

### 1. Install Dependencies

```bash
cd admin
pnpm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-strong-secret-here
ADMIN_EMAIL=admin@abadanhaly.com
ADMIN_PASSWORD=Abadanhaly2016
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Database Setup

```bash
# Run migrations
pnpm exec prisma migrate dev

# Generate Prisma Client
pnpm exec prisma generate

# Seed data
npx tsx prisma/seed-pages.ts
npx tsx prisma/seed-stores.ts
npx tsx prisma/seed-translations.ts
npx tsx prisma/seed-products.ts
```

### 4. Start Dev Server

```bash
pnpm dev --port 3002
```

Visit: **http://localhost:3002/signin**

## Admin Credentials

- **Email**: admin@abadanhaly.com
- **Password**: Abadanhaly2016

## Admin Routes

- `/admin` — Dashboard home
- `/admin/pages` — Manage pages (home, gallery, about, collaboration)
- `/admin/pages/[slug]` — Edit page blocks
- `/admin/products` — Product listing with images
- `/admin/products/[id]` — Edit product (basics, images)
- `/admin/translations` — Inline i18n editor (
# Admin Panel Setup Guide

## Overview

The admin panel is a secure Next.js application for managing products and translations for the Abadan Haly website.

## Features

- ✅ **Password-based Authentication** - Simple httpOnly cookie session
- ✅ **Products Management** - Full CRUD with image upload and Sharp processing
- ✅ **Translations Management** - Grouped editable grid by page/section with TK/RU/EN
- ✅ **Publish & Status** - Revalidation controls for public pages
- ✅ **Auto-revalidation** - Automatic cache invalidation after updates

## Setup Instructions

### 1. Environment Variables

Create `.env.local` in the `admin/` folder:

```env
ADMIN_PASSWORD=your-secure-password-here
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_IMAGE_BASE=/Images/Halylar
```

### 2. Database Setup

```bash
cd admin
pnpm install
pnpm prisma migrate dev -n "admin-products-translations"
pnpm prisma generate
```

### 3. Seed Products

```bash
# Seed products from data/products.ts and image scan
pnpm seed:products
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit: **http://localhost:3000/admin/login**

## Admin Routes

- `/admin` - Main admin page (Products tab)
- `/admin/login` - Login page
- `/admin/translations` - Translations management
- `/admin/publish` - Publish & Status

## API Routes

- `POST /api/admin/login` - Login with password
- `POST /api/admin/logout` - Logout
- `GET /api/admin/products` - List products (with filters)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Soft delete (active=false)
- `POST /api/admin/products/:id/images` - Upload images
- `GET /api/admin/translations` - Get translations by page
- `POST /api/admin/translations/batch` - Batch upsert translations
- `POST /api/admin/revalidate` - Revalidate routes

## Usage

### Products Management

1. Navigate to `/admin` (default Products tab)
2. Search and filter products by name, SKU, category, tags, or active status
3. Click "New Product" to create a product
4. Click edit icon to modify existing product
5. Upload images (max 10, 5MB each) - automatically generates WebP
6. Changes automatically revalidate `/gallery` and `/` routes

### Translations Management

1. Navigate to `/admin/translations`
2. Select a page from the top tabs (Home, Gallery, About, Collaboration, Header, Footer)
3. Edit translations inline in the grouped grid
4. Each section shows TK, RU, EN columns
5. Enable "Autosave" for automatic saving or click "Save Changes" manually
6. Changes automatically revalidate the affected page route

### Publish & Status

1. Navigate to `/admin/publish`
2. Click "Revalidate All" to update all public pages
3. Or click individual route revalidation buttons
4. Useful after bulk changes or manual cache refresh

## Database Schema

### Product Model

```prisma
model Product {
  id          String   @id @default(cuid())
  sku         String   @unique
  name        String
  slug        String   @unique
  category    String   // Grey, Dark Grey, Cream, Red, Green
  tags        String   // JSON: ["new","best-seller","recommended"]
  colors      String   // JSON: ["grey","cream","red","green"]
  imagePath   String   // Primary image path
  images      String   // JSON: Additional images array
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Translation Model

```prisma
model Translation {
  id        String   @id @default(cuid())
  page      String   // 'home' | 'gallery' | 'about' | 'collaboration' | 'header' | 'footer'
  section   String   // e.g., 'hero.title', 'milestones.record'
  locale    String   // 'en' | 'tk' | 'ru'
  value     String
  updatedAt DateTime @updatedAt
  createdAt DateTime @default(now())
  @@unique([page, section, locale], name: "page_section_locale")
}
```

## Security

- All `/admin/**` routes require authentication
- All `/api/admin/**` routes require authentication
- Password validation against `ADMIN_PASSWORD` env var
- Rate limiting on login (5 attempts per 10 minutes per IP)
- HttpOnly cookie with SameSite=Lax, 12h maxAge

## Image Upload

- Accepts: `.jpg`, `.jpeg`, `.png`, `.webp`
- Max size: 5MB per file
- Max files: 1 per product
- Automatic WebP generation alongside original
- Saved to `/public/Images/Halylar/<category>/`

## Notes

- Products are soft-deleted (active=false) to preserve data
- Translations use upsert (create or update) for batch operations
- All changes automatically revalidate affected public pages
- Seed script migrates products from `data/products.ts` and scans image folders


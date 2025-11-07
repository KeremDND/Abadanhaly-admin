# Architecture Documentation

## Project Overview

Abadan Haly is a modern carpet manufacturing company website with a comprehensive admin panel for content management. The project consists of two main applications:

1. **Main Website** (Vite + React) - Public-facing website
2. **Admin Panel** (Next.js) - Content management system

## Technology Stack

### Main Website
- **Framework**: Vite + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **i18n**: i18next with react-i18next
- **3D/AR**: Three.js, @google/model-viewer
- **UI Components**: Radix UI, Lucide Icons
- **Build Tool**: Vite

### Admin Panel
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Prisma ORM (SQLite dev, PostgreSQL-ready)
- **Authentication**: Password-based with bcryptjs
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons

## Project Structure

```
project/
├── admin/                    # Admin panel (Next.js)
│   ├── prisma/              # Database schema & migrations
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── api/         # API routes
│   │   │   └── login/       # Login page
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities (auth, prisma, utils)
│   └── package.json
│
├── src/                      # Main website (Vite + React)
│   ├── components/          # React components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   ├── home/           # Homepage components
│   │   ├── gallery/        # Gallery components
│   │   ├── collaboration/  # Collaboration page components
│   │   ├── about/          # About page components
│   │   └── shared/         # Shared components
│   ├── contexts/           # React contexts (Auth, Language)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities (i18n, etc.)
│   ├── styles/             # Global styles
│   └── main.tsx            # Entry point
│
├── public/                  # Static assets
│   ├── Images/            # Images (product images, page images)
│   ├── locales/           # Translation files (JSON)
│   └── videos/            # Video assets
│
├── data/                    # Data files
│   └── products.ts         # Product data definitions
│
└── scripts/                 # Build & utility scripts
```

## Architecture Patterns

### Component Organization
- **Feature-based**: Components organized by feature/page
- **Shared components**: Reusable components in `shared/` directory
- **Layout components**: Header, Footer in `layout/` directory

### State Management
- **React Context**: For global state (Auth, Language)
- **Local State**: useState/useReducer for component-specific state
- **Server State**: Next.js Server Components for admin panel

### Internationalization (i18n)
- **Centralized**: All i18n logic in `src/lib/i18n.ts`
- **Translation Files**: JSON files in `public/locales/`
- **Supported Locales**: Turkmen (tk), Russian (ru), English (en)
- **Default Locale**: Turkmen (tk)

### Data Flow

#### Main Website
1. Static data from `data/products.ts`
2. Translations from `public/locales/*.json`
3. Images from `public/Images/`

#### Admin Panel
1. Database (Prisma) for products and translations
2. API routes for CRUD operations
3. Server Components for data fetching

## API Architecture

### Admin Panel API Routes

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

#### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

#### Translations
- `GET /api/translations?page=[page]` - Get translations for a page
- `POST /api/translations` - Batch update translations

## Database Schema

### Models

#### Admin
- `id`: String (CUID)
- `username`: String (unique)
- `password`: String (hashed)
- `createdAt`, `updatedAt`: DateTime

#### Product
- `id`: String (CUID)
- `name`: String
- `sku`: String? (unique, optional)
- `category`: String? (optional)
- `color`: String? (optional)
- `image`: String
- `description`: String? (optional)
- `active`: Boolean (default: true)
- `createdAt`, `updatedAt`: DateTime

#### Translation
- `id`: String (CUID)
- `page`: String
- `section`: String
- `key`: String
- `locale`: String (tk, ru, en)
- `value`: String
- `createdAt`, `updatedAt`: DateTime
- **Unique Constraint**: `[page, section, key, locale]`
- **Indexes**: `[page, section]`, `[locale]`

## Security

### Authentication
- Password-based authentication with bcryptjs
- Session management via cookies
- Protected routes via Next.js middleware

### Environment Variables
- `ADMIN_PASSWORD`: Admin password (hashed)
- `DATABASE_URL`: Database connection string
- `NEXT_PUBLIC_SITE_URL`: Public website URL

## Build & Deployment

### Main Website
- **Dev**: `npm run dev` (Vite dev server on port 5173)
- **Build**: `npm run build` (Vite build)
- **Preview**: `npm run preview` (Preview production build)

### Admin Panel
- **Dev**: `npm run dev` (Next.js dev server on port 3000)
- **Build**: `npm run build` (Next.js build)
- **Start**: `npm start` (Production server)

## Asset Management

### Images
- Product images: `public/Images/Halylar/`
- Page images: `public/Images/page-images/`
- Optimized versions: `public/cdn/Halylar/` (avif, webp, jpg)

### Git LFS
- Large binary files tracked via Git LFS
- Image formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`

## Performance Optimizations

### Main Website
- Code splitting with React.lazy()
- Image optimization with responsive images
- 3D model lazy loading
- Translation lazy loading

### Admin Panel
- Server Components for reduced client bundle
- API route optimization
- Database query optimization

## Development Workflow

1. **Setup**: Install dependencies for both projects
2. **Database**: Run Prisma migrations and seed
3. **Development**: Run both dev servers concurrently
4. **Testing**: Test features in both environments
5. **Build**: Build both projects for production
6. **Deploy**: Deploy to hosting platform

## Future Improvements

- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Implement image upload in admin panel
- [ ] Add product image management
- [ ] Implement caching strategy
- [ ] Add analytics
- [ ] Implement search functionality
- [ ] Add user roles and permissions


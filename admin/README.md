# Abadan Haly Admin Panel

A modern, practical admin panel for managing the Abadan Haly website.

## Features

- **Products Management** - Full CRUD operations for products
- **Translations Management** - Manage website translations for all languages (EN/TK/RU)
- **Simple Authentication** - Password-based login
- **Clean UI** - Modern, responsive interface

## Setup

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Environment Variables

Create a `.env` file in the `admin/` directory:

```env
DATABASE_URL="file:./prisma/dev.db"
ADMIN_PASSWORD=your-secure-password-here
NEXT_PUBLIC_SITE_URL=http://localhost:5173
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (imports translations from public/locales)
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000/login**

Default password: `admin123` (change in `.env`)

## Project Structure

```
admin/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding script
├── src/
│   ├── app/
│   │   ├── admin/          # Admin pages
│   │   ├── api/            # API routes
│   │   ├── login/          # Login page
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   └── lib/                # Utilities (auth, prisma, etc.)
└── package.json
```

## API Routes

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Translations
- `GET /api/translations?page=[page]` - Get translations for a page
- `POST /api/translations` - Batch update translations

## Development

### Database Management

```bash
# Open Prisma Studio (database GUI)
npm run db:studio

# Create new migration
npm run db:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Building for Production

```bash
npm run build
npm start
```

## Notes

- The admin panel uses SQLite for development (can be switched to PostgreSQL for production)
- Translations are automatically imported from `public/locales/*.json` during seeding
- All routes under `/admin` are protected and require authentication
- Session cookies are used for authentication (httpOnly, secure in production)


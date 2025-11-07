# Quick Start Guide

## Installation

1. **Navigate to admin directory:**
   ```bash
   cd admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ADMIN_PASSWORD=your-secure-password-here
   NEXT_PUBLIC_SITE_URL=http://localhost:5173
   ```

4. **Setup database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed database (imports translations from public/locales)
   npm run db:seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Access admin panel:**
   - URL: http://localhost:3000/login
   - Default password: `admin123` (or your `.env` password)

## Features

- ✅ **Products Management** - Full CRUD operations
- ✅ **Translations Management** - Manage EN/TK/RU translations
- ✅ **Simple Authentication** - Password-based login
- ✅ **Clean UI** - Modern, responsive interface

## Next Steps

1. Change the default password in `.env`
2. Start managing products and translations
3. Customize the admin panel as needed

## Troubleshooting

- **Database errors:** Run `npm run db:migrate` again
- **Missing translations:** Run `npm run db:seed` to import from `public/locales`
- **Port conflicts:** Change port in `package.json` scripts or use `PORT=3001 npm run dev`


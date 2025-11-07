# Deployment Guide

## Overview

This guide covers deploying both the main website and admin panel to production.

---

## Prerequisites

- Node.js 20+ installed
- Git LFS installed and configured
- Database (PostgreSQL for production)
- Hosting platform account (Vercel, Netlify, Railway, etc.)

---

## Environment Setup

### Main Website

Create `.env` file in project root:

```env
# No environment variables required for static build
# All configuration is in code
```

### Admin Panel

Create `.env` file in `admin/` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Authentication
ADMIN_PASSWORD="your-secure-password-here"

# Public URL
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

**Important**: Never commit `.env` files to Git!

---

## Build Process

### Main Website

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output: dist/ directory
```

The build output is in `dist/` directory and can be deployed to any static hosting service.

### Admin Panel

```bash
cd admin

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Build for production
npm run build

# Start production server
npm start
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js Admin)

#### Admin Panel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd admin
vercel
```

3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_SITE_URL`

#### Main Website

1. Deploy `dist/` directory to Vercel:
```bash
vercel --prod dist
```

Or connect GitHub repo and set build command:
- Build command: `npm run build`
- Output directory: `dist`

---

### Option 2: Netlify

#### Main Website

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod --dir=dist
```

Or connect GitHub repo and configure:
- Build command: `npm run build`
- Publish directory: `dist`

#### Admin Panel

Netlify supports Next.js, but Vercel is recommended for Next.js apps.

---

### Option 3: Railway

#### Admin Panel

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Deploy:
```bash
cd admin
railway up
```

3. Set environment variables in Railway dashboard

---

### Option 4: Self-Hosted

#### Main Website

1. Build:
```bash
npm run build
```

2. Serve `dist/` with any static file server:
   - Nginx
   - Apache
   - Node.js (serve package)
   - Python (http.server)

#### Admin Panel

1. Build:
```bash
cd admin
npm run build
```

2. Run production server:
```bash
npm start
```

3. Use process manager (PM2):
```bash
npm install -g pm2
pm2 start npm --name "admin-panel" -- start
pm2 save
pm2 startup
```

---

## Database Setup

### Development (SQLite)

SQLite is used by default in development. No setup required.

### Production (PostgreSQL)

1. Create PostgreSQL database
2. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

3. Run migrations:
```bash
cd admin
npm run db:migrate
```

4. Seed database (optional):
```bash
npm run db:seed
```

---

## Git LFS Setup

Ensure Git LFS is properly configured for large files:

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.jpg"
git lfs track "*.jpeg"
git lfs track "*.png"
git lfs track "*.webp"
git lfs track "*.avif"
git lfs track "*.mp4"

# Commit .gitattributes
git add .gitattributes
git commit -m "Configure Git LFS"
```

---

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-website:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Deploy to hosting
        # Add deployment steps here

  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd admin && npm ci
      - run: cd admin && npm run build
      - name: Deploy to hosting
        # Add deployment steps here
```

---

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong, unique passwords
- [ ] Enable HTTPS/SSL
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting
- [ ] Regular security updates

---

## Monitoring

### Recommended Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Analytics**: Google Analytics, Plausible
- **Performance**: Lighthouse CI, WebPageTest

---

## Backup Strategy

### Database Backups

```bash
# PostgreSQL backup
pg_dump -h host -U user -d dbname > backup.sql

# Restore
psql -h host -U user -d dbname < backup.sql
```

### Automated Backups

Set up cron job or scheduled task for regular backups.

---

## Troubleshooting

### Build Failures

1. Check Node.js version (20+)
2. Clear `node_modules` and reinstall
3. Check for TypeScript errors
4. Verify environment variables

### Database Connection Issues

1. Verify `DATABASE_URL` format
2. Check database credentials
3. Ensure database is accessible
4. Check firewall rules

### Image Loading Issues

1. Verify Git LFS is configured
2. Check image paths
3. Ensure images are in `public/` directory
4. Check file permissions

---

## Post-Deployment

1. Test all functionality
2. Verify translations load correctly
3. Check image loading
4. Test admin panel login
5. Verify API endpoints
6. Check mobile responsiveness
7. Test performance (Lighthouse)

---

## Rollback Procedure

1. Revert to previous Git commit
2. Rebuild and redeploy
3. Restore database backup if needed

---

## Support

For issues or questions:
- Check documentation
- Review error logs
- Check GitHub issues
- Contact development team


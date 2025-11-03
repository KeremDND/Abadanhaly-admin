# Build Verification Checklist

This document lists all required libraries and build verification steps for the Abadan Haly project on macOS.

## ✅ Required System Tools

- [ ] **Node.js 18+** - JavaScript runtime
- [ ] **pnpm** - Package manager (or npm as fallback)
- [ ] **Git** - Version control (usually pre-installed on macOS)

## ✅ Main Project Dependencies

Location: `/Users/keremjumalyyev/Desktop/project/`

### Core Dependencies
- ✅ React 18.3.1
- ✅ React DOM 18.3.1
- ✅ Vite 5.4.2
- ✅ TypeScript 5.5.3

### UI Libraries
- ✅ @radix-ui/react-accordion 1.2.12
- ✅ @radix-ui/react-dialog 1.1.15
- ✅ @radix-ui/react-select 2.2.6
- ✅ framer-motion 12.23.12
- ✅ lucide-react 0.344.0
- ✅ Tailwind CSS 3.4.1

### 3D/AR Libraries
- ✅ three 0.172.0
- ✅ @google/model-viewer 4.1.0

### Internationalization
- ✅ i18next 25.4.2
- ✅ react-i18next 15.7.3
- ✅ i18next-browser-languagedetector 8.2.0
- ✅ i18next-http-backend 3.0.2

### Image Processing
- ✅ sharp 0.34.3 (Native module - requires compilation)

### Build Tools
- ✅ eslint 9.9.1
- ✅ terser 5.43.1
- ✅ postcss 8.4.35
- ✅ autoprefixer 10.4.18

### Utilities
- ✅ fast-glob 3.3.3
- ✅ slugify 1.6.6
- ✅ nodemailer 7.0.10

**Build Command:** `pnpm build` or `npm run build`

## ✅ Admin Panel Dependencies

Location: `/Users/keremjumalyyev/Desktop/project/admin/`

### Core Framework
- ✅ Next.js 15.5.4
- ✅ React 19.1.0
- ✅ React DOM 19.1.0
- ✅ TypeScript 5.x

### Database
- ✅ Prisma 6.17.0
- ✅ @prisma/client 6.17.0
- ✅ @next-auth/prisma-adapter 1.0.7

### Authentication
- ✅ NextAuth 4.24.11
- ✅ bcryptjs 3.0.2
- ✅ jose 6.1.0

### UI Components
- ✅ @radix-ui/react-dialog 1.1.15
- ✅ @radix-ui/react-dropdown-menu 2.1.16
- ✅ @radix-ui/react-label 2.1.7
- ✅ @radix-ui/react-select 2.2.6
- ✅ @radix-ui/react-slot 1.2.3
- ✅ @radix-ui/react-switch 1.2.6
- ✅ @radix-ui/react-tabs 1.1.13
- ✅ @radix-ui/react-tooltip 1.2.8
- ✅ lucide-react 0.545.0
- ✅ Tailwind CSS 4.x

### Internationalization
- ✅ next-intl 4.3.12

### Image Processing
- ✅ sharp 0.34.4 (Native module - requires compilation)

### Cloud Storage (optional)
- ✅ @aws-sdk/client-s3 3.907.0

### Validation
- ✅ zod 4.1.12

### Utilities
- ✅ class-variance-authority 0.7.1
- ✅ clsx 2.1.1
- ✅ cmdk 1.1.1
- ✅ file-type 21.0.0
- ✅ uuid 13.0.0
- ✅ swr 2.3.6
- ✅ sonner 2.0.7
- ✅ next-themes 0.4.6
- ✅ tailwind-merge 3.3.1

### Testing
- ✅ vitest 3.2.4
- ✅ @playwright/test 1.56.0
- ✅ @testing-library/react 16.3.0

**Build Command:** `pnpm build` or `npm run build`

## ✅ Abadanhalywebadmin Dependencies

Location: `/Users/keremjumalyyev/Desktop/project/Abadanhalywebadmin/`

### Core Framework
- ✅ Next.js 15.5.5
- ✅ React 19.1.0
- ✅ React DOM 19.1.0
- ✅ TypeScript 5.x

### Database
- ✅ Prisma 6.17.1
- ✅ @prisma/client 6.17.1

### Authentication
- ✅ NextAuth 4.24.11
- ✅ jsonwebtoken 9.0.2
- ✅ bcryptjs 3.0.2

### Forms
- ✅ react-hook-form 7.65.0
- ✅ @hookform/resolvers 5.2.2
- ✅ zod 4.1.12

### UI
- ✅ Tailwind CSS 4.x
- ✅ sonner 2.0.7

**Build Command:** `pnpm build` or `npm run build`

## 🔧 Native Modules (macOS-specific)

### Sharp
Sharp is a native module that requires compilation. If installation fails:

```bash
# Install VIPS (Image processing library)
brew install vips

# Rebuild sharp
cd project  # or admin, or Abadanhalywebadmin
pnpm rebuild sharp
```

### Prisma
Prisma generates platform-specific binaries. If Prisma client generation fails:

```bash
cd admin  # or Abadanhalywebadmin
pnpm prisma generate
```

## 📋 Verification Steps

1. **Check Node.js Installation**
   ```bash
   node --version  # Should be v18.x.x or higher
   ```

2. **Check pnpm Installation**
   ```bash
   pnpm --version  # Should show version number
   ```

3. **Install All Dependencies**
   ```bash
   ./scripts/setup-all-dependencies.sh
   ```

4. **Verify Builds**
   ```bash
   ./scripts/verify-builds.sh
   ```

5. **Manual Build Test**
   ```bash
   # Main project
   cd /Users/keremjumalyyev/Desktop/project
   pnpm build
   
   # Admin panel
   cd admin
   pnpm build
   
   # Abadanhalywebadmin
   cd ../Abadanhalywebadmin
   pnpm build
   ```

## 🎯 Quick Start

```bash
# 1. Navigate to project
cd /Users/keremjumalyyev/Desktop/project

# 2. Run setup script
./scripts/setup-all-dependencies.sh

# 3. Verify everything works
./scripts/verify-builds.sh

# 4. Start development
pnpm dev  # Main project
# OR
cd admin && pnpm dev  # Admin panel
```

## ⚠️ Common Issues

### Issue: "sharp: command not found" or Sharp build errors
**Solution:**
```bash
brew install vips
pnpm rebuild sharp
```

### Issue: "Prisma client not found"
**Solution:**
```bash
cd admin  # or Abadanhalywebadmin
pnpm prisma generate
```

### Issue: "node_modules not found"
**Solution:**
```bash
rm -rf node_modules
pnpm install
```

### Issue: Permission errors
**Solution:**
```bash
sudo chown -R $(whoami) node_modules
# OR
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

## ✅ Success Criteria

All builds should complete successfully:
- ✅ Main project builds without errors
- ✅ Admin panel builds without errors
- ✅ Abadanhalywebadmin builds without errors
- ✅ Prisma clients generated successfully
- ✅ TypeScript compilation passes
- ✅ No missing dependencies warnings


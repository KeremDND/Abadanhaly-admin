# Setup Instructions for Abadan Haly Project

This guide helps you set up all dependencies and verify builds on your new MacBook.

## Prerequisites

### 1. Install Node.js
The project requires **Node.js 18 or higher**.

**Option A: Using Homebrew (Recommended)**
```bash
brew install node
```

**Option B: Download from Official Website**
- Visit https://nodejs.org/
- Download and install the LTS version

**Verify installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show version number
```

### 2. Install pnpm
The project uses **pnpm** as the package manager.

```bash
npm install -g pnpm
```

**Verify installation:**
```bash
pnpm --version  # Should show version number
```

## Quick Setup

### Automated Setup Script
Run the automated setup script to install all dependencies:

```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh
```

This script will:
- ✅ Check Node.js and pnpm installation
- ✅ Install dependencies for the main project
- ✅ Install dependencies for the admin panel
- ✅ Install dependencies for Abadanhalywebadmin
- ✅ Generate Prisma clients

### Manual Setup

If you prefer to install manually:

#### 1. Main Project
```bash
cd /Users/keremjumalyyev/Desktop/project
pnpm install
```

#### 2. Admin Panel
```bash
cd /Users/keremjumalyyev/Desktop/project/admin
pnpm install
pnpm prisma generate
```

#### 3. Abadanhalywebadmin
```bash
cd /Users/keremjumalyyev/Desktop/project/Abadanhalywebadmin
pnpm install
pnpm prisma generate
```

## Verify Builds

After installing dependencies, verify that everything builds correctly:

```bash
./scripts/verify-builds.sh
```

Or verify manually:

### Main Project
```bash
cd /Users/keremjumalyyev/Desktop/project
pnpm build
```

### Admin Panel
```bash
cd /Users/keremjumalyyev/Desktop/project/admin
pnpm build
```

### Abadanhalywebadmin
```bash
cd /Users/keremjumalyyev/Desktop/project/Abadanhalywebadmin
pnpm build
```

## Database Setup

### Admin Panel Database
```bash
cd /Users/keremjumalyyev/Desktop/project/admin
pnpm prisma:migrate
pnpm seed
```

### Abadanhalywebadmin Database
```bash
cd /Users/keremjumalyyev/Desktop/project/Abadanhalywebadmin
pnpm prisma:migrate
```

## Required Libraries

### Main Project
- **React 18.3+** - UI framework
- **Vite 5.4+** - Build tool
- **TypeScript 5.5+** - Type safety
- **Three.js 0.172+** - 3D rendering
- **Tailwind CSS 3.4+** - Styling
- **Sharp 0.34+** - Image processing (native module)

### Admin Panel
- **Next.js 15.5+** - Framework
- **React 19.1+** - UI framework
- **Prisma 6.17+** - Database ORM
- **NextAuth 4.24+** - Authentication
- **Sharp 0.34+** - Image processing (native module)

### Abadanhalywebadmin
- **Next.js 15.5+** - Framework
- **React 19.1+** - UI framework
- **Prisma 6.17+** - Database ORM

## Troubleshooting

### Sharp Installation Issues
Sharp is a native module and may require additional setup on macOS:

```bash
# If Sharp fails to install
brew install vips
pnpm rebuild sharp
```

### Prisma Generation Issues
If Prisma client generation fails:

```bash
cd admin  # or Abadanhalywebadmin
pnpm prisma generate
```

### Node Modules Not Found
If you see "node_modules not found":

```bash
# Remove existing node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Permission Issues
If you encounter permission issues:

```bash
# Fix npm/pnpm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

## Development Commands

### Main Project
```bash
pnpm dev           # Start development server
pnpm build          # Build for production
pnpm preview        # Preview production build
```

### Admin Panel
```bash
cd admin
pnpm dev            # Start development server
pnpm build          # Build for production
pnpm start          # Start production server
```

### Abadanhalywebadmin
```bash
cd Abadanhalywebadmin
pnpm dev            # Start development server
pnpm build          # Build for production
pnpm start          # Start production server
```

## Project Structure

```
project/
├── package.json              # Main project dependencies
├── admin/
│   ├── package.json          # Admin panel dependencies
│   └── prisma/
│       └── schema.prisma     # Database schema
├── Abadanhalywebadmin/
│   ├── package.json          # Web admin dependencies
│   └── prisma/
│       └── schema.prisma     # Database schema
└── scripts/
    ├── setup-all-dependencies.sh    # Automated setup
    └── verify-builds.sh             # Build verification
```

## Next Steps

1. ✅ Install Node.js and pnpm
2. ✅ Run setup script: `./scripts/setup-all-dependencies.sh`
3. ✅ Verify builds: `./scripts/verify-builds.sh`
4. ✅ Set up databases (run migrations)
5. ✅ Start development: `pnpm dev`

## Need Help?

If you encounter issues:
1. Check Node.js version: `node --version` (should be 18+)
2. Check pnpm version: `pnpm --version`
3. Check if node_modules exist in each project folder
4. Try removing node_modules and reinstalling: `rm -rf node_modules && pnpm install`
5. Review error messages for specific library issues


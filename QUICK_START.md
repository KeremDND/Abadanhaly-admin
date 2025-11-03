# Quick Start Guide

## Current Status

✅ **Built version found**: `dist/index.html` exists  
❌ **Node.js not installed**: Required to run development server

## Option 1: Install Node.js and Start Development Server (Recommended)

### Step 1: Install Node.js

**Using Homebrew (Recommended):**
```bash
brew install node
```

**Or download from:** https://nodejs.org/ (LTS version)

### Step 2: Install pnpm
```bash
npm install -g pnpm
```

### Step 3: Run Setup
```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh
```

### Step 4: Start Development Server
```bash
pnpm dev
```

**Website Preview Link:** http://localhost:5173

---

## Option 2: Preview Built Version (Once Node.js is Installed)

If you have a built version in `dist/`:

```bash
cd /Users/keremjumalyyev/Desktop/project
pnpm preview
```

**Website Preview Link:** http://localhost:4173

---

## Option 3: Use Simple HTTP Server (If Python is Available)

If Python 3 is installed, you can preview the built version:

```bash
cd /Users/keremjumalyyev/Desktop/project/dist
python3 -m http.server 8000
```

**Website Preview Link:** http://localhost:8000

---

## Quick Setup Script

After installing Node.js, use the automated start script:

```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/start-dev-server.sh
```

This script will:
- ✅ Check Node.js installation
- ✅ Install dependencies if needed
- ✅ Start the development server
- ✅ Provide you with the preview link

---

## Preview Links Summary

Once everything is set up:

| Mode | Command | Preview Link |
|------|---------|--------------|
| **Development** | `pnpm dev` | http://localhost:5173 |
| **Production Preview** | `pnpm preview` | http://localhost:4173 |
| **Simple HTTP Server** | `python3 -m http.server 8000` (in dist/) | http://localhost:8000 |

---

## Need Help?

1. **Node.js Installation Issues**: See `INSTALL_NODEJS.md`
2. **Dependency Issues**: See `SETUP_INSTRUCTIONS.md`
3. **Build Issues**: See `BUILD_VERIFICATION.md`


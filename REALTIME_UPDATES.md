# Real-Time Updates Guide

## 🔴 Current Situation

The HTTP server on **http://localhost:8000** serves static files from the `dist/` folder. Changes made to source files in `src/` won't appear until you rebuild the project.

## ✅ Solution: Install Node.js for Real-Time Development

For real-time updates with hot module reloading, you need the Vite development server which requires Node.js.

---

## 🚀 Quick Setup (Recommended)

### Step 1: Install Node.js

**Option A: Using Homebrew**
```bash
brew install node
npm install -g pnpm
```

**Option B: Direct Download**
1. Visit: https://nodejs.org/
2. Download and install LTS version
3. Open new terminal
4. Run: `npm install -g pnpm`

### Step 2: Setup Dependencies
```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh
```

### Step 3: Start Development Server (Real-Time Updates!)
```bash
pnpm dev
```

**Development Server:** http://localhost:5173  
**Features:**
- ✅ Hot module reloading (instant updates)
- ✅ Live changes as you edit files
- ✅ Better error messages
- ✅ Fast refresh

---

## 🔄 Alternative: Rebuild After Changes

If you can't use the dev server yet, rebuild manually after making changes:

### Manual Rebuild
```bash
# After installing Node.js and dependencies:
pnpm build

# Then restart the HTTP server:
./scripts/rebuild-and-restart-server.sh
```

### Auto-Rebuild on File Changes
```bash
# Watch for changes and rebuild automatically:
./scripts/watch-and-rebuild.sh
```

**Note:** This still requires Node.js and rebuilds the entire project (slower than dev server).

---

## 📊 Comparison

| Method | Real-Time Updates | Speed | Requirements |
|--------|------------------|-------|--------------|
| **Development Server** (`pnpm dev`) | ✅ Yes (Hot reload) | ⚡ Fast | Node.js |
| **Watch & Rebuild** (watch-and-rebuild.sh) | ✅ Yes (Auto rebuild) | 🐢 Slower | Node.js |
| **Static HTTP Server** (python3 -m http.server) | ❌ No | ⚡ Fast | Python 3 |
| **Manual Rebuild** (`pnpm build`) | ❌ No | 🐢 Slow | Node.js |

---

## 🎯 Recommended Workflow

### For Active Development:
1. **Install Node.js** (see INSTALL_NODEJS.md)
2. **Setup dependencies:** `./scripts/setup-all-dependencies.sh`
3. **Start dev server:** `pnpm dev`
4. **Open:** http://localhost:5173
5. **Edit files** - changes appear instantly!

### For Quick Preview:
1. **Make changes** to source files
2. **Rebuild:** `pnpm build` (or use watch script)
3. **Refresh browser** at http://localhost:8000

---

## 🛠️ Available Scripts

After installing Node.js:

| Script | Command | Purpose |
|--------|---------|---------|
| **Development Server** | `pnpm dev` | Start dev server with hot reload (http://localhost:5173) |
| **Rebuild** | `pnpm build` | Build project to `dist/` folder |
| **Watch & Rebuild** | `./scripts/watch-and-rebuild.sh` | Auto-rebuild on file changes |
| **Rebuild & Restart** | `./scripts/rebuild-and-restart-server.sh` | Rebuild and restart HTTP server |

---

## ⚠️ Important Notes

1. **Current HTTP Server** (port 8000) shows the **old built version** from `dist/`
2. **Source files** are in `src/components/` and need to be built
3. **For real-time updates**, use `pnpm dev` (requires Node.js)
4. **Without Node.js**, you can only view the current `dist/` build

---

## 🎯 Quick Start (Once Node.js is Installed)

```bash
# 1. Setup
./scripts/setup-all-dependencies.sh

# 2. Start dev server (real-time updates)
pnpm dev

# 3. Open in browser
open http://localhost:5173
```

**Now edit any file in `src/` and see changes instantly!** 🎉

---

## 📝 Summary

**Current Status:**
- ❌ Node.js not installed
- ✅ Source files updated (Contact.tsx, Collaboration.tsx, Hero.tsx)
- ⏳ Changes not visible because `dist/` needs rebuilding
- ⏳ No real-time updates without dev server

**To See Your Changes:**
1. Install Node.js
2. Run `./scripts/setup-all-dependencies.sh`
3. Run `pnpm build` to rebuild
4. OR run `pnpm dev` for real-time development

**Next Steps:** See `INSTALL_NODEJS.md` for installation instructions.


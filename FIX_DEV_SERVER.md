# Fix Development Server (Port 5173)

## 🔴 Current Issue

**http://localhost:5173 is not responding**

**Root Cause:** Node.js is not installed on your system.

The development server (Vite) requires Node.js to run. Port 5173 is free, but the server can't start without Node.js.

---

## ✅ Solution: Install Node.js

### Quick Installation (Recommended)

#### Step 1: Install Node.js

**Option A: Direct Download (Fastest)**
1. Visit: **https://nodejs.org/**
2. Download the **LTS version** (recommended)
3. Run the installer
4. Open a **new terminal window**

**Option B: Using Homebrew**
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add to PATH (if prompted)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Install Node.js
brew install node
```

#### Step 2: Verify Installation
Open a **new terminal** and run:
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show version number
```

#### Step 3: Install pnpm
```bash
npm install -g pnpm
pnpm --version   # Verify installation
```

#### Step 4: Setup Project Dependencies
```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh
```

#### Step 5: Start Development Server
```bash
# Option 1: Use the script
./scripts/start-dev-port-5173.sh

# Option 2: Direct command
pnpm dev
```

**Development Server:** http://localhost:5173  
**Features:**
- ✅ Hot module reloading (instant updates)
- ✅ Real-time changes as you edit files
- ✅ Better error messages
- ✅ Fast refresh

---

## 🚀 Quick Start Script

After installing Node.js, use:

```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/start-dev-port-5173.sh
```

This script will:
- ✅ Check Node.js installation
- ✅ Install dependencies if needed
- ✅ Start the dev server on port 5173
- ✅ Provide you with the preview link

---

## 📋 Verification Checklist

After installation, verify:

- [ ] `node --version` shows v18.x.x or higher
- [ ] `pnpm --version` shows version number
- [ ] `./scripts/setup-all-dependencies.sh` runs successfully
- [ ] `pnpm dev` starts without errors
- [ ] http://localhost:5173 opens in browser
- [ ] Changes to files appear instantly

---

## 🔄 Alternative: Use Static Preview Server

While waiting for Node.js installation, you can use the static preview:

```bash
cd /Users/keremjumalyyev/Desktop/project/dist
python3 -m http.server 8000
```

**Preview:** http://localhost:8000  
**Note:** This shows the old build and doesn't update automatically.

---

## ⚠️ Troubleshooting

### Port 5173 Already in Use
If port 5173 is already in use:
```bash
# Find and kill the process
lsof -ti:5173 | xargs kill

# Or use a different port
pnpm dev --port 5174
```

### Permission Errors
```bash
# Fix npm/pnpm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Dependencies Not Installing
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
pnpm install
```

---

## 📝 Summary

**Current Status:**
- ❌ Node.js not installed
- ❌ Development server not running
- ✅ Port 5173 is available
- ✅ Source files updated (Contact.tsx, Collaboration.tsx, Hero.tsx)

**Next Steps:**
1. Install Node.js (see above)
2. Run: `./scripts/setup-all-dependencies.sh`
3. Run: `pnpm dev`
4. Open: http://localhost:5173

**For Real-Time Updates:**
Once Node.js is installed and dev server is running, changes to source files will appear instantly at http://localhost:5173!

---

**Need Help?** See `NODEJS_INSTALLATION_GUIDE.md` for detailed installation instructions.


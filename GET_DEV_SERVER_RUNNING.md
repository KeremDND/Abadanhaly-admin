# Get Development Server Running (Port 5173)

## 🔴 Current Status

**http://localhost:5173 is NOT responding**

**Why:** Node.js is not installed on your system.

The Vite development server requires Node.js to run. Without it, the server cannot start.

---

## ✅ Solution: Install Node.js (5 Minutes)

### Method 1: Direct Download (Fastest - Recommended)

**Step 1:** Visit **https://nodejs.org/**  
**Step 2:** Click **"Download Node.js (LTS)"**  
**Step 3:** Run the installer  
**Step 4:** Open a **NEW terminal window**  
**Step 5:** Verify installation:
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show version number
```

**Step 6:** Install pnpm:
```bash
npm install -g pnpm
```

**Step 7:** Setup project:
```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh
```

**Step 8:** Start dev server:
```bash
pnpm dev
```

**Done!** Open http://localhost:5173 in your browser.

---

### Method 2: Using Homebrew

```bash
# Install Homebrew (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add to PATH (if prompted)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Install Node.js
brew install node

# Install pnpm
npm install -g pnpm

# Setup project
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh

# Start dev server
pnpm dev
```

---

## 🚀 Quick Start Script

After installing Node.js:

```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/start-dev-port-5173.sh
```

This will:
1. Check Node.js installation
2. Install dependencies if needed
3. Start the dev server on port 5173
4. Show you the preview link

---

## 📊 What You'll Get

**After installing Node.js and starting dev server:**

| Feature | Status |
|---------|--------|
| **Development Server** | ✅ http://localhost:5173 |
| **Hot Module Reloading** | ✅ Instant updates |
| **Real-Time Changes** | ✅ See edits immediately |
| **Better Debugging** | ✅ Error messages |
| **Fast Refresh** | ✅ Quick updates |

---

## ⚡ Why This Matters

**Current setup:**
- ❌ Static HTTP server (port 8000) - shows old build
- ❌ Changes require manual rebuild
- ❌ No hot reloading

**With dev server:**
- ✅ Real-time updates
- ✅ Instant changes
- ✅ Better development experience
- ✅ See all your recent changes immediately!

---

## 📝 After Installation

Once Node.js is installed:

1. **Verify installation:**
   ```bash
   node --version
   pnpm --version
   ```

2. **Setup project:**
   ```bash
   cd /Users/keremjumalyyev/Desktop/project
   ./scripts/setup-all-dependencies.sh
   ```

3. **Start dev server:**
   ```bash
   pnpm dev
   ```

4. **Open browser:**
   http://localhost:5173

**Your recent changes will appear instantly!**

---

## 🔍 Troubleshooting

### Issue: "command not found: node"
**Solution:** Close and reopen terminal, or verify installation path.

### Issue: Port 5173 already in use
**Solution:**
```bash
lsof -ti:5173 | xargs kill
pnpm dev
```

### Issue: Permission errors
**Solution:**
```bash
sudo npm install -g pnpm
```

---

**Next Step:** Install Node.js using Method 1 (easiest), then run the setup scripts.

See `FIX_DEV_SERVER.md` for more details.


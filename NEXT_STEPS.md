# Next Steps - Get Development Server Running

## Current Status

**http://localhost:5173** is not responding because Node.js is not installed.

---

## ✅ Step-by-Step Action Plan

### Step 1: Install Node.js (5 minutes)

#### Option A: Direct Download (Easiest)
1. **Open browser:** https://nodejs.org/
2. **Click:** "Download Node.js (LTS)" - the green button
3. **Wait** for download (usually goes to Downloads folder)
4. **Open Downloads** folder
5. **Double-click** the `.pkg` file (e.g., `node-v20.x.x.pkg`)
6. **Click "Continue"** through installer
7. **Enter password** if asked
8. **Click "Install"**
9. **Wait** for installation to finish

#### Option B: Using Homebrew
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

---

### Step 2: Verify Installation (IMPORTANT!)

**After installing Node.js:**
1. **Close this terminal completely**
2. **Open a NEW terminal window**
3. **Run this command:**
   ```bash
   node --version
   ```
4. **You should see:** `v18.x.x` or `v20.x.x` or similar
5. **If you see an error:** Close terminal and open a new one, try again

---

### Step 3: Install pnpm

In the NEW terminal window:
```bash
npm install -g pnpm
```

Verify:
```bash
pnpm --version
```

---

### Step 4: Setup Project

```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh
```

This will:
- Install all dependencies for main project
- Install all dependencies for admin panel
- Install all dependencies for Abadanhalywebadmin
- Generate Prisma clients

**This takes 3-5 minutes.**

---

### Step 5: Start Development Server

**Option A: Use the quick script**
```bash
./START_DEV_SERVER.sh
```

**Option B: Manual command**
```bash
pnpm dev
```

**You should see:**
```
VITE v5.4.2  ready in 500 ms

➜  Local:   http://localhost:5173/
```

---

### Step 6: Open in Browser

**Click or type in browser:**
```
http://localhost:5173
```

---

## 🎉 Success Indicators

When everything works, you'll see:

1. **Terminal shows:**
   ```
   VITE v5.4.2  ready in 500 ms
   ➜  Local:   http://localhost:5173/
   ```

2. **Browser opens:** http://localhost:5173
   - Website loads
   - Shows your recent changes
   - Updates instantly when you edit files

---

## ⚡ Quick Start (After Installing Node.js)

Once Node.js is installed, just run:

```bash
cd /Users/keremjumalyyev/Desktop/project
./START_DEV_SERVER.sh
```

This single command will:
- ✅ Check Node.js installation
- ✅ Install pnpm if needed
- ✅ Install dependencies if needed
- ✅ Start the development server
- ✅ Show you the preview link

---

## 🔍 Troubleshooting

### Issue: "node: command not found" after installation
**Solution:**
1. Close terminal completely
2. Open brand new terminal window
3. Try `node --version` again
4. If still not found, check installation path

### Issue: Installation blocked by macOS
**Solution:**
1. Right-click the installer file
2. Select "Open"
3. Allow when macOS asks

### Issue: Permission denied
**Solution:**
```bash
sudo npm install -g pnpm
```

### Issue: Port 5173 already in use
**Solution:**
```bash
lsof -ti:5173 | xargs kill
pnpm dev
```

---

## 📋 Checklist

- [ ] Installed Node.js from nodejs.org
- [ ] Closed terminal
- [ ] Opened new terminal
- [ ] Verified: `node --version` works
- [ ] Installed pnpm: `npm install -g pnpm`
- [ ] Ran: `./scripts/setup-all-dependencies.sh`
- [ ] Started server: `pnpm dev`
- [ ] Opened: http://localhost:5173
- [ ] Website loads successfully

---

## 🎯 What Happens Next

Once the dev server is running:

✅ **Real-time updates** - Changes appear instantly  
✅ **Hot module reloading** - No manual refresh needed  
✅ **Better debugging** - Clear error messages  
✅ **Fast development** - Quick refresh cycle  

**Your recent changes will appear immediately!**

---

## 📝 Important Notes

1. **Keep the terminal open** while using the dev server
2. **Press Ctrl+C** to stop the server when done
3. **Changes appear instantly** - no rebuild needed
4. **All your recent changes** (Contact.tsx, Collaboration.tsx, Hero.tsx) will be visible

---

**Current Status:**
- ❌ Node.js: Not installed
- ❌ Dev Server: Cannot start
- ✅ Static Preview: http://localhost:8000 (old build)
- ⏳ Next Step: Install Node.js → Setup → Start server

**See `INSTALL_NODEJS_NOW.md` for detailed installation guide.**


# Install Node.js NOW - Quick Guide

## 🚨 Problem

**http://localhost:5173 shows "ERR_CONNECTION_REFUSED"**

**Why:** Node.js is not installed. The development server cannot start without it.

---

## ✅ Solution: Install Node.js (5 Minutes)

### STEP-BY-STEP INSTRUCTIONS

#### Step 1: Download Node.js
1. **Open your web browser**
2. **Go to:** https://nodejs.org/
3. **Click the BIG GREEN BUTTON** that says "Download Node.js (LTS)"
4. **Wait for download to complete**

#### Step 2: Install Node.js
1. **Find the downloaded file** (usually in Downloads folder)
2. **Double-click** the `.pkg` file
3. **Click "Continue"** through the installer
4. **Enter your password** if prompted
5. **Click "Install"**
6. **Wait for installation to complete**

#### Step 3: Verify Installation
1. **Close this terminal window**
2. **Open a NEW terminal window** (important!)
3. **Run this command:**
   ```bash
   node --version
   ```
4. **You should see:** `v18.x.x` or `v20.x.x` (or similar)
5. **If you see an error:** Close terminal and reopen, try again

#### Step 4: Install pnpm
In the new terminal, run:
```bash
npm install -g pnpm
```

#### Step 5: Setup Project
```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh
```

This will take a few minutes to install all dependencies.

#### Step 6: Start Development Server
```bash
pnpm dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

#### Step 7: Open in Browser
**Click or copy:** http://localhost:5173

---

## 🎯 What You'll See After Installation

When `pnpm dev` runs successfully, you'll see output like:
```
VITE v5.4.2  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

**Then open:** http://localhost:5173

---

## ⚠️ Important Notes

1. **After installing Node.js, CLOSE and REOPEN your terminal**
   - The PATH is updated when you open a new terminal
   - Old terminals won't have the updated PATH

2. **Installation takes 5-10 minutes total:**
   - Download: 1-2 minutes
   - Install: 2-3 minutes  
   - Setup dependencies: 2-5 minutes

3. **The dev server will stay running until you stop it:**
   - Press `Ctrl+C` in the terminal to stop
   - Keep the terminal window open while using the server

---

## 🔍 Verify Installation

After installing, run these commands in a NEW terminal:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show version number
pnpm --version    # Should show version number
```

**All three should show version numbers.** If any don't work, close and reopen terminal.

---

## 📋 Quick Checklist

- [ ] Downloaded Node.js from nodejs.org
- [ ] Installed Node.js (.pkg installer)
- [ ] Closed and reopened terminal
- [ ] Verified: `node --version` works
- [ ] Installed pnpm: `npm install -g pnpm`
- [ ] Ran: `./scripts/setup-all-dependencies.sh`
- [ ] Started dev server: `pnpm dev`
- [ ] Opened: http://localhost:5173

---

## 🆘 Still Not Working?

### Issue: "command not found: node" after installation
**Solution:**
1. Close terminal completely
2. Open a brand new terminal window
3. Try `node --version` again

### Issue: Installation fails
**Solution:**
1. Check if you have admin permissions
2. Try right-clicking installer and selecting "Open"
3. Allow installation if macOS blocks it

### Issue: Port 5173 still not responding after starting server
**Solution:**
1. Check terminal output - does it show "Local: http://localhost:5173/"?
2. Wait 10-20 seconds for server to start
3. Try refreshing the browser
4. Check if firewall is blocking the connection

---

## 🎉 Success!

Once everything is set up:
- ✅ Development server runs at http://localhost:5173
- ✅ Changes appear instantly (hot reload)
- ✅ Real-time updates as you edit files
- ✅ All your recent changes visible immediately

---

**Next Step:** Install Node.js from https://nodejs.org/ now, then follow the steps above.


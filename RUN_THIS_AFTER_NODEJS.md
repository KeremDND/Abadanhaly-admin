# Run This After Installing Node.js

## ✅ Once Node.js is Installed

After you install Node.js from nodejs.org and verify it works, run these commands **in order**:

### Step 1: Verify Node.js (in NEW terminal)
```bash
node --version
npm --version
```

**Both should show version numbers.**

### Step 2: Install pnpm
```bash
npm install -g pnpm
```

### Step 3: Navigate to Project
```bash
cd /Users/keremjumalyyev/Desktop/project
```

### Step 4: Setup All Dependencies
```bash
./scripts/setup-all-dependencies.sh
```

**This takes 3-5 minutes.**

### Step 5: Start Development Server

**Option A: Use Quick Script**
```bash
./START_DEV_SERVER.sh
```

**Option B: Manual Command**
```bash
pnpm dev
```

**You should see:**
```
VITE v5.4.2  ready in 500 ms

➜  Local:   http://localhost:5173/
```

### Step 6: Open in Browser
```
http://localhost:5173
```

---

## 🎉 Success!

Once you see the Vite server running, you can:
- ✅ See all your recent changes instantly
- ✅ Edit files and see updates in real-time
- ✅ No manual refresh needed
- ✅ Better error messages

---

## 📝 Quick Reference

**All commands in one place:**
```bash
# 1. Verify (after installing Node.js)
node --version
npm --version

# 2. Install pnpm
npm install -g pnpm

# 3. Setup project
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh

# 4. Start server
./START_DEV_SERVER.sh

# 5. Open browser
# http://localhost:5173
```

---

**Next:** Install Node.js from https://nodejs.org/, then follow the steps above!


# Node.js Installation Guide for macOS

## Current Status
❌ **Homebrew**: Not installed  
❌ **Node.js**: Not installed  
✅ **Preview Server**: Running on http://localhost:8000

---

## 🚀 Quick Installation (Choose One Method)

### Method 1: Install Homebrew + Node.js (Recommended)

#### Step 1: Install Homebrew
Open Terminal and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Note:** During installation, you may be asked for your password. The installer will also prompt you to add Homebrew to your PATH.

#### Step 2: Add Homebrew to PATH (if needed)
If the installer says to add Homebrew to your PATH, run:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

#### Step 3: Install Node.js
```bash
brew install node
```

#### Step 4: Install pnpm
```bash
npm install -g pnpm
```

#### Step 5: Verify Installation
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show version number
pnpm --version   # Should show version number
```

---

### Method 2: Direct Node.js Installation (Simpler)

#### Step 1: Download Node.js
1. Visit: https://nodejs.org/
2. Click **"Download Node.js (LTS)"** - this downloads the `.pkg` installer
3. Run the downloaded installer
4. Follow the installation wizard

#### Step 2: Verify Installation
Open a **new terminal window** and run:

```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show version number
```

#### Step 3: Install pnpm
```bash
npm install -g pnpm
pnpm --version   # Verify installation
```

---

## ✅ After Node.js is Installed

### 1. Setup All Dependencies
```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh
```

### 2. Start Development Server
```bash
pnpm dev
```

### 3. Open in Browser
Visit: **http://localhost:5173**

---

## 🔍 Verification Checklist

After installation, verify everything works:

- [ ] `node --version` shows v18.x.x or higher
- [ ] `npm --version` shows a version number
- [ ] `pnpm --version` shows a version number
- [ ] `./scripts/setup-all-dependencies.sh` runs successfully
- [ ] `pnpm dev` starts the development server
- [ ] http://localhost:5173 opens in browser

---

## ❓ Troubleshooting

### Issue: "command not found: node"
**Solution:** 
1. Close and reopen your terminal
2. If still not found, verify installation path
3. Check if Node.js is in PATH: `echo $PATH | grep node`

### Issue: "Permission denied" when installing pnpm
**Solution:**
```bash
sudo npm install -g pnpm
```

### Issue: Homebrew installation fails
**Solution:**
1. Check internet connection
2. Try manual installation from https://brew.sh/
3. Or use Method 2 (direct Node.js installation)

### Issue: Node.js installed but not recognized
**Solution:**
1. Close and reopen terminal
2. Check installation: `/usr/local/bin/node --version`
3. Add to PATH if needed:
   ```bash
   export PATH="/usr/local/bin:$PATH"
   echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zprofile
   ```

---

## 📋 Installation Summary

**Recommended Path:**
1. Install Homebrew (if not installed)
2. Install Node.js: `brew install node`
3. Install pnpm: `npm install -g pnpm`
4. Run setup: `./scripts/setup-all-dependencies.sh`
5. Start dev server: `pnpm dev`

**Alternative Path:**
1. Download Node.js from nodejs.org
2. Run the installer
3. Install pnpm: `npm install -g pnpm`
4. Run setup: `./scripts/setup-all-dependencies.sh`
5. Start dev server: `pnpm dev`

---

## 🎯 Next Steps

Once Node.js is installed:
1. ✅ Stop the current preview server (if desired): `kill $(cat /tmp/http-server.pid)`
2. ✅ Run setup: `./scripts/setup-all-dependencies.sh`
3. ✅ Start dev server: `pnpm dev`
4. ✅ Open: http://localhost:5173

---

**Need help?** See `QUICK_START.md` for more guidance.


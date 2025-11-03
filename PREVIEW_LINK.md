# Website Preview Link

## 🎉 Live Preview (Now Available)

**Website Preview Link:** http://localhost:8000

The website is now running using Python's HTTP server. This preview uses the built version from the `dist/` folder.

---

## How to Access

1. **Open in Browser:**
   - Click or copy: http://localhost:8000
   - Or type `localhost:8000` in your browser address bar

2. **Stop the Server:**
   ```bash
   # Find and kill the server
   kill $(cat /tmp/http-server.pid)
   # Or
   lsof -ti:8000 | xargs kill
   ```

---

## Development Server (After Installing Node.js)

Once you install Node.js, you can use the full development server:

### Step 1: Install Node.js
```bash
brew install node
npm install -g pnpm
```

### Step 2: Setup Dependencies
```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh
```

### Step 3: Start Development Server
```bash
pnpm dev
```

**Development Preview Link:** http://localhost:5173

---

## Preview Options

| Option | Command | Preview Link | Status |
|-------|---------|--------------|--------|
| **Built Version (Current)** | `python3 -m http.server 8000` | http://localhost:8000 | ✅ Running Now |
| **Development Server** | `pnpm dev` | http://localhost:5173 | ⏳ Requires Node.js |
| **Production Preview** | `pnpm preview` | http://localhost:4173 | ⏳ Requires Node.js |

---

## Notes

- **Current preview** uses the built version (static files)
- **Development server** provides hot-reload and full features
- **Production preview** uses Vite's preview server for testing built version

---

## Next Steps

1. ✅ **View the website now**: http://localhost:8000
2. ⏳ **Install Node.js** for full development setup
3. ⏳ **Run setup script** to install all dependencies
4. ⏳ **Start dev server** for live development

See `QUICK_START.md` for complete setup instructions.


# GitHub Pages Deployment Guide

## Quick Start

### 1. Initial Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial Abadan Haly gallery"

# Rename branch to main
git branch -M main

# Add remote (replace YOUR-GITHUB-USERNAME)
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/abadanhaly-admin.git

# Push to GitHub
git push -u origin main
```

### 2. Configure GitHub Pages

1. Go to your repository on GitHub.com
2. Click **Settings** → **Pages**
3. Under **Source**:
   - Select **Deploy from a branch**
   - Branch: `main`
   - Folder: `/docs`
   - Click **Save**
4. Wait 1-2 minutes for deployment
5. Your site will be live at:
   `https://YOUR-GITHUB-USERNAME.github.io/abadanhaly-admin/`

## Updating the Site

After making changes:

```bash
# 1. Make your changes

# 2. Build the project
npm run build

# 3. Commit and push
git add .
git commit -m "Update site"
git push
```

GitHub Pages will automatically rebuild and deploy (takes 1-2 minutes).

## Configuration

- **Base Path**: `/abadanhaly-admin/` (must match repository name)
- **Build Output**: `docs/` directory
- **Repository Name**: `abadanhaly-admin`

## Troubleshooting

### Site not loading?
- Check that repository name matches base path in `vite.config.ts`
- Verify GitHub Pages is set to deploy from `main` branch, `/docs` folder
- Wait a few minutes for deployment to complete

### Assets not loading?
- Ensure all image paths use relative paths or start with `/abadanhaly-admin/`
- Check browser console for 404 errors
- Verify build output in `docs/` directory

### Build fails?
- Run `npm install` to ensure dependencies are installed
- Check for TypeScript errors: `npm run build`
- Verify `vite.config.ts` has correct base path



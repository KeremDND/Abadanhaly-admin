# Install Node.js on macOS

Node.js is required to run the Abadan Haly project. Follow these steps to install it.

## Option 1: Install using Homebrew (Recommended)

If you have Homebrew installed:

```bash
# Install Node.js (includes npm)
brew install node

# Install pnpm globally
npm install -g pnpm

# Verify installation
node --version   # Should show v18.x.x or higher
npm --version    # Should show version number
pnpm --version   # Should show version number
```

## Option 2: Install from Official Website

1. Visit https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer
4. After installation, open a new terminal and verify:

```bash
node --version
npm --version

# Install pnpm
npm install -g pnpm
pnpm --version
```

## Option 3: Using nvm (Node Version Manager)

This is useful if you need multiple Node.js versions:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Close and reopen terminal, then:
nvm install 20        # Install Node.js 20
nvm use 20            # Use Node.js 20
nvm alias default 20  # Set as default

# Install pnpm
npm install -g pnpm
```

## After Installing Node.js

Once Node.js is installed, run:

```bash
cd /Users/keremjumalyyev/Desktop/project
./scripts/setup-all-dependencies.sh
```

Then start the development server:

```bash
pnpm dev
```

The website will be available at: **http://localhost:5173**

## Quick Check

After installation, verify everything works:

```bash
node --version    # Should be v18.x.x or higher
pnpm --version    # Should show version number
```


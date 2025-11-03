#!/bin/bash

# Script to help install Node.js on macOS

echo "🔧 Node.js Installation Helper"
echo "================================"
echo ""

# Check if Homebrew is installed
if command -v brew &> /dev/null; then
    echo "✅ Homebrew found"
    echo ""
    echo "Installing Node.js using Homebrew..."
    brew install node
    echo ""
    echo "Installing pnpm..."
    npm install -g pnpm
    echo ""
    echo "✅ Node.js and pnpm installed!"
    echo ""
    echo "Verify installation:"
    echo "  node --version"
    echo "  pnpm --version"
else
    echo "❌ Homebrew not found"
    echo ""
    echo "You have two options to install Node.js:"
    echo ""
    echo "Option 1: Install Homebrew first (Recommended)"
    echo "  1. Visit: https://brew.sh/"
    echo "  2. Run: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "  3. Then run: brew install node"
    echo ""
    echo "Option 2: Install Node.js directly"
    echo "  1. Visit: https://nodejs.org/"
    echo "  2. Download the LTS version (.pkg installer)"
    echo "  3. Run the installer"
    echo "  4. Open a new terminal window"
    echo "  5. Run: npm install -g pnpm"
    echo ""
    echo "After installing Node.js, verify it works:"
    echo "  node --version   # Should show v18.x.x or higher"
    echo "  npm --version    # Should show version number"
    echo ""
    echo "Then continue with setup:"
    echo "  cd /Users/keremjumalyyev/Desktop/project"
    echo "  ./scripts/setup-all-dependencies.sh"
fi


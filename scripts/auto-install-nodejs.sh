#!/bin/bash

# Automated Node.js installation script
# This script will guide you through installing Node.js

set -e

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

echo "🚀 Automated Node.js Installation"
echo "==================================="
echo ""

# Check if Node.js is already installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js is already installed: $NODE_VERSION"
    
    # Check if pnpm is installed
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        echo "✅ pnpm is already installed: $PNPM_VERSION"
        echo ""
        echo "You're all set! Run:"
        echo "  cd $PROJECT_ROOT"
        echo "  ./scripts/setup-all-dependencies.sh"
        exit 0
    else
        echo "⚠️  pnpm not found. Installing..."
        npm install -g pnpm
        echo "✅ pnpm installed"
        exit 0
    fi
fi

echo "Node.js is not installed."
echo ""

# Check for Homebrew
if command -v brew &> /dev/null; then
    echo "✅ Homebrew found. Installing Node.js..."
    echo ""
    brew install node
    
    echo ""
    echo "Installing pnpm..."
    npm install -g pnpm
    
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "Verify:"
    echo "  node --version"
    echo "  pnpm --version"
    echo ""
    echo "Then run:"
    echo "  cd $PROJECT_ROOT"
    echo "  ./scripts/setup-all-dependencies.sh"
    
else
    echo "❌ Homebrew not found"
    echo ""
    echo "You have two options:"
    echo ""
    echo "Option 1: Install Homebrew first (Recommended)"
    echo "  Run this command:"
    echo "    /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "  Then run this script again."
    echo ""
    echo "Option 2: Install Node.js manually"
    echo "  1. Visit: https://nodejs.org/"
    echo "  2. Download the LTS version"
    echo "  3. Run the installer"
    echo "  4. Open a new terminal"
    echo "  5. Run: npm install -g pnpm"
    echo "  6. Then run: ./scripts/setup-all-dependencies.sh"
    echo ""
    echo "For detailed instructions, see: NODEJS_INSTALLATION_GUIDE.md"
fi


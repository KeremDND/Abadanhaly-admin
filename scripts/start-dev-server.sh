#!/bin/bash

# Start development server for Abadan Haly website

set -e

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Starting Abadan Haly Development Server"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗${NC} Node.js is not installed"
    echo ""
    echo "Please install Node.js first:"
    echo "  brew install node"
    echo "  OR visit: https://nodejs.org/"
    echo ""
    echo "See INSTALL_NODEJS.md for detailed instructions"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
echo ""

# Check package manager
if command -v pnpm &> /dev/null; then
    PM_CMD="pnpm"
    echo -e "${GREEN}✓${NC} Using pnpm"
elif command -v npm &> /dev/null; then
    PM_CMD="npm"
    echo -e "${YELLOW}⚠${NC}  Using npm (pnpm recommended)"
else
    echo -e "${RED}✗${NC} No package manager found"
    exit 1
fi

echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  Dependencies not installed. Installing now..."
    $PM_CMD install
    echo ""
fi

# Check if built version exists
if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓${NC} Production build found in dist/"
    echo ""
    echo "Choose an option:"
    echo "  1) Start development server (http://localhost:5173)"
    echo "  2) Preview production build (http://localhost:4173)"
    echo ""
    read -p "Enter choice [1 or 2] (default: 1): " choice
    choice=${choice:-1}
    
    if [ "$choice" = "2" ]; then
        echo ""
        echo "📦 Starting preview server for production build..."
        $PM_CMD preview
    else
        echo ""
        echo "🔧 Starting development server..."
        $PM_CMD dev
    fi
else
    echo "🔧 Starting development server..."
    echo ""
    echo "Website will be available at: ${GREEN}http://localhost:5173${NC}"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    $PM_CMD dev
fi


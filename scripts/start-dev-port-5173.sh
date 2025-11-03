#!/bin/bash

# Start development server on port 5173

set -e

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Starting Development Server (Port 5173)"
echo "==========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗${NC} Node.js is not installed"
    echo ""
    echo "To start the development server, you need to install Node.js:"
    echo ""
    echo "Option 1: Install Homebrew, then Node.js"
    echo "  1. Install Homebrew:"
    echo "     /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "  2. Install Node.js:"
    echo "     brew install node"
    echo ""
    echo "  3. Install pnpm:"
    echo "     npm install -g pnpm"
    echo ""
    echo "Option 2: Direct Node.js Installation (Easier)"
    echo "  1. Visit: https://nodejs.org/"
    echo "  2. Download and install LTS version"
    echo "  3. Open new terminal"
    echo "  4. Run: npm install -g pnpm"
    echo ""
    echo "Then run:"
    echo "  ./scripts/setup-all-dependencies.sh"
    echo "  pnpm dev"
    echo ""
    echo "See INSTALL_NODEJS.md for detailed instructions"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"

# Check package manager
if command -v pnpm &> /dev/null; then
    PM_CMD="pnpm"
    echo -e "${GREEN}✓${NC} Using pnpm"
elif command -v npm &> /dev/null; then
    PM_CMD="npm"
    echo -e "${YELLOW}⚠${NC}  Using npm (pnpm recommended)"
else
    echo -e "${RED}✗${NC} No package manager found"
    echo "Installing pnpm..."
    npm install -g pnpm
    PM_CMD="pnpm"
fi

echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  Dependencies not installed. Installing now..."
    $PM_CMD install
    echo ""
fi

# Kill any existing server on port 5173
lsof -ti:5173 | xargs kill 2>/dev/null || true
sleep 1

echo "🔧 Starting development server..."
echo ""
echo -e "${GREEN}Development server will be available at:${NC}"
echo -e "${GREEN}  → http://localhost:5173${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
$PM_CMD dev


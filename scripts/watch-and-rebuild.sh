#!/bin/bash

# Watch for file changes and rebuild automatically
# This script rebuilds the project when source files change

set -e

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔄 File Watcher & Auto-Rebuild"
echo "==============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗${NC} Node.js is not installed"
    echo ""
    echo "For real-time updates, you need:"
    echo "  1. Install Node.js (see INSTALL_NODEJS.md)"
    echo "  2. Run: ./scripts/setup-all-dependencies.sh"
    echo "  3. Run: pnpm dev  (for development server with hot reload)"
    echo ""
    exit 1
fi

# Check package manager
if command -v pnpm &> /dev/null; then
    PM_CMD="pnpm"
elif command -v npm &> /dev/null; then
    PM_CMD="npm"
else
    echo -e "${RED}✗${NC} No package manager found"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  Dependencies not installed. Installing now..."
    $PM_CMD install
    echo ""
fi

echo -e "${GREEN}✓${NC} Watching for changes in src/ directory..."
echo "Press Ctrl+C to stop"
echo ""

# Watch for changes and rebuild
# Using chokidar-cli or nodemon if available, otherwise simple polling
if command -v chokidar &> /dev/null || npx chokidar --version &> /dev/null 2>&1; then
    echo "Using chokidar for file watching..."
    npx chokidar "src/**/*" -c "$PM_CMD run build"
elif command -v nodemon &> /dev/null || npx nodemon --version &> /dev/null 2>&1; then
    echo "Using nodemon for file watching..."
    npx nodemon --watch src --ext tsx,ts,css --exec "$PM_CMD run build"
else
    echo "Simple polling mode (checking every 2 seconds)..."
    while true; do
        sleep 2
        # Check if any source file changed since last build
        LAST_BUILD=$(stat -f %m dist/index.html 2>/dev/null || echo 0)
        NEWEST_SOURCE=$(find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.css" | xargs stat -f %m 2>/dev/null | sort -rn | head -1 || echo 0)
        
        if [ "$NEWEST_SOURCE" -gt "$LAST_BUILD" ]; then
            echo -e "\n${YELLOW}📝 Changes detected, rebuilding...${NC}"
            $PM_CMD run build
            echo -e "${GREEN}✓${NC} Rebuild complete!"
            echo ""
        fi
    done
fi


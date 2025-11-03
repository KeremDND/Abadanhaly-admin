#!/bin/bash

# Rebuild project and restart HTTP server with latest changes

set -e

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔨 Rebuilding Project"
echo "====================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗${NC} Node.js is not installed"
    echo ""
    echo "To rebuild the project, you need to:"
    echo "  1. Install Node.js (see INSTALL_NODEJS.md)"
    echo "  2. Run: ./scripts/setup-all-dependencies.sh"
    echo "  3. Then rebuild: pnpm build"
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

echo "Building project..."
$PM_CMD run build

echo ""
echo -e "${GREEN}✓${NC} Build complete!"
echo ""

# Restart HTTP server
echo "Restarting HTTP server..."
lsof -ti:8000 | xargs kill 2>/dev/null || true
sleep 1
cd dist && python3 -m http.server 8000 > /tmp/http-server.log 2>&1 &
echo $! > /tmp/http-server.pid
sleep 1

if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 | grep -q "200"; then
    echo -e "${GREEN}✓${NC} Server restarted successfully!"
    echo ""
    echo "Website updated at: http://localhost:8000"
    echo "Refresh your browser to see changes!"
else
    echo -e "${RED}✗${NC} Server restart failed"
fi


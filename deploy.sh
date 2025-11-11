#!/bin/bash

# Deploy script for Abadan Haly website
# Builds the project and prepares for GitHub Pages deployment

set -e

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Deploying Abadan Haly Website"
echo "================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗${NC} Node.js is not installed"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  Dependencies not installed. Installing now..."
    npm install
    echo ""
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ ! -d "docs" ]; then
    echo -e "${RED}✗${NC} Build failed - docs directory not found"
    exit 1
fi

echo ""
echo -e "${GREEN}✓${NC} Build complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Review the build output in the 'docs' directory"
echo "  2. Commit and push to GitHub:"
echo "     git add ."
echo "     git commit -m 'Update site'"
echo "     git push"
echo ""
echo "  GitHub Pages will automatically deploy from the 'docs' directory"
echo ""


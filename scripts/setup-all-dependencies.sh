
#!/bin/bash

# Setup script to ensure all dependencies are installed for the Abadan Haly project
# This script installs dependencies for all sub-projects

set -e

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"

echo "🚀 Abadan Haly - Complete Dependency Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📦 Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js found: $NODE_VERSION"
    
    # Check Node.js version (should be 18 or higher)
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
        echo -e "${YELLOW}⚠${NC}  Node.js version 18 or higher is recommended"
    fi
else
    echo -e "${RED}✗${NC} Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Or use Homebrew: brew install node"
    exit 1
fi

# Check if pnpm is installed
echo ""
echo "📦 Checking pnpm installation..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✓${NC} pnpm found: $PNPM_VERSION"
    USE_PNPM=true
elif command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${YELLOW}⚠${NC}  pnpm not found, using npm: $NPM_VERSION"
    echo "Installing pnpm globally..."
    npm install -g pnpm
    USE_PNPM=true
else
    echo -e "${RED}✗${NC} Neither pnpm nor npm found"
    exit 1
fi

# Function to install dependencies
install_deps() {
    local dir=$1
    local name=$2
    
    echo ""
    echo "📦 Installing dependencies for $name..."
    cd "$PROJECT_ROOT/$dir"
    
    if [ -f "pnpm-lock.yaml" ] || [ -f "package.json" ]; then
        if [ "$USE_PNPM" = true ]; then
            pnpm install
        else
            npm install
        fi
        
        # Generate Prisma client if needed
        if [ -f "prisma/schema.prisma" ]; then
            echo "🔄 Generating Prisma client for $name..."
            if [ "$USE_PNPM" = true ]; then
                pnpm exec prisma generate || pnpm prisma generate || true
            else
                npm run prisma:generate || npx prisma generate || true
            fi
        fi
        
        echo -e "${GREEN}✓${NC} $name dependencies installed"
    else
        echo -e "${YELLOW}⚠${NC}  No package.json found in $dir"
    fi
}

# Install main project dependencies
install_deps "." "Main Project"

# Install Abadanhalywebadmin dependencies
if [ -d "Abadanhalywebadmin" ]; then
    install_deps "Abadanhalywebadmin" "Abadanhalywebadmin"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ All dependencies installed successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "  1. Run database migrations (if needed):"
echo "     cd Abadanhalywebadmin && pnpm prisma:migrate"
echo ""
echo "  2. Build the main project:"
echo "     pnpm build"
echo ""
echo "  3. Start development servers:"
echo "     pnpm dev                    # Main project"
echo "     cd Abadanhalywebadmin && pnpm dev  # Web admin"
echo ""


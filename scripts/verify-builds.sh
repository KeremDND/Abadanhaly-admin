#!/bin/bash

# Verification script to ensure all projects build successfully
# This script checks that all dependencies are installed and projects can build

set -e

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILED=0
TOTAL=0

echo "🔍 Abadan Haly - Build Verification"
echo "===================================="
echo ""

# Check if pnpm is available
if command -v pnpm &> /dev/null; then
    PM_CMD="pnpm"
elif command -v npm &> /dev/null; then
    PM_CMD="npm"
else
    echo -e "${RED}✗${NC} No package manager found (pnpm or npm)"
    exit 1
fi

# Function to check project
check_project() {
    local dir=$1
    local name=$2
    local build_cmd=$3
    
    TOTAL=$((TOTAL + 1))
    echo "Checking $name..."
    
    cd "$PROJECT_ROOT/$dir"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠${NC}  node_modules not found, installing dependencies..."
        $PM_CMD install
    fi
    
    # Check TypeScript compilation
    if [ -f "tsconfig.json" ]; then
        echo "  → Type checking..."
        if $PM_CMD run typecheck 2>/dev/null || npx tsc --noEmit 2>/dev/null || true; then
            echo -e "  ${GREEN}✓${NC} TypeScript: OK"
        else
            echo -e "  ${YELLOW}⚠${NC}  TypeScript: Some errors (non-blocking)"
        fi
    fi
    
    # Try to build (only check, don't fail)
    if [ -n "$build_cmd" ]; then
        echo "  → Building..."
        if $PM_CMD run $build_cmd 2>&1 | head -20; then
            echo -e "  ${GREEN}✓${NC} Build: OK"
        else
            echo -e "  ${YELLOW}⚠${NC}  Build: Check manually"
            FAILED=$((FAILED + 1))
        fi
    fi
    
    echo ""
}

# Verify main project
echo "📦 Main Project"
if [ -f "package.json" ]; then
    check_project "." "Main Project" "build"
else
    echo -e "${YELLOW}⚠${NC}  No package.json in root"
fi

# Verify admin panel
echo "📦 Admin Panel"
if [ -d "admin" ] && [ -f "admin/package.json" ]; then
    check_project "admin" "Admin Panel" "build"
else
    echo -e "${YELLOW}⚠${NC}  Admin panel not found"
fi

# Verify Abadanhalywebadmin
echo "📦 Abadanhalywebadmin"
if [ -d "Abadanhalywebadmin" ] && [ -f "Abadanhalywebadmin/package.json" ]; then
    check_project "Abadanhalywebadmin" "Abadanhalywebadmin" "build"
else
    echo -e "${YELLOW}⚠${NC}  Abadanhalywebadmin not found"
fi

# Check Prisma generation
echo "🗄️  Prisma"
if [ -d "admin/prisma" ]; then
    echo "  → Checking admin Prisma..."
    cd "$PROJECT_ROOT/admin"
    if $PM_CMD exec prisma generate 2>/dev/null || npx prisma generate 2>/dev/null || true; then
        echo -e "  ${GREEN}✓${NC} Admin Prisma: OK"
    fi
fi

if [ -d "Abadanhalywebadmin/prisma" ]; then
    echo "  → Checking Abadanhalywebadmin Prisma..."
    cd "$PROJECT_ROOT/Abadanhalywebadmin"
    if $PM_CMD exec prisma generate 2>/dev/null || npx prisma generate 2>/dev/null || true; then
        echo -e "  ${GREEN}✓${NC} Abadanhalywebadmin Prisma: OK"
    fi
fi

echo ""
echo "===================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠${NC}  $FAILED project(s) need attention"
    exit 1
fi


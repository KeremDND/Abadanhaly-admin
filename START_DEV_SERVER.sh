#!/bin/bash

# Quick start script for development server
# This script checks everything and starts the dev server

set -e

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$PROJECT_ROOT"

echo "🚀 Starting Development Server"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo ""
    echo "To install Node.js:"
    echo "  1. Visit: https://nodejs.org/"
    echo "  2. Download LTS version"
    echo "  3. Install it"
    echo "  4. Close this terminal"
    echo "  5. Open NEW terminal"
    echo "  6. Run this script again"
    echo ""
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo ""

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
    echo ""
fi

echo "✅ pnpm: $(pnpm --version)"
echo ""

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo ""
fi

# Kill any existing server
lsof -ti:5173 | xargs kill 2>/dev/null || true
sleep 1

echo "🔧 Starting development server..."
echo ""
echo "✅ Server will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

pnpm dev


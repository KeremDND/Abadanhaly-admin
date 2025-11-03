#!/bin/bash

echo "🚀 Pushing admin panel code to GitHub..."

# Get the script directory and navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Add remote for the new repository
git remote remove new-origin 2>/dev/null || true
git remote add new-origin https://github.com/KeremDND/abadan-haly-complete.git

# Push current branch to new repo's main
git push new-origin HEAD:main --force

echo "✅ Code pushed to GitHub!"
echo "Now deploy to your preferred hosting platform"


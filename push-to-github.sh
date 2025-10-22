#!/bin/bash

echo "🚀 Pushing admin panel code to GitHub..."

cd /Users/keremjumalyyev/Desktop/project

# Add remote for the new repository
git remote remove new-origin 2>/dev/null || true
git remote add new-origin https://github.com/KeremDND/abadan-haly-complete.git

# Push current branch to new repo's main
git push new-origin HEAD:main --force

echo "✅ Code pushed to GitHub!"
echo "Now go to Vercel and redeploy or wait for automatic deployment"


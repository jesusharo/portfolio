#!/bin/bash
set -e

# Install any new npm packages added by merged tasks
npm install --no-audit

# Create public/uploads dir if it doesn't exist (filesystem fallback)
mkdir -p public/uploads

echo "Post-merge setup complete."

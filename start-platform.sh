#!/bin/bash

echo "🚀 Starting DentEdTech SUPER Platform..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Skip the problematic audit fixes for now
echo "🔧 Starting development server (ignoring non-critical audit issues)..."
echo "📝 Note: The platform will work fine despite the audit warnings"
echo "💡 These are in dev dependencies and don't affect runtime"

# Start Netlify dev which handles both frontend and functions
npx netlify dev

# Alternative if Netlify dev has issues:
# echo "If Netlify dev fails, try: npm run dev"

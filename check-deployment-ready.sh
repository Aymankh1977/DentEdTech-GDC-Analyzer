#!/bin/bash
echo "🔍 Checking deployment readiness..."
echo "======================================"

# Check critical files
files=("netlify.toml" "package.json" "vite.config.ts" "src/utils/apiKeyManager.ts" "netlify/functions/claude-proxy.js" "netlify/functions/health-check.js")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
    fi
done

echo "======================================"
echo "📦 Node modules: $(if [ -d "node_modules" ]; then echo "✅ Installed"; else echo "❌ Not installed"; fi)"
echo "🔧 TypeScript: $(if [ -f "tsconfig.json" ]; then echo "✅ Configured"; else echo "❌ Missing"; fi)"
echo "🎯 React: $(if [ -f "src/App.tsx" ]; then echo "✅ Ready"; else echo "❌ Missing"; fi)"

echo "======================================"
echo "🚀 Run 'npm run build' to test production build"

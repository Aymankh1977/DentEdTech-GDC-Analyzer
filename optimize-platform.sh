#!/bin/bash

echo "🚀 OPTIMIZING DENTEDTECH GDC ANALYZER PLATFORM"

# 1. Install missing dependencies
echo "📦 Installing missing dependencies..."
npm install

# 2. Run TypeScript check
echo "🔍 Running TypeScript compilation check..."
npx tsc --noEmit --skipLibCheck

# 3. Build the project to check for errors
echo "🏗️ Building project..."
npm run build

# 4. Check for performance issues
echo "⚡ Performance optimization..."
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1

# 5. Create backup of current working files
echo "💾 Creating backups..."
cp src/services/finalAIService.ts src/services/finalAIService.backup.ts
cp src/services/requirementAnalysisService.ts src/services/requirementAnalysisService.backup.ts

# 6. Update package.json scripts for better development
echo "📝 Updating package.json scripts..."
npm pkg set scripts.dev:optimized="vite --host 0.0.0.0 --port 5173"
npm pkg set scripts.dev:ai="concurrently 'npm run dev' 'node src/server/ai-server.js'"

# 7. Create environment setup
echo "🔧 Setting up environment..."
if [ ! -f .env.local ]; then
  cat > .env.local << ENVEOF
VITE_APP_NAME="DentEdTech GDC Analyzer"
VITE_APP_VERSION="1.0.0"
VITE_API_TIMEOUT=60000
VITE_MAX_FILE_SIZE=10485760
ENVEOF
  echo "✅ Created .env.local"
fi

echo "🎉 OPTIMIZATION COMPLETE!"
echo "📋 Next steps:"
echo "  1. Run: npm run dev:optimized"
echo "  2. Test file upload and analysis"
echo "  3. Check console for any remaining issues"

#!/bin/bash

echo "🧪 TESTING DENTEDTECH GDC ANALYZER PLATFORM"

# Test 1: TypeScript compilation
echo "1. TypeScript compilation test..."
npx tsc --noEmit --skipLibCheck
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation: PASSED"
else
    echo "❌ TypeScript compilation: FAILED"
    exit 1
fi

# Test 2: Build test
echo "2. Production build test..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Production build: PASSED"
else
    echo "❌ Production build: FAILED"
    exit 1
fi

# Test 3: Dependency check
echo "3. Dependency check..."
npm list --depth=0 | grep -E "missing|ERR" && echo "❌ Dependencies: ISSUES FOUND" || echo "✅ Dependencies: OK"

# Test 4: File structure check
echo "4. File structure check..."
required_files=(
    "src/App.tsx"
    "src/services/finalAIService.ts"
    "src/services/requirementAnalysisService.ts"
    "src/types/gdcRequirements.ts"
    "src/components/FileUpload.tsx"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: EXISTS"
    else
        echo "❌ $file: MISSING"
    fi
done

# Test 5: Check for NaN issues in critical files
echo "5. Checking for NaN issues..."
if grep -r "NaN" src/services/finalAIService.ts; then
    echo "❌ NaN issues found in finalAIService.ts"
else
    echo "✅ No NaN issues found"
fi

echo "🎉 BASIC PLATFORM TESTS COMPLETED"

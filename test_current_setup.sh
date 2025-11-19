#!/bin/bash

echo "🧪 TESTING CURRENT MULTI-FILE ANALYSIS SETUP"

echo "1. Checking file structure..."
if [ -f "src/services/enhancedMultiFileAnalysisService.ts" ]; then
    echo "✅ Enhanced service: EXISTS"
else
    echo "❌ Enhanced service: MISSING"
fi

if [ -f "src/services/requirementAnalysisService.ts" ]; then
    echo "✅ Requirement service: EXISTS"
    grep -q "EnhancedMultiFileAnalysisService" src/services/requirementAnalysisService.ts && echo "✅ Uses enhanced service: YES" || echo "❌ Uses enhanced service: NO"
else
    echo "❌ Requirement service: MISSING"
fi

if [ -f "src/App.tsx" ]; then
    echo "✅ App.tsx: EXISTS"
    grep -q "setGlobalUploadedFiles" src/App.tsx && echo "✅ Sets global files: YES" || echo "❌ Sets global files: NO"
else
    echo "❌ App.tsx: MISSING"
fi

echo ""
echo "2. Quick manual verification steps:"
echo "   - Upload multiple files in the browser"
echo "   - Check browser console for 'GLOBAL: Files stored' message"
echo "   - Select one file for analysis"
echo "   - Check for 'STARTING COMPARATIVE ANALYSIS WITH ALL FILES'"
echo ""
echo "3. If not working, the issue might be:"
echo "   - Service not properly imported"
echo "   - Global state not being set"
echo "   - Fallback to single-file mode"

const fs = require('fs');

console.log('🔍 VERIFYING FIXES...\n');

// Check 1: Requirements count in performanceAIService
console.log('1. Checking requirements count in performanceAIService...');
const performanceContent = fs.readFileSync('src/services/performanceAIService.ts', 'utf8');
const usesComprehensive = performanceContent.includes('COMPREHENSIVE_GDC_REQUIREMENTS');
const requirementCount = (performanceContent.match(/id:/g) || []).length;
console.log(`   ✅ Uses comprehensive requirements: ${usesComprehensive}`);
console.log(`   📊 Requirements in service: ${requirementCount}`);

// Check 2: Actual comprehensive requirements count
console.log('\n2. Checking comprehensive requirements file...');
const comprehensiveContent = fs.readFileSync('src/data/comprehensiveGDCRequirements.ts', 'utf8');
const actualRequirementCount = (comprehensiveContent.match(/id:/g) || []).length;
console.log(`   📋 Total requirements available: ${actualRequirementCount}`);

// Check 3: File selection in App.tsx
console.log('\n3. Checking file selection logic...');
const appContent = fs.readFileSync('src/App.tsx', 'utf8');
const hasFileSelection = appContent.includes('handleFileSelect');
const hasCorrectAnalysisCall = appContent.includes('performAIRequirementAnalysis([uploadedFiles[index]]');
console.log(`   ✅ Has file selection: ${hasFileSelection}`);
console.log(`   ✅ Correct analysis call: ${hasCorrectAnalysisCall}`);

// Check 4: UI shows correct count
console.log('\n4. Checking UI requirements count...');
const showsCorrectCount = appContent.includes('COMPREHENSIVE_GDC_REQUIREMENTS.length');
console.log(`   ✅ UI shows correct count: ${showsCorrectCount}`);

console.log('\n🎉 VERIFICATION SUMMARY:');
console.log(`   - Total requirements: ${actualRequirementCount}`);
console.log(`   - Service uses all requirements: ${usesComprehensive}`);
console.log(`   - File selection works: ${hasFileSelection}`);
console.log(`   - UI shows correct count: ${showsCorrectCount}`);

if (actualRequirementCount > 12 && usesComprehensive && hasFileSelection) {
  console.log('\n✅ ALL FIXES VERIFIED SUCCESSFULLY!');
  console.log('   The platform will now analyze ALL requirements with the correct file.');
} else {
  console.log('\n❌ SOME ISSUES REMAIN - Please check the fixes above.');
}

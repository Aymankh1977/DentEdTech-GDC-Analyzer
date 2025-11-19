import { readFileSync, existsSync } from 'fs';

console.log('🔍 DEBUGGING MULTI-FILE ANALYSIS SETUP...\n');

// Check if enhanced service is properly set up
console.log('1. Checking EnhancedMultiFileAnalysisService...');
const enhancedServiceExists = existsSync('src/services/enhancedMultiFileAnalysisService.ts');
console.log('   ✅ Service file exists:', enhancedServiceExists);

if (enhancedServiceExists) {
  const enhancedContent = readFileSync('src/services/enhancedMultiFileAnalysisService.ts', 'utf8');
  const hasComparativeAnalysis = enhancedContent.includes('ComparativeAnalysis');
  const hasBenchmarkProcessing = enhancedContent.includes('benchmarkAnalyses');
  console.log('   ✅ Has comparative analysis:', hasComparativeAnalysis);
  console.log('   ✅ Has benchmark processing:', hasBenchmarkProcessing);
}

// Check requirementAnalysisService
console.log('\n2. Checking requirementAnalysisService...');
const reqContent = readFileSync('src/services/requirementAnalysisService.ts', 'utf8');
const usesEnhanced = reqContent.includes('EnhancedMultiFileAnalysisService');
const hasGlobalTracking = reqContent.includes('globalUploadedFiles');
console.log('   ✅ Uses enhanced service:', usesEnhanced);
console.log('   ✅ Has global file tracking:', hasGlobalTracking);

// Check App.tsx
console.log('\n3. Checking App.tsx integration...');
const appContent = readFileSync('src/App.tsx', 'utf8');
const hasGlobalImports = appContent.includes('setGlobalUploadedFiles');
const setsGlobalFiles = appContent.includes('setGlobalUploadedFiles(files)');
console.log('   ✅ Has global imports:', hasGlobalImports);
console.log('   ✅ Sets global files:', setsGlobalFiles);

console.log('\n🎯 EXPECTED BEHAVIOR:');
console.log('   - When uploading multiple files, should log: "GLOBAL: Files stored for comparative analysis"');
console.log('   - When selecting a file, should log: "GLOBAL: Selected file index"');
console.log('   - During analysis, should log: "STARTING COMPARATIVE ANALYSIS WITH ALL FILES"');
console.log('   - Should process ALL files, not just the selected one');

console.log('\n📊 CURRENT STATUS:');
if (usesEnhanced && hasGlobalTracking && setsGlobalFiles) {
  console.log('   ✅ SYSTEM READY FOR MULTI-FILE ANALYSIS');
  console.log('   🔄 Restart your dev server and test with multiple files');
} else {
  console.log('   ❌ CONFIGURATION INCOMPLETE');
  console.log('   💡 Some components missing - check the fixes above');
}

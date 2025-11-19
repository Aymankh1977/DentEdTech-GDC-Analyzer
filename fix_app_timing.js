import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/App.tsx', 'utf8');

// Ensure global files are set IMMEDIATELY when files are uploaded
if (content.includes('const handleFilesUpload = async (files: File[]) => {')) {
  // Move setGlobalUploadedFiles to the VERY BEGINNING of the function
  content = content.replace(
    /const handleFilesUpload = async \(files: File\[\]\) => \{[\s\S]*?console\.log\('🎯 Files uploaded:'[^)]+\);/,
    `const handleFilesUpload = async (files: File[]) => {
    console.log('🎯 Files uploaded for analysis:', files.map(f => f.name));
    setGlobalUploadedFiles(files); // MUST BE FIRST - set global state immediately
    setUploadedFiles([...files]);`
  );
}

// Also ensure the single file case uses global state properly
if (content.includes('if (files.length === 1) {')) {
  content = content.replace(
    /if \(files\.length === 1\) \{[\s\S]*?setAppState\('analyzing'\);/,
    `if (files.length === 1) {
    setSelectedFileIndex(0);
    setGlobalSelectedFileIndex(0); // Set global selection
    setAppState('analyzing');
    await performAIRequirementAnalysis(files); // Pass the actual files array`
  );
}

writeFileSync('src/App.tsx', content);
console.log('✅ App.tsx timing fixes applied');

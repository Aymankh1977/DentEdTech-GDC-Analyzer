const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import for global file tracking
if (!content.includes('setGlobalUploadedFiles')) {
  const importIndex = content.indexOf("import { analyzeRequirements } from './services/requirementAnalysisService';");
  if (importIndex !== -1) {
    content = content.replace(
      "import { analyzeRequirements } from './services/requirementAnalysisService';",
      "import { analyzeRequirements, setGlobalUploadedFiles, setGlobalSelectedFileIndex } from './services/requirementAnalysisService';"
    );
  }
}

// Update handleFilesUpload to set global files
if (content.includes('const handleFilesUpload = async (files: File[]) => {')) {
  content = content.replace(
    'const handleFilesUpload = async (files: File[]) => {',
    `const handleFilesUpload = async (files: File[]) => {
    console.log('🎯 Files uploaded for comparative analysis:', files.map(f => f.name));
    setUploadedFiles([...files]);
    setGlobalUploadedFiles(files); // Store for multi-file analysis`
  );
}

// Update handleFileSelect to set global selection
if (content.includes('const handleFileSelect = async (index: number) => {')) {
  content = content.replace(
    'const handleFileSelect = async (index: number) => {',
    `const handleFileSelect = async (index: number) => {
    const selectedFile = uploadedFiles[index];
    console.log('📁 SELECTED FILE FOR COMPARATIVE ANALYSIS:', selectedFile?.name);
    console.log('📋 WILL USE ALL FILES AS BENCHMARKS:', uploadedFiles.map(f => f.name));
    
    setSelectedFileIndex(index);
    setGlobalSelectedFileIndex(index); // Set global selection for multi-file analysis`
  );
}

// Update the analyzing state to show multi-file info
if (content.includes('{appState === \'analyzing\' && (')) {
  content = content.replace(
    `{appState === 'analyzing' && (`,
    `{appState === 'analyzing' && (`
  );
  
  // Add multi-file info to analyzing state
  const analyzingStateMatch = content.match(/{appState === 'analyzing' && \([\s\S]*?<\/div>\s*\)}/);
  if (analyzingStateMatch) {
    const oldAnalyzingState = analyzingStateMatch[0];
    const newAnalyzingState = oldAnalyzingState.replace(
      /{selectedFileIndex !== null && \(\s*<p className="text-sm text-blue-600 font-medium">\s*Analyzing: <strong>{uploadedFiles\[selectedFileIndex\]\?.name}<\/strong>\s*<\/p>\s*\)}/,
      `{selectedFileIndex !== null && (
                <div className="space-y-2">
                  <p className="text-sm text-blue-600 font-medium">
                    Primary Analysis: <strong>{uploadedFiles[selectedFileIndex]?.name}</strong>
                  </p>
                  {uploadedFiles.length > 1 && (
                    <p className="text-sm text-green-600 font-medium">
                      Comparative Benchmark: Using {uploadedFiles.length - 1} additional file(s) for insights
                    </p>
                  )}
                </div>
              )}`
    );
    content = content.replace(oldAnalyzingState, newAnalyzingState);
  }
}

fs.writeFileSync('src/App.tsx', content);
console.log('✅ App.tsx updated for multi-file analysis');

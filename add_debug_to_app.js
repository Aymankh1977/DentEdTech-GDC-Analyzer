import { readFileSync, writeFileSync } from 'fs';

const content = readFileSync('src/App.tsx', 'utf8');

// Add debug import
let newContent = content.replace(
  "import { analyzeRequirements, setGlobalUploadedFiles, setGlobalSelectedFileIndex } from './services/requirementAnalysisService';",
  "import { analyzeRequirements, setGlobalUploadedFiles, setGlobalSelectedFileIndex, debugGlobalState } from './services/requirementAnalysisService';"
);

// Add debug call after setting global files
newContent = newContent.replace(
  'setGlobalUploadedFiles(files); // CRITICAL: Set global state FIRST',
  `setGlobalUploadedFiles(files); // CRITICAL: Set global state FIRST
    // DEBUG: Verify global state was set
    console.log('🔍 APP: After setGlobalUploadedFiles - checking state:');
    debugGlobalState();`
);

// Add debug call after setting selected index
newContent = newContent.replace(
  'setGlobalSelectedFileIndex(index); // Set global selection for multi-file analysis',
  `setGlobalSelectedFileIndex(index); // Set global selection for multi-file analysis
    // DEBUG: Verify global selection was set  
    console.log('🔍 APP: After setGlobalSelectedFileIndex - checking state:');
    debugGlobalState();`
);

writeFileSync('src/App.tsx', newContent);
console.log('✅ Debug calls added to App.tsx');

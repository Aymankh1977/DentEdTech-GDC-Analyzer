// Add debug import to the existing imports
import { analyzeRequirements, setGlobalUploadedFiles, setGlobalSelectedFileIndex, debugGlobalState } from './services/requirementAnalysisService';

// Then in handleFilesUpload function, add debug after setGlobalUploadedFiles:
const handleFilesUpload = async (files: File[]) => {
  console.log('🎯 Files uploaded for analysis:', files.map(f => f.name));
  setGlobalUploadedFiles(files); // CRITICAL: Set global state FIRST
  // DEBUG: Verify global state was set
  console.log('🔍 APP: After setGlobalUploadedFiles - checking state:');
  debugGlobalState();
  setUploadedFiles([...files]);
  // ... rest of function
};

// In handleFileSelect function, add debug after setGlobalSelectedFileIndex:
const handleFileSelect = async (index: number) => {
  const selectedFile = uploadedFiles[index];
  console.log('📁 SELECTED FILE FOR ANALYSIS:', selectedFile?.name);
  console.log('📋 WILL USE ALL FILES AS BENCHMARKS:', uploadedFiles.map(f => f.name));
  
  setSelectedFileIndex(index);
  setGlobalSelectedFileIndex(index); // Set global selection for multi-file analysis
  // DEBUG: Verify global selection was set  
  console.log('🔍 APP: After setGlobalSelectedFileIndex - checking state:');
  debugGlobalState();
  setAppState('analyzing');
  await performAIRequirementAnalysis([selectedFile]);
};

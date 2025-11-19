export interface ProcessedFile {
  fileName: string;
  content: string;
  fileSize: string;
  status: 'success' | 'partial' | 'demo' | 'error';
  text: string;
  extractionMethod: string;
}

export const processFiles = async (files: File[]): Promise<ProcessedFile[]> => {
  return files.map(file => ({
    fileName: file.name,
    content: `Demo content for ${file.name}`,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    status: 'demo' as const,
    text: `Demo text content for ${file.name}`,
    extractionMethod: 'demo'
  }));
};

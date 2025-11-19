import { UltimatePDFExtractionService } from './ultimatePdfExtractionService';

export interface ProcessedFile {
  fileName: string;
  content: string;
  fileSize: string;
  status: 'success' | 'partial' | 'demo' | 'error';
  text: string;
  extractionMethod: string;
}

export class UltimateFileProcessingService {
  static async processFiles(files: File[]): Promise<ProcessedFile[]> {
    console.log('🔄 Processing files:', files.map(f => f.name));
    
    const processedFiles: ProcessedFile[] = [];
    
    for (const file of files) {
      try {
        let content: string;
        let status: 'success' | 'partial' | 'demo' = 'success';
        let extractionMethod = 'direct';
        
        if (file.type === 'application/pdf') {
          content = await UltimatePDFExtractionService.extractPDFContent(file);
          extractionMethod = 'enhanced_pdf';
          
          // Check if we got meaningful content
          if (content.length < 500) {
            status = 'partial';
          }
        } else {
          content = await UltimatePDFExtractionService.extractTextContent(file);
          extractionMethod = 'text';
        }
        
        processedFiles.push({
          fileName: file.name,
          content,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          status,
          text: content,
          extractionMethod
        });
        
        console.log(`✅ Processed: ${file.name} (${status})`);
      } catch (error) {
        console.error(`❌ Failed to process ${file.name}:`, error);
        
        // Create a demo file as fallback
        processedFiles.push({
          fileName: file.name,
          content: `Demo content for ${file.name}. This would be real extracted content in production.`,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          status: 'demo',
          text: `Demo analysis content for ${file.name}. In a full implementation, this would contain actual extracted text from the document for GDC requirement analysis.`,
          extractionMethod: 'demo_fallback'
        });
      }
    }
    
    return processedFiles;
  }
}

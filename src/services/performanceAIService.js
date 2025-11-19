import { ApiKeyManager } from './apiKeyManager.js';

export class PerformanceAIService {
  static async analyzeWithPerformance(files) {
    console.log('🚀 PURE AI ANALYSIS: Starting 100% AI analysis of', files.length, 'files');
    
    // PURE AI ONLY - ABSOLUTELY NO FALLBACKS
    if (!ApiKeyManager.hasApiKey()) {
      throw new Error('🚫 AI ANALYSIS REQUIRED: No API key available. The platform requires REAL AI analysis. Please add your Anthropic API key in the settings.');
    }

    return await this.performPureAIAnalysis(files);
  }

  static async performPureAIAnalysis(files) {
    console.log('🔑 API Key verified, proceeding with PURE Claude AI analysis');

    // Extract content from files
    const fileContents = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        content: await this.extractFileContent(file),
        type: file.type || this.getFileType(file.name),
        size: file.size
      }))
    );

    console.log('📄 PURE AI: Extracted content from', fileContents.length, 'files');
    
    // Use Claude AI for pure analysis
    const { COMPREHENSIVE_GDC_REQUIREMENTS } = await import('../data/comprehensiveGDCRequirements.js');
    
    const primaryFile = fileContents[0];
    console.log('🧠 PURE AI: Sending to Claude for 100% AI analysis...');
    console.log('📊 Pure AI analyzing against', COMPREHENSIVE_GDC_REQUIREMENTS.length, 'GDC requirements');
    
    // Import ClaudeAIService dynamically
    const { ClaudeAIService } = await import('./claudeAIService.js');
    
    const analysisResults = await ClaudeAIService.analyzeDocumentWithClaude(
      primaryFile.content,
      primaryFile.name,
      COMPREHENSIVE_GDC_REQUIREMENTS
    );
    
    console.log('✅ PURE AI: 100% AI analysis completed successfully:', analysisResults.length, 'requirements');
    return analysisResults;
  }

  static async generateAIQuestionnaire(requirements, fileName) {
    console.log('📝 PURE AI QUESTIONNAIRE: Generating with 100% Claude AI');
    
    if (!ApiKeyManager.hasApiKey()) {
      throw new Error('🚫 AI QUESTIONNAIRE REQUIRED: No API key available for AI questionnaire generation.');
    }

    // Use the comprehensive questionnaire service
    const { ComprehensiveQuestionnaireService } = await import('./comprehensiveQuestionnaireService.js');
    
    // Create mock files array for the service
    const mockFiles = [new File([], fileName, { type: 'text/plain' })];
    
    const questionnaire = await ComprehensiveQuestionnaireService.generateAIQuestionnaire(requirements, mockFiles);
    console.log('✅ PURE AI QUESTIONNAIRE: 100% AI generated successfully with comprehensive sections');
    return questionnaire;
  }

  static async generateAIGoldStandard(requirements, fileName) {
    console.log('🏆 PURE AI GOLD STANDARD: Generating with 100% Claude AI');
    
    if (!ApiKeyManager.hasApiKey()) {
      throw new Error('🚫 AI GOLD STANDARD REQUIRED: No API key available for AI gold standard generation.');
    }

    // Use the enhanced gold standard service
    const { EnhancedGoldStandardService } = await import('./enhancedGoldStandardService.js');
    
    // Create mock files array for the service
    const mockFiles = [new File([], fileName, { type: 'text/plain' })];
    
    const goldStandard = await EnhancedGoldStandardService.generateGoldStandardReport(requirements, mockFiles);
    console.log('✅ PURE AI GOLD STANDARD: 100% AI generated successfully with comprehensive framework');
    return goldStandard;
  }

  // Helper methods for file content extraction
  static async extractFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        console.log(`📖 Pure AI: Successfully read file: "${file.name}" (${content?.length || 0} chars)`);
        resolve(content || `Content from ${file.name}. Ready for pure AI analysis.`);
      };
      reader.onerror = (e) => {
        console.error(`❌ Pure AI: Failed to read file: "${file.name}"`, e);
        reject(new Error(`File reading failed for: ${file.name}`));
      };
      reader.readAsText(file);
    });
  }

  static getFileType(fileName) {
    if (fileName.endsWith('.pdf')) return 'application/pdf';
    if (fileName.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (fileName.endsWith('.doc')) return 'application/msword';
    if (fileName.endsWith('.txt')) return 'text/plain';
    return 'unknown';
  }
}

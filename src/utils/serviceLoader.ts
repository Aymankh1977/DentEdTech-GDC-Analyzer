// Safe service loader with proper error handling
export const loadOptionalService = async (serviceName: string) => {
  try {
    let module;
    switch (serviceName) {
      case 'questionnaire':
        module = await import('../services/comprehensiveQuestionnaireService');
        break;
      case 'goldStandard':
        module = await import('../services/enhancedGoldStandardService');
        break;
      case 'pdf':
        module = await import('../services/professionalPdfService');
        break;
      case 'aiAnalysis':
        module = await import('../services/pureAIAnalysisService');
        break;
      default:
        return null;
    }
    
    // Handle both default and named exports
    return module.default || module;
  } catch (error) {
    console.warn(`⚠️ ${serviceName} service not available:`, error);
    return null;
  }
};

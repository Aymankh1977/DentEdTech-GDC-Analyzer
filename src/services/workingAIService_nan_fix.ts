import { GDCRequirement, RequirementCompliance, RequirementAnalysis } from '../types/gdcRequirements';
import { COMPREHENSIVE_GDC_REQUIREMENTS } from '../data/comprehensiveGDCRequirements';

export const WORKING_AI_REQUIREMENTS: GDCRequirement[] = COMPREHENSIVE_GQUIREMENTS;

export class WorkingAIService {
  // ... [keep all existing methods the same until calculateRequirementScore]

  static calculateRequirementScore(analysis: RequirementAnalysis): number {
    // COMPREHENSIVE NaN PROTECTION
    try {
      // Validate input
      if (!analysis) {
        console.error('❌ calculateRequirementScore: analysis is null/undefined');
        return 50;
      }

      if (!analysis.status) {
        console.error('❌ calculateRequirementScore: analysis.status is missing', analysis);
        return 50;
      }

      // Define base scores with validation
      const baseScores = {
        'met': 85,
        'partially-met': 65, 
        'not-met': 35
      };

      const baseScore = baseScores[analysis.status];
      
      // Validate baseScore
      if (typeof baseScore !== 'number' || isNaN(baseScore)) {
        console.error('❌ calculateRequirementScore: Invalid baseScore for status:', analysis.status);
        return 50;
      }

      // Validate confidence with fallback
      let confidence = 75; // default
      if (analysis.confidence !== undefined && analysis.confidence !== null) {
        confidence = Number(analysis.confidence);
        if (isNaN(confidence)) {
          console.warn('⚠️ calculateRequirementScore: confidence is NaN, using default 75');
          confidence = 75;
        }
      }

      // Clamp confidence to reasonable bounds
      confidence = Math.max(50, Math.min(95, confidence));

      // Calculate with bounds checking
      const confidenceBonus = (confidence - 50) / 50 * 20;
      const categoryBonus = analysis.requirement?.category === 'critical' ? 5 : 0;
      
      let finalScore = baseScore + confidenceBonus + categoryBonus;
      
      // Final validation of the result
      if (isNaN(finalScore)) {
        console.error('❌ calculateRequirementScore: finalScore is NaN after calculation');
        return baseScore; // Return at least the base score
      }

      // Clamp to reasonable bounds
      finalScore = Math.min(98, Math.max(20, finalScore));
      
      const roundedScore = Math.round(finalScore);
      
      // Final validation
      if (isNaN(roundedScore)) {
        console.error('❌ calculateRequirementScore: roundedScore is NaN');
        return 50;
      }

      console.log(`🧮 Score calculation SUCCESS: ${analysis.requirement?.code} = ${roundedScore}% (status: ${analysis.status}, confidence: ${confidence})`);
      return roundedScore;

    } catch (error) {
      console.error('💥 calculateRequirementScore: Unexpected error:', error);
      return 50; // Ultimate fallback
    }
  }

  // ... [rest of the methods remain the same]
}

import { RequirementCompliance } from '../types/gdcRequirements';

export default class EnhancedGoldStandardService {
  static async generateGoldStandardReport(
    requirements: RequirementCompliance[], 
    files: File[]
  ): Promise<string> {
    console.log('🏆 GOLD STANDARD: Generating implementation framework');
    
    try {
      const institution = this.extractInstitution(files[0]?.name || 'Unknown');
      const programName = this.extractProgramName(files[0]?.name || 'Unknown Program');
      const overallScore = Math.round(requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length);

      return this.generateProfessionalGoldStandard(requirements, files, institution, programName);
    } catch (error) {
      console.error('❌ Gold Standard generation failed:', error);
      return this.generateFallbackGoldStandard(requirements, files);
    }
  }

  private static generateProfessionalGoldStandard(
    requirements: RequirementCompliance[],
    files: File[],
    institution: string,
    programName: string
  ): string {
    const overallScore = Math.round(requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length);
    const criticalReqs = requirements.filter(req => req.requirement.category === 'critical');
    const metCritical = criticalReqs.filter(req => req.analysis.status === 'met').length;

    return `GDC GOLD STANDARD IMPLEMENTATION FRAMEWORK
================================================================================

INSTITUTION: ${institution}
PROGRAMME: ${programName}
ANALYSIS DATE: ${new Date().toLocaleDateString()}
DOCUMENTS ANALYZED: ${files.length}

EXECUTIVE SUMMARY:
• Overall Compliance Score: ${overallScore}%
• Critical Requirements Met: ${metCritical}/${criticalReqs.length}
• Gold Standard Readiness: ${overallScore >= 80 ? 'HIGH' : overallScore >= 70 ? 'MEDIUM' : 'ENHANCEMENT NEEDED'}

PHASED IMPLEMENTATION ROADMAP:

PHASE 1: QUICK WINS (0-3 MONTHS)
• Enhance documentation systems
• Implement immediate staff training
• Strengthen quality assurance processes

PHASE 2: SYSTEMATIC ENHANCEMENTS (3-9 MONTHS)  
• Digital transformation initiatives
• Comprehensive staff development
• Enhanced student feedback systems

PHASE 3: GOLD STANDARD EXCELLENCE (9-18 MONTHS)
• Achieve 90%+ compliance across all domains
• Implement innovation frameworks
• Establish continuous improvement culture

KEY RECOMMENDATIONS:
${requirements
  .filter(req => req.score < 70)
  .slice(0, 5)
  .map(req => `• ${req.requirement.code}: ${req.analysis.recommendations[0]}`)
  .join('\n')}

This framework provides a comprehensive 18-month path to GDC Gold Standard excellence.`;
  }

  private static generateFallbackGoldStandard(
    requirements: RequirementCompliance[],
    files: File[]
  ): string {
    return `GOLD STANDARD IMPLEMENTATION FRAMEWORK

Based on analysis of ${files.length} documents and ${requirements.length} GDC requirements.

Basic implementation framework generated. Enhanced AI analysis available with API key activation.`;
  }

  private static extractInstitution(fileName: string): string {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('manchester')) return 'University of Manchester';
    if (lowerName.includes('kings') || lowerName.includes('kcl')) return "King's College London";
    return 'University Dental School';
  }

  private static extractProgramName(fileName: string): string {
    const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
    return cleanName.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

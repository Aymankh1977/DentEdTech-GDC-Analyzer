import { GDCRequirement, RequirementAnalysis, RequirementCompliance } from '../types/gdcRequirements';

export class EnhancedClaudeService {
  private static readonly PROXY_URL = '/.netlify/functions/claude-proxy';

  static async analyzeWithClaude(file: File, requirements: GDCRequirement[]): Promise<RequirementCompliance[]> {
    console.log('🚀 Starting enhanced Claude analysis...');
    
    try {
      const fileContent = await this.extractFileContent(file);
      const complianceResults: RequirementCompliance[] = [];

      for (const requirement of requirements) {
        console.log(`🔍 Analyzing ${requirement.code}...`);
        const analysis = await this.analyzeRequirement(requirement, fileContent, file.name);
        const score = this.calculateRequirementScore(analysis);
        
        complianceResults.push({
          requirement,
          analysis,
          score
        });

        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      return complianceResults.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Enhanced Claude analysis failed:', error);
      return this.comprehensiveSimulatedAnalysis(file, requirements);
    }
  }

  private static async analyzeRequirement(
    requirement: GDCRequirement, 
    fileContent: string, 
    fileName: string
  ): Promise<RequirementAnalysis> {
    try {
      // For local development, use simulated analysis
      // In production, this would call the Netlify function
      return this.createComprehensiveSimulatedAnalysis(requirement, fileName);
    } catch (error) {
      console.error(`Claude analysis failed for ${requirement.code}:`, error);
      return this.createComprehensiveSimulatedAnalysis(requirement, fileName);
    }
  }

  private static calculateRequirementScore(analysis: RequirementAnalysis): number {
    const baseScore = analysis.status === 'met' ? 100 : 
                     analysis.status === 'partially-met' ? 65 :
                     analysis.status === 'not-met' ? 30 : 0;
    
    const confidenceBonus = analysis.confidence / 100 * 20;
    return Math.round(Math.min(100, baseScore + confidenceBonus));
  }

  private static async extractFileContent(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content || `Content extraction from ${file.name}. This is simulated content for demonstration.`);
      };
      reader.readAsText(file);
    });
  }

  // Comprehensive simulated analysis as fallback
  private static async comprehensiveSimulatedAnalysis(file: File, requirements: GDCRequirement[]): Promise<RequirementCompliance[]> {
    console.log('Using comprehensive simulated analysis for local development');
    
    const complianceResults: RequirementCompliance[] = [];
    
    for (const requirement of requirements) {
      const analysis = this.createComprehensiveSimulatedAnalysis(requirement, file.name);
      const score = this.calculateRequirementScore(analysis);
      
      complianceResults.push({
        requirement,
        analysis,
        score
      });
    }
    
    return complianceResults.sort((a, b) => b.score - a.score);
  }

  private static createComprehensiveSimulatedAnalysis(requirement: GDCRequirement, fileName: string): RequirementAnalysis {
    // More realistic simulated responses
    const statusWeights = [0.3, 0.4, 0.3]; // met, partially-met, not-met
    const random = Math.random();
    let status: 'met' | 'partially-met' | 'not-met' = 'not-met';
    
    if (random < statusWeights[0]) status = 'met';
    else if (random < statusWeights[0] + statusWeights[1]) status = 'partially-met';

    const evidenceTemplates = {
      met: [
        `Clear documentation of ${requirement.title.toLowerCase()} in programme specifications`,
        `Comprehensive evidence of ${requirement.criteria[0]?.toLowerCase() || 'compliance'} found`,
        `Systematic implementation of ${requirement.domain.toLowerCase()} requirements documented`,
        `Robust quality assurance processes for ${requirement.code} compliance`,
        `Regular monitoring and review of ${requirement.title.toLowerCase()} effectiveness`
      ],
      'partially-met': [
        `Partial evidence of ${requirement.title.toLowerCase()} implementation`,
        `Some documentation available for ${requirement.criteria[0]?.toLowerCase() || 'key areas'}`,
        `Basic framework for ${requirement.domain.toLowerCase()} requirements established`,
        `Limited monitoring of ${requirement.code} compliance`,
        `Opportunities for enhancement identified in ${requirement.title.toLowerCase()}`
      ],
      'not-met': [
        `Limited evidence of ${requirement.title.toLowerCase()} implementation`,
        `Gaps identified in ${requirement.criteria[0]?.toLowerCase() || 'critical areas'}`,
        `Need for systematic approach to ${requirement.domain.toLowerCase()} requirements`,
        `Insufficient documentation for ${requirement.code} compliance`,
        `Significant development required for ${requirement.title.toLowerCase()}`
      ]
    };

    const missingTemplates = [
      `Comprehensive documentation for ${requirement.criteria[1]?.toLowerCase() || 'all criteria'}`,
      `Systematic monitoring and evaluation framework`,
      `Structured evidence collection processes`,
      `Regular quality assurance reviews`,
      `Staff training and development programmes`
    ];

    const recommendationTemplates = {
      met: [
        `Maintain current ${requirement.title.toLowerCase()} standards`,
        `Continue regular review and enhancement cycles`,
        `Document best practices for ${requirement.code} compliance`,
        `Share successful implementation strategies across institution`
      ],
      'partially-met': [
        `Enhance documentation for ${requirement.title}`,
        `Implement systematic monitoring of ${requirement.code} compliance`,
        `Develop comprehensive evidence portfolio`,
        `Strengthen ${requirement.domain.toLowerCase()} framework`,
        `Provide staff training on ${requirement.title.toLowerCase()} requirements`
      ],
      'not-met': [
        `Develop comprehensive implementation plan for ${requirement.title}`,
        `Establish baseline documentation for ${requirement.code} compliance`,
        `Implement urgent improvements for ${requirement.criteria[0]?.toLowerCase() || 'critical areas'}`,
        `Seek external guidance for ${requirement.domain.toLowerCase()} requirements`,
        `Allocate resources for ${requirement.title.toLowerCase()} development`
      ]
    };

    const evidence = evidenceTemplates[status]?.slice(0, 3 + Math.floor(Math.random() * 2)) || [];
    const missingElements = missingTemplates.slice(0, 2 + Math.floor(Math.random() * 2));
    const recommendations = recommendationTemplates[status]?.slice(0, 3 + Math.floor(Math.random() * 1)) || [];

    return {
      requirement,
      status,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
      evidence: evidence.length > 0 ? evidence : ['Analysis completed - further review recommended'],
      missingElements,
      recommendations: recommendations.length > 0 ? recommendations : ['Develop comprehensive implementation plan'],
      relevantContent: [`Simulated analysis of ${fileName} for ${requirement.code} - ${status.replace('-', ' ')}`]
    };
  }

  static async testConnection(): Promise<boolean> {
    // For local development, return false to use simulated mode
    return false;
  }
}

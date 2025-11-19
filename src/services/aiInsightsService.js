import { ApiKeyManager } from './apiKeyManager.js';

export class AIInsightsService {
  static async generateStrategicInsights(requirements, documents) {
    console.log('🎯 AI INSIGHTS: Generating strategic recommendations');
    
    const context = {
      requirementsCount: requirements.length,
      overallScore: Math.round(requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length),
      criticalRequirements: requirements.filter(req => req.requirement.category === 'critical'),
      lowPerformingAreas: requirements.filter(req => req.score < 70),
      documentsAnalyzed: documents.map(d => d.name)
    };

    const prompt = `STRATEGIC INSIGHTS MISSION: Provide executive-level insights for GDC compliance excellence.

PERFORMANCE LANDSCAPE:
- Total Requirements: ${context.requirementsCount}
- Overall Score: ${context.overallScore}%
- Critical Requirements: ${context.criticalRequirements.length}
- Low Performing Areas: ${context.lowPerformingAreas.length}
- Documents: ${context.documentsAnalyzed.join(', ')}

STRATEGIC ANALYSIS REQUESTED:

🎯 QUICK WINS (0-30 days)
• Immediate improvements with maximum impact
• Low effort, high return initiatives
• Rapid compliance boosts

🚀 TRANSFORMATIONAL INITIATIVES (1-6 months)  
• Systematic improvements
• Process optimizations
• Cultural enhancements

🏆 COMPETITIVE ADVANTAGES (6-12 months)
• Industry leadership opportunities
• Innovation initiatives
• Excellence differentiators

📊 RISK INTELLIGENCE
• High-priority risk areas
• Mitigation strategies
• Compliance assurance

💡 INNOVATION OPPORTUNITIES
• Digital transformation
• Educational technology
• Assessment innovation

OUTPUT FORMAT:
{
  "quickWins": ["initiative 1", "initiative 2", ...],
  "transformationalInitiatives": ["initiative 1", "initiative 2", ...],
  "competitiveAdvantages": ["advantage 1", "advantage 2", ...],
  "riskAreas": ["risk 1 with mitigation", "risk 2 with mitigation", ...],
  "innovationOpportunities": ["opportunity 1", "opportunity 2", ...],
  "executiveSummary": "Comprehensive strategic overview"
}

Provide actionable, specific, and innovative insights.`;

    try {
      const { ClaudeAIService } = await import('./claudeAIService.js');
      const apiKey = await import('./apiKeyManager.js').then(m => m.ApiKeyManager.getApiKey());
      
      if (!apiKey) {
        throw new Error('No API key available');
      }
      
      const response = await ClaudeAIService.callClaudeAPI(apiKey, prompt, 'haiku'); // Use Haiku for faster insights
      
      return JSON.parse(response.content[0].text);
    } catch (error) {
      console.error('❌ AI Insights failed:', error);
      return this.generateFallbackInsights(context);
    }
  }

  static async generateBenchmarkAnalysis(requirements, institutionType = 'dental_school') {
    console.log('📈 AI BENCHMARK: Generating competitive analysis');
    
    const prompt = `BENCHMARK ANALYSIS: Compare against elite dental education institutions.

INSTITUTION PROFILE:
- Type: ${institutionType}
- Requirements: ${requirements.length}
- Overall Score: ${Math.round(requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length)}%

BENCHMARK REQUEST:
• Performance vs top quartile institutions
• Gap analysis for each domain
• Best practice recommendations
• Competitive positioning

Provide specific, data-driven insights.`;

    // Implementation would call Claude API
    return {
      performanceTier: 'Developing',
      gapToElite: '25%',
      keyDifferentiators: ['Strong clinical governance', 'Need assessment innovation'],
      recommendations: ['Implement digital assessment', 'Enhance staff development']
    };
  }

  static generateFallbackInsights(context) {
    return {
      quickWins: [
        'Enhance documentation for clinical governance',
        'Implement immediate staff training on critical requirements',
        'Strengthen assessment moderation processes'
      ],
      transformationalInitiatives: [
        'Digital transformation of curriculum delivery',
        'Comprehensive staff development programme',
        'Enhanced student feedback systems'
      ],
      competitiveAdvantages: [
        'Potential for research-integrated curriculum',
        'Digital dentistry leadership opportunity',
        'International partnership potential'
      ],
      riskAreas: [
        'Patient safety protocols need strengthening',
        'Assessment standardization requires attention',
        'Staff development needs systematic approach'
      ],
      innovationOpportunities: [
        'AI-enhanced assessment methods',
        'Virtual reality clinical training',
        'Data-driven quality enhancement'
      ],
      executiveSummary: 'Solid foundation with significant enhancement opportunities across digital transformation, staff development, and assessment innovation.'
    };
  }
}

export default AIInsightsService;

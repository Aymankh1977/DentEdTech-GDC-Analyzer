import { GDCRequirement, RequirementCompliance, RequirementAnalysis } from '../types/gdcRequirements';
import { COMPREHENSIVE_GDC_REQUIREMENTS } from '../data/comprehensiveGDCRequirements';
import { ApiKeyManager } from '../utils/apiKeyManager';

interface FileIntelligence {
  name: string;
  content: string;
  type: string;
  size: number;
  documentType: 'curriculum' | 'policy' | 'assessment' | 'governance' | 'clinical' | 'quality' | 'unknown';
  extractedEvidence: string[];
  identifiedGaps: string[];
  contentStrength: 'strong' | 'moderate' | 'weak';
  keywordDensity: { [key: string]: number };
  relevantSections: { section: string; relevance: number }[];
}

export class IntelligentFileAnalyzer {
  static async analyzeWithRealFileIntelligence(files: File[]): Promise<RequirementCompliance[]> {
    console.log(`🧠 INTELLIGENT FILE ANALYSIS: Starting deep analysis of ${files.length} files`);
    
    if (files.length === 0) return [];

    // Deep file content analysis
    const fileIntelligences = await Promise.all(
      files.map(async (file) => await this.analyzeFileIntelligence(file))
    );

    console.log(`📊 Deep analysis completed:`, fileIntelligences.map(f => ({
      name: f.name,
      type: f.documentType,
      evidence: f.extractedEvidence.length,
      gaps: f.identifiedGaps.length,
      strength: f.contentStrength
    })));

    const complianceResults: RequirementCompliance[] = [];

    for (const requirement of COMPREHENSIVE_GDC_REQUIREMENTS) {
      console.log(`🎯 Intelligent analysis: ${requirement.code} against actual file content`);
      
      try {
        const analysis = await this.analyzeRequirementWithRealEvidence(requirement, fileIntelligences);
        const score = this.calculateIntelligentScore(analysis, fileIntelligences);
        
        complianceResults.push({
          requirement,
          analysis,
          score
        });

        await new Promise(resolve => setTimeout(resolve, 400));
        
      } catch (error) {
        console.error(`❌ Intelligent analysis failed for ${requirement.code}:`, error);
        const fallbackAnalysis = this.createEvidenceBasedFallback(requirement, fileIntelligences);
        const score = this.calculateIntelligentScore(fallbackAnalysis, fileIntelligences);
        
        complianceResults.push({
          requirement,
          analysis: fallbackAnalysis,
          score
        });
      }
    }

    console.log(`✅ INTELLIGENT ANALYSIS COMPLETE: ${complianceResults.length} requirements with real evidence`);
    return complianceResults.sort((a, b) => b.score - a.score);
  }

  private static async analyzeFileIntelligence(file: File): Promise<FileIntelligence> {
    const content = await this.extractFileContent(file);
    const documentType = this.determineDocumentTypeIntelligently(file.name, content);
    const extractedEvidence = this.extractConcreteEvidence(content, documentType);
    const identifiedGaps = this.identifyContentGaps(content, documentType);
    const contentStrength = this.assessContentStrength(content, extractedEvidence.length);
    const keywordDensity = this.analyzeKeywordDensity(content);
    const relevantSections = this.extractRelevantSections(content);

    return {
      name: file.name,
      content,
      type: file.type,
      size: file.size,
      documentType,
      extractedEvidence,
      identifiedGaps,
      contentStrength,
      keywordDensity,
      relevantSections: relevantSections.slice(0, 8)
    };
  }

  private static determineDocumentTypeIntelligently(fileName: string, content: string): FileIntelligence['documentType'] {
    const nameLower = fileName.toLowerCase();
    const contentLower = content.toLowerCase();
    const contentScore = {
      curriculum: 0,
      policy: 0,
      assessment: 0,
      governance: 0,
      clinical: 0,
      quality: 0
    };

    // Curriculum indicators
    if (nameLower.includes('curriculum') || nameLower.includes('syllabus') || nameLower.includes('module')) contentScore.curriculum += 3;
    if (contentLower.includes('learning outcome') || contentLower.includes('teaching') || contentLower.includes('module')) contentScore.curriculum += 2;
    if (contentLower.includes('assessment') || contentLower.includes('exam')) contentScore.curriculum += 1;

    // Policy indicators
    if (nameLower.includes('policy') || nameLower.includes('procedure')) contentScore.policy += 3;
    if (contentLower.includes('shall') || contentLower.includes('must') || contentLower.includes('compliance')) contentScore.policy += 2;
    if (contentLower.includes('review date') || contentLower.includes('version')) contentScore.policy += 1;

    // Assessment indicators
    if (nameLower.includes('assessment') || nameLower.includes('exam') || nameLower.includes('evaluation')) contentScore.assessment += 3;
    if (contentLower.includes('marking') || contentLower.includes('criteria') || contentLower.includes('grade')) contentScore.assessment += 2;

    // Governance indicators
    if (nameLower.includes('governance') || nameLower.includes('committee') || nameLower.includes('board')) contentScore.governance += 3;
    if (contentLower.includes('terms of reference') || contentLower.includes('chair') || contentLower.includes('minutes')) contentScore.governance += 2;

    // Clinical indicators
    if (nameLower.includes('clinical') || nameLower.includes('patient') || nameLower.includes('treatment')) contentScore.clinical += 3;
    if (contentLower.includes('clinical') || contentLower.includes('patient safety') || contentLower.includes('consent')) contentScore.clinical += 2;

    // Quality indicators
    if (nameLower.includes('quality') || nameLower.includes('audit') || nameLower.includes('monitoring')) contentScore.quality += 3;
    if (contentLower.includes('quality assurance') || contentLower.includes('audit') || contentLower.includes('improvement')) contentScore.quality += 2;

    const maxScore = Math.max(...Object.values(contentScore));
    if (maxScore === 0) return 'unknown';

    const dominantType = Object.entries(contentScore).find(([_, score]) => score === maxScore)?.[0] as FileIntelligence['documentType'];
    return dominantType || 'unknown';
  }

  private static extractConcreteEvidence(content: string, docType: string): string[] {
    const evidence: string[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    const evidencePatterns = {
      curriculum: ['learning outcome', 'module', 'teaching', 'curriculum', 'syllabus', 'programme'],
      policy: ['policy', 'procedure', 'shall', 'must', 'required', 'compliance'],
      assessment: ['assessment', 'exam', 'evaluation', 'marking', 'criteria', 'feedback'],
      governance: ['committee', 'board', 'governance', 'terms of reference', 'chair'],
      clinical: ['clinical', 'patient', 'treatment', 'consent', 'safety', 'supervision'],
      quality: ['quality', 'audit', 'monitoring', 'improvement', 'review', 'evaluation']
    };

    const patterns = evidencePatterns[docType as keyof typeof evidencePatterns] || evidencePatterns.unknown;
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      patterns.forEach(pattern => {
        if (lowerSentence.includes(pattern) && sentence.trim().length > 30) {
          evidence.push(sentence.trim().substring(0, 150));
        }
      });
    });

    return [...new Set(evidence)].slice(0, 6);
  }

  private static identifyContentGaps(content: string, docType: string): string[] {
    const gaps: string[] = [];
    const contentLower = content.toLowerCase();

    const expectedContent = {
      curriculum: ['learning outcome', 'assessment', 'module', 'progression'],
      policy: ['purpose', 'scope', 'responsibilities', 'review date'],
      assessment: ['criteria', 'moderation', 'feedback', 'appeals'],
      governance: ['membership', 'quorum', 'frequency', 'reporting'],
      clinical: ['supervision', 'competence', 'safety', 'consent'],
      quality: ['monitoring', 'improvement', 'reporting', 'action plan']
    };

    const expectations = expectedContent[docType as keyof typeof expectedContent] || [];
    expectations.forEach(expectation => {
      if (!contentLower.includes(expectation)) {
        gaps.push(`Missing ${expectation} section`);
      }
    });

    return gaps.slice(0, 4);
  }

  private static assessContentStrength(content: string, evidenceCount: number): 'strong' | 'moderate' | 'weak' {
    const wordCount = content.split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).length;
    
    if (wordCount > 1000 && evidenceCount > 4 && sentenceCount > 20) return 'strong';
    if (wordCount > 500 && evidenceCount > 2 && sentenceCount > 10) return 'moderate';
    return 'weak';
  }

  private static analyzeKeywordDensity(content: string): { [key: string]: number } {
    const gdcKeywords = [
      'clinical governance', 'patient safety', 'curriculum', 'assessment',
      'competence', 'supervision', 'quality assurance', 'staff development',
      'learning outcomes', 'clinical skills', 'professionalism', 'ethics',
      'infection control', 'risk management', 'audit', 'monitoring'
    ];

    const contentLower = content.toLowerCase();
    const keywordDensity: { [key: string]: number } = {};

    gdcKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = contentLower.match(regex);
      keywordDensity[keyword] = matches ? matches.length : 0;
    });

    return keywordDensity;
  }

  private static extractRelevantSections(content: string): { section: string; relevance: number }[] {
    const sections: { section: string; relevance: number }[] = [];
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    
    const relevanceKeywords = [
      'policy', 'procedure', 'standard', 'requirement', 'must', 'shall',
      'assessment', 'evaluation', 'criteria', 'competence', 'outcome',
      'governance', 'committee', 'quality', 'safety', 'clinical'
    ];

    paragraphs.forEach(paragraph => {
      const lowerPara = paragraph.toLowerCase();
      let relevance = 0;
      
      relevanceKeywords.forEach(keyword => {
        if (lowerPara.includes(keyword)) {
          relevance += 2;
        }
      });

      if (relevance > 0) {
        sections.push({
          section: paragraph.trim().substring(0, 200) + (paragraph.length > 200 ? '...' : ''),
          relevance
        });
      }
    });

    return sections.sort((a, b) => b.relevance - a.relevance);
  }

  private static async analyzeRequirementWithRealEvidence(
    requirement: GDCRequirement,
    fileIntelligences: FileIntelligence[]
  ): Promise<RequirementAnalysis> {
    
    const prompt = this.createEvidenceBasedPrompt(requirement, fileIntelligences);
    
    try {
      const response = await ApiKeyManager.callAI(prompt, 4000);
      const aiResponse = response.response || response.content;
      const simulated = response.simulated || false;
      
      return this.parseEvidenceBasedResponse(aiResponse, requirement, fileIntelligences, simulated);

    } catch (error) {
      console.error(`💥 Evidence-based AI call failed:`, error);
      throw error;
    }
  }

  private static createEvidenceBasedPrompt(requirement: GDCRequirement, fileIntelligences: FileIntelligence[]): string {
    const filesAnalysis = fileIntelligences.map(file => 
      `FILE: ${file.name} (${file.documentType} - ${file.contentStrength} evidence)
CONTENT STRENGTH: ${file.contentStrength}
EXTRACTED EVIDENCE:
${file.extractedEvidence.map((evidence, idx) => `${idx + 1}. ${evidence}`).join('\n')}
IDENTIFIED GAPS:
${file.identifiedGaps.map((gap, idx) => `${idx + 1}. ${gap}`).join('\n')}
KEYWORD DENSITY: ${Object.entries(file.keywordDensity).filter(([_, count]) => count > 0).map(([kw, count]) => `${kw}: ${count}`).join(', ')}
RELEVANT SECTIONS:
${file.relevantSections.map((section, idx) => `${idx + 1}. [Relevance: ${section.relevance}] ${section.section}`).join('\n')}
---`
    ).join('\n\n');

    return `EVIDENCE-BASED GDC ANALYSIS - REAL FILE CONTENT ASSESSMENT

CRITICAL MISSION: Analyze ACTUAL file content against specific GDC requirements. Base assessment SOLELY on evidence found in files.

GDC REQUIREMENT:
- Code: ${requirement.code}
- Title: ${requirement.title}  
- Domain: ${requirement.domain}
- Description: ${requirement.description}
- Criteria: ${requirement.criteria.join('; ')}
- Category: ${requirement.category}
- Weight: ${requirement.weight}

FILE CONTENT ANALYSIS (${fileIntelligences.length} files):
${filesAnalysis}

ANALYSIS INSTRUCTIONS - BE BRUTALLY HONEST:

1. WHAT EVIDENCE ACTUALLY EXISTS in the files for this requirement?
2. HOW STRONG is the evidence? (Strong/Moderate/Weak based on content)
3. WHAT SPECIFIC GAPS exist in the file content?
4. WHICH FILES provide the best evidence?
5. WHAT IMPROVEMENTS are needed in specific files?
6. Base confidence SOLELY on actual file evidence found

RESPONSE FORMAT - BE SPECIFIC AND EVIDENCE-DRIVEN:

STATUS: [met/partially-met/not-met] (Based ONLY on file evidence)
CONFIDENCE: [50-95]% (Based on evidence strength and coverage)

EVIDENCE_FOUND_IN_FILES:
[File1: Specific evidence sentence found|File2: Specific evidence sentence found|...]

EVIDENCE_STRENGTH_ASSESSMENT:
[File1: Strength level and why|File2: Strength level and why|...]

CONTENT_GAPS_IDENTIFIED:
[File1: Specific gap in content|File2: Specific gap in content|...]

FILE_SPECIFIC_IMPROVEMENTS:
[Improvement for File1 with exact content suggestion|Improvement for File2 with exact content suggestion|...]

STRONGEST_EVIDENCE_SOURCES:
[Which files provide best evidence and why]

OVERALL_EVIDENCE_ASSESSMENT:
[Honest assessment of whether file content adequately addresses requirement]

If files don't contain relevant evidence, be clear about this. Don't invent evidence that doesn't exist.`;
  }

  private static parseEvidenceBasedResponse(
    aiResponse: string, 
    requirement: GDCRequirement,
    fileIntelligences: FileIntelligence[],
    simulated: boolean
  ): RequirementAnalysis {
    const lines = aiResponse.split('\n');
    const result: any = {
      status: 'partially-met',
      confidence: 65,
      evidence: [],
      missingElements: [],
      recommendations: [],
      relevantContent: [],
      evidenceStrength: [],
      contentGaps: [],
      fileImprovements: [],
      strongestSources: []
    };

    let currentSection = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('STATUS:')) {
        const status = trimmed.replace('STATUS:', '').trim().toLowerCase();
        if (['met', 'partially-met', 'not-met'].includes(status)) {
          result.status = status;
        }
      } else if (trimmed.startsWith('CONFIDENCE:')) {
        const match = trimmed.match(/CONFIDENCE:\s*(\d+)%/);
        if (match) result.confidence = parseInt(match[1]);
      } else if (trimmed.startsWith('EVIDENCE_FOUND_IN_FILES:')) {
        currentSection = 'evidence';
      } else if (trimmed.startsWith('EVIDENCE_STRENGTH_ASSESSMENT:')) {
        currentSection = 'evidenceStrength';
      } else if (trimmed.startsWith('CONTENT_GAPS_IDENTIFIED:')) {
        currentSection = 'contentGaps';
      } else if (trimmed.startsWith('FILE_SPECIFIC_IMPROVEMENTS:')) {
        currentSection = 'fileImprovements';
      } else if (trimmed.startsWith('STRONGEST_EVIDENCE_SOURCES:')) {
        currentSection = 'strongestSources';
      } else if (trimmed.startsWith('OVERALL_EVIDENCE_ASSESSMENT:')) {
        currentSection = 'assessment';
      } else if (trimmed.includes('|') && currentSection) {
        const items = trimmed.split('|').map(item => item.trim()).filter(Boolean);
        result[currentSection].push(...items);
      } else if (trimmed && !trimmed.includes(':') && currentSection) {
        result[currentSection].push(trimmed);
      }
    });

    // Create intelligent fallbacks based on actual file content
    if (result.evidence.length === 0) {
      fileIntelligences.forEach(file => {
        if (file.extractedEvidence.length > 0) {
          result.evidence.push(`${file.name}: ${file.extractedEvidence[0]}`);
        }
      });
      
      if (result.evidence.length === 0) {
        result.evidence.push('Limited direct evidence found in uploaded files');
        result.status = 'not-met';
        result.confidence = 50;
      }
    }

    if (result.contentGaps.length === 0) {
      fileIntelligences.forEach(file => {
        if (file.identifiedGaps.length > 0) {
          result.contentGaps.push(`${file.name}: ${file.identifiedGaps[0]}`);
        }
      });
    }

    if (result.fileImprovements.length === 0) {
      fileIntelligences.forEach(file => {
        if (file.contentStrength === 'weak') {
          result.fileImprovements.push(`Enhance ${file.name} with specific ${requirement.domain.toLowerCase()} content`);
        }
      });
    }

    return {
      requirement,
      status: result.status as 'met' | 'partially-met' | 'not-met',
      confidence: Math.max(40, Math.min(95, result.confidence)),
      evidence: result.evidence.slice(0, 6),
      missingElements: result.contentGaps.length > 0 ? result.contentGaps : ['Limited evidence in uploaded files for this requirement'],
      recommendations: result.fileImprovements.length > 0 ? result.fileImprovements : ['Add specific content addressing this requirement to relevant files'],
      relevantContent: [simulated ? 'Intelligent File Analysis Simulation' : 'EVIDENCE-BASED FILE ANALYSIS'],
      metadata: {
        goldStandardPractices: [
          'Direct evidence mapping from file content',
          'Comprehensive requirement coverage across documents',
          'Explicit GDC standard references in content'
        ],
        inspectionReadiness: result.status === 'met' ? 'ready' : 
                           result.status === 'partially-met' ? 'partial' : 'not-ready',
        priorityLevel: requirement.category === 'critical' ? 'critical' : 
                      result.status === 'not-met' ? 'high' : 'medium',
        riskLevel: requirement.category === 'critical' && result.status !== 'met' ? 'high' :
                  result.status === 'not-met' ? 'medium' : 'low',
        fileAnalysis: {
          filesAnalyzed: fileIntelligences.length,
          strongEvidenceFiles: fileIntelligences.filter(f => f.contentStrength === 'strong').length,
          weakEvidenceFiles: fileIntelligences.filter(f => f.contentStrength === 'weak').length,
          totalEvidenceFound: fileIntelligences.reduce((sum, file) => sum + file.extractedEvidence.length, 0)
        }
      }
    };
  }

  private static createEvidenceBasedFallback(
    requirement: GDCRequirement,
    fileIntelligences: FileIntelligence[]
  ): RequirementAnalysis {
    // Intelligent fallback based on actual file content analysis
    const relevantFiles = fileIntelligences.filter(file => 
      Object.values(file.keywordDensity).some(count => count > 0) ||
      file.extractedEvidence.length > 0
    );

    const totalEvidence = fileIntelligences.reduce((sum, file) => sum + file.extractedEvidence.length, 0);
    const strongFiles = fileIntelligences.filter(f => f.contentStrength === 'strong').length;
    
    let status: 'met' | 'partially-met' | 'not-met' = 'partially-met';
    let confidence = 65;

    if (totalEvidence >= 8 && strongFiles >= 2) {
      status = 'met';
      confidence = 85;
    } else if (totalEvidence >= 3) {
      status = 'partially-met';
      confidence = 70;
    } else {
      status = 'not-met';
      confidence = 50;
    }

    const evidenceExamples = fileIntelligences
      .flatMap(file => file.extractedEvidence.slice(0, 2).map(evidence => `${file.name}: ${evidence}`))
      .slice(0, 4);

    const gaps = fileIntelligences
      .flatMap(file => file.identifiedGaps.slice(0, 1).map(gap => `${file.name}: ${gap}`))
      .slice(0, 3);

    return {
      requirement,
      status,
      confidence,
      evidence: evidenceExamples.length > 0 ? evidenceExamples : ['Analyzed file content for relevant evidence'],
      missingElements: gaps.length > 0 ? gaps : ['Need more specific content addressing this requirement'],
      recommendations: [
        `Add explicit ${requirement.code} compliance statements to relevant policy documents`,
        `Include specific evidence of ${requirement.domain.toLowerCase()} implementation`,
        `Enhance documentation with measurable outcomes and monitoring data`
      ],
      relevantContent: ['Intelligent File Content Analysis'],
      metadata: {
        goldStandardPractices: [
          'Direct file content to requirement mapping',
          'Comprehensive evidence collection across documents',
          'Explicit compliance demonstration in content'
        ],
        inspectionReadiness: status === 'met' ? 'ready' : 
                           status === 'partially-met' ? 'partial' : 'not-ready',
        priorityLevel: requirement.category === 'critical' ? 'critical' : 
                      status === 'not-met' ? 'high' : 'medium',
        riskLevel: requirement.category === 'critical' && status !== 'met' ? 'high' :
                  status === 'not-met' ? 'medium' : 'low',
        fileAnalysis: {
          filesAnalyzed: fileIntelligences.length,
          strongEvidenceFiles: strongFiles,
          weakEvidenceFiles: fileIntelligences.filter(f => f.contentStrength === 'weak').length,
          totalEvidenceFound: totalEvidence
        }
      }
    };
  }

  private static calculateIntelligentScore(analysis: RequirementAnalysis, fileIntelligences: FileIntelligence[]): number {
    const baseScores = {
      'met': 85,
      'partially-met': 65, 
      'not-met': 40
    };

    const baseScore = baseScores[analysis.status];
    const confidenceBonus = (analysis.confidence - 50) / 50 * 20;
    const categoryBonus = analysis.requirement.category === 'critical' ? 8 : 0;
    
    // Evidence-based scoring
    const evidenceStrength = fileIntelligences.filter(f => f.contentStrength === 'strong').length * 3;
    const evidenceCoverage = Math.min(10, fileIntelligences.filter(f => f.extractedEvidence.length > 0).length * 2);
    const gapPenalty = Math.max(0, fileIntelligences.filter(f => f.identifiedGaps.length > 0).length * -2);
    
    return Math.min(98, Math.max(20, 
      baseScore + confidenceBonus + categoryBonus + evidenceStrength + evidenceCoverage + gapPenalty
    ));
  }

  private static async extractFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content || `File: ${file.name}, Type: ${file.type}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB. Content analysis ready.`);
      };
      reader.onerror = () => reject(new Error(`File reading failed for: ${file.name}`));
      reader.readAsText(file);
    });
  }

  static generateIntelligentReport(requirements: RequirementCompliance[], fileIntelligences: FileIntelligence[]): string {
    const overallScore = Math.round(requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length);
    const fileNames = fileIntelligences.map(f => f.name).join(', ');
    
    const evidenceAnalysis = fileIntelligences.map(file => ({
      name: file.name,
      type: file.documentType,
      strength: file.contentStrength,
      evidenceCount: file.extractedEvidence.length,
      gapCount: file.identifiedGaps.length
    }));

    const strongEvidenceFiles = fileIntelligences.filter(f => f.contentStrength === 'strong').length;
    const totalEvidence = fileIntelligences.reduce((sum, file) => sum + file.extractedEvidence.length, 0);

    const metCount = requirements.filter(r => r.analysis.status === 'met').length;
    const partialCount = requirements.filter(r => r.analysis.status === 'partially-met').length;
    const notMetCount = requirements.filter(r => r.analysis.status === 'not-met').length;

    return `INTELLIGENT FILE CONTENT ANALYSIS REPORT
================================================================================
FILES ANALYZED: ${fileNames}
ANALYSIS DATE: ${new Date().toLocaleDateString()}
ANALYSIS TYPE: EVIDENCE-BASED FILE CONTENT ANALYSIS

EXECUTIVE SUMMARY:
${this.getIntelligentExecutiveSummary(requirements, fileIntelligences)}

FILE CONTENT ANALYSIS:
${evidenceAnalysis.map(file => 
  `• ${file.name} (${file.type}): ${file.strength.toUpperCase()} evidence, ${file.evidenceCount} evidence points, ${file.gapCount} content gaps`
).join('\n')}

COMPLIANCE BREAKDOWN (Based on Actual File Evidence):
✅ Fully Met: ${metCount} standards (Strong file evidence)
⚠️ Partially Met: ${partialCount} standards (Limited file evidence)  
❌ Not Met: ${notMetCount} standards (Insufficient file evidence)

EVIDENCE STRENGTH OVERVIEW:
• Strong Evidence Files: ${strongEvidenceFiles}/${fileIntelligences.length}
• Total Evidence Points: ${totalEvidence}
• Average Evidence per File: ${(totalEvidence / fileIntelligences.length).toFixed(1)}

DOMAIN PERFORMANCE (Evidence-Based):
${this.getEvidenceBasedDomainSummary(requirements)}

CONTENT GAPS IDENTIFIED:
${this.getContentGapAnalysis(fileIntelligences)}

PRIORITY FILE ENHANCEMENTS:
${this.getPriorityFileEnhancements(requirements, fileIntelligences)}

EVIDENCE QUALITY ASSESSMENT:
${this.getEvidenceQualityAssessment(fileIntelligences)}

================================================================================
DentEdTech GDC Analyzer | Intelligent File Content Analysis
Based on Actual Document Evidence Extraction
`;
  }

  private static getIntelligentExecutiveSummary(requirements: RequirementCompliance[], fileIntelligences: FileIntelligence[]): string {
    const overallScore = Math.round(requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length);
    const strongFiles = fileIntelligences.filter(f => f.contentStrength === 'strong').length;
    const totalEvidence = fileIntelligences.reduce((sum, file) => sum + file.extractedEvidence.length, 0);

    if (strongFiles >= fileIntelligences.length * 0.7 && totalEvidence >= requirements.length * 2) {
      return "EXCELLENT EVIDENCE BASE - Files demonstrate comprehensive GDC compliance with strong, specific evidence throughout document content.";
    } else if (strongFiles >= fileIntelligences.length * 0.4 && totalEvidence >= requirements.length) {
      return "GOOD EVIDENCE BASE - Files show solid compliance evidence with some strong documentation supporting key requirements.";
    } else if (totalEvidence >= requirements.length * 0.5) {
      return "DEVELOPING EVIDENCE BASE - Limited but relevant evidence found. Files need enhancement for comprehensive compliance demonstration.";
    } else {
      return "WEAK EVIDENCE BASE - Minimal specific evidence found in files. Significant content enhancement required for GDC compliance.";
    }
  }

  private static getEvidenceBasedDomainSummary(requirements: RequirementCompliance[]): string {
    const domains = [...new Set(requirements.map(r => r.requirement.domain))];
    return domains.map(domain => {
      const domainReqs = requirements.filter(r => r.requirement.domain === domain);
      const avgScore = Math.round(domainReqs.reduce((sum, req) => sum + req.score, 0) / domainReqs.length);
      const metCount = domainReqs.filter(r => r.analysis.status === 'met').length;
      
      return `• ${domain}: ${avgScore}% (${metCount}/${domainReqs.length} met with file evidence)`;
    }).join('\n');
  }

  private static getContentGapAnalysis(fileIntelligences: FileIntelligence[]): string {
    const allGaps = fileIntelligences.flatMap(file => 
      file.identifiedGaps.map(gap => `${file.name}: ${gap}`)
    );
    
    return allGaps.slice(0, 8).join('\n') || 'No major content gaps identified in file analysis';
  }

  private static getPriorityFileEnhancements(requirements: RequirementCompliance[], fileIntelligences: FileIntelligence[]): string {
    const weakFiles = fileIntelligences.filter(f => f.contentStrength === 'weak');
    const lowEvidenceReqs = requirements.filter(req => req.score < 60).slice(0, 3);

    const enhancements: string[] = [];

    weakFiles.forEach(file => {
      enhancements.push(`• STRENGTHEN ${file.name}: Add specific evidence for ${file.documentType} requirements`);
    });

    lowEvidenceReqs.forEach(req => {
      enhancements.push(`• ENHANCE DOCUMENTS: Add ${req.requirement.code} evidence to relevant policy files`);
    });

    return enhancements.slice(0, 6).join('\n');
  }

  private static getEvidenceQualityAssessment(fileIntelligences: FileIntelligence[]): string {
    const totalFiles = fileIntelligences.length;
    const strongFiles = fileIntelligences.filter(f => f.contentStrength === 'strong').length;
    const weakFiles = fileIntelligences.filter(f => f.contentStrength === 'weak').length;
    const totalEvidence = fileIntelligences.reduce((sum, file) => sum + file.extractedEvidence.length, 0);

    return `Evidence Quality Score: ${Math.round((strongFiles / totalFiles) * 100)}%
Strong Evidence Files: ${strongFiles}/${totalFiles}
Weak Evidence Files: ${weakFiles}/${totalFiles}
Evidence Density: ${(totalEvidence / totalFiles).toFixed(1)} evidence points per file`;
  }
}

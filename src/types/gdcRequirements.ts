export interface GDCRequirement {
  id: string;
  domain: string;
  code: string;
  title: string;
  description: string;
  criteria: string[];
  weight: number;
  category: 'critical' | 'important' | 'standard';
  inspectionFocus?: string[];
}

export interface RequirementAnalysis {
  requirement: GDCRequirement;
  status: 'met' | 'partially-met' | 'not-met' | 'not-found';
  confidence: number;
  evidence: string[];
  missingElements: string[];
  recommendations: string[];
  relevantContent: string[];
  metadata?: {
    goldStandardPractices?: string[];
    inspectionReadiness?: 'ready' | 'partial' | 'not-ready';
    priorityLevel?: 'critical' | 'high' | 'medium' | 'low';
    riskLevel?: 'high' | 'medium' | 'low';
  };
}

export interface RequirementCompliance {
  requirement: GDCRequirement;
  analysis: RequirementAnalysis;
  score: number;
}

export interface ComprehensiveReport {
  overallScore: number;
  requirements: RequirementCompliance[];
  institution: string;
  programmeName: string;
  analysisDate: string;
  inspectionReadiness: 'ready' | 'partial' | 'not-ready';
  criticalActions: string[];
  priorityAreas: string[];
  goldStandardRecommendations: string[];
}

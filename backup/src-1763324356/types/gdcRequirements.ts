export interface GDCRequirement {
  id: string;
  domain: string;
  code: string;
  title: string;
  description: string;
  criteria: string[];
  weight: number;
  category: 'critical' | 'important' | 'standard';
}

export interface RequirementAnalysis {
  requirement: GDCRequirement;
  status: 'met' | 'partially-met' | 'not-met' | 'not-found';
  confidence: number;
  evidence: string[];
  missingElements: string[];
  recommendations: string[];
  relevantContent: string[];
}

export interface RequirementCompliance {
  requirement: GDCRequirement;
  analysis: RequirementAnalysis;
  score: number;
}

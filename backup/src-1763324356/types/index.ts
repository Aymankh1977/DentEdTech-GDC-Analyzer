export interface AnalysisResult {
  bestPractices: string;
  areasForImprovement: string;
  complianceScore: number;
  keyFindings: string[];
  riskAssessment: string;
}

export interface SpecificGuidelineResult {
  programName: string;
  executiveSummary: string;
  strengths: string;
  areasForImprovement: string;
  recommendations: string;
  complianceScore: number;
  priorityActions: string[];
  timeline: string;
  resourcesNeeded: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

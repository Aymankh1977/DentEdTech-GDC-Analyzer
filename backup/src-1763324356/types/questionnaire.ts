export interface QuestionnaireAnswer {
  question: string;
  answer: string;
  evidence: string;
  complianceLevel: 'fully-compliant' | 'partially-compliant' | 'non-compliant' | 'not-applicable';
  recommendations: string[];
  references: string[];
}

export interface FilledQuestionnaire {
  id: string;
  programName: string;
  institution: string;
  questionnaireType: 'pre-inspection' | 'annual-review' | 'self-assessment';
  filledDate: string;
  answers: QuestionnaireAnswer[];
  overallCompliance: number;
  summary: string;
  generatedFromAnalysis: boolean;
}

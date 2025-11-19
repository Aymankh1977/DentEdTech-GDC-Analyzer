import React from 'react';
import { AnalysisResult, SpecificGuidelineResult } from '../types';
import { ProcessedFile } from '../services/fileProcessingService';

interface AnalysisResultCardProps {
  analysis: AnalysisResult;
  guidelines: SpecificGuidelineResult;
  onReset: () => void;
  documentCount: number;
  selectedFile: ProcessedFile;
  otherFiles: ProcessedFile[];
  onQuestionnaireGenerated: (questionnaire: any) => void;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({
  analysis,
  guidelines,
  onReset,
  documentCount,
  onQuestionnaireGenerated
}) => {
  const handleGenerateQuestionnaire = () => {
    const mockQuestionnaire = {
      id: 'mock-1',
      programName: guidelines.programName,
      institution: 'Demo University',
      questionnaireType: 'pre-inspection' as const,
      filledDate: new Date().toISOString().split('T')[0],
      answers: [
        {
          question: "Provider name",
          answer: guidelines.programName,
          evidence: "Extracted from document analysis",
          complianceLevel: "fully-compliant" as const,
          recommendations: [],
          references: ["Programme Documentation"]
        }
      ],
      overallCompliance: guidelines.complianceScore,
      summary: "Demo questionnaire generated for testing",
      generatedFromAnalysis: true
    };
    
    onQuestionnaireGenerated(mockQuestionnaire);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GDC Requirement Analysis
          </h1>
          <p className="text-xl text-gray-600">
            Analysis for {guidelines.programName}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Best Practices</h3>
              <p className="text-green-700">{analysis.bestPractices}</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">Areas for Improvement</h3>
              <p className="text-yellow-700">{analysis.areasForImprovement}</p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Compliance Score</h3>
            <div className="text-4xl font-bold text-blue-600 text-center">
              {guidelines.complianceScore}%
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <button
              onClick={handleGenerateQuestionnaire}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
            >
              Generate GDC Questionnaire
            </button>
            
            <button
              onClick={onReset}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 ml-4"
            >
              Analyze New Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultCard;

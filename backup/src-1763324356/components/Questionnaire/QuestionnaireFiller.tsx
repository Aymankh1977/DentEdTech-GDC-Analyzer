import React from 'react';
import { AnalysisResult, SpecificGuidelineResult } from '../../types';
import { FilledQuestionnaire } from '../../types/questionnaire';
import { QuestionnaireAnalyzerService } from '../../services/questionnaireAnalyzerService';
import { ProcessedFile } from '../../services/fileProcessingService';

interface QuestionnaireFillerProps {
  analysis: AnalysisResult;
  guidelines: SpecificGuidelineResult;
  programName: string;
  selectedFile: ProcessedFile;
  otherFiles: ProcessedFile[];
  institution: string;
  onQuestionnaireGenerated: (questionnaire: FilledQuestionnaire) => void;
}

export const QuestionnaireFiller: React.FC<QuestionnaireFillerProps> = ({
  analysis,
  guidelines,
  programName,
  selectedFile,
  otherFiles,
  institution,
  onQuestionnaireGenerated
}) => {
  const generateQuestionnaire = () => {
    console.log('📋 Generating GDC questionnaire...');
    
    const answers = QuestionnaireAnalyzerService.generateQuestionnaireAnswers(
      selectedFile,
      otherFiles,
      guidelines
    );

    const compliantCount = answers.filter(a => a.complianceLevel === 'fully-compliant').length;
    const overallCompliance = Math.round((compliantCount / answers.length) * 100);

    const questionnaire: FilledQuestionnaire = {
      id: `gdc-${Date.now()}`,
      programName,
      institution,
      questionnaireType: 'pre-inspection',
      filledDate: new Date().toISOString().split('T')[0],
      answers,
      overallCompliance,
      summary: QuestionnaireAnalyzerService.generateQuestionnaireSummary(answers, programName),
      generatedFromAnalysis: true
    };

    console.log('✅ Questionnaire generated with', answers.length, 'answers');
    onQuestionnaireGenerated(questionnaire);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          GDC Pre-Inspection Questionnaire
        </h2>
        <p className="text-lg text-gray-600">
          Automatically generate evidence-based responses for GDC requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Analysis Ready
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Requirement analysis completed
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Evidence collected from documents
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Compliance scoring calculated
            </li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Questionnaire Features
          </h3>
          <ul className="space-y-2 text-green-800">
            <li>• Evidence-based responses</li>
            <li>• GDC requirement mapping</li>
            <li>• Compliance level indicators</li>
            <li>• Professional formatting</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={generateQuestionnaire}
          className="button-primary-premium text-lg px-12 py-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Generate GDC Questionnaire
        </button>
        
        <p className="text-sm text-gray-600 mt-4">
          Automatically populate the GDC pre-inspection questionnaire with evidence from your documents
        </p>
      </div>
    </div>
  );
};

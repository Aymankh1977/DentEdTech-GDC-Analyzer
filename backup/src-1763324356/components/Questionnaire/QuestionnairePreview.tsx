import React from 'react';
import { FilledQuestionnaire } from '../../types/questionnaire';

interface QuestionnairePreviewProps {
  questionnaire: FilledQuestionnaire;
  onClose: () => void;
}

export const QuestionnairePreview: React.FC<QuestionnairePreviewProps> = ({
  questionnaire,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">GDC Pre-Inspection Questionnaire</h2>
              <p className="text-blue-100">{questionnaire.programName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {questionnaire.summary}
            </pre>
          </div>

          <div className="space-y-4">
            {questionnaire.answers.map((answer, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {answer.question}
                </h4>
                <p className="text-gray-600 mb-3">{answer.answer}</p>
                <p className="text-sm text-gray-500">Evidence: {answer.evidence}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              DentEdTech GDC Compliance Analyzer
            </div>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { RequirementCompliance } from '../../types/gdcRequirements';

interface RequirementAnalysisDetailProps {
  compliance: RequirementCompliance;
  onBack: () => void;
}

export const RequirementAnalysisDetail: React.FC<RequirementAnalysisDetailProps> = ({
  compliance,
  onBack
}) => {
  const { requirement, analysis, score } = compliance;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-6 rounded-t-xl">
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-blue-100 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Requirements
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <span className="text-sm font-semibold opacity-90">{requirement.domain}</span>
            <h1 className="text-2xl font-bold mt-1">{requirement.code}: {requirement.title}</h1>
            <p className="text-blue-100 mt-2 opacity-90">{requirement.description}</p>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold">{score}%</div>
            <div className="text-blue-100 opacity-90">Compliance Score</div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="px-6 pt-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          analysis.status === 'met' ? 'bg-green-100 text-green-800' :
          analysis.status === 'partially-met' ? 'bg-yellow-100 text-yellow-800' :
          analysis.status === 'not-met' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {analysis.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Evidence Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Evidence Found ({analysis.evidence.length})
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            {analysis.evidence.length > 0 ? (
              <ul className="space-y-2">
                {analysis.evidence.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 italic">No direct evidence found for this requirement.</p>
            )}
          </div>
        </section>

        {/* Missing Elements */}
        {analysis.missingElements.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Missing Elements ({analysis.missingElements.length})
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="space-y-2">
                {analysis.missingElements.map((element, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-4 h-4 text-red-600 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-700">{element}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Recommendations */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Recommendations ({analysis.recommendations.length})
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Assessment Criteria */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Assessment Criteria</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <ul className="space-y-2">
              {requirement.criteria.map((criterion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-xs bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700">{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

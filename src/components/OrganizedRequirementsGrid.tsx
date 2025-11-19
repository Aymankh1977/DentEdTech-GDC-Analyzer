import React from 'react';
import { RequirementCompliance } from '../types/gdcRequirements';

interface OrganizedRequirementsGridProps {
  requirements: RequirementCompliance[];
  onRequirementSelect: (requirement: RequirementCompliance) => void;
}

export const OrganizedRequirementsGrid: React.FC<OrganizedRequirementsGridProps> = ({
  requirements,
  onRequirementSelect
}) => {
  const domains = [
    'Patient Safety',
    'Curriculum', 
    'Assessment',
    'Staffing',
    'Resources',
    'Quality Assurance'
  ];

  const getDomainColor = (domain: string) => {
    const colors: { [key: string]: string } = {
      'Patient Safety': 'from-red-500 to-red-600',
      'Curriculum': 'from-blue-500 to-blue-600',
      'Assessment': 'from-green-500 to-green-600',
      'Staffing': 'from-purple-500 to-purple-600',
      'Resources': 'from-orange-500 to-orange-600',
      'Quality Assurance': 'from-indigo-500 to-indigo-600'
    };
    return colors[domain] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met': return 'bg-green-100 text-green-800 border-green-200';
      case 'partially-met': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not-met': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDomainScore = (domainRequirements: RequirementCompliance[]) => {
    if (domainRequirements.length === 0) return 0;
    return Math.round(
      domainRequirements.reduce((sum, req) => sum + req.score, 0) / domainRequirements.length
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'met':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'partially-met':
        return (
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
            </svg>
          </div>
        );
      case 'not-met':
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {domains.map(domain => {
        const domainRequirements = requirements.filter(req => req.requirement.domain === domain);
        const domainScore = getDomainScore(domainRequirements);
        const metCount = domainRequirements.filter(r => r.analysis.status === 'met').length;
        const partialCount = domainRequirements.filter(r => r.analysis.status === 'partially-met').length;
        const notMetCount = domainRequirements.filter(r => r.analysis.status === 'not-met').length;
        
        return (
          <div key={domain} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Domain Header */}
            <div className={`p-6 bg-gradient-to-r ${getDomainColor(domain)} text-white`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{domain}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-white/90">
                    <span>{domainRequirements.length} requirements</span>
                    <span>•</span>
                    <span>{metCount} fully met</span>
                    <span>•</span>
                    <span>{partialCount} partially met</span>
                    <span>•</span>
                    <span>{notMetCount} not met</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-3xl font-bold">{domainScore}%</div>
                  <div className="text-white/90 text-sm">Domain Score</div>
                </div>
              </div>
              
              {/* Progress bar for domain */}
              <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                <div
                  className={`h-2 rounded-full ${
                    domainScore >= 80 ? 'bg-green-400' :
                    domainScore >= 60 ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}
                  style={{ width: `${domainScore}%` }}
                ></div>
              </div>
            </div>

            {/* Requirements Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domainRequirements.map((compliance) => (
                  <div
                    key={compliance.requirement.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200 group"
                    onClick={() => onRequirementSelect(compliance)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {compliance.requirement.code}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {compliance.requirement.title}
                        </p>
                      </div>
                      <div className="ml-2">
                        {getStatusIcon(compliance.analysis.status)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(compliance.analysis.status)}`}>
                        {compliance.analysis.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {compliance.score}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          compliance.score >= 80 ? 'bg-green-500' :
                          compliance.score >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${compliance.score}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>Confidence: {compliance.analysis.confidence}%</span>
                      <span>Click for details</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {domainRequirements.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="mt-2">No requirements found for this domain</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

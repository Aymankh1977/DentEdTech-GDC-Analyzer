import React from 'react';
import { RequirementCompliance } from '../../types/gdcRequirements';

interface GDCRequirementsGridProps {
  requirements: RequirementCompliance[];
  onRequirementSelect: (requirement: RequirementCompliance) => void;
}

export const GDCRequirementsGrid: React.FC<GDCRequirementsGridProps> = ({
  requirements,
  onRequirementSelect
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'met':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'partially-met':
        return (
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
            </svg>
          </div>
        );
      case 'not-met':
        return (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met': return 'bg-green-100 text-green-800 border-green-200';
      case 'partially-met': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not-met': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDomainColor = (domain: string) => {
    const domains: Record<string, string> = {
      'Curriculum': 'from-blue-500 to-blue-600',
      'Assessment': 'from-green-500 to-green-600',
      'Patient Safety': 'from-red-500 to-red-600',
      'Faculty': 'from-purple-500 to-purple-600'
    };
    return domains[domain] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requirements.map((compliance) => (
          <div
            key={compliance.requirement.id}
            className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
            onClick={() => onRequirementSelect(compliance)}
          >
            <div className={`p-4 bg-gradient-to-r ${getDomainColor(compliance.requirement.domain)} text-white rounded-t-xl`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-semibold opacity-90">{compliance.requirement.domain}</span>
                  <h3 className="font-bold text-lg mt-1">{compliance.requirement.code}</h3>
                </div>
                {getStatusIcon(compliance.analysis.status)}
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {compliance.requirement.title}
              </h4>
              
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(compliance.analysis.status)}`}>
                  {compliance.analysis.status.replace('-', ' ').toUpperCase()}
                </span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{compliance.score}%</div>
                  <div className="text-xs text-gray-500">Compliance</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full ${
                    compliance.score >= 80 ? 'bg-green-500' :
                    compliance.score >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${compliance.score}%` }}
                ></div>
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Evidence Found:</span>
                  <span className="font-medium">{compliance.analysis.evidence.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-medium">{compliance.analysis.confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

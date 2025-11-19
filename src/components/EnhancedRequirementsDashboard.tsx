import React from 'react';
import { RequirementCompliance } from '../types/gdcRequirements';

interface EnhancedRequirementsDashboardProps {
  requirements: RequirementCompliance[];
  onRequirementSelect: (requirement: RequirementCompliance) => void;
}

export const EnhancedRequirementsDashboard: React.FC<EnhancedRequirementsDashboardProps> = ({
  requirements,
  onRequirementSelect
}) => {
  const overallScore = Math.round(requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length);
  const criticalReqs = requirements.filter(req => req.requirement.category === 'critical');
  const metCritical = criticalReqs.filter(req => req.analysis.status === 'met').length;

  const domainStats = requirements.reduce((acc, req) => {
    const domain = req.requirement.domain;
    if (!acc[domain]) {
      acc[domain] = { total: 0, sum: 0, met: 0, critical: 0 };
    }
    acc[domain].total++;
    acc[domain].sum += req.score;
    if (req.analysis.status === 'met') acc[domain].met++;
    if (req.requirement.category === 'critical') acc[domain].critical++;
    return acc;
  }, {} as any);

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold">{overallScore}%</div>
            <div className="text-blue-200">Overall Score</div>
          </div>
          <div>
            <div className="text-4xl font-bold">{metCritical}/{criticalReqs.length}</div>
            <div className="text-blue-200">Critical Met</div>
          </div>
          <div>
            <div className="text-4xl font-bold">{requirements.length}</div>
            <div className="text-blue-200">Total Requirements</div>
          </div>
          <div>
            <div className="text-4xl font-bold">
              {overallScore >= 80 ? '🏆' : overallScore >= 60 ? '📈' : '🔄'}
            </div>
            <div className="text-blue-200">Performance Tier</div>
          </div>
        </div>
      </div>

      {/* Domain Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(domainStats).map(([domain, stats]: [string, any]) => {
          const domainScore = Math.round(stats.sum / stats.total);
          return (
            <div key={domain} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-gray-900 text-lg mb-2">{domain}</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-gray-900">{domainScore}%</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  domainScore >= 80 ? 'bg-green-100 text-green-800' :
                  domainScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {domainScore >= 80 ? 'Excellent' : domainScore >= 60 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Requirements:</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fully Met:</span>
                  <span className="font-medium">{stats.met}</span>
                </div>
                <div className="flex justify-between">
                  <span>Critical:</span>
                  <span className="font-medium">{stats.critical}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Heat Map */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Heat Map</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {requirements.map((req) => (
            <div
              key={req.requirement.id}
              className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                req.score >= 80 ? 'bg-green-100 border-green-300' :
                req.score >= 60 ? 'bg-yellow-100 border-yellow-300' :
                'bg-red-100 border-red-300'
              } border-2`}
              onClick={() => onRequirementSelect(req)}
              title={`${req.requirement.code}: ${req.score}%`}
            >
              <div className="text-center">
                <div className={`text-sm font-bold ${
                  req.score >= 80 ? 'text-green-800' :
                  req.score >= 60 ? 'text-yellow-800' :
                  'text-red-800'
                }`}>
                  {req.requirement.code}
                </div>
                <div className="text-xs text-gray-600 mt-1">{req.score}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

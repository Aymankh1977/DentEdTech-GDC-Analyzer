import { GDCRequirement, RequirementAnalysis, RequirementCompliance } from '../types/gdcRequirements';
import { EnhancedClaudeService } from './enhancedClaudeService';

// Enhanced GDC Standards Database
export const GDC_REQUIREMENTS: GDCRequirement[] = [
  // STANDARD 1: PATIENT SAFETY
  {
    id: '1.1',
    domain: 'Patient Safety',
    code: 'S1.1',
    title: 'Clinical Governance Systems',
    description: 'Robust clinical governance framework ensuring patient safety throughout student clinical practice',
    criteria: [
      'Clinical incident reporting systems established',
      'Risk management protocols implemented',
      'Clinical audit processes documented',
      'Quality improvement mechanisms in place',
      'Patient feedback systems operational'
    ],
    weight: 15,
    category: 'critical'
  },
  {
    id: '1.2',
    domain: 'Patient Safety',
    code: 'S1.2',
    title: 'Student Clinical Competence',
    description: 'Students only provide patient care when competent under appropriate supervision',
    criteria: [
      'Competency assessment framework established',
      'Supervision levels clearly defined',
      'Progressive clinical responsibility documented',
      'Competency verification before independent practice',
      'Remediation processes for underperformance'
    ],
    weight: 15,
    category: 'critical'
  },
  {
    id: '1.3',
    domain: 'Patient Safety',
    code: 'S1.3',
    title: 'Infection Prevention Control',
    description: 'Comprehensive infection prevention and control protocols',
    criteria: [
      'IPC policies and procedures documented',
      'Staff and student training in IPC',
      'Audit and monitoring systems',
      'Equipment decontamination protocols',
      'Compliance with national IPC standards'
    ],
    weight: 10,
    category: 'critical'
  },

  // STANDARD 2: CURRICULUM
  {
    id: '2.1',
    domain: 'Curriculum',
    code: 'S2.1',
    title: 'Learning Outcomes Alignment',
    description: 'Curriculum designed to enable students to achieve all learning outcomes',
    criteria: [
      'Learning outcomes clearly defined and mapped',
      'Curriculum content covers all required domains',
      'Integration of biomedical, clinical and professional domains',
      'Progressive complexity throughout programme',
      'Regular curriculum review and update'
    ],
    weight: 12,
    category: 'critical'
  },
  {
    id: '2.2',
    domain: 'Curriculum',
    code: 'S2.2',
    title: 'Clinical Experience Structure',
    description: 'Structured clinical experience with appropriate patient mix',
    criteria: [
      'Clinical exposure progression defined',
      'Adequate patient numbers and variety',
      'Supervised clinical practice arrangements',
      'Clinical portfolio requirements',
      'Patient consent procedures'
    ],
    weight: 12,
    category: 'critical'
  },
  {
    id: '2.3',
    domain: 'Curriculum',
    code: 'S2.3',
    title: 'Professional Development',
    description: 'Development of professional values, behaviours and leadership skills',
    criteria: [
      'Professionalism teaching integrated',
      'Ethical decision-making training',
      'Communication skills development',
      'Teamworking and leadership opportunities',
      'Reflective practice requirements'
    ],
    weight: 8,
    category: 'important'
  },

  // STANDARD 3: ASSESSMENT
  {
    id: '3.1',
    domain: 'Assessment',
    code: 'S3.1',
    title: 'Assessment Strategy',
    description: 'Comprehensive assessment of knowledge, skills and professional behaviours',
    criteria: [
      'Multiple assessment methods used',
      'Clear assessment blueprint',
      'Formative and summative assessments',
      'Clinical competency assessments',
      'Standard setting and moderation'
    ],
    weight: 10,
    category: 'critical'
  },
  {
    id: '3.2',
    domain: 'Assessment',
    code: 'S3.2',
    title: 'Progression Decisions',
    description: 'Robust and transparent progression and assessment decisions',
    criteria: [
      'Clear progression criteria',
      'Examination regulations documented',
      'Appeals procedures established',
      'External examiner input',
      'Assessment board governance'
    ],
    weight: 8,
    category: 'important'
  },

  // STANDARD 4: STAFFING
  {
    id: '4.1',
    domain: 'Staffing',
    code: 'S4.1',
    title: 'Staff Qualifications and Development',
    description: 'Adequately qualified and experienced staff with ongoing development',
    criteria: [
      'Staff qualifications documented',
      'Appropriate staff-student ratios',
      'CPD requirements met',
      'Teaching training provided',
      'Clinical competence maintained'
    ],
    weight: 8,
    category: 'important'
  },

  // STANDARD 5: RESOURCES
  {
    id: '5.1',
    domain: 'Resources',
    code: 'S5.1',
    title: 'Educational Facilities',
    description: 'Adequate facilities, equipment and learning resources',
    criteria: [
      'Clinical facilities adequate',
      'Simulation equipment available',
      'Library resources sufficient',
      'IT infrastructure supportive',
      'Learning spaces appropriate'
    ],
    weight: 7,
    category: 'important'
  },

  // STANDARD 6: QUALITY ASSURANCE
  {
    id: '6.1',
    domain: 'Quality Assurance',
    code: 'S6.1',
    title: 'Quality Management',
    description: 'Effective quality assurance and enhancement processes',
    criteria: [
      'Annual monitoring processes',
      'Student feedback mechanisms',
      'External scrutiny systems',
      'Action planning and implementation',
      'Continuous improvement culture'
    ],
    weight: 5,
    category: 'standard'
  }
];

export const analyzeRequirements = async (files: File[]): Promise<RequirementCompliance[]> => {
  console.log(`🎯 Starting enhanced AI analysis for ${files.length} files`);
  
  if (files.length === 0) {
    return [];
  }

  // Use enhanced Claude service for comprehensive analysis
  const mainFile = files[0];
  return await EnhancedClaudeService.analyzeWithClaude(mainFile, GDC_REQUIREMENTS);
};

export const generateComprehensiveReport = (requirements: RequirementCompliance[], fileName: string): string => {
  const overallScore = Math.round(
    requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length
  );

  const metCount = requirements.filter(r => r.analysis.status === 'met').length;
  const partiallyMetCount = requirements.filter(r => r.analysis.status === 'partially-met').length;
  const notMetCount = requirements.filter(r => r.analysis.status === 'not-met').length;
  const criticalRequirements = requirements.filter(r => r.requirement.category === 'critical');
  const metCritical = criticalRequirements.filter(r => r.analysis.status === 'met').length;

  return `DENTEDTECH COMPREHENSIVE GDC COMPLIANCE ANALYSIS REPORT
================================================================================
GENERATED: ${new Date().toLocaleDateString()} 
DOCUMENT: ${fileName}
AI ENGINE: Claude 3 Haiku (Enhanced Analysis)
OVERALL COMPLIANCE SCORE: ${overallScore}%

EXECUTIVE SUMMARY:
This comprehensive analysis evaluated ${fileName} against ${requirements.length} GDC standards 
using advanced AI document analysis. The programme demonstrates ${overallScore}% overall 
compliance with ${metCount} requirements fully met, ${partiallyMetCount} partially met, 
and ${notMetCount} requiring significant development.

COMPLIANCE BREAKDOWN:
• Fully Compliant: ${metCount} of ${requirements.length} requirements (${Math.round(metCount/requirements.length*100)}%)
• Partially Compliant: ${partiallyMetCount} requirements
• Not Compliant: ${notMetCount} requirements  
• Critical Requirements: ${metCritical} of ${criticalRequirements.length} fully met

DETAILED REQUIREMENT ANALYSIS:
${requirements.map(req => `
${req.requirement.code} - ${req.requirement.title}
├─ Status: ${req.analysis.status.toUpperCase()}
├─ Score: ${req.score}% (Confidence: ${req.analysis.confidence}%)
├─ Evidence: ${req.analysis.evidence.slice(0, 2).join('; ')}
├─ Missing: ${req.analysis.missingElements.slice(0, 2).join('; ')}
└─ Recommendations: ${req.analysis.recommendations.slice(0, 2).join('; ')}
`).join('\n')}

PRIORITY IMPROVEMENT AREAS:
${requirements
  .filter(req => req.score < 70)
  .sort((a, b) => a.score - b.score)
  .slice(0, 5)
  .map(req => `• ${req.requirement.code} (${req.score}%): ${req.analysis.recommendations[0]}`)
  .join('\n')}

STRATEGIC RECOMMENDATIONS:

IMMEDIATE ACTIONS (0-30 days):
1. Address critical requirements scoring below 60%
2. Develop evidence documentation framework
3. Establish systematic monitoring processes

SHORT-TERM GOALS (1-3 months):
1. Implement comprehensive assessment enhancements
2. Strengthen clinical governance documentation
3. Enhance staff development programmes

MEDIUM-TERM STRATEGY (3-6 months):
1. Complete curriculum review and alignment
2. Implement technology-enhanced compliance tracking
3. Establish external quality verification

BEST PRACTICES IDENTIFIED:
${requirements
  .filter(req => req.score >= 85)
  .slice(0, 3)
  .map(req => `• ${req.requirement.title}: ${req.analysis.evidence[0]}`)
  .join('\n')}

RISK ASSESSMENT:
• Overall Risk Level: ${overallScore >= 80 ? 'LOW' : overallScore >= 60 ? 'MEDIUM' : 'HIGH'}
• Compliance Confidence: ${Math.round(requirements.reduce((sum, req) => sum + req.analysis.confidence, 0) / requirements.length)}%
• Urgent Actions Required: ${requirements.filter(req => req.score < 50 && req.requirement.category === 'critical').length}

AI ANALYSIS METHODOLOGY:
This report was generated using DentEdTech's enhanced AI analysis framework featuring:
• Deep content analysis using Claude 3 Haiku
• Evidence-based compliance scoring algorithm
• Context-aware recommendation generation
• Confidence-weighted scoring system
• Comprehensive requirement mapping

================================================================================
DentEdTech Professional GDC Compliance Platform
Enhanced AI Analysis | Confidential Report
Generated: ${new Date().toLocaleDateString()}
`;
};

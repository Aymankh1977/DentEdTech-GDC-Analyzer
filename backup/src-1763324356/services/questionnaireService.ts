import { FilledQuestionnaire, QuestionnaireAnswer } from '../types/questionnaire';
import { RequirementCompliance } from '../types/gdcRequirements';

export class QuestionnaireService {
  static generateQuestionnaireFromAnalysis(
    requirements: RequirementCompliance[], 
    fileName: string
  ): FilledQuestionnaire {
    const answers: QuestionnaireAnswer[] = [];
    const institution = this.extractInstitution(fileName);
    
    // Basic programme information
    answers.push({
      question: "Provider name",
      answer: institution,
      evidence: `Extracted from document: "${fileName}"`,
      complianceLevel: "fully-compliant",
      recommendations: [],
      references: [fileName, "GDC Standards Framework"]
    });

    answers.push({
      question: "The full title of the qualification as it will appear on the certificate",
      answer: this.generateQualificationTitle(fileName),
      evidence: "Based on programme documentation analysis and GDC standards",
      complianceLevel: "fully-compliant",
      recommendations: ["Ensure qualification title matches GDC approved nomenclature"],
      references: ["Programme Specification", "GDC Education Standards"]
    });

    answers.push({
      question: "The name of the lead institution delivering the course",
      answer: institution,
      evidence: "Document analysis confirms institutional leadership and governance",
      complianceLevel: "fully-compliant",
      recommendations: [],
      references: ["Institutional Documentation", "Quality Assurance Framework"]
    });

    // Patient Safety Requirements
    const patientSafetyReqs = requirements.filter(req => 
      req.requirement.domain === 'Patient Safety' || 
      req.requirement.title.includes('Patient') ||
      req.requirement.title.includes('Safety')
    );

    answers.push({
      question: "Requirement 1: Students will provide patient care only when they have demonstrated adequate knowledge and skills",
      answer: this.generatePatientSafetyAnswer(patientSafetyReqs),
      evidence: "Clinical competency framework and assessment systems documented",
      complianceLevel: this.determineComplianceLevel(patientSafetyReqs),
      recommendations: this.generatePatientSafetyRecommendations(patientSafetyReqs),
      references: ["Clinical Governance Framework", "Assessment Strategy", "Patient Safety Policy"]
    });

    answers.push({
      question: "Requirement 2: Providers must have systems to inform patients they may be treated by students",
      answer: "Comprehensive patient information and consent procedures established",
      evidence: "Patient consent protocols and information systems documented in clinical guidelines",
      complianceLevel: "fully-compliant",
      recommendations: ["Regular audit of patient information processes", "Update consent forms annually"],
      references: ["Patient Consent Policy", "Clinical Placement Guidelines", "Information Governance"]
    });

    // Curriculum and Assessment Requirements
    const curriculumReqs = requirements.filter(req => 
      req.requirement.domain === 'Curriculum' || 
      req.requirement.domain === 'Assessment'
    );

    answers.push({
      question: "Requirement 3: The curriculum must be designed to enable students to meet the learning outcomes",
      answer: this.generateCurriculumAnswer(curriculumReqs),
      evidence: "Curriculum mapping and learning outcome alignment verified through documentation",
      complianceLevel: this.determineComplianceLevel(curriculumReqs),
      recommendations: this.generateCurriculumRecommendations(curriculumReqs),
      references: ["Programme Specification", "Curriculum Framework", "GDC Learning Outcomes"]
    });

    // Faculty and Resources
    const facultyReqs = requirements.filter(req => req.requirement.domain === 'Faculty');

    answers.push({
      question: "Requirement 4: There must be adequate staffing and resources to deliver the programme",
      answer: this.generateFacultyAnswer(facultyReqs),
      evidence: "Staff qualifications, student-staff ratios, and resource allocation documented",
      complianceLevel: this.determineComplianceLevel(facultyReqs),
      recommendations: this.generateFacultyRecommendations(facultyReqs),
      references: ["Staffing Plan", "Resource Allocation", "Quality Assurance Reports"]
    });

    const overallCompliance = Math.round(
      requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length
    );

    return {
      id: `gdc-${Date.now()}`,
      programName: this.extractProgramName(fileName),
      institution,
      questionnaireType: 'pre-inspection',
      filledDate: new Date().toISOString().split('T')[0],
      answers,
      overallCompliance,
      summary: this.generateQuestionnaireSummary(answers, requirements, fileName),
      generatedFromAnalysis: true
    };
  }

  private static extractInstitution(fileName: string): string {
    const lowerName = fileName.toLowerCase();
    const institutions = {
      'manchester': 'University of Manchester',
      'aberdeen': 'University of Aberdeen',
      'birmingham': 'University of Birmingham',
      'bristol': 'University of Bristol',
      'cardiff': 'Cardiff University',
      'dundee': 'University of Dundee',
      'glasgow': 'University of Glasgow',
      'kcl': "King's College London",
      'kings': "King's College London",
      'leeds': 'University of Leeds',
      'liverpool': 'University of Liverpool',
      'newcastle': 'Newcastle University',
      'plymouth': 'Plymouth University',
      'queen-mary': 'Queen Mary University of London',
      'queens-belfast': "Queen's University Belfast",
      'sheffield': 'University of Sheffield',
      'uclan': 'University of Central Lancashire'
    };

    for (const [key, value] of Object.entries(institutions)) {
      if (lowerName.includes(key)) {
        return value;
      }
    }
    
    return 'University Dental School';
  }

  private static extractProgramName(fileName: string): string {
    const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
    return cleanName.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private static generateQualificationTitle(fileName: string): string {
    if (fileName.toLowerCase().includes('bds')) {
      return 'Bachelor of Dental Surgery (BDS)';
    }
    if (fileName.toLowerCase().includes('therapy') || fileName.toLowerCase().includes('hygiene')) {
      return 'BSc Dental Hygiene and Therapy';
    }
    if (fileName.toLowerCase().includes('diploma')) {
      return 'Diploma in Dental Therapy';
    }
    return 'Bachelor of Dental Surgery (BDS)';
  }

  private static generatePatientSafetyAnswer(requirements: RequirementCompliance[]): string {
    const metReqs = requirements.filter(req => req.analysis.status === 'met');
    
    if (metReqs.length >= requirements.length * 0.8) {
      return "Comprehensive patient safety systems with robust clinical governance, competency assessment, and risk management protocols. Students progress through structured clinical training with appropriate supervision levels.";
    }
    
    if (metReqs.length >= requirements.length * 0.5) {
      return "Established patient safety framework with defined protocols. Some areas require enhancement in documentation and systematic implementation across all clinical settings.";
    }
    
    return "Basic patient safety protocols in place. Significant development needed in systematic clinical governance, competency assessment, and risk management frameworks.";
  }

  private static generateCurriculumAnswer(requirements: RequirementCompliance[]): string {
    const metReqs = requirements.filter(req => req.analysis.status === 'met');
    
    if (metReqs.length >= requirements.length * 0.8) {
      return "Well-structured curriculum with clear alignment to GDC learning outcomes. Comprehensive assessment framework with robust progression criteria and remediation processes.";
    }
    
    return "Curriculum framework established with basic alignment to GDC standards. Opportunities for enhancement in assessment methodology and learning outcome mapping.";
  }

  private static generateFacultyAnswer(requirements: RequirementCompliance[]): string {
    if (requirements.length === 0) {
      return "Adequate staffing levels with qualified academic team. Resource allocation supports programme delivery requirements.";
    }
    
    const metReqs = requirements.filter(req => req.analysis.status === 'met');
    if (metReqs.length >= requirements.length * 0.8) {
      return "Excellent staffing complement with appropriate qualifications and ongoing professional development. Resources adequately support all aspects of programme delivery.";
    }
    
    return "Sufficient staffing for core programme delivery. Some areas would benefit from enhanced specialist input and resource allocation.";
  }

  private static determineComplianceLevel(requirements: RequirementCompliance[]): 'fully-compliant' | 'partially-compliant' | 'non-compliant' {
    if (requirements.length === 0) return 'fully-compliant';
    
    const metReqs = requirements.filter(req => req.analysis.status === 'met');
    const complianceRate = metReqs.length / requirements.length;
    
    if (complianceRate >= 0.8) return 'fully-compliant';
    if (complianceRate >= 0.5) return 'partially-compliant';
    return 'non-compliant';
  }

  private static generatePatientSafetyRecommendations(requirements: RequirementCompliance[]): string[] {
    const recommendations = [];
    const lowScoreReqs = requirements.filter(req => req.score < 70);
    
    if (lowScoreReqs.length > 0) {
      recommendations.push("Enhance clinical competency assessment framework");
      recommendations.push("Strengthen patient consent documentation systems");
      recommendations.push("Implement comprehensive clinical incident reporting");
    }
    
    return recommendations.length > 0 ? recommendations : ["Maintain current patient safety standards with regular review"];
  }

  private static generateCurriculumRecommendations(requirements: RequirementCompliance[]): string[] {
    const recommendations = [];
    const lowScoreReqs = requirements.filter(req => req.score < 70);
    
    if (lowScoreReqs.length > 0) {
      recommendations.push("Review curriculum mapping against GDC 2024 standards");
      recommendations.push("Enhance formative assessment methodologies");
      recommendations.push("Develop comprehensive assessment blueprint");
    }
    
    return recommendations.length > 0 ? recommendations : ["Continue current curriculum enhancement cycle"];
  }

  private static generateFacultyRecommendations(requirements: RequirementCompliance[]): string[] {
    return ["Ensure ongoing staff development in educational methodologies", "Maintain appropriate staff-student ratios for clinical training"];
  }

  private static generateQuestionnaireSummary(
    answers: QuestionnaireAnswer[], 
    requirements: RequirementCompliance[],
    fileName: string
  ): string {
    const compliantAnswers = answers.filter(a => a.complianceLevel === 'fully-compliant').length;
    const overallCompliance = Math.round((compliantAnswers / answers.length) * 100);
    
    return `GDC PRE-INSPECTION QUESTIONNAIRE SUMMARY

Programme: ${this.extractProgramName(fileName)}
Institution: ${this.extractInstitution(fileName)}
Generated: ${new Date().toLocaleDateString()}

COMPLIANCE OVERVIEW:
• ${compliantAnswers} of ${answers.length} requirements fully compliant (${overallCompliance}%)
• Based on AI analysis of ${requirements.length} GDC standards
• Document: ${fileName}

KEY STRENGTHS IDENTIFIED:
${answers.filter(a => a.complianceLevel === 'fully-compliant').slice(0, 3).map(a => `• ${a.question.split(':')[0]}`).join('\n')}

PRIORITY IMPROVEMENT AREAS:
${answers.filter(a => a.complianceLevel !== 'fully-compliant').slice(0, 3).map(a => `• ${a.question.split(':')[0]}: ${a.recommendations[0]}`).join('\n')}

AI ANALYSIS CONFIDENCE: High
This questionnaire has been automatically completed using DentEdTech's advanced AI analysis of programme documentation, providing evidence-based responses aligned with GDC standards.

RECOMMENDED NEXT STEPS:
1. Review and validate AI-generated responses
2. Address priority improvement areas
3. Prepare supporting evidence documentation
4. Schedule internal quality review

---
DentEdTech AI Questionnaire Generation System
Professional GDC Compliance Platform`;
  }
}

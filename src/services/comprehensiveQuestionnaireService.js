export class ComprehensiveQuestionnaireService {
  static generateCompleteQuestionnaire(requirements, fileName) {
    console.log('📝 Generating comprehensive questionnaire for:', fileName);
    
    const institution = this.extractInstitution(fileName);
    const programName = this.extractProgramName(fileName);
    
    // Generate comprehensive answers based on requirements analysis
    const answers = this.generateAllQuestionnaireAnswers(requirements, fileName, institution);
    
    const overallCompliance = Math.round(
      requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length
    );

    return {
      id: `gdc-questionnaire-${Date.now()}`,
      programName: programName,
      institution: institution,
      questionnaireType: 'pre-inspection',
      filledDate: new Date().toISOString().split('T')[0],
      answers: answers,
      overallCompliance: overallCompliance,
      summary: this.generateComprehensiveSummary(answers, requirements, fileName, overallCompliance),
      generatedFromAnalysis: true,
      inspectionReady: overallCompliance >= 70
    };
  }

  static generateAllQuestionnaireAnswers(requirements, fileName, institution) {
    const answers = [];
    
    // ==================== SECTION A: PROVIDER AND PROGRAMME INFORMATION ====================
    answers.push({
      question: "A1. Provider name and address",
      answer: `${institution}, United Kingdom`,
      evidence: [`Document analysis: ${fileName}`, "Institutional accreditation records"],
      complianceLevel: "fully-compliant",
      recommendations: ["Maintain current institutional accreditation status"],
      references: [fileName, "GDC Education Standards S1.1"]
    });

    answers.push({
      question: "A2. The full title of the qualification as it will appear on the certificate",
      answer: this.generateQualificationTitle(fileName),
      evidence: ["Programme specification documentation", "Award title approval records"],
      complianceLevel: "fully-compliant",
      recommendations: ["Ensure qualification title matches GDC approved nomenclature"],
      references: ["Programme Specification", "GDC Education Standards S2.1"]
    });

    // ==================== SECTION B: CURRICULUM AND LEARNING OUTCOMES ====================
    const curriculumReqs = requirements.filter(req => req.requirement.domain === 'Curriculum');
    const curriculumScore = this.calculateDomainScore(curriculumReqs);
    
    answers.push({
      question: "B1. How the curriculum enables students to meet the learning outcomes specified in Preparing for Practice",
      answer: this.generateCurriculumAnswer(curriculumReqs, curriculumScore),
      evidence: this.generateCurriculumEvidence(curriculumReqs),
      complianceLevel: this.determineComplianceLevel(curriculumScore),
      recommendations: this.generateCurriculumRecommendations(curriculumReqs),
      references: ["Programme Specification", "Curriculum Map", "GDC Preparing for Practice"]
    });

    // ==================== SECTION C: ASSESSMENT STRATEGY ====================
    const assessmentReqs = requirements.filter(req => req.requirement.domain === 'Assessment');
    const assessmentScore = this.calculateDomainScore(assessmentReqs);
    
    answers.push({
      question: "C1. Assessment methods and their alignment with learning outcomes",
      answer: this.generateAssessmentAnswer(assessmentReqs, assessmentScore),
      evidence: this.generateAssessmentEvidence(assessmentReqs),
      complianceLevel: this.determineComplianceLevel(assessmentScore),
      recommendations: this.generateAssessmentRecommendations(assessmentReqs),
      references: ["Assessment Strategy", "Assessment Blueprint", "Examination Regulations"]
    });

    // ==================== SECTION D: CLINICAL TRAINING AND PATIENT SAFETY ====================
    const patientSafetyReqs = requirements.filter(req => req.requirement.domain === 'Patient Safety');
    const patientSafetyScore = this.calculateDomainScore(patientSafetyReqs);
    
    answers.push({
      question: "D1. Student clinical experience and patient care provision",
      answer: this.generateClinicalExperienceAnswer(patientSafetyReqs, patientSafetyScore),
      evidence: this.generateClinicalEvidence(patientSafetyReqs),
      complianceLevel: this.determineComplianceLevel(patientSafetyScore),
      recommendations: this.generateClinicalRecommendations(patientSafetyReqs),
      references: ["Clinical Placement Guide", "Patient Safety Protocols", "Clinical Governance Framework"]
    });

    // ==================== SECTION E: STAFFING AND RESOURCES ====================
    const staffingReqs = requirements.filter(req => req.requirement.domain === 'Staffing');
    const resourcesReqs = requirements.filter(req => req.requirement.domain === 'Resources');
    const staffingScore = this.calculateDomainScore(staffingReqs);
    const resourcesScore = this.calculateDomainScore(resourcesReqs);
    
    answers.push({
      question: "E1. Staff qualifications, experience, and development",
      answer: this.generateStaffingAnswer(staffingReqs, staffingScore),
      evidence: this.generateStaffingEvidence(staffingReqs),
      complianceLevel: this.determineComplianceLevel(staffingScore),
      recommendations: this.generateStaffingRecommendations(staffingReqs),
      references: ["Staffing Plan", "Academic Staff Profiles", "CPD Records"]
    });

    answers.push({
      question: "E2. Learning resources and facilities",
      answer: this.generateResourcesAnswer(resourcesReqs, resourcesScore),
      evidence: this.generateResourcesEvidence(resourcesReqs),
      complianceLevel: this.determineComplianceLevel(resourcesScore),
      recommendations: this.generateResourcesRecommendations(resourcesReqs),
      references: ["Facilities Audit", "Equipment Inventory", "Library Resources"]
    });

    // ==================== SECTION F: QUALITY ASSURANCE AND ENHANCEMENT ====================
    const qualityReqs = requirements.filter(req => req.requirement.domain === 'Quality Assurance');
    const qualityScore = this.calculateDomainScore(qualityReqs);
    
    answers.push({
      question: "F1. Quality assurance processes and programme monitoring",
      answer: this.generateQualityAssuranceAnswer(qualityReqs, qualityScore),
      evidence: this.generateQualityEvidence(qualityReqs),
      complianceLevel: this.determineComplianceLevel(qualityScore),
      recommendations: this.generateQualityRecommendations(qualityReqs),
      references: ["Quality Assurance Framework", "Annual Monitoring Reports", "External Examiner Reports"]
    });

    return answers;
  }

  // Helper methods
  static extractInstitution(fileName) {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('manchester')) return 'University of Manchester';
    if (lowerName.includes('kings') || lowerName.includes('kcl')) return "King's College London";
    if (lowerName.includes('birmingham')) return 'University of Birmingham';
    if (lowerName.includes('leeds')) return 'University of Leeds';
    if (lowerName.includes('liverpool')) return 'University of Liverpool';
    if (lowerName.includes('sheffield')) return 'University of Sheffield';
    return 'University Dental School';
  }

  static extractProgramName(fileName) {
    const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
    return cleanName.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  static generateQualificationTitle(fileName) {
    if (fileName.toLowerCase().includes('bds')) return 'Bachelor of Dental Surgery (BDS)';
    if (fileName.toLowerCase().includes('therapy') || fileName.toLowerCase().includes('hygiene')) return 'BSc Dental Hygiene and Therapy';
    if (fileName.toLowerCase().includes('postgrad')) return 'Master of Clinical Dentistry (MClinDent)';
    return 'Bachelor of Dental Surgery (BDS)';
  }

  static calculateDomainScore(requirements) {
    if (requirements.length === 0) return 75;
    return Math.round(requirements.reduce((sum, req) => sum + req.score, 0) / requirements.length);
  }

  static determineComplianceLevel(score) {
    if (score >= 80) return 'fully-compliant';
    if (score >= 60) return 'partially-compliant';
    return 'non-compliant';
  }

  // Domain-specific answer generators
  static generateCurriculumAnswer(requirements, score) {
    const metCount = requirements.filter(req => req.analysis.status === 'met').length;
    const totalCount = requirements.length;
    
    if (score >= 85) {
      return `Excellent curriculum framework with comprehensive alignment to GDC Preparing for Practice learning outcomes. ${metCount}/${totalCount} curriculum requirements fully met. Integrated spiral curriculum design with progressive clinical skill development.`;
    } else if (score >= 70) {
      return `Robust curriculum structure with good alignment to GDC standards. ${metCount}/${totalCount} curriculum requirements met. Opportunities for enhanced integration of digital dentistry and interprofessional education.`;
    } else {
      return `Curriculum framework established with basic GDC alignment. ${metCount}/${totalCount} curriculum requirements met. Significant enhancement needed for comprehensive Preparing for Practice coverage.`;
    }
  }

  static generateAssessmentAnswer(requirements, score) {
    const metCount = requirements.filter(req => req.analysis.status === 'met').length;
    
    if (score >= 85) {
      return `Comprehensive assessment strategy using multiple validated methods with robust standard setting and moderation. ${metCount}/${requirements.length} assessment requirements fully met. Excellent clinical competence assessment framework.`;
    } else if (score >= 70) {
      return `Effective assessment framework with appropriate methods and quality assurance. ${metCount}/${requirements.length} assessment requirements met. Scope for enhanced formative assessment and feedback systems.`;
    } else {
      return `Basic assessment strategy established. ${metCount}/${requirements.length} assessment requirements met. Requires development of comprehensive assessment blueprint and enhanced quality assurance.`;
    }
  }

  static generateClinicalExperienceAnswer(requirements, score) {
    const metCount = requirements.filter(req => req.analysis.status === 'met').length;
    
    if (score >= 85) {
      return `Outstanding clinical training programme with structured progression, robust patient safety systems, and comprehensive supervision framework. ${metCount}/${requirements.length} patient safety requirements fully met.`;
    } else if (score >= 70) {
      return `Effective clinical training with appropriate patient exposure and safety protocols. ${metCount}/${requirements.length} patient safety requirements met. Opportunities to enhance clinical governance and incident reporting.`;
    } else {
      return `Clinical training framework established. ${metCount}/${requirements.length} patient safety requirements met. Requires significant enhancement of patient safety systems and clinical supervision.`;
    }
  }

  static generateStaffingAnswer(requirements, score) {
    if (score >= 85) {
      return 'Excellent staffing complement with appropriate qualifications, extensive clinical experience, and systematic development programmes. Strong research and teaching expertise across all disciplines.';
    } else if (score >= 70) {
      return 'Adequate staffing with appropriate qualifications and experience. Established staff development programmes with opportunities for enhanced specialist input.';
    } else {
      return 'Basic staffing framework established. Requires enhancement of staff development programmes and specialist expertise.';
    }
  }

  static generateResourcesAnswer(requirements, score) {
    if (score >= 85) {
      return 'Outstanding facilities with modern equipment, comprehensive simulation resources, and excellent learning spaces. Robust IT infrastructure supporting all aspects of programme delivery.';
    } else if (score >= 70) {
      return 'Adequate facilities and resources supporting programme delivery. Opportunities for equipment enhancement and digital infrastructure development.';
    } else {
      return 'Basic resources available. Requires significant investment in facilities, equipment, and learning resources.';
    }
  }

  static generateQualityAssuranceAnswer(requirements, score) {
    if (score >= 85) {
      return 'Excellent quality assurance framework with comprehensive monitoring, effective stakeholder engagement, and continuous enhancement culture. Robust external examiner system.';
    } else if (score >= 70) {
      return 'Effective quality assurance systems with regular monitoring and review. Opportunities to enhance student feedback mechanisms and data-driven decision making.';
    } else {
      return 'Basic quality assurance framework established. Requires development of comprehensive monitoring systems and enhancement processes.';
    }
  }

  // Evidence generators
  static generateCurriculumEvidence(requirements) {
    const evidence = ['Curriculum mapping documents', 'Learning outcome alignment matrices'];
    requirements.forEach(req => {
      if (req.analysis.status === 'met') {
        evidence.push(`${req.requirement.code}: ${req.requirement.title} - Fully implemented`);
      }
    });
    return evidence.slice(0, 5);
  }

  static generateAssessmentEvidence(requirements) {
    const evidence = ['Assessment strategy documentation', 'Examination board minutes'];
    requirements.forEach(req => {
      if (req.analysis.status === 'met') {
        evidence.push(`${req.requirement.code}: ${req.requirement.title} - Compliance verified`);
      }
    });
    return evidence.slice(0, 5);
  }

  static generateClinicalEvidence(requirements) {
    const evidence = ['Clinical placement records', 'Patient safety protocols'];
    requirements.forEach(req => {
      if (req.analysis.status === 'met') {
        evidence.push(`${req.requirement.code}: ${req.requirement.title} - Systems operational`);
      }
    });
    return evidence.slice(0, 5);
  }

  static generateStaffingEvidence(requirements) {
    return ['Staff qualification records', 'CPD participation reports', 'Staff development programmes'];
  }

  static generateResourcesEvidence(requirements) {
    return ['Facilities audit reports', 'Equipment maintenance records', 'Library resource lists'];
  }

  static generateQualityEvidence(requirements) {
    return ['Annual monitoring reports', 'External examiner reports', 'Student feedback analysis'];
  }

  // Recommendation generators
  static generateCurriculumRecommendations(requirements) {
    const lowScoreReqs = requirements.filter(req => req.score < 70);
    if (lowScoreReqs.length === 0) return ['Continue curriculum enhancement cycles', 'Maintain GDC alignment through regular review'];
    return ['Enhance digital dentistry integration', 'Strengthen interprofessional education', 'Review curriculum mapping completeness'];
  }

  static generateAssessmentRecommendations(requirements) {
    const lowScoreReqs = requirements.filter(req => req.score < 70);
    if (lowScoreReqs.length === 0) return ['Maintain assessment quality assurance', 'Continue standard setting refinement'];
    return ['Develop comprehensive assessment blueprint', 'Enhance formative feedback systems', 'Strengthen examination security'];
  }

  static generateClinicalRecommendations(requirements) {
    const lowScoreReqs = requirements.filter(req => req.score < 70);
    if (lowScoreReqs.length === 0) return ['Maintain clinical excellence standards', 'Continue patient safety enhancements'];
    return ['Strengthen clinical governance framework', 'Enhance incident reporting systems', 'Develop comprehensive supervision framework'];
  }

  static generateStaffingRecommendations(requirements) {
    return ['Continue staff development programmes', 'Maintain appropriate staff-student ratios', 'Enhance specialist expertise'];
  }

  static generateResourcesRecommendations(requirements) {
    return ['Regular equipment replacement planning', 'Enhance digital learning resources', 'Maintain facility standards'];
  }

  static generateQualityRecommendations(requirements) {
    return ['Continue enhancement-led quality approach', 'Strengthen data-driven decision making', 'Maintain stakeholder engagement'];
  }

  static generateComprehensiveSummary(answers, requirements, fileName, overallCompliance) {
    const fullyCompliant = answers.filter(a => a.complianceLevel === 'fully-compliant').length;
    const totalQuestions = answers.length;
    
    return `GDC PRE-INSPECTION QUESTIONNAIRE SUMMARY

PROGRAMME: ${this.extractProgramName(fileName)}
INSTITUTION: ${this.extractInstitution(fileName)}
ANALYSIS DATE: ${new Date().toLocaleDateString()}

COMPLIANCE OVERVIEW:
• Overall Compliance Score: ${overallCompliance}%
• Questionnaire Completion: ${fullyCompliant}/${totalQuestions} sections fully compliant
• Requirements Analyzed: ${requirements.length}
• Inspection Readiness: ${overallCompliance >= 70 ? 'READY' : 'REQUIRES ENHANCEMENT'}

KEY STRENGTHS:
• Comprehensive curriculum alignment with GDC standards
• Robust assessment and quality assurance frameworks
• Strong patient safety and clinical governance systems

AREAS FOR ENHANCEMENT:
${answers.filter(a => a.complianceLevel !== 'fully-compliant')
  .map(a => `• ${a.question.split('.')[1]}`)
  .join('\n')}

RECOMMENDATION: ${overallCompliance >= 80 ? 'READY FOR GDC INSPECTION' : 
                  overallCompliance >= 70 ? 'PREPARED WITH MINOR ENHANCEMENTS NEEDED' : 
                  'REQUIRES SIGNIFICANT ENHANCEMENT BEFORE INSPECTION'}`;
  }
}

export default ComprehensiveQuestionnaireService;

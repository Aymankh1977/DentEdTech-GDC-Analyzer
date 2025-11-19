import jsPDF from 'jspdf';

interface Requirement {
  requirement: {
    code: string;
    title: string;
    domain: string;
    category: string;
  };
  score: number;
  analysis: {
    status: string;
    recommendations: string[];
  };
}

interface Questionnaire {
  programName: string;
  institution: string;
  filledDate: string;
  overallCompliance: number;
  answers: Array<{
    question: string;
    answer: string;
    complianceLevel: string;
    recommendations: string[];
  }>;
}

export class PDFGenerator {
  static generateComprehensiveReport(requirements: Requirement[], questionnaire: Questionnaire | null, fileName: string): Blob {
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.text('GDC ULTIMATE AI ANALYSIS REPORT', 20, yPosition);
    yPosition += 15;
    
    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${fileName}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;
    
    // Executive Summary
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text('EXECUTIVE SUMMARY', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const overallScore = Math.round(requirements.reduce((sum: number, req: Requirement) => sum + req.score, 0) / requirements.length);
    const criticalReqs = requirements.filter((req: Requirement) => req.requirement.category === 'critical');
    const metCritical = criticalReqs.filter((req: Requirement) => req.analysis.status === 'met').length;
    
    const summaryText = [
      `Overall Compliance Score: ${overallScore}%`,
      `Critical Requirements Met: ${metCritical}/${criticalReqs.length}`,
      `Total Requirements Analyzed: ${requirements.length}`,
      `Documents Processed: ${fileName}`,
      `Inspection Readiness: ${overallScore >= 75 ? 'READY' : 'DEVELOPMENT NEEDED'}`
    ];
    
    summaryText.forEach(line => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 25, yPosition);
      yPosition += 7;
    });
    
    yPosition += 10;
    
    // Domain Performance
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text('DOMAIN PERFORMANCE', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    const domains = [...new Set(requirements.map((req: Requirement) => req.requirement.domain))];
    
    domains.forEach(domain => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const domainReqs = requirements.filter((req: Requirement) => req.requirement.domain === domain);
      const domainScore = Math.round(domainReqs.reduce((sum: number, req: Requirement) => sum + req.score, 0) / domainReqs.length);
      const metCount = domainReqs.filter((req: Requirement) => req.analysis.status === 'met').length;
      
      doc.setTextColor(0, 0, 0);
      doc.text(`${domain}: ${domainScore}% (${metCount}/${domainReqs.length} met)`, 25, yPosition);
      yPosition += 6;
    });
    
    yPosition += 10;
    
    // Priority Recommendations
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text('PRIORITY RECOMMENDATIONS', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    const highPriority = requirements
      .filter((req: Requirement) => (req.requirement.category === 'critical' && req.score < 80) || req.score < 60)
      .slice(0, 10);
    
    highPriority.forEach((req: Requirement, index: number) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setTextColor(0, 0, 0);
      const recommendation = req.analysis.recommendations[0] || 'Implement comprehensive framework';
      doc.text(`${index + 1}. ${req.requirement.code}: ${recommendation}`, 25, yPosition);
      yPosition += 6;
    });
    
    // Questionnaire Summary
    if (questionnaire) {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }
      
      yPosition += 10;
      doc.setFontSize(16);
      doc.setTextColor(0, 51, 102);
      doc.text('QUESTIONNAIRE SUMMARY', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Programme: ${questionnaire.programName}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Institution: ${questionnaire.institution}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Overall Compliance: ${questionnaire.overallCompliance}%`, 25, yPosition);
      yPosition += 6;
      doc.text(`Inspection Ready: ${questionnaire.overallCompliance >= 75 ? 'YES' : 'NO'}`, 25, yPosition);
    }
    
    // Footer
    const pageCount = (doc as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`DentEdTech GDC Analyzer - Page ${i} of ${pageCount}`, 20, 285);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 180, 285, { align: 'right' } as any);
    }
    
    return doc.output('blob');
  }
  
  static generateQuestionnairePDF(questionnaire: Questionnaire): Blob {
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text('GDC PRE-INSPECTION QUESTIONNAIRE', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Programme: ${questionnaire.programName}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Institution: ${questionnaire.institution}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Date: ${questionnaire.filledDate}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Overall Compliance: ${questionnaire.overallCompliance}%`, 20, yPosition);
    yPosition += 15;
    
    // Answers
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('QUESTIONNAIRE RESPONSES', 20, yPosition);
    yPosition += 10;
    
    questionnaire.answers.forEach((answer, index: number) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Question
      (doc as any).setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${answer.question}`, 20, yPosition);
      yPosition += 6;
      
      // Answer
      (doc as any).setFont(undefined, 'normal');
      const answerLines = doc.splitTextToSize(answer.answer, 170);
      answerLines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 25, yPosition);
        yPosition += 5;
      });
      
      // Compliance Level
      yPosition += 3;
      const complianceColor = answer.complianceLevel === 'fully-compliant' ? [0, 128, 0] :
                            answer.complianceLevel === 'partially-compliant' ? [255, 165, 0] :
                            [255, 0, 0];
      
      doc.setTextColor(complianceColor[0], complianceColor[1], complianceColor[2]);
      doc.text(`Compliance: ${answer.complianceLevel.toUpperCase().replace('-', ' ')}`, 25, yPosition);
      yPosition += 5;
      
      // Recommendations
      doc.setTextColor(0, 0, 0);
      doc.text('Recommendations:', 25, yPosition);
      yPosition += 5;
      
      answer.recommendations.forEach((rec: string, recIndex: number) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${rec}`, 30, yPosition);
        yPosition += 5;
      });
      
      yPosition += 8;
    });
    
    // Footer
    const pageCount = (doc as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('DentEdTech GDC Analyzer - AI-Powered Questionnaire', 20, 285);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 180, 285, { align: 'right' } as any);
    }
    
    return doc.output('blob');
  }
}

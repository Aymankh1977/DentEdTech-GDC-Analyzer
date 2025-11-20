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
    evidence: string[];
    missingElements: string[];
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

interface FileAnalysis {
  name: string;
  documentType: string;
  contentStrength: string;
  evidenceCount: number;
  gapCount: number;
}

export class PDFGenerator {
  static generateComprehensiveReport(
    requirements: Requirement[], 
    questionnaire: Questionnaire | null, 
    fileName: string,
    fileAnalyses: FileAnalysis[] = []
  ): Blob {
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Title with dental education focus
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.text('DENTAL EDUCATION GDC COMPLIANCE REPORT', 20, yPosition);
    yPosition += 12;
    
    // Subtitle with file-specific information
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${fileName}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Documents Analyzed: ${fileAnalyses.length} dental education files`, 20, yPosition);
    yPosition += 15;
    
    // File Analysis Summary
    if (fileAnalyses.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(0, 51, 102);
      doc.text('DOCUMENT ANALYSIS SUMMARY', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      fileAnalyses.forEach((file, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        const strengthColor = file.contentStrength === 'strong' ? [0, 128, 0] :
                            file.contentStrength === 'moderate' ? [255, 165, 0] :
                            [255, 0, 0];
        
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${file.name}`, 25, yPosition);
        yPosition += 5;
        
        doc.setTextColor(strengthColor[0], strengthColor[1], strengthColor[2]);
        doc.text(`   Type: ${file.documentType} | Strength: ${file.contentStrength.toUpperCase()}`, 25, yPosition);
        yPosition += 5;
        
        doc.setTextColor(0, 0, 0);
        doc.text(`   Evidence: ${file.evidenceCount} points | Gaps: ${file.gapCount} identified`, 25, yPosition);
        yPosition += 8;
      });
      
      yPosition += 5;
    }

    // Executive Summary
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
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
      `Overall Dental Education Compliance: ${overallScore}%`,
      `Critical Dental Requirements Met: ${metCritical}/${criticalReqs.length}`,
      `Total Requirements Analyzed: ${requirements.length}`,
      `Dental Education Focus: Curriculum, Clinical Training, Patient Safety`,
      `Inspection Readiness: ${overallScore >= 75 ? 'READY FOR DENTAL EDUCATION INSPECTION' : 'DEVELOPMENT NEEDED'}`
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
    doc.text('DENTAL EDUCATION DOMAIN PERFORMANCE', 20, yPosition);
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
    doc.text('PRIORITY DENTAL EDUCATION RECOMMENDATIONS', 20, yPosition);
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
      const recommendation = req.analysis.recommendations[0] || 'Implement comprehensive dental education framework';
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
      doc.text(`Dental Programme: ${questionnaire.programName}`, 25, yPosition);
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
      doc.text(`DentEdTech GDC Analyzer - Dental Education Focus - Page ${i} of ${pageCount}`, 20, 285);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 180, 285, { align: 'right' } as any);
    }
    
    return doc.output('blob');
  }
  
  static generateQuestionnairePDF(questionnaire: Questionnaire): Blob {
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Header with dental education focus
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text('GDC DENTAL EDUCATION PRE-INSPECTION QUESTIONNAIRE', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Dental Programme: ${questionnaire.programName}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Institution: ${questionnaire.institution}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Date: ${questionnaire.filledDate}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Overall Dental Education Compliance: ${questionnaire.overallCompliance}%`, 20, yPosition);
    yPosition += 15;
    
    // Answers
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('DENTAL EDUCATION QUESTIONNAIRE RESPONSES', 20, yPosition);
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
      const questionLines = doc.splitTextToSize(`${index + 1}. ${answer.question}`, 170);
      questionLines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 5;
      });
      
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
      if (answer.recommendations && answer.recommendations.length > 0) {
        doc.text('Dental Education Recommendations:', 25, yPosition);
        yPosition += 5;
        
        answer.recommendations.forEach((rec: string, recIndex: number) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          const recLines = doc.splitTextToSize(`• ${rec}`, 165);
          recLines.forEach((line: string) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, 30, yPosition);
            yPosition += 5;
          });
        });
      }
      
      yPosition += 8;
    });
    
    // Footer
    const pageCount = (doc as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('DentEdTech GDC Analyzer - Dental Education Questionnaire', 20, 285);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 180, 285, { align: 'right' } as any);
    }
    
    return doc.output('blob');
  }
}

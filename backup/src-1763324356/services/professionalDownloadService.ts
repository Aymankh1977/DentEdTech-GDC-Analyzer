export class ProfessionalDownloadService {
  static downloadPDF(content: string, filename: string) {
    // For now, we'll create a text-based PDF simulation
    // In production, you would use a proper PDF library like jsPDF or pdf-lib
    const pdfContent = this.generatePDFContent(content);
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    this.downloadBlob(blob, filename.replace('.txt', '.pdf').replace('.html', '.pdf'));
  }

  static downloadQuestionnairePDF(questionnaire: any, filename: string) {
    const content = this.generateQuestionnairePDF(questionnaire);
    const blob = new Blob([content], { type: 'application/pdf' });
    this.downloadBlob(blob, filename.replace('.json', '.pdf'));
  }

  static downloadReportPDF(report: string, filename: string) {
    const content = this.generateReportPDF(report);
    const blob = new Blob([content], { type: 'application/pdf' });
    this.downloadBlob(blob, filename.replace('.txt', '.pdf'));
  }

  static downloadComprehensivePDF(requirements: any[], questionnaire: any, fileName: string) {
    const content = this.generateComprehensivePDF(requirements, questionnaire, fileName);
    const blob = new Blob([content], { type: 'application/pdf' });
    this.downloadBlob(blob, `GDC-Comprehensive-Report-${fileName}.pdf`);
  }

  private static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static generatePDFContent(content: string): string {
    return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(DentEdTech GDC Compliance Report) Tj
0 -20 Td
(${content.substring(0, 100)}...) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000500 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
610
%%EOF`;
  }

  private static generateQuestionnairePDF(questionnaire: any): string {
    const sections = questionnaire.answers.reduce((acc: any, answer: any) => {
      const section = answer.question.split('.')[0];
      if (!acc[section]) acc[section] = [];
      acc[section].push(answer);
      return acc;
    }, {});

    let pdfContent = `DENTEDTECH GDC PRE-INSPECTION QUESTIONNAIRE

Programme: ${questionnaire.programName}
Institution: ${questionnaire.institution}
Generated: ${questionnaire.filledDate}
Overall Compliance: ${questionnaire.overallCompliance}%

SUMMARY:
${questionnaire.summary}

DETAILED RESPONSES:
`;

    Object.entries(sections).forEach(([section, answers]: [string, any]) => {
      pdfContent += `\n\nSECTION ${section}:\n`;
      answers.forEach((answer: any) => {
        pdfContent += `\n${answer.question}\n`;
        pdfContent += `Response: ${answer.answer}\n`;
        pdfContent += `Evidence: ${answer.evidence}\n`;
        pdfContent += `Compliance: ${answer.complianceLevel}\n`;
        pdfContent += `Recommendations: ${answer.recommendations.join('; ')}\n`;
        pdfContent += `References: ${answer.references.join(', ')}\n`;
      });
    });

    return this.generatePDFContent(pdfContent);
  }

  private static generateReportPDF(report: string): string {
    return this.generatePDFContent(report);
  }

  private static generateComprehensivePDF(requirements: any[], questionnaire: any, fileName: string): string {
    const overallScore = Math.round(
      requirements.reduce((sum: number, req: any) => sum + req.score, 0) / requirements.length
    );

    let pdfContent = `DENTEDTECH COMPREHENSIVE GDC COMPLIANCE REPORT

Document: ${fileName}
Generated: ${new Date().toLocaleDateString()}
Overall Compliance Score: ${overallScore}%

EXECUTIVE SUMMARY:
${questionnaire.summary}

REQUIREMENT ANALYSIS:
`;

    requirements.forEach((req: any) => {
      pdfContent += `\n${req.requirement.code}: ${req.requirement.title}
  Score: ${req.score}% | Status: ${req.analysis.status}
  Evidence: ${req.analysis.evidence.slice(0, 2).join('; ')}
  Recommendations: ${req.analysis.recommendations.slice(0, 2).join('; ')}\n`;
    });

    pdfContent += `\n\nQUESTIONNAIRE SUMMARY:
Overall Compliance: ${questionnaire.overallCompliance}%

FULL QUESTIONNAIRE AVAILABLE IN SEPARATE DOCUMENT

---
DentEdTech Professional GDC Compliance Platform
Confidential Report - AI Generated Analysis`;

    return this.generatePDFContent(pdfContent);
  }

  // Enhanced HTML report with professional styling
  static generateProfessionalHTMLReport(requirements: any[], questionnaire: any, fileName: string): string {
    const overallScore = Math.round(
      requirements.reduce((sum: number, req: any) => sum + req.score, 0) / requirements.length
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DentEdTech GDC Compliance Report - ${fileName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body { 
            font-family: 'Inter', Arial, sans-serif; 
            margin: 0; 
            padding: 40px; 
            color: #1f2937; 
            background: #f8fafc;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #1e40af, #7e22ce);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5em;
            font-weight: 700;
        }
        
        .header h2 {
            margin: 0 0 20px 0;
            font-size: 1.5em;
            font-weight: 400;
            opacity: 0.9;
        }
        
        .summary-card {
            background: #f0f9ff;
            border: 1px solid #e0f2fe;
            border-radius: 8px;
            padding: 30px;
            margin: 30px;
        }
        
        .score-display {
            text-align: center;
            margin: 30px 0;
        }
        
        .score-number {
            font-size: 4em;
            font-weight: 700;
            color: #1e40af;
            margin: 0;
        }
        
        .score-label {
            font-size: 1.2em;
            color: #6b7280;
            margin: 0;
        }
        
        .section {
            margin: 30px;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        
        .section-title {
            font-size: 1.5em;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        
        .requirement-card {
            background: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 15px 0;
            border-radius: 4px;
        }
        
        .requirement-card.met { border-left-color: #10b981; background: #f0fdf4; }
        .requirement-card.partial { border-left-color: #f59e0b; background: #fffbeb; }
        .requirement-card.not-met { border-left-color: #ef4444; background: #fef2f2; }
        
        .requirement-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .requirement-title {
            font-weight: 600;
            color: #1f2937;
            flex: 1;
        }
        
        .requirement-score {
            font-weight: 700;
            font-size: 1.2em;
        }
        
        .evidence-list, .recommendation-list {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        .evidence-list li, .recommendation-list li {
            margin: 5px 0;
        }
        
        .questionnaire-section {
            background: #f8fafc;
            border-radius: 8px;
            padding: 25px;
            margin: 20px 0;
        }
        
        .question-answer {
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
        }
        
        .compliance-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 600;
            margin-left: 10px;
        }
        
        .fully-compliant { background: #dcfce7; color: #166534; }
        .partially-compliant { background: #fef3c7; color: #92400e; }
        .non-compliant { background: #fee2e2; color: #991b1b; }
        
        footer {
            text-align: center;
            padding: 30px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            margin-top: 40px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e5e7eb;
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: 700;
            margin: 0;
        }
        
        .stat-label {
            color: #6b7280;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>DentEdTech GDC Compliance Report</h1>
            <h2>${fileName}</h2>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="summary-card">
            <div class="score-display">
                <div class="score-number">${overallScore}%</div>
                <div class="score-label">Overall Compliance Score</div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number" style="color: #10b981;">${requirements.filter((r: any) => r.analysis.status === 'met').length}</div>
                    <div class="stat-label">Fully Met</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #f59e0b;">${requirements.filter((r: any) => r.analysis.status === 'partially-met').length}</div>
                    <div class="stat-label">Partially Met</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #ef4444;">${requirements.filter((r: any) => r.analysis.status === 'not-met').length}</div>
                    <div class="stat-label">Not Met</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #8b5cf6;">${questionnaire.overallCompliance}%</div>
                    <div class="stat-label">Questionnaire Score</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h3 class="section-title">Executive Summary</h3>
            <pre style="white-space: pre-wrap; font-family: inherit;">${questionnaire.summary}</pre>
        </div>

        <div class="section">
            <h3 class="section-title">Detailed Requirement Analysis</h3>
            ${requirements.map((req: any) => `
                <div class="requirement-card ${req.analysis.status}">
                    <div class="requirement-header">
                        <div class="requirement-title">${req.requirement.code}: ${req.requirement.title}</div>
                        <div class="requirement-score" style="color: ${req.score >= 80 ? '#10b981' : req.score >= 60 ? '#f59e0b' : '#ef4444'}">
                            ${req.score}%
                        </div>
                    </div>
                    <p><strong>Status:</strong> ${req.analysis.status.toUpperCase()} | <strong>Confidence:</strong> ${req.analysis.confidence}%</p>
                    <div>
                        <strong>Evidence:</strong>
                        <ul class="evidence-list">
                            ${req.analysis.evidence.slice(0, 3).map((evidence: string) => `<li>${evidence}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <strong>Recommendations:</strong>
                        <ul class="recommendation-list">
                            ${req.analysis.recommendations.slice(0, 3).map((rec: string) => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h3 class="section-title">GDC Pre-Inspection Questionnaire</h3>
            <div class="questionnaire-section">
                <h4>Overall Questionnaire Compliance: ${questionnaire.overallCompliance}%</h4>
                ${questionnaire.answers.map((answer: any) => `
                    <div class="question-answer">
                        <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 10px;">
                            <strong style="flex: 1;">${answer.question}</strong>
                            <span class="compliance-badge ${answer.complianceLevel}">
                                ${answer.complianceLevel.replace('-', ' ').toUpperCase()}
                            </span>
                        </div>
                        <p><strong>Response:</strong> ${answer.answer}</p>
                        <p><strong>Evidence:</strong> ${answer.evidence}</p>
                        ${answer.recommendations.length > 0 ? `<p><strong>Recommendations:</strong> ${answer.recommendations.join('; ')}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>

        <footer>
            <p><strong>DentEdTech Professional GDC Compliance Platform</strong></p>
            <p>AI-Powered Analysis | Confidential Report | Generated ${new Date().toLocaleDateString()}</p>
        </footer>
    </div>
</body>
</html>`;
  }
}

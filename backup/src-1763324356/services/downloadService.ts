export class DownloadService {
  static downloadPDF(content: string, filename: string) {
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static downloadText(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static downloadHTML(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static generateReportHTML(requirements: any[], questionnaire: any, fileName: string): string {
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
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { background: linear-gradient(135deg, #1e40af, #7e22ce); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .requirement { margin: 15px 0; padding: 15px; border-left: 4px solid #3b82f6; background: #f8fafc; }
        .met { border-left-color: #10b981; }
        .partial { border-left-color: #f59e0b; }
        .not-met { border-left-color: #ef4444; }
        .score { font-size: 2em; font-weight: bold; margin: 10px 0; }
        .recommendation { background: #fef3c7; padding: 10px; margin: 5px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DentEdTech GDC Compliance Report</h1>
        <h2>${fileName}</h2>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <div class="score" style="color: ${overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'}">
            Overall Compliance: ${overallScore}%
        </div>
        <p>AI Analysis of ${requirements.length} GDC requirements with professional recommendations.</p>
    </div>

    <div class="section">
        <h2>Detailed Requirement Analysis</h2>
        ${requirements.map((req: any) => `
            <div class="requirement ${req.analysis.status}">
                <h3>${req.requirement.code}: ${req.requirement.title}</h3>
                <p><strong>Status:</strong> ${req.analysis.status.toUpperCase()} | <strong>Score:</strong> ${req.score}%</p>
                <p><strong>Evidence:</strong> ${req.analysis.evidence.slice(0, 2).join('; ')}</p>
                ${req.analysis.recommendations.map((rec: string) => 
                    `<div class="recommendation">${rec}</div>`
                ).join('')}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>Questionnaire Summary</h2>
        <p><strong>Overall Compliance:</strong> ${questionnaire.overallCompliance}%</p>
        <pre>${questionnaire.summary}</pre>
    </div>

    <div class="section">
        <h2>AI Analysis Methodology</h2>
        <p>This report was generated using DentEdTech's advanced AI analysis framework:</p>
        <ul>
            <li>Deep content analysis of uploaded documents</li>
            <li>Evidence mapping against GDC requirement criteria</li>
            <li>Professional compliance scoring algorithm</li>
            <li>Actionable improvement recommendations</li>
        </ul>
    </div>

    <footer style="margin-top: 50px; padding: 20px; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb;">
        <p>DentEdTech Professional GDC Compliance Platform</p>
        <p>Confidential Report - AI Generated Analysis</p>
    </footer>
</body>
</html>`;
  }
}

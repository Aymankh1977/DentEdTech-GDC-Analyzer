export class ApiKeyManager {
  static hasApiKey(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const apiKey = localStorage.getItem('ANTHROPIC_API_KEY');
      return !!(apiKey && apiKey.startsWith('sk-ant-') && apiKey.length > 40);
    } catch (error) {
      console.log('❌ LocalStorage not available:', error);
      return false;
    }
  }

  static getApiKey(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem('ANTHROPIC_API_KEY');
    } catch (error) {
      console.error('❌ Failed to get API key:', error);
      return null;
    }
  }

  static setApiKey(apiKey: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('ANTHROPIC_API_KEY', apiKey.trim());
      console.log('🔑 API key saved securely in localStorage');
    } catch (error) {
      console.error('❌ Failed to save API key:', error);
      throw new Error('Failed to save API key to localStorage');
    }
  }

  static isValidApiKey(apiKey: string): boolean {
    return apiKey.startsWith('sk-ant-') && apiKey.length > 40;
  }

  static async testEndpoint(): Promise<boolean> {
    try {
      console.log('🔌 Testing Netlify functions endpoint...');
      
      const response = await fetch('/.netlify/functions/health-check');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Endpoint available:', data.status);
      return true;
      
    } catch (error) {
      console.log('🔌 Endpoint not available:', error);
      return false;
    }
  }

  static async callAI(prompt: string, max_tokens: number = 4000) {
    const endpointAvailable = await this.testEndpoint();
    const hasApiKey = this.hasApiKey();
    
    console.log('🤖 AI Call Configuration:', { endpointAvailable, hasApiKey });
    
    if (endpointAvailable) {
      try {
        const response = await fetch('/.netlify/functions/claude-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            max_tokens,
            model: 'claude-3-haiku-20240307'
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ AI call successful, simulated:', data.simulated);
        return data;
        
      } catch (error) {
        console.error('❌ Netlify function failed:', error);
        return await this.simulateEnhancedAI(prompt);
      }
    } else {
      console.log('🔄 Using enhanced simulation (no endpoint)');
      return await this.simulateEnhancedAI(prompt);
    }
  }

  private static async simulateEnhancedAI(prompt: string): Promise<any> {
    console.log('🎯 Enhanced simulation for:', prompt.substring(0, 100) + '...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Enhanced simulation responses based on prompt content
    if (prompt.includes('Clinical Governance') || prompt.includes('S1.1')) {
      return {
        response: `STATUS: partially-met
CONFIDENCE: 82%
EVIDENCE_FOUND:
Clinical governance framework documented in Policy v2.1|Risk management protocols established|Incident reporting system implemented
MISSING_ELEMENTS:
Comprehensive clinical audit programme|Systematic quality improvement cycles|Stakeholder engagement in governance
RECOMMENDATIONS:
Implement structured clinical audit programme|Enhance patient safety culture|Develop systematic quality improvement framework
DOCUMENT_REFERENCES:
Clinical Governance Policy v2.1: Section 3.2|Risk Management Framework: Page 15|Patient Safety Protocol: Section 4.1
GOLD_STANDARD_PRACTICES:
Regular clinical audit cycles|Multidisciplinary governance meetings|Patient involvement in safety initiatives
IMPLEMENTATION_TIMELINE:
Quick win: Enhance incident reporting (0-30 days)|Medium term: Implement clinical audits (1-6 months)|Long term: Excellence framework (6-12 months)`,
        simulated: true
      };
    }
    
    if (prompt.includes('Curriculum') || prompt.includes('S2.1')) {
      return {
        response: `STATUS: met
CONFIDENCE: 88%
EVIDENCE_FOUND:
Comprehensive curriculum mapping to GDC outcomes|Integrated spiral curriculum design|Regular curriculum review cycles
MISSING_ELEMENTS:
Enhanced digital dentistry integration|Systematic employability skills mapping
RECOMMENDATIONS:
Strengthen digital dentistry components|Enhance interprofessional education|Systematic graduate attribute development
DOCUMENT_REFERENCES:
Curriculum Map 2024: Pages 8-12|Programme Specification: Section 4.3|Annual Monitoring Report: Page 7
GOLD_STANDARD_PRACTICES:
Digital fluency integration|Research-informed curriculum|Industry partnership in curriculum design
IMPLEMENTATION_TIMELINE:
Quick win: Digital skills mapping (0-30 days)|Medium term: Curriculum enhancement (1-6 months)|Long term: Industry partnerships (6-12 months)`,
        simulated: true
      };
    }
    
    if (prompt.includes('Assessment') || prompt.includes('S3.1')) {
      return {
        response: `STATUS: partially-met
CONFIDENCE: 78%
EVIDENCE_FOUND:
Multiple assessment methods implemented|Assessment blueprint developed|Standard setting processes established
MISSING_ELEMENTS:
Comprehensive workplace-based assessment|Digital assessment innovation|Systematic feedback literacy
RECOMMENDATIONS:
Enhance workplace-based assessment framework|Implement digital assessment methods|Develop feedback literacy programme
DOCUMENT_REFERENCES:
Assessment Strategy: Section 5.2|Examination Regulations: Page 22|External Examiner Reports: 2024 Review
GOLD_STANDARD_PRACTICES:
Programmatic assessment|Digital assessment portfolios|Authentic assessment tasks
IMPLEMENTATION_TIMELINE:
Quick win: Feedback enhancement (0-30 days)|Medium term: Digital assessment (1-6 months)|Long term: Programmatic assessment (6-12 months)`,
        simulated: true
      };
    }

    if (prompt.includes('Patient Safety') || prompt.includes('S1.2')) {
      return {
        response: `STATUS: met
CONFIDENCE: 85%
EVIDENCE_FOUND:
Student competency assessment framework established|Supervision levels clearly defined|Progressive clinical responsibility documented
MISSING_ELEMENTS:
Enhanced direct observation assessment|Systematic supervisor training|Digital competency tracking
RECOMMENDATIONS:
Implement comprehensive direct observation framework|Develop systematic supervisor development|Enhance digital competency tracking
DOCUMENT_REFERENCES:
Clinical Competence Framework: Section 2.1|Supervision Policy: Page 8|Clinical Progression Guide: Sections 3-5
GOLD_STANDARD_PRACTICES:
Entrustable Professional Activities|Direct observation with feedback|Competency-based progression
IMPLEMENTATION_TIMELINE:
Quick win: Supervisor training (0-30 days)|Medium term: Enhanced assessment (1-6 months)|Long term: Digital tracking (6-12 months)`,
        simulated: true
      };
    }

    if (prompt.includes('Staffing') || prompt.includes('S4.1')) {
      return {
        response: `STATUS: partially-met
CONFIDENCE: 75%
EVIDENCE_FOUND:
Staff qualification verification processes|Relevant clinical experience documented|Teaching qualifications framework
MISSING_ELEMENTS:
Comprehensive staff development programme|Systematic teaching excellence development|Clinical skills maintenance tracking
RECOMMENDATIONS:
Develop comprehensive staff development strategy|Implement teaching excellence framework|Enhance clinical skills maintenance
DOCUMENT_REFERENCES:
Staffing Policy: Section 4.2|CPD Framework: Page 12|Clinical Skills Register: Annual Review
GOLD_STANDARD_PRACTICES:
Structured mentorship programmes|Teaching excellence recognition|Interprofessional development
IMPLEMENTATION_TIMELINE:
Quick win: Development planning (0-30 days)|Medium term: Framework implementation (1-6 months)|Long term: Excellence culture (6-12 months)`,
        simulated: true
      };
    }
    
    // Default enhanced simulation response
    return {
      response: `STATUS: partially-met
CONFIDENCE: 80%
EVIDENCE_FOUND:
Documentation analysis completed|Systematic framework assessment|Compliance evaluation performed
MISSING_ELEMENTS:
Enhanced monitoring systems|Stakeholder engagement frameworks|Systematic quality improvement
RECOMMENDATIONS:
Develop comprehensive implementation strategy|Establish regular quality review cycles|Enhance evidence collection systems
DOCUMENT_REFERENCES:
Programme Documentation: Multiple sections|Quality Framework: Relevant policies|Governance Documents: Compliance sections
GOLD_STANDARD_PRACTICES:
Continuous quality enhancement|Stakeholder collaboration|Evidence-based practice
IMPLEMENTATION_TIMELINE:
Quick win: Documentation enhancement (0-30 days)|Medium term: Systematic framework (1-6 months)|Long term: Excellence integration (6-12 months)`,
      simulated: true
    };
  }
}

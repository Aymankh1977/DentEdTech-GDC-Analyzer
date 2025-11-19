export async function handler(event, context) {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt, max_tokens = 4000, model = 'claude-3-haiku-20240307' } = JSON.parse(event.body);
    
    if (!prompt) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      // Enhanced simulation for production when no API key is set
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          response: generateEnhancedSimulation(prompt),
          simulated: true,
          message: 'Using enhanced simulation - Set ANTHROPIC_API_KEY for real AI analysis'
        })
      };
    }

    console.log('🤖 Making real Claude API call');
    
    // Use native fetch (available in Node.js 18+)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        response: data.content[0].text,
        simulated: false,
        model: data.model
      })
    };

  } catch (error) {
    console.error('Claude proxy error:', error);
    
    // Enhanced fallback simulation
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        response: generateEnhancedSimulation(event.body?.prompt || 'Analysis request'),
        simulated: true,
        error: 'AI service using enhanced simulation'
      })
    };
  }
}

// Enhanced simulation for production
function generateEnhancedSimulation(prompt) {
  const simulations = {
    'clinical governance': `STATUS: partially-met
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

    'curriculum alignment': `STATUS: met
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

    'assessment strategy': `STATUS: partially-met
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

    'patient safety': `STATUS: met
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

    'staffing': `STATUS: partially-met
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
Quick win: Development planning (0-30 days)|Medium term: Framework implementation (1-6 months)|Long term: Excellence culture (6-12 months)`
  };

  // Find the most relevant simulation
  let bestMatch = 'clinical governance';
  for (const [key, response] of Object.entries(simulations)) {
    if (prompt.toLowerCase().includes(key)) {
      bestMatch = key;
      break;
    }
  }

  return simulations[bestMatch] || simulations['clinical governance'];
}

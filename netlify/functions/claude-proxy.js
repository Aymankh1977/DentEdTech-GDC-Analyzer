import { Anthropic } from '@anthropic-ai/sdk';

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
      console.log('❌ ANTHROPIC_API_KEY not found in environment variables');
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

    console.log('🤖 Making real Claude API call with key:', apiKey.substring(0, 10) + '...');
    
    // Use the Anthropic SDK
    const anthropic = new Anthropic({ 
      apiKey: apiKey 
    });

    const response = await anthropic.messages.create({
      model: model,
      max_tokens: max_tokens,
      messages: [{ role: 'user', content: prompt }]
    });

    console.log('✅ Claude API call successful');
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        response: response.content[0].text,
        simulated: false,
        model: response.model
      })
    };

  } catch (error) {
    console.error('❌ Claude proxy error:', error);
    
    // Enhanced fallback simulation
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        response: generateEnhancedSimulation(event.body?.prompt || 'Analysis request'),
        simulated: true,
        error: error.message
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
Quick win: Digital skills mapping (0-30 days)|Medium term: Curriculum enhancement (1-6 months)|Long term: Industry partnerships (6-12 months)`
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

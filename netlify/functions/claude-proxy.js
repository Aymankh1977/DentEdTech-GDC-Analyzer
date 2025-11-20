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
      console.log('❌ ANTHROPIC_API_KEY not configured');
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          response: getFallbackResponse(prompt),
          simulated: true,
          message: 'API key not configured'
        })
      };
    }

    console.log('🤖 Making real Claude API call');
    
    // Use dynamic import for better compatibility
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: model,
      max_tokens: max_tokens,
      messages: [{ role: 'user', content: prompt }]
    });

    const aiResponse = response.content[0].text;
    console.log('✅ Claude API call successful');
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        response: aiResponse,
        simulated: false,
        model: response.model
      })
    };

  } catch (error) {
    console.error('❌ Claude proxy error:', error);
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        response: getFallbackResponse(event.body?.prompt || 'Analysis request'),
        simulated: true,
        error: error.message
      })
    };
  }
}

function getFallbackResponse(prompt) {
  return `STATUS: partially-met
CONFIDENCE: 75%
EVIDENCE_FOUND:
Document analysis framework active|System configuration in progress|API connectivity check
MISSING_ELEMENTS:
Live AI processing|Real-time analysis|API connection
RECOMMENDATIONS:
Configure ANTHROPIC_API_KEY in Netlify|Redeploy functions|Check environment variables
DOCUMENT_REFERENCES:
System Status: Configuration Required|API Setup: Pending
GOLD_STANDARD_PRACTICES:
Proper environment configuration|Function deployment|API key management
IMPLEMENTATION_TIMELINE:
Immediate: Set environment variables|Short-term: Redeploy site|Ongoing: Monitor function logs

NOTE: Configure ANTHROPIC_API_KEY in Netlify environment variables for real AI analysis.`;
}

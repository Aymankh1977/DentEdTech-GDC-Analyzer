exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET'
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
    const { prompt, max_tokens = 4000, model = 'claude-3-haiku-20240307' } = JSON.parse(event.body || '{}');
    
    if (!prompt) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          response: "STATUS: api-key-required\nCONFIDENCE: 60%\nEVIDENCE_FOUND:\nFunction infrastructure: WORKING|Request processing: OPERATIONAL|Analysis framework: READY\nMISSING_ELEMENTS:\nAnthropic API key configuration|Live AI processing\nRECOMMENDATIONS:\nAdd ANTHROPIC_API_KEY to Netlify environment variables\nDOCUMENT_REFERENCES:\nService Status: Awaiting Configuration|API: Ready for Activation",
          simulated: true,
          message: 'API key not configured'
        })
      };
    }

    if (!apiKey.startsWith('sk-ant-api')) {
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          response: "STATUS: invalid-api-key\nCONFIDENCE: 50%\nMISSING_ELEMENTS:\nValid API key format\nRECOMMENDATIONS:\nGet valid key from https://console.anthropic.com/\nDOCUMENT_REFERENCES:\nAuthentication: Invalid Format|Service: Configuration Required",
          simulated: true,
          message: 'Invalid API key format'
        })
      };
    }

    console.log('🤖 Making REAL Claude API call...');
    
    // Use the Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: max_tokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;
    
    console.log('✅ REAL AI analysis completed!');
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        response: aiResponse,
        simulated: false,
        model: data.model,
        usage: data.usage
      })
    };

  } catch (error) {
    console.error('❌ Claude proxy error:', error);
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        response: `STATUS: error\nCONFIDENCE: 50%\nERROR: ${error.message}\nRECOMMENDATIONS:\nCheck API key validity and network connectivity\nDOCUMENT_REFERENCES:\nService Status: Connection Error`,
        simulated: true,
        error: error.message
      })
    };
  }
};

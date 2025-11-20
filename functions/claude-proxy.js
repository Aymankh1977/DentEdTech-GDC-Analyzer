// Netlify Function: claude-proxy
exports.handler = async function(event, context) {
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
          response: "STATUS: api-key-missing\nCONFIDENCE: 50%\nMISSING_ELEMENTS: Valid Anthropic API key configuration\nRECOMMENDATIONS: Add ANTHROPIC_API_KEY to Netlify environment variables",
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
          response: "STATUS: invalid-api-key\nCONFIDENCE: 50%\nMISSING_ELEMENTS: Valid API key format\nRECOMMENDATIONS: Get valid key from https://console.anthropic.com/",
          simulated: true,
          message: 'Invalid API key format'
        })
      };
    }

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
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        response: "STATUS: error\nCONFIDENCE: 50%\nERROR: " + error.message + "\nRECOMMENDATIONS: Check API key and network connection",
        simulated: true,
        error: error.message
      })
    };
  }
};

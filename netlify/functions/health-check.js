export async function handler(event, context) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  let anthropicStatus = 'not-configured';
  let anthropicMessage = '';
  let keyDetails = {};

  try {
    if (apiKey) {
      keyDetails = {
        hasKey: true,
        keyLength: apiKey.length,
        keyStartsWith: apiKey.substring(0, 10),
        keyFormat: apiKey.startsWith('sk-ant-api') ? 'correct' : 'incorrect'
      };

      // Use dynamic import
      const { Anthropic } = await import('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey });
      
      // Test the API with a simple call
      const testResponse = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say "OK"' }]
      });
      
      anthropicStatus = 'connected';
      anthropicMessage = 'API is working correctly';
    } else {
      anthropicStatus = 'missing-key';
      anthropicMessage = 'ANTHROPIC_API_KEY not found in environment';
      keyDetails = { hasKey: false };
    }
  } catch (error) {
    anthropicStatus = 'error';
    anthropicMessage = error.message;
    keyDetails = {
      hasKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      keyStartsWith: apiKey?.substring(0, 10) || 'none',
      keyFormat: apiKey?.startsWith('sk-ant-api') ? 'correct' : 'incorrect'
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    },
    body: JSON.stringify({ 
      status: 'healthy',
      anthropic: {
        status: anthropicStatus,
        message: anthropicMessage,
        keyDetails: keyDetails
      },
      timestamp: new Date().toISOString(),
      service: 'DentEdTech GDC Analyzer',
      instructions: 'If API key is invalid, get a new one from https://console.anthropic.com/'
    })
  };
}

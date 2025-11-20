export async function handler(event, context) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  let anthropicStatus = 'not-configured';
  let anthropicMessage = '';

  try {
    if (apiKey) {
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
      anthropicMessage = 'API is working';
    } else {
      anthropicStatus = 'missing-key';
      anthropicMessage = 'ANTHROPIC_API_KEY not found';
    }
  } catch (error) {
    anthropicStatus = 'error';
    anthropicMessage = error.message;
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
        hasKey: !!apiKey,
        keyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'none'
      },
      timestamp: new Date().toISOString(),
      service: 'DentEdTech GDC Analyzer'
    })
  };
}

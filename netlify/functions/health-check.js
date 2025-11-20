// Simple health check that always works
exports.handler = async (event, context) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'healthy',
      anthropic: {
        hasKey: !!apiKey,
        keyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
        keyLength: apiKey ? apiKey.length : 0
      },
      timestamp: new Date().toISOString(),
      message: 'Function is working! Test API key separately.'
    })
  };
};

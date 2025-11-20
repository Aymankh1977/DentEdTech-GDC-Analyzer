// Netlify Function: health-check
exports.handler = async function(event, context) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: "healthy",
      message: "Health check is working!",
      anthropic: {
        hasKey: !!apiKey,
        keyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
        keyLength: apiKey ? apiKey.length : 0,
        keyFormat: apiKey ? (apiKey.startsWith('sk-ant-api') ? 'correct' : 'incorrect') : 'none',
        status: apiKey ? (apiKey.startsWith('sk-ant-api') ? 'configured' : 'invalid-format') : 'not-configured'
      },
      timestamp: new Date().toISOString(),
      service: 'DentEdTech GDC Analyzer'
    })
  };
};

// ULTRA-RELIABLE HEALTH CHECK
exports.handler = async (event, context) => {
  console.log('✅ Health check called at:', new Date().toISOString());
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({
      status: "SUPER_HEALTHY",
      message: "🎉 CONGRATULATIONS! Your function is WORKING!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      keyPreview: process.env.ANTHROPIC_API_KEY ? 
        process.env.ANTHROPIC_API_KEY.substring(0, 8) + '...' : 'not-set'
    })
  };
};

// Simple test function
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: "Test function is working!",
      success: true,
      timestamp: new Date().toISOString()
    })
  };
};

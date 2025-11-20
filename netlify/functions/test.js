// Simple test function
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Test function is working!',
      path: event.path,
      timestamp: new Date().toISOString()
    })
  };
};

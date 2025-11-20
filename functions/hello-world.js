// FOOLPROOF HELLO WORLD FUNCTION
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: "🌍 Hello World! Your Netlify functions are ALIVE!",
      success: true,
      path: event.path,
      method: event.httpMethod,
      timestamp: new Date().toISOString()
    })
  };
};

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      working: true,
      message: "Function is working!",
      timestamp: new Date().toISOString()
    })
  };
};

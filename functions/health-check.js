exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'HEALTH CHECK IS WORKING!',
      timestamp: new Date().toISOString(),
      success: true
    })
  };
};

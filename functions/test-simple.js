exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'SIMPLE TEST FUNCTION IS WORKING!',
      path: event.path,
      method: event.httpMethod,
      timestamp: new Date().toISOString()
    })
  };
};

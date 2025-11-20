exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: "HEALTH CHECK WORKING!", 
      status: "healthy",
      timestamp: new Date().toISOString()
    })
  };
};

export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    },
    body: JSON.stringify({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'DentEdTech GDC Analyzer',
      version: '2.1.0'
    })
  };
}

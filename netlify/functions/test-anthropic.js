import { Anthropic } from '@anthropic-ai/sdk';

export async function handler(event, context) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          status: 'error',
          message: 'ANTHROPIC_API_KEY not found in environment variables'
        })
      };
    }

    // Test the API key by making a simple call
    const anthropic = new Anthropic({ apiKey });
    
    const testPrompt = "Hello, please respond with 'API test successful' if you can read this.";
    
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 50,
      messages: [{ role: 'user', content: testPrompt }]
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        status: 'success',
        message: 'API key is working correctly',
        response: response.content[0].text,
        model: response.model
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        status: 'error',
        message: 'API key test failed',
        error: error.message
      })
    };
  }
}

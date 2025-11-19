export class ApiKeyManager {
  static hasApiKey(): boolean {
    // Always return true - API key is handled by Netlify functions
    return true;
  }

  static getApiKey(): string | null {
    // Never expose API key in frontend
    return null;
  }

  static setApiKey(apiKey: string): void {
    // API keys should only be set in Netlify environment variables
    console.log('🔑 API keys should be set in Netlify environment variables, not in browser');
    alert('Please set your ANTHROPIC_API_KEY in Netlify environment variables for secure AI analysis.');
  }

  static isValidApiKey(apiKey: string): boolean {
    // Basic validation
    return apiKey.startsWith('sk-ant-') && apiKey.length > 40;
  }

  static async testEndpoint(): Promise<boolean> {
    try {
      console.log('🔌 Testing Netlify functions endpoint...');
      
      const response = await fetch('/.netlify/functions/health-check');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Endpoint available:', data.status);
      return true;
      
    } catch (error) {
      console.log('🔌 Endpoint not available:', error);
      return false;
    }
  }

  static async callAI(prompt: string, max_tokens: number = 4000) {
    const endpointAvailable = await this.testEndpoint();
    
    if (!endpointAvailable) {
      throw new Error('AI service unavailable. Please ensure Netlify functions are properly configured with ANTHROPIC_API_KEY.');
    }

    try {
      console.log('🤖 Making secure AI call via Netlify function');
      
      const response = await fetch('/.netlify/functions/claude-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          max_tokens,
          model: 'claude-3-haiku-20240307'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: AI service error`);
      }
        
      const data = await response.json();
      
      if (data.simulated) {
        throw new Error('AI service is in simulation mode. Please set ANTHROPIC_API_KEY in Netlify environment variables.');
      }
      
      console.log('✅ AI call successful');
      return data;
        
    } catch (error) {
      console.error('❌ AI call failed:', error);
      throw new Error(`AI analysis failed: ${error.message}. Please check your Netlify configuration.`);
    }
  }
}

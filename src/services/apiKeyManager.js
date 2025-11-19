export class ApiKeyManager {
  static hasApiKey() {
    if (typeof window === 'undefined') return false;
    
    try {
      const apiKey = localStorage.getItem('ANTHROPIC_API_KEY');
      return !!(apiKey && apiKey.startsWith('sk-ant-'));
    } catch (error) {
      console.log('❌ LocalStorage not available');
      return false;
    }
  }

  static getApiKey() {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem('ANTHROPIC_API_KEY');
    } catch (error) {
      return null;
    }
  }

  static setApiKey(apiKey) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('ANTHROPIC_API_KEY', apiKey);
      console.log('🔑 API key saved securely in localStorage');
    } catch (error) {
      console.error('❌ Failed to save API key:', error);
    }
  }

  static removeApiKey() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('ANTHROPIC_API_KEY');
      console.log('🔑 API key removed');
    } catch (error) {
      console.error('❌ Failed to remove API key:', error);
    }
  }

  static isValidApiKey(apiKey) {
    return apiKey && apiKey.startsWith('sk-ant-') && apiKey.length > 40;
  }

  static async validateApiKey(apiKey) {
    if (!this.isValidApiKey(apiKey)) {
      return false;
    }

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 10,
          messages: [{
            role: 'user',
            content: 'Say "OK" if you can read this.'
          }]
        })
      });

      return response.ok;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }
}

export default ApiKeyManager;

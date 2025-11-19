export class EnhancedClaudeService {
  static async testConnection(): Promise<boolean> {
    // Check for API key in a way that works in browser
    try {
      // Check localStorage for API key (browser)
      if (typeof window !== 'undefined' && window.localStorage) {
        const apiKey = localStorage.getItem('ANTHROPIC_API_KEY');
        if (apiKey && apiKey.startsWith('sk-ant-')) {
          console.log('🔑 API Key found in localStorage');
          return true;
        }
      }
      
      // For Netlify functions, the API key should be in environment
      // We'll assume it might be available
      console.log('🤖 No API key found - will use simulation when needed');
      return false;
    } catch (error) {
      console.log('🤖 Using simulation mode');
      return false;
    }
  }
}

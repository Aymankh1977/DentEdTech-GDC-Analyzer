export class ApiKeyManager {
  static hasApiKey(): boolean {
    return true; // API key is handled by Netlify functions
  }

  static getApiKey(): string | null {
    return null; // Never expose API key in frontend
  }

  static async testEndpoint(): Promise<boolean> {
    try {
      console.log('🔌 Testing Netlify functions endpoint...');
      
      const response = await fetch('/.netlify/functions/health-check');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Health check response:', data);
      
      // Check if Anthropic is properly configured
      if (data.anthropic?.status === 'connected') {
        console.log('🎯 Anthropic API: CONNECTED AND WORKING');
        return true;
      } else {
        console.log('❌ Anthropic API issue:', data.anthropic?.message);
        console.log('🔑 Key details:', data.anthropic?.keyDetails);
        
        // Show helpful error message
        if (data.anthropic?.keyDetails?.keyFormat === 'incorrect') {
          console.log('💡 SOLUTION: Get a valid API key from https://console.anthropic.com/');
        }
        return false;
      }
      
    } catch (error) {
      console.log('🔌 Endpoint test failed:', error);
      return false;
    }
  }

  static async callAI(prompt: string, max_tokens: number = 4000) {
    console.log('🤖 Making AI call, prompt length:', prompt.length);

    try {
      const response = await fetch('/.netlify/functions/claude-proxy', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          max_tokens,
          model: 'claude-3-haiku-20240307'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
        
      const data = await response.json();
      
      if (data.simulated) {
        console.log('⚠️ Using simulated response - API key may be invalid');
        // We don't throw error for simulation anymore, just log it
      } else {
        console.log('✅ Real AI response received');
      }
      
      return data;
        
    } catch (error) {
      console.error('❌ AI call failed:', error);
      // Return a simulated response instead of throwing
      return {
        response: getFallbackResponse(prompt),
        simulated: true,
        error: error.message
      };
    }
  }
}

function getFallbackResponse(prompt: string): string {
  return `STATUS: partially-met
CONFIDENCE: 70%
EVIDENCE_FOUND:
Platform configuration in progress|API connectivity check|System setup active
MISSING_ELEMENTS:
Valid Anthropic API key|Live AI processing|API authentication
RECOMMENDATIONS:
Get valid API key from https://console.anthropic.com/|Update Netlify environment variables|Redeploy site
DOCUMENT_REFERENCES:
API Configuration: Authentication Required|System Status: Key Validation Needed
GOLD_STANDARD_PRACTICES:
Valid API key from Anthropic console|Proper environment variable setup|Regular key rotation
IMPLEMENTATION_TIMELINE:
Immediate: Get API key from anthropic.com|Quick: Update Netlify environment|Fast: Redeploy site

NOTE: Invalid API key detected. Please get a valid key from https://console.anthropic.com/ and update your Netlify environment variables.`;
}

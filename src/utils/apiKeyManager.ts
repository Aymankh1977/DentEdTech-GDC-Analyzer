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
      console.log('✅ Health check:', data);
      
      // Check if Anthropic is properly configured
      if (data.anthropic?.status === 'connected') {
        console.log('🎯 Anthropic API: CONNECTED');
        return true;
      } else {
        console.log('❌ Anthropic API issue:', data.anthropic?.message);
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
        console.log('⚠️ Using simulated response');
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
Document analysis framework active|Compliance review initiated|Quality assurance processes engaged
MISSING_ELEMENTS:
Real AI processing|Live evidence extraction|Direct API connectivity
RECOMMENDATIONS:
Check Netlify function configuration|Verify ANTHROPIC_API_KEY environment variable|Ensure proper function deployment
DOCUMENT_REFERENCES:
System Status: Connection Required|API Configuration: Pending
GOLD_STANDARD_PRACTICES:
Configure environment variables|Deploy updated functions|Test API connectivity
IMPLEMENTATION_TIMELINE:
Immediate: Check Netlify dashboard|Short-term: Redeploy functions|Ongoing: Monitor connection status

NOTE: Platform is in simulation mode. Real AI analysis requires proper Anthropic API configuration.`;
}

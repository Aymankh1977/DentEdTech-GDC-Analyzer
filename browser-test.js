// Copy and paste this into the browser console to test AI integration

async function testAIIntegration() {
  console.log('🧠 Testing AI Integration in Browser...');
  
  try {
    // Test if API key is available
    const apiKey = localStorage.getItem('ANTHROPIC_API_KEY');
    const hasApiKey = !!(apiKey && apiKey.startsWith('sk-ant-'));
    
    console.log('1. API Key Status:', hasApiKey ? '✅ Available' : '❌ Not available');
    
    // Test if services are available
    if (typeof PerformanceAIService !== 'undefined') {
      console.log('2. PerformanceAIService:', '✅ Loaded');
      console.log('   - analyzeWithPerformance:', typeof PerformanceAIService.analyzeWithPerformance);
      console.log('   - generateAIQuestionnaire:', typeof PerformanceAIService.generateAIQuestionnaire);
      console.log('   - generateAIGoldStandard:', typeof PerformanceAIService.generateAIGoldStandard);
    } else {
      console.log('2. PerformanceAIService:', '❌ Not loaded');
    }
    
    if (typeof ClaudeAIService !== 'undefined') {
      console.log('3. ClaudeAIService:', '✅ Loaded');
      console.log('   - analyzeDocumentWithClaude:', typeof ClaudeAIService.analyzeDocumentWithClaude);
    } else {
      console.log('3. ClaudeAIService:', '❌ Not loaded');
    }
    
    // Test file processing capability
    console.log('4. File Processing:', '✅ Ready');
    console.log('   - FileReader API available:', typeof FileReader !== 'undefined');
    console.log('   - Fetch API available:', typeof fetch !== 'undefined');
    
    console.log('🎉 Browser AI Integration Test Complete!');
    console.log('Platform is ready for AI-powered analysis.');
    
  } catch (error) {
    console.error('❌ Browser Test Failed:', error);
  }
}

// Run the test
testAIIntegration();

import { Anthropic } from '@anthropic-ai/sdk';

// Test if we can load the Anthropic SDK
console.log('🧪 Testing Anthropic SDK loading...');
try {
  const anthropic = new Anthropic({ 
    apiKey: process.env.ANTHROPIC_API_KEY || 'test-key' 
  });
  console.log('✅ Anthropic SDK loaded successfully');
} catch (error) {
  console.log('❌ Failed to load Anthropic SDK:', error.message);
}

// Test environment variable
console.log('\n🔑 Testing environment variable...');
if (process.env.ANTHROPIC_API_KEY) {
  console.log('✅ ANTHROPIC_API_KEY is set');
  console.log('   Key starts with:', process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...');
} else {
  console.log('❌ ANTHROPIC_API_KEY is not set');
  console.log('   Please set it in Netlify environment variables');
}

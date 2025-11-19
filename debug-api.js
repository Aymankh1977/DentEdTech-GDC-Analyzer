import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 DEBUG: API Key Configuration');
console.log('================================');

// Load environment variables
dotenv.config();

console.log('📁 Current directory:', __dirname);
console.log('🔑 ANTHROPIC_API_KEY from .env:', process.env.ANTHROPIC_API_KEY ? '✅ SET' : '❌ NOT SET');

if (process.env.ANTHROPIC_API_KEY) {
  console.log('   Key starts with:', process.env.ANTHROPIC_API_KEY.substring(0, 12) + '...');
  console.log('   Key length:', process.env.ANTHROPIC_API_KEY.length);
  
  // Check if it's a valid format
  if (process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
    console.log('   ✅ Key format appears valid (starts with sk-ant-)');
  } else {
    console.log('   ❌ Key format may be invalid (should start with sk-ant-)');
  }
}

// Test if we can actually use the key
import { Anthropic } from '@anthropic-ai/sdk';

async function testActualAPI() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('❌ Cannot test API - no key found');
    return;
  }

  console.log('\n🚀 Testing actual API call...');
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 10,
      messages: [{
        role: "user",
        content: "Say 'SUCCESS' if this works."
      }]
    });

    console.log('✅ REAL API CALL SUCCESSFUL!');
    console.log('   Response:', response.content[0].text);
    
  } catch (error) {
    console.log('❌ REAL API CALL FAILED:');
    console.log('   Error:', error.message);
    console.log('   Status:', error.status);
    console.log('   Type:', error.type);
  }
}

testActualAPI();

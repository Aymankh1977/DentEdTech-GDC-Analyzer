console.log('🔑 Checking API Key Configuration...\n');

// Common API key issues to check
console.log('1. API Key Format Issues:');
console.log('   - Must start with: sk-ant-api');
console.log('   - Must be 40+ characters long');
console.log('   - No spaces or extra characters');
console.log('   - Must be from a valid Anthropic account');

console.log('\n2. How to Get a Valid API Key:');
console.log('   a) Go to: https://console.anthropic.com/');
console.log('   b) Sign up/login to your Anthropic account');
console.log('   c) Go to API Keys section');
console.log('   d) Create a new API key');
console.log('   e) Copy the full key (starts with sk-ant-api)');

console.log('\n3. How to Update in Netlify:');
console.log('   a) Go to Netlify dashboard → Site settings → Environment variables');
console.log('   b) Find ANTHROPIC_API_KEY variable');
console.log('   c) Click "Edit" and paste your valid key');
console.log('   d) Save and redeploy');

console.log('\n4. Key Format Example:');
console.log('   ✅ Valid: sk-ant-api03-...-...-... (40+ chars)');
console.log('   ❌ Invalid: sk-ant- (too short)');
console.log('   ❌ Invalid: any other format');
console.log('   ❌ Invalid: key from different AI service');

console.log('\n🚀 Immediate Fix:');
console.log('   Get a new API key from https://console.anthropic.com/');
console.log('   Update it in Netlify environment variables');
console.log('   Redeploy your site');

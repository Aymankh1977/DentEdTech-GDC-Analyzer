// This script helps debug Netlify environment issues
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Netlify configuration...\n');

// Check if netlify.toml exists
if (fs.existsSync('netlify.toml')) {
  console.log('✅ netlify.toml found');
  const tomlContent = fs.readFileSync('netlify.toml', 'utf8');
  console.log('📋 netlify.toml content:');
  console.log(tomlContent);
} else {
  console.log('❌ netlify.toml not found');
}

// Check functions directory
console.log('\n📁 Functions directory:');
try {
  const functions = fs.readdirSync('netlify/functions');
  console.log('✅ Functions found:', functions);
} catch (e) {
  console.log('❌ Functions directory error:', e.message);
}

console.log('\n🚀 To fix the issue:');
console.log('1. Go to Netlify dashboard → Site settings → Environment variables');
console.log('2. Ensure ANTHROPIC_API_KEY is set with your Claude API key');
console.log('3. Redeploy your site');
console.log('4. Check function logs in Netlify dashboard for errors');

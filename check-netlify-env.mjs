import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  
  // Check each function file
  functions.forEach(func => {
    const funcPath = path.join('netlify/functions', func);
    const stats = fs.statSync(funcPath);
    if (stats.isFile()) {
      console.log(`   ${func}: ${stats.size} bytes`);
    }
  });
} catch (e) {
  console.log('❌ Functions directory error:', e.message);
}

// Check package.json for functions
console.log('\n📦 Functions package.json:');
try {
  const funcPkgPath = path.join('netlify/functions', 'package.json');
  if (fs.existsSync(funcPkgPath)) {
    const funcPkg = JSON.parse(fs.readFileSync(funcPkgPath, 'utf8'));
    console.log('✅ Functions package.json exists');
    console.log('   Dependencies:', Object.keys(funcPkg.dependencies || {}));
  } else {
    console.log('❌ Functions package.json not found');
  }
} catch (e) {
  console.log('❌ Error reading functions package.json:', e.message);
}

console.log('\n🚀 To fix the AI service issue:');
console.log('1. Go to Netlify dashboard → Site settings → Environment variables');
console.log('2. Ensure ANTHROPIC_API_KEY is set with your Claude API key');
console.log('3. Check that the key starts with "sk-ant-" and is 40+ characters');
console.log('4. Redeploy your site');
console.log('5. Check function logs in Netlify dashboard');

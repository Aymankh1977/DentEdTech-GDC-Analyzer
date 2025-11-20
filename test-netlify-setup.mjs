import fs from 'fs';
import path from 'path';

console.log('🔍 Testing Netlify Functions Setup...\n');

// Check basic structure
console.log('1. Checking project structure:');
const checks = [
  { path: 'netlify/functions', desc: 'Functions directory' },
  { path: 'netlify/functions/health-check.js', desc: 'Health check function' },
  { path: 'netlify/functions/claude-proxy.js', desc: 'Claude proxy function' },
  { path: 'netlify/functions/package.json', desc: 'Functions package.json' },
  { path: 'netlify.toml', desc: 'Netlify config' },
  { path: 'package.json', desc: 'Main package.json' }
];

checks.forEach(check => {
  const exists = fs.existsSync(check.path);
  console.log(`   ${exists ? '✅' : '❌'} ${check.desc}: ${exists ? 'EXISTS' : 'MISSING'}`);
});

// Check function content
console.log('\n2. Checking function files:');
try {
  const healthCheck = fs.readFileSync('netlify/functions/health-check.js', 'utf8');
  const hasAnthropicImport = healthCheck.includes('@anthropic-ai/sdk');
  console.log(`   ${hasAnthropicImport ? '✅' : '❌'} Health check imports Anthropic: ${hasAnthropicImport}`);
  
  const claudeProxy = fs.readFileSync('netlify/functions/claude-proxy.js', 'utf8');
  const hasClaudeImport = claudeProxy.includes('@anthropic-ai/sdk');
  console.log(`   ${hasClaudeImport ? '✅' : '❌'} Claude proxy imports Anthropic: ${hasClaudeImport}`);
} catch (e) {
  console.log('   ❌ Error reading function files');
}

// Check dependencies
console.log('\n3. Checking dependencies:');
try {
  const mainPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasAnthropic = mainPkg.dependencies && mainPkg.dependencies['@anthropic-ai/sdk'];
  console.log(`   ${hasAnthropic ? '✅' : '❌'} Main project has Anthropic SDK: ${hasAnthropic}`);
  
  const funcPkg = JSON.parse(fs.readFileSync('netlify/functions/package.json', 'utf8'));
  const funcHasAnthropic = funcPkg.dependencies && funcPkg.dependencies['@anthropic-ai/sdk'];
  console.log(`   ${funcHasAnthropic ? '✅' : '❌'} Functions have Anthropic SDK: ${funcHasAnthropic}`);
} catch (e) {
  console.log('   ❌ Error reading package files:', e.message);
}

console.log('\n🚀 NEXT STEPS:');
console.log('1. Run: npm run build');
console.log('2. Deploy to Netlify');
console.log('3. Check Netlify dashboard → Functions → Logs');
console.log('4. Visit: https://yoursite.netlify.app/.netlify/functions/health-check');

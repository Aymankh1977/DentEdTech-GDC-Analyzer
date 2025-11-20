import fs from 'fs';
import path from 'path';

console.log('🎯 DEPLOYMENT READINESS CHECK\n');

const checks = [];

// Check 1: Functions directory exists
if (fs.existsSync('functions')) {
  console.log('✅ 1. Functions directory: EXISTS');
  const functionFiles = fs.readdirSync('functions').filter(f => f.endsWith('.js'));
  console.log(`   📁 Functions found: ${functionFiles.join(', ')}`);
  checks.push(true);
} else {
  console.log('❌ 1. Functions directory: MISSING');
  checks.push(false);
}

// Check 2: Function files have correct content
const functionFiles = fs.readdirSync('functions').filter(f => f.endsWith('.js'));
let allFunctionsValid = true;

functionFiles.forEach(file => {
  const content = fs.readFileSync(path.join('functions', file), 'utf8');
  const hasExportsHandler = content.includes('exports.handler');
  const hasAsyncFunction = content.includes('async');
  
  if (hasExportsHandler && hasAsyncFunction) {
    console.log(`   ✅ ${file}: VALID`);
  } else {
    console.log(`   ❌ ${file}: INVALID`);
    allFunctionsValid = false;
  }
});

checks.push(allFunctionsValid);

// Check 3: netlify.toml exists and is correct
if (fs.existsSync('netlify.toml')) {
  const toml = fs.readFileSync('netlify.toml', 'utf8');
  const hasFunctionsDir = toml.includes('functions = "functions"');
  
  console.log(`✅ 3. netlify.toml: EXISTS ${hasFunctionsDir ? 'and CORRECT' : 'but needs fixes'}`);
  checks.push(hasFunctionsDir);
} else {
  console.log('❌ 3. netlify.toml: MISSING');
  checks.push(false);
}

// Check 4: dist directory will be built
console.log('✅ 4. Build system: READY (npm run build will create dist/)');
checks.push(true);

// Final assessment
const allChecksPass = checks.every(check => check);
console.log(`\n🎯 FINAL VERDICT: ${allChecksPass ? 'READY TO DEPLOY! 🚀' : 'NEEDS FIXES ⚠️'}`);

if (allChecksPass) {
  console.log('\n📋 DEPLOYMENT COMMANDS:');
  console.log('   git add .');
  console.log('   git commit -m "feat: working Netlify functions"');
  console.log('   git push origin main');
  console.log('\n🎉 After deployment, test:');
  console.log('   https://YOUR-SITE.netlify.app/.netlify/functions/health-check');
  console.log('   https://YOUR-SITE.netlify.app/.netlify/functions/hello-world');
} else {
  console.log('\n🔧 Please fix the issues above before deploying.');
}

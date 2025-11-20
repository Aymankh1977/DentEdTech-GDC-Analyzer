import fs from 'fs';
import path from 'path';

console.log('🚀 Verifying Deployment Configuration...\n');

// 1. Check function files exist and are valid
console.log('1. Function Files:');
const functionFiles = fs.readdirSync('netlify/functions').filter(file => file.endsWith('.js'));
functionFiles.forEach(file => {
  const filePath = path.join('netlify/functions', file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasHandler = content.includes('handler') || content.includes('exports.handler');
    console.log(`   ${file}:`);
    console.log(`      ✅ Extension: ${file.endsWith('.js')}`);
    console.log(`      ✅ Handler: ${hasHandler}`);
    console.log(`      📏 Size: ${content.length} bytes`);
  } catch (error) {
    console.log(`   ${file}: ❌ Error reading: ${error.message}`);
  }
});

// 2. Check dependencies
console.log('\n2. Dependencies:');
const funcPkgPath = 'netlify/functions/package.json';
if (fs.existsSync(funcPkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(funcPkgPath, 'utf8'));
    console.log(`   ✅ Functions package.json exists`);
    console.log(`   📦 Dependencies:`, Object.keys(pkg.dependencies || {}));
  } catch (error) {
    console.log(`   ❌ Error reading package.json: ${error.message}`);
  }
} else {
  console.log(`   ❌ Functions package.json missing`);
}

// 3. Check netlify.toml
console.log('\n3. Netlify Configuration:');
const toml = fs.readFileSync('netlify.toml', 'utf8');
const hasFunctionsDir = toml.includes('directory = "netlify/functions"');
const hasBuildCommand = toml.includes('command = "');

console.log(`   ✅ netlify.toml exists`);
console.log(`   📁 Functions directory configured: ${hasFunctionsDir}`);
console.log(`   🔨 Build command configured: ${hasBuildCommand}`);

// 4. Check functions-serve structure
console.log('\n4. Local Function Structure:');
const serveDir = '.netlify/functions-serve';
if (fs.existsSync(serveDir)) {
  const serveItems = fs.readdirSync(serveDir);
  console.log('   📁 functions-serve contents:', serveItems);
  
  serveItems.forEach(item => {
    const itemPath = path.join(serveDir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      const jsFiles = fs.readdirSync(itemPath).filter(f => f.endsWith('.js'));
      console.log(`   ${item}/: ${jsFiles.length} JS files`);
    }
  });
}

console.log('\n🎯 DEPLOYMENT STATUS:');
console.log('The functions are being detected locally but may not deploy correctly.');
console.log('The issue is likely with the function file format or dependencies.');

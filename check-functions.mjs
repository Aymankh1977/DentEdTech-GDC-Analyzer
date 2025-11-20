import fs from 'fs';
import path from 'path';

console.log('🔍 Checking Netlify function setup...\n');

// Check if functions directory exists
const functionsDir = 'netlify/functions';
if (fs.existsSync(functionsDir)) {
  console.log('✅ Functions directory exists');
  const files = fs.readdirSync(functionsDir);
  console.log('📄 Function files:', files);
  
  files.forEach(file => {
    const filePath = path.join(functionsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   ${file}: ${stats.size} bytes`);
  });
} else {
  console.log('❌ Functions directory missing');
}

// Check netlify.toml
if (fs.existsSync('netlify.toml')) {
  console.log('\n✅ netlify.toml exists');
  const toml = fs.readFileSync('netlify.toml', 'utf8');
  if (toml.includes('directory = "netlify/functions"')) {
    console.log('✅ Functions directory configured in netlify.toml');
  } else {
    console.log('❌ Functions directory not configured in netlify.toml');
  }
}

// Check what's in functions-serve
console.log('\n🔧 Checking functions-serve (local development):');
const serveDir = '.netlify/functions-serve';
if (fs.existsSync(serveDir)) {
  const serveItems = fs.readdirSync(serveDir);
  console.log('📁 functions-serve contents:', serveItems);
  
  serveItems.forEach(item => {
    const itemPath = path.join(serveDir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      const subItems = fs.readdirSync(itemPath);
      console.log(`   ${item}/:`, subItems);
    }
  });
}

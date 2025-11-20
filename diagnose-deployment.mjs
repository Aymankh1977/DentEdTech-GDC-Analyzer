import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

console.log('🔍 COMPREHENSIVE DEPLOYMENT DIAGNOSIS\n');

// Check local structure
console.log('1. LOCAL STRUCTURE:');
console.log('   Functions directory:', fs.existsSync('functions') ? 'EXISTS' : 'MISSING');
if (fs.existsSync('functions')) {
  const funcFiles = fs.readdirSync('functions');
  console.log('   Function files:', funcFiles);
}

console.log('   netlify.toml:', fs.existsSync('netlify.toml') ? 'EXISTS' : 'MISSING');
if (fs.existsSync('netlify.toml')) {
  const toml = fs.readFileSync('netlify.toml', 'utf8');
  console.log('   Functions config:', toml.includes('functions') ? 'PRESENT' : 'MISSING');
}

// Check git status
console.log('\n2. GIT STATUS:');
try {
  const { stdout: gitStatus } = await execAsync('git status --porcelain');
  console.log('   Changes:', gitStatus ? gitStatus.split('\n').filter(l => l).join(', ') : 'None');
  
  const { stdout: gitFiles } = await execAsync('git ls-files | grep functions');
  console.log('   Tracked function files:', gitFiles ? gitFiles.split('\n').filter(l => l).join(', ') : 'None');
} catch (error) {
  console.log('   Git check failed:', error.message);
}

// Test build
console.log('\n3. BUILD TEST:');
try {
  const { stdout: buildOutput } = await execAsync('npm run build', { timeout: 30000 });
  console.log('   Build: SUCCESS');
  
  // Check if dist directory created
  console.log('   dist directory:', fs.existsSync('dist') ? 'CREATED' : 'MISSING');
  if (fs.existsSync('dist')) {
    const distFiles = fs.readdirSync('dist');
    console.log('   dist contents:', distFiles.join(', '));
  }
} catch (error) {
  console.log('   Build: FAILED -', error.message);
}

console.log('\n🎯 DIAGNOSIS COMPLETE');
console.log('\n🚀 NEXT STEPS:');
console.log('1. Check Netlify dashboard build logs');
console.log('2. Ensure functions directory is tracked by git');
console.log('3. Verify netlify.toml is correct');
console.log('4. Check if build is creating dist directory');

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🔍 VERIFYING API KEY CONFIGURATION...\n');

try {
  const { stdout } = await execAsync('curl -s "https://gdc-dental-analyzer.netlify.app/.netlify/functions/health-check"');
  const data = JSON.parse(stdout);
  
  console.log('📊 CURRENT STATUS:');
  console.log('  Overall Status:', data.status);
  console.log('  Anthropic Status:', data.anthropic?.status);
  console.log('  Has API Key:', data.anthropic?.hasKey);
  console.log('  Key Format:', data.anthropic?.keyFormat);
  console.log('  Key Preview:', data.anthropic?.keyPreview);
  
  if (data.anthropic?.status === 'configured' && data.anthropic?.keyFormat === 'correct') {
    console.log('\n🎉 SUCCESS! API key is properly configured!');
    console.log('🚀 Real AI analysis is now ACTIVE!');
  } else {
    console.log('\n❌ API KEY NOT CONFIGURED');
    console.log('\n🚀 ACTION REQUIRED:');
    console.log('1. Get API key from: https://console.anthropic.com/');
    console.log('2. Add to Netlify: Site settings → Environment variables');
    console.log('3. Redeploy site');
    console.log('4. Run this verification again');
  }
  
} catch (error) {
  console.log('❌ Error:', error.message);
}

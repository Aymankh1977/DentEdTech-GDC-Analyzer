const { exec } = require('child_process');

console.log('🔍 Running TypeScript check...');
exec('npx tsc --noEmit --skipLibCheck', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ TypeScript errors found:');
    console.log(stderr);
  } else {
    console.log('✅ No TypeScript errors found!');
  }
});

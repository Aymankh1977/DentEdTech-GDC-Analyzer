import { COMPREHENSIVE_GDC_REQUIREMENTS } from './data/comprehensiveGDCRequirements';

console.log('📊 Total GDC Requirements:', COMPREHENSIVE_GDC_REQUIREMENTS.length);
console.log('🔍 First 5 requirements:');
COMPREHENSIVE_GDC_REQUIREMENTS.slice(0, 5).forEach(req => {
  console.log(`  - ${req.code}: ${req.title}`);
});

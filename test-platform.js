// Test that our modules can be imported without type errors
console.log('🧪 Testing platform modules...');

async function testModules() {
  try {
    // Test comprehensive requirements
    const { COMPREHENSIVE_GDC_REQUIREMENTS } = await import('./src/data/comprehensiveGDCRequirements.js');
    console.log('✅ Comprehensive requirements loaded:', COMPREHENSIVE_GDC_REQUIREMENTS.length);
    
    // Test performance AI service
    const { PerformanceAIService } = await import('./src/services/performanceAIService.js');
    console.log('✅ Performance AI service loaded');
    
    // Test gold standard service  
    const { GoldStandardService } = await import('./src/services/goldStandardService.ts');
    console.log('✅ Gold standard service loaded');
    
    console.log('🎉 All modules loaded successfully! Platform should work now.');
    
  } catch (error) {
    console.error('❌ Module loading failed:', error.message);
  }
}

testModules();

const { PerformanceAIService } = require('./src/services/performanceAIService.ts');

// Test score calculation with various inputs
const testCases = [
  { status: 'met', confidence: 85, expected: 'high' },
  { status: 'partially-met', confidence: 75, expected: 'medium' },
  { status: 'not-met', confidence: 65, expected: 'low' },
  { status: undefined, confidence: 50, expected: 'fallback' },
  { status: 'met', confidence: NaN, expected: 'fallback' },
  { status: 'invalid', confidence: 80, expected: 'fallback' }
];

console.log('🧪 TESTING SCORE CALCULATION...\n');

testCases.forEach((testCase, index) => {
  const mockAnalysis = {
    status: testCase.status,
    confidence: testCase.confidence,
    requirement: { category: 'important' }
  };

  try {
    const score = PerformanceAIService.calculateRequirementScore(mockAnalysis);
    console.log(`Test ${index + 1}:`, {
      input: testCase,
      score: score,
      valid: !isNaN(score) && score >= 20 && score <= 100,
      status: !isNaN(score) && score >= 20 && score <= 100 ? '✅ PASS' : '❌ FAIL'
    });
  } catch (error) {
    console.log(`Test ${index + 1}:`, {
      input: testCase,
      error: error.message,
      status: '❌ ERROR'
    });
  }
});

console.log('\n📊 SCORE VALIDATION COMPLETE');

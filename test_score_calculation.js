// Simple test for score calculation
function calculateRequirementScore(analysis) {
    if (!analysis?.status) return 50;

    const baseScores = { 
        'met': 85, 
        'partially-met': 65, 
        'not-met': 35 
    };
    
    const baseScore = baseScores[analysis.status] || 50;
    const confidence = analysis.confidence && !isNaN(analysis.confidence) ? analysis.confidence : 75;
    
    const confidenceBonus = (confidence - 50) / 50 * 15;
    const finalScore = Math.min(95, Math.max(25, baseScore + confidenceBonus));
    
    return Math.round(finalScore);
}

// Test cases
const testCases = [
    { status: 'met', confidence: 85, description: 'Normal case - met' },
    { status: 'partially-met', confidence: 75, description: 'Normal case - partially-met' },
    { status: 'not-met', confidence: 65, description: 'Normal case - not-met' },
    { status: undefined, confidence: 50, description: 'Missing status' },
    { status: 'met', confidence: NaN, description: 'NaN confidence' },
    { status: 'invalid', confidence: 80, description: 'Invalid status' },
    { status: 'partially-met', confidence: 80, description: 'Your failing case' }
];

console.log('🧪 TESTING SCORE CALCULATION\n');

testCases.forEach((test, i) => {
    const score = calculateRequirementScore(test);
    const isValid = !isNaN(score) && score >= 20 && score <= 100;
    
    console.log(`Test ${i + 1}: ${test.description}`);
    console.log(`  Input: status="${test.status}", confidence=${test.confidence}`);
    console.log(`  Output: score=${score}, valid=${isValid}`);
    console.log(`  Result: ${isValid ? '✅ PASS' : '❌ FAIL'}\n`);
});

console.log('📊 All tests completed!');

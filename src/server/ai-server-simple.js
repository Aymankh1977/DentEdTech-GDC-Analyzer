const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'AI Server Running', 
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'DentEdTech AI Server is running!',
    endpoints: ['/health', '/api/analyze-gdc']
  });
});

app.post('/api/analyze-gdc', (req, res) => {
  try {
    const { requirement, fileContent, fileName } = req.body;
    
    console.log(`📥 Received analysis request for: ${requirement.code}`);
    
    // Generate realistic AI-like response without actual AI
    const response = generateRealisticResponse(requirement, fileName);
    
    res.json({
      success: true,
      response: response,
      simulated: true
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
});

function generateRealisticResponse(requirement, fileName) {
  const statusOptions = ['met', 'partially-met', 'not-met'];
  const weights = requirement.category === 'critical' ? [0.2, 0.5, 0.3] : [0.4, 0.4, 0.2];
  
  const random = Math.random();
  let statusIndex = 0;
  let cumulativeWeight = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulativeWeight += weights[i];
    if (random <= cumulativeWeight) {
      statusIndex = i;
      break;
    }
  }
  
  const status = statusOptions[statusIndex];
  
  const evidenceTemplates = {
    'met': [
      `Comprehensive ${requirement.title.toLowerCase()} framework documented in ${fileName}`,
      `Systematic implementation with quality assurance processes`,
      `Regular monitoring and review cycles established`
    ],
    'partially-met': [
      `Basic ${requirement.title.toLowerCase()} framework in ${fileName}`,
      `Partial implementation with ongoing development`,
      `Limited monitoring systems with improvement opportunities`
    ],
    'not-met': [
      `Limited evidence of ${requirement.title.toLowerCase()} in ${fileName}`,
      `Significant gaps in implementation framework`,
      `Development plan required for GDC compliance`
    ]
  };

  const recommendationTemplates = {
    'met': [
      `Maintain excellence in ${requirement.title.toLowerCase()}`,
      `Share best practices across institution`,
      `Continue enhancement cycles`
    ],
    'partially-met': [
      `Develop comprehensive implementation plan`,
      `Enhance documentation and evidence collection`,
      `Implement systematic monitoring framework`
    ],
    'not-met': [
      `Urgent development of implementation strategy`,
      `Establish baseline compliance documentation`,
      `Allocate dedicated resources for improvement`
    ]
  };

  const evidence = evidenceTemplates[status].slice(0, 2 + Math.floor(Math.random() * 2));
  const recommendations = recommendationTemplates[status].slice(0, 2 + Math.floor(Math.random() * 1));
  const confidence = 75 + Math.floor(Math.random() * 20);

  return `STATUS: ${status}
EVIDENCE: ${evidence.join('|')}
MISSING_ELEMENTS: Enhanced documentation|Systematic monitoring
RECOMMENDATIONS: ${recommendations.join('|')}
CONFIDENCE: ${confidence}%`;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Server running on http://localhost:${PORT}`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Ready to analyze GDC requirements!`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down AI server gracefully...');
  process.exit(0);
});

import express from 'express';
import cors from 'cors';
import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.AI_SERVER_PORT || 3003;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'AI Server Running', 
    port: PORT,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    status: 'DentEdTech AI Server',
    endpoints: {
      health: '/health',
      analyze: '/api/analyze-gdc'
    }
  });
});

app.post('/api/analyze-gdc', async (req, res) => {
  try {
    console.log('🚀 AI Analysis Request Received');
    const { requirement, fileContent, fileName } = req.body;
    
    if (!requirement || !fileContent) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: requirement and fileContent'
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.log('❌ No API key found, using enhanced simulation');
      return res.json({
        success: true,
        response: this.generateEnhancedSimulation(requirement, fileName),
        simulated: true
      });
    }

    const anthropic = new Anthropic({ apiKey });

    const prompt = this.createAnalysisPrompt(requirement, fileContent, fileName);

    console.log(`📤 Calling Claude API for requirement: ${requirement.code}`);
    
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      temperature: 0.1,
      messages: [{ role: "user", content: prompt }]
    });

    const aiResponse = message.content[0].text;
    console.log(`✅ AI Analysis successful for ${requirement.code}`);

    res.json({
      success: true,
      response: aiResponse,
      simulated: false
    });

  } catch (error) {
    console.error('💥 AI Analysis error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      fallback: this.generateEnhancedSimulation(req.body.requirement, req.body.fileName)
    });
  }
});

// Enhanced prompt creation
function createAnalysisPrompt(requirement, fileContent, fileName) {
  return `ACT as a Senior GDC Dental Education Quality Assurance Expert.

CRITICAL: You MUST respond in EXACT format below - no additional text or explanations:

STATUS: [met/partially-met/not-met]
EVIDENCE: [evidence1|evidence2|evidence3]
MISSING_ELEMENTS: [missing1|missing2]
RECOMMENDATIONS: [recommendation1|recommendation2|recommendation3]
CONFIDENCE: [75-95]%

GDC REQUIREMENT TO ANALYZE:
- Code: ${requirement.code}
- Title: ${requirement.title}
- Domain: ${requirement.domain}
- Description: ${requirement.description}
- Criteria: ${requirement.criteria.join(', ')}

DOCUMENT BEING ANALYZED:
- File: ${fileName}
- Content Sample: ${fileContent.substring(0, 3500)}

ANALYSIS INSTRUCTIONS:
1. Analyze the document content against the requirement criteria
2. Look for specific evidence of implementation
3. Identify concrete missing elements
4. Provide actionable recommendations
5. Assess real compliance status based on actual evidence

Be specific, evidence-based, and practical in your analysis.`;
}

// Enhanced simulation for when AI is not available
function generateEnhancedSimulation(requirement, fileName) {
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
      `Comprehensive ${requirement.title.toLowerCase()} framework documented`,
      `Systematic implementation with quality assurance`,
      `Regular monitoring and review processes established`
    ],
    'partially-met': [
      `Basic ${requirement.title.toLowerCase()} framework in place`,
      `Partial implementation with some gaps`,
      `Limited monitoring systems established`
    ],
    'not-met': [
      `Limited evidence of ${requirement.title.toLowerCase()} implementation`,
      `Significant gaps in documentation and processes`,
      `Development plan required for compliance`
    ]
  };

  return `STATUS: ${status}
EVIDENCE: ${evidenceTemplates[status].join('|')}
MISSING_ELEMENTS: Enhanced documentation|Systematic monitoring|Stakeholder engagement
RECOMMENDATIONS: Develop comprehensive framework|Establish quality assurance|Enhance evidence collection
CONFIDENCE: ${75 + Math.floor(Math.random() * 20)}%`;
}

app.listen(PORT, () => {
  console.log(`🚀 Enhanced AI Server running on http://localhost:${PORT}`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health`);
});

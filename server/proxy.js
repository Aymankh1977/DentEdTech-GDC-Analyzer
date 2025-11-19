const express = require('express');
const cors = require('cors');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

// Claude proxy endpoint
app.post('/api/claude-proxy', async (req, res) => {
  console.log('🔧 Claude Proxy Called');
  
  try {
    const { requirement, fileContent, fileName } = req.body;
    
    console.log(`📊 Analyzing: ${requirement?.code} for: ${fileName}`);
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('🤖 No API key - using simulated response');
      return res.json({
        response: generateSimulatedResponse(requirement, fileName),
        simulated: true
      });
    }

    console.log('🔑 API Key found, calling Claude...');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = createAnalysisPrompt(requirement, fileContent, fileName);

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.2,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    console.log('✅ Claude response received');
    
    res.json({
      response: response.content[0].text,
      simulated: false
    });
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      error: 'Analysis failed: ' + error.message,
      simulated: true,
      response: generateSimulatedResponse({ code: 'Unknown' }, 'Unknown')
    });
  }
});

function createAnalysisPrompt(requirement, fileContent, fileName) {
  return `You are a dental education compliance expert analyzing documents against GDC standards.

CRITICAL: You MUST respond in EXACTLY this format - no additional text:

STATUS: [met/partially-met/not-met/not-found]
EVIDENCE: [evidence1|evidence2|evidence3]
MISSING_ELEMENTS: [missing1|missing2|missing3]
RECOMMENDATIONS: [recommendation1|recommendation2|recommendation3]
CONFIDENCE: [50-100]%

REQUIREMENT ANALYSIS:
- Code: ${requirement.code}
- Title: ${requirement.title}  
- Description: ${requirement.description}
- Criteria: ${requirement.criteria.join('; ')}

DOCUMENT CONTEXT:
- File: ${fileName}
- Content Sample: ${fileContent.substring(0, 3000)}

Analyze the document content against the requirement criteria. Be specific about what evidence you found or what's missing.`;
}

function generateSimulatedResponse(requirement, fileName) {
  const statuses = ['met', 'partially-met', 'not-met'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return `STATUS: ${status}
EVIDENCE: Document analysis completed for ${fileName} | Requirement ${requirement.code} reviewed | Simulated evidence generation
MISSING_ELEMENTS: Further documentation review recommended | Additional evidence collection needed
RECOMMENDATIONS: Conduct comprehensive document review | Gather additional supporting evidence | Consult with programme team
CONFIDENCE: 75%`;
}

app.listen(PORT, () => {
  console.log(`🚀 Express Proxy Server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/claude-proxy`);
  console.log(`🔑 API Key: ${process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing'}`);
});

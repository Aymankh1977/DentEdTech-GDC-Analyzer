#!/bin/bash

echo "🔧 Setting up Netlify functions for DentEdTech GDC Analyzer..."

# Create directories
echo "📁 Creating directory structure..."
mkdir -p netlify/functions

# Create the function file
echo "📝 Creating Claude proxy function..."
cat > netlify/functions/claude-proxy.js << 'FUNC_EOF'
const { Anthropic } = require('@anthropic-ai/sdk');

exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { requirement, fileContent, fileName } = JSON.parse(event.body);
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          response: generateSimulatedResponse(requirement, fileName),
          simulated: true
        })
      };
    }

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

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        response: response.content[0].text,
        simulated: false
      })
    };
  } catch (error) {
    console.error('Claude proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Analysis failed',
        simulated: true,
        response: generateSimulatedResponse({ code: 'Unknown' }, 'Unknown')
      })
    };
  }
};

function createAnalysisPrompt(requirement, fileContent, fileName) {
  return \`You are a dental education compliance expert analyzing documents against GDC standards.

REQUIREMENT: \${requirement.code} - \${requirement.title}
DESCRIPTION: \${requirement.description}
CRITERIA: \${requirement.criteria.join(', ')}

DOCUMENT: \${fileName}
CONTENT EXCERPT: \${fileContent.substring(0, 4000)}

Analyze this document against the requirement and provide structured output:

STATUS: [met/partially-met/not-met/not-found]
EVIDENCE: [list evidence found separated by |]
MISSING_ELEMENTS: [list missing elements separated by |]
RECOMMENDATIONS: [list recommendations separated by |]
CONFIDENCE: [confidence percentage 0-100]%
SUMMARY: [brief summary of compliance status]

Focus on finding concrete evidence in the document that demonstrates compliance with each criterion.\`;
}

function generateSimulatedResponse(requirement, fileName) {
  const statuses = ['met', 'partially-met', 'not-met'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return \`STATUS: \${status}
EVIDENCE: Document analysis completed for \${fileName} | Requirement \${requirement.code} reviewed | Simulated evidence generation
MISSING_ELEMENTS: Further documentation review recommended | Additional evidence collection needed
RECOMMENDATIONS: Conduct comprehensive document review | Gather additional supporting evidence | Consult with programme team
CONFIDENCE: 75%
SUMMARY: Simulated analysis completed for \${requirement.code}. Real AI analysis requires ANTHROPIC_API_KEY environment variable.\`;
}
FUNC_EOF

# Create netlify.toml
echo "⚙️ Creating Netlify configuration..."
cat > netlify.toml << 'CONFIG_EOF'
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/.netlify/functions/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/.netlify/functions/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Headers = "Content-Type"
CONFIG_EOF

# Create .env template
echo "🔐 Creating environment template..."
cat > .env.example << 'ENV_EOF'
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ENV_EOF

echo "✅ Netlify setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your Anthropic API key from https://console.anthropic.com/"
echo "2. Run: cp .env.example .env"
echo "3. Add your API key to .env file"
echo "4. Test locally: netlify dev"
echo "5. Deploy: netlify deploy --prod"

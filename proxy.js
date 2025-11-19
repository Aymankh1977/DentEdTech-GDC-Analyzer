import express from 'express';
import cors from 'cors';
import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from current directory
console.log('📁 Loading .env from:', resolve(__dirname, '.env'));
dotenv.config({ path: resolve(__dirname, '.env') });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Debug endpoint to check environment
app.get('/debug', (req, res) => {
  res.json({
    service: 'DentEdTech AI Proxy',
    status: 'running',
    env: {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 
        `✅ Set (${process.env.ANTHROPIC_API_KEY.substring(0, 12)}...)` : 
        '❌ Not set',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    },
    directory: __dirname
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: process.env.ANTHROPIC_API_KEY ? 'READY' : 'MISSING_API_KEY',
    message: process.env.ANTHROPIC_API_KEY ? 'API key configured' : 'No API key found',
    model: 'claude-3-haiku-20240307'
  });
});

// BULLETPROOF Claude endpoint
app.post('/api/claude', async (req, res) => {
  console.log('🎯 REAL AI Claude Endpoint Called');
  
  try {
    const { prompt, model = 'claude-3-haiku-20240307', max_tokens = 4000 } = req.body;
    
    console.log(`🤖 Model: ${model}`);
    console.log(`📝 Prompt length: ${prompt.length} chars`);
    
    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    console.log('🔑 API Key check:', apiKey ? `✅ Found (${apiKey.substring(0, 12)}...)` : '❌ Missing');
    
    if (!apiKey) {
      console.log('❌ CRITICAL: No ANTHROPIC_API_KEY in environment');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'ANTHROPIC_API_KEY not found in server environment. Please check your .env file.',
        solution: 'Add ANTHROPIC_API_KEY=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 to .env file and restart server'
      });
    }

    // Validate API key format
    if (!apiKey.startsWith('sk-ant-')) {
      console.log('❌ INVALID API KEY FORMAT');
      return res.status(500).json({
        error: 'Invalid API key format',
        message: 'API key should start with "sk-ant-"',
        solution: 'Check your API key in the .env file'
      });
    }

    console.log('🚀 Initializing Anthropic client...');
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    console.log('📡 Making REAL AI API call to Claude...');
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: max_tokens,
      temperature: 0.1,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    console.log('✅ REAL AI: Success! Response received');
    console.log(`📄 Response length: ${response.content[0].text.length} chars`);
    
    res.json(response);
    
  } catch (error) {
    console.error('💥 REAL AI Error:', error);
    
    // Detailed error handling
    if (error.status === 401) {
      res.status(401).json({ 
        error: 'API Authentication Failed',
        message: 'The Anthropic API rejected your API key',
        details: 'Please check that your API key is correct and active',
        status: 401
      });
    } else if (error.status === 429) {
      res.status(429).json({ 
        error: 'Rate Limit Exceeded',
        message: 'You have exceeded your API rate limit',
        details: 'Please try again in a few moments',
        status: 429
      });
    } else if (error.status === 400) {
      res.status(400).json({ 
        error: 'Bad Request',
        message: 'Invalid request to Claude API',
        details: error.message,
        status: 400
      });
    } else {
      res.status(500).json({ 
        error: 'AI Service Error',
        message: 'Failed to call Claude API',
        details: error.message,
        status: error.status || 500
      });
    }
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'DentEdTech AI Proxy Server',
    status: 'running',
    endpoints: {
      'GET /health': 'Server health check',
      'GET /debug': 'Debug environment info', 
      'POST /api/claude': 'Claude AI analysis'
    },
    model: 'claude-3-haiku-20240307',
    apiKeyConfigured: !!process.env.ANTHROPIC_API_KEY
  });
});

// FIXED: Proper 404 handler for all unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requested: req.method + ' ' + req.url,
    availableEndpoints: {
      'GET /': 'This info page',
      'GET /health': 'Server health check',
      'GET /debug': 'Debug environment info',
      'POST /api/claude': 'Claude AI analysis'
    }
  });
});

app.listen(PORT, () => {
  console.log('🚀 BULLETPROOF AI Proxy Server Started!');
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 Debug: http://localhost:${PORT}/debug`);
  console.log(`🔗 AI: http://localhost:${PORT}/api/claude`);
  console.log(`🔗 Info: http://localhost:${PORT}/`);
  console.log(`🤖 Model: claude-3-haiku-20240307`);
  
  // Check API key status
  if (process.env.ANTHROPIC_API_KEY) {
    console.log(`🔑 API Key: ✅ CONFIGURED (${process.env.ANTHROPIC_API_KEY.substring(0, 12)}...)`);
    console.log('🎉 READY FOR 100% AI ANALYSIS!');
  } else {
    console.log('🔑 API Key: ❌ MISSING - Add ANTHROPIC_API_KEY to .env file!');
  }
});

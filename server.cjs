const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Claude API proxy endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { prompt, model = 'claude-3-5-sonnet-20241022', max_tokens = 4000 } = req.body;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ error: 'No API key provided' });
    }

    console.log('🔗 Proxying Claude API request...');
    console.log('🤖 Model:', model);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error('❌ Claude proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Claude API Proxy',
    available_models: [
      'claude-3-5-sonnet-20241022',
      'claude-3-haiku-20240307',
      'claude-3-opus-20240229'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`🔗 Claude proxy available at /api/claude`);
  console.log(`🤖 Supported models: sonnet-3.5, haiku, opus`);
});

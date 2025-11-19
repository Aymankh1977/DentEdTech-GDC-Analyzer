#!/bin/bash

echo "🚀 SETTING UP REAL AI ANALYSIS"
echo "================================"

# Check if .env exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << 'ENV_EOF'
# Add your Anthropic API key here for real AI analysis
# Get it from: https://console.anthropic.com/
ANTHROPIC_API_KEY=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 

# For Netlify deployment, set this in environment variables
ENV_EOF
  echo "✅ Created .env file"
else
  echo "📁 .env file already exists"
fi

echo ""
echo "📋 NEXT STEPS:"
echo "1. Get your API key from: https://console.anthropic.com/"
echo "2. Edit .env file and replace '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 ' with your real key"
echo "3. Restart the development server: npm run dev"
echo "4. The platform will use REAL Claude AI for analysis"
echo ""
echo "🔐 Your API key is stored locally and never sent to our servers"

#!/bin/bash
echo "🚀 DentEdTech GDC Analyzer Setup"
echo "=================================="

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << ENVFILE
# DentEdTech GDC Analyzer Environment Variables
# Add your Anthropic API key here for SUPER AI features
# ANTHROPIC_API_KEY=your_api_key_here

# Netlify Functions Configuration
NODE_VERSION=20.19.0
ENVFILE
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "Setup complete! Next steps:"
echo "1. Add your Anthropic API key to .env for SUPER AI features"
echo "2. Run 'npm install' to install dependencies"
echo "3. Run 'npm run build' to build the project"
echo "4. Run 'npx netlify deploy --prod' to deploy"

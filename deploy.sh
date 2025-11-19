#!/bin/bash

echo "🚀 Deploying DentEdTech GDC Analyzer to Netlify..."

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=dist

echo "✅ Deployment complete!"

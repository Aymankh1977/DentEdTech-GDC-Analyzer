#!/bin/bash

echo "🚀 Starting DentEdTech SUPER Platform..."
echo "==========================================="

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Starting services..."
echo "💡 Make sure you have an Anthropic API key set in the platform"

# Try ES modules first, fallback to CommonJS
if [ -f "server.js" ]; then
    echo "🖥️  Starting API Server with ES Modules (port 3001)..."
    node server.js &
    API_PID=$!
elif [ -f "server.cjs" ]; then
    echo "🖥️  Starting API Server with CommonJS (port 3001)..."
    node server.cjs &
    API_PID=$!
else
    echo "❌ No server file found!"
    exit 1
fi

# Wait a moment for API server to start
sleep 3

# Start the frontend
echo "🌐 Starting Frontend (port 5173)..."
npm run dev

# When frontend stops, also stop the API server
kill $API_PID 2>/dev/null

echo "✅ Platform stopped"

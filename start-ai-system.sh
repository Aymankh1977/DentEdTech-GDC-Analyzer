#!/bin/bash
echo "🚀 Starting DentEdTech AI System..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Wrong directory! Please run this from DentEdTech-GDC-Analyzer folder"
    exit 1
fi

# Start AI Server in background
echo "🔧 Starting AI Server on port 3002..."
node ai-server.js &
AI_PID=$!

# Wait a moment for AI server to start
sleep 3

# Start Frontend
echo "🌐 Starting Frontend on port 5173..."
npm run dev

# Cleanup when done
kill $AI_PID

#!/bin/bash

echo "🚀 STARTING DENTEDTECH GDC ANALYZER PLATFORM"

# Kill any existing processes on port 3003
echo "1. Cleaning up existing processes..."
pkill -f "node.*3003" || true
sleep 2

# Start the AI server
echo "2. Starting AI server on port 3003..."
node src/server/ai-server-simple.js &
SERVER_PID=$!
sleep 3

# Check if server started successfully
if curl -s http://localhost:3003/health > /dev/null; then
    echo "✅ AI Server started successfully (PID: $SERVER_PID)"
else
    echo "❌ AI Server failed to start"
    echo "🤖 Analysis will continue in simulation mode"
fi

# Start the main application
echo "3. Starting main application..."
echo "📋 Next: Run 'npm run dev' in another terminal window"
echo ""
echo "🔗 AI Server: http://localhost:3003"
echo "🌐 Main App: http://localhost:5173"
echo ""
echo "💡 Tips:"
echo "   - Keep this terminal open for the AI server"
echo "   - Open another terminal for 'npm run dev'"
echo "   - Analysis will work in both online and offline modes"

# Wait for user to stop
echo ""
echo "Press Ctrl+C to stop the AI server"
wait $SERVER_PID

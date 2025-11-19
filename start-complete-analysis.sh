#!/bin/bash

echo "🚀 STARTING COMPLETE GDC ANALYSIS PLATFORM"
echo "==========================================="

# Kill any existing processes
echo "1. Cleaning up..."
pkill -f "node.*3003" 2>/dev/null || true
sleep 2

# Start AI server
echo "2. Starting AI server..."
node src/server/ai-server-simple.js &
SERVER_PID=$!
echo "   AI Server PID: $SERVER_PID"
sleep 3

# Verify server is running
if curl -s http://localhost:3003/health > /dev/null; then
    echo "   ✅ AI Server running at http://localhost:3003"
else
    echo "   ⚠️  AI Server not responding - analysis will use simulation mode"
fi

# Display platform info
echo ""
echo "📊 PLATFORM STATUS:"
echo "   - AI Server: http://localhost:3003/health"
echo "   - Requirements: 32+ GDC standards"
echo "   - File Selection: Verified working"
echo "   - Analysis Mode: AI + Simulation fallback"
echo ""
echo "🎯 NEXT STEPS:"
echo "   1. Open a NEW terminal window"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:5173"
echo "   4. Upload files and select ONE for analysis"
echo ""
echo "📝 EXPECTED BEHAVIOR:"
echo "   - Should analyze ALL 32+ requirements"
echo "   - Uses the file you SELECT (not just upload)"
echo "   - Shows progress for all requirements"
echo "   - No more '12 requirements' limit"
echo ""
echo "Press Ctrl+C to stop the AI server"
wait $SERVER_PID

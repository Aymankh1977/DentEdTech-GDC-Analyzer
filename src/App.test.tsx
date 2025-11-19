import React from 'react';

function TestApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">🚀</h1>
        <h2 className="text-4xl font-bold mb-4">DentEdTech GDC Analyzer</h2>
        <p className="text-xl">If you see this, React is working!</p>
        <div className="mt-6 bg-white/20 p-4 rounded-lg">
          <p>✅ React is loading</p>
          <p>✅ Tailwind CSS is working</p>
          <p>✅ Basic setup is functional</p>
        </div>
      </div>
    </div>
  );
}

export default TestApp;

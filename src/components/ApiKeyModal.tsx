import React from 'react';

// Simple safe version - we can enhance later
const ApiKeyModal: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">API Key Configuration</h3>
        <p className="text-gray-600 mb-4">
          Enter your Anthropic API key to enable enhanced AI analysis.
        </p>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="sk-ant-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;

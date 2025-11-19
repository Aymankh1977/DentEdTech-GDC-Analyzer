import React, { useState } from 'react';
import { LocalClaudeService } from '../services/localClaudeService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySet: (hasKey: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsTesting(true);
    
    try {
      LocalClaudeService.setApiKey(apiKey.trim());
      const isValid = await LocalClaudeService.testConnection();
      
      if (isValid) {
        alert('✅ API Key validated! Real AI analysis enabled.');
        onApiKeySet(true);
        onClose();
        setApiKey('');
      } else {
        alert('❌ Invalid API key. Please check and try again.');
        LocalClaudeService.setApiKey(''); // Clear invalid key
      }
    } catch (error) {
      alert('❌ Error testing API key. Please try again.');
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Enable Real AI Analysis</h2>
          <p className="text-purple-100 mt-2">Add your Anthropic API key to use Claude AI</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anthropic API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Get your key from: https://console.anthropic.com/
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                🔒 Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isTesting || !apiKey.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              {isTesting ? 'Testing...' : 'Enable AI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Save, Check, AlertCircle, Key, Trash2 } from 'lucide-react';
import { saveGitHubToken, hasGitHubToken, clearGitHubToken } from '../services/githubService';
import { useData } from '../context/DataContext';

function SettingsPage() {
  const [token, setToken] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { manualSave } = useData();

  const handleSaveToken = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!token.trim()) {
      setError('Please enter a GitHub token');
      return;
    }

    try {
      saveGitHubToken(token);
      setSuccess(true);
      setToken('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save token');
    }
  };

  const handleClearToken = () => {
    if (window.confirm('Are you sure you want to remove the GitHub token? Auto-save will be disabled.')) {
      clearGitHubToken();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleManualSave = async () => {
    setError('');
    setSuccess(false);

    const result = await manualSave();
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed to save');
    }
  };

  const tokenConfigured = hasGitHubToken();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure GitHub integration and system settings</p>
      </div>

      {/* GitHub Token Configuration */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Key className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">GitHub Token</h2>
            <p className="text-sm text-gray-600">Required for auto-save functionality</p>
          </div>
        </div>

        {tokenConfigured ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">GitHub token is configured</span>
              </div>
              <p className="text-sm text-green-600 mt-2">
                Auto-save is enabled. Changes will be automatically saved to GitHub.
              </p>
            </div>

            <button
              onClick={handleClearToken}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
              Remove Token
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <span className="text-yellow-700 font-medium block">GitHub token not configured</span>
                  <p className="text-sm text-yellow-600 mt-1">
                    Auto-save is disabled. Please enter your GitHub Personal Access Token to enable auto-save.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveToken} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Personal Access Token
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Create a token at GitHub Settings → Developer settings → Personal access tokens
                </p>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition"
              >
                <Save className="w-4 h-4" />
                Save Token
              </button>
            </form>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Settings saved successfully!
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Manual Save */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Manual Save</h2>
        <p className="text-sm text-gray-600 mb-4">
          Manually trigger a save to GitHub. This is useful if auto-save is disabled or you want to ensure your changes are saved.
        </p>
        <button
          onClick={handleManualSave}
          disabled={!tokenConfigured}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Save to GitHub Now
        </button>
        {!tokenConfigured && (
          <p className="text-xs text-red-600 mt-2">GitHub token must be configured to save</p>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="text-md font-semibold text-blue-900 mb-3">How to create a GitHub Personal Access Token:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Go to GitHub.com and log in</li>
          <li>Click your profile picture → Settings</li>
          <li>Scroll down and click "Developer settings"</li>
          <li>Click "Personal access tokens" → "Tokens (classic)"</li>
          <li>Click "Generate new token" → "Generate new token (classic)"</li>
          <li>Give it a name (e.g., "M2K Housing Dashboard")</li>
          <li>Select "repo" scope (full control of private repositories)</li>
          <li>Click "Generate token"</li>
          <li>Copy the token and paste it above</li>
        </ol>
        <p className="text-xs text-blue-700 mt-3">
          <strong>Important:</strong> Keep your token secure and never share it publicly!
        </p>
      </div>
    </div>
  );
}

export default SettingsPage;

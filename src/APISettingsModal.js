// API Settings Component - Per-Game Model Selection
// Allows users to configure which AI model to use for each game

import React, { useState, useEffect } from 'react';
import { 
  AI_PROVIDERS, 
  getApiKey, 
  setApiKey, 
  hasApiKey, 
  getGameModels, 
  setGameModel,
  testApiConnection,
  getImageCapableProviders
} from './ai-services';

// ============================================
// API SETTINGS MODAL
// ============================================

export const APISettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('keys');
  const [keys, setKeys] = useState({});
  const [testing, setTesting] = useState({});
  const [testResults, setTestResults] = useState({});
  const [gameModels, setGameModelsState] = useState(getGameModels());
  
  useEffect(() => {
    // Load current keys
    const loadedKeys = {};
    Object.keys(AI_PROVIDERS).forEach(id => {
      loadedKeys[id] = getApiKey(id) || '';
    });
    setKeys(loadedKeys);
  }, [isOpen]);
  
  const handleSaveKey = (providerId) => {
    setApiKey(keys[providerId]);
    localStorage.setItem(`ai_key_${providerId}`, keys[providerId]);
  };
  
  const handleTestConnection = async (providerId) => {
    setTesting(prev => ({ ...prev, [providerId]: true }));
    try {
      const result = await testApiConnection(providerId);
      setTestResults(prev => ({ ...prev, [providerId]: result ? 'success' : 'failed' }));
    } catch (e) {
      setTestResults(prev => ({ ...prev, [providerId]: 'error' }));
    }
    setTesting(prev => ({ ...prev, [providerId]: false }));
  };
  
  const handleGameModelChange = (game, type, provider) => {
    setGameModel(game, type, provider);
    setGameModelsState(getGameModels());
  };
  
  if (!isOpen) return null;
  
  const imageProviders = getImageCapableProviders();
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-400 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Settings</h2>
                <p className="text-slate-300 text-sm">Configure API keys and game models</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => setActiveTab('keys')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'keys' ? 'bg-white text-slate-800' : 'text-white/70 hover:text-white'
              }`}
            >
              🔑 API Keys
            </button>
            <button 
              onClick={() => setActiveTab('games')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'games' ? 'bg-white text-slate-800' : 'text-white/70 hover:text-white'
              }`}
            >
              🎮 Game Models
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-blue-800 mb-2">💡 What are API Keys?</h4>
                <p className="text-blue-700 text-sm">
                  API keys let ARTIFICIAL connect to AI services. Get them free from the provider websites below. 
                  Usage has small costs (~$0.01-0.10 per AI generation).
                </p>
              </div>
              
              {Object.entries(AI_PROVIDERS).map(([id, provider]) => (
                <div key={id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800">{provider.name}</h4>
                      <p className="text-slate-500 text-sm">{provider.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {provider.supportsImage && (
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                          🎨 Images
                        </span>
                      )}
                      {hasApiKey(id) && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          ✓ Configured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {provider.requiresKey && (
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder={provider.keyPlaceholder}
                        value={keys[id] || ''}
                        onChange={(e) => setKeys(prev => ({ ...prev, [id]: e.target.value }))}
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                      <button
                        onClick={() => handleSaveKey(id)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleTestConnection(id)}
                        disabled={!keys[id] || testing[id]}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {testing[id] ? '...' : 'Test'}
                      </button>
                    </div>
                  )}
                  
                  {testResults[id] && (
                    <div className={`mt-2 text-sm ${testResults[id] === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {testResults[id] === 'success' ? '✓ Connection successful!' : '✗ Connection failed'}
                    </div>
                  )}
                  
                  <a 
                    href={provider.keyLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 text-xs mt-2 inline-block"
                  >
                    Get API key →
                  </a>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'games' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-amber-800 mb-2">🎯 Game-Specific Models</h4>
                <p className="text-amber-700 text-sm">
                  Choose which AI provider to use for each game. Different models excel at different tasks.
                </p>
              </div>
              
              {/* Spot the Fake */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🔍</span>
                  <div>
                    <h4 className="font-bold text-slate-800">Spot the Fake</h4>
                    <p className="text-slate-500 text-sm">AI detection analysis</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Chat Model</label>
                    <select 
                      value={gameModels.spotTheFake?.chat || 'gemini'}
                      onChange={(e) => handleGameModelChange('spotTheFake', 'chat', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {Object.entries(AI_PROVIDERS).filter(([_, p]) => p.supportsChat).map(([id, p]) => (
                        <option key={id} value={id}>{p.name} - {p.chatModel}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Meme Machine */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🤖</span>
                  <div>
                    <h4 className="font-bold text-slate-800">Meme Machine</h4>
                    <p className="text-slate-500 text-sm">Image generation + text</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Chat Model</label>
                    <select 
                      value={gameModels.memeMachine?.chat || 'openai'}
                      onChange={(e) => handleGameModelChange('memeMachine', 'chat', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {Object.entries(AI_PROVIDERS).filter(([_, p]) => p.supportsChat).map(([id, p]) => (
                        <option key={id} value={id}>{p.name} - {p.chatModel}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Image Model</label>
                    <select 
                      value={gameModels.memeMachine?.image || 'openai'}
                      onChange={(e) => handleGameModelChange('memeMachine', 'image', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {imageProviders.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - {p.imageModel}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  💡 OpenAI DALL-E 3 recommended for best image quality
                </p>
              </div>
              
              {/* Vibe Code Challenge */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">💻</span>
                  <div>
                    <h4 className="font-bold text-slate-800">Vibe Code Challenge</h4>
                    <p className="text-slate-500 text-sm">Code generation + chat</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Chat/Code Model</label>
                    <select 
                      value={gameModels.vibeCode?.chat || 'anthropic'}
                      onChange={(e) => handleGameModelChange('vibeCode', 'chat', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {Object.entries(AI_PROVIDERS).filter(([_, p]) => p.supportsChat).map(([id, p]) => (
                        <option key={id} value={id}>{p.name} - {p.chatModel}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  💡 Claude (Anthropic) recommended for best code generation
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm">
              Settings are saved automatically to your browser.
            </p>
            <button
              onClick={onClose}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APISettingsModal;

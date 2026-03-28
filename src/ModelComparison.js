// MODEL COMPARISON - Bonus Mini-Game
// Generate the same prompt with different AI models side-by-side, vote on which is better
// Teaches about model differences, strengths, and limitations

import React, { useState, useEffect } from 'react';
import { Button, Alert } from './components';
import { chatCompletion, generateImage, hasApiKey, AI_PROVIDERS } from './ai-services';

// ============================================
// CONSTANTS
// ============================================

const MODEL_LABELS = ['Model A', 'Model B', 'Model C', 'Model D', 'Model E'];
const MODEL_COLORS = ['from-cyan-500 to-blue-500', 'from-purple-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-emerald-500 to-teal-500', 'from-rose-500 to-red-500'];

const COMPARISON_TYPES = [
  { id: 'code', name: 'Code Generation', icon: '💻', description: 'Compare how models build the same app', requiresChat: true },
  { id: 'image', name: 'Image Generation', icon: '🖼️', description: 'Compare AI image generation side-by-side', requiresImage: true },
  { id: 'meme', name: 'Meme Caption', icon: '🎭', description: 'Compare how models write captions', requiresChat: true },
  { id: 'story', name: 'Creative Writing', icon: '📖', description: 'Compare creative expression', requiresChat: true },
  { id: 'explain', name: 'AI Explanation', icon: '🧠', description: 'Compare how models explain concepts', requiresChat: true },
];

const EDUCATIONAL_INSIGHTS = {
  openai: { strength: 'Versatile and creative', personality: 'Tends to be detailed and structured', imageStyle: 'Photorealistic, follows prompts closely' },
  anthropic: { strength: 'Careful and nuanced', personality: 'Tends to be thorough and safety-conscious', imageStyle: 'N/A' },
  gemini: { strength: 'Fast and contextual', personality: 'Tends to be concise and well-organized', imageStyle: 'Artistic, good with abstract concepts' },
  groq: { strength: 'Lightning fast', personality: 'Uses Llama models for quick responses', imageStyle: 'N/A' },
  ollama: { strength: 'Runs locally', personality: 'Privacy-focused, works offline', imageStyle: 'N/A' },
};

const FloatingParticles = ({ count = 20 }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="absolute rounded-full opacity-20 animate-pulse" style={{
        width: `${Math.random() * 6 + 2}px`, height: `${Math.random() * 6 + 2}px`,
        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
        backgroundColor: ['#22d3ee', '#a855f7', '#f59e0b', '#10b981'][i % 4],
        animationDelay: `${Math.random() * 5}s`, animationDuration: `${Math.random() * 3 + 2}s`,
      }} />
    ))}
  </div>
);

// ============================================
// PROVIDER SETUP COMPONENT
// ============================================

const ProviderSetup = ({ configuredProviders, onAddProvider, onRemoveProvider, onContinue, comparisonType }) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [keyInput, setKeyInput] = useState('');
  const [adding, setAdding] = useState(false);

  // Filter providers based on comparison type
  const isImageMode = comparisonType?.requiresImage;
  const availableProviders = Object.entries(AI_PROVIDERS).filter(([id, config]) => {
    if (configuredProviders.includes(id)) return false;
    if (isImageMode && !config.supportsImage) return false;
    return true;
  });

  const validProviders = configuredProviders.filter(id => {
    if (isImageMode) return AI_PROVIDERS[id]?.supportsImage;
    return AI_PROVIDERS[id]?.supportsChat;
  });

  const handleAdd = () => {
    if (!selectedProvider) return;
    const config = AI_PROVIDERS[selectedProvider];
    if (config.requiresKey && !keyInput.trim()) return;
    if (config.requiresKey && keyInput.trim()) {
      localStorage.setItem(`ai_key_${selectedProvider}`, keyInput.trim());
    }
    onAddProvider(selectedProvider);
    setSelectedProvider(null);
    setKeyInput('');
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <FloatingParticles count={25} />
      <div className="max-w-2xl mx-auto py-12 relative z-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🤖 vs 🤖</div>
          <h1 className="text-4xl font-black text-white mb-2">AI Model Comparison</h1>
          <p className="text-indigo-300">
            {isImageMode
              ? 'Add image-capable AI providers to compare. Only providers with image generation are shown.'
              : 'Add AI providers to compare. The more models, the more interesting!'}
          </p>
        </div>

        {/* Currently configured */}
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Configured Providers ({validProviders.length})
            {isImageMode && <span className="text-sm font-normal text-indigo-300 ml-2">Image generation only</span>}
          </h3>
          {configuredProviders.length === 0 ? (
            <p className="text-slate-400 text-sm">No providers configured yet. Add at least 2 to compare!</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {configuredProviders.map(id => {
                const config = AI_PROVIDERS[id];
                const isValid = isImageMode ? config?.supportsImage : config?.supportsChat;
                return (
                  <div key={id} className={`rounded-xl px-4 py-2 flex items-center gap-2 ${isValid ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-slate-700/50 border border-slate-600 opacity-50'}`}>
                    <span className={isValid ? 'text-emerald-400' : 'text-slate-500'}>{isValid ? '✓' : '✗'}</span>
                    <span className="text-white font-medium text-sm">{config?.name}</span>
                    {!isValid && <span className="text-xs text-red-400">{isImageMode ? 'No images' : 'No chat'}</span>}
                    <button
                      onClick={() => onRemoveProvider(id)}
                      className="ml-1 text-slate-500 hover:text-red-400 transition-colors text-xs"
                      title="Remove provider"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add provider */}
        {!adding ? (
          <div className="space-y-4">
            {availableProviders.length > 0 && (
              <button
                onClick={() => setAdding(true)}
                className="w-full bg-indigo-500/20 border-2 border-dashed border-indigo-500/40 rounded-2xl p-6 text-center hover:bg-indigo-500/30 transition-colors"
              >
                <span className="text-2xl mb-2 block">+</span>
                <span className="text-indigo-300 font-medium">Add Another Provider</span>
              </button>
            )}

            {availableProviders.length === 0 && configuredProviders.length > 0 && (
              <p className="text-center text-slate-500 text-sm">
                {isImageMode ? 'All image-capable providers have been added.' : 'All available providers have been added.'}
              </p>
            )}

            {validProviders.length >= 2 && (
              <Button onClick={onContinue} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 font-bold rounded-xl text-lg">
                Continue with {validProviders.length} Providers →
              </Button>
            )}

            {validProviders.length < 2 && (
              <Alert type="warning">
                {isImageMode
                  ? 'Add at least 2 image-capable providers (OpenAI or Gemini) to compare!'
                  : 'Add at least 2 AI providers to start comparing!'}
              </Alert>
            )}
          </div>
        ) : (
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Select a Provider</h3>
            {availableProviders.length === 0 ? (
              <p className="text-slate-400 text-sm mb-4">
                {isImageMode ? 'No more image-capable providers available. OpenAI and Gemini support image generation.' : 'No more providers available.'}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {availableProviders.map(([id, config]) => (
                  <button
                    key={id}
                    onClick={() => { setSelectedProvider(id); setKeyInput(''); }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedProvider === id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-bold text-white">{config.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{config.description}</div>
                    {!config.requiresKey && <div className="text-xs text-emerald-400 mt-1">No key needed</div>}
                    {isImageMode && config.supportsImage && <div className="text-xs text-purple-400 mt-1">Supports images</div>}
                  </button>
                ))}
              </div>
            )}

            {selectedProvider && AI_PROVIDERS[selectedProvider]?.requiresKey && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {AI_PROVIDERS[selectedProvider]?.name} API Key
                </label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder={AI_PROVIDERS[selectedProvider]?.keyPlaceholder}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <a href={AI_PROVIDERS[selectedProvider]?.keyLink} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 mt-1 inline-block hover:underline">
                  Get a key →
                </a>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setAdding(false); setSelectedProvider(null); }} className="px-4 py-2 bg-slate-700 text-white rounded-xl text-sm">Cancel</button>
              {selectedProvider && (
                <Button
                  onClick={handleAdd}
                  disabled={AI_PROVIDERS[selectedProvider]?.requiresKey && !keyInput.trim()}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl"
                >
                  Add {AI_PROVIDERS[selectedProvider]?.name}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <button onClick={() => window.history.back()} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">← Exit</button>
    </div>
  );
};

// ============================================
// OUTPUT DISPLAY COMPONENT
// ============================================

const OutputPanel = ({ output, label, color, isCode, isImage, revealed, onVote, hasVoted, voteCount }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-slate-800/80 rounded-2xl border-2 ${revealed ? 'border-slate-600' : 'border-slate-700'} overflow-hidden flex flex-col`}>
      <div className={`bg-gradient-to-r ${color} p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white">{label}</h3>
          {revealed && output.provider && (
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold text-white">
              {AI_PROVIDERS[output.provider]?.name || output.provider}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-1">
        {output.error ? (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4">
            <p className="text-red-400 text-sm">Failed to generate: {output.error}</p>
          </div>
        ) : isImage ? (
          <div>
            {output.imageUrl ? (
              <img src={output.imageUrl} alt={`${label} output`} className="w-full rounded-xl" />
            ) : (
              <div className="w-full h-48 bg-slate-700 rounded-xl flex items-center justify-center text-slate-500">No image generated</div>
            )}
          </div>
        ) : isCode ? (
          <div className="relative">
            <div className={`bg-slate-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-hidden ${expanded ? 'max-h-none' : 'max-h-64'}`}>
              <pre className="whitespace-pre-wrap">{output.content?.slice(0, expanded ? undefined : 1500)}</pre>
            </div>
            {output.content?.length > 1500 && (
              <button onClick={() => setExpanded(!expanded)} className="mt-2 text-xs text-cyan-400 hover:underline">
                {expanded ? 'Show less' : 'Show more...'}
              </button>
            )}
            {output.content?.includes('<!DOCTYPE') && (
              <div className="mt-3 border border-slate-600 rounded-xl overflow-hidden">
                <div className="bg-slate-700 px-3 py-1 text-xs text-slate-400">Live Preview</div>
                <iframe srcDoc={output.content} title={`Preview ${label}`} className="w-full h-48 bg-white" sandbox="allow-scripts" />
              </div>
            )}
          </div>
        ) : (
          <div className={`text-slate-300 text-sm leading-relaxed ${expanded ? '' : 'line-clamp-6'}`}>
            {output.content}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => onVote(output.id)}
          disabled={hasVoted}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
            hasVoted ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : `bg-gradient-to-r ${color} text-white hover:brightness-110`
          }`}
        >
          {hasVoted ? `${voteCount || 0} vote${voteCount !== 1 ? 's' : ''}` : `Vote for ${label}`}
        </button>
      </div>

      {revealed && output.provider && EDUCATIONAL_INSIGHTS[output.provider] && (
        <div className="px-4 pb-4">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
            <p className="text-xs text-indigo-300 font-bold mb-1">{AI_PROVIDERS[output.provider]?.name}</p>
            <p className="text-xs text-slate-400"><strong>Strength:</strong> {EDUCATIONAL_INSIGHTS[output.provider].strength}</p>
            <p className="text-xs text-slate-400"><strong>Style:</strong> {EDUCATIONAL_INSIGHTS[output.provider].personality}</p>
            {isImage && <p className="text-xs text-slate-400"><strong>Image style:</strong> {EDUCATIONAL_INSIGHTS[output.provider].imageStyle}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ModelComparison = ({ gameCode, room, userId, isHost, onBack, sourceData }) => {
  const [phase, setPhase] = useState('pickType');
  const [configuredProviders, setConfiguredProviders] = useState([]);
  const [comparisonType, setComparisonType] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [outputs, setOutputs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [myVote, setMyVote] = useState(null);
  const [votes, setVotes] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1);

  // Generation timing & status per model
  const [genStatus, setGenStatus] = useState({}); // { providerId: { status: 'waiting'|'running'|'done'|'error', time: ms, finishOrder: n } }
  const [temperature, setTemperature] = useState(0.8);
  const [selectedModels, setSelectedModels] = useState({}); // { providerId: modelName } overrides

  // Initialize with providers that already have keys
  useEffect(() => {
    const available = Object.keys(AI_PROVIDERS).filter(id => hasApiKey(id));
    setConfiguredProviders(available);
  }, []);

  const handleAddProvider = (id) => setConfiguredProviders(prev => [...prev, id]);
  const handleRemoveProvider = (id) => {
    setConfiguredProviders(prev => prev.filter(p => p !== id));
    setSelectedModels(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  // Get valid providers for current comparison type
  const getValidProviders = () => {
    if (comparisonType?.requiresImage) {
      return configuredProviders.filter(id => AI_PROVIDERS[id]?.supportsImage);
    }
    return configuredProviders.filter(id => AI_PROVIDERS[id]?.supportsChat);
  };

  // Available models per provider for selection
  const getModelsForProvider = (providerId) => {
    const models = {
      openai: comparisonType?.requiresImage ? ['dall-e-3'] : ['gpt-5-mini', 'gpt-4o', 'gpt-4o-mini'],
      anthropic: ['claude-sonnet-4-5-20250929', 'claude-haiku-3-5-20241022'],
      gemini: comparisonType?.requiresImage ? ['gemini-2.5-flash-image'] : ['gemini-3-flash-preview', 'gemini-2.5-pro-preview-05-06'],
      groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
      together: comparisonType?.requiresImage ? ['black-forest-labs/FLUX.1-schnell'] : ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'mistralai/Mixtral-8x7B-Instruct-v0.1'],
      stability: ['sd3.5-large'],
    };
    return models[providerId] || [AI_PROVIDERS[providerId]?.chatModel || AI_PROVIDERS[providerId]?.imageModel].filter(Boolean);
  };

  const buildPrompt = () => {
    const basePrompt = customPrompt || sourceData?.problem || 'a helpful tool for students';
    switch (comparisonType?.id) {
      case 'code':
        return [
          { role: 'system', content: 'You are a creative web developer. Generate a complete, single-file HTML app with inline CSS and JavaScript. Use Tailwind CSS via CDN. Make it visually impressive and fully functional. Return ONLY the HTML code, no explanations.' },
          { role: 'user', content: `Build a web app: ${basePrompt}` }
        ];
      case 'meme':
        return [
          { role: 'system', content: 'You are a viral meme caption writer. Write 3 punchy, funny, shareable meme captions. Be creative and culturally relevant. Return just the captions, numbered.' },
          { role: 'user', content: `Write viral meme captions about: ${basePrompt}` }
        ];
      case 'story':
        return [
          { role: 'system', content: 'You are a creative writer. Write a short, compelling story (200-300 words). Make it engaging with vivid imagery and a satisfying ending.' },
          { role: 'user', content: `Write a short story about: ${basePrompt}` }
        ];
      case 'explain':
        return [
          { role: 'system', content: 'You are an expert teacher. Explain the concept clearly for a beginner. Use analogies, examples, and simple language. Be concise but thorough.' },
          { role: 'user', content: `Explain this concept: ${basePrompt}` }
        ];
      default:
        return [{ role: 'user', content: basePrompt }];
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenProgress(0);
    setPhase('generate');

    const validProviders = getValidProviders();
    const shuffled = [...validProviders].sort(() => Math.random() - 0.5);
    const isImage = comparisonType?.requiresImage;

    // Initialize status for all providers
    const initialStatus = {};
    shuffled.forEach(p => { initialStatus[p] = { status: 'running', time: null, finishOrder: null }; });
    setGenStatus(initialStatus);

    let finishCount = 0;
    const startTime = Date.now();

    // Run ALL providers in parallel to race them
    const promises = shuffled.map(async (providerId, i) => {
      const model = selectedModels[providerId]; // custom model override
      try {
        let result;
        if (isImage) {
          const imagePrompt = customPrompt || 'A vibrant, detailed illustration of a futuristic city at sunset with flying vehicles and neon lights';
          result = await generateImage(imagePrompt, '1024x1024', providerId);
          result = { id: MODEL_LABELS[i], imageUrl: result.url || result, content: null, provider: providerId, error: null };
        } else {
          const messages = buildPrompt();
          const maxTokens = comparisonType?.id === 'code' ? 16384 : 2000;
          const opts = { provider: providerId, maxTokens, temperature };
          if (model) opts.model = model;
          const content = await chatCompletion(messages, opts);
          result = { id: MODEL_LABELS[i], content, imageUrl: null, provider: providerId, error: null };
        }
        finishCount++;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        setGenStatus(prev => ({ ...prev, [providerId]: { status: 'done', time: `${elapsed}s`, finishOrder: finishCount } }));
        setGenProgress(Math.round((finishCount / shuffled.length) * 100));
        return result;
      } catch (err) {
        finishCount++;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        setGenStatus(prev => ({ ...prev, [providerId]: { status: 'error', time: `${elapsed}s`, finishOrder: finishCount } }));
        setGenProgress(Math.round((finishCount / shuffled.length) * 100));
        return { id: MODEL_LABELS[shuffled.indexOf(providerId)], content: null, imageUrl: null, provider: providerId, error: err.message };
      }
    });

    const results = await Promise.all(promises);

    // Re-label with MODEL_LABELS based on shuffled order
    results.forEach((r, i) => { r.id = MODEL_LABELS[i]; });

    setOutputs(results);
    setIsGenerating(false);
    setPhase('compare');
  };

  const handleVote = (modelId) => {
    if (myVote) return;
    setMyVote(modelId);
    setVotes(prev => ({ ...prev, [modelId]: (prev[modelId] || 0) + 1 }));
  };

  const handleReveal = () => {
    setPhase('reveal');
    setRevealed(false);
    setRevealIndex(-1);
    outputs.forEach((_, i) => {
      setTimeout(() => {
        setRevealIndex(i);
        if (i === outputs.length - 1) {
          setTimeout(() => { setRevealed(true); setPhase('results'); }, 1500);
        }
      }, (i + 1) * 2000);
    });
  };

  // ============================================
  // RENDER
  // ============================================

  // Pick comparison type first
  if (phase === 'pickType') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
        <FloatingParticles count={25} />
        <div className="max-w-3xl mx-auto py-12 relative z-10">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚔️</div>
            <h1 className="text-4xl font-black text-white mb-2">Choose Your Battle</h1>
            <p className="text-indigo-300">What should the AI models compete on?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {COMPARISON_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => { setComparisonType(type); setPhase('setup'); }}
                className="p-6 rounded-2xl border-2 text-left transition-all border-slate-700 bg-slate-800/50 hover:border-indigo-500 hover:bg-slate-800"
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="text-lg font-bold text-white">{type.name}</div>
                <div className="text-sm text-slate-400 mt-1">{type.description}</div>
                {type.requiresImage && <div className="text-xs text-purple-400 mt-2">Requires image-capable providers (OpenAI, Gemini)</div>}
              </button>
            ))}
          </div>

          <button onClick={onBack} className="text-slate-500 hover:text-white text-sm">← Back to Home</button>
        </div>
        <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">← Exit</button>
      </div>
    );
  }

  if (phase === 'setup') {
    return (
      <ProviderSetup
        configuredProviders={configuredProviders}
        onAddProvider={handleAddProvider}
        onRemoveProvider={handleRemoveProvider}
        onContinue={() => setPhase('prompt')}
        comparisonType={comparisonType}
      />
    );
  }

  if (phase === 'prompt') {
    const validProviders = getValidProviders();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 overflow-y-auto">
        <FloatingParticles count={25} />
        <div className="max-w-3xl mx-auto py-12 relative z-10">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">{comparisonType?.icon}</div>
            <h1 className="text-3xl font-black text-white mb-2">{comparisonType?.name} Battle</h1>
            <p className="text-indigo-300">Configure your prompt, models, and parameters</p>
          </div>

          {/* Prompt input */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {comparisonType?.requiresImage ? 'Image prompt' : 'Prompt'}
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={comparisonType?.requiresImage
                ? 'e.g., A vibrant watercolor painting of a cat astronaut floating in space with Earth in the background'
                : sourceData?.problem || 'e.g., a habit tracker for busy parents...'}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[80px] resize-none"
            />
            {sourceData?.problem && !customPrompt && (
              <button onClick={() => setCustomPrompt(sourceData.problem)} className="mt-2 text-xs text-cyan-400 hover:underline">
                Use prompt from previous game
              </button>
            )}
          </div>

          {/* Temperature control (chat only) */}
          {!comparisonType?.requiresImage && (
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Temperature</label>
                <span className="text-sm text-cyan-400 font-mono">{temperature}</span>
              </div>
              <input type="range" min="0" max="1.5" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-500" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Precise (0)</span>
                <span>Balanced</span>
                <span>Creative (1.5)</span>
              </div>
            </div>
          )}

          {/* Model selection per provider */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 mb-6">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Model Selection</h3>
            <div className="space-y-3">
              {validProviders.map(id => {
                const models = getModelsForProvider(id);
                const currentModel = selectedModels[id] || models[0];
                return (
                  <div key={id} className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-3 py-2">
                    <span className="text-sm text-white font-medium w-28 flex-shrink-0">{AI_PROVIDERS[id]?.name}</span>
                    {models.length > 1 ? (
                      <select
                        value={currentModel}
                        onChange={(e) => setSelectedModels(prev => ({ ...prev, [id]: e.target.value }))}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    ) : (
                      <span className="text-xs text-slate-400">{models[0]}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setPhase('setup')} className="px-6 py-3 bg-slate-700 text-white rounded-xl font-medium">← Back</button>
            <Button onClick={handleGenerate} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 font-bold rounded-xl text-lg">
              Race {validProviders.length} Models →
            </Button>
          </div>
        </div>
        <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">← Exit</button>
      </div>
    );
  }

  if (phase === 'generate') {
    const validProviders = getValidProviders();
    const sortedByFinish = [...validProviders].sort((a, b) => {
      const sa = genStatus[a]; const sb = genStatus[b];
      if (sa?.status === 'done' && sb?.status !== 'done') return -1;
      if (sb?.status === 'done' && sa?.status !== 'done') return 1;
      return (sa?.finishOrder || 99) - (sb?.finishOrder || 99);
    });
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">
        <FloatingParticles count={30} />
        <div className="max-w-lg mx-auto text-center relative z-10">
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="text-3xl font-black text-white mb-2">Models are racing!</h2>
          <p className="text-indigo-300 mb-6">All {validProviders.length} models generating in parallel — who finishes first?</p>
          <div className="bg-slate-800 rounded-full h-4 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${genProgress}%` }} />
          </div>
          <div className="space-y-2">
            {sortedByFinish.map((p) => {
              const status = genStatus[p] || { status: 'running' };
              const label = MODEL_LABELS[validProviders.indexOf(p)];
              return (
                <div key={p} className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                  status.status === 'done' ? 'bg-emerald-500/10 border border-emerald-500/30' :
                  status.status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                  'bg-slate-800/50 border border-slate-700'
                }`}>
                  <div className="flex items-center gap-3">
                    {status.finishOrder === 1 && status.status === 'done' && <span className="text-lg">🥇</span>}
                    {status.finishOrder === 2 && status.status === 'done' && <span className="text-lg">🥈</span>}
                    {status.finishOrder === 3 && status.status === 'done' && <span className="text-lg">🥉</span>}
                    {(!status.finishOrder || status.finishOrder > 3) && status.status === 'done' && <span className="text-emerald-400">✓</span>}
                    {status.status === 'running' && <span className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />}
                    {status.status === 'error' && <span className="text-red-400">✗</span>}
                    <span className="text-white text-sm font-medium">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.time && <span className="text-xs font-mono text-slate-400">{status.time}</span>}
                    <span className={`text-xs font-bold ${
                      status.status === 'done' ? 'text-emerald-400' :
                      status.status === 'error' ? 'text-red-400' :
                      'text-cyan-400'
                    }`}>
                      {status.status === 'done' ? `#${status.finishOrder} Finished` :
                       status.status === 'error' ? 'Failed' :
                       'Generating...'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Compare, Reveal, Results phases
  const isImage = comparisonType?.requiresImage;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 overflow-y-auto">
      <FloatingParticles count={25} />
      <div className="max-w-7xl mx-auto py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            {phase === 'compare' ? 'Compare the Outputs' : phase === 'reveal' ? 'The Big Reveal!' : 'Results'}
          </h1>
          <p className="text-indigo-300">
            {phase === 'compare' ? 'Which AI did it best? Vote for your favorite!' : phase === 'reveal' ? 'Unveiling which model made which output...' : 'See how the models compared!'}
          </p>
          <div className="mt-2 inline-block bg-indigo-500/20 px-4 py-1 rounded-full text-sm text-indigo-300">
            {comparisonType?.icon} {comparisonType?.name} Challenge
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Prompt Given to All Models</p>
          <p className="text-white text-sm">{customPrompt || sourceData?.problem || 'Default prompt'}</p>
        </div>

        <div className={`grid gap-6 mb-8 ${outputs.length <= 2 ? 'md:grid-cols-2' : outputs.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {outputs.map((output, i) => (
            <OutputPanel
              key={output.id}
              output={output}
              label={output.id}
              color={MODEL_COLORS[i]}
              isCode={comparisonType?.id === 'code'}
              isImage={isImage}
              revealed={revealed || revealIndex >= i}
              onVote={handleVote}
              hasVoted={!!myVote}
              voteCount={votes[output.id] || 0}
            />
          ))}
        </div>

        <div className="text-center space-y-4">
          {phase === 'compare' && myVote && isHost && (
            <Button onClick={handleReveal} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 font-bold rounded-xl text-lg">
              🎭 Reveal the Models!
            </Button>
          )}
          {phase === 'compare' && !myVote && (
            <p className="text-amber-400 text-sm animate-pulse">Vote for the best output above!</p>
          )}
          {phase === 'results' && (
            <>
              {(() => {
                const winner = Object.entries(votes).sort(([,a], [,b]) => b - a)[0];
                const winnerOutput = outputs.find(o => o.id === winner?.[0]);
                return winner ? (
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-8 border border-amber-500/30 mb-6">
                    <div className="text-5xl mb-3">🏆</div>
                    <h2 className="text-2xl font-black text-amber-400 mb-1">Winner: {winner[0]}</h2>
                    <p className="text-white text-lg font-bold">{AI_PROVIDERS[winnerOutput?.provider]?.name}</p>
                    <p className="text-slate-400 text-sm mt-2">with {winner[1]} vote{winner[1] !== 1 ? 's' : ''}</p>
                  </div>
                ) : null;
              })()}

              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 text-left max-w-2xl mx-auto mb-6">
                <h3 className="text-lg font-bold text-indigo-300 mb-3">🧠 What Did We Learn?</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Different AI models have different strengths and personalities</li>
                  {isImage && <li>• Image generation styles vary dramatically between providers</li>}
                  <li>• The "best" model depends on the task — there's no universal winner</li>
                  <li>• AI literacy means understanding these tools, not just using them</li>
                </ul>
              </div>

              <Button onClick={onBack} className="bg-cyan-600 text-white px-8 py-3 font-bold rounded-xl">
                Back to Home
              </Button>
            </>
          )}
        </div>
      </div>
      <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">← Exit</button>
    </div>
  );
};

export default ModelComparison;

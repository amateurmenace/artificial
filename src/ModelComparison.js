// MODEL COMPARISON - Bonus Mini-Game
// Generate the same prompt with different AI models side-by-side, vote on which is better
// Teaches about model differences, strengths, and limitations

import React, { useState, useEffect } from 'react';
import { Button, Card, Alert } from './components';
import { updateGamePhase, submitVote, addReaction } from './firebase';
import { chatCompletion, hasApiKey, AI_PROVIDERS, getApiKey, setApiKey, setProvider } from './ai-services';

// ============================================
// CONSTANTS
// ============================================

const MODEL_LABELS = ['Model A', 'Model B', 'Model C', 'Model D'];
const MODEL_COLORS = ['from-cyan-500 to-blue-500', 'from-purple-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-emerald-500 to-teal-500'];

const COMPARISON_TYPES = [
  { id: 'code', name: 'Code Generation', icon: '💻', description: 'Compare how models build the same app', prompt: 'Generate a complete, single-file HTML app' },
  { id: 'meme', name: 'Meme Caption', icon: '🎭', description: 'Compare how models write captions', prompt: 'Write a viral meme caption for' },
  { id: 'story', name: 'Creative Writing', icon: '📖', description: 'Compare creative expression', prompt: 'Write a short, compelling story about' },
  { id: 'explain', name: 'AI Explanation', icon: '🧠', description: 'Compare how models explain concepts', prompt: 'Explain this concept clearly for a beginner:' },
];

const EDUCATIONAL_INSIGHTS = {
  openai: { strength: 'Versatile and creative', personality: 'Tends to be detailed and structured' },
  anthropic: { strength: 'Careful and nuanced', personality: 'Tends to be thorough and safety-conscious' },
  gemini: { strength: 'Fast and contextual', personality: 'Tends to be concise and well-organized' },
  groq: { strength: 'Lightning fast', personality: 'Uses Llama models for quick responses' },
  ollama: { strength: 'Runs locally', personality: 'Privacy-focused, works offline' },
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

const ProviderSetup = ({ configuredProviders, onAddProvider, onContinue }) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [keyInput, setKeyInput] = useState('');
  const [adding, setAdding] = useState(false);

  const availableProviders = Object.entries(AI_PROVIDERS).filter(
    ([id]) => !configuredProviders.includes(id)
  );

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
          <p className="text-indigo-300">Add AI providers to compare. The more models, the more interesting!</p>
        </div>

        {/* Currently configured */}
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Configured Providers ({configuredProviders.length})</h3>
          {configuredProviders.length === 0 ? (
            <p className="text-slate-400 text-sm">No providers configured yet. Add at least 2 to compare!</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {configuredProviders.map(id => (
                <div key={id} className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl px-4 py-2 flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-white font-medium">{AI_PROVIDERS[id]?.name}</span>
                </div>
              ))}
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

            {configuredProviders.length >= 2 && (
              <Button onClick={onContinue} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 font-bold rounded-xl text-lg">
                Continue with {configuredProviders.length} Providers →
              </Button>
            )}

            {configuredProviders.length < 2 && (
              <Alert type="warning">Add at least 2 AI providers to start comparing!</Alert>
            )}
          </div>
        ) : (
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Select a Provider</h3>
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
                </button>
              ))}
            </div>

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
                <a
                  href={AI_PROVIDERS[selectedProvider]?.keyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 mt-1 inline-block hover:underline"
                >
                  Get a key →
                </a>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setAdding(false); setSelectedProvider(null); }} className="px-4 py-2 bg-slate-700 text-white rounded-xl text-sm">Cancel</button>
              <Button
                onClick={handleAdd}
                disabled={!selectedProvider || (AI_PROVIDERS[selectedProvider]?.requiresKey && !keyInput.trim())}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl"
              >
                Add {selectedProvider ? AI_PROVIDERS[selectedProvider]?.name : 'Provider'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// OUTPUT DISPLAY COMPONENT
// ============================================

const OutputPanel = ({ output, label, color, isCode, revealed, onVote, hasVoted, voteCount }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-slate-800/80 rounded-2xl border-2 ${revealed ? 'border-slate-600' : 'border-slate-700'} overflow-hidden flex flex-col`}>
      {/* Header */}
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

      {/* Content */}
      <div className="p-4 flex-1">
        {output.error ? (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4">
            <p className="text-red-400 text-sm">Failed to generate: {output.error}</p>
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
            {/* Live preview for code */}
            {output.content?.includes('<!DOCTYPE') && (
              <div className="mt-3 border border-slate-600 rounded-xl overflow-hidden">
                <div className="bg-slate-700 px-3 py-1 text-xs text-slate-400">Live Preview</div>
                <iframe
                  srcDoc={output.content}
                  title={`Preview ${label}`}
                  className="w-full h-48 bg-white"
                  sandbox="allow-scripts"
                />
              </div>
            )}
          </div>
        ) : (
          <div className={`text-slate-300 text-sm leading-relaxed ${expanded ? '' : 'line-clamp-6'}`}>
            {output.content}
          </div>
        )}
      </div>

      {/* Vote button */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => onVote(output.id)}
          disabled={hasVoted}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
            hasVoted
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : `bg-gradient-to-r ${color} text-white hover:brightness-110`
          }`}
        >
          {hasVoted ? `${voteCount || 0} vote${voteCount !== 1 ? 's' : ''}` : `Vote for ${label}`}
        </button>
      </div>

      {/* Revealed insights */}
      {revealed && output.provider && EDUCATIONAL_INSIGHTS[output.provider] && (
        <div className="px-4 pb-4">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
            <p className="text-xs text-indigo-300 font-bold mb-1">{AI_PROVIDERS[output.provider]?.name} Traits:</p>
            <p className="text-xs text-slate-400">
              <strong>Strength:</strong> {EDUCATIONAL_INSIGHTS[output.provider].strength}
            </p>
            <p className="text-xs text-slate-400">
              <strong>Style:</strong> {EDUCATIONAL_INSIGHTS[output.provider].personality}
            </p>
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
  // State
  const [phase, setPhase] = useState('setup'); // setup, pickType, generate, compare, vote, reveal, results
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

  // Initialize with providers that already have keys
  useEffect(() => {
    const available = Object.keys(AI_PROVIDERS).filter(id => hasApiKey(id));
    setConfiguredProviders(available);
  }, []);

  const handleAddProvider = (providerId) => {
    setConfiguredProviders(prev => [...prev, providerId]);
  };

  const handleContinue = () => {
    setPhase('pickType');
  };

  // Build the final prompt based on type
  const buildPrompt = () => {
    const type = comparisonType;
    const basePrompt = customPrompt || (sourceData?.prompt || sourceData?.problem || 'a helpful tool for students');

    switch (type?.id) {
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
        return [
          { role: 'user', content: basePrompt }
        ];
    }
  };

  // Generate outputs from all configured providers
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenProgress(0);
    setPhase('generate');

    const messages = buildPrompt();
    const maxTokens = comparisonType?.id === 'code' ? 16384 : 2000;
    const results = [];

    // Shuffle providers so order is random
    const shuffled = [...configuredProviders].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffled.length; i++) {
      setGenProgress(Math.round(((i) / shuffled.length) * 100));
      try {
        const content = await chatCompletion(messages, { provider: shuffled[i], maxTokens, temperature: 0.8 });
        results.push({ id: MODEL_LABELS[i], content, provider: shuffled[i], error: null });
      } catch (err) {
        results.push({ id: MODEL_LABELS[i], content: null, provider: shuffled[i], error: err.message });
      }
    }

    setGenProgress(100);
    setOutputs(results);
    setIsGenerating(false);
    setPhase('compare');
  };

  const handleVote = (modelId) => {
    if (myVote) return;
    setMyVote(modelId);
    setVotes(prev => ({ ...prev, [modelId]: (prev[modelId] || 0) + 1 }));
  };

  // Dramatic reveal animation
  const handleReveal = () => {
    setPhase('reveal');
    setRevealed(false);
    setRevealIndex(-1);

    // Reveal one at a time
    outputs.forEach((_, i) => {
      setTimeout(() => {
        setRevealIndex(i);
        if (i === outputs.length - 1) {
          setTimeout(() => {
            setRevealed(true);
            setPhase('results');
          }, 1500);
        }
      }, (i + 1) * 2000);
    });
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  if (phase === 'setup') {
    return (
      <ProviderSetup
        configuredProviders={configuredProviders}
        onAddProvider={handleAddProvider}
        onContinue={handleContinue}
      />
    );
  }

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
                onClick={() => setComparisonType(type)}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  comparisonType?.id === type.id
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="text-lg font-bold text-white">{type.name}</div>
                <div className="text-sm text-slate-400 mt-1">{type.description}</div>
              </button>
            ))}
          </div>

          {comparisonType && (
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Enter your prompt {sourceData?.problem ? '(or use the one from your game)' : ''}
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={sourceData?.problem || 'e.g., a habit tracker for busy parents...'}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[100px] resize-none"
              />
              {sourceData?.problem && !customPrompt && (
                <button
                  onClick={() => setCustomPrompt(sourceData.problem)}
                  className="mt-2 text-xs text-cyan-400 hover:underline"
                >
                  Use prompt from previous game: "{sourceData.problem.slice(0, 60)}..."
                </button>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={() => setPhase('setup')} className="px-6 py-3 bg-slate-700 text-white rounded-xl font-medium">← Back</button>
            <Button
              onClick={handleGenerate}
              disabled={!comparisonType}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 font-bold rounded-xl text-lg"
            >
              Generate with {configuredProviders.length} Models →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'generate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">
        <FloatingParticles count={30} />
        <div className="max-w-lg mx-auto text-center relative z-10">
          <div className="text-6xl mb-6 animate-pulse">⚡</div>
          <h2 className="text-3xl font-black text-white mb-4">Models are competing...</h2>
          <p className="text-indigo-300 mb-8">Sending the same prompt to {configuredProviders.length} different AI models</p>

          {/* Progress */}
          <div className="bg-slate-800 rounded-full h-4 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${genProgress}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm">{genProgress}% complete</p>

          {/* Model status */}
          <div className="mt-6 space-y-2">
            {configuredProviders.map((p, i) => (
              <div key={p} className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-2">
                <span className="text-white text-sm">{MODEL_LABELS[i]}</span>
                <span className={`text-xs ${
                  genProgress > ((i + 1) / configuredProviders.length) * 100
                    ? 'text-emerald-400'
                    : genProgress > (i / configuredProviders.length) * 100
                    ? 'text-amber-400 animate-pulse'
                    : 'text-slate-500'
                }`}>
                  {genProgress > ((i + 1) / configuredProviders.length) * 100 ? '✓ Done' : genProgress > (i / configuredProviders.length) * 100 ? 'Generating...' : 'Waiting...'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Compare, Reveal, Results phases
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 overflow-y-auto">
      <FloatingParticles count={25} />
      <div className="max-w-7xl mx-auto py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            {phase === 'compare' ? 'Compare the Outputs' : phase === 'reveal' ? 'The Big Reveal!' : 'Results'}
          </h1>
          <p className="text-indigo-300">
            {phase === 'compare'
              ? 'Which AI did it best? Vote for your favorite!'
              : phase === 'reveal'
              ? 'Unveiling which model made which output...'
              : 'See how the models compared!'}
          </p>
          {comparisonType && (
            <div className="mt-2 inline-block bg-indigo-500/20 px-4 py-1 rounded-full text-sm text-indigo-300">
              {comparisonType.icon} {comparisonType.name} Challenge
            </div>
          )}
        </div>

        {/* Prompt used */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Prompt Given to All Models</p>
          <p className="text-white text-sm">{customPrompt || sourceData?.problem || 'Default prompt'}</p>
        </div>

        {/* Output panels */}
        <div className={`grid gap-6 mb-8 ${outputs.length <= 2 ? 'md:grid-cols-2' : outputs.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {outputs.map((output, i) => (
            <OutputPanel
              key={output.id}
              output={output}
              label={output.id}
              color={MODEL_COLORS[i]}
              isCode={comparisonType?.id === 'code'}
              revealed={revealed || revealIndex >= i}
              onVote={handleVote}
              hasVoted={!!myVote}
              voteCount={votes[output.id] || 0}
            />
          ))}
        </div>

        {/* Actions */}
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
              {/* Winner announcement */}
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

              {/* Educational takeaway */}
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 text-left max-w-2xl mx-auto mb-6">
                <h3 className="text-lg font-bold text-indigo-300 mb-3">🧠 What Did We Learn?</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Different AI models have different strengths and personalities</li>
                  <li>• The "best" model depends on the task - there's no single winner for everything</li>
                  <li>• Knowing model differences helps you pick the right tool for your needs</li>
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

      {/* Exit button */}
      <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">
        ← Exit
      </button>
    </div>
  );
};

export default ModelComparison;

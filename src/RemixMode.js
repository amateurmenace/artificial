// REMIX MODE - Bonus Mini-Game
// Fork someone else's app/meme and iterate on it
// Teaches collaboration and building on others' work

import React, { useState } from 'react';
import { Button, Alert } from './components';
import { chatCompletion, generateImage } from './ai-services';

// ============================================
// CONSTANTS
// ============================================

const REACTIONS = [
  { emoji: '🔥', name: 'fire', points: 3 },
  { emoji: '💯', name: 'perfect', points: 4 },
  { emoji: '🤯', name: 'mindblown', points: 3 },
  { emoji: '🔀', name: 'remix', points: 5 },
  { emoji: '❤️', name: 'love', points: 2 },
  { emoji: '🚀', name: 'rocket', points: 3 },
];

const AWARDS = {
  bestRemix: { name: 'Best Remix', icon: '🔀', description: 'Most voted remix' },
  mostRemixed: { name: 'Most Remixed', icon: '🎯', description: 'Original that inspired the most forks' },
  bestCollaborator: { name: 'Best Collaborator', icon: '🤝', description: 'Most creative improvements' },
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
// SUBMISSION CARD (for browsing)
// ============================================

const SubmissionCard = ({ submission, type, onFork, isMine }) => {
  return (
    <div className={`bg-slate-800/80 rounded-2xl border-2 overflow-hidden ${isMine ? 'border-slate-600 opacity-60' : 'border-slate-700 hover:border-cyan-500/50'} transition-all`}>
      {type === 'meme' ? (
        // Meme display
        <div className="relative aspect-square">
          {submission.imageUrl ? (
            <img src={submission.imageUrl} alt="Meme" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-4xl">🖼️</div>
          )}
          {submission.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3">
              <p className="text-white font-bold text-sm">{submission.caption}</p>
            </div>
          )}
        </div>
      ) : (
        // App display
        <div>
          <div className="p-4">
            <h4 className="text-white font-bold text-sm mb-1">{submission.appIdea || submission.problem || 'App'}</h4>
            {submission.code && (
              <div className="bg-slate-900 rounded-lg overflow-hidden mt-2 border border-slate-700">
                <iframe
                  srcDoc={submission.code}
                  title="App preview"
                  className="w-full h-32 bg-white"
                  sandbox="allow-scripts"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">{submission.playerName || 'Player'}</span>
          {submission.reactions && (
            <span className="text-xs text-slate-500">
              {Object.values(submission.reactions).reduce((a, b) => a + b, 0)} reactions
            </span>
          )}
        </div>
        {!isMine ? (
          <Button onClick={() => onFork(submission)} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl text-sm py-2">
            🔀 Fork & Remix
          </Button>
        ) : (
          <p className="text-center text-xs text-slate-500">Your submission</p>
        )}
      </div>
    </div>
  );
};

// ============================================
// REMIX EDITOR
// ============================================

const RemixEditor = ({ original, type, onSubmit, onBack }) => {
  const [changes, setChanges] = useState('');
  const [remixResult, setRemixResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newCaption, setNewCaption] = useState(original.caption || '');

  const handleRemixCode = async () => {
    if (!changes.trim()) return;
    setIsGenerating(true);
    try {
      const messages = [
        { role: 'system', content: 'You are a creative web developer improving an existing app. The user will provide the original code and requested changes. Generate a complete, improved single-file HTML app. Return ONLY the HTML code.' },
        { role: 'user', content: `Here is the original app code:\n\n${original.code}\n\nPlease make these changes:\n${changes}` }
      ];
      const result = await chatCompletion(messages, { maxTokens: 24000, temperature: 0.7 });
      const htmlMatch = result.match(/<!DOCTYPE[\s\S]*<\/html>/i);
      setRemixResult(htmlMatch ? htmlMatch[0] : result);
    } catch (err) {
      setRemixResult(null);
      alert('Generation failed: ' + err.message);
    }
    setIsGenerating(false);
  };

  const handleRemixMeme = async () => {
    if (!changes.trim() && newCaption === original.caption) return;
    setIsGenerating(true);
    try {
      if (changes.trim()) {
        // Generate new image with modified prompt
        const messages = [
          { role: 'system', content: 'You are a prompt engineer. Take the original image prompt and the requested changes, and create an improved image generation prompt. Return ONLY the new prompt, nothing else.' },
          { role: 'user', content: `Original prompt: "${original.imagePrompt || original.visualConcept || 'advocacy meme'}"\n\nChanges requested: ${changes}` }
        ];
        const newPrompt = await chatCompletion(messages, { maxTokens: 500 });
        const imageResult = await generateImage(newPrompt);
        setRemixResult({ imageUrl: imageResult.url, caption: newCaption, prompt: newPrompt });
      } else {
        setRemixResult({ imageUrl: original.imageUrl, caption: newCaption, prompt: original.imagePrompt });
      }
    } catch (err) {
      alert('Generation failed: ' + err.message);
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <FloatingParticles count={25} />
      <div className="max-w-5xl mx-auto py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔀</div>
          <h1 className="text-3xl font-black text-white mb-2">Remixing {original.playerName}'s {type === 'meme' ? 'Meme' : 'App'}</h1>
          <p className="text-purple-300">Build on their work, make it your own!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Original */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-slate-400">Original</span>
              <span className="text-xs bg-slate-700 px-2 py-1 rounded-full text-slate-400">by {original.playerName}</span>
            </h3>
            {type === 'meme' ? (
              <div>
                {original.imageUrl && <img src={original.imageUrl} alt="Original meme" className="w-full rounded-xl mb-3" />}
                <p className="text-white font-bold text-sm">{original.caption}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-400 mb-2">{original.appIdea || original.problem}</p>
                {original.code && (
                  <div className="border border-slate-600 rounded-xl overflow-hidden">
                    <iframe srcDoc={original.code} title="Original app" className="w-full h-64 bg-white" sandbox="allow-scripts" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Remix controls */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold text-white mb-4">Your Remix</h3>

            {type === 'meme' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">New Caption</label>
                <input
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="Enter your remix caption..."
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {type === 'meme' ? 'Image Changes (optional - regenerates image)' : 'What changes do you want to make?'}
              </label>
              <textarea
                value={changes}
                onChange={(e) => setChanges(e.target.value)}
                placeholder={type === 'meme' ? 'e.g., Make it more dramatic, add sunset colors...' : 'e.g., Add dark mode, make buttons bigger, add animations...'}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 min-h-[120px] resize-none"
              />
            </div>

            <Button
              onClick={type === 'meme' ? handleRemixMeme : handleRemixCode}
              disabled={isGenerating || (!changes.trim() && (type !== 'meme' || newCaption === original.caption))}
              loading={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl py-3 mb-4"
            >
              {isGenerating ? 'Remixing...' : '🔀 Generate Remix'}
            </Button>

            {/* Remix result */}
            {remixResult && (
              <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-4">
                <p className="text-xs text-emerald-400 font-bold mb-2">Remix Preview</p>
                {type === 'meme' ? (
                  <div>
                    {remixResult.imageUrl && <img src={remixResult.imageUrl} alt="Remixed meme" className="w-full rounded-xl mb-2" />}
                    <p className="text-white font-bold text-sm">{remixResult.caption}</p>
                  </div>
                ) : (
                  <div className="border border-slate-600 rounded-xl overflow-hidden">
                    <iframe srcDoc={remixResult} title="Remixed app" className="w-full h-64 bg-white" sandbox="allow-scripts" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-4 mt-6 justify-center">
          <button onClick={onBack} className="px-6 py-3 bg-slate-700 text-white rounded-xl font-medium">← Back to Browse</button>
          {remixResult && (
            <Button
              onClick={() => onSubmit({
                type: 'remix',
                originalPlayerId: original.playerId,
                originalPlayerName: original.playerName,
                changes,
                ...(type === 'meme'
                  ? { imageUrl: remixResult.imageUrl, caption: remixResult.caption, imagePrompt: remixResult.prompt }
                  : { code: remixResult, appIdea: original.appIdea || original.problem })
              })}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 font-bold rounded-xl"
            >
              Submit Remix
            </Button>
          )}
        </div>
      </div>

      <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">← Exit</button>
    </div>
  );
};

// ============================================
// REMIX GALLERY (voting)
// ============================================

const RemixGallery = ({ remixes, originals, type, onVote, myVote, onReact, userId }) => {
  const getOriginal = (remix) => originals.find(o => o.playerId === remix.originalPlayerId);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {remixes.map((remix, i) => {
        const original = getOriginal(remix);
        return (
          <div key={i} className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold">{remix.playerName}'s Remix</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                  🔀 of {remix.originalPlayerName}
                </span>
              </div>

              {/* Side by side */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Original</p>
                  {type === 'meme' ? (
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-700">
                      {original?.imageUrl && <img src={original.imageUrl} alt="Original" className="w-full h-full object-cover" />}
                    </div>
                  ) : (
                    <div className="border border-slate-600 rounded-lg overflow-hidden">
                      <iframe srcDoc={original?.code} title="Original" className="w-full h-24 bg-white" sandbox="allow-scripts" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-purple-400 mb-1">Remix</p>
                  {type === 'meme' ? (
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-700">
                      {remix.imageUrl && <img src={remix.imageUrl} alt="Remix" className="w-full h-full object-cover" />}
                    </div>
                  ) : (
                    <div className="border border-purple-500/30 rounded-lg overflow-hidden">
                      <iframe srcDoc={remix.code} title="Remix" className="w-full h-24 bg-white" sandbox="allow-scripts" />
                    </div>
                  )}
                </div>
              </div>

              {/* Changes description */}
              <div className="bg-slate-700/50 rounded-lg p-2 mb-3">
                <p className="text-xs text-slate-400">Changes: <span className="text-white">{remix.changes || 'Visual updates'}</span></p>
              </div>

              {/* Reactions */}
              <div className="flex flex-wrap gap-2 mb-3">
                {REACTIONS.map(r => (
                  <button
                    key={r.name}
                    onClick={() => onReact(i, r.name)}
                    disabled={remix.playerId === userId}
                    className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 px-2 py-1 rounded-lg text-sm transition-colors"
                  >
                    {r.emoji} <span className="text-xs text-slate-400">{remix.reactions?.[r.name] || 0}</span>
                  </button>
                ))}
              </div>

              {/* Vote */}
              {remix.playerId !== userId && (
                <button
                  onClick={() => onVote(i)}
                  disabled={myVote !== null}
                  className={`w-full py-2 rounded-xl font-bold text-sm transition-all ${
                    myVote === i
                      ? 'bg-purple-500 text-white'
                      : myVote !== null
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:brightness-110'
                  }`}
                >
                  {myVote === i ? '✓ Voted!' : myVote !== null ? 'Already voted' : '🔀 Vote Best Remix'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================
// AWARD CARD
// ============================================

const AwardCard = ({ award, winner }) => (
  <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 text-center">
    <div className="text-4xl mb-2">{award.icon}</div>
    <h3 className="text-lg font-bold text-white mb-1">{award.name}</h3>
    <p className="text-xs text-slate-400 mb-3">{award.description}</p>
    <p className="text-xl font-black text-purple-400">{winner}</p>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const RemixMode = ({ gameCode, room, userId, isHost, onBack, sourceSubmissions, sourceType }) => {
  const [phase, setPhase] = useState('browse'); // browse, remix, submitted, vote, results
  const [selectedOriginal, setSelectedOriginal] = useState(null);
  const [remixes, setRemixes] = useState([]);
  const [myVote, setMyVote] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const submissions = sourceSubmissions || [];
  const type = sourceType || 'code'; // 'meme' or 'code'

  const handleFork = (submission) => {
    setSelectedOriginal(submission);
    setPhase('remix');
  };

  const handleSubmitRemix = (remix) => {
    const playerName = Object.values(room?.players || {}).find(p => p.id === userId)?.name || 'Player';
    const newRemix = { ...remix, playerId: userId, playerName, reactions: {} };
    setRemixes(prev => [...prev, newRemix]);
    setHasSubmitted(true);
    setPhase('submitted');
  };

  const handleVote = (remixIndex) => {
    if (myVote !== null) return;
    setMyVote(remixIndex);
    setRemixes(prev => prev.map((r, i) => i === remixIndex ? { ...r, votes: (r.votes || 0) + 1 } : r));
  };

  const handleReact = (remixIndex, reactionName) => {
    setRemixes(prev => prev.map((r, i) => {
      if (i !== remixIndex) return r;
      return { ...r, reactions: { ...r.reactions, [reactionName]: (r.reactions?.[reactionName] || 0) + 1 } };
    }));
  };

  const calculateAwards = () => {
    const awards = {};

    // Best Remix - most votes
    const byVotes = [...remixes].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    awards.bestRemix = byVotes[0]?.playerName || 'TBD';

    // Most Remixed Original
    const forkCounts = {};
    remixes.forEach(r => { forkCounts[r.originalPlayerName] = (forkCounts[r.originalPlayerName] || 0) + 1; });
    const mostForked = Object.entries(forkCounts).sort(([,a], [,b]) => b - a)[0];
    awards.mostRemixed = mostForked?.[0] || 'TBD';

    // Best Collaborator - longest changes description
    const byChanges = [...remixes].sort((a, b) => (b.changes?.length || 0) - (a.changes?.length || 0));
    awards.bestCollaborator = byChanges[0]?.playerName || 'TBD';

    return awards;
  };

  // ============================================
  // RENDER
  // ============================================

  if (phase === 'remix' && selectedOriginal) {
    return (
      <RemixEditor
        original={selectedOriginal}
        type={type}
        onSubmit={handleSubmitRemix}
        onBack={() => setPhase('browse')}
      />
    );
  }

  if (phase === 'submitted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <FloatingParticles count={25} />
        <div className="max-w-lg mx-auto text-center relative z-10">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-black text-white mb-4">Remix Submitted!</h2>
          <p className="text-purple-300 mb-8">Waiting for other players to finish their remixes...</p>

          {isHost && remixes.length > 0 && (
            <Button onClick={() => setPhase('vote')} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 font-bold rounded-xl text-lg">
              Start Voting ({remixes.length} remix{remixes.length !== 1 ? 'es' : ''})
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'vote') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
        <FloatingParticles count={30} />
        <div className="max-w-6xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔀</div>
            <h1 className="text-4xl font-black text-white mb-2">Remix Showcase</h1>
            <p className="text-purple-300">React and vote for the best remix!</p>
          </div>

          <RemixGallery remixes={remixes} originals={submissions} type={type} onVote={handleVote} myVote={myVote} onReact={handleReact} userId={userId} />

          {myVote !== null && <div className="text-center mt-6"><p className="text-emerald-400">✓ You voted!</p></div>}

          {isHost && (
            <div className="text-center mt-8">
              <Button onClick={() => setPhase('results')} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-12 py-4 font-bold rounded-xl text-lg">
                🏆 Show Results
              </Button>
            </div>
          )}
        </div>
        <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">← Exit</button>
      </div>
    );
  }

  if (phase === 'results') {
    const awards = calculateAwards();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-y-auto">
        <FloatingParticles count={40} />
        <div className="max-w-4xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🏆</div>
            <h1 className="text-4xl font-black text-white mb-2">REMIX AWARDS</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <AwardCard award={AWARDS.bestRemix} winner={awards.bestRemix} />
            <AwardCard award={AWARDS.mostRemixed} winner={awards.mostRemixed} />
            <AwardCard award={AWARDS.bestCollaborator} winner={awards.bestCollaborator} />
          </div>

          {/* Educational takeaway */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 mb-8 text-center">
            <h3 className="text-lg font-bold text-purple-300 mb-3">🧠 What Did We Learn?</h3>
            <ul className="space-y-2 text-sm text-slate-300 text-left max-w-xl mx-auto">
              <li>• Great ideas build on other ideas - that's how innovation works!</li>
              <li>• Iteration and remixing are core to creative collaboration</li>
              <li>• Giving clear descriptions of changes helps AI (and humans) understand your vision</li>
              <li>• The best results come from combining different perspectives</li>
            </ul>
          </div>

          <div className="text-center">
            <Button onClick={onBack} className="bg-cyan-600 text-white px-8 py-3 font-bold rounded-xl">Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  // Browse phase (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
      <FloatingParticles count={25} />
      <div className="max-w-6xl mx-auto py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔀</div>
          <h1 className="text-4xl font-black text-white mb-2">Remix Mode</h1>
          <p className="text-purple-300">Pick someone's {type === 'meme' ? 'meme' : 'app'} to remix and make your own!</p>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-400">No submissions to remix yet. Play a game first!</p>
            <Button onClick={onBack} className="mt-4 bg-slate-700 text-white px-6 py-2 rounded-xl">Back to Home</Button>
          </div>
        ) : (
          <>
            {hasSubmitted && (
              <Alert type="info">You've already submitted a remix! Browse others while waiting.</Alert>
            )}
            <div className={`grid gap-6 ${type === 'meme' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {submissions.map((sub, i) => (
                <SubmissionCard
                  key={i}
                  submission={sub}
                  type={type}
                  onFork={handleFork}
                  isMine={sub.playerId === userId || hasSubmitted}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">← Exit</button>
    </div>
  );
};

export default RemixMode;

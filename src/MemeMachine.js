// MEME MACHINE v8 - Enhanced AI Integration, Prompt Engineering Education & Señor Slop Battle
// Build, Learn Prompting, Defeat Slop, Iterate, React, Vote, Go Viral!

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Alert } from './components';
import { updateGamePhase, submitToGame, submitVote, updatePlayerScore } from './firebase';
import { chatCompletion, generateImage, hasApiKey, getProviderForGame, getApiKey } from './ai-services';

// ============================================
// SCORING & AWARDS
// ============================================

const AWARDS = {
  mostViral: { name: 'Most Viral', icon: '🚀', description: 'Most total reactions' },
  mostDank: { name: 'Most Dank', icon: '🔥', description: 'Most player votes' },
  slopSlayer: { name: 'Slop Slayer', icon: '⚔️', description: 'Best prompt engineering' },
};

const REACTIONS = [
  { emoji: '😂', name: 'funny', points: 2 },
  { emoji: '🔥', name: 'fire', points: 3 },
  { emoji: '💯', name: 'perfect', points: 4 },
  { emoji: '🤔', name: 'thinking', points: 1 },
  { emoji: '😮', name: 'wow', points: 2 },
  { emoji: '👏', name: 'clap', points: 2 },
  { emoji: '🚀', name: 'viral', points: 5 },
  { emoji: '💀', name: 'dead', points: 3 },
];

const COMMUNITY_ISSUES = [
  { id: 'climate', name: 'Climate Action', emoji: '🌍', color: 'from-green-500 to-emerald-600' },
  { id: 'housing', name: 'Affordable Housing', emoji: '🏠', color: 'from-blue-500 to-indigo-600' },
  { id: 'education', name: 'Education Access', emoji: '📚', color: 'from-purple-500 to-violet-600' },
  { id: 'health', name: 'Public Health', emoji: '🏥', color: 'from-red-500 to-rose-600' },
  { id: 'transit', name: 'Public Transit', emoji: '🚌', color: 'from-yellow-500 to-amber-600' },
  { id: 'safety', name: 'Community Safety', emoji: '🛡️', color: 'from-cyan-500 to-teal-600' },
  { id: 'voting', name: 'Civic Engagement', emoji: '🗳️', color: 'from-indigo-500 to-purple-600' },
  { id: 'custom', name: 'Your Own Issue', emoji: '✨', color: 'from-gray-500 to-gray-700' },
];

// Image Style Options
const IMAGE_STYLES = [
  { id: 'photorealistic', name: 'Photo Realistic', emoji: '📷', description: 'Like a real photograph' },
  { id: 'illustration', name: 'Digital Art', emoji: '🎨', description: 'Clean digital illustration' },
  { id: 'cartoon', name: 'Cartoon', emoji: '🖌️', description: 'Fun, exaggerated style' },
  { id: 'propaganda', name: 'Propaganda Poster', emoji: '📜', description: 'Bold, activist style' },
  { id: 'watercolor', name: 'Watercolor', emoji: '💧', description: 'Soft, artistic feel' },
  { id: 'comic', name: 'Comic Book', emoji: '💥', description: 'Dynamic action style' },
];

const MOOD_OPTIONS = [
  { id: 'hopeful', name: 'Hopeful', emoji: '🌅' },
  { id: 'urgent', name: 'Urgent', emoji: '⚡' },
  { id: 'emotional', name: 'Emotional', emoji: '💔' },
  { id: 'satirical', name: 'Satirical', emoji: '😏' },
  { id: 'inspiring', name: 'Inspiring', emoji: '✨' },
  { id: 'shocking', name: 'Shocking', emoji: '😱' },
];

// ============================================
// SEÑOR SLOP - THE VILLAIN
// ============================================

const SenorSlop = ({ show, message, onDefeat, slopTips }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-lg w-full mx-4 border-4 border-gray-600 shadow-2xl">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">🦥</div>
          <h2 className="text-3xl font-black text-gray-400 mb-2">SEÑOR SLOP</h2>
          <p className="text-gray-500 text-sm mb-4 italic">"Why try when you can be mediocre?"</p>
          <div className="bg-gray-700/50 rounded-xl p-4 mb-4">
            <p className="text-gray-300">{message}</p>
          </div>
          
          {slopTips && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4 text-left">
              <p className="text-amber-400 font-bold mb-2">⚔️ How to defeat me:</p>
              <ul className="text-amber-300/80 text-sm space-y-1">
                {slopTips.map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          <Button onClick={onDefeat} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 font-bold rounded-xl">
            ⚔️ I'll Write Better Prompts!
          </Button>
        </div>
      </div>
    </div>
  );
};

const SlopWarning = ({ slopLevel, slopMessage }) => {
  if (slopLevel < 1) return null;
  
  const warnings = [
    { level: 1, msg: slopMessage || "Señor Slop is watching... Your content could be sharper!", color: "amber" },
    { level: 2, msg: slopMessage || "Señor Slop grows stronger! Make your message more specific!", color: "orange" },
    { level: 3, msg: slopMessage || "🚨 Señor Slop is taking over! Your meme needs MORE MEANING!", color: "red" },
  ];
  
  const warning = warnings[Math.min(slopLevel - 1, 2)];
  
  return (
    <div className={`bg-${warning.color}-500/20 border border-${warning.color}-500/50 rounded-xl p-4 mb-4`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl animate-pulse">🦥</span>
        <div>
          <p className="text-white font-bold">Señor Slop Alert!</p>
          <p className={`text-${warning.color}-400 text-sm`}>{warning.msg}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTS
// ============================================

const FloatingParticles = ({ count = 20 }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="absolute text-2xl animate-float" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${15 + Math.random() * 10}s` }}>
        {['✨', '🎨', '💡', '🔥', '⚡'][i % 5]}
      </div>
    ))}
    <style>{`
      @keyframes float { 0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; } 10% { opacity: 0.5; } 90% { opacity: 0.5; } 100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }
      .animate-float { animation: float linear infinite; }
      @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
    `}</style>
  </div>
);

const BigTimer = ({ seconds, totalSeconds }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 100;
  
  return (
    <div className={`rounded-2xl p-4 ${seconds <= 10 ? 'bg-gradient-to-r from-red-600 to-rose-600 animate-pulse' : seconds <= 30 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}>
      <div className="flex items-center justify-between text-white">
        <div className="text-sm font-medium opacity-80">⏱️ TIME</div>
        <div className="text-4xl font-mono font-black">{mins}:{secs.toString().padStart(2, '0')}</div>
      </div>
      <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white/60 transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

const ByteHost = ({ message, mood = 'happy', typing = false }) => {
  const moods = { happy: '🤖', thinking: '🤔', excited: '🎉', proud: '✨', teaching: '🎓', warning: '⚠️', judging: '🧐' };
  return (
    <div className="flex items-start gap-4 bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 border border-slate-700">
      <div className={`text-4xl ${mood === 'excited' ? 'animate-bounce' : ''}`}>{moods[mood]}</div>
      <div className="flex-1">
        <div className="text-cyan-400 font-bold text-sm mb-1">BYTE</div>
        <div className="text-slate-100 leading-relaxed">
          {typing ? (
            <span className="inline-flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
            </span>
          ) : message}
        </div>
      </div>
    </div>
  );
};

// Slider Component
const Slider = ({ label, value, onChange, min = 0, max = 100, leftLabel, rightLabel }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-white font-medium text-sm">{label}</label>
      <span className="text-amber-400 font-bold">{value}%</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
    />
    <div className="flex justify-between text-xs text-slate-500">
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
    </div>
  </div>
);

// Enhanced Prompt Enhancer with Education
const PromptEnhancerEducational = ({ 
  originalPrompt, 
  enhancedPrompt, 
  explanation,
  onAccept, 
  onEdit, 
  onRegenerate, 
  isLoading,
  error 
}) => (
  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-5 border border-cyan-500/30">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-2xl">✨</span>
      <h4 className="text-cyan-400 font-bold">BYTE's Prompt Engineering Lab</h4>
    </div>
    
    {isLoading ? (
      <div className="bg-slate-900/50 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full" />
          <span className="text-slate-300">Analyzing and enhancing your prompt...</span>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-700 rounded animate-pulse w-full" />
          <div className="h-3 bg-slate-700 rounded animate-pulse w-4/5" />
          <div className="h-3 bg-slate-700 rounded animate-pulse w-3/4" />
        </div>
      </div>
    ) : error ? (
      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4">
        <p className="text-red-400 font-medium mb-2">⚠️ Enhancement Failed</p>
        <p className="text-red-300 text-sm mb-3">{error}</p>
        <p className="text-slate-400 text-sm">Using a basic enhancement instead. You can still edit it manually!</p>
      </div>
    ) : (
      <>
        {/* Original vs Enhanced Comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-900/50 rounded-xl p-4 border-l-4 border-gray-500">
            <p className="text-sm text-gray-400 mb-2 font-medium">👤 YOUR ORIGINAL:</p>
            <p className="text-gray-300 text-sm">"{originalPrompt}"</p>
          </div>
          
          <div className="bg-slate-900/50 rounded-xl p-4 border-l-4 border-cyan-400">
            <p className="text-sm text-cyan-400 mb-2 font-medium">✨ ENHANCED VERSION:</p>
            <p className="text-white text-sm">{enhancedPrompt}</p>
          </div>
        </div>
        
        {/* Educational Explanation */}
        {explanation && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
            <p className="text-amber-400 font-bold mb-2">🎓 Why is this better?</p>
            <div className="text-amber-200/90 text-sm space-y-2">
              {explanation.split('\n').filter(l => l.trim()).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 flex-wrap">
          <Button onClick={onAccept} className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg text-sm font-bold">
            ✓ Use Enhanced
          </Button>
          <Button onClick={onEdit} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm">
            ✏️ Edit Myself
          </Button>
          <Button onClick={onRegenerate} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm">
            🔄 Try Again
          </Button>
        </div>
      </>
    )}
  </div>
);

// AI Feedback Component for Image Judging
const AIFeedback = ({ feedback, isLoading, onAcceptAndSubmit, onIterate }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-5 border border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full" />
          <span className="text-slate-300">BYTE is analyzing your meme...</span>
        </div>
      </div>
    );
  }
  
  if (!feedback) return null;
  
  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-5 border border-purple-500/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🧐</span>
        <h4 className="text-purple-400 font-bold">BYTE's Meme Analysis</h4>
      </div>
      
      {/* Scores */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-3 text-center">
          <div className="text-3xl font-black text-cyan-400">{feedback.messageClarity}/10</div>
          <div className="text-xs text-slate-400">Message Clarity</div>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-3 text-center">
          <div className="text-3xl font-black text-amber-400">{feedback.civicRelevance}/10</div>
          <div className="text-xs text-slate-400">Civic Relevance</div>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-3 text-center">
          <div className="text-3xl font-black text-pink-400">{feedback.viralPotential}/10</div>
          <div className="text-xs text-slate-400">Viral Potential</div>
        </div>
      </div>
      
      {/* Overall Feedback */}
      <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
        <p className="text-white">{feedback.overallFeedback}</p>
      </div>
      
      {/* Suggestions */}
      {feedback.suggestions && feedback.suggestions.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
          <p className="text-amber-400 font-bold mb-2">💡 Suggestions to improve:</p>
          <ul className="text-amber-200/90 text-sm space-y-1">
            {feedback.suggestions.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Slop Score */}
      {feedback.slopScore !== undefined && (
        <div className={`rounded-xl p-3 mb-4 ${feedback.slopScore <= 3 ? 'bg-emerald-500/20 border border-emerald-500/30' : feedback.slopScore <= 6 ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">🦥 Slop Resistance Score:</span>
            <span className={`font-black text-xl ${feedback.slopScore <= 3 ? 'text-emerald-400' : feedback.slopScore <= 6 ? 'text-amber-400' : 'text-red-400'}`}>
              {10 - feedback.slopScore}/10
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {feedback.slopScore <= 3 ? "Excellent! Señor Slop has been defeated!" : 
             feedback.slopScore <= 6 ? "Good work, but Señor Slop is still lurking..." :
             "Señor Slop is strong here! Add more specificity!"}
          </p>
        </div>
      )}
      
      <div className="flex gap-3">
        <Button onClick={onIterate} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium">
          🔄 Refine & Regenerate
        </Button>
        <Button onClick={onAcceptAndSubmit} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-bold">
          🚀 Submit Meme!
        </Button>
      </div>
    </div>
  );
};

const CaptionEnhancer = ({ originalCaption, suggestions, onSelect, isLoading }) => (
  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-5 border border-amber-500/30">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-2xl">💬</span>
      <h4 className="text-amber-400 font-bold">BYTE's Caption Ideas</h4>
    </div>
    
    {isLoading ? (
      <div className="flex items-center gap-3 p-4">
        <div className="animate-spin w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full" />
        <span className="text-slate-400">Crafting punchy captions...</span>
      </div>
    ) : (
      <div className="space-y-2">
        {suggestions.map((caption, i) => (
          <button key={i} onClick={() => onSelect(caption)} 
            className="w-full text-left bg-slate-900/50 hover:bg-slate-800 rounded-xl p-3 border border-transparent hover:border-amber-500/50 transition-all">
            <p className="text-white font-medium">{caption}</p>
          </button>
        ))}
      </div>
    )}
  </div>
);

const MemePreview = ({ imageUrl, caption, style, position, textColor, onDownload }) => {
  const fonts = { impact: 'Impact, sans-serif', bold: 'Arial Black, sans-serif', modern: 'system-ui, sans-serif', serif: 'Georgia, serif' };
  const captionStyle = { fontFamily: fonts[style] || fonts.impact, color: textColor || '#FFFFFF', textShadow: '2px 2px 4px rgba(0,0,0,0.9)' };
  const parts = caption?.split('\\n') || [caption];
  
  return (
    <div className="relative">
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-square">
        {imageUrl ? <img src={imageUrl} alt="Meme" className="w-full h-full object-cover" /> : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <div className="text-center text-slate-500"><div className="text-6xl mb-4">🖼️</div><p>Your meme preview</p></div>
          </div>
        )}
        {caption && (position === 'top' || position === 'both') && (
          <div className="absolute top-0 left-0 right-0 bg-black/70 p-4"><p className="text-center text-xl md:text-2xl font-bold" style={captionStyle}>{parts[0]}</p></div>
        )}
        {caption && (position === 'bottom' || position === 'both') && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4"><p className="text-center text-xl md:text-2xl font-bold" style={captionStyle}>{position === 'both' ? (parts[1] || parts[0]) : caption}</p></div>
        )}
      </div>
      
      {imageUrl && onDownload && (
        <button onClick={onDownload} className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      )}
    </div>
  );
};

const ReactionBar = ({ reactions, onReact, disabled, userReactions = {} }) => (
  <div className="flex gap-2 flex-wrap justify-center">
    {REACTIONS.map(r => (
      <button key={r.name} onClick={() => onReact(r.name)} disabled={disabled || userReactions[r.name]}
        className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all ${
          userReactions[r.name] 
            ? 'bg-amber-500/30 border-2 border-amber-500' 
            : disabled 
              ? 'bg-slate-700 opacity-50' 
              : 'bg-slate-700 hover:bg-slate-600 hover:scale-110'
        }`}>
        <span className="text-xl">{r.emoji}</span>
        <span className="text-white text-sm font-bold">{reactions?.[r.name] || 0}</span>
      </button>
    ))}
  </div>
);

const MemeCard = ({ meme, onReact, onComment, onVote, onShare, hasVoted, isOwnMeme, showComments = false, userReactions = {}, canInteract = true }) => {
  const [comment, setComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [shareCount, setShareCount] = useState(meme.shares || Math.floor(Math.random() * 50));
  
  const totalReactions = Object.values(meme.reactions || {}).reduce((a, b) => a + b, 0);
  const disabled = isOwnMeme || !canInteract;
  
  const handleShare = () => {
    if (!canInteract) return;
    setShareCount(prev => prev + 1);
    onShare && onShare(meme.playerId);
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = meme.imageUrl;
    link.download = `meme-${meme.playerName}-${Date.now()}.png`;
    link.click();
  };
  
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 transform hover:scale-[1.02] transition-all">
      <div className="relative aspect-square">
        <img src={meme.imageUrl} alt="Meme" className="w-full h-full object-cover" />
        {meme.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3">
            <p className="text-white font-bold text-center" style={{ fontFamily: 'Impact, sans-serif', textShadow: '2px 2px 4px black' }}>{meme.caption}</p>
          </div>
        )}
        
        <button onClick={handleDownload} className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-bold">{meme.playerName}</p>
            <p className="text-slate-400 text-sm">{meme.issue}</p>
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-bold">{totalReactions} reactions</div>
            <div className="text-slate-500 text-xs">{shareCount} shares</div>
          </div>
        </div>
        
        <ReactionBar reactions={meme.reactions} onReact={(r) => onReact && onReact(meme.playerId, r)} disabled={disabled} userReactions={userReactions[meme.playerId] || {}} />
        
        <button onClick={handleShare} disabled={disabled}
          className={`w-full mt-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${
            disabled ? 'bg-slate-700 text-slate-500' : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
          }`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {canInteract ? 'Share to make viral!' : 'Submit to interact'}
        </button>
        
        {!disabled && !hasVoted && onVote && (
          <button onClick={() => onVote(meme.playerId)} className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-2 rounded-lg font-bold text-sm">
            🏆 Vote for Best Meme
          </button>
        )}
        
        {hasVoted && meme.playerId === hasVoted && (
          <div className="w-full mt-2 bg-emerald-500/20 text-emerald-400 py-2 rounded-lg font-bold text-sm text-center">
            ✓ Your Vote
          </div>
        )}
        
        {showComments && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">{(meme.comments || []).length} comments</span>
              {(meme.comments || []).length > 2 && (
                <button onClick={() => setShowAllComments(!showAllComments)} className="text-cyan-400 text-xs">
                  {showAllComments ? 'Show less' : 'Show all'}
                </button>
              )}
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
              {(showAllComments ? meme.comments : (meme.comments || []).slice(-3)).map((c, i) => (
                <div key={i} className="bg-slate-900 rounded-lg p-2 text-sm">
                  <span className="text-cyan-400 font-medium">{c.author}:</span>
                  <span className="text-slate-300 ml-2">{c.text}</span>
                </div>
              ))}
            </div>
            
            {!isOwnMeme && canInteract && (
              <div className="flex gap-2">
                <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..."
                  className="flex-1 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm outline-none border border-slate-600 focus:border-amber-500" 
                  onKeyPress={(e) => e.key === 'Enter' && comment && (onComment(meme.playerId, comment), setComment(''))} />
                <button onClick={() => { if (comment) { onComment(meme.playerId, comment); setComment(''); } }}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Post</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AwardCard = ({ award, winner }) => (
  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30 text-center">
    <div className="text-6xl mb-3">{award.icon}</div>
    <h3 className="text-2xl font-black text-amber-400">{award.name}</h3>
    <p className="text-slate-400 text-sm mb-4">{award.description}</p>
    <div className="bg-amber-500 rounded-xl p-4">
      <p className="text-white text-2xl font-black">{winner}</p>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const MemeMachine = ({ gameCode, room, userId, isHost, onBack, onOpenDashboard }) => {
  // Build state
  const [stage, setStage] = useState('intro');
  const [selectedIssue, setSelectedIssue] = useState('');
  const [customIssue, setCustomIssue] = useState('');
  const [visualConcept, setVisualConcept] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [promptExplanation, setPromptExplanation] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState('');
  const [genProgress, setGenProgress] = useState(0);
  const [iterationCount, setIterationCount] = useState(0);
  
  // Image Style Controls
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [selectedMood, setSelectedMood] = useState('urgent');
  const [realismLevel, setRealismLevel] = useState(70);
  const [dramaticLevel, setDramaticLevel] = useState(60);
  const [colorVibrancy, setColorVibrancy] = useState(50);
  
  // Caption
  const [caption, setCaption] = useState('');
  const [captionSuggestions, setCaptionSuggestions] = useState([]);
  const [isLoadingCaptions, setIsLoadingCaptions] = useState(false);
  const [captionStyle, setCaptionStyle] = useState('impact');
  const [captionPosition, setCaptionPosition] = useState('bottom');
  const [captionColor, setCaptionColor] = useState('#FFFFFF');
  
  // AI Feedback
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  
  // Señor Slop
  const [slopLevel, setSlopLevel] = useState(0);
  const [showSlop, setShowSlop] = useState(false);
  const [slopMessage, setSlopMessage] = useState('');
  const [slopTips, setSlopTips] = useState([]);
  
  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(300);
  const [timerSetting, setTimerSetting] = useState(300);
  
  // Virality
  const [userReactions, setUserReactions] = useState({});
  const [myVote, setMyVote] = useState(null);
  
  // Submit
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const getIssueName = () => selectedIssue === 'custom' ? customIssue : COMMUNITY_ISSUES.find(i => i.id === selectedIssue)?.name || '';
  
  // Timer
  useEffect(() => {
    if (room?.phase === 'build' && timeLeft === 0) {
      setTimeLeft(room?.timerSeconds || timerSetting);
      setTotalTime(room?.timerSeconds || timerSetting);
    }
    if (room?.phase !== 'build' || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [room?.phase, timeLeft]);
  
  // Check for Señor Slop based on prompt quality
  const checkForSlop = (text) => {
    const slopIndicators = [
      { check: text.length < 20, tip: "Add more detail - aim for at least 30 words" },
      { check: /^(a |an |the )?\w+$/i.test(text.trim()), tip: "Use descriptive phrases, not just single words" },
      { check: !/\b(detailed|specific|colorful|dramatic|showing|depicting|featuring|close-up|wide shot)\b/i.test(text), tip: "Include visual directions like 'close-up', 'wide shot', etc." },
      { check: (text.match(/\s/g) || []).length < 5, tip: "Add more descriptive elements to your prompt" },
      { check: !/\b(lighting|light|shadow|sun|bright|dark|glow)\b/i.test(text), tip: "Mention lighting to set the mood" },
      { check: !/\b(emotion|feeling|expression|mood)\b/i.test(text) && !/\b(sad|happy|angry|worried|hopeful)\b/i.test(text), tip: "Describe the emotional impact you want" },
    ];
    
    const failedChecks = slopIndicators.filter(s => s.check);
    const newSlopLevel = failedChecks.length;
    setSlopLevel(newSlopLevel);
    
    if (newSlopLevel >= 3) {
      const messages = [
        "Yawwwn... such a vague prompt. Let Señor Slop handle this with minimal effort...",
        "Ahh, the sweet smell of mediocrity! This prompt is music to my lazy ears!",
        "Why bother with details? Generic is my middle name!",
        "Perfect! Another forgettable meme coming right up..."
      ];
      setSlopMessage(messages[Math.floor(Math.random() * messages.length)]);
      setSlopTips(failedChecks.slice(0, 3).map(c => c.tip));
      setShowSlop(true);
    }
    
    return newSlopLevel;
  };
  
  // Build the full prompt with style settings
  const buildFullPrompt = (basePrompt) => {
    const styleObj = IMAGE_STYLES.find(s => s.id === selectedStyle);
    const moodObj = MOOD_OPTIONS.find(m => m.id === selectedMood);
    
    const styleDescriptions = {
      photorealistic: realismLevel > 50 ? 'ultra-realistic photograph, photojournalism style' : 'realistic digital image',
      illustration: 'clean digital illustration, vector art style',
      cartoon: 'cartoon style, vibrant colors, exaggerated features',
      propaganda: 'bold propaganda poster style, high contrast, impactful',
      watercolor: 'watercolor painting, soft edges, artistic',
      comic: 'comic book style, dynamic lines, action-oriented'
    };
    
    const moodDescriptions = {
      hopeful: 'hopeful atmosphere, warm lighting, optimistic mood',
      urgent: 'urgent atmosphere, dramatic tension, compelling',
      emotional: 'emotionally powerful, evocative, touching',
      satirical: 'satirical, ironic undertone, clever commentary',
      inspiring: 'inspiring, uplifting, motivational feel',
      shocking: 'shocking, attention-grabbing, stark contrast'
    };
    
    let fullPrompt = basePrompt;
    fullPrompt += `. Style: ${styleDescriptions[selectedStyle] || 'professional quality'}`;
    fullPrompt += `. Mood: ${moodDescriptions[selectedMood] || 'impactful'}`;
    
    if (dramaticLevel > 70) {
      fullPrompt += '. Highly dramatic lighting and composition';
    } else if (dramaticLevel > 40) {
      fullPrompt += '. Moderately dramatic presentation';
    }
    
    if (colorVibrancy > 70) {
      fullPrompt += '. Vibrant, saturated colors';
    } else if (colorVibrancy < 30) {
      fullPrompt += '. Muted, subdued color palette';
    }
    
    fullPrompt += '. NO TEXT in the image. High quality, shareable content.';
    
    return fullPrompt;
  };
  
  // Enhance prompt with BYTE - with educational explanation
  const enhancePromptWithByte = async () => {
    if (!visualConcept) return;
    setIsEnhancing(true);
    setEnhancedPrompt('');
    setPromptExplanation('');
    setEnhanceError('');
    
    const chatProvider = getProviderForGame('memeMachine', 'chat');
    console.log(`[MemeMachine] Using chat provider: ${chatProvider}`);
    console.log(`[MemeMachine] API key exists: ${hasApiKey(chatProvider)}`);
    
    // Check if we have an API key
    if (!hasApiKey(chatProvider)) {
      console.warn('[MemeMachine] No API key for chat provider, using fallback');
      setEnhanceError(`No API key configured for ${chatProvider}. Using basic enhancement.`);
      const fallbackPrompt = buildFullPrompt(visualConcept);
      setEnhancedPrompt(fallbackPrompt);
      setPromptExplanation("I added style and mood settings to your prompt. Configure an AI API key in settings for more personalized enhancements!");
      setIsEnhancing(false);
      return;
    }
    
    try {
      console.log('[MemeMachine] Enhancing prompt:', visualConcept);
      console.log('[MemeMachine] Issue:', getIssueName());
      console.log('[MemeMachine] Style:', selectedStyle, 'Mood:', selectedMood);
      
      const response = await chatCompletion([
        { 
          role: 'system', 
          content: `You are BYTE, an AI mentor teaching users about prompt engineering for image generation. Your job is to:
1. Transform basic visual concepts into detailed, compelling image prompts
2. EXPLAIN WHY your enhancements make the prompt better (this is educational!)

Rules for the enhanced prompt:
- NO TEXT should appear in the image (captions are added separately)
- Focus on emotional impact and visual storytelling
- Include specific details: lighting, composition, camera angle, mood
- Make it shareable and memorable
- Keep it appropriate for all audiences
- The image should clearly relate to the civic/social issue

You MUST respond in this EXACT JSON format:
{
  "enhancedPrompt": "Your detailed enhanced prompt here...",
  "explanation": "Line 1 explaining a key improvement\\nLine 2 explaining another improvement\\nLine 3 with a final tip"
}

Do NOT include any text outside the JSON. Your response should be valid JSON only.`
        },
        { 
          role: 'user', 
          content: `Issue: ${getIssueName()}
User's visual concept: "${visualConcept}"
Selected style: ${selectedStyle}
Selected mood: ${selectedMood}
Realism level: ${realismLevel}%
Dramatic level: ${dramaticLevel}%
Color vibrancy: ${colorVibrancy}%

Create a detailed image prompt and explain why your version is better for creating a viral advocacy meme.`
        }
      ], { maxTokens: 1000, temperature: 0.8, provider: chatProvider });
      
      console.log('[MemeMachine] Raw AI response:', response);
      
      if (!response || response.trim().length < 10) {
        throw new Error('AI returned empty or very short response');
      }
      
      // Try to parse JSON response
      let parsed;
      try {
        // Clean up the response - remove any markdown code blocks
        let cleanedResponse = response.trim();
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        // Try to find JSON in the response
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.warn('[MemeMachine] JSON parse failed, extracting text:', parseError);
        // Fallback: use the whole response as the enhanced prompt
        parsed = {
          enhancedPrompt: response.trim(),
          explanation: "I've enhanced your prompt with more specific visual details, lighting directions, and emotional cues to create a more compelling image."
        };
      }
      
      const enhanced = parsed.enhancedPrompt || parsed.enhanced_prompt || response.trim();
      const explanation = parsed.explanation || parsed.why_better || '';
      
      console.log('[MemeMachine] Parsed enhanced prompt:', enhanced);
      console.log('[MemeMachine] Parsed explanation:', explanation);
      
      // Add style settings to the enhanced prompt
      const fullEnhancedPrompt = buildFullPrompt(enhanced);
      
      setEnhancedPrompt(fullEnhancedPrompt);
      setPromptExplanation(explanation || "I've added specific visual details, lighting directions, and composition guidance to help create a more impactful image for your cause.");
      
      // Check if the enhanced prompt is still "sloppy"
      checkForSlop(fullEnhancedPrompt);
      
    } catch (e) {
      console.error('[MemeMachine] Enhancement failed:', e);
      console.error('[MemeMachine] Error details:', e.message, e.stack);
      
      setEnhanceError(e.message || 'Enhancement failed');
      
      // Create a basic enhancement as fallback
      const fallbackPrompt = buildFullPrompt(visualConcept);
      setEnhancedPrompt(fallbackPrompt);
      setPromptExplanation("I couldn't get AI enhancement, but I've applied your style and mood settings. Try being more specific about:\n• What's in the scene (people, objects, setting)\n• The lighting and atmosphere\n• The emotional impact you want");
    } finally {
      setIsEnhancing(false);
    }
  };
  
  // Generate caption suggestions
  const generateCaptionSuggestions = async () => {
    setIsLoadingCaptions(true);
    const chatProvider = getProviderForGame('memeMachine', 'chat');
    
    if (!hasApiKey(chatProvider)) {
      setCaptionSuggestions([
        "Make a difference today.",
        "This affects us all.",
        "Change starts with you.",
        "See the truth."
      ]);
      setIsLoadingCaptions(false);
      return;
    }
    
    try {
      const response = await chatCompletion([
        { 
          role: 'system', 
          content: `You are BYTE, helping create viral meme captions for civic advocacy. Generate 4 punchy, memorable captions that:
- Are short and impactful (under 10 words ideally)
- Use humor, irony, or emotional appeal
- Relate directly to the civic/social issue
- Would make people share the meme
- Are appropriate for all audiences

Return ONLY the 4 captions as a JSON array of strings, nothing else. Example: ["Caption 1", "Caption 2", "Caption 3", "Caption 4"]`
        },
        { 
          role: 'user', 
          content: `Issue: ${getIssueName()}
Image shows: ${imagePrompt}

Generate 4 viral-worthy caption options.`
        }
      ], { maxTokens: 300, provider: chatProvider });
      
      let captions;
      try {
        captions = JSON.parse(response.trim());
      } catch {
        captions = response.trim().split('\n').filter(c => c.trim()).slice(0, 4);
      }
      
      setCaptionSuggestions(Array.isArray(captions) ? captions : [response]);
    } catch (e) {
      console.error('[MemeMachine] Caption generation failed:', e);
      setCaptionSuggestions([
        "Make it count.",
        "This is the moment.",
        "Change starts here.",
        "No more excuses."
      ]);
    } finally {
      setIsLoadingCaptions(false);
    }
  };
  
  // AI Judge the meme
  const judgeMeme = async () => {
    setIsLoadingFeedback(true);
    const chatProvider = getProviderForGame('memeMachine', 'chat');
    
    if (!hasApiKey(chatProvider)) {
      // Provide basic feedback without AI
      setAiFeedback({
        messageClarity: 7,
        civicRelevance: 7,
        viralPotential: 6,
        overallFeedback: "Your meme looks good! Configure an AI API key in settings for detailed feedback.",
        suggestions: ["Add more specific details to your prompt", "Consider the emotional impact"],
        slopScore: slopLevel
      });
      setIsLoadingFeedback(false);
      return;
    }
    
    try {
      const response = await chatCompletion([
        { 
          role: 'system', 
          content: `You are BYTE, judging advocacy memes for civic impact. Analyze the meme and provide constructive feedback.

You MUST respond in this EXACT JSON format:
{
  "messageClarity": <number 1-10>,
  "civicRelevance": <number 1-10>,
  "viralPotential": <number 1-10>,
  "overallFeedback": "<2-3 sentence overall assessment>",
  "suggestions": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "slopScore": <number 1-10 where 10 is maximum slop/genericness>
}

Score criteria:
- messageClarity: Is the civic message immediately clear?
- civicRelevance: Does it effectively address the community issue?
- viralPotential: Would people actually share this?
- slopScore: How generic/lazy is the concept? (10 = very sloppy, 1 = very specific)

Be encouraging but honest. This is educational.`
        },
        { 
          role: 'user', 
          content: `Judge this advocacy meme:

CIVIC ISSUE: ${getIssueName()}
IMAGE PROMPT USED: ${imagePrompt}
CAPTION: "${caption || '(no caption)'}"
ITERATION COUNT: ${iterationCount}

Provide your analysis.`
        }
      ], { maxTokens: 800, provider: chatProvider });
      
      let feedback;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          feedback = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        // Fallback feedback
        feedback = {
          messageClarity: 7,
          civicRelevance: 7,
          viralPotential: 6,
          overallFeedback: response.substring(0, 200),
          suggestions: ["Be more specific with your visual concept", "Add emotional elements"],
          slopScore: slopLevel
        };
      }
      
      setAiFeedback(feedback);
      
      // Show Señor Slop if slop score is high
      if (feedback.slopScore >= 7) {
        setSlopMessage("Ha! Even with all that effort, your meme is still pretty generic! Señor Slop approves... but your audience won't!");
        setSlopTips([
          "Add specific, concrete imagery",
          "Include an unexpected element or twist",
          "Make the connection to the issue undeniable"
        ]);
        setShowSlop(true);
      }
      
    } catch (e) {
      console.error('[MemeMachine] Judging failed:', e);
      setAiFeedback({
        messageClarity: 7,
        civicRelevance: 7,
        viralPotential: 6,
        overallFeedback: "Looks like a solid meme! AI feedback unavailable but your iteration efforts show dedication.",
        suggestions: ["Keep refining your prompt for better results"],
        slopScore: slopLevel
      });
    } finally {
      setIsLoadingFeedback(false);
    }
  };
  
  const handleGenerateImage = async () => {
    const promptToUse = imagePrompt || enhancedPrompt;
    if (!promptToUse) return;
    
    // Check for API key
    if (!hasApiKey('openai') && !hasApiKey('gemini')) {
      alert('Please configure an OpenAI or Gemini API key in settings to generate images.');
      return;
    }
    
    setIsGenerating(true);
    setGenProgress(0);
    const interval = setInterval(() => setGenProgress(p => Math.min(p + Math.random() * 15, 90)), 500);
    
    try {
      console.log('[MemeMachine] Generating image with prompt:', promptToUse);
      const result = await generateImage(promptToUse);
      console.log('[MemeMachine] Image generated:', result.url ? 'success' : 'no url');
      setGeneratedImage(result.url);
      setGenProgress(100);
      setIterationCount(prev => prev + 1);
      
      // Clear previous feedback
      setAiFeedback(null);
      
    } catch (e) { 
      console.error('[MemeMachine] Image generation failed:', e);
      alert(`Image generation failed: ${e.message}`); 
    } finally { 
      clearInterval(interval); 
      setTimeout(() => setIsGenerating(false), 500); 
    }
  };
  
  const handleIterate = () => {
    setGeneratedImage('');
    setAiFeedback(null);
    setStage('styleSetup');
  };
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `meme-${Date.now()}.png`;
    link.click();
  };
  
  const handleSubmit = () => {
    submitToGame(gameCode, {
      type: 'meme-complete',
      playerId: userId,
      playerName: Object.values(room?.players || {}).find(p => p.id === userId)?.name,
      issue: getIssueName(),
      imageUrl: generatedImage,
      caption,
      prompt: imagePrompt,
      iterationCount,
      slopLevel,
      aiFeedback,
      reactions: {},
      comments: [],
      shares: 0,
      timestamp: Date.now()
    });
    setHasSubmitted(true);
    setStage('submitted');
  };
  
  // Virality Phase Handlers
  const handleReaction = (playerId, reaction) => {
    if (playerId === userId) return;
    
    // Track user reactions
    setUserReactions(prev => ({
      ...prev,
      [playerId]: { ...(prev[playerId] || {}), [reaction]: true }
    }));
    
    submitToGame(gameCode, { type: 'reaction', targetPlayerId: playerId, reaction, reactorId: userId });
  };
  
  const handleComment = (playerId, text) => {
    const playerName = Object.values(room?.players || {}).find(p => p.id === userId)?.name || 'Anonymous';
    submitToGame(gameCode, { type: 'comment', targetPlayerId: playerId, comment: { author: playerName, text, timestamp: Date.now() } });
  };
  
  const handleShare = (playerId) => {
    submitToGame(gameCode, { type: 'share', targetPlayerId: playerId, sharerId: userId });
  };
  
  const handleVote = (playerId) => {
    if (myVote || playerId === userId) return;
    setMyVote(playerId);
    submitVote(gameCode, playerId, userId);
  };
  
  const getMemes = () => {
    return Object.values(room?.submissions || {})
      .filter(s => s.type === 'meme-complete')
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  };
  
  const calculateAwards = () => {
    const memes = getMemes();
    
    const mostViral = memes.reduce((best, meme) => {
      const total = Object.values(meme.reactions || {}).reduce((a, b) => a + b, 0);
      return total > (best?.reactions || 0) ? { name: meme.playerName, reactions: total } : best;
    }, null);
    
    const players = Object.values(room?.players || {});
    const mostDank = players.reduce((best, player) => (player.votes || 0) > (best?.votes || 0) ? player : best, null);
    
    const slopSlayer = memes.reduce((best, meme) => {
      const score = meme.iterationCount || 0;
      return score > (best?.score || 0) ? { name: meme.playerName, score } : best;
    }, null);
    
    return { 
      mostViral: mostViral?.name || 'TBD', 
      mostDank: mostDank?.name || 'TBD', 
      slopSlayer: slopSlayer?.name || 'TBD' 
    };
  };
  
  // ============================================
  // RENDER FUNCTIONS
  // ============================================
  
  const renderLobby = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <FloatingParticles count={25} />
      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="text-8xl mb-6 animate-bounce">🎨</div>
        <h1 className="text-5xl font-black text-white mb-2">MEME</h1>
        <h2 className="text-4xl font-bold text-amber-400 mb-6">MACHINE</h2>
        <p className="text-xl text-slate-400 mb-4">Create memes that matter</p>
        
        {/* Villain intro */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🦥</span>
            <div className="text-left">
              <p className="text-gray-400 font-bold">VILLAIN: Señor Slop</p>
              <p className="text-gray-500 text-sm">"Why make something meaningful when you can be generic?"</p>
            </div>
          </div>
          <p className="text-amber-400 text-sm">⚔️ Defeat him with creative, specific prompts!</p>
        </div>
        
        <div className="bg-cyan-500/20 rounded-xl p-4 mb-6 border border-cyan-500/30">
          <p className="text-cyan-400 text-sm">🎓 <strong>Learn:</strong> BYTE will teach you prompt engineering while you create!</p>
        </div>
        
        <div className="bg-slate-800 rounded-2xl p-8 mb-8 border border-slate-700">
          <div className="text-4xl font-mono font-black text-amber-400 tracking-widest mb-2">{gameCode}</div>
          <p className="text-slate-500">Share to join</p>
        </div>
        
        <div className="mb-6">
          <p className="text-slate-500 mb-3">Players: {Object.keys(room?.players || {}).length}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.values(room?.players || {}).map(player => (
              <span key={player.id} className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">{player.name}</span>
            ))}
          </div>
        </div>
        
        {isHost && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <label className="block text-slate-400 text-sm mb-2">Timer (minutes)</label>
              <div className="flex gap-2 justify-center">
                {[3, 5, 7, 10].map(m => (
                  <button key={m} onClick={() => setTimerSetting(m * 60)}
                    className={`px-4 py-2 rounded-lg font-bold ${timerSetting === m * 60 ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {m}min
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => updateGamePhase(gameCode, 'build', { timerSeconds: timerSetting })} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 font-bold rounded-xl">Start Game</Button>
              <Button onClick={onOpenDashboard} className="bg-slate-700 text-white px-6 py-3 rounded-xl">Dashboard</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderBuild = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <FloatingParticles count={15} />
      <SenorSlop show={showSlop} message={slopMessage} slopTips={slopTips} onDefeat={() => setShowSlop(false)} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-black text-white">MEME MACHINE</h1>
          <BigTimer seconds={timeLeft} totalSeconds={totalTime} />
        </div>
        
        <SlopWarning slopLevel={slopLevel} />
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            {stage === 'intro' && (
              <>
                <ByteHost message={<div>
                  <p className="mb-2">Welcome, meme creator! 🎨 I'm <strong className="text-cyan-400">BYTE</strong>, your AI mentor!</p>
                  <p className="mb-2">Together, we'll defeat <strong className="text-gray-400">Señor Slop</strong> by creating memes that actually MEAN something.</p>
                  <p className="text-amber-400">I'll teach you <strong>prompt engineering</strong> - the art of talking to AI to get amazing results!</p>
                </div>} mood="teaching" />
                
                <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-4">🎯 What You'll Learn</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✨</span>
                      <div>
                        <p className="text-white font-medium">Prompt Engineering</p>
                        <p className="text-slate-400">How to write prompts that AI actually understands</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎨</span>
                      <div>
                        <p className="text-white font-medium">Style & Mood Control</p>
                        <p className="text-slate-400">Dial in exactly the look you want</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <p className="text-white font-medium">Iteration</p>
                        <p className="text-slate-400">How to refine results through feedback</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => setStage('cause')} className="w-full bg-amber-500 text-white py-4 font-bold rounded-xl text-lg">Let's Create! →</Button>
              </>
            )}
            
            {stage === 'cause' && (
              <>
                <ByteHost message="What issue fires you up? Pick something you genuinely care about – passion makes better memes!" mood="thinking" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COMMUNITY_ISSUES.map(issue => (
                    <button key={issue.id} onClick={() => setSelectedIssue(issue.id)}
                      className={`p-4 rounded-xl text-center transition-all ${selectedIssue === issue.id ? `bg-gradient-to-br ${issue.color} text-white scale-105` : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                      <div className="text-3xl mb-2">{issue.emoji}</div>
                      <div className="text-xs font-medium">{issue.name}</div>
                    </button>
                  ))}
                </div>
                {selectedIssue === 'custom' && (
                  <input type="text" placeholder="Describe your issue..." value={customIssue} onChange={(e) => setCustomIssue(e.target.value)}
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-amber-500" />
                )}
                <div className="flex gap-3">
                  <Button onClick={() => setStage('intro')} className="bg-slate-700 text-white px-6 py-3 rounded-xl">Back</Button>
                  <Button onClick={() => setStage('concept')} disabled={!selectedIssue || (selectedIssue === 'custom' && !customIssue)} className="flex-1 bg-amber-500 text-white py-3 rounded-xl disabled:opacity-50">Next →</Button>
                </div>
              </>
            )}
            
            {stage === 'concept' && (
              <>
                <ByteHost message={<div>
                  <p className="mb-2">Now describe your visual concept in <strong>plain English</strong>.</p>
                  <p className="text-sm text-slate-400 mb-2">Don't worry about being perfect – I'll show you how to make it better!</p>
                  <p className="text-cyan-400 text-sm">Tip: Think about what would make someone stop scrolling.</p>
                </div>} mood="thinking" />
                <div>
                  <label className="block text-white font-medium mb-2">Your Visual Concept</label>
                  <textarea 
                    value={visualConcept} 
                    onChange={(e) => setVisualConcept(e.target.value)} 
                    placeholder="e.g., 'A child looking at smokestacks with a worried face'"
                    rows={4}
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-amber-500" 
                  />
                  <p className="text-slate-500 text-sm mt-2">{visualConcept.length} characters • Aim for 50+ for better results</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setStage('cause')} className="bg-slate-700 text-white px-6 py-3 rounded-xl">Back</Button>
                  <Button onClick={() => setStage('styleSetup')} disabled={!visualConcept || visualConcept.length < 10} className="flex-1 bg-amber-500 text-white py-3 rounded-xl disabled:opacity-50">Choose Style →</Button>
                </div>
              </>
            )}
            
            {stage === 'styleSetup' && (
              <>
                <ByteHost message={<div>
                  <p className="mb-2">Now let's dial in your image style! 🎨</p>
                  <p className="text-sm text-slate-400">These controls affect how AI interprets your prompt. Experiment!</p>
                </div>} mood="excited" />
                
                {/* Style Selection */}
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700">
                  <h4 className="text-white font-bold mb-3">Art Style</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {IMAGE_STYLES.map(style => (
                      <button key={style.id} onClick={() => setSelectedStyle(style.id)}
                        className={`p-3 rounded-xl text-center transition-all ${selectedStyle === style.id ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        <div className="text-2xl mb-1">{style.emoji}</div>
                        <div className="text-xs font-medium">{style.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Mood Selection */}
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700">
                  <h4 className="text-white font-bold mb-3">Emotional Mood</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {MOOD_OPTIONS.map(mood => (
                      <button key={mood.id} onClick={() => setSelectedMood(mood.id)}
                        className={`p-3 rounded-xl text-center transition-all ${selectedMood === mood.id ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        <div className="text-2xl mb-1">{mood.emoji}</div>
                        <div className="text-xs font-medium">{mood.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sliders */}
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-5">
                  <Slider 
                    label="Realism Level" 
                    value={realismLevel} 
                    onChange={setRealismLevel}
                    leftLabel="Stylized"
                    rightLabel="Photorealistic"
                  />
                  <Slider 
                    label="Drama Level" 
                    value={dramaticLevel} 
                    onChange={setDramaticLevel}
                    leftLabel="Subtle"
                    rightLabel="Intense"
                  />
                  <Slider 
                    label="Color Vibrancy" 
                    value={colorVibrancy} 
                    onChange={setColorVibrancy}
                    leftLabel="Muted"
                    rightLabel="Vivid"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => setStage('concept')} className="bg-slate-700 text-white px-6 py-3 rounded-xl">Back</Button>
                  <Button onClick={async () => { await enhancePromptWithByte(); setStage('enhance'); }} className="flex-1 bg-cyan-500 text-white py-3 rounded-xl font-bold">✨ Enhance with BYTE →</Button>
                </div>
              </>
            )}
            
            {stage === 'enhance' && (
              <>
                <ByteHost 
                  message={enhancedPrompt 
                    ? "Here's my enhanced version! Compare it to yours – notice how I added specific details? That's prompt engineering!" 
                    : "Let me analyze your prompt and show you how to make it better..."
                  } 
                  mood={enhancedPrompt ? "teaching" : "thinking"} 
                  typing={isEnhancing} 
                />
                
                <PromptEnhancerEducational 
                  originalPrompt={visualConcept}
                  enhancedPrompt={enhancedPrompt}
                  explanation={promptExplanation}
                  onAccept={() => { setImagePrompt(enhancedPrompt); setStage('generate'); }}
                  onEdit={() => { setImagePrompt(enhancedPrompt || visualConcept); setStage('generate'); }}
                  onRegenerate={enhancePromptWithByte}
                  isLoading={isEnhancing}
                  error={enhanceError}
                />
                
                <div className="flex gap-3">
                  <Button onClick={() => setStage('styleSetup')} className="bg-slate-700 text-white px-6 py-3 rounded-xl">Back</Button>
                </div>
              </>
            )}
            
            {stage === 'generate' && (
              <>
                <ByteHost message={generatedImage 
                  ? <div>
                      <p className="mb-2">Your image is ready! 🎨</p>
                      <p className="text-sm text-slate-400">Not quite right? Edit the prompt or click "Get AI Feedback" to see how to improve!</p>
                    </div>
                  : "Edit the prompt if needed, then generate your image!"
                } mood={generatedImage ? "proud" : "excited"} />
                
                <div>
                  <label className="block text-white font-medium mb-2">Image Prompt</label>
                  <textarea 
                    value={imagePrompt} 
                    onChange={(e) => { setImagePrompt(e.target.value); checkForSlop(e.target.value); }} 
                    rows={5} 
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-amber-500 text-sm" 
                  />
                </div>
                
                {!hasApiKey('openai') && !hasApiKey('gemini') && (
                  <Alert type="warning">Configure OpenAI or Gemini API key in settings to generate images.</Alert>
                )}
                
                {isGenerating && (
                  <div className="bg-slate-800 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Generating...</span>
                      <span className="text-amber-400 font-bold">{Math.round(genProgress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all" style={{ width: `${genProgress}%` }} />
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button onClick={() => setStage('enhance')} className="bg-slate-700 text-white px-6 py-3 rounded-xl">Back</Button>
                  <Button onClick={handleGenerateImage} disabled={isGenerating || (!hasApiKey('openai') && !hasApiKey('gemini'))} className="flex-1 bg-amber-500 text-white py-3 rounded-xl disabled:opacity-50 font-bold">
                    {isGenerating ? 'Generating...' : generatedImage ? '🔄 Regenerate' : '✨ Create Image'}
                  </Button>
                </div>
                
                {generatedImage && (
                  <>
                    <div className="flex gap-3">
                      <Button onClick={handleDownload} className="flex-1 bg-slate-700 text-white py-3 rounded-xl">
                        📥 Download
                      </Button>
                      <Button onClick={() => { judgeMeme(); setStage('feedback'); }} className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-bold">
                        🧐 Get AI Feedback
                      </Button>
                    </div>
                    
                    <Button onClick={() => { generateCaptionSuggestions(); setStage('caption'); }} className="w-full bg-cyan-500 text-white py-3 rounded-xl font-bold">
                      💬 Skip to Caption →
                    </Button>
                  </>
                )}
                
                {iterationCount > 0 && (
                  <p className="text-center text-slate-500 text-sm">Iteration #{iterationCount} – Keep refining to defeat Señor Slop!</p>
                )}
              </>
            )}
            
            {stage === 'feedback' && (
              <>
                <ByteHost 
                  message={aiFeedback 
                    ? "Here's my analysis! I scored your meme on clarity, civic relevance, and viral potential." 
                    : "Analyzing your meme..."
                  } 
                  mood="judging" 
                  typing={isLoadingFeedback} 
                />
                
                <AIFeedback 
                  feedback={aiFeedback}
                  isLoading={isLoadingFeedback}
                  onAcceptAndSubmit={() => { generateCaptionSuggestions(); setStage('caption'); }}
                  onIterate={handleIterate}
                />
                
                {!isLoadingFeedback && !aiFeedback && (
                  <Button onClick={() => setStage('generate')} className="bg-slate-700 text-white px-6 py-3 rounded-xl">Back</Button>
                )}
              </>
            )}
            
            {stage === 'caption' && (
              <>
                <ByteHost message={<div>
                  <p className="mb-2">The caption is where your message hits home! 💬</p>
                  <p className="text-sm text-slate-400">Choose one of my suggestions or write your own. Punchy and memorable wins!</p>
                </div>} mood="thinking" />
                
                <CaptionEnhancer 
                  originalCaption={caption}
                  suggestions={captionSuggestions}
                  onSelect={(c) => setCaption(c)}
                  isLoading={isLoadingCaptions}
                />
                
                <div>
                  <label className="block text-white font-medium mb-2">Your Caption</label>
                  <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write something memorable..." rows={3}
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-amber-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Font</label>
                    <div className="flex gap-2">
                      {['impact', 'bold', 'modern'].map(f => (
                        <button key={f} onClick={() => setCaptionStyle(f)} className={`px-3 py-2 rounded-lg text-sm ${captionStyle === f ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Position</label>
                    <div className="flex gap-2">
                      {['top', 'bottom', 'both'].map(p => (
                        <button key={p} onClick={() => setCaptionPosition(p)} className={`px-3 py-2 rounded-lg text-sm capitalize ${captionPosition === p ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => setStage(aiFeedback ? 'feedback' : 'generate')} className="bg-slate-700 text-white px-6 py-3 rounded-xl">Back</Button>
                  <Button onClick={() => setStage('finalize')} className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-bold">Preview & Finalize →</Button>
                </div>
              </>
            )}
            
            {stage === 'finalize' && (
              <>
                <ByteHost message={<div>
                  <p className="mb-2">Looking good! 🚀 This is your last chance to make changes.</p>
                  <p className="text-sm text-slate-400">Happy with it? Hit Submit! Want to iterate? Go back and regenerate.</p>
                </div>} mood="proud" />
                
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <h4 className="text-emerald-400 font-bold mb-2">📊 Meme Stats</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-slate-400">Issue</p>
                      <p className="text-white font-medium">{getIssueName()}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-slate-400">Iterations</p>
                      <p className="text-white font-medium">{iterationCount}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-slate-400">Style</p>
                      <p className="text-white font-medium">{IMAGE_STYLES.find(s => s.id === selectedStyle)?.name}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-slate-400">Slop Resistance</p>
                      <p className="text-white font-medium">{10 - slopLevel}/10</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => setStage('caption')} className="bg-slate-700 text-white px-6 py-3 rounded-xl">Edit More</Button>
                  <Button onClick={handleIterate} className="bg-slate-700 text-white px-6 py-3 rounded-xl">🔄 Iterate</Button>
                  <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-bold">🚀 Submit Meme!</Button>
                </div>
              </>
            )}
            
            {stage === 'submitted' && (
              <div className="text-center py-8">
                <div className="text-8xl mb-4">✅</div>
                <h2 className="text-3xl font-black text-white mb-2">MEME SUBMITTED!</h2>
                <p className="text-slate-400 mb-4">Great work defeating Señor Slop!</p>
                <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-cyan-400">Waiting for the Virality Simulation to begin...</p>
                  <p className="text-slate-500 text-sm mt-2">The host will start it when everyone's ready!</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="sticky top-4">
              <MemePreview 
                imageUrl={generatedImage}
                caption={caption}
                style={captionStyle}
                position={captionPosition}
                textColor={captionColor}
                onDownload={handleDownload}
              />
              
              {selectedIssue && (
                <div className="mt-4 bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{COMMUNITY_ISSUES.find(i => i.id === selectedIssue)?.emoji || '✨'}</span>
                    <span className="text-white font-bold">{getIssueName()}</span>
                  </div>
                  {selectedStyle && (
                    <p className="text-slate-500 text-sm">Style: {IMAGE_STYLES.find(s => s.id === selectedStyle)?.name} • {MOOD_OPTIONS.find(m => m.id === selectedMood)?.name}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderViral = () => {
    const memes = getMemes();
    const userHasSubmitted = memes.some(m => m.playerId === userId);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
        <FloatingParticles count={30} />
        <div className="max-w-6xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-4xl font-black text-white">VIRALITY SIMULATION</h1>
            <p className="text-purple-400">React, comment, share, and vote to make memes go viral!</p>
          </div>
          
          {!userHasSubmitted && !isHost && (
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-6 mb-8 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-amber-400 mb-2">You Haven't Submitted!</h3>
              <p className="text-slate-300 mb-4">You need to submit a meme before you can participate in the Virality Simulation.</p>
              <p className="text-slate-400 text-sm">You can still view others' memes below, but you won't be able to react or vote.</p>
            </div>
          )}
          
          <ByteHost message={<div>
            <p className="mb-2"><strong>Welcome to the gallery!</strong> 🖼️</p>
            <p className="text-sm text-slate-400 mb-2">• <strong>React</strong> with emojis to show your appreciation</p>
            <p className="text-sm text-slate-400 mb-2">• <strong>Comment</strong> to engage with the content</p>
            <p className="text-sm text-slate-400 mb-2">• <strong>Share</strong> to simulate virality</p>
            <p className="text-amber-400">• <strong>Vote</strong> for ONE meme (not yours) that you think is the best!</p>
          </div>} mood="excited" />
          
          {memes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-slate-400">Waiting for memes to be submitted...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {memes.map((meme, i) => (
                <MemeCard 
                  key={i} 
                  meme={meme} 
                  onReact={userHasSubmitted || isHost ? handleReaction : null} 
                  onComment={userHasSubmitted || isHost ? handleComment : null} 
                  onShare={userHasSubmitted || isHost ? handleShare : null}
                  onVote={userHasSubmitted || isHost ? handleVote : null} 
                  hasVoted={myVote} 
                  isOwnMeme={meme.playerId === userId}
                  canInteract={userHasSubmitted || isHost}
                  showComments={true}
                  userReactions={userReactions}
                />
              ))}
            </div>
          )}
          
          {myVote && (
            <div className="mt-8 text-center">
              <p className="text-emerald-400 text-lg">✓ You voted! Waiting for others...</p>
            </div>
          )}
          
          {isHost && (
            <div className="text-center mt-8">
              <Button onClick={() => updateGamePhase(gameCode, 'results')} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-12 py-4 font-bold rounded-xl text-lg">🏆 Show Results & Awards</Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderResults = () => {
    const awards = calculateAwards();
    const players = Object.values(room?.players || {}).sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const memes = getMemes();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-y-auto">
        <FloatingParticles count={40} />
        <div className="max-w-4xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🏆</div>
            <h1 className="text-4xl font-black text-white mb-2">AWARDS</h1>
            <p className="text-slate-400">Celebrating the meme masters!</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <AwardCard award={AWARDS.mostViral} winner={awards.mostViral || 'TBD'} />
            <AwardCard award={AWARDS.mostDank} winner={awards.mostDank || 'TBD'} />
            <AwardCard award={AWARDS.slopSlayer} winner={awards.slopSlayer || 'TBD'} />
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">🗳️ Vote Results</h3>
            <div className="space-y-3">
              {players.slice(0, 5).map((player, i) => (
                <div key={player.id} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-slate-700 text-white'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`}</span>
                    <span className="font-bold">{player.name}</span>
                  </div>
                  <span className="font-black text-xl">{player.votes || 0} votes</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Final gallery */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">🖼️ Meme Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {memes.map((meme, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                  <img src={meme.imageUrl} alt="Meme" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
                    <p className="text-white text-xs font-bold truncate">{meme.playerName}</p>
                    <p className="text-amber-400 text-xs">{Object.values(meme.reactions || {}).reduce((a, b) => a + b, 0)} reactions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <ByteHost message={<div>
            <p className="mb-2">Amazing work everyone! 🎉</p>
            <p className="text-amber-400 mb-2">You've learned to defeat Señor Slop by crafting specific, meaningful prompts!</p>
            <p className="text-slate-400 text-sm">Remember: Good prompts = Better AI results. Take this skill everywhere!</p>
          </div>} mood="proud" />
          
          <div className="text-center mt-8">
            <Button onClick={onBack} className="bg-cyan-600 text-white px-8 py-3 font-bold rounded-xl">Back to Home</Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderPhase = () => {
    switch (room?.phase) {
      case 'lobby': return renderLobby();
      case 'build': return renderBuild();
      case 'viral': return renderViral();
      case 'vote': return renderViral();
      case 'results': return renderResults();
      default: return renderLobby();
    }
  };
  
  return (
    <div className="relative">
      {renderPhase()}
      <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">Exit</button>
    </div>
  );
};

export default MemeMachine;

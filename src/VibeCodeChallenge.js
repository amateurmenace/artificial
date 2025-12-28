// VIBE CODE CHALLENGE v4 - Full Game Mechanics + Chat Interface
// Step-by-step journey, villains, BYTE tips, feature selection, iterations
// Plus: chat-style interaction, code streaming, working demos

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Timer, PlayerList, Alert, Badge } from './components';
import { updateGamePhase, submitToGame, submitVote } from './firebase';
import { generateInitialCode, iterateCode, polishCode, hasApiKey } from './ai-services';

// ============================================
// BYTE CHARACTER SYSTEM
// ============================================

const BYTE_PERSONALITIES = {
  greetings: [
    "Hey there, future app creator! I'm BYTE, your AI coding buddy. Ready to build something awesome?",
    "Welcome to the code zone! I'm BYTE - think of me as your personal software wizard!",
    "Yo! BYTE here, reporting for duty. Let's turn your wildest app ideas into reality!"
  ],
  ideaTips: [
    "Think about a problem you face every day - apps that solve real problems are the best!",
    "What's something you wish existed on your phone? That's usually a great starting point!",
    "Don't worry about being 'original' - the best apps often improve on existing ideas!"
  ],
  describeTips: [
    "Picture your app in your head - what colors do you see? What's on the main screen?",
    "Think about who would use this - a kid? A busy parent? A student? That helps shape the design!",
    "Describe it like you're explaining to a friend who's never seen it before."
  ],
  featureTips: [
    "Start with 3-5 core features - you can always add more later!",
    "Think 'must have' vs 'nice to have' - what makes your app actually work?",
    "The best apps do a few things really well rather than many things poorly."
  ],
  generateTips: [
    "Watch the magic happen! I'm turning your ideas into real code.",
    "Every line of code is bringing your vision to life!",
    "This is the fun part - seeing your app come together!"
  ],
  iterateTips: [
    "No app is perfect on the first try - iteration is where the magic happens!",
    "Small tweaks can make a big difference. What catches your eye?",
    "Trust your instincts - if something feels off, let's fix it!"
  ],
  encouragement: [
    "You're a natural at this!",
    "Great instincts! Keep those ideas coming!",
    "This is turning out amazing!",
    "We make a great team!"
  ],
  villainDefeat: [
    "Take THAT, {villain}! Another one bites the dust!",
    "{villain} didn't stand a chance against us!",
    "Bye bye, {villain}! Who's next?!"
  ]
};

const getByteResponse = (category) => {
  const responses = BYTE_PERSONALITIES[category] || BYTE_PERSONALITIES.encouragement;
  return responses[Math.floor(Math.random() * responses.length)];
};

// ============================================
// VILLAIN SYSTEM
// ============================================

const VILLAINS = {
  chaos: {
    name: 'CHAOS',
    emoji: '🌀',
    color: 'from-red-500 to-orange-500',
    description: 'Wants to scatter your ideas everywhere!',
    defeatPhase: 'ideate',
    taunt: "Your ideas are all over the place! You'll never focus!"
  },
  confusion: {
    name: 'CONFUSION',
    emoji: '❓',
    color: 'from-gray-600 to-gray-700',
    description: 'Tries to muddle your vision!',
    defeatPhase: 'describe',
    taunt: "What even IS this app? You don't know what you want!"
  },
  complexity: {
    name: 'COMPLEXITY',
    emoji: '🕸️',
    color: 'from-purple-500 to-pink-500',
    description: 'Wants to overcomplicate everything!',
    defeatPhase: 'features',
    taunt: "Add MORE features! Make it complicated! MWAHAHA!"
  },
  bugs: {
    name: 'BUGS',
    emoji: '🐛',
    color: 'from-green-600 to-lime-500',
    description: 'Tries to break your code!',
    defeatPhase: 'generate',
    taunt: "I'll fill your code with errors! Nothing will work!"
  },
  scope: {
    name: 'SCOPE CREEP',
    emoji: '👹',
    color: 'from-amber-600 to-yellow-500',
    description: 'Never satisfied, always wants more!',
    defeatPhase: 'iterate',
    taunt: "It's not enough! Add more! Change everything! START OVER!"
  }
};

const VillainCard = ({ villain, isDefeated, isActive, showTaunt }) => {
  const v = VILLAINS[villain];
  if (!v) return null;
  
  return (
    <div className={`relative transition-all duration-500 ${isDefeated ? 'opacity-30 scale-90' : isActive ? 'scale-110 animate-pulse' : ''}`}>
      <div className={`bg-gradient-to-br ${v.color} p-4 rounded-2xl text-white text-center shadow-lg ${isActive ? 'ring-4 ring-white/50' : ''}`}>
        <div className="text-4xl mb-2">{v.emoji}</div>
        <div className="font-black text-sm">{v.name}</div>
        {isActive && showTaunt && (
          <div className="mt-2 text-xs bg-black/30 rounded-lg p-2 animate-bounce">
            "{v.taunt}"
          </div>
        )}
        {isDefeated && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">✖️</span>
          </div>
        )}
      </div>
    </div>
  );
};

const VillainBattle = ({ activeVillain, defeatedVillains = [] }) => (
  <div className="flex justify-center gap-4 flex-wrap py-4">
    {Object.keys(VILLAINS).map((v) => (
      <VillainCard
        key={v}
        villain={v}
        isDefeated={defeatedVillains.includes(v)}
        isActive={activeVillain === v}
        showTaunt={activeVillain === v}
      />
    ))}
  </div>
);

// ============================================
// BYTE AVATAR
// ============================================

const ByteAvatar = ({ mood = 'happy', size = 'md', speaking = false }) => {
  const sizes = { sm: 'w-10 h-10 text-xl', md: 'w-14 h-14 text-2xl', lg: 'w-24 h-24 text-5xl' };
  const moodColors = {
    happy: 'from-[#48a89a] to-[#3d8a7e]',
    thinking: 'from-[#6b8cce] to-[#5070b0]',
    excited: 'from-[#d4a84b] to-[#c49a3a]',
    coding: 'from-purple-500 to-purple-600',
    proud: 'from-pink-500 to-rose-500',
    warning: 'from-red-500 to-orange-500'
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${moodColors[mood] || moodColors.happy} flex items-center justify-center shadow-lg relative`}>
      <span className={speaking ? 'animate-bounce' : ''}>🤖</span>
      {speaking && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
      )}
    </div>
  );
};

// ============================================
// CHAT COMPONENTS
// ============================================

const ChatMessage = ({ from, message, timestamp, mood, isTyping = false, suggestions = [], onSuggestionClick }) => {
  const isByte = from === 'byte';
  
  return (
    <div className={`flex gap-3 ${isByte ? '' : 'flex-row-reverse'} animate-fadeIn`}>
      {isByte ? (
        <ByteAvatar mood={mood} size="sm" speaking={isTyping} />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-sm font-bold">
          You
        </div>
      )}
      
      <div className={`max-w-[85%] ${isByte ? '' : 'text-right'}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl ${
          isByte ? 'bg-white/10 text-white rounded-tl-none' : 'bg-[#48a89a] text-white rounded-tr-none'
        }`}>
          {isTyping ? (
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          )}
        </div>
        
        {/* Clickable suggestions */}
        {isByte && suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick(suggestion)}
                className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
              >
                💡 {suggestion}
              </button>
            ))}
          </div>
        )}
        
        {timestamp && (
          <p className={`text-xs text-white/40 mt-1 ${isByte ? '' : 'text-right'}`}>{timestamp}</p>
        )}
      </div>
    </div>
  );
};

const ChatInput = ({ value, onChange, onSend, placeholder, disabled }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="px-4 py-2 bg-[#48a89a] hover:bg-[#3d8a7e] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all"
      >
        Send
      </button>
    </div>
  );
};

// ============================================
// FEATURE SELECTION CARDS
// ============================================

const FEATURE_OPTIONS = [
  { id: 'auth', name: 'User Accounts', emoji: '👤', description: 'Login, profiles, settings' },
  { id: 'data', name: 'Save Data', emoji: '💾', description: 'Remember user info' },
  { id: 'social', name: 'Social Features', emoji: '👥', description: 'Share, like, comment' },
  { id: 'notifications', name: 'Notifications', emoji: '🔔', description: 'Alerts and reminders' },
  { id: 'search', name: 'Search', emoji: '🔍', description: 'Find content fast' },
  { id: 'dark', name: 'Dark Mode', emoji: '🌙', description: 'Easy on the eyes' },
  { id: 'animations', name: 'Animations', emoji: '✨', description: 'Smooth transitions' },
  { id: 'charts', name: 'Charts/Stats', emoji: '📊', description: 'Visualize data' },
];

const FeatureSelector = ({ selectedFeatures, onToggle, maxFeatures = 5, minFeatures = 3 }) => (
  <div className="space-y-4">
    <div className="text-center text-white/70 text-sm">
      Select {minFeatures}-{maxFeatures} features ({selectedFeatures.length} selected)
    </div>
    <div className="grid grid-cols-2 gap-3">
      {FEATURE_OPTIONS.map((feature) => {
        const isSelected = selectedFeatures.includes(feature.id);
        const canSelect = selectedFeatures.length < maxFeatures || isSelected;
        
        return (
          <button
            key={feature.id}
            onClick={() => canSelect && onToggle(feature.id)}
            disabled={!canSelect && !isSelected}
            className={`p-4 rounded-xl text-left transition-all ${
              isSelected
                ? 'bg-gradient-to-br from-[#48a89a] to-[#3d8a7e] text-white shadow-lg scale-105'
                : canSelect
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <div className="text-2xl mb-1">{feature.emoji}</div>
            <div className="font-bold text-sm">{feature.name}</div>
            <div className="text-xs opacity-70">{feature.description}</div>
            {isSelected && <div className="text-xs mt-2">✓ Selected</div>}
          </button>
        );
      })}
    </div>
  </div>
);

// ============================================
// CODE STREAMING PREVIEW
// ============================================

const CodeStreamPreview = ({ code, isStreaming, streamedCode, showPreview, onToggleView, onFullscreen, title = "My App" }) => {
  const codeRef = useRef(null);
  
  useEffect(() => {
    if (codeRef.current && isStreaming) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [streamedCode, isStreaming]);

  const displayCode = isStreaming ? streamedCode : code;

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl h-full flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-950 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium text-gray-300">{title || 'My App'}</span>
          {isStreaming && (
            <span className="text-xs text-green-400 animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              BYTE is coding...
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isStreaming && code && (
            <>
              <button onClick={onToggleView} className={`px-3 py-1 rounded text-xs font-medium transition-all ${showPreview ? 'bg-[#48a89a] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                {showPreview ? '👁️ Preview' : '💻 Code'}
              </button>
              <button onClick={onFullscreen} className="px-3 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all">
                ⛶ Fullscreen
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {isStreaming || !showPreview ? (
          <pre ref={codeRef} className="h-full overflow-auto p-4 text-xs font-mono leading-relaxed" style={{ background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)' }}>
            {displayCode ? (
              <code className="text-gray-300">
                {displayCode.split('\n').map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-10 text-gray-600 select-none text-right pr-4">{i + 1}</span>
                    <span className={
                      line.includes('//') ? 'text-gray-500' :
                      line.includes('function') || line.includes('const') || line.includes('let') ? 'text-purple-400' :
                      line.includes('<') && line.includes('>') ? 'text-blue-400' :
                      line.includes('"') || line.includes("'") ? 'text-green-400' :
                      'text-gray-300'
                    }>{line || ' '}</span>
                  </div>
                ))}
                {isStreaming && <span className="text-green-400 animate-pulse">▌</span>}
              </code>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">💻</div>
                  <p className="text-lg">Your app will appear here</p>
                  <p className="text-sm opacity-70">Complete the steps to generate code</p>
                </div>
              </div>
            )}
          </pre>
        ) : (
          <iframe title="App Preview" srcDoc={code} className="w-full h-full bg-white" sandbox="allow-scripts allow-forms allow-modals" />
        )}
      </div>
    </div>
  );
};

// ============================================
// FULLSCREEN APP MODAL
// ============================================

const FullscreenAppModal = ({ code, title, onClose }) => {
  if (!code) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        <button onClick={onClose} className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-medium backdrop-blur-sm transition-all">
          ✕ Close Demo
        </button>
      </div>
      <iframe title={title} srcDoc={code} className="w-full h-full pt-16" sandbox="allow-scripts allow-forms allow-modals" />
    </div>
  );
};

// ============================================
// PROGRESS TRACKER
// ============================================

const ProgressTracker = ({ currentStep, steps }) => {
  const currentIndex = steps.indexOf(currentStep);
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-black/30 rounded-xl">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className={`flex flex-col items-center ${i <= currentIndex ? 'text-[#48a89a]' : 'text-white/30'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i < currentIndex ? 'bg-[#48a89a] text-white' :
              i === currentIndex ? 'bg-[#d4a84b] text-white animate-pulse' :
              'bg-white/10'
            }`}>
              {i < currentIndex ? '✓' : i + 1}
            </div>
            <span className="text-[10px] mt-1 font-medium uppercase">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 rounded ${i < currentIndex ? 'bg-[#48a89a]' : 'bg-white/10'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ============================================
// APP TEMPLATES
// ============================================

const generateAdvancedApp = (idea, description, features) => {
  const hasCharts = features.includes('charts');
  const hasDark = features.includes('dark');
  const hasAnimations = features.includes('animations');
  const hasSocial = features.includes('social');
  
  const bgColor = hasDark ? '#0f172a' : '#f8fafc';
  const textColor = hasDark ? '#f1f5f9' : '#1e293b';
  const cardBg = hasDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${idea}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: ${bgColor}; color: ${textColor}; }
    .card { backdrop-filter: blur(10px); background: ${cardBg}; }
    ${hasAnimations ? `
    .animate-in { animation: slideIn 0.3s ease-out; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .hover-scale:hover { transform: scale(1.02); }
    ` : ''}
  </style>
</head>
<body class="min-h-screen p-4 md:p-8">
  <div class="max-w-2xl mx-auto">
    <header class="text-center mb-8 ${hasAnimations ? 'animate-in' : ''}">
      <h1 class="text-3xl font-bold mb-2">${idea}</h1>
      <p class="opacity-70">${description.slice(0, 60)}${description.length > 60 ? '...' : ''}</p>
    </header>
    
    ${hasCharts ? `
    <div class="card rounded-2xl p-6 mb-6 shadow-lg ${hasAnimations ? 'animate-in' : ''}">
      <h2 class="text-xl font-semibold mb-4">📊 Statistics</h2>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="p-4 rounded-xl ${hasDark ? 'bg-purple-500/20' : 'bg-purple-50'}">
          <div class="text-3xl font-bold text-purple-500">127</div>
          <div class="text-sm opacity-70">Total</div>
        </div>
        <div class="p-4 rounded-xl ${hasDark ? 'bg-blue-500/20' : 'bg-blue-50'}">
          <div class="text-3xl font-bold text-blue-500">89%</div>
          <div class="text-sm opacity-70">Progress</div>
        </div>
        <div class="p-4 rounded-xl ${hasDark ? 'bg-green-500/20' : 'bg-green-50'}">
          <div class="text-3xl font-bold text-green-500">24</div>
          <div class="text-sm opacity-70">Streak</div>
        </div>
      </div>
    </div>
    ` : ''}
    
    <div class="card rounded-2xl p-6 mb-6 shadow-lg ${hasAnimations ? 'animate-in hover-scale' : ''}" style="${hasAnimations ? 'animation-delay: 0.1s' : ''}">
      <h2 class="text-xl font-semibold mb-4">✨ Quick Action</h2>
      <div class="flex gap-2">
        <input type="text" id="mainInput" placeholder="What's on your mind?" 
          class="flex-1 px-4 py-3 border ${hasDark ? 'border-white/20 bg-white/5' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"/>
        <button onclick="addItem()" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          Add
        </button>
      </div>
    </div>
    
    <div class="card rounded-2xl p-6 shadow-lg ${hasAnimations ? 'animate-in' : ''}" style="${hasAnimations ? 'animation-delay: 0.2s' : ''}">
      <h2 class="text-xl font-semibold mb-4">📋 Items</h2>
      <div id="itemList" class="space-y-3">
        <div class="flex items-center gap-3 p-4 rounded-xl ${hasDark ? 'bg-white/5' : 'bg-gray-50'} ${hasAnimations ? 'hover-scale transition-all' : ''}">
          <span class="text-2xl">🎯</span>
          <div class="flex-1">
            <div class="font-medium">Sample item</div>
            <div class="text-sm opacity-60">Added just now</div>
          </div>
          ${hasSocial ? '<button class="text-xl hover:scale-110 transition-transform">❤️</button>' : ''}
        </div>
      </div>
    </div>
    
    ${hasSocial ? `
    <div class="card rounded-2xl p-6 mt-6 shadow-lg ${hasAnimations ? 'animate-in' : ''}" style="${hasAnimations ? 'animation-delay: 0.3s' : ''}">
      <h2 class="text-xl font-semibold mb-4">👥 Community</h2>
      <div class="flex justify-around">
        <button class="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-all">
          <span class="text-2xl">❤️</span>
          <span class="text-sm">Like</span>
        </button>
        <button class="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-all">
          <span class="text-2xl">💬</span>
          <span class="text-sm">Comment</span>
        </button>
        <button class="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-all">
          <span class="text-2xl">🔗</span>
          <span class="text-sm">Share</span>
        </button>
      </div>
    </div>
    ` : ''}
  </div>
  
  <script>
    function addItem() {
      const input = document.getElementById('mainInput');
      if (input.value.trim()) {
        const list = document.getElementById('itemList');
        const item = document.createElement('div');
        item.className = 'flex items-center gap-3 p-4 rounded-xl ${hasDark ? 'bg-white/5' : 'bg-gray-50'} ${hasAnimations ? 'animate-in hover-scale transition-all' : ''}';
        item.innerHTML = '<span class="text-2xl">🎉</span><div class="flex-1"><div class="font-medium">' + input.value + '</div><div class="text-sm opacity-60">Just added</div></div>${hasSocial ? '<button class="text-xl hover:scale-110 transition-transform">❤️</button>' : ''}';
        list.prepend(item);
        input.value = '';
      }
    }
  </script>
</body>
</html>`;
};

// ============================================
// FLOATING PARTICLES
// ============================================

const FloatingParticles = ({ count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i, size: Math.random() * 6 + 2, x: Math.random() * 100, duration: Math.random() * 20 + 15, delay: Math.random() * 10
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full bg-white/10" style={{ width: p.size, height: p.size, left: `${p.x}%`, animation: `floatUp ${p.duration}s linear ${p.delay}s infinite` }} />
      ))}
      <style>{`
        @keyframes floatUp { 0% { transform: translateY(100vh); opacity: 0; } 10% { opacity: 0.5; } 90% { opacity: 0.5; } 100% { transform: translateY(-100vh); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

// ============================================
// ITERATION SUGGESTIONS
// ============================================

const ITERATION_SUGGESTIONS = [
  "Make the colors more vibrant",
  "Add more spacing between elements",
  "Make the buttons bigger",
  "Change to a darker theme",
  "Add more animations",
  "Simplify the layout",
  "Make the text larger",
  "Add icons to the buttons"
];

// ============================================
// MAIN COMPONENT
// ============================================

const VibeCodeChallenge = ({ gameCode, room, userId, isHost, onBack, onOpenDashboard }) => {
  // Build steps
  const BUILD_STEPS = ['ideate', 'describe', 'features', 'generate', 'iterate', 'polish'];
  
  // State
  const [buildStep, setBuildStep] = useState('ideate');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [byteMood, setByteMood] = useState('happy');
  
  const [appIdea, setAppIdea] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [streamedCode, setStreamedCode] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [iterationCount, setIterationCount] = useState(0);
  
  const [defeatedVillains, setDefeatedVillains] = useState([]);
  const [activeVillain, setActiveVillain] = useState('chaos');
  const [fullscreenApp, setFullscreenApp] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const chatEndRef = useRef(null);
  
  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // Get suggestions based on current step
  const getSuggestions = () => {
    switch (buildStep) {
      case 'ideate':
        return ["A habit tracker app", "A mood journal", "A recipe organizer", "A workout planner", "A study timer"];
      case 'describe':
        return ["Colorful and fun", "Clean and minimal", "Dark and modern", "Bright and playful"];
      case 'iterate':
        return ITERATION_SUGGESTIONS.slice(0, 4);
      default:
        return [];
    }
  };
  
  // Add message helpers
  const addByteMessage = useCallback((message, mood = 'happy', suggestions = []) => {
    setIsTyping(true);
    setByteMood(mood);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        from: 'byte',
        message,
        mood,
        suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800 + Math.random() * 400);
  }, []);
  
  const addUserMessage = (message) => {
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      from: 'user',
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };
  
  // Initialize on build phase
  useEffect(() => {
    if (room?.phase === 'build' && chatMessages.length === 0) {
      addByteMessage(getByteResponse('greetings'), 'excited');
      setTimeout(() => {
        setActiveVillain('chaos');
        addByteMessage(
          `⚔️ Our first enemy appears: CHAOS! They want to scatter your ideas everywhere.\n\n${getByteResponse('ideaTips')}\n\nWhat kind of app do you want to build?`,
          'warning',
          getSuggestions()
        );
      }, 2000);
    }
  }, [room?.phase, chatMessages.length, addByteMessage]);
  
  // Stream code
  const streamCode = useCallback((fullCode) => {
    setIsStreaming(true);
    setStreamedCode('');
    setShowPreview(false);
    setByteMood('coding');
    
    const lines = fullCode.split('\n');
    let currentLine = 0;
    let currentContent = '';
    
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        currentContent += (currentLine > 0 ? '\n' : '') + lines[currentLine];
        setStreamedCode(currentContent);
        currentLine++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setGeneratedCode(fullCode);
        setShowPreview(true);
        setByteMood('proud');
        setDefeatedVillains(prev => [...prev, 'bugs']);
        setActiveVillain('scope');
        
        addByteMessage(
          `🎉 BOOM! We defeated BUGS! Your app is ALIVE!\n\nTake it for a spin - click around, try the buttons!\n\n⚔️ But wait... SCOPE CREEP approaches! They'll never be satisfied.\n\n${getByteResponse('iterateTips')}\n\nWhat would you like to change?`,
          'excited',
          ITERATION_SUGGESTIONS.slice(0, 4)
        );
        setBuildStep('iterate');
      }
    }, 25);
    
    return () => clearInterval(interval);
  }, [addByteMessage]);
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
  };
  
  // Handle chat submit
  const handleChatSubmit = () => {
    if (!chatInput.trim() || isStreaming) return;
    
    const userMessage = chatInput.trim();
    addUserMessage(userMessage);
    setChatInput('');
    
    // Handle based on build step
    if (buildStep === 'ideate') {
      setAppIdea(userMessage);
      setDefeatedVillains(['chaos']);
      setActiveVillain('confusion');
      setBuildStep('describe');
      
      addByteMessage(
        `✨ YES! "${userMessage}" - I love it! CHAOS is defeated!\n\n⚔️ But CONFUSION lurks... they want to muddle your vision!\n\n${getByteResponse('describeTips')}\n\nDescribe how your app should look and feel:`,
        'excited',
        ["Colorful and fun", "Clean and minimal", "Dark and modern", "Bright and cheerful"]
      );
      
    } else if (buildStep === 'describe') {
      setAppDescription(userMessage);
      setDefeatedVillains(prev => [...prev, 'confusion']);
      setActiveVillain('complexity');
      setBuildStep('features');
      
      addByteMessage(
        `🎨 Perfect description! CONFUSION vanquished!\n\n⚔️ Now COMPLEXITY attacks! They want you to add EVERYTHING!\n\n${getByteResponse('featureTips')}\n\nSelect 3-5 features below, then click "Lock In Features":`,
        'thinking'
      );
      
    } else if (buildStep === 'iterate') {
      setIterationCount(prev => prev + 1);
      addByteMessage(getByteResponse('encouragement') + " Making that change...", 'coding');
      
      setTimeout(() => {
        setIsStreaming(true);
        setShowPreview(false);
        
        setTimeout(() => {
          const modifiedCode = generatedCode.replace('</style>', `  /* Iteration ${iterationCount + 1}: ${userMessage} */\n</style>`);
          setGeneratedCode(modifiedCode);
          setStreamedCode(modifiedCode);
          setIsStreaming(false);
          setShowPreview(true);
          
          if (iterationCount >= 1 && !defeatedVillains.includes('scope')) {
            setDefeatedVillains(prev => [...prev, 'scope']);
            addByteMessage(
              `🏆 SCOPE CREEP is defeated! You knew when to stop!\n\nYour app looks amazing! You can keep tweaking, or submit when ready!`,
              'proud'
            );
          } else {
            addByteMessage(
              `Done! How's that looking? Want to change anything else, or ready to submit?`,
              'happy',
              ["Submit my app!", ...ITERATION_SUGGESTIONS.slice(4, 7)]
            );
          }
        }, 1500);
      }, 500);
      
    } else if (buildStep === 'polish') {
      // Final submission
      handleSubmit();
    }
  };
  
  // Handle feature toggle
  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };
  
  // Lock in features and generate
  const handleLockFeatures = () => {
    if (selectedFeatures.length < 3) {
      addByteMessage("Pick at least 3 features! You need a solid foundation.", 'warning');
      return;
    }
    
    setDefeatedVillains(prev => [...prev, 'complexity']);
    setActiveVillain('bugs');
    setBuildStep('generate');
    
    addByteMessage(
      `💪 Smart choices! COMPLEXITY crushed!\n\n⚔️ Now for BUGS - they'll try to break everything!\n\n${getByteResponse('generateTips')}\n\nWatch me work my magic...`,
      'coding'
    );
    
    setTimeout(() => {
      const code = generateAdvancedApp(appIdea, appDescription, selectedFeatures);
      streamCode(code);
    }, 1500);
  };
  
  // Submit app
  const handleSubmit = () => {
    if (!generatedCode) return;
    
    submitToGame(gameCode, {
      type: 'app-complete',
      playerId: userId,
      playerName: Object.values(room?.players || {}).find(p => p.id === userId)?.name,
      appIdea,
      appDescription,
      features: selectedFeatures,
      code: generatedCode,
      iterations: iterationCount,
      timestamp: Date.now()
    });
    
    setHasSubmitted(true);
    addByteMessage(
      `🎉 YOUR APP IS SUBMITTED!\n\nAll villains defeated! You built a real app!\n\n🏆 Final Stats:\n• App: ${appIdea}\n• Features: ${selectedFeatures.length}\n• Iterations: ${iterationCount}\n\nAmazing work, app creator!`,
      'proud'
    );
  };
  
  // ============================================
  // RENDER FUNCTIONS
  // ============================================
  
  const renderLobby = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex items-center justify-center p-6">
      <FloatingParticles count={30} />
      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="text-8xl mb-6 animate-bounce">💻</div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">VIBE CODE <span className="text-[#6b8cce]">CHALLENGE</span></h1>
        <p className="text-xl text-white/70 mb-8">Build real apps with AI. No coding required!</p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
          <div className="text-6xl font-mono font-black text-[#6b8cce] tracking-widest mb-4">{gameCode}</div>
          <p className="text-white/60">Share this code to join</p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Villains to Defeat:</h3>
          <VillainBattle activeVillain={null} defeatedVillains={[]} />
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Players Ready ({Object.keys(room?.players || {}).length}):</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.values(room?.players || {}).map((player) => (
              <div key={player.id} className="bg-gradient-to-br from-[#6b8cce] to-[#5070b0] text-white px-4 py-2 rounded-full font-medium shadow-lg">
                {player.name}
              </div>
            ))}
          </div>
        </div>
        
        {isHost && (
          <div className="flex gap-4 justify-center">
            <Button onClick={() => updateGamePhase(gameCode, 'intro')} className="bg-gradient-to-r from-[#6b8cce] to-[#5070b0] text-white px-8 py-4 text-xl font-bold rounded-xl shadow-lg">
              🚀 Start Challenge
            </Button>
            <Button onClick={onOpenDashboard} className="bg-white/20 text-white px-6 py-4 rounded-xl">
              📊 Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderIntro = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 overflow-y-auto">
      <FloatingParticles count={20} />
      <div className="max-w-4xl mx-auto relative z-10 py-8">
        <div className="text-center mb-8">
          <ByteAvatar mood="excited" size="lg" />
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-2">Meet <span className="text-[#6b8cce]">BYTE</span></h1>
          <p className="text-xl text-white/70">Your AI Coding Companion</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 mb-8">
          <p className="text-white text-lg leading-relaxed mb-4">
            "Hey there! I'm BYTE, and together we're going to build a REAL app - no coding experience needed!"
          </p>
          <p className="text-white/70">
            Just chat with me, tell me your ideas, and watch the magic happen. But watch out - we'll face some villains along the way!
          </p>
        </div>
        
        <h3 className="text-2xl font-bold text-white text-center mb-4">⚔️ The Villains We'll Battle:</h3>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {Object.entries(VILLAINS).map(([key, v]) => (
            <div key={key} className={`bg-gradient-to-br ${v.color} p-4 rounded-2xl text-white text-center`}>
              <div className="text-3xl mb-2">{v.emoji}</div>
              <div className="font-bold text-sm">{v.name}</div>
              <div className="text-xs opacity-70 mt-1">{v.description}</div>
            </div>
          ))}
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-3">📋 Your Journey:</h3>
          <div className="grid grid-cols-6 gap-2 text-center text-white/70 text-sm">
            {BUILD_STEPS.map((step, i) => (
              <div key={step} className="bg-white/10 rounded-lg p-3">
                <div className="text-lg mb-1">{['💡', '🎨', '⚡', '🔧', '🔄', '✨'][i]}</div>
                <div className="capitalize">{step}</div>
              </div>
            ))}
          </div>
        </div>
        
        {isHost && (
          <div className="text-center">
            <Button onClick={() => updateGamePhase(gameCode, 'build')} className="bg-gradient-to-r from-[#6b8cce] to-[#5070b0] text-white px-12 py-4 text-xl font-bold rounded-xl">
              ⚔️ Begin the Challenge!
            </Button>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderBuild = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex flex-col">
      <FloatingParticles count={15} />
      
      {/* Top bar with progress */}
      <div className="relative z-10 p-4 border-b border-white/10 bg-black/20">
        <ProgressTracker currentStep={buildStep} steps={BUILD_STEPS} />
      </div>
      
      {/* Villain battle */}
      <div className="relative z-10 px-4 py-2 bg-black/10">
        <VillainBattle activeVillain={activeVillain} defeatedVillains={defeatedVillains} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* Left - Chat */}
        <div className="w-1/2 flex flex-col border-r border-white/10">
          <div className="p-3 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-3">
              <ByteAvatar mood={byteMood} size="md" speaking={isTyping} />
              <div>
                <h2 className="text-white font-bold">BYTE</h2>
                <p className="text-white/50 text-sm">{isTyping ? 'typing...' : isStreaming ? 'coding...' : 'online'}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs text-white/50">Villains Defeated</div>
                <div className="text-lg font-bold text-[#48a89a]">{defeatedVillains.length}/5</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <ChatMessage
                key={msg.id}
                from={msg.from}
                message={msg.message}
                timestamp={msg.timestamp}
                mood={msg.mood}
                suggestions={msg.suggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            ))}
            {isTyping && <ChatMessage from="byte" isTyping={true} />}
            <div ref={chatEndRef} />
          </div>
          
          {/* Feature selector (only in features step) */}
          {buildStep === 'features' && (
            <div className="p-4 border-t border-white/10 bg-black/20 max-h-80 overflow-y-auto">
              <FeatureSelector
                selectedFeatures={selectedFeatures}
                onToggle={handleFeatureToggle}
              />
              <Button
                onClick={handleLockFeatures}
                disabled={selectedFeatures.length < 3}
                className="w-full mt-4 bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] text-white py-3 font-bold rounded-xl disabled:opacity-50"
              >
                🔒 Lock In Features ({selectedFeatures.length}/5)
              </Button>
            </div>
          )}
          
          {/* Chat input (not during feature selection) */}
          {buildStep !== 'features' && (
            <div className="p-4 border-t border-white/10 bg-black/20">
              <ChatInput
                value={chatInput}
                onChange={setChatInput}
                onSend={handleChatSubmit}
                placeholder={
                  buildStep === 'ideate' ? "Describe your app idea..." :
                  buildStep === 'describe' ? "Describe the look and feel..." :
                  buildStep === 'iterate' ? "What would you like to change?" :
                  "Type a message..."
                }
                disabled={isStreaming || buildStep === 'generate'}
              />
              
              {/* Submit button */}
              {buildStep === 'iterate' && generatedCode && !hasSubmitted && (
                <Button
                  onClick={handleSubmit}
                  className="w-full mt-3 bg-gradient-to-r from-[#48a89a] to-[#3d8a7e] text-white py-3 font-bold rounded-xl"
                >
                  ✅ Submit My App!
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Right - Code Preview */}
        <div className="w-1/2 p-4">
          <CodeStreamPreview
            code={generatedCode}
            isStreaming={isStreaming}
            streamedCode={streamedCode}
            showPreview={showPreview}
            onToggleView={() => setShowPreview(!showPreview)}
            onFullscreen={() => setFullscreenApp({ code: generatedCode, title: appIdea })}
            title={appIdea || "My App"}
          />
        </div>
      </div>
      
      {/* Host controls */}
      {isHost && (
        <div className="relative z-10 p-4 border-t border-white/10 bg-black/20 flex justify-center gap-4">
          <Button onClick={onOpenDashboard} className="bg-white/20 text-white px-6 py-2 rounded-xl">
            📊 Dashboard
          </Button>
          <Button onClick={() => updateGamePhase(gameCode, 'present')} className="bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] text-white px-6 py-2 rounded-xl">
            📽️ Start Presentations
          </Button>
        </div>
      )}
      
      {fullscreenApp && <FullscreenAppModal code={fullscreenApp.code} title={fullscreenApp.title} onClose={() => setFullscreenApp(null)} />}
    </div>
  );
  
  const renderPresent = () => {
    const submissions = Object.values(room?.submissions || {}).filter(s => s.type === 'app-complete');
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 overflow-y-auto">
        <FloatingParticles count={20} />
        <div className="max-w-6xl mx-auto relative z-10 py-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎤</div>
            <h1 className="text-4xl font-black text-white mb-2">APP <span className="text-[#d4a84b]">SHOWCASE</span></h1>
            <p className="text-white/70">Click "Demo" to view each app in fullscreen!</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {submissions.map((sub, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                <div className="h-48 overflow-hidden bg-white">
                  <iframe title={sub.appIdea} srcDoc={sub.code} className="w-full h-full pointer-events-none" style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }} />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{sub.appIdea}</h3>
                  <p className="text-white/60 text-sm mb-2">by {sub.playerName}</p>
                  <div className="flex gap-2 text-xs text-white/40 mb-4">
                    <span>⚡ {sub.features?.length || 0} features</span>
                    <span>🔄 {sub.iterations || 0} iterations</span>
                  </div>
                  <Button onClick={() => setFullscreenApp({ code: sub.code, title: sub.appIdea })} className="w-full bg-gradient-to-r from-[#6b8cce] to-[#5070b0] text-white py-2 font-medium rounded-xl">
                    🖥️ View Demo
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {isHost && (
            <div className="text-center">
              <Button onClick={() => updateGamePhase(gameCode, 'vote')} className="bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] text-white px-12 py-4 text-xl font-bold rounded-xl">
                🗳️ Start Voting
              </Button>
            </div>
          )}
        </div>
        {fullscreenApp && <FullscreenAppModal code={fullscreenApp.code} title={fullscreenApp.title} onClose={() => setFullscreenApp(null)} />}
      </div>
    );
  };
  
  const renderVote = () => {
    const submissions = Object.values(room?.submissions || {}).filter(s => s.type === 'app-complete');
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 overflow-y-auto">
        <FloatingParticles count={20} />
        <div className="max-w-4xl mx-auto relative z-10 py-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🗳️</div>
            <h1 className="text-4xl font-black text-white mb-2">VOTE FOR YOUR <span className="text-[#d4a84b]">FAVORITE</span></h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {submissions.map((sub, i) => (
              <button key={i} onClick={() => submitVote(gameCode, userId, sub.playerId)} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-transparent hover:border-[#d4a84b] transition-all text-left">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">💻</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{sub.appIdea}</h3>
                    <p className="text-white/60 text-sm mb-3">by {sub.playerName}</p>
                    <span className="bg-[#d4a84b] text-white px-3 py-1 rounded-full text-sm font-medium">Click to Vote</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {isHost && (
            <div className="text-center">
              <Button onClick={() => updateGamePhase(gameCode, 'results')} className="bg-gradient-to-r from-[#48a89a] to-[#3d8a7e] text-white px-12 py-4 text-xl font-bold rounded-xl">
                🏆 Show Results
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderResults = () => {
    const players = Object.values(room?.players || {}).sort((a, b) => (b.votes || 0) - (a.votes || 0));
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 overflow-y-auto">
        <FloatingParticles count={40} />
        <div className="max-w-3xl mx-auto relative z-10 py-8">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🏆</div>
            <h1 className="text-5xl font-black text-white mb-4">ALL VILLAINS <span className="text-[#d4a84b]">DEFEATED!</span></h1>
          </div>
          
          <VillainBattle activeVillain={null} defeatedVillains={Object.keys(VILLAINS)} />
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 my-8 border border-white/20">
            <div className="flex items-start gap-4">
              <ByteAvatar mood="proud" size="lg" />
              <div>
                <p className="text-white text-lg">"You ALL did incredible! Every villain defeated, every app built with creativity and determination. You're all app creators now! 🚀"</p>
                <p className="text-white/60 mt-2">- BYTE</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            {players.slice(0, 5).map((player, i) => (
              <div key={player.id} className={`flex items-center justify-between p-6 rounded-2xl ${i === 0 ? 'bg-gradient-to-r from-[#d4a84b] via-[#e8c36a] to-[#d4a84b] text-white' : i === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-200 text-gray-800' : i === 2 ? 'bg-gradient-to-r from-orange-300 to-orange-200 text-orange-900' : 'bg-white/10 text-white'}`}>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                  <span className="text-2xl font-bold">{player.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black">{player.votes || 0}</div>
                  <div className="text-sm opacity-70">votes</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button onClick={onBack} className="bg-gradient-to-r from-[#6b8cce] to-[#5070b0] text-white px-12 py-4 text-xl font-bold rounded-xl">
              🏠 Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // Main render
  const renderPhase = () => {
    switch (room?.phase) {
      case 'lobby': return renderLobby();
      case 'intro': return renderIntro();
      case 'build': return renderBuild();
      case 'present': return renderPresent();
      case 'vote': return renderVote();
      case 'results': return renderResults();
      default: return renderLobby();
    }
  };
  
  return (
    <div className="relative">
      {renderPhase()}
      <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium transition-all">
        ← Exit
      </button>
    </div>
  );
};

export default VibeCodeChallenge;

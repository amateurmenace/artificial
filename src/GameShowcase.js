// GAME SHOWCASE - Compact grid with side-by-side details
// Custom pixel-art icons, learning objectives prominent

import React, { useState, useEffect } from 'react';

// ============================================
// CUSTOM SVG ICONS (pixel-art style matching BYTE)
// ============================================

const GameIcon = ({ type, size = 32 }) => {
  const icons = {
    spotTheFake: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Magnifying glass with eye */}
        <circle cx="20" cy="20" r="12" stroke="#14b8a6" strokeWidth="3" fill="#14b8a620"/>
        <line x1="29" y1="29" x2="40" y2="40" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="4" fill="#14b8a6"/>
        <circle cx="20" cy="20" r="1.5" fill="#0a0a0a"/>
        <path d="M14 18 Q20 14 26 18" stroke="#14b8a6" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    memeMachine: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Rocket with spark */}
        <path d="M24 6 L30 20 L24 18 L18 20 Z" fill="#d97706"/>
        <path d="M18 20 L16 28 L24 24 L32 28 L30 20 Z" fill="#f59e0b"/>
        <rect x="20" y="28" width="8" height="6" rx="1" fill="#d97706"/>
        <path d="M21 34 L19 42 L24 38 L29 42 L27 34" fill="#ef4444" opacity="0.8"/>
        <circle cx="24" cy="16" r="2" fill="#fbbf24"/>
        <circle cx="36" cy="10" r="1.5" fill="#fbbf24"/>
        <circle cx="38" cy="14" r="1" fill="#f59e0b"/>
      </svg>
    ),
    vibeCode: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Terminal window */}
        <rect x="4" y="8" width="40" height="32" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2"/>
        <rect x="4" y="8" width="40" height="8" rx="4" fill="#6366f1"/>
        <circle cx="10" cy="12" r="1.5" fill="#ef4444"/>
        <circle cx="16" cy="12" r="1.5" fill="#fbbf24"/>
        <circle cx="22" cy="12" r="1.5" fill="#22c55e"/>
        <text x="10" y="26" fill="#22d3ee" fontSize="6" fontFamily="monospace">&gt; build app</text>
        <text x="10" y="34" fill="#4ade80" fontSize="6" fontFamily="monospace">✓ deployed!</text>
      </svg>
    ),
    modelComparison: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Two panels with VS */}
        <rect x="2" y="8" width="18" height="32" rx="3" fill="#8b5cf620" stroke="#8b5cf6" strokeWidth="2"/>
        <rect x="28" y="8" width="18" height="32" rx="3" fill="#8b5cf620" stroke="#8b5cf6" strokeWidth="2"/>
        <text x="7" y="22" fill="#a78bfa" fontSize="6" fontFamily="monospace">A</text>
        <text x="33" y="22" fill="#a78bfa" fontSize="6" fontFamily="monospace">B</text>
        <rect x="6" y="26" width="10" height="2" rx="1" fill="#8b5cf650"/>
        <rect x="6" y="30" width="8" height="2" rx="1" fill="#8b5cf630"/>
        <rect x="32" y="26" width="10" height="2" rx="1" fill="#8b5cf650"/>
        <rect x="32" y="30" width="6" height="2" rx="1" fill="#8b5cf630"/>
        <circle cx="24" cy="24" r="6" fill="#8b5cf6"/>
        <text x="24" y="27" fill="white" fontSize="7" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">VS</text>
      </svg>
    ),
    remix: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Fork arrow */}
        <rect x="4" y="14" width="14" height="20" rx="3" fill="#ec489920" stroke="#ec4899" strokeWidth="2"/>
        <path d="M22 24 L30 16 M30 16 L28 20 M30 16 L26 16" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 24 L30 32 M30 32 L28 28 M30 32 L26 32" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="30" y="8" width="14" height="14" rx="3" fill="#ec489930" stroke="#ec4899" strokeWidth="2"/>
        <rect x="30" y="26" width="14" height="14" rx="3" fill="#ec489930" stroke="#ec4899" strokeWidth="2"/>
        <text x="37" y="18" fill="#f472b6" fontSize="8" textAnchor="middle" fontWeight="bold">+</text>
      </svg>
    ),
    tournament: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Trophy */}
        <path d="M16 10 L32 10 L30 24 L18 24 Z" fill="#f59e0b"/>
        <rect x="20" y="24" width="8" height="6" fill="#d97706"/>
        <rect x="16" y="30" width="16" height="4" rx="2" fill="#f59e0b"/>
        <path d="M14 10 Q8 10 8 16 Q8 20 14 20" stroke="#fbbf24" strokeWidth="2" fill="none"/>
        <path d="M34 10 Q40 10 40 16 Q40 20 34 20" stroke="#fbbf24" strokeWidth="2" fill="none"/>
        <circle cx="24" cy="16" r="3" fill="#fbbf24"/>
        <text x="24" y="19" fill="#92400e" fontSize="5" textAnchor="middle" fontWeight="bold">1</text>
      </svg>
    ),
  };
  return icons[type] || null;
};

// ============================================
// GAME DATA
// ============================================

const GAMES = [
  {
    id: 'spotTheFake',
    name: 'Spot the Fake',
    color: '#14b8a6',
    borderColor: 'border-teal-500/60',
    hoverBorder: 'hover:border-teal-400',
    bgGlow: 'shadow-teal-500/20',
    tagline: 'Real or AI? You decide.',
    duration: '30-45 min',
    players: '2-20',
    skills: [
      { name: 'AI Detection', desc: 'Identify artifacts in AI-generated images' },
      { name: 'Critical Thinking', desc: 'Evaluate evidence before judging' },
      { name: 'Digital Ethics', desc: 'Debate real-world AI impact' },
      { name: 'Media Literacy', desc: 'Question what you see online' },
    ],
    highlights: [
      'Examine images for AI tells — hands, text, reflections',
      'Werewolf-style bluffing finale',
      'Ethics and legal landscape discussions',
    ],
  },
  {
    id: 'memeMachine',
    name: 'Meme Machine',
    color: '#d97706',
    borderColor: 'border-amber-500/60',
    hoverBorder: 'hover:border-amber-400',
    bgGlow: 'shadow-amber-500/20',
    tagline: 'Create. Prompt. Go viral.',
    duration: '45-60 min',
    players: '3-20',
    skills: [
      { name: 'Prompt Engineering', desc: 'Write specific, effective AI prompts' },
      { name: 'AI Art Generation', desc: 'Control style, mood, and composition' },
      { name: 'Digital Advocacy', desc: 'Create content for causes you care about' },
      { name: 'Iteration', desc: 'Refine and improve through feedback' },
    ],
    highlights: [
      'Generate AI images from your prompts',
      'Battle Señor Slop — the lazy prompt villain',
      'Watch your meme go viral with reactions',
    ],
  },
  {
    id: 'vibeCode',
    name: 'Vibe Code',
    color: '#6366f1',
    borderColor: 'border-indigo-500/60',
    hoverBorder: 'hover:border-indigo-400',
    bgGlow: 'shadow-indigo-500/20',
    tagline: 'Describe it. AI builds it.',
    duration: '45-60 min',
    players: '2-15',
    skills: [
      { name: 'Vibe Coding', desc: 'Build apps by describing what you want' },
      { name: 'Human-AI Collaboration', desc: 'Guide AI as creative partner' },
      { name: 'Product Design', desc: 'Define problems, users, and features' },
      { name: 'Web Deployment', desc: 'Ship a real app to the internet' },
    ],
    highlights: [
      'BYTE AI mentor guides you step-by-step',
      'Battle villain bosses: CHAOS, BUGS, SLOP',
      'Deploy your app live to GitHub Pages',
    ],
  },
  {
    id: 'modelComparison',
    name: 'Model Battle',
    color: '#8b5cf6',
    borderColor: 'border-violet-500/60',
    hoverBorder: 'hover:border-violet-400',
    bgGlow: 'shadow-violet-500/20',
    tagline: 'Same prompt. Which AI wins?',
    duration: '15-20 min',
    players: '2-20',
    skills: [
      { name: 'AI Model Knowledge', desc: 'Understand different AI strengths' },
      { name: 'Critical Evaluation', desc: 'Judge quality without brand bias' },
      { name: 'Blind Testing', desc: 'Fair comparison methodology' },
    ],
    highlights: [
      'Blind multi-model comparison',
      'Vote, then dramatic reveal',
      'Learn which AI excels at what',
    ],
  },
  {
    id: 'remix',
    name: 'Remix Mode',
    color: '#ec4899',
    borderColor: 'border-pink-500/60',
    hoverBorder: 'hover:border-pink-400',
    bgGlow: 'shadow-pink-500/20',
    tagline: 'Fork it. Make it yours.',
    duration: '20-30 min',
    players: '3-15',
    skills: [
      { name: 'Collaboration', desc: 'Build on others\' ideas respectfully' },
      { name: 'Creative Iteration', desc: 'Improve through remixing' },
      { name: 'Constructive Feedback', desc: 'Articulate what you changed and why' },
    ],
    highlights: [
      'Fork someone else\'s creation',
      'Remix with your own creative twist',
      'Win Best Remix awards',
    ],
  },
  {
    id: 'tournament',
    name: 'Tournament',
    color: '#f59e0b',
    borderColor: 'border-amber-500/60',
    hoverBorder: 'hover:border-amber-400',
    bgGlow: 'shadow-amber-500/20',
    tagline: 'All 3 games. One champion.',
    duration: '2-3 hrs',
    players: '3-15',
    isTournament: true,
    skills: [
      { name: 'Comprehensive AI Literacy', desc: 'Master detection, creation, and building' },
      { name: 'Persistent Competition', desc: 'Scores carry across all three games' },
      { name: 'The Human Award', desc: 'Win a certificate proclaiming you: PERSON' },
    ],
    highlights: [
      'Spot the Fake → Meme Machine → Vibe Code',
      'Persistent leaderboard across all games',
      'Top scorer wins the Human Award',
    ],
  },
];

// ============================================
// MINI PREVIEW ANIMATIONS
// ============================================

const MiniPreview = ({ type, color }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 4), 1200);
    return () => clearInterval(interval);
  }, []);

  const previews = {
    spotTheFake: (
      <div className="flex items-center gap-1 mt-2">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=40&fit=crop&crop=face" alt="" className={`w-8 h-6 rounded object-cover ${frame === 1 ? 'ring-1 ring-teal-400' : ''}`} />
        <div className="text-[8px] text-slate-500">vs</div>
        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=40&fit=crop&crop=face" alt="" className={`w-8 h-6 rounded object-cover ${frame === 2 ? 'ring-1 ring-red-400' : ''}`} />
        <span className="text-[7px] ml-1 font-bold" style={{ color }}>{['scan', 'AI?', 'real', 'vote'][frame]}</span>
      </div>
    ),
    memeMachine: (
      <div className="mt-2">
        <div className="flex items-center gap-1">
          <div className="w-10 h-6 rounded bg-slate-600 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/50 to-orange-900/50" />
            <div className="absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-1000" style={{ width: `${[20, 50, 80, 100][frame]}%` }} />
          </div>
          <span className="text-[8px]" style={{ color }}>{['✏️ prompt', '🎨 style', '🖼️ gen...', '🚀 viral!'][frame]}</span>
        </div>
      </div>
    ),
    vibeCode: (
      <div className="mt-2 bg-slate-900/80 rounded px-1.5 py-1 font-mono">
        <div className="text-[7px] text-green-400 leading-tight">
          {frame === 0 && <span className="text-slate-500">&gt; describe app_</span>}
          {frame === 1 && <span className="text-cyan-400">&gt; BYTE enhancing...</span>}
          {frame === 2 && <span className="text-yellow-400">&gt; building... ⚡</span>}
          {frame === 3 && <span className="text-green-400">&gt; ✓ deployed! 🎉</span>}
        </div>
      </div>
    ),
    modelComparison: (
      <div className="mt-2 flex items-center gap-0.5">
        {['A', 'B', 'C'].map((l, i) => (
          <div key={l} className={`flex-1 h-5 rounded text-[7px] font-bold flex items-center justify-center transition-all ${i === frame % 3 ? 'bg-violet-500/40 text-violet-300 scale-110' : 'bg-slate-700/50 text-slate-500'}`}>{l}</div>
        ))}
        {frame === 3 && <span className="text-[8px] text-violet-400 ml-1">🎭</span>}
      </div>
    ),
    remix: (
      <div className="mt-2 flex items-center gap-1">
        <div className="w-6 h-5 rounded bg-slate-600 text-[7px] flex items-center justify-center">{frame < 2 ? '📱' : '📱'}</div>
        <span className="text-[8px]" style={{ color }}>{['→', '🔀', '✨', '🏆'][frame]}</span>
        <div className={`w-6 h-5 rounded text-[7px] flex items-center justify-center transition-all ${frame >= 2 ? 'bg-pink-500/30 scale-110' : 'bg-slate-700/50'}`}>{frame >= 2 ? '🚀' : '?'}</div>
      </div>
    ),
    tournament: (
      <div className="mt-2 flex items-center gap-0.5">
        {['🔍', '🚀', '💻'].map((g, i) => (
          <div key={i} className={`flex-1 h-5 rounded text-[8px] flex items-center justify-center transition-all ${i <= frame && frame < 3 ? 'bg-amber-500/30' : i === 0 && frame === 3 ? 'bg-amber-500/30' : 'bg-slate-700/30'}`}>{g}</div>
        ))}
        {frame === 3 && <span className="text-[8px] text-amber-400 ml-0.5">👑</span>}
      </div>
    ),
  };

  return previews[type] || null;
};

// ============================================
// GAME CARD
// ============================================

const GameCard = ({ game, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`relative text-left rounded-xl p-3 transition-all duration-200 border-2 overflow-hidden ${
      isSelected
        ? `${game.borderColor.replace('/60', '')} bg-slate-800 shadow-lg ${game.bgGlow} scale-[1.03]`
        : `border-slate-700/50 bg-slate-800/40 ${game.hoverBorder} hover:bg-slate-800/80`
    }`}
  >
    {game.isBonus && (
      <div className="absolute top-1.5 right-1.5 bg-purple-500/80 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">Bonus</div>
    )}
    <div className="flex items-center gap-2">
      <GameIcon type={game.id} size={24} />
      <div className="min-w-0">
        <h3 className="font-black text-white text-xs leading-tight truncate">{game.name}</h3>
      </div>
    </div>
    <MiniPreview type={game.id} color={game.color} />
    {isSelected && <div className="mt-2 h-0.5 rounded-full" style={{ backgroundColor: game.color }} />}
  </button>
);

// ============================================
// LARGE ANIMATED PREVIEW FOR DETAIL PANEL
// ============================================

const DetailPreview = ({ type, color }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 5), 1800);
    return () => clearInterval(interval);
  }, []);

  if (type === 'spotTheFake') {
    // Use real Unsplash photos from the game's image database
    const items = [
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', label: 'Portrait A', isAI: false },
      { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', label: 'Portrait B', isAI: true },
      { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop', label: 'Cat Photo', isAI: false },
      { url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop', label: 'Cat Photo 2', isAI: true },
    ];
    const idx = frame % 4;
    const item = items[idx];
    const scanProg = frame < 3 ? frame * 33 : undefined;
    return (
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className={`relative rounded-lg overflow-hidden border-2 transition-all ${frame >= 3 ? 'border-teal-400 shadow-lg shadow-teal-500/20' : 'border-slate-600'}`}>
              <img src={item.url} alt={item.label} className="w-full h-20 object-cover" loading="lazy" />
              {scanProg !== undefined && (
                <div className="absolute left-0 right-0 h-0.5 bg-teal-400/80 shadow-lg shadow-teal-400/50" style={{ top: `${scanProg}%` }} />
              )}
              <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white text-center py-0.5">{item.label}</p>
            </div>
          </div>
          <div className="text-center w-24">
            {frame < 3 ? (
              <div className="flex flex-col items-center gap-1">
                <svg className="w-6 h-6 text-teal-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/></svg>
                <p className="text-[10px] text-teal-400">Scanning...</p>
              </div>
            ) : (
              <div className={`text-xs font-black px-3 py-1.5 rounded-full ${item.isAI ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                {item.isAI ? 'AI GENERATED' : 'AUTHENTIC'}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {[0,1,2,3].map(i => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= idx ? 'bg-teal-400' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'memeMachine') {
    const stages = ['Writing prompt...', 'Choosing style...', 'Generating image...', 'Image ready!', 'Going viral!'];
    const stageIcons = ['pencil', 'palette', 'bolt', 'image', 'chart'];
    return (
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
        <div className="flex gap-3 items-center mb-3">
          <div className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all relative ${frame >= 3 ? 'border-amber-400' : 'border-slate-600'}`}>
            {frame < 3 ? (
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-dashed border-slate-500 rounded-lg animate-pulse" />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.779M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-1">{stages[frame]}</p>
            <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700" style={{ width: `${(frame + 1) * 20}%` }} />
            </div>
            {frame >= 4 && (
              <div className="flex gap-2 mt-2">
                {[14, 8, 23, 5].map((n, i) => (
                  <span key={i} className="bg-slate-700/50 rounded px-1.5 py-0.5 text-[10px] text-slate-300 animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>
                    {['fire', 'love', 'wow', 'viral'][i]} {n}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {frame >= 3 && (
          <div className="bg-black/40 rounded-lg px-3 py-1.5">
            <p className="text-white font-black text-xs text-center tracking-wide" style={{ fontFamily: 'Impact, sans-serif', textShadow: '1px 1px 2px black' }}>SAVE THE PLANET — ACT NOW</p>
          </div>
        )}
      </div>
    );
  }

  if (type === 'vibeCode') {
    const lines = [
      { text: '> "Build a mood tracker for students"', color: 'text-slate-400' },
      { text: 'BYTE: Enhancing your spec...', color: 'text-cyan-400' },
      { text: 'Generating app code...', color: 'text-yellow-400' },
      { text: 'App built! Preview ready.', color: 'text-green-400' },
      { text: 'Deployed to the web!', color: 'text-emerald-400' },
    ];
    const icons = ['>', '~', '*', '+', '^'];
    return (
      <div className="bg-slate-950 rounded-xl border border-slate-700 overflow-hidden font-mono">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border-b border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-[10px] text-slate-500 ml-2">vibe-code.js</span>
        </div>
        <div className="p-3 space-y-1.5">
          {lines.slice(0, frame + 1).map((line, i) => (
            <p key={i} className={`text-xs ${line.color} ${i === frame ? 'animate-pulse' : ''}`}>
              <span className="text-slate-600 mr-1">{icons[i]}</span>{line.text}
            </p>
          ))}
          {frame < 4 && <span className="inline-block w-2 h-3.5 bg-white/70 animate-pulse" />}
        </div>
      </div>
    );
  }

  if (type === 'modelComparison') {
    const models = ['Model A', 'Model B', 'Model C'];
    const reveals = ['GPT-5', 'Gemini 3', 'Claude 4.5'];
    const codeSnippets = [
      'function app() {\n  return <Card />;\n}',
      'const App = () => (\n  <Layout />\n)',
      'export default\n  () => <Main />'
    ];
    return (
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {models.map((m, i) => (
            <div key={i} className={`rounded-lg p-2 text-center transition-all border ${frame >= 3 ? 'border-violet-500/50 bg-violet-500/10' : i === frame % 3 ? 'border-slate-500 bg-slate-700 scale-105' : 'border-slate-700 bg-slate-800/50'}`}>
              <p className="text-[10px] font-bold text-violet-300 mb-1">{frame >= 3 ? reveals[i] : m}</p>
              <pre className="text-[7px] text-slate-400 font-mono leading-tight text-left h-8 overflow-hidden">{codeSnippets[i]}</pre>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400">
          {frame < 3 ? 'Vote for the best output...' : 'Revealed! Different models, different styles.'}
        </p>
      </div>
    );
  }

  if (type === 'remix') {
    return (
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-3">
          <div className={`flex-1 rounded-lg overflow-hidden border transition-all ${frame < 2 ? 'border-slate-600' : 'border-slate-700'}`}>
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 h-12" />
            <div className="bg-slate-800 px-2 py-1">
              <p className="text-[9px] text-slate-400">Original</p>
              <p className="text-[10px] text-slate-300 font-bold">Task App</p>
            </div>
          </div>
          <div className={`transition-all duration-300 ${frame >= 1 ? 'text-pink-400 scale-125' : 'text-slate-600'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
          <div className={`flex-1 rounded-lg overflow-hidden border transition-all ${frame >= 2 ? 'border-pink-500/50 scale-105' : 'border-slate-700'}`}>
            <div className={`h-12 transition-all ${frame >= 2 ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-slate-800'}`} />
            <div className="bg-slate-800 px-2 py-1">
              <p className="text-[9px] text-pink-400">{frame >= 2 ? 'Your Remix' : '...'}</p>
              <p className="text-[10px] text-slate-300 font-bold">{frame >= 3 ? 'Task Pro' : '—'}</p>
            </div>
          </div>
        </div>
        {frame >= 4 && <p className="text-center text-xs text-pink-400 mt-2 font-bold">Best Remix Award!</p>}
      </div>
    );
  }

  if (type === 'tournament') {
    const games = [
      { icon: <GameIcon type="spotTheFake" size={20} />, n: 'Detect' },
      { icon: <GameIcon type="memeMachine" size={20} />, n: 'Create' },
      { icon: <GameIcon type="vibeCode" size={20} />, n: 'Build' },
    ];
    return (
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
        <div className="flex gap-2 mb-3">
          {games.map((g, i) => (
            <div key={i} className={`flex-1 rounded-lg p-2 text-center transition-all border ${i < frame && frame <= 3 ? 'border-emerald-500/50 bg-emerald-500/10' : i === frame && frame <= 2 ? 'border-amber-400 bg-amber-500/10 scale-105' : 'border-slate-700 bg-slate-800/30'}`}>
              <div className="flex justify-center mb-1">{g.icon}</div>
              <p className="text-[9px] text-slate-400">{g.n}</p>
              {i < frame && frame <= 3 && <p className="text-[9px] text-emerald-400 font-bold">Done</p>}
            </div>
          ))}
        </div>
        {frame >= 3 && (
          <div className="text-center bg-amber-500/10 rounded-lg p-2 border border-amber-500/30">
            <GameIcon type="tournament" size={20} />
            <p className="text-xs text-amber-400 font-bold mt-1">Champion crowned!</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// ============================================
// DETAIL PANEL — preview + side by side info
// ============================================

const DetailPanel = ({ game, onPlay }) => (
  <div className="bg-slate-800/90 rounded-2xl border-2 overflow-hidden" style={{ borderColor: game.color + '40' }}>
    {/* Header */}
    <div className="px-5 py-4 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${game.color}12, transparent)` }}>
      <div className="flex items-center gap-3">
        <GameIcon type={game.id} size={40} />
        <div>
          <h2 className="text-xl font-black text-white">{game.name}</h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
            <span>⏱ {game.duration}</span>
            <span>👥 {game.players}</span>
            {game.isBonus && <span className="text-purple-400 font-bold">Bonus Round</span>}
            {game.isTournament && <span className="text-amber-400 font-bold">All Games Combined</span>}
          </div>
        </div>
      </div>
      <button
        onClick={() => onPlay(game.id)}
        className="px-5 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 hover:brightness-110 shadow-lg"
        style={{ backgroundColor: game.color }}
      >
        Play Now →
      </button>
    </div>

    {/* Animated Preview */}
    <div className="px-5 pt-4">
      <DetailPreview type={game.id} color={game.color} />
    </div>

    {/* Side by side: How to Play + Learning Objectives */}
    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
      {/* How to Play */}
      <div className="p-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">How to Play</h3>
        <div className="space-y-2">
          {game.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-slate-700/20 rounded-lg px-3 py-2">
              <span className="text-xs font-bold mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: game.color + '25', color: game.color }}>
                {i + 1}
              </span>
              <span className="text-sm text-slate-300">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="p-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">What You'll Learn</h3>
        <div className="space-y-2">
          {game.skills.map((skill, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: game.color }} />
              <div>
                <span className="text-sm font-bold text-white">{skill.name}</span>
                <p className="text-xs text-slate-400">{skill.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const GameShowcase = ({ onSelectGame }) => {
  const [selectedId, setSelectedId] = useState('spotTheFake');
  const selectedGame = GAMES.find(g => g.id === selectedId);

  // Auto-cycle on idle
  const [autoCycle, setAutoCycle] = useState(true);
  useEffect(() => {
    if (!autoCycle) return;
    const interval = setInterval(() => {
      setSelectedId(prev => {
        const idx = GAMES.findIndex(g => g.id === prev);
        return GAMES[(idx + 1) % GAMES.length].id;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [autoCycle]);

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Choose Your Game</h2>
          <p className="text-slate-400 text-sm">Select a game to see what you'll play and learn</p>
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
          {GAMES.map(game => (
            <GameCard
              key={game.id}
              game={game}
              isSelected={selectedId === game.id}
              onClick={() => { setSelectedId(game.id); setAutoCycle(false); }}
            />
          ))}
        </div>

        {/* Detail panel */}
        {selectedGame && <DetailPanel game={selectedGame} onPlay={onSelectGame} />}
      </div>
    </section>
  );
};

export default GameShowcase;

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
// STATIC PREVIEW FOR DETAIL PANEL (no animation)
// ============================================

const DetailPreview = ({ type, color }) => {
  if (type === 'spotTheFake') {
    return (
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="rounded-lg overflow-hidden border-2 border-teal-400/40 relative w-24 flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&facepad=3" alt="" className="w-full object-contain" loading="lazy" />
              <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-[9px] text-white text-center py-0.5 font-medium">Image A</p>
            </div>
            <div className="rounded-lg overflow-hidden border-2 border-red-400/40 relative w-24 flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face&facepad=3" alt="" className="w-full object-contain" loading="lazy" />
              <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-[9px] text-white text-center py-0.5 font-medium">Image B</p>
            </div>
          </div>
          <div className="text-center flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="text-[10px] font-black px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
              REAL or AI?
            </div>
            <p className="text-[10px] text-slate-400">Vote, then reveal</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'memeMachine') {
    return (
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-400/50 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center">
            <svg className="w-10 h-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-1">Write a prompt. AI creates the image.</p>
            <p className="text-xs text-slate-400 mb-2">Learn to craft effective AI image prompts for advocacy memes</p>
            <div className="flex gap-2">
              {['Prompt', 'Generate', 'Critique', 'Go Viral'].map((step, i) => (
                <span key={i} className="bg-amber-500/15 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20">{step}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'vibeCode') {
    return (
      <div className="bg-slate-950 rounded-xl border border-slate-700 overflow-hidden font-mono">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border-b border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-[10px] text-slate-500 ml-2">vibe-code.js</span>
        </div>
        <div className="p-3 space-y-1.5">
          <p className="text-xs text-slate-400"><span className="text-slate-600 mr-1">&gt;</span>"Build a mood tracker for students"</p>
          <p className="text-xs text-cyan-400"><span className="text-slate-600 mr-1">~</span>BYTE: Enhancing your spec...</p>
          <p className="text-xs text-yellow-400"><span className="text-slate-600 mr-1">*</span>Generating app code...</p>
          <p className="text-xs text-green-400"><span className="text-slate-600 mr-1">+</span>App built! Preview ready.</p>
          <p className="text-xs text-emerald-400"><span className="text-slate-600 mr-1">^</span>Deployed to the web!</p>
        </div>
      </div>
    );
  }

  if (type === 'modelComparison') {
    const models = [
      { blind: 'Model A', real: 'GPT-5', snippet: 'function app() {\n  return <Card />;\n}' },
      { blind: 'Model B', real: 'Gemini 3', snippet: 'const App = () => (\n  <Layout />\n)' },
      { blind: 'Model C', real: 'Claude 4.5', snippet: 'export default\n  () => <Main />' },
    ];
    return (
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {models.map((m, i) => (
            <div key={i} className="rounded-lg p-2 text-center border border-violet-500/30 bg-violet-500/5">
              <p className="text-[10px] font-bold text-violet-300 mb-1">{m.blind}</p>
              <pre className="text-[7px] text-slate-400 font-mono leading-tight text-left h-8 overflow-hidden">{m.snippet}</pre>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400">Same prompt, different models. Vote blind, then reveal which AI made which.</p>
      </div>
    );
  }

  if (type === 'remix') {
    return (
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-lg overflow-hidden border border-slate-600">
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 h-12" />
            <div className="bg-slate-800 px-2 py-1">
              <p className="text-[10px] text-slate-400">Original</p>
              <p className="text-[11px] text-slate-300 font-bold">Task App</p>
            </div>
          </div>
          <div className="text-pink-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
          <div className="flex-1 rounded-lg overflow-hidden border border-pink-500/50">
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 h-12" />
            <div className="bg-slate-800 px-2 py-1">
              <p className="text-[10px] text-pink-400">Your Remix</p>
              <p className="text-[11px] text-slate-300 font-bold">Task Pro</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'tournament') {
    return (
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
        <div className="flex gap-2">
          {[
            { icon: <GameIcon type="spotTheFake" size={20} />, n: 'Detect', done: true },
            { icon: <GameIcon type="memeMachine" size={20} />, n: 'Create', done: true },
            { icon: <GameIcon type="vibeCode" size={20} />, n: 'Build', done: false },
          ].map((g, i) => (
            <div key={i} className={`flex-1 rounded-lg p-2 text-center border ${g.done ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-amber-400 bg-amber-500/10'}`}>
              <div className="flex justify-center mb-1">{g.icon}</div>
              <p className="text-[10px] text-slate-300 font-medium">{g.n}</p>
              {g.done && <p className="text-[9px] text-emerald-400 font-bold">Done</p>}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">Play all three core games. Top scorer wins the Human Award.</p>
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
    <div className="px-6 py-5 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${game.color}15, transparent)` }}>
      <div className="flex items-center gap-3">
        <GameIcon type={game.id} size={44} />
        <div>
          <h2 className="text-2xl font-black text-white">{game.name}</h2>
          <p className="text-sm text-slate-300 mt-0.5">{game.tagline}</p>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>⏱ {game.duration}</span>
            <span>👥 {game.players} players</span>
            {game.isBonus && <span className="text-purple-400 font-bold">Bonus Round</span>}
            {game.isTournament && <span className="text-amber-400 font-bold">All Games Combined</span>}
          </div>
        </div>
      </div>
      <button
        onClick={() => onPlay(game.id)}
        className="px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 hover:brightness-110 shadow-lg"
        style={{ backgroundColor: game.color }}
      >
        Play Now →
      </button>
    </div>

    {/* Static Preview */}
    <div className="px-6 pt-4">
      <DetailPreview type={game.id} color={game.color} />
    </div>

    {/* Side by side: How to Play + Learning Objectives */}
    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
      {/* How to Play */}
      <div className="p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">How to Play</h3>
        <div className="space-y-2.5">
          {game.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-700/20 rounded-lg px-3 py-2.5">
              <span className="text-xs font-bold mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: game.color + '25', color: game.color }}>
                {i + 1}
              </span>
              <span className="text-sm text-slate-200 leading-relaxed">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">What You'll Learn</h3>
        <div className="space-y-3">
          {game.skills.map((skill, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: game.color }} />
              <div>
                <span className="text-sm font-bold text-white">{skill.name}</span>
                <p className="text-[13px] text-slate-300 leading-relaxed">{skill.desc}</p>
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

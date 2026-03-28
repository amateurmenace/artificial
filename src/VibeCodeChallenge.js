// VIBE CODE CHALLENGE v10 - Enhanced with Design Spec, 8-bit Characters, Slop Villain
// Battle villains, build apps, learn AI prompt engineering!

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Alert, ShareableResultCard, CollaborationBar } from './components';
import { playWhoosh, playCelebration } from './sounds';
import { updateGamePhase, submitToGame, submitVote, updatePlayerScore, updatePlayerStatus } from './firebase';
import { chatCompletion, hasApiKey, getProviderConfig, getModelInfo } from './ai-services';
import { PromptTimelineProvider, usePromptTimeline, PromptTimelineSidebar, PromptTimelineButton } from './PromptTimeline';
import DeployGuide from './DeployGuide';

// ============================================
// VILLAINS - With Proper Names!
// ============================================

const VILLAINS = {
  chaos: { 
    name: 'CHAOS', 
    fullName: 'Lord Chaos', 
    color: 'from-red-500 to-orange-500', 
    desc: 'Makes everything confusing!',
    personality: 'Loves vague requirements and unclear goals'
  },
  complexity: { 
    name: 'COMPLEXITY', 
    fullName: 'Baron Complexity',
    color: 'from-purple-500 to-pink-500', 
    desc: 'Overcomplicates simple things!',
    personality: 'Turns simple ideas into impossible puzzles'
  },
  confusion: { 
    name: 'CONFUSION', 
    fullName: 'Professor Confusion',
    color: 'from-blue-500 to-cyan-500', 
    desc: 'Muddles your thinking!',
    personality: 'Twists words until nobody understands'
  },
  bugs: { 
    name: 'BUGS', 
    fullName: 'Captain Bugs',
    color: 'from-green-500 to-emerald-500', 
    desc: 'Breaks your code!',
    personality: 'Hides errors in the tiniest places'
  },
  scope: { 
    name: 'SCOPE CREEP', 
    fullName: 'The Scope Creep',
    color: 'from-amber-500 to-yellow-500', 
    desc: 'Adds endless features!',
    personality: 'Whispers "just one more feature" forever'
  },
  slop: {
    name: 'SLOP',
    fullName: 'Señor Slop',
    color: 'from-gray-600 to-gray-800',
    desc: 'Tempts you to let AI do everything!',
    personality: 'Makes you forget that YOU are the creative force'
  }
};

const AWARDS = {
  mostTalkedAbout: { name: 'Most Talked About', icon: '💬', description: 'Most reactions from players' },
  bestVibeCoder: { name: 'Best Vibe Coder', icon: '🏆', description: 'Most votes from players' },
  mostLikelyReplaced: { name: 'Most Likely to Be Replaced by AI', icon: '🤖', description: 'Used AI generation the most' },
};

const REACTIONS = [
  { emoji: '🔥', name: 'fire', points: 3 },
  { emoji: '💯', name: 'perfect', points: 4 },
  { emoji: '🤯', name: 'mindblown', points: 3 },
  { emoji: '👏', name: 'clap', points: 2 },
  { emoji: '❤️', name: 'love', points: 2 },
  { emoji: '🚀', name: 'rocket', points: 3 },
];

const AI_GENERATION_COST = 15;

const VIBE_TIPS = [
  { title: "What is Vibe Coding?", content: "Describing WHAT you want, not HOW to build it. AI handles the technical details!" },
  { title: "Iteration is Key", content: "The best apps come from multiple rounds of refinement. Treat it like sculpting!" },
  { title: "Be Specific About Feel", content: "Words like 'smooth', 'snappy', 'playful' help AI understand your vision." },
  { title: "Reference Real Apps", content: "Saying 'like Notion's sidebar' gives AI concrete examples to learn from." },
  { title: "Think About States", content: "Great apps handle empty, loading, error, and success states gracefully." },
];

const STAGE_TIPS = {
  problem: { title: "Defining the Problem", content: "Be specific about WHO has this problem and WHY current solutions don't work.", example: "Instead of 'track habits', try 'help busy parents remember vitamins without annoying notifications'" },
  users: { title: "Know Your Users", content: "Think about context: mobile or desktop? In a hurry or relaxed?", example: "Instead of 'everyone', try 'remote workers checking quickly between meetings'" },
  features: { title: "Features with Purpose", content: "Every feature should directly help solve the user's need.", example: "Instead of 'add data', try 'quick-add button with smart defaults'" },
  twist: { title: "Stand Out", content: "Your twist makes people remember your app - visual, functional, or emotional.", example: "A budget app that celebrates savings with confetti!" },
  style: { title: "Visual Language", content: "Style communicates. Reference specific apps or design movements.", example: "Instead of 'modern', try 'minimal like Linear, with one accent color'" },
};

const STEP_PROMPTS = {
  problem: { placeholder: "e.g. 'Help neighbors share tools instead of buying new ones'", label: "🎯 What problem will your app solve?" },
  users: { placeholder: "e.g. 'Busy parents who check their phone between meetings'", label: "👥 Who will use this app?" },
  features: { placeholder: "e.g. 'Quick-add button, search bar, progress tracker'", label: "⚡ What features should it have?" },
  twist: { placeholder: "e.g. 'Celebrates savings with confetti and streaks'", label: "✨ What makes your app unique and memorable?" },
  style: { placeholder: "e.g. 'Minimal like Linear, dark mode, one cyan accent color'", label: "🎨 Describe the visual style" },
  review: { placeholder: "", label: "" },
  build: { placeholder: "", label: "" },
  iterate: { placeholder: "e.g. 'Make the buttons bigger and add a dark mode toggle'", label: "🔄 What changes do you want to make?" },
};

// ============================================
// 8-BIT PIXEL ART CHARACTERS (SVG-based, animated)
// ============================================

const PixelCharacter = ({ type, size = 48, animate = true, mood = 'normal' }) => {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    if (animate) {
      const interval = setInterval(() => setFrame(f => (f + 1) % 4), 250);
      return () => clearInterval(interval);
    }
  }, [animate]);
  
  // 8-bit BYTE character (friendly robot helper)
  const byteFrames = [
    // Frame 1: Eyes open
    `<rect x="8" y="8" width="32" height="32" fill="#00D4FF" rx="4"/>
     <rect x="14" y="16" width="6" height="6" fill="#0a0a0a"/>
     <rect x="28" y="16" width="6" height="6" fill="#0a0a0a"/>
     <rect x="16" y="28" width="16" height="4" fill="#0a0a0a"/>
     <rect x="4" y="20" width="4" height="8" fill="#00D4FF"/>
     <rect x="40" y="20" width="4" height="8" fill="#00D4FF"/>`,
    // Frame 2: Blink
    `<rect x="8" y="8" width="32" height="32" fill="#00D4FF" rx="4"/>
     <rect x="14" y="18" width="6" height="2" fill="#0a0a0a"/>
     <rect x="28" y="18" width="6" height="2" fill="#0a0a0a"/>
     <rect x="16" y="28" width="16" height="4" fill="#0a0a0a"/>
     <rect x="4" y="22" width="4" height="8" fill="#00D4FF"/>
     <rect x="40" y="22" width="4" height="8" fill="#00D4FF"/>`,
    // Frame 3: Eyes open, arms up
    `<rect x="8" y="8" width="32" height="32" fill="#00D4FF" rx="4"/>
     <rect x="14" y="16" width="6" height="6" fill="#0a0a0a"/>
     <rect x="28" y="16" width="6" height="6" fill="#0a0a0a"/>
     <rect x="18" y="28" width="12" height="4" fill="#0a0a0a"/>
     <rect x="2" y="16" width="4" height="8" fill="#00D4FF"/>
     <rect x="42" y="16" width="4" height="8" fill="#00D4FF"/>`,
    // Frame 4: Excited
    `<rect x="8" y="6" width="32" height="32" fill="#00D4FF" rx="4"/>
     <rect x="14" y="14" width="6" height="8" fill="#0a0a0a"/>
     <rect x="28" y="14" width="6" height="8" fill="#0a0a0a"/>
     <rect x="16" y="28" width="16" height="4" fill="#0a0a0a"/>
     <rect x="2" y="12" width="4" height="8" fill="#00D4FF"/>
     <rect x="42" y="12" width="4" height="8" fill="#00D4FF"/>`
  ];
  
  // User character
  const userFrames = [
    `<rect x="12" y="4" width="24" height="24" fill="#6366f1" rx="12"/>
     <rect x="18" y="12" width="4" height="4" fill="#0a0a0a"/>
     <rect x="26" y="12" width="4" height="4" fill="#0a0a0a"/>
     <rect x="20" y="20" width="8" height="2" fill="#0a0a0a"/>
     <rect x="8" y="32" width="32" height="12" fill="#6366f1" rx="2"/>`
  ];
  
  // Villain characters
  const villainFrames = {
    chaos: [
      `<polygon points="24,4 44,40 4,40" fill="#ef4444"/>
       <rect x="16" y="20" width="4" height="4" fill="#0a0a0a"/>
       <rect x="28" y="20" width="4" height="4" fill="#0a0a0a"/>
       <path d="M16 32 Q24 28 32 32" stroke="#0a0a0a" stroke-width="2" fill="none"/>`,
      `<polygon points="24,6 44,40 4,40" fill="#ef4444"/>
       <rect x="16" y="22" width="4" height="4" fill="#0a0a0a" transform="rotate(10 18 24)"/>
       <rect x="28" y="22" width="4" height="4" fill="#0a0a0a" transform="rotate(-10 30 24)"/>
       <path d="M16 32 Q24 36 32 32" stroke="#0a0a0a" stroke-width="2" fill="none"/>`
    ],
    complexity: [
      `<rect x="8" y="8" width="32" height="32" fill="#a855f7"/>
       <rect x="12" y="12" width="24" height="24" fill="#7c3aed"/>
       <circle cx="20" cy="22" r="3" fill="#0a0a0a"/>
       <circle cx="28" cy="22" r="3" fill="#0a0a0a"/>
       <rect x="16" y="30" width="16" height="2" fill="#0a0a0a"/>`,
      `<rect x="8" y="6" width="32" height="32" fill="#a855f7"/>
       <rect x="12" y="10" width="24" height="24" fill="#7c3aed"/>
       <circle cx="20" cy="20" r="3" fill="#0a0a0a"/>
       <circle cx="28" cy="20" r="3" fill="#0a0a0a"/>
       <rect x="16" y="28" width="16" height="2" fill="#0a0a0a"/>`
    ],
    bugs: [
      `<ellipse cx="24" cy="28" rx="16" ry="12" fill="#22c55e"/>
       <circle cx="18" cy="24" r="4" fill="#0a0a0a"/>
       <circle cx="30" cy="24" r="4" fill="#0a0a0a"/>
       <circle cx="18" cy="23" r="1" fill="#fff"/>
       <circle cx="30" cy="23" r="1" fill="#fff"/>
       <line x1="8" y1="20" x2="4" y2="12" stroke="#22c55e" stroke-width="2"/>
       <line x1="40" y1="20" x2="44" y2="12" stroke="#22c55e" stroke-width="2"/>`,
      `<ellipse cx="24" cy="26" rx="16" ry="12" fill="#22c55e"/>
       <circle cx="18" cy="22" r="4" fill="#0a0a0a"/>
       <circle cx="30" cy="22" r="4" fill="#0a0a0a"/>
       <circle cx="19" cy="21" r="1" fill="#fff"/>
       <circle cx="31" cy="21" r="1" fill="#fff"/>
       <line x1="8" y1="18" x2="2" y2="14" stroke="#22c55e" stroke-width="2"/>
       <line x1="40" y1="18" x2="46" y2="14" stroke="#22c55e" stroke-width="2"/>`
    ],
    scope: [
      `<circle cx="24" cy="24" r="18" fill="#eab308"/>
       <rect x="16" y="18" width="4" height="6" fill="#0a0a0a"/>
       <rect x="28" y="18" width="4" height="6" fill="#0a0a0a"/>
       <ellipse cx="24" cy="32" rx="8" ry="4" fill="#0a0a0a"/>
       <rect x="6" y="22" width="8" height="4" fill="#eab308"/>
       <rect x="34" y="22" width="8" height="4" fill="#eab308"/>`,
      `<circle cx="24" cy="22" r="18" fill="#eab308"/>
       <rect x="16" y="16" width="4" height="6" fill="#0a0a0a"/>
       <rect x="28" y="16" width="4" height="6" fill="#0a0a0a"/>
       <ellipse cx="24" cy="30" rx="10" ry="5" fill="#0a0a0a"/>
       <rect x="4" y="20" width="10" height="4" fill="#eab308"/>
       <rect x="34" y="20" width="10" height="4" fill="#eab308"/>`
    ],
    confusion: [
      `<rect x="8" y="8" width="32" height="32" fill="#3b82f6" rx="8"/>
       <text x="14" y="26" font-size="12" fill="#0a0a0a">?</text>
       <text x="28" y="26" font-size="12" fill="#0a0a0a">?</text>
       <path d="M14 34 Q24 38 34 34" stroke="#0a0a0a" stroke-width="2" fill="none"/>`,
      `<rect x="8" y="10" width="32" height="32" fill="#3b82f6" rx="8"/>
       <text x="14" y="28" font-size="12" fill="#0a0a0a">!</text>
       <text x="28" y="28" font-size="12" fill="#0a0a0a">?</text>
       <path d="M14 36 Q24 32 34 36" stroke="#0a0a0a" stroke-width="2" fill="none"/>`
    ],
    slop: [
      `<ellipse cx="24" cy="28" rx="18" ry="14" fill="#4b5563"/>
       <ellipse cx="24" cy="28" rx="14" ry="10" fill="#6b7280"/>
       <rect x="16" y="22" width="6" height="2" fill="#0a0a0a"/>
       <rect x="26" y="22" width="6" height="2" fill="#0a0a0a"/>
       <ellipse cx="24" cy="32" rx="6" ry="2" fill="#0a0a0a"/>
       <text x="10" y="14" font-size="8" fill="#9ca3af">z</text>
       <text x="32" y="10" font-size="10" fill="#9ca3af">z</text>`,
      `<ellipse cx="24" cy="30" rx="18" ry="14" fill="#4b5563"/>
       <ellipse cx="24" cy="30" rx="14" ry="10" fill="#6b7280"/>
       <rect x="16" y="24" width="6" height="2" fill="#0a0a0a"/>
       <rect x="26" y="24" width="6" height="2" fill="#0a0a0a"/>
       <ellipse cx="24" cy="34" rx="6" ry="2" fill="#0a0a0a"/>
       <text x="8" y="12" font-size="10" fill="#9ca3af">z</text>
       <text x="34" y="8" font-size="12" fill="#9ca3af">Z</text>`
    ]
  };
  
  const getFrames = () => {
    if (type === 'byte') return byteFrames;
    if (type === 'user') return userFrames;
    if (villainFrames[type]) return villainFrames[type];
    return byteFrames;
  };
  
  const frames = getFrames();
  const currentFrame = frames[frame % frames.length];
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={animate ? 'transition-transform' : ''}>
      <g dangerouslySetInnerHTML={{ __html: currentFrame }} />
    </svg>
  );
};

// ============================================
// COMPONENTS
// ============================================

const FloatingParticles = ({ count = 15 }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="absolute rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10"
        style={{ width: Math.random() * 8 + 4, height: Math.random() * 8 + 4, left: `${Math.random() * 100}%`,
          animation: `float-up ${15 + Math.random() * 10}s linear ${Math.random() * 5}s infinite` }} />
    ))}
    <style>{`@keyframes float-up { 0% { transform: translateY(100vh); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateY(-100vh); opacity: 0; } }`}</style>
  </div>
);

const VillainBanner = ({ villains = ['chaos', 'complexity', 'bugs'], showNames = false }) => (
  <div className="flex justify-center gap-3 my-4 flex-wrap">
    {villains.map(v => {
      const villain = VILLAINS[v];
      if (!villain) return null;
      return (
        <div key={v} className={`bg-gradient-to-br ${villain.color} p-3 rounded-xl text-white text-center transform hover:scale-110 transition-all shadow-lg`}>
          <div className="flex justify-center mb-1">
            <PixelCharacter type={v} size={40} />
          </div>
          <div className="text-xs font-bold">{showNames ? villain.fullName : villain.name}</div>
        </div>
      );
    })}
  </div>
);

// Slop Attack Animation - appears when user clicks "Generate for me"
const SlopAttack = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-pulse">
      <div className="text-center animate-bounce">
        <div className="transform scale-150 mb-4">
          <PixelCharacter type="slop" size={120} />
        </div>
        <h2 className="text-4xl font-black text-gray-400 mb-2">SLOP ATTACKS!</h2>
        <p className="text-xl text-gray-500 mb-4">"Why think when AI can do it for you?"</p>
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 max-w-md mx-auto">
          <p className="text-red-400 font-bold">⚠️ Remember: YOU are the creative force!</p>
          <p className="text-gray-400 text-sm mt-2">AI is your tool, not your replacement. The best results come from human creativity + AI execution.</p>
        </div>
      </div>
    </div>
  );
};

const AnimatedByte = ({ mood = 'thinking', message, size = 'md' }) => {
  const sizes = { sm: 48, md: 64, lg: 80 };
  const colors = {
    thinking: 'from-blue-500 to-cyan-500', coding: 'from-purple-500 to-pink-500',
    dancing: 'from-yellow-500 to-orange-500', teaching: 'from-emerald-500 to-teal-500',
    excited: 'from-amber-500 to-red-500', proud: 'from-green-500 to-emerald-500'
  };
  
  return (
    <div className="flex gap-4 items-start">
      <div className={`rounded-2xl bg-gradient-to-br ${colors[mood] || 'from-slate-500 to-slate-600'} p-2 flex items-center justify-center flex-shrink-0 shadow-lg ${mood === 'dancing' ? 'animate-bounce' : ''}`}>
        <PixelCharacter type="byte" size={sizes[size]} animate={mood === 'thinking' || mood === 'coding' || mood === 'dancing'} />
      </div>
      {message && (
        <div className="flex-1 bg-slate-800 rounded-2xl rounded-tl-none p-4 border border-slate-700">
          <div className="text-slate-100 leading-relaxed">{message}</div>
          <div className="text-cyan-400 text-xs mt-2 font-bold">— BYTE</div>
        </div>
      )}
    </div>
  );
};

// Enhanced comparison card showing user input vs BYTE enhancement - with Keep Original option
const EnhancementCard = ({ userInput, byteEnhancement, explanation, onAccept, onEdit, onKeepOriginal }) => (
  <div className="bg-slate-800/90 rounded-2xl border border-cyan-500/30 overflow-hidden">
    <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 px-4 py-2 border-b border-slate-700">
      <h4 className="text-cyan-400 font-bold text-sm flex items-center gap-2">
        <span>✨</span> BYTE Enhanced Your Answer
      </h4>
    </div>
    
    <div className="p-4 space-y-4">
      {/* What user said */}
      <div className="bg-slate-900/50 rounded-xl p-3">
        <div className="text-xs text-slate-500 font-bold mb-1">📝 WHAT YOU SAID:</div>
        <p className="text-slate-400 text-sm italic">"{userInput}"</p>
      </div>
      
      {/* BYTE's enhancement */}
      <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
        <div className="text-xs text-emerald-400 font-bold mb-1">🚀 BYTE'S ENHANCEMENT:</div>
        <p className="text-emerald-300 text-sm">"{byteEnhancement}"</p>
      </div>
      
      {/* Why it's better */}
      <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
        <div className="text-xs text-amber-400 font-bold mb-1">💡 WHY THIS IS BETTER:</div>
        <p className="text-amber-200 text-sm">{explanation}</p>
      </div>
    </div>
    
    <div className="flex gap-2 p-4 pt-0">
      <button onClick={onAccept} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-medium text-sm transition-colors">
        ✓ Use Enhanced
      </button>
      <button onClick={onKeepOriginal} className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg font-medium text-sm transition-colors">
        📝 Keep Original
      </button>
      <button onClick={onEdit} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
        ✏️ Edit
      </button>
    </div>
  </div>
);

// AI Generation Warning Button
const AIGenerateButton = ({ onGenerate, aiUsageCount, isProcessing }) => (
  <div className="relative group">
    <button 
      onClick={onGenerate}
      disabled={isProcessing}
      className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 border border-gray-500"
    >
      <PixelCharacter type="slop" size={20} animate={false} />
      <span>Generate for me</span>
    </button>
    
    {/* Warning tooltip */}
    <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900/95 border border-gray-600 rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      <div className="flex items-center gap-2 mb-2">
        <PixelCharacter type="slop" size={24} />
        <div className="text-gray-400 font-bold text-xs">⚠️ SLOP WARNING</div>
      </div>
      <p className="text-gray-300 text-xs mb-2">
        Using AI to generate answers summons <strong className="text-gray-200">Señor Slop</strong> and costs you <strong className="text-red-400">{AI_GENERATION_COST} points</strong>!
      </p>
      <p className="text-gray-400 text-xs">
        You've summoned Señor Slop <strong>{aiUsageCount}</strong> time{aiUsageCount !== 1 ? 's' : ''} so far.
      </p>
      <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-gray-600"></div>
    </div>
  </div>
);

const TipButton = ({ stage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tip = STAGE_TIPS[stage];
  if (!tip) return null;
  
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
        <span>💡</span><span>Need a tip?</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-amber-500/30 rounded-xl p-4 shadow-xl z-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-amber-400 font-bold">{tip.title}</h4>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">&times;</button>
          </div>
          <p className="text-slate-300 text-sm mb-3">{tip.content}</p>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-emerald-400 text-xs font-bold mb-1">✨ EXAMPLE</div>
            <p className="text-slate-400 text-sm italic">{tip.example}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// New: Design Spec Document that builds dynamically
const DesignSpecView = ({ spec, currentStep, isBuilding }) => {
  const sections = [
    { key: 'problem', icon: '🎯', color: 'red', label: 'PROBLEM STATEMENT', step: 0 },
    { key: 'users', icon: '👥', color: 'blue', label: 'TARGET USERS', step: 1 },
    { key: 'features', icon: 'âš¡', color: 'emerald', label: 'CORE FEATURES', step: 2 },
    { key: 'twist', icon: '✨', color: 'purple', label: 'UNIQUE TWIST', step: 3 },
    { key: 'style', icon: '🎨', color: 'amber', label: 'VISUAL STYLE', step: 4 },
  ];
  
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-900 via-[#0d1117] to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-t-xl p-4 border border-cyan-500/30 border-b-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="text-cyan-400 font-bold text-lg">APP DESIGN SPECIFICATION</h3>
              <p className="text-slate-400 text-xs">This document guides the AI to build your app</p>
            </div>
          </div>
        </div>
        
        {/* Document Body */}
        <div className="bg-slate-800/50 border border-cyan-500/30 border-t-0 rounded-b-xl p-4 space-y-4">
          {sections.map(({ key, icon, color, label, step }) => {
            const isCompleted = spec[key];
            const isCurrent = currentStep === step;
            const isPending = currentStep < step;
            
            return (
              <div 
                key={key} 
                className={`rounded-xl p-4 transition-all duration-500 ${
                  isCompleted 
                    ? `bg-${color}-500/10 border border-${color}-500/30` 
                    : isCurrent 
                      ? 'bg-cyan-500/10 border border-cyan-500/30 animate-pulse'
                      : 'bg-slate-900/30 border border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    isCompleted ? `bg-${color}-500/20` : 'bg-slate-700/50'
                  }`}>{icon}</span>
                  <h4 className={`font-bold text-sm ${isCompleted ? 'text-white' : 'text-slate-500'}`}>{label}</h4>
                  {isCompleted && <span className="text-emerald-400 text-xs">✓</span>}
                  {isCurrent && <span className="text-cyan-400 text-xs animate-pulse">← Current</span>}
                </div>
                
                {isCompleted ? (
                  <p className="text-slate-300 text-sm pl-10 leading-relaxed">{spec[key]}</p>
                ) : isCurrent ? (
                  <p className="text-cyan-400/60 text-sm pl-10 italic">Waiting for your input...</p>
                ) : (
                  <p className="text-slate-600 text-sm pl-10 italic">Pending...</p>
                )}
              </div>
            );
          })}
          
          {/* Build status */}
          {currentStep >= 5 && (
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{isBuilding ? '⚙️' : '✅'}</span>
                  <span className={`font-bold ${isBuilding ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isBuilding ? 'Building your app...' : 'Specification Complete!'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Learning Note */}
        <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
          <h5 className="text-purple-400 font-bold text-sm mb-2">🎓 LEARNING NOTE</h5>
          <p className="text-slate-300 text-xs leading-relaxed">
            This is how real developers write design specs! A clear specification helps AI (and humans) 
            understand exactly what to build. The more specific you are, the better the result.
          </p>
        </div>
      </div>
    </div>
  );
};

// New: AI Dashboard showing prompt details
const AIDashboard = ({ prompt, modelInfo, isGenerating, startTime, tokenEstimate }) => {
  const [elapsed, setElapsed] = useState(0);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  
  useEffect(() => {
    if (isGenerating && startTime) {
      const interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isGenerating, startTime]);
  
  // Estimate costs (rough estimates based on typical pricing)
  const inputTokens = tokenEstimate?.input || Math.ceil(prompt.length / 4);
  const outputTokens = tokenEstimate?.output || 8000;
  const estimatedCost = ((inputTokens * 0.003) + (outputTokens * 0.015)) / 1000;
  
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-4 py-3 border-b border-slate-700">
        <h4 className="text-purple-400 font-bold text-sm flex items-center gap-2">
          <span>🤖</span> AI GENERATION DASHBOARD
        </h4>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Model Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-slate-500 text-xs mb-1">MODEL</div>
            <div className="text-cyan-400 font-mono text-sm truncate">{modelInfo?.chatModel || 'Loading...'}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-slate-500 text-xs mb-1">PROVIDER</div>
            <div className="text-emerald-400 font-bold text-sm">{modelInfo?.provider || 'Loading...'}</div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-slate-500 text-xs mb-1">INPUT TOKENS</div>
            <div className="text-amber-400 font-mono text-lg">~{inputTokens.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-slate-500 text-xs mb-1">TIME</div>
            <div className="text-blue-400 font-mono text-lg">{elapsed}s</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-slate-500 text-xs mb-1">EST. COST</div>
            <div className="text-green-400 font-mono text-lg">${estimatedCost.toFixed(4)}</div>
          </div>
        </div>
        
        {/* Prompt Preview */}
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 text-xs">PROMPT BEING SENT ({prompt.length} chars)</div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFullPrompt(!showFullPrompt)}
                className="text-xs text-amber-400 hover:text-amber-300"
              >
                {showFullPrompt ? '▼ Collapse' : '▶ Show full prompt'}
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(prompt)}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                📋 Copy
              </button>
            </div>
          </div>
          <pre className={`text-slate-400 text-xs font-mono whitespace-pre-wrap overflow-y-auto ${showFullPrompt ? 'max-h-96' : 'max-h-40'}`}>
            {showFullPrompt ? prompt : prompt.substring(0, 500) + (prompt.length > 500 ? '...' : '')}
          </pre>
        </div>
      </div>
    </div>
  );
};

// Enhanced Error Display
const ErrorDisplay = ({ error, onRetry, code }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Try to identify common errors
  const getErrorHelp = () => {
    const errorStr = error.toLowerCase();
    if (errorStr.includes('api key') || errorStr.includes('unauthorized') || errorStr.includes('401')) {
      return {
        title: 'API Key Issue',
        help: 'Your API key may be invalid or expired. Go to Settings and re-enter your API key.',
        action: 'Check API Key'
      };
    }
    if (errorStr.includes('rate limit') || errorStr.includes('429')) {
      return {
        title: 'Rate Limited',
        help: 'Too many requests. Wait a minute and try again, or switch to a different AI provider.',
        action: 'Wait & Retry'
      };
    }
    if (errorStr.includes('timeout') || errorStr.includes('network')) {
      return {
        title: 'Network Error',
        help: 'Connection issue. Check your internet and try again.',
        action: 'Retry'
      };
    }
    if (errorStr.includes('context') || errorStr.includes('token')) {
      return {
        title: 'Context Too Long',
        help: 'The prompt is too long. Try simplifying your requirements.',
        action: 'Simplify & Retry'
      };
    }
    return {
      title: 'Generation Failed',
      help: 'Something went wrong. Try again or switch AI providers in settings.',
      action: 'Retry'
    };
  };
  
  const errorHelp = getErrorHelp();
  
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="text-3xl">⚠️</div>
        <div className="flex-1">
          <h4 className="text-red-400 font-bold mb-1">{errorHelp.title}</h4>
          <p className="text-slate-300 text-sm mb-3">{errorHelp.help}</p>
          
          <div className="flex gap-2 mb-3">
            <button 
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              🔄 {errorHelp.action}
            </button>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>
          
          {showDetails && (
            <div className="bg-slate-900 rounded-lg p-3 mt-2">
              <div className="text-slate-500 text-xs mb-1">ERROR MESSAGE:</div>
              <pre className="text-red-400 text-xs font-mono whitespace-pre-wrap">{error}</pre>
              {code && (
                <>
                  <div className="text-slate-500 text-xs mb-1 mt-3">PARTIAL CODE RECEIVED:</div>
                  <pre className="text-slate-400 text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {code.substring(0, 500)}...
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GenerationLoader = ({ progress, currentTip, onTipChange, aiDashboard }) => {
  const [dots, setDots] = useState('');
  
  useEffect(() => { const i = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500); return () => clearInterval(i); }, []);
  useEffect(() => { const i = setInterval(onTipChange, 8000); return () => clearInterval(i); }, []);
  
  const phase = progress < 20 ? { text: 'Analyzing requirements', icon: '📋' } :
                progress < 40 ? { text: 'Designing structure', icon: '🏗️' } :
                progress < 60 ? { text: 'Writing code', icon: '⌨️' } :
                progress < 80 ? { text: 'Adding interactions', icon: '✨' } :
                progress < 95 ? { text: 'Polishing details', icon: '💎' } :
                { text: 'Almost ready!', icon: '🎉' };
  
  return (
    <div className="space-y-4">
      {/* AI Dashboard */}
      {aiDashboard}
      
      {/* Progress */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex justify-center mb-4">
          <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-2">
            <PixelCharacter type="byte" size={64} animate={true} />
          </div>
        </div>
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">{phase.icon}</div>
          <h3 className="text-lg font-bold text-white">{phase.text}{dots}</h3>
          <p className="text-slate-400 text-sm mt-1">~{Math.max(5, Math.ceil((100 - progress) / 3))}s remaining</p>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-400 mb-2"><span>Progress</span><span>{Math.round(progress)}%</span></div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 relative" style={{ width: `${progress}%` }}>
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tip */}
      {currentTip && (
        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2"><span className="text-amber-400">💡</span><h4 className="text-amber-400 font-bold text-sm">VIBE CODING TIP</h4></div>
          <h5 className="text-white font-medium mb-1">{currentTip.title}</h5>
          <p className="text-slate-300 text-sm">{currentTip.content}</p>
        </div>
      )}
    </div>
  );
};

const AppPreview = ({ code, title, isGenerating, error, onRetry }) => {
  const [initPhase, setInitPhase] = useState(0);
  const [loadError, setLoadError] = useState(null);
  
  useEffect(() => {
    if (isGenerating && !code) {
      const interval = setInterval(() => {
        setInitPhase(p => (p + 1) % 8);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isGenerating, code]);
  
  useEffect(() => {
    setLoadError(null);
  }, [code]);
  
  const initMessages = [
    { icon: 'âš¡', text: 'Initializing build environment...' },
    { icon: '📦', text: 'Loading dependencies...' },
    { icon: '🔧', text: 'Configuring Tailwind CSS...' },
    { icon: '🎨', text: 'Preparing design system...' },
    { icon: '⚙️', text: 'Setting up JavaScript engine...' },
    { icon: '🔌', text: 'Connecting components...' },
    { icon: '✨', text: 'Applying your style specs...' },
    { icon: '🚀', text: 'Generating your app...' },
  ];
  
  // Handle iframe errors
  const handleIframeError = () => {
    setLoadError('Failed to render the preview. The generated code may have syntax errors.');
  };
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 rounded-xl p-4">
        <ErrorDisplay error={error} onRetry={onRetry} code={code} />
      </div>
    );
  }
  
  if (isGenerating && !code) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#0d1117] to-slate-900 rounded-xl overflow-hidden">
        <div className="text-center p-8">
          <div className="bg-black/50 rounded-lg border border-emerald-500/30 p-6 max-w-md mx-auto mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-slate-500 text-xs font-mono">byte-compiler v2.0</span>
            </div>
            
            <div className="text-left font-mono text-sm space-y-2">
              {initMessages.slice(0, initPhase + 1).map((msg, i) => (
                <div key={i} className={`flex items-center gap-2 ${i === initPhase ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{i < initPhase ? '✓' : msg.icon}</span>
                  <span className={i === initPhase ? 'animate-pulse' : ''}>{msg.text}</span>
                </div>
              ))}
              <div className="text-emerald-400 animate-pulse flex items-center gap-1">
                <span>{'>'}</span>
                <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!code) return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl">
      <div className="text-center text-slate-500"><div className="text-6xl mb-4 opacity-50">{'</>'}</div><p>Preview will appear here after building</p></div>
    </div>
  );
  
  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 rounded-xl p-4">
        <ErrorDisplay error={loadError} onRetry={onRetry} code={code} />
      </div>
    );
  }
  
  return (
    <iframe 
      srcDoc={code} 
      title={title || 'App Preview'} 
      className="w-full h-full bg-white rounded-xl" 
      sandbox="allow-scripts allow-forms allow-modals"
      onError={handleIframeError}
    />
  );
};

const ReactionBar = ({ reactions, onReact, disabled }) => (
  <div className="flex gap-2 flex-wrap justify-center">
    {REACTIONS.map(r => (
      <button key={r.name} onClick={() => onReact(r.name)} disabled={disabled}
        className={`flex items-center gap-1 px-3 py-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors ${disabled ? 'opacity-50' : ''}`}>
        <span className="text-xl">{r.emoji}</span>
        <span className="text-white text-sm">{reactions?.[r.name] || 0}</span>
      </button>
    ))}
  </div>
);

const AppCard = ({ app, onReact, onVote, hasVoted, isOwnApp }) => {
  const totalReactions = Object.values(app.reactions || {}).reduce((a, b) => a + b, 0);
  
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
      <div className="h-48 bg-white"><iframe srcDoc={app.code} title={app.appIdea} className="w-full h-full pointer-events-none" style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }} /></div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-bold truncate">{app.appIdea}</h3>
            <p className="text-cyan-400 text-sm">{app.twist}</p>
            <p className="text-slate-500 text-sm">by {app.playerName}</p>
          </div>
          <div className="text-amber-400 font-bold">{totalReactions} 💬</div>
        </div>
        <ReactionBar reactions={app.reactions} onReact={(r) => onReact(app.playerId, r)} disabled={isOwnApp} />
        {!isOwnApp && !hasVoted && (
          <button onClick={() => onVote(app.playerId)} className="w-full mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-2 rounded-lg font-bold text-sm">
            🏆 Vote Best Vibe Coder
          </button>
        )}
      </div>
    </div>
  );
};

const AwardCard = ({ award, winner, extraInfo }) => (
  <div className={`rounded-2xl p-6 border text-center ${
    award.icon === '🤖' 
      ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30' 
      : 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
  }`}>
    <div className="text-6xl mb-3">{award.icon}</div>
    <h3 className={`text-2xl font-black ${award.icon === '🤖' ? 'text-red-400' : 'text-cyan-400'}`}>{award.name}</h3>
    <p className="text-slate-400 text-sm mb-4">{award.description}</p>
    <div className={`rounded-xl p-4 ${award.icon === '🤖' ? 'bg-red-500' : 'bg-cyan-500'}`}>
      <p className="text-white text-2xl font-black">{winner}</p>
    </div>
    {extraInfo && (
      <p className="text-slate-400 text-xs mt-3 italic">{extraInfo}</p>
    )}
  </div>
);

const AICollaborationReminder = () => (
  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
    <div className="flex items-center gap-3">
      <span className="text-3xl">🤝</span>
      <div>
        <h4 className="text-purple-400 font-bold text-sm">REMEMBER: Human + AI = Best Results!</h4>
        <p className="text-slate-300 text-xs">The magic happens when humans guide the vision and AI helps execute. Use AI as a partner, not a replacement!</p>
      </div>
    </div>
  </div>
);

const playDingSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
};

// ============================================
// MAIN COMPONENT
// ============================================

const VibeCodeChallenge = ({ gameCode, room, userId, isHost, onBack, onOpenDashboard, isTournament, onGameComplete }) => {
  const STEPS = [
    { id: 'problem', name: 'Problem', icon: '🎯' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'features', name: 'Features', icon: 'âš¡' },
    { id: 'twist', name: 'Twist', icon: '✨' },
    { id: 'style', name: 'Style', icon: '🎨' },
    { id: 'review', name: 'Review', icon: '📋' },
    { id: 'build', name: 'Build', icon: '🔧' },
    { id: 'iterate', name: 'Iterate', icon: '🔄' },
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Live collaboration: send step progress to other players
  useEffect(() => {
    if (gameCode && userId && room?.phase === 'build') {
      const stepName = STEPS[currentStep]?.name || '';
      const progress = Math.round((currentStep / STEPS.length) * 100);
      updatePlayerStatus(gameCode, userId, { currentStep: stepName, progress, typing: false }).catch(() => {});
    }
  }, [currentStep, gameCode, userId, room?.phase]);
  const [spec, setSpec] = useState({ problem: '', users: '', features: '', twist: '', style: '' });
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeStream, setCodeStream] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [activeView, setActiveView] = useState('spec'); // 'spec', 'code', 'preview'
  const [currentVibeTip, setCurrentVibeTip] = useState(VIBE_TIPS[0]);
  const [iterationCount, setIterationCount] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [appReactions, setAppReactions] = useState({});
  const [myVote, setMyVote] = useState(null);
  
  // AI usage tracking
  const [aiUsageCount, setAiUsageCount] = useState(0);
  const [pendingEnhancement, setPendingEnhancement] = useState(null);
  const [showSlopAttack, setShowSlopAttack] = useState(false);
  
  // AI Dashboard state
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [genStartTime, setGenStartTime] = useState(null);
  const [genError, setGenError] = useState(null);

  // Prompt Timeline & Deploy Guide
  const [showTimeline, setShowTimeline] = useState(false);
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const { addEntry } = usePromptTimeline();
  
  const chatRef = useRef(null);
  
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);
  
  // Initial BYTE message with personality, villain intro, and example
  useEffect(() => {
    if (room?.phase === 'build' && messages.length === 0) {
      addByteMessage(
        <div className="space-y-4">
          <p className="text-lg">
            Hey there, future app builder! 👋 I'm <strong className="text-cyan-400">BYTE</strong> — your AI mentor and guide through the wonderful world of <span className="text-purple-400 font-bold">Vibe Coding</span>!
          </p>
          
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-300 mb-2">
              Together, we're going to defeat these troublemakers who try to stop every app from being built:
            </p>
            <VillainBanner villains={['chaos', 'complexity', 'confusion', 'bugs', 'scope', 'slop']} showNames={true} />
            <p className="text-slate-400 text-sm mt-2 italic">
              Each villain represents a real challenge in software development. Watch out for <strong className="text-gray-300">Señor Slop</strong> — he appears when you let AI do all the thinking for you!
            </p>
          </div>
          
          <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
            <h4 className="text-emerald-400 font-bold mb-2">💡 What's a "Civic App"?</h4>
            <p className="text-slate-300 text-sm mb-2">
              Civic apps solve real problems in your community! Here's an example:
            </p>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="text-cyan-400 font-medium">"A neighborhood tool-sharing app"</p>
              <p className="text-slate-400 text-xs mt-1">
                Help neighbors borrow lawn mowers, drills, and ladders instead of everyone buying their own. 
                Saves money AND builds community!
              </p>
            </div>
          </div>
          
          <p className="text-cyan-400 font-medium">
            🎯 Now it's YOUR turn! What problem do you want your app to solve?
          </p>
          
          <AICollaborationReminder />
        </div>,
        'teaching'
      );
    }
  }, [room?.phase]);
  
  const addByteMessage = (content, mood = 'thinking') => setMessages(prev => [...prev, { type: 'byte', content, mood }]);
  const addUserMessage = (content) => setMessages(prev => [...prev, { type: 'user', content }]);
  const rotateVibeTip = () => setCurrentVibeTip(VIBE_TIPS[(VIBE_TIPS.indexOf(currentVibeTip) + 1) % VIBE_TIPS.length]);
  
  const getEnhancementExplanation = (type) => {
    const explanations = {
      problem: "This version is more specific about WHO experiences the problem, WHAT pain points they have, and WHY existing solutions fall short. Specific problems lead to focused solutions!",
      users: "This version paints a clearer picture of your users - their context, technical comfort, and how they'll use the app. Understanding users deeply creates better experiences!",
      features: "This version connects features to user needs with concrete UI details. Instead of vague functions, you now have actionable interface elements!",
      style: "This version gives specific visual direction with colors, references, and mood. Concrete style guidance helps AI create exactly what you envision!"
    };
    return explanations[type] || "This version is more specific and actionable, which helps AI understand exactly what you want!";
  };
  
  const enhanceInput = async (type, userInput) => {
    try {
      const prompts = {
        problem: `Enhance this problem statement to be specific and actionable: "${userInput}". Include WHO has the problem, WHAT pain they experience, and WHY current solutions fail. 2-3 sentences max. Return ONLY the enhanced text.`,
        users: `Enhance this user description: "${userInput}". Include context (when/where they'll use it), device preference, and technical comfort level. 2-3 sentences. Return ONLY the enhanced text.`,
        features: `Enhance these features: "${userInput}". Add specific UI elements and interactions for each. Keep it concise but actionable. Return ONLY the enhanced text.`,
        style: `Enhance this style description: "${userInput}". Include specific colors, typography style, spacing approach, and reference a real app if helpful. 2-3 sentences. Return ONLY the enhanced text.`
      };
      const response = await chatCompletion([
        { role: 'system', content: 'You are a UX expert. Enhance the input to be more specific and actionable. Return ONLY the enhanced text, nothing else.' },
        { role: 'user', content: prompts[type] }
      ], { maxTokens: 800 });
      return response.trim();
    } catch (e) { return userInput; }
  };
  
  // Generate answer for user (costs points) - now shows in chat AND triggers Slop
  const generateForUser = async (type) => {
    if (!hasApiKey()) {
      addByteMessage(<p className="text-red-400">⚠️ You need to configure an AI API key first!</p>, 'thinking');
      return;
    }
    
    // Show Slop attack!
    setShowSlopAttack(true);
    playWhoosh();
    
    setIsProcessing(true);
    setAiUsageCount(prev => prev + 1);
    
    const prompts = {
      problem: "Generate a creative civic app problem statement. Think of something unique that would help people in their community or daily lives. Be specific about who has the problem and why current solutions don't work. Return ONLY the problem statement, 2-3 sentences.",
      users: `Given this problem: "${spec.problem}", describe the ideal target users. Include their context, when they'd use the app, and their technical comfort. Return ONLY the user description, 2-3 sentences.`,
      features: `Given this problem: "${spec.problem}" for these users: "${spec.users}", list 3-4 key features with specific UI elements. Return ONLY the features, keep it concise.`,
      twist: `Given this app solving "${spec.problem}" with features "${spec.features}", suggest a unique twist that would make it memorable and delightful. Return ONLY the twist idea, 1-2 sentences.`,
      style: `Given this app: "${spec.problem}" with twist "${spec.twist}", describe a cohesive visual style. Include colors, typography, and reference a real app aesthetic. Return ONLY the style description, 2-3 sentences.`
    };
    
    try {
      const response = await chatCompletion([
        { role: 'system', content: 'You are a creative app designer. Generate helpful, specific responses. Return ONLY what is asked, no explanations.' },
        { role: 'user', content: prompts[type] }
      ], { maxTokens: 800 });
      
      const generated = response.trim();
      
      // Show the generated content in chat AND put in input
      setInput(generated);
      
      addByteMessage(
        <div>
          <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <PixelCharacter type="slop" size={24} />
              <span className="text-gray-400 font-bold text-sm">SLOP GENERATED THIS (-{AI_GENERATION_COST} points)</span>
            </div>
            <p className="text-slate-300 bg-slate-800 rounded-lg p-3 text-sm">"{generated}"</p>
            <p className="text-gray-500 text-xs mt-2">You've summoned Señor Slop {aiUsageCount + 1} time{aiUsageCount !== 0 ? 's' : ''} now.</p>
          </div>
          <p className="text-slate-300">I've put this in your input box. You can:</p>
          <ul className="text-slate-400 text-sm mt-2 ml-4 list-disc">
            <li>Edit it to add your own creativity</li>
            <li>Send it as-is (but remember YOU should be the creative force!)</li>
            <li>Delete it and write your own</li>
          </ul>
        </div>,
        'thinking'
      );
    } catch (e) {
      addByteMessage(<p className="text-red-400">Failed to generate: {e.message}</p>, 'thinking');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSend = async (override) => {
    const text = (override || input).trim();
    if (!text || isProcessing) return;
    addUserMessage(text);
    setInput('');
    setIsProcessing(true);
    setPendingEnhancement(null);
    
    try {
      const step = STEPS[currentStep].id;
      
      if (step === 'problem') {
        const enhanced = await enhanceInput('problem', text);
        if (enhanced !== text && enhanced.length > text.length * 1.2) {
          setPendingEnhancement({ type: 'problem', original: text, enhanced, explanation: getEnhancementExplanation('problem') });
          addByteMessage(
            <EnhancementCard 
              userInput={text} 
              byteEnhancement={enhanced} 
              explanation={getEnhancementExplanation('problem')} 
              onAccept={() => acceptEnhancement('problem', enhanced)} 
              onKeepOriginal={() => acceptEnhancement('problem', text)}
              onEdit={() => { setInput(enhanced); setPendingEnhancement(null); }} 
            />, 
            'teaching'
          );
        } else {
          setSpec(prev => ({ ...prev, problem: text }));
          setCurrentStep(1);
          addByteMessage(<div><p>Got it! 👥 <strong className="text-cyan-400">Lord Chaos</strong> defeated! Now, who will use this app?</p></div>, 'excited');
        }
      } else if (step === 'users') {
        const enhanced = await enhanceInput('users', text);
        if (enhanced !== text && enhanced.length > text.length * 1.2) {
          setPendingEnhancement({ type: 'users', original: text, enhanced, explanation: getEnhancementExplanation('users') });
          addByteMessage(
            <EnhancementCard 
              userInput={text} 
              byteEnhancement={enhanced} 
              explanation={getEnhancementExplanation('users')} 
              onAccept={() => acceptEnhancement('users', enhanced)} 
              onKeepOriginal={() => acceptEnhancement('users', text)}
              onEdit={() => { setInput(enhanced); setPendingEnhancement(null); }} 
            />, 
            'teaching'
          );
        } else {
          setSpec(prev => ({ ...prev, users: text }));
          setCurrentStep(2);
          addByteMessage(<div><p>Perfect! <strong className="text-purple-400">Baron Complexity</strong> retreats! âš¡ What features should it have?</p></div>, 'thinking');
        }
      } else if (step === 'features') {
        const enhanced = await enhanceInput('features', text);
        if (enhanced !== text && enhanced.length > text.length * 1.2) {
          setPendingEnhancement({ type: 'features', original: text, enhanced, explanation: getEnhancementExplanation('features') });
          addByteMessage(
            <EnhancementCard 
              userInput={text} 
              byteEnhancement={enhanced} 
              explanation={getEnhancementExplanation('features')} 
              onAccept={() => acceptEnhancement('features', enhanced)} 
              onKeepOriginal={() => acceptEnhancement('features', text)}
              onEdit={() => { setInput(enhanced); setPendingEnhancement(null); }} 
            />, 
            'teaching'
          );
        } else {
          setSpec(prev => ({ ...prev, features: text }));
          setCurrentStep(3);
          addByteMessage(<div><p>Nice! <strong className="text-blue-400">Professor Confusion</strong> is confused! ✨ What's your <strong>unique twist</strong>?</p></div>, 'excited');
        }
      } else if (step === 'twist') {
        setSpec(prev => ({ ...prev, twist: text }));
        setCurrentStep(4);
        addByteMessage(<div><p>Love it! <span className="text-amber-400">{text}</span></p><p className="mt-2"><strong className="text-amber-400">The Scope Creep</strong> can't add more features now! 🎨 Describe the visual style.</p></div>, 'proud');
      } else if (step === 'style') {
        const enhanced = await enhanceInput('style', text);
        if (enhanced !== text && enhanced.length > text.length * 1.2) {
          setPendingEnhancement({ type: 'style', original: text, enhanced, explanation: getEnhancementExplanation('style') });
          addByteMessage(
            <EnhancementCard 
              userInput={text} 
              byteEnhancement={enhanced} 
              explanation={getEnhancementExplanation('style')} 
              onAccept={() => acceptEnhancement('style', enhanced)} 
              onKeepOriginal={() => acceptEnhancement('style', text)}
              onEdit={() => { setInput(enhanced); setPendingEnhancement(null); }} 
            />, 
            'teaching'
          );
        } else {
          setSpec(prev => ({ ...prev, style: text }));
          setCurrentStep(5);
          addByteMessage(
            <div>
              <p className="text-xl mb-3">🎉 ALL VILLAINS DEFEATED!</p>
              <p className="mb-2">Your Design Specification is complete! Check the <span className="text-cyan-400 font-bold">Design Spec</span> tab to review it.</p>
              <p className="text-emerald-400">When you're ready, click <strong>BUILD THIS APP</strong> below!</p>
            </div>,
            'proud'
          );
        }
      } else if (step === 'iterate') {
        await handleIteration(text);
      }
    } catch (e) { addByteMessage(<p>Something went wrong: {e.message}</p>, 'thinking'); }
    finally { setIsProcessing(false); }
  };
  
  const acceptEnhancement = (type, value) => {
    setSpec(prev => ({ ...prev, [type]: value }));
    setPendingEnhancement(null);
    
    const nextSteps = { problem: 1, users: 2, features: 3, style: 5 };
    const villainDefeated = {
      problem: '<strong className="text-red-400">Lord Chaos</strong>',
      users: '<strong className="text-purple-400">Baron Complexity</strong>',
      features: '<strong className="text-blue-400">Professor Confusion</strong>',
      style: '<strong className="text-green-400">Captain Bugs</strong>'
    };
    const nextMessages = {
      problem: <p>Great choice! {villainDefeated.problem} defeated! 👥 Who will use this app?</p>,
      users: <p>Perfect! {villainDefeated.users} retreats! âš¡ What features should it have?</p>,
      features: <p>Nice features! {villainDefeated.features} is confused! ✨ What's your <strong>unique twist</strong>?</p>,
      style: <div><p className="text-xl mb-3">🎉 ALL VILLAINS DEFEATED!</p><p>Your Design Spec is ready! Click <strong>BUILD THIS APP</strong> when ready!</p></div>
    };
    
    setCurrentStep(nextSteps[type]);
    addByteMessage(<div>{nextMessages[type]}</div>, type === 'style' ? 'proud' : 'excited');
  };
  
  const buildFinalPrompt = () => {
    const prompt = `CREATE AN EXTRAORDINARY, VISUALLY STRIKING WEB APPLICATION

You are a creative technologist who makes apps that feel like art installations. Build something that makes people say "whoa, that's weird and cool!"

=== USER'S VISION ===

PROBLEM: ${spec.problem}
USERS: ${spec.users}
FEATURES: ${spec.features}
UNIQUE TWIST: ${spec.twist}
VISUAL STYLE: ${spec.style}

=== CREATIVE DIRECTION ===

Make this app VISUALLY MEMORABLE and a bit WEIRD:
- Unexpected animations (things that wiggle, pulse, float, or glitch)
- Bold color choices (neons, gradients, duotones, or striking monochrome)
- Playful interactions (hover effects that surprise, click animations that delight)
- Creative layouts (asymmetric, overlapping elements, unusual grids)
- Personality in the details (easter eggs, quirky loading states, fun empty states)

Think: What would happen if a street artist designed this app? What if it was in a museum?

=== MUST WORK PERFECTLY ===

FUNCTIONALITY (every feature must actually work):
1. All buttons DO something when clicked
2. All inputs SAVE data to localStorage  
3. Lists support ADD, EDIT, DELETE operations
4. Data PERSISTS between page refreshes
5. Include sample/demo data so it's not empty on first load
6. Forms validate and show helpful error messages
7. Include at least one dynamic element (counter, timer, animation)

TECHNICAL REQUIREMENTS:
- Single HTML file with embedded CSS and JavaScript
- Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- Vanilla ES6+ JavaScript (no frameworks needed)
- Mobile responsive
- All interactive elements have hover/active states

=== VISUAL TRICKS TO USE ===

Pick 2-3 of these to make it stand out:
- CSS animations (@keyframes for floating, pulsing, or morphing)
- Gradient backgrounds or text
- Glassmorphism (backdrop-blur, translucent panels)
- Drop shadows that feel dramatic
- Custom cursors or selection colors
- Animated SVG icons or decorative elements
- Unexpected color for interactive states
- Parallax or scroll-triggered effects
- Micro-interactions (button squish, input glow, toggle bounce)
- Creative typography (mix sizes dramatically, use letter-spacing)
- ASCII art or emoji as design elements
- Noise/grain textures via CSS
- Border-radius experiments (blob shapes, pill buttons)

=== PERSONALITY ===

Add character:
- A witty empty state message
- Fun loading text or animation
- Celebratory feedback on success (confetti, emoji burst, screen shake)
- A hidden easter egg (konami code, click counter, secret mode)
- Playful error messages

=== CODE REQUIREMENTS ===

Include these JavaScript patterns:
- localStorage.setItem() and localStorage.getItem() for persistence
- Event listeners on ALL interactive elements
- At least 3 distinct user interactions that modify the UI
- Visual feedback for every action
- A reset/clear option

CRITICAL: Return ONLY the complete HTML file. No markdown, no explanation. Start with <!DOCTYPE html>.
Make it WORK. Make it WEIRD. Make it WONDERFUL.`;

    return prompt;
  };
  
  const generateApp = async () => {
    setCurrentStep(6);
    setIsGenerating(true);
    setGenProgress(0);
    setActiveView('code'); // Switch to code view
    setCodeStream('');
    setGenError(null);
    
    const prompt = buildFinalPrompt();
    setCurrentPrompt(prompt);
    setGenStartTime(Date.now());
    
    const progressInterval = setInterval(() => {
      setGenProgress(p => {
        if (p >= 95) return p;
        const inc = p < 30 ? 3 : p < 60 ? 2 : p < 80 ? 1.5 : 0.5;
        return Math.min(p + inc + Math.random() * 2, 95);
      });
    }, 500);
    
    try {
      addByteMessage(
        <div>
          <p className="mb-2">🚀 Sending your design to the AI...</p>
          <p className="text-slate-400 text-sm">Check the <span className="text-cyan-400">Code</span> tab to see the AI dashboard and progress!</p>
        </div>,
        'coding'
      );
      
      console.log('[VibeCode] Sending prompt to AI, length:', prompt.length);
      
      const response = await chatCompletion([
        { role: 'system', content: 'You are a creative frontend developer who makes apps that feel like interactive art. You write complete, functional single-file HTML apps with embedded CSS and JavaScript. Your apps are visually striking, a bit weird and wonderful, but always fully functional. Return ONLY raw HTML starting with <!DOCTYPE html>. Every button, input, and interactive element MUST work. Include animations, bold colors, and surprising interactions.' },
        { role: 'user', content: prompt }
      ], { maxTokens: 32000, temperature: 0.9 });
      
      console.log('[VibeCode] Response received, type:', typeof response, 'length:', response?.length);
      console.log('[VibeCode] First 200 chars:', response?.substring(0, 200));
      
      if (!response || response.trim().length < 100) {
        console.error('[VibeCode] Response too short:', response);
        throw new Error(`AI returned empty or too short response (${response?.length || 0} chars). Please try again.`);
      }
      
      let code = response.trim().replace(/```html\n?/g, '').replace(/```\n?/g, '');
      
      // Find the start of the HTML
      const docIndex = code.indexOf('<!DOCTYPE');
      const htmlIndex = code.indexOf('<html');
      const startIndex = docIndex >= 0 ? docIndex : (htmlIndex >= 0 ? htmlIndex : -1);
      
      if (startIndex === -1) {
        throw new Error('AI response did not contain valid HTML. The response may have been cut off or malformed.');
      }
      
      if (startIndex > 0) code = code.substring(startIndex);
      
      // Find the end
      const endIndex = code.lastIndexOf('</html>');
      if (endIndex > 0) {
        code = code.substring(0, endIndex + 7);
      } else {
        // Try to add closing tags if missing
        if (!code.includes('</html>')) {
          code += '\n</body>\n</html>';
        }
      }
      
      // Validate we have something usable
      if (!code.includes('<script') && !code.includes('<body')) {
        throw new Error('Generated code appears incomplete. Missing script or body tags.');
      }
      
      clearInterval(progressInterval);
      setGenProgress(100);
      
      // Stream the code
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i += 3) {
        setCodeStream(lines.slice(0, i + 3).join('\n'));
        await new Promise(r => setTimeout(r, 15));
      }
      
      setGeneratedCode(code);
      setActiveView('preview'); // Switch to preview
      setIsGenerating(false);
      setCurrentStep(7);
      playDingSound();
      
      addByteMessage(
        <div>
          <p className="text-xl mb-3">🎉 Your app is ready!</p>
          <VillainBanner villains={['chaos', 'complexity', 'confusion', 'bugs', 'scope', 'slop']} />
          <p className="mt-4">All villains defeated! Your app is now in the <span className="text-cyan-400 font-bold">Preview</span> tab.</p>
          <p className="text-slate-400 mt-2">Want to make changes? Just describe what you want and I'll update it!</p>
        </div>,
        'proud'
      );
    } catch (e) {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenError(e.message);
      
      addByteMessage(
        <ErrorDisplay 
          error={e.message} 
          onRetry={generateApp}
          code={codeStream}
        />,
        'thinking'
      );
    }
  };
  
  const handleIteration = async (request) => {
    setIterationCount(prev => prev + 1);
    setIsGenerating(true);
    setGenProgress(0);
    setActiveView('code');
    setGenError(null);
    
    const progressInterval = setInterval(() => setGenProgress(p => Math.min(p + 4 + Math.random() * 3, 95)), 300);
    addByteMessage(<p>Making those changes...</p>, 'coding');
    
    try {
      const response = await chatCompletion([
        { role: 'system', content: 'Modify the HTML app as requested. Keep the visual style weird and wonderful. Ensure ALL functionality still works after changes. Return ONLY complete modified HTML starting with <!DOCTYPE html>.' },
        { role: 'user', content: `CURRENT CODE:\n${generatedCode}\n\nREQUESTED CHANGES: ${request}\n\nReturn the complete updated HTML with all changes applied. Make sure all existing functionality still works.` }
      ], { maxTokens: 32000, temperature: 0.8 });
      
      if (!response || response.trim().length < 100) {
        throw new Error('AI returned empty or too short response.');
      }
      
      let code = response.trim().replace(/```html\n?/g, '').replace(/```\n?/g, '');
      
      const docIndex = code.indexOf('<!DOCTYPE');
      const htmlIndex = code.indexOf('<html');
      const startIndex = docIndex >= 0 ? docIndex : (htmlIndex >= 0 ? htmlIndex : 0);
      if (startIndex > 0) code = code.substring(startIndex);
      
      clearInterval(progressInterval);
      setGenProgress(100);
      
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i += 5) {
        setCodeStream(lines.slice(0, i + 5).join('\n'));
        await new Promise(r => setTimeout(r, 8));
      }
      
      setGeneratedCode(code);
      setActiveView('preview');
      setIsGenerating(false);
      playDingSound();
      addByteMessage(<div><p className="mb-2">✨ Changes applied!</p><p className="text-slate-400">Keep iterating or submit!</p></div>, 'proud');
    } catch (e) {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenError(e.message);
      addByteMessage(<ErrorDisplay error={e.message} onRetry={() => handleIteration(request)} />, 'thinking');
    }
  };
  
  const handleSubmit = () => {
    submitToGame(gameCode, {
      type: 'app-complete',
      playerId: userId,
      playerName: Object.values(room?.players || {}).find(p => p.id === userId)?.name,
      appIdea: spec.problem,
      code: generatedCode,
      iterations: iterationCount,
      twist: spec.twist,
      aiUsage: aiUsageCount,
      reactions: {},
      timestamp: Date.now()
    });
    setHasSubmitted(true);
    addByteMessage(<div><p className="text-2xl mb-3">🎊 SUBMITTED!</p><p>You've built a real app using vibe coding! {aiUsageCount > 0 && <span className="text-amber-400">You summoned Señor Slop {aiUsageCount} time{aiUsageCount !== 1 ? 's' : ''} (-{aiUsageCount * AI_GENERATION_COST} points).</span>}</p></div>, 'proud');
  };
  
  const handleReaction = (appOwnerId, reactionType) => {
    const key = `${appOwnerId}-${reactionType}`;
    if (appReactions[key]) return;
    setAppReactions(prev => ({ ...prev, [key]: true }));
    submitToGame(gameCode, { type: 'app-reaction', targetPlayerId: appOwnerId, fromPlayerId: userId, reaction: reactionType, timestamp: Date.now() });
  };
  
  const handleVote = (playerId) => {
    if (myVote) return;
    setMyVote(playerId);
    submitVote(gameCode, userId, playerId);
  };
  
  const getApps = () => {
    const submissions = Object.values(room?.submissions || {});
    const apps = submissions.filter(s => s.type === 'app-complete');
    const reactions = submissions.filter(s => s.type === 'app-reaction');
    
    return apps.map(app => {
      const appReactions = {};
      reactions.filter(r => r.targetPlayerId === app.playerId).forEach(r => {
        appReactions[r.reaction] = (appReactions[r.reaction] || 0) + 1;
      });
      return { ...app, reactions: appReactions };
    });
  };
  
  const calculateAwards = () => {
    const apps = getApps();
    const players = Object.values(room?.players || {});
    
    let mostTalked = null, mostReactions = 0;
    apps.forEach(app => {
      const total = Object.values(app.reactions || {}).reduce((a, b) => a + b, 0);
      if (total > mostReactions) { mostReactions = total; mostTalked = app.playerName; }
    });
    
    let bestCoder = null, mostVotes = 0;
    players.forEach(p => { if ((p.votes || 0) > mostVotes) { mostVotes = p.votes; bestCoder = p.name; } });
    
    let mostAIUser = null, mostAIUsage = 0;
    apps.forEach(app => {
      if ((app.aiUsage || 0) > mostAIUsage) { mostAIUsage = app.aiUsage; mostAIUser = app.playerName; }
    });
    
    return { mostTalkedAbout: mostTalked, bestVibeCoder: bestCoder, mostLikelyReplaced: mostAIUser, mostAIUsage };
  };
  
  const openDashboardNewTab = () => window.open(`${window.location.origin}/dashboard?code=${gameCode}`, '_blank');

  const downloadApp = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.problem?.substring(0, 30).replace(/[^a-z0-9]/gi, '-') || 'my-app'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Get model info for dashboard
  const modelInfo = getModelInfo();
  
  // ============================================
  // RENDERS
  // ============================================
  
  const renderLobby = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <FloatingParticles count={20} />
      <div className="max-w-3xl w-full text-center relative z-10">
        <div className="flex justify-center mb-4">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-3">
            <PixelCharacter type="byte" size={80} />
          </div>
        </div>
        <h1 className="text-4xl font-black text-white mt-6 mb-2">VIBE CODE</h1>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">CHALLENGE</h2>
        
        {/* Rules Section */}
        <div className="bg-slate-800/80 rounded-2xl p-6 mb-6 border border-slate-700 text-left">
          <h3 className="text-xl font-bold text-white mb-4 text-center">📜 HOW TO PLAY</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
              <h4 className="text-emerald-400 font-bold mb-2">🎯 GAME OBJECTIVE</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Defeat 5 villains by completing design steps</li>
                <li>• Build a working app with AI assistance</li>
                <li>• Get votes from other players</li>
                <li>• <span className="text-amber-400">Avoid using "Generate for me"</span> (costs points!)</li>
              </ul>
            </div>
            
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
              <h4 className="text-purple-400 font-bold mb-2">🎓 LEARNING OBJECTIVES</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Master AI prompt engineering</li>
                <li>• Learn the app development pipeline</li>
                <li>• Practice "vibe coding" techniques</li>
                <li>• Understand human + AI collaboration</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-cyan-400 font-bold mb-2 text-center">⚔️ THE VILLAINS YOU'LL DEFEAT</h4>
            <VillainBanner villains={['chaos', 'complexity', 'confusion', 'bugs', 'scope', 'slop']} showNames={true} />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
          <div className="font-mono text-4xl font-black text-cyan-400 tracking-widest mb-2">{gameCode}</div>
          <p className="text-slate-500 text-sm">Share this code to invite others</p>
        </div>
        
        <div className="mb-6">
          <p className="text-slate-500 mb-3">Players: {Object.keys(room?.players || {}).length}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.values(room?.players || {}).map(p => (
              <span key={p.id} className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <PixelCharacter type="user" size={16} animate={false} />
                {p.name}
              </span>
            ))}
          </div>
        </div>
        
        {isHost && (
          <div className="flex gap-4 justify-center">
            <Button onClick={() => updateGamePhase(gameCode, 'build')} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-3 font-bold rounded-xl text-lg">
              🚀 Start Building
            </Button>
            <Button onClick={onOpenDashboard} className="bg-slate-700 text-white px-6 py-3 rounded-xl">📊 Dashboard</Button>
          </div>
        )}
        
        {!isHost && (
          <p className="text-slate-400">Waiting for host to start the game...</p>
        )}
      </div>
    </div>
  );
  
  const renderBuild = () => (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Slop Attack Overlay */}
      <SlopAttack show={showSlopAttack} onComplete={() => setShowSlopAttack(false)} />
      {/* Live collaboration */}
      <CollaborationBar room={room} currentUserId={userId} />
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <PixelCharacter type="byte" size={24} animate={false} />
            <span className="text-cyan-400 font-bold">VIBE CODE</span>
          </div>
          <div className="flex items-center gap-1">
            {STEPS.map((step, i) => (
              <div key={step.id} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${i < currentStep ? 'bg-emerald-500 text-white' : i === currentStep ? 'bg-cyan-500 text-white animate-pulse' : 'bg-slate-700 text-slate-500'}`}>{step.icon}</div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-700 px-3 py-1 rounded-lg">
            <PixelCharacter type="slop" size={16} animate={false} />
            <span className="text-slate-400 text-sm">Slop: <span className={aiUsageCount > 0 ? 'text-red-400' : 'text-emerald-400'}>{aiUsageCount}x</span></span>
          </div>
          <span className="text-slate-500 text-sm">Iterations: {iterationCount}</span>
          <button onClick={openDashboardNewTab} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm">📊 Dashboard ↗</button>
          {isHost && <button onClick={() => updateGamePhase(gameCode, 'vote')} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm">End Session</button>}
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-1/2 flex flex-col border-r border-slate-700">
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => msg.type === 'byte' ? (
              <AnimatedByte key={i} mood={msg.mood} message={msg.content} />
            ) : (
              <div key={i} className="flex gap-4 items-start justify-end">
                <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                  <div className="text-white">{msg.content}</div>
                </div>
                <div className="rounded-2xl bg-slate-700 flex items-center justify-center p-2 flex-shrink-0">
                  <PixelCharacter type="user" size={32} animate={false} />
                </div>
              </div>
            ))}
            {isProcessing && !isGenerating && <AnimatedByte mood="thinking" message={<span className="text-slate-400">Thinking...</span>} />}
            
            {/* Build Button */}
            {currentStep === 5 && spec.style && !isGenerating && !pendingEnhancement && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-cyan-500/30 p-6">
                <div className="text-center">
                  <p className="text-white mb-4">Your Design Specification is complete! Ready to build?</p>
                  <button 
                    onClick={generateApp} 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-4 px-8 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>🚀</span><span>BUILD THIS APP</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          {!hasSubmitted && currentStep !== 5 && currentStep !== 6 && !isGenerating && !pendingEnhancement && (
            <div className="p-4 border-t border-slate-700 bg-slate-800">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <TipButton stage={STEPS[currentStep]?.id} />
                  {currentStep < 5 && hasApiKey() && (
                    <AIGenerateButton onGenerate={() => generateForUser(STEPS[currentStep]?.id)} aiUsageCount={aiUsageCount} isProcessing={isProcessing} />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {generatedCode && currentStep >= 7 && (
                    <>
                      <button onClick={downloadApp} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-bold text-sm">📥 Download</button>
                      <button onClick={handleSubmit} disabled={hasSubmitted} className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-50">✅ Submit App</button>
                    </>
                  )}
                </div>
              </div>
              {/* Glowing step label */}
              {STEP_PROMPTS[STEPS[currentStep]?.id]?.label && (
                <div className="mb-2 px-1">
                  <span className="text-cyan-400 font-bold text-sm animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                    {STEP_PROMPTS[STEPS[currentStep]?.id].label}
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={STEP_PROMPTS[STEPS[currentStep]?.id]?.placeholder || "Type your response..."}
                  disabled={isProcessing}
                  className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-xl outline-none border-2 border-cyan-500/40 focus:border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)] focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50 disabled:border-slate-700 disabled:shadow-none"
                />
                <button onClick={() => handleSend()} disabled={isProcessing || !input.trim()} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50">Send</button>
              </div>
            </div>
          )}
          {hasSubmitted && (
            <div className="p-4 border-t border-slate-700 bg-emerald-500/10 text-center space-y-3">
              <p className="text-emerald-400 font-bold">✅ App Submitted!</p>
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <div className="animate-pulse w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-sm">Waiting for host to start Gallery...</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                {generatedCode && (
                  <>
                    <button
                      onClick={downloadApp}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-xl font-bold text-sm"
                    >
                      📥 Download Your App
                    </button>
                    <button
                      onClick={() => setShowDeployGuide(true)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-6 py-2 rounded-xl font-bold text-sm"
                    >
                      🚀 Deploy to Web
                    </button>
                  </>
                )}
                {isHost && (
                  <button
                    onClick={() => window.open(`/dashboard/${gameCode}`, '_blank')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl font-bold text-sm"
                  >
                    📊 Open Dashboard
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col bg-slate-800">
          {/* Tabs */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveView('spec')} 
                className={`px-3 py-1 rounded text-xs font-medium ${activeView === 'spec' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'}`}
              >
                📋 Design Spec
              </button>
              <button 
                onClick={() => setActiveView('code')} 
                className={`px-3 py-1 rounded text-xs font-medium ${activeView === 'code' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400'}`}
              >
                💻 Code
              </button>
              <button 
                onClick={() => setActiveView('preview')} 
                className={`px-3 py-1 rounded text-xs font-medium ${activeView === 'preview' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                disabled={!generatedCode}
              >
                👁️ Preview
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeView === 'spec' && (
              <DesignSpecView spec={spec} currentStep={currentStep} isBuilding={isGenerating} />
            )}
            
            {activeView === 'code' && (
              <div className="h-full overflow-auto p-4">
                {isGenerating ? (
                  <GenerationLoader 
                    progress={genProgress} 
                    currentTip={currentVibeTip} 
                    onTipChange={rotateVibeTip}
                    aiDashboard={
                      <AIDashboard 
                        prompt={currentPrompt}
                        modelInfo={modelInfo}
                        isGenerating={isGenerating}
                        startTime={genStartTime}
                        tokenEstimate={{ input: Math.ceil(currentPrompt.length / 4), output: 24000 }}
                      />
                    }
                  />
                ) : (
                  <div className="bg-[#0d1117] rounded-xl overflow-auto h-full font-mono text-xs p-4">
                    <pre className="text-emerald-400 whitespace-pre-wrap">{generatedCode || codeStream || '// Code will appear here after building...'}</pre>
                  </div>
                )}
              </div>
            )}
            
            {activeView === 'preview' && (
              <div className="h-full p-4">
                <AppPreview 
                  code={generatedCode} 
                  title={spec.problem} 
                  isGenerating={isGenerating} 
                  error={genError}
                  onRetry={generateApp}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderVote = () => {
    const apps = getApps();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
        <FloatingParticles count={30} />
        <div className="max-w-6xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-2">APP SHOWCASE</h1>
            <p className="text-purple-400">React to apps, vote for the best vibe coder!</p>
          </div>
          
          <AnimatedByte mood="excited" message={<div><p className="mb-2">Check out all these amazing apps!</p><p className="text-amber-400">React with emojis and vote for ONE app (not yours) that you think is best!</p></div>} />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {apps.map((app, i) => <AppCard key={i} app={app} onReact={handleReaction} onVote={handleVote} hasVoted={!!myVote} isOwnApp={app.playerId === userId} />)}
          </div>
          
          {myVote && <div className="mt-8 text-center"><p className="text-emerald-400 text-lg">✓ You voted!</p></div>}
          
          {isHost && <div className="text-center mt-8"><Button onClick={() => { updateGamePhase(gameCode, 'results'); if (onGameComplete) onGameComplete(); }} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-12 py-4 font-bold rounded-xl text-lg">🏆 Show Results & Awards</Button></div>}
        </div>
      </div>
    );
  };
  
  const renderResults = () => {
    const awards = calculateAwards();
    const players = Object.values(room?.players || {}).sort((a, b) => (b.votes || 0) - (a.votes || 0));

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-y-auto" ref={(el) => { if (el) playCelebration(); }}>
        <FloatingParticles count={40} />
        <div className="max-w-4xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8"><div className="text-8xl mb-4">🏆</div><h1 className="text-4xl font-black text-white mb-2">AWARDS</h1></div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <AwardCard award={AWARDS.mostTalkedAbout} winner={awards.mostTalkedAbout || 'TBD'} />
            <AwardCard award={AWARDS.bestVibeCoder} winner={awards.bestVibeCoder || 'TBD'} />
            <AwardCard 
              award={AWARDS.mostLikelyReplaced} 
              winner={awards.mostLikelyReplaced || 'No one!'} 
              extraInfo={awards.mostAIUsage > 0 ? `Summoned Slop ${awards.mostAIUsage}x. Remember: The best results come from humans and AI working together!` : 'Everyone wrote their own ideas! Great job being creative humans!'}
            />
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">🗳️ Vote Results</h3>
            <div className="space-y-3">
              {players.slice(0, 5).map((p, i) => (
                <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-slate-700 text-white'}`}>
                  <div className="flex items-center gap-3"><span className="text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`}</span><span className="font-bold">{p.name}</span></div>
                  <span className="font-black text-xl">{p.votes || 0}</span>
                </div>
              ))}
            </div>
          </div>
          
          <AICollaborationReminder />
          
          <AnimatedByte mood="proud" message={<div><p className="mb-2">Amazing work everyone!</p><p className="text-cyan-400">You've all learned to defeat the villains by vibe coding! The key is humans guiding the vision while AI helps execute.</p></div>} />

          {/* Bonus Round Buttons */}
          {isHost && (
            <div className="bg-slate-800 rounded-2xl p-6 border border-purple-500/30 mb-8">
              <h3 className="text-lg font-bold text-purple-400 mb-4 text-center">Bonus Rounds</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button onClick={() => { window.location.hash = ''; onBack(); setTimeout(() => { const event = new CustomEvent('startBonusGame', { detail: { game: 'modelComparison', sourceData: { problem: spec.problem } } }); window.dispatchEvent(event); }, 100); }} className="p-4 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-left hover:bg-indigo-500/30 transition-colors">
                  <div className="text-2xl mb-1">⚔️</div>
                  <p className="text-white font-bold text-sm">Model Comparison</p>
                  <p className="text-slate-400 text-xs">Compare AI models on the same prompt</p>
                </button>
                <button onClick={() => { window.location.hash = ''; onBack(); setTimeout(() => { const event = new CustomEvent('startBonusGame', { detail: { game: 'remix', sourceSubmissions: room?.submissions || [], sourceType: 'code' } }); window.dispatchEvent(event); }, 100); }} className="p-4 bg-purple-500/20 border border-purple-500/40 rounded-xl text-left hover:bg-purple-500/30 transition-colors">
                  <div className="text-2xl mb-1">🔀</div>
                  <p className="text-white font-bold text-sm">Remix Mode</p>
                  <p className="text-slate-400 text-xs">Fork and remix each other's apps</p>
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-8 flex gap-4 justify-center flex-wrap">
            {generatedCode && (
              <Button onClick={() => setShowDeployGuide(true)} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 font-bold rounded-xl">
                🚀 Deploy to Web
              </Button>
            )}
            <Button onClick={onBack} className="bg-cyan-600 text-white px-8 py-3 font-bold rounded-xl">Back to Home</Button>
          </div>
          <div className="mt-8">
            <ShareableResultCard playerName={room?.players?.find(p => p.id === userId)?.name} gameName="Vibe Code Challenge" score={room?.players?.find(p => p.id === userId)?.score || 0} award={players[0]?.id === userId ? 'Best Vibe Coder' : null} />
          </div>
        </div>
      </div>
    );
  };
  
  const renderPhase = () => {
    switch (room?.phase) {
      case 'lobby': return renderLobby();
      case 'build': return renderBuild();
      case 'vote': return renderVote();
      case 'results': return renderResults();
      default: return renderLobby();
    }
  };
  
  return (
    <div className="relative">
      {renderPhase()}
      <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">← Exit</button>
      {isHost && onOpenDashboard && (
        <button onClick={onOpenDashboard} className="fixed top-4 left-28 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium border border-purple-500/50 shadow-lg flex items-center gap-1.5">
          📊 Dashboard
        </button>
      )}
      <PromptTimelineButton onClick={() => setShowTimeline(true)} />
      <PromptTimelineSidebar isOpen={showTimeline} onClose={() => setShowTimeline(false)} />
      <DeployGuide isOpen={showDeployGuide} onClose={() => setShowDeployGuide(false)} appCode={generatedCode} appName={spec.problem} />
    </div>
  );
};

// Wrap with PromptTimelineProvider
const VibeCodeChallengeWithTimeline = (props) => (
  <PromptTimelineProvider game="vibeCode">
    <VibeCodeChallenge {...props} />
  </PromptTimelineProvider>
);

export default VibeCodeChallengeWithTimeline;

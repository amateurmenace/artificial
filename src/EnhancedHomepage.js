// Enhanced Homepage Component
// Fun animations and interactive elements for AI literacy games

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './components';

// Animated text that types out
const TypeWriter = ({ text, speed = 50, delay = 0, className = '' }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  
  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);
  
  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayed, text, speed, started]);
  
  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && <span className="animate-pulse">|</span>}
    </span>
  );
};

// Glitch text effect
const GlitchText = ({ children, className = '' }) => {
  const [glitch, setGlitch] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span className={`relative inline-block ${className}`}>
      <span className={glitch ? 'opacity-0' : ''}>{children}</span>
      {glitch && (
        <>
          <span className="absolute inset-0 text-red-500 animate-pulse" style={{ transform: 'translate(-2px, -1px)' }}>
            {children}
          </span>
          <span className="absolute inset-0 text-cyan-400 animate-pulse" style={{ transform: 'translate(2px, 1px)' }}>
            {children}
          </span>
        </>
      )}
    </span>
  );
};

// Floating particles background
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: ['🔍', '🤖', '🎮', '💻', '🚀', '✨', '🧠', '📱'][i % 8],
    size: 16 + Math.random() * 24,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-20 animate-float"
          style={{
            fontSize: p.size,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

// Real image pairs for SpotTheFakeMini
const MINI_GAME_IMAGE_PAIRS = [
  {
    real: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    ai: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    aiPosition: 'B',
    hint: 'Look at the hair edges and background'
  },
  {
    real: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    ai: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    aiPosition: 'A',
    hint: 'Check the symmetry and skin texture'
  },
  {
    real: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    ai: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
    aiPosition: 'B',
    hint: 'Examine the ear details'
  },
  {
    real: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    ai: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    aiPosition: 'A',
    hint: 'Check the jewelry and hair strands'
  },
  {
    real: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    ai: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    aiPosition: 'B',
    hint: 'Look at the eye reflections'
  },
];

// Interactive AI image detector mini-game
const SpotTheFakeMini = () => {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [imageSet, setImageSet] = useState(null);
  const [usedIndices, setUsedIndices] = useState([]);
  
  const getRandomUnusedPair = (excludeIndices = []) => {
    const availableIndices = MINI_GAME_IMAGE_PAIRS
      .map((_, i) => i)
      .filter(i => !excludeIndices.includes(i));
    
    if (availableIndices.length === 0) {
      const randomIndex = Math.floor(Math.random() * MINI_GAME_IMAGE_PAIRS.length);
      return { pair: MINI_GAME_IMAGE_PAIRS[randomIndex], index: randomIndex, resetUsed: true };
    }
    
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    return { pair: MINI_GAME_IMAGE_PAIRS[randomIndex], index: randomIndex, resetUsed: false };
  };
  
  useEffect(() => {
    const { pair, index } = getRandomUnusedPair();
    setImageSet(pair);
    setUsedIndices([index]);
  }, []);
  
  const handleSelect = (choice) => {
    setSelected(choice);
    setTimeout(() => setRevealed(true), 500);
  };
  
  const reset = () => {
    setSelected(null);
    setRevealed(false);
    const { pair, index, resetUsed } = getRandomUnusedPair(usedIndices);
    setImageSet(pair);
    if (resetUsed) {
      setUsedIndices([index]);
    } else {
      setUsedIndices(prev => [...prev, index]);
    }
  };
  
  const scrollToGames = () => {
    document.getElementById('games-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (!imageSet) return null;
  
  const imageA = imageSet.aiPosition === 'A' ? imageSet.ai : imageSet.real;
  const imageB = imageSet.aiPosition === 'B' ? imageSet.ai : imageSet.real;
  const correctAnswer = imageSet.aiPosition;
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-white font-bold mb-3 flex items-center gap-2">
        <span className="text-2xl">🔍</span> Quick Challenge
      </h3>
      <p className="text-white/70 text-sm mb-4">Which person is AI-generated?</p>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'A', src: imageA },
          { label: 'B', src: imageB }
        ].map(({ label, src }) => (
          <button
            key={label}
            onClick={() => !revealed && handleSelect(label)}
            disabled={revealed}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all
              ${selected === label ? 'border-white scale-105' : 'border-transparent hover:border-white/50'}
              ${revealed && label === correctAnswer ? 'ring-2 ring-green-400' : ''}
              ${revealed && selected === label && label !== correctAnswer ? 'ring-2 ring-red-400' : ''}`}
          >
            <img 
              src={src} 
              alt={`Person ${label}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop`;
              }}
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {label}
            </div>
            {revealed && (
              <div className={`absolute inset-0 flex flex-col items-center justify-center ${label === correctAnswer ? 'bg-green-500/85' : 'bg-black/60'}`}>
                <span className="text-3xl md:text-4xl mb-1">{label === correctAnswer ? '🤖' : '👤'}</span>
                <span className="text-white text-xs md:text-sm font-bold">{label === correctAnswer ? 'AI!' : 'Real'}</span>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {revealed ? (
        <div className="space-y-3">
          <p className={`text-sm ${selected === correctAnswer ? 'text-green-300' : 'text-red-300'}`}>
            {selected === correctAnswer 
              ? `✓ Correct! Person ${correctAnswer} was AI-generated.` 
              : `✗ Nope! Person ${correctAnswer} was the AI fake.`}
          </p>
          <p className="text-white/50 text-xs">💡 Tip: {imageSet.hint}</p>
          <div className="flex items-center gap-3 pt-1">
            <button 
              type="button"
              onClick={reset} 
              className="text-xs text-white/70 hover:text-white underline cursor-pointer"
            >
              Try another
            </button>
            <span className="text-white/30">•</span>
            <button 
              type="button"
              onClick={scrollToGames} 
              className="text-xs text-[#48a89a] hover:text-[#5bc4b4] underline cursor-pointer"
            >
              Scroll for full games ↓
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white/50 text-xs">Click an image to guess</p>
      )}
    </div>
  );
};

// Interactive code preview
const CodePreviewAnimation = ({ onClick }) => {
  const [step, setStep] = useState(0);
  const codeSteps = [
    '> describe your app idea...',
    '> "I want a community event calendar"',
    '> generating code... ⚡',
    '> ✓ App created! Preview ready.',
  ];
  const numSteps = codeSteps.length;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % numSteps);
    }, 2000);
    return () => clearInterval(interval);
  }, [numSteps]);
  
  return (
    <button 
      onClick={onClick}
      className="bg-gray-900 rounded-xl p-4 text-left w-full hover:ring-2 hover:ring-[#48a89a] transition-all group"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-gray-500 text-xs ml-2">vibe-code.js</span>
      </div>
      <div className="font-mono text-sm">
        <div className="text-green-400">{codeSteps[step]}</div>
        <div className="text-gray-600 mt-1">{"// No coding required!"}</div>
      </div>
      <div className="text-xs text-[#48a89a] mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        Try Vibe Code Challenge →
      </div>
    </button>
  );
};

// NEW: Meme Machine Preview - Styled as a machine "cooking" an AI meme
const MemeMachinePreview = ({ onClick }) => {
  const [cookingPhase, setCookingPhase] = useState(0);
  const [steam, setSteam] = useState([]);
  const [gears, setGears] = useState(0);
  
  const phases = [
    { label: 'LOADING IDEA...', progress: 15 },
    { label: 'MIXING PIXELS...', progress: 35 },
    { label: 'ADDING HUMOR...', progress: 55 },
    { label: 'GENERATING IMAGE...', progress: 75 },
    { label: 'ALMOST READY...', progress: 90 },
    { label: 'COOKING MEME! 🔥', progress: 100 },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCookingPhase(p => (p + 1) % phases.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [phases.length]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGears(g => g + 15);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSteam(prev => {
        const newSteam = [...prev, { id: Date.now(), x: 30 + Math.random() * 40 }];
        return newSteam.slice(-8);
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);
  
  const currentPhase = phases[cookingPhase];
  
  return (
    <button 
      onClick={onClick}
      className="relative bg-gradient-to-br from-[#2d3436] via-[#636e72] to-[#2d3436] rounded-xl p-4 text-left w-full hover:scale-105 transition-all overflow-hidden group border-4 border-[#d4a84b]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      
      {steam.map(s => (
        <div
          key={s.id}
          className="absolute text-2xl animate-float-up opacity-60"
          style={{ left: `${s.x}%`, bottom: '60%' }}
        >
          💨
        </div>
      ))}
      
      <div 
        className="absolute top-2 right-2 text-3xl opacity-30"
        style={{ transform: `rotate(${gears}deg)` }}
      >
        ⚙️
      </div>
      <div 
        className="absolute top-8 right-8 text-2xl opacity-20"
        style={{ transform: `rotate(${-gears * 1.5}deg)` }}
      >
        ⚙️
      </div>
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🤖</span>
          <span className="text-[#d4a84b] font-bold text-sm uppercase tracking-wider">Meme Machine</span>
          <span className="ml-auto flex gap-1">
            <span className={`w-2 h-2 rounded-full ${cookingPhase > 0 ? 'bg-green-400' : 'bg-gray-600'} transition-all`} />
            <span className={`w-2 h-2 rounded-full ${cookingPhase > 2 ? 'bg-green-400' : 'bg-gray-600'} transition-all`} />
            <span className={`w-2 h-2 rounded-full ${cookingPhase > 4 ? 'bg-green-400' : 'bg-gray-600'} transition-all`} />
          </span>
        </div>
        
        <div className="bg-black/50 rounded-lg p-3 mb-3 border border-[#d4a84b]/50">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded aspect-video flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scan" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative">
                <div 
                  className="text-5xl filter"
                  style={{ 
                    filter: cookingPhase < 3 ? 'blur(4px)' : cookingPhase < 5 ? 'blur(2px)' : 'blur(0px)',
                    opacity: 0.3 + (cookingPhase * 0.12)
                  }}
                >
                  🌍
                </div>
                {cookingPhase < 5 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#d4a84b] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              <div 
                className="text-white text-xs mt-2 font-bold text-center px-2"
                style={{ 
                  opacity: cookingPhase > 2 ? 0.7 : 0,
                  filter: cookingPhase < 5 ? 'blur(1px)' : 'none'
                }}
              >
                {cookingPhase > 4 ? "SAVE THE PLANET" : "SAV█ THE PL██ET"}
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
              <div 
                className="h-full bg-gradient-to-r from-[#d4a84b] to-[#48a89a] transition-all duration-500"
                style={{ width: `${currentPhase.progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-[#d4a84b] text-xs font-mono animate-pulse">
              {currentPhase.label}
            </span>
            <span className="text-gray-400 text-xs">
              {currentPhase.progress}%
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 bg-[#d4a84b]/20 rounded px-2 py-1 text-center">
            <span className="text-[#d4a84b] text-xs font-bold">🎨 STYLE</span>
          </div>
          <div className="flex-1 bg-[#48a89a]/20 rounded px-2 py-1 text-center">
            <span className="text-[#48a89a] text-xs font-bold">💬 CAPTION</span>
          </div>
          <div className="flex-1 bg-purple-500/20 rounded px-2 py-1 text-center">
            <span className="text-purple-400 text-xs font-bold">🚀 SHARE</span>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white font-bold text-lg">Compete for Best Civic Meme →</span>
      </div>
    </button>
  );
};

// Main Homepage Component
export const EnhancedHomepage = ({ 
  onHost, 
  onJoin, 
  onSelectGame
}) => {
  
  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3d5a4c] via-[#4a6b5a] to-[#48a89a] text-white overflow-hidden">
        <FloatingParticles />
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="animate-pulse">🎮</span>
                <span className="text-sm">Free AI Literacy Games</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <GlitchText>ARTIFICIAL</GlitchText>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-8">
                <TypeWriter 
                  text="Learn AI through play. Detect fakes. Create responsibly. Build the future."
                  speed={30}
                  delay={500}
                />
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onHost}
                  variant="custom"
                  size="lg"
                  className="bg-white hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
                  style={{ color: '#3d5a4c' }}
                >
                  <span className="mr-2">🎮</span> Host a Game
                </Button>
                <Button 
                  onClick={onJoin}
                  variant="custom"
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:scale-105 transition-all"
                >
                  <span className="mr-2">🔗</span> Join with Code
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block">
              <SpotTheFakeMini />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f5f3ef"/>
          </svg>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 px-4 bg-[#f5f3ef]" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d5a4c] text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: '👥', title: 'Gather Players', desc: 'Get 2-20 friends, students, or colleagues together' },
              { step: '2', icon: '🎯', title: 'Pick a Game', desc: 'Choose from detection, creation, or coding challenges' },
              { step: '3', icon: '🔗', title: 'Share Code', desc: 'Everyone joins with a simple 6-character code' },
              { step: '4', icon: '🏆', title: 'Learn & Compete', desc: 'Build AI literacy skills while having fun!' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#3d5a4c] to-[#48a89a] rounded-2xl flex items-center justify-center text-4xl transform group-hover:rotate-6 transition-transform">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#d4a84b] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-bold text-[#3d5a4c] mb-2">{item.title}</h3>
                <p className="text-[#6b7c74] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Game Selection Section */}
      <section className="py-16 px-4 bg-white" id="games-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d5a4c] text-center mb-4">
            Choose Your Adventure
          </h2>
          <p className="text-[#6b7c74] text-center mb-12 max-w-2xl mx-auto">
            Three games, three ways to understand AI. Each teaches different skills for navigating our AI-powered world.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Spot the Fake */}
            <div 
              className="group relative bg-gradient-to-br from-[#48a89a] to-[#3d5a4c] rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              onClick={() => onSelectGame('spotTheFake')}
            >
              <div className="absolute top-4 right-4 text-6xl opacity-20 group-hover:opacity-40 transition-opacity">
                🔍
              </div>
              <div className="relative">
                <div className="text-5xl mb-4 group-hover:animate-bounce">🔍</div>
                <h3 className="text-2xl font-bold mb-2">Spot the Fake</h3>
                <p className="text-white/80 mb-4">
                  Learn detection techniques and explore real-world cases.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Real vs AI', 'Ethics', 'Legal'].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>⏱ 30-45 min</span>
                  <span>👥 2-20 players</span>
                </div>
              </div>
            </div>
            
            {/* Meme Machine */}
            <div 
              className="group relative bg-gradient-to-br from-[#d4a84b] to-[#c49a3a] rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              onClick={() => onSelectGame('memeMachine')}
            >
              <div className="absolute top-4 right-4 text-6xl opacity-20 group-hover:opacity-40 transition-opacity">
                🚀
              </div>
              <div className="relative">
                <div className="text-5xl mb-4 group-hover:animate-bounce">🚀</div>
                <h3 className="text-2xl font-bold mb-2">Meme Machine</h3>
                <p className="text-white/80 mb-4">
                  Create viral advocacy memes with AI help. Get critique, iterate, and watch them spread!
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['AI Art', 'Critique', 'Viral Sim'].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>⏱ 45-60 min</span>
                  <span>👥 3-20 players</span>
                </div>
              </div>
            </div>
            
            {/* Vibe Code */}
            <div 
              className="group relative bg-gradient-to-br from-[#6b8cce] to-[#5070b0] rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              onClick={() => onSelectGame('vibeCode')}
            >
              <div className="absolute top-4 right-4 text-6xl opacity-20 group-hover:opacity-40 transition-opacity">
                💻
              </div>
              <div className="relative">
                <div className="text-5xl mb-4 group-hover:animate-bounce">💻</div>
                <h3 className="text-2xl font-bold mb-2">Vibe Code Challenge</h3>
                <p className="text-white/80 mb-4">
                  Build real apps by describing what you want. AI writes the code — you guide the vision!
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['No Code', 'AI Gen', 'Live Preview'].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>⏱ 45-60 min</span>
                  <span>👥 2-15 players</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Preview Cards */}
      <section className="py-16 px-4 bg-[#f5f3ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#3d5a4c] text-center mb-8">
            See What's Possible
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <MemeMachinePreview onClick={() => onSelectGame('memeMachine')} />
            <CodePreviewAnimation onClick={() => onSelectGame('vibeCode')} />
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 px-4 bg-white" id="about">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3d5a4c] text-center mb-8">
            About ARTIFICIAL
          </h2>
          
          <div className="prose prose-lg mx-auto text-[#6b7c74]">
            <p className="text-center mb-8">
              <strong className="text-[#3d5a4c]">ARTIFICIAL</strong> is a collection of free, interactive games designed to build 
              AI literacy in communities, classrooms, and organizations.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#f5f3ef] rounded-xl p-6">
                <h3 className="font-bold text-[#3d5a4c] mb-3">🎯 Our Mission</h3>
                <p className="text-sm">
                  In a world where AI-generated content is increasingly common, everyone needs skills to 
                  navigate this new reality. We believe learning should be fun, social, and hands-on.
                </p>
              </div>
              
              <div className="bg-[#f5f3ef] rounded-xl p-6">
                <h3 className="font-bold text-[#3d5a4c] mb-3">👥 Who It's For</h3>
                <p className="text-sm">
                  Community groups, educators, libraries, civic organizations, and anyone who wants to 
                  understand AI better. No technical background required!
                </p>
              </div>
              
              <div className="bg-[#f5f3ef] rounded-xl p-6">
                <h3 className="font-bold text-[#3d5a4c] mb-3">🛠️ How It's Built</h3>
                <p className="text-sm">
                  Built with React, Firebase for real-time multiplayer, and OpenAI for AI features. 
                  Designed to be accessible, inclusive, and engaging for all skill levels.
                </p>
              </div>
              
              <div className="bg-[#f5f3ef] rounded-xl p-6">
                <h3 className="font-bold text-[#3d5a4c] mb-3">💡 Open & Free</h3>
                <p className="text-sm">
                  ARTIFICIAL is free to use for educational purposes. Host as many games as you want 
                  with your own OpenAI API key for AI-powered features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4 bg-[#f5f3ef]" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3d5a4c] text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: "Do I need coding experience?",
                a: "Nope! All games are designed for beginners. Vibe Code Challenge specifically teaches you to build apps without writing code yourself."
              },
              {
                q: "How many players can join?",
                a: "Games support 2-20 players depending on the game. Perfect for classrooms, workshops, or small group sessions."
              },
              {
                q: "Is it really free?",
                a: "Yes! The platform is free. For AI features (image generation, code generation), you'll need your own OpenAI API key, which has usage costs."
              },
              {
                q: "Can I use this for my class/workshop?",
                a: "Absolutely! ARTIFICIAL is designed for educational settings. Host as many sessions as you want."
              },
              {
                q: "What ages is this appropriate for?",
                a: "We recommend ages 13+ due to some real-world examples discussing misinformation. Content is educational and age-appropriate."
              },
            ].map((faq, i) => (
              <details 
                key={i}
                className="bg-white rounded-xl p-6 cursor-pointer group"
              >
                <summary className="font-semibold text-[#3d5a4c] list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-[#48a89a] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-[#6b7c74]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#3d5a4c] to-[#48a89a] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Play for Real?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Gather your friends, family, or colleagues and start playing!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onHost}
              variant="custom"
              size="lg"
              className="bg-white hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
              style={{ color: '#3d5a4c' }}
            >
              <span className="mr-2">🎮</span> Host a Game Now
            </Button>
            <Button 
              onClick={onJoin}
              variant="custom"
              size="lg"
              className="bg-[#d4a84b] text-white hover:bg-[#c49a3a] hover:scale-105 transition-all shadow-lg border-2 border-[#d4a84b]"
            >
              <span className="mr-2">🔗</span> Join with Code
            </Button>
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default EnhancedHomepage;

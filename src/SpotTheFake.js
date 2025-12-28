// SPOT THE FAKE v2 - Enhanced Game Component
// Bold video-game style UI with werewolf finale and proper image matching
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Timer, PlayerList, Badge, ProgressSteps } from './components';
import { educationalContent, getDiscussionPrompts, getQuizQuestions } from './educational-content';
import { updateGamePhase, updatePlayerScore, submitToGame } from './firebase';

// ============================================
// ANIMATED COMPONENTS
// ============================================

// Scanline effect for retro feel
const Scanlines = () => (
  <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]" 
    style={{ 
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
    }} 
  />
);

// Floating particles
const FloatingParticles = ({ count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-[#48a89a]/20 to-[#d4a84b]/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float-up {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Glitch text effect
const GlitchText = ({ children, className = '' }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={isGlitching ? 'animate-glitch' : ''}>{children}</span>
      {isGlitching && (
        <>
          <span className="absolute top-0 left-0 text-red-500 opacity-70" 
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, 0)' }}>
            {children}
          </span>
          <span className="absolute top-0 left-0 text-blue-500 opacity-70" 
            style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)', transform: 'translate(2px, 0)' }}>
            {children}
          </span>
        </>
      )}
    </span>
  );
};

// Animated progress bar
const AnimatedProgressBar = ({ current, total, label }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full">
      {label && <div className="text-sm text-white/70 mb-2">{label}</div>}
      <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-[#48a89a] via-[#5bc0a8] to-[#d4a84b] transition-all duration-500 relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-shimmer" 
            style={{ 
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 2s infinite'
            }} 
          />
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

// Image comparison slider
const ImageComparisonSlider = ({ beforeImage, afterImage, beforeLabel = "Real", afterLabel = "AI" }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => { if (isDragging.current) handleMove(e.clientX); };
  const handleTouchMove = (e) => { handleMove(e.touches[0].clientX); };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onTouchMove={handleTouchMove}
    >
      {/* Before image (full width) */}
      <img src={beforeImage} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover" />
      
      {/* After image (clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
      >
        <img src={afterImage} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      
      {/* Slider handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
          <span className="text-[#3d5a4c] font-bold">⟷</span>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 bg-red-600/90 text-white px-3 py-1 rounded-full text-sm font-bold">
        {afterLabel}
      </div>
    </div>
  );
};

// Reveal animation card
const RevealCard = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`transform transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// ============================================
// IMAGE DATABASE WITH PROPER MATCHING
// ============================================

// Real-world examples with PROPERLY MATCHING IMAGES
const enhancedExamples = [
  {
    id: "pentagon-explosion",
    title: "The Pentagon 'Explosion' (May 2023)",
    description: "An AI-generated image showing an explosion near the Pentagon went viral on Twitter, briefly causing stock market fluctuations before being debunked.",
    impact: "The S&P 500 briefly dropped 0.3% before recovering, demonstrating how AI fakes can affect financial markets in minutes.",
    detection: "Telltale signs included: an impossible fence structure, inconsistent smoke patterns, buildings that didn't match the actual Pentagon layout, and no corroborating news reports.",
    category: "misinformation",
    // Smoke/explosion image that matches the description
    image: "https://images.unsplash.com/photo-1486551937199-baf066858de7?w=800&h=500&fit=crop",
    imageCaption: "AI can generate convincing but fake emergency scenes",
    tips: [
      "Check for impossible architectural details",
      "Look for corroborating news sources",
      "Examine smoke and fire patterns for consistency",
      "Verify with official sources before sharing"
    ]
  },
  {
    id: "pope-puffer",
    title: "The Pope in a Puffer Jacket (March 2023)",
    description: "A Midjourney-generated image of Pope Francis wearing a stylish white puffer jacket went massively viral, fooling millions of people across social media.",
    impact: "Shared over 20 million times before being identified as AI-generated. One of the first viral AI images to fool mainstream audiences.",
    detection: "Close examination revealed: distorted crucifix, irregular glasses frames, hands that don't quite look anatomically correct, and unusual fabric textures.",
    category: "viral-hoax",
    // Fashion/jacket image that represents the concept
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=500&fit=crop",
    imageCaption: "AI fashion images often have subtle clothing defects",
    tips: [
      "Examine hands and fingers carefully",
      "Check religious symbols for accuracy",
      "Look at fabric folds and textures",
      "Verify with official Vatican sources"
    ]
  },
  {
    id: "political-fakes",
    title: "AI in Political Campaigns (2024)",
    description: "AI-generated images and audio have been used in political campaigns worldwide, from fake endorsements to manipulated speeches and fabricated crowd scenes.",
    impact: "Raised serious concerns about election integrity and led to calls for AI content labeling laws in multiple countries.",
    detection: "Check for lip-sync issues in video, unnatural speech patterns, crowd duplication, and always verify with official campaign sources.",
    category: "political",
    // Political rally/crowd image
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=500&fit=crop",
    imageCaption: "Crowd scenes and political events are commonly manipulated",
    tips: [
      "Look for duplicated faces in crowds",
      "Check lip-sync in video content",
      "Verify quotes with official transcripts",
      "Be skeptical of sensational claims before elections"
    ]
  },
  {
    id: "celebrity-scams",
    title: "Celebrity Investment Scams (Ongoing)",
    description: "Scammers use AI-generated images and videos of celebrities to promote fake investment schemes, cryptocurrency scams, and fraudulent products.",
    impact: "Millions of dollars have been stolen from victims who believed fake celebrity endorsements. Led to renewed calls for AI disclosure laws.",
    detection: "Look for unnatural facial movements, generic backgrounds, and always verify through official celebrity channels - never trust unsolicited investment advice.",
    category: "fraud",
    // Celebrity/social media style image
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop",
    imageCaption: "Social media posts claiming celebrity endorsements are often AI-generated",
    tips: [
      "Never trust unsolicited investment advice",
      "Verify through official celebrity accounts",
      "Look for 'too good to be true' returns",
      "Check if the video was posted by verified accounts"
    ]
  }
];

// Game images - curated sets of real photos (from Unsplash, all real)
const imageDatabase = {
  round1: [
    { 
      id: 'r1-1', 
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', 
      isAI: false, 
      category: 'portrait', 
      hint: 'Look at the skin texture and eye reflections - real photos have natural imperfections',
      explanation: 'This is a real photograph. Notice the natural skin texture, authentic eye reflections, and asymmetrical features typical of real human faces.'
    },
    { 
      id: 'r1-2', 
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', 
      isAI: false, 
      category: 'landscape', 
      hint: 'Check the atmospheric perspective and natural lighting gradients',
      explanation: 'Real landscape with natural atmospheric haze, consistent lighting, and authentic geological formations.'
    },
    { 
      id: 'r1-3', 
      url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop', 
      isAI: false, 
      category: 'animals', 
      hint: 'Examine the fur texture and whisker patterns',
      explanation: 'Real cat photograph. Notice the detailed fur texture, authentic whisker patterns, and natural eye reflections.'
    },
    { 
      id: 'r1-4', 
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop', 
      isAI: false, 
      category: 'technology', 
      hint: 'Check for readable text on screens and consistent reflections',
      explanation: 'Real photograph of a laptop. Text on screen is readable and consistent, reflections are natural.'
    },
    { 
      id: 'r1-5', 
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=400&fit=crop', 
      isAI: false, 
      category: 'portrait', 
      hint: 'Look at the hair edges and ear details',
      explanation: 'Real portrait with natural hair strands, authentic ear details, and realistic skin tones.'
    },
    { 
      id: 'r1-6', 
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop', 
      isAI: false, 
      category: 'nature', 
      hint: 'Check tree branch patterns and leaf distributions',
      explanation: 'Real nature photograph with natural tree formations and authentic lighting.'
    },
  ],
  round2: [
    { 
      id: 'r2-1', 
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop', 
      isEdited: false, 
      category: 'architecture', 
      hint: 'Check perspective lines and window alignments',
      explanation: 'Unedited city photograph with correct architectural perspective and natural urban lighting.'
    },
    { 
      id: 'r2-2', 
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop', 
      isEdited: false, 
      category: 'food', 
      hint: 'Look at reflections and surface textures',
      explanation: 'Real food photography with authentic textures, natural steam, and consistent lighting.'
    },
    { 
      id: 'r2-3', 
      url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=400&fit=crop', 
      isEdited: false, 
      category: 'animals', 
      hint: 'Check eye details and whisker placement',
      explanation: 'Real cat photograph with authentic fur patterns and natural pose.'
    },
    { 
      id: 'r2-4', 
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop', 
      isEdited: false, 
      category: 'ocean', 
      hint: 'Examine wave patterns and water reflections',
      explanation: 'Real ocean photograph with natural wave formations and authentic water colors.'
    },
  ],
  // Werewolf game images - portrait-style for player assignments
  werewolf: [
    { id: 'ww-1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', isAI: false },
    { id: 'ww-2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', isAI: false },
    { id: 'ww-3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', isAI: false },
    { id: 'ww-4', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', isAI: true }, // Marked as "AI" for game purposes
    { id: 'ww-5', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', isAI: false },
    { id: 'ww-6', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', isAI: false },
    { id: 'ww-7', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', isAI: false },
    { id: 'ww-8', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', isAI: false },
  ]
};

// ============================================
// MAIN GAME COMPONENT
// ============================================

const SpotTheFake = ({ gameCode, room, userId, isHost, onBack, onOpenDashboard }) => {
  // Game state
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [localScore, setLocalScore] = useState(0);
  const [currentExample, setCurrentExample] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  
  // Werewolf game state
  const [werewolfAssignment, setWerewolfAssignment] = useState(null);
  const [werewolfVotes, setWerewolfVotes] = useState({});
  const [werewolfRevealed, setWerewolfRevealed] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);
  
  // Animation states
  const [isShaking, setIsShaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const phases = ['lobby', 'intro', 'round1', 'round1-debrief', 'round2', 'round2-debrief', 'ethics', 'legal', 'quiz', 'werewolf', 'werewolf-vote', 'results'];
  const currentPhaseIndex = phases.indexOf(room?.phase);
  
  // Initialize round images
  useEffect(() => {
    if (room?.phase === 'round1') {
      setImages([...imageDatabase.round1].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setStreak(0);
    } else if (room?.phase === 'round2') {
      setImages([...imageDatabase.round2].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (room?.phase === 'werewolf') {
      assignWerewolfImages();
    }
  }, [room?.phase]);
  
  // Werewolf assignment logic
  const assignWerewolfImages = () => {
    const players = Object.values(room?.players || {});
    const availableImages = [...imageDatabase.werewolf].sort(() => Math.random() - 0.5);
    
    const myIndex = players.findIndex(p => p.id === userId);
    if (myIndex === -1) return;
    
    // Ensure only one AI image is assigned
    const realImages = availableImages.filter(img => !img.isAI);
    const aiImages = availableImages.filter(img => img.isAI);
    
    // Random player gets the AI image
    const aiPlayerIndex = Math.floor(Math.random() * players.length);
    
    if (myIndex === aiPlayerIndex) {
      setWerewolfAssignment({
        image: aiImages[0],
        isAI: true,
        instruction: "🤖 You are THE AI FAKER! Your profile picture is AI-generated. Your mission: convince everyone else that it's real!"
      });
    } else {
      const realIndex = myIndex > aiPlayerIndex ? myIndex - 1 : myIndex;
      setWerewolfAssignment({
        image: realImages[realIndex % realImages.length],
        isAI: false,
        instruction: "👤 Your profile picture is REAL! Your mission: figure out who among the players has the AI-generated image."
      });
    }
  };
  
  // Handle answer selection with animations
  const handleAnswer = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const currentImage = images[currentIndex];
    const isCorrect = answer === (currentImage.isAI ? 'ai' : 'real');
    
    if (isCorrect) {
      setLocalScore(s => s + 100 + (streak * 10)); // Streak bonus
      setStreak(s => s + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setStreak(0);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
    
    // Update score in Firebase
    if (isCorrect) {
      updatePlayerScore(gameCode, userId, 100 + (streak * 10));
    }
  };
  
  // Move to next image
  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    }
  };
  
  // Handle werewolf vote
  const handleWerewolfVote = (playerId) => {
    setSelectedVote(playerId);
    setWerewolfVotes(prev => ({ ...prev, [userId]: playerId }));
    submitToGame(gameCode, {
      type: 'werewolf-vote',
      playerId: userId,
      votedFor: playerId,
      timestamp: Date.now()
    });
  };
  
  // ============================================
  // RENDER FUNCTIONS FOR EACH PHASE
  // ============================================
  
  const renderLobby = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex items-center justify-center p-6">
      <FloatingParticles count={30} />
      
      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="text-8xl mb-6 animate-bounce">🔍</div>
        
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
          <GlitchText>SPOT THE FAKE</GlitchText>
        </h1>
        
        <p className="text-xl text-white/70 mb-8">
          Can you tell real from AI? Train your eyes to detect digital deception.
        </p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
          <div className="text-6xl font-mono font-black text-[#48a89a] tracking-widest mb-4">
            {gameCode}
          </div>
          <p className="text-white/60">Share this code with players to join</p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Players Joined:</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.values(room?.players || {}).map((player, i) => (
              <RevealCard key={player.id} delay={i * 100}>
                <div className="bg-gradient-to-br from-[#48a89a] to-[#3d8a7e] text-white px-4 py-2 rounded-full font-medium shadow-lg">
                  {player.name}
                </div>
              </RevealCard>
            ))}
          </div>
        </div>
        
        {isHost && (
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => updateGamePhase(gameCode, 'intro')}
              className="bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] hover:from-[#e8c36a] hover:to-[#d4a84b] text-white px-8 py-4 text-xl font-bold rounded-xl shadow-lg shadow-[#d4a84b]/30 transform hover:scale-105 transition-all"
            >
              🚀 Start Game
            </Button>
            <Button 
              onClick={onOpenDashboard}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-4 rounded-xl"
            >
              📊 Dashboard
            </Button>
          </div>
        )}
        
        {!isHost && (
          <div className="text-white/50 text-lg">
            ⏳ Waiting for host to start the game...
          </div>
        )}
      </div>
    </div>
  );
  
  const renderIntro = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 overflow-y-auto">
      <FloatingParticles count={20} />
      
      <div className="max-w-4xl mx-auto relative z-10 py-8">
        <RevealCard>
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              WELCOME TO <span className="text-[#48a89a]">SPOT THE FAKE</span>
            </h1>
            <p className="text-xl text-white/70">
              AI-generated images are everywhere. Can you tell what's real?
            </p>
          </div>
        </RevealCard>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <RevealCard delay={200}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full border border-white/10">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-white mb-2">The AI Image Explosion</h3>
              <ul className="text-white/70 space-y-2">
                <li>• Over 15 billion AI images created in 2023</li>
                <li>• 900% increase in AI-generated content year-over-year</li>
                <li>• Most people can only identify AI images 50% of the time</li>
              </ul>
            </div>
          </RevealCard>
          
          <RevealCard delay={400}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full border border-white/10">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">What You'll Learn</h3>
              <ul className="text-white/70 space-y-2">
                <li>• How to spot AI-generated faces and landscapes</li>
                <li>• Common artifacts and tells in AI images</li>
                <li>• Real-world examples of AI misinformation</li>
                <li>• Ethical implications of synthetic media</li>
              </ul>
            </div>
          </RevealCard>
        </div>
        
        <RevealCard delay={600}>
          <div className="bg-gradient-to-r from-[#d4a84b]/20 to-[#48a89a]/20 rounded-2xl p-8 border border-[#d4a84b]/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">🎮 How to Play</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-5xl mb-3">👁️</div>
                <div className="text-white font-medium">Round 1: Real vs AI</div>
                <div className="text-white/60 text-sm">Identify AI-generated images</div>
              </div>
              <div>
                <div className="text-5xl mb-3">✂️</div>
                <div className="text-white font-medium">Round 2: Edited or Not</div>
                <div className="text-white/60 text-sm">Spot manipulated photos</div>
              </div>
              <div>
                <div className="text-5xl mb-3">🐺</div>
                <div className="text-white font-medium">Finale: AI Werewolf</div>
                <div className="text-white/60 text-sm">Find the faker among you</div>
              </div>
            </div>
          </div>
        </RevealCard>
        
        {isHost && (
          <RevealCard delay={800}>
            <div className="text-center mt-8">
              <Button 
                onClick={() => updateGamePhase(gameCode, 'round1')}
                className="bg-gradient-to-r from-[#48a89a] to-[#3d8a7e] hover:from-[#5bc0a8] hover:to-[#48a89a] text-white px-12 py-4 text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
              >
                Begin Round 1 →
              </Button>
            </div>
          </RevealCard>
        )}
      </div>
    </div>
  );
  
  const renderRound1 = () => {
    const currentImage = images[currentIndex];
    if (!currentImage) return <div className="text-white">Loading images...</div>;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6">
        <Scanlines />
        {showConfetti && <FloatingParticles count={50} />}
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-black text-white">
                ROUND 1: <span className="text-[#48a89a]">Real or AI?</span>
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-white/60">Image {currentIndex + 1} of {images.length}</span>
                {streak > 1 && (
                  <span className="bg-[#d4a84b] text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    🔥 {streak} streak!
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-[#d4a84b]">{localScore}</div>
              <div className="text-white/60 text-sm">points</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <AnimatedProgressBar 
            current={currentIndex + 1} 
            total={images.length} 
            label="Progress"
          />
          
          {/* Image card */}
          <div className={`mt-6 relative ${isShaking ? 'animate-shake' : ''}`}>
            <div 
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 cursor-zoom-in"
              onClick={() => setZoomImage(currentImage.url)}
            >
              <img 
                src={currentImage.url}
                alt="Test image"
                className="w-full aspect-video object-cover rounded-2xl shadow-2xl"
              />
              
              {showResult && (
                <div className={`absolute inset-0 flex items-center justify-center bg-black/70 rounded-3xl ${
                  selectedAnswer === (currentImage.isAI ? 'ai' : 'real') 
                    ? '' 
                    : ''
                }`}>
                  <div className="text-center p-6">
                    <div className="text-7xl mb-4">
                      {selectedAnswer === (currentImage.isAI ? 'ai' : 'real') ? '✅' : '❌'}
                    </div>
                    <div className="text-3xl font-black text-white mb-2">
                      {selectedAnswer === (currentImage.isAI ? 'ai' : 'real') ? 'CORRECT!' : 'WRONG!'}
                    </div>
                    <div className="text-white/80 mb-4">
                      This image is <span className="font-bold text-[#48a89a]">{currentImage.isAI ? 'AI-GENERATED' : 'REAL'}</span>
                    </div>
                    <div className="text-white/60 text-sm max-w-md mx-auto">
                      {currentImage.explanation}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Hint button */}
            {!showResult && (
              <button 
                onClick={() => setShowHint(!showHint)}
                className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all"
              >
                {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
              </button>
            )}
            
            {showHint && !showResult && (
              <div className="absolute bottom-6 left-6 right-6 bg-[#d4a84b]/90 text-white p-4 rounded-xl text-sm font-medium backdrop-blur-sm">
                💡 {currentImage.hint}
              </div>
            )}
          </div>
          
          {/* Answer buttons */}
          {!showResult ? (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button 
                onClick={() => handleAnswer('real')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white py-6 text-2xl font-black rounded-2xl shadow-lg shadow-green-500/30 transform hover:scale-105 transition-all"
              >
                📷 REAL
              </Button>
              <Button 
                onClick={() => handleAnswer('ai')}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white py-6 text-2xl font-black rounded-2xl shadow-lg shadow-red-500/30 transform hover:scale-105 transition-all"
              >
                🤖 AI
              </Button>
            </div>
          ) : (
            <div className="mt-6 text-center">
              {currentIndex < images.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  className="bg-gradient-to-r from-[#48a89a] to-[#3d8a7e] text-white px-12 py-4 text-xl font-bold rounded-xl"
                >
                  Next Image →
                </Button>
              ) : isHost ? (
                <Button 
                  onClick={() => updateGamePhase(gameCode, 'round1-debrief')}
                  className="bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] text-white px-12 py-4 text-xl font-bold rounded-xl"
                >
                  View Results →
                </Button>
              ) : (
                <p className="text-white/60 text-lg">Waiting for host to continue...</p>
              )}
            </div>
          )}
        </div>
        
        {/* Zoom modal */}
        {zoomImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomImage(null)}
          >
            <img 
              src={zoomImage}
              alt="Zoomed"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button 
              className="absolute top-6 right-6 text-white text-2xl hover:text-[#48a89a]"
              onClick={() => setZoomImage(null)}
            >
              ✕
            </button>
          </div>
        )}
        
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `}</style>
      </div>
    );
  };
  
  const renderDebrief = () => {
    const roundNum = room?.phase === 'round1-debrief' ? 1 : 2;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 overflow-y-auto">
        <FloatingParticles count={15} />
        
        <div className="max-w-4xl mx-auto relative z-10 py-8">
          <RevealCard>
            <div className="text-center mb-12">
              <div className="text-7xl mb-4">🎉</div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                ROUND {roundNum} <span className="text-[#d4a84b]">COMPLETE!</span>
              </h1>
              <p className="text-xl text-white/70">
                Let's look at some real-world examples of AI deception
              </p>
            </div>
          </RevealCard>
          
          {/* Example carousel */}
          <RevealCard delay={200}>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  📚 Case Study {currentExample + 1} of {enhancedExamples.length}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setCurrentExample(e => Math.max(0, e - 1))}
                    disabled={currentExample === 0}
                    className="bg-white/20 hover:bg-white/30 disabled:opacity-30"
                  >
                    ←
                  </Button>
                  <Button 
                    onClick={() => setCurrentExample(e => Math.min(enhancedExamples.length - 1, e + 1))}
                    disabled={currentExample === enhancedExamples.length - 1}
                    className="bg-white/20 hover:bg-white/30 disabled:opacity-30"
                  >
                    →
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={enhancedExamples[currentExample].image}
                    alt={enhancedExamples[currentExample].title}
                    className="w-full aspect-video object-cover rounded-xl shadow-lg"
                  />
                  <p className="text-white/50 text-sm mt-2 text-center italic">
                    {enhancedExamples[currentExample].imageCaption}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-[#48a89a]">
                    {enhancedExamples[currentExample].title}
                  </h4>
                  <p className="text-white/80">
                    {enhancedExamples[currentExample].description}
                  </p>
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                    <div className="text-red-400 font-bold mb-1">⚠️ Impact:</div>
                    <div className="text-white/70 text-sm">
                      {enhancedExamples[currentExample].impact}
                    </div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-400 font-bold mb-1">🔍 How to Detect:</div>
                    <ul className="text-white/70 text-sm space-y-1">
                      {enhancedExamples[currentExample].tips.map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </RevealCard>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {enhancedExamples.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentExample(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentExample 
                    ? 'bg-[#48a89a] w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          
          {isHost && (
            <RevealCard delay={400}>
              <div className="text-center">
                <Button 
                  onClick={() => updateGamePhase(gameCode, roundNum === 1 ? 'round2' : 'ethics')}
                  className="bg-gradient-to-r from-[#48a89a] to-[#3d8a7e] text-white px-12 py-4 text-xl font-bold rounded-xl"
                >
                  {roundNum === 1 ? 'Start Round 2 →' : 'Continue to Ethics →'}
                </Button>
              </div>
            </RevealCard>
          )}
        </div>
      </div>
    );
  };
  
  const renderEthics = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 overflow-y-auto">
      <FloatingParticles count={15} />
      
      <div className="max-w-4xl mx-auto relative z-10 py-8">
        <RevealCard>
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">⚖️</div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              THE <span className="text-[#d4a84b]">ETHICS</span> OF AI IMAGES
            </h1>
            <p className="text-xl text-white/70">
              Let's discuss the moral implications of synthetic media
            </p>
          </div>
        </RevealCard>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <RevealCard delay={200}>
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl p-6 h-full">
              <div className="text-3xl mb-3">🚫</div>
              <h3 className="text-xl font-bold text-white mb-3">Harmful Uses</h3>
              <ul className="text-white/70 space-y-2">
                <li>• Spreading misinformation and propaganda</li>
                <li>• Identity theft and fraud</li>
                <li>• Creating non-consensual content</li>
                <li>• Manipulating public opinion</li>
                <li>• Undermining trust in authentic media</li>
              </ul>
            </div>
          </RevealCard>
          
          <RevealCard delay={400}>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6 h-full">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-white mb-3">Beneficial Uses</h3>
              <ul className="text-white/70 space-y-2">
                <li>• Art and creative expression</li>
                <li>• Education and training simulations</li>
                <li>• Accessibility (visual descriptions)</li>
                <li>• Entertainment and storytelling</li>
                <li>• Medical and scientific visualization</li>
              </ul>
            </div>
          </RevealCard>
        </div>
        
        <RevealCard delay={600}>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">💬 Discussion Questions</h3>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/90">1. Should AI-generated images always be labeled as such?</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/90">2. Who should be responsible when AI images cause harm?</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/90">3. How can we preserve trust in visual media?</p>
              </div>
            </div>
          </div>
        </RevealCard>
        
        {isHost && (
          <RevealCard delay={800}>
            <div className="text-center">
              <Button 
                onClick={() => updateGamePhase(gameCode, 'legal')}
                className="bg-gradient-to-r from-[#48a89a] to-[#3d8a7e] text-white px-12 py-4 text-xl font-bold rounded-xl"
              >
                Continue to Legal Landscape →
              </Button>
            </div>
          </RevealCard>
        )}
      </div>
    </div>
  );
  
  const renderLegal = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 overflow-y-auto">
      <FloatingParticles count={15} />
      
      <div className="max-w-4xl mx-auto relative z-10 py-8">
        <RevealCard>
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📜</div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              THE <span className="text-[#48a89a]">LEGAL</span> LANDSCAPE
            </h1>
            <p className="text-xl text-white/70">
              Laws are evolving to address AI-generated content
            </p>
          </div>
        </RevealCard>
        
        <div className="space-y-6 mb-8">
          <RevealCard delay={200}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🇺🇸</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">United States</h3>
                  <p className="text-white/70">
                    Multiple states have passed laws requiring disclosure of AI-generated content in political ads. 
                    Federal legislation is being considered for broader AI content labeling requirements.
                  </p>
                </div>
              </div>
            </div>
          </RevealCard>
          
          <RevealCard delay={400}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🇪🇺</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">European Union</h3>
                  <p className="text-white/70">
                    The EU AI Act requires clear labeling of AI-generated content and establishes strict rules 
                    for high-risk AI applications, including synthetic media.
                  </p>
                </div>
              </div>
            </div>
          </RevealCard>
          
          <RevealCard delay={600}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🌐</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Global Trends</h3>
                  <p className="text-white/70">
                    Countries worldwide are developing frameworks to address AI misuse. Key trends include 
                    mandatory watermarking, platform liability, and right to privacy protections.
                  </p>
                </div>
              </div>
            </div>
          </RevealCard>
        </div>
        
        {isHost && (
          <RevealCard delay={800}>
            <div className="text-center">
              <Button 
                onClick={() => updateGamePhase(gameCode, 'werewolf')}
                className="bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] text-white px-12 py-4 text-xl font-bold rounded-xl"
              >
                🐺 Start AI Werewolf Finale →
              </Button>
            </div>
          </RevealCard>
        )}
      </div>
    </div>
  );
  
  const renderWerewolf = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 flex items-center justify-center">
      <FloatingParticles count={25} />
      
      <div className="max-w-2xl w-full text-center relative z-10">
        <RevealCard>
          <div className="text-8xl mb-6 animate-bounce">🐺</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            <GlitchText>AI WEREWOLF</GlitchText>
          </h1>
          <p className="text-xl text-white/70 mb-8">
            One player has an AI-generated profile. Can you find them?
          </p>
        </RevealCard>
        
        {werewolfAssignment && (
          <RevealCard delay={300}>
            <div className={`rounded-3xl p-8 mb-8 ${
              werewolfAssignment.isAI 
                ? 'bg-gradient-to-br from-red-500/30 to-red-600/30 border-2 border-red-500'
                : 'bg-gradient-to-br from-green-500/30 to-green-600/30 border-2 border-green-500'
            }`}>
              <h3 className="text-2xl font-bold text-white mb-4">Your Secret Role</h3>
              
              <img 
                src={werewolfAssignment.image.url}
                alt="Your profile"
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-xl mb-4"
              />
              
              <p className="text-white text-lg mb-4">
                {werewolfAssignment.instruction}
              </p>
              
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                werewolfAssignment.isAI 
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}>
                {werewolfAssignment.isAI ? '🤖 YOU ARE THE AI FAKER' : '👤 YOUR IMAGE IS REAL'}
              </div>
            </div>
          </RevealCard>
        )}
        
        <RevealCard delay={600}>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">📋 Rules</h3>
            <ul className="text-white/70 text-left space-y-2">
              <li>• Each player will show their profile image</li>
              <li>• Ask questions to determine who has the AI image</li>
              <li>• The AI faker must convince others their image is real</li>
              <li>• After discussion, everyone votes</li>
              <li>• If you find the faker, the village wins!</li>
            </ul>
          </div>
        </RevealCard>
        
        {isHost && (
          <RevealCard delay={900}>
            <Button 
              onClick={() => updateGamePhase(gameCode, 'werewolf-vote')}
              className="bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] text-white px-12 py-4 text-xl font-bold rounded-xl"
            >
              Start Voting Phase →
            </Button>
          </RevealCard>
        )}
      </div>
    </div>
  );
  
  const renderWerewolfVote = () => {
    const players = Object.values(room?.players || {});
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6">
        <FloatingParticles count={20} />
        
        <div className="max-w-4xl mx-auto relative z-10 py-8">
          <RevealCard>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🗳️</div>
              <h1 className="text-4xl font-black text-white mb-2">
                VOTE FOR THE <span className="text-red-500">FAKER</span>
              </h1>
              <p className="text-white/70">
                Who do you think has the AI-generated profile?
              </p>
            </div>
          </RevealCard>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {players.map((player, i) => (
              <RevealCard key={player.id} delay={i * 100}>
                <button
                  onClick={() => handleWerewolfVote(player.id)}
                  disabled={selectedVote !== null}
                  className={`w-full p-4 rounded-2xl transition-all duration-300 ${
                    selectedVote === player.id
                      ? 'bg-gradient-to-br from-red-500 to-red-600 border-4 border-white scale-105'
                      : 'bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40'
                  } ${selectedVote !== null && selectedVote !== player.id ? 'opacity-50' : ''}`}
                >
                  <div className="text-4xl mb-2">
                    {selectedVote === player.id ? '🎯' : '👤'}
                  </div>
                  <div className="text-white font-bold truncate">{player.name}</div>
                  {player.id === userId && (
                    <div className="text-xs text-white/50 mt-1">(You)</div>
                  )}
                </button>
              </RevealCard>
            ))}
          </div>
          
          {selectedVote && (
            <RevealCard delay={500}>
              <div className="text-center mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                  <p className="text-white text-lg">
                    You voted for <span className="font-bold text-[#d4a84b]">
                      {players.find(p => p.id === selectedVote)?.name}
                    </span>
                  </p>
                  <p className="text-white/60 text-sm mt-2">
                    Waiting for other players to vote...
                  </p>
                </div>
              </div>
            </RevealCard>
          )}
          
          {isHost && (
            <RevealCard delay={700}>
              <div className="text-center">
                <Button 
                  onClick={() => updateGamePhase(gameCode, 'results')}
                  className="bg-gradient-to-r from-[#48a89a] to-[#3d8a7e] text-white px-12 py-4 text-xl font-bold rounded-xl"
                >
                  Reveal Results →
                </Button>
              </div>
            </RevealCard>
          )}
        </div>
      </div>
    );
  };
  
  const renderResults = () => {
    const players = Object.values(room?.players || {}).sort((a, b) => (b.score || 0) - (a.score || 0));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 overflow-y-auto">
        <FloatingParticles count={40} />
        
        <div className="max-w-3xl mx-auto relative z-10 py-8">
          <RevealCard>
            <div className="text-center mb-12">
              <div className="text-8xl mb-4">🏆</div>
              <h1 className="text-5xl font-black text-white mb-4">
                <GlitchText>FINAL RESULTS</GlitchText>
              </h1>
            </div>
          </RevealCard>
          
          <div className="space-y-4 mb-12">
            {players.slice(0, 10).map((player, i) => (
              <RevealCard key={player.id} delay={i * 150}>
                <div className={`flex items-center justify-between p-6 rounded-2xl ${
                  i === 0 
                    ? 'bg-gradient-to-r from-[#d4a84b] via-[#e8c36a] to-[#d4a84b] text-white shadow-lg shadow-[#d4a84b]/30'
                    : i === 1
                      ? 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 text-gray-800'
                      : i === 2
                        ? 'bg-gradient-to-r from-orange-300 via-orange-200 to-orange-300 text-orange-900'
                        : 'bg-white/10 text-white'
                }`}>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                    </span>
                    <span className="text-2xl font-bold">{player.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black">{player.score || 0}</div>
                    <div className="text-sm opacity-70">points</div>
                  </div>
                </div>
              </RevealCard>
            ))}
          </div>
          
          <RevealCard delay={1500}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">🎓 Key Takeaways</h3>
              <div className="text-white/70 text-left space-y-3 max-w-xl mx-auto">
                <p>✓ Always question suspicious images, especially viral ones</p>
                <p>✓ Look for AI tells: hands, text, backgrounds, consistency</p>
                <p>✓ Verify with multiple sources before sharing</p>
                <p>✓ Consider the ethical implications of AI content</p>
                <p>✓ Stay informed about evolving AI detection tools</p>
              </div>
            </div>
          </RevealCard>
          
          <RevealCard delay={1800}>
            <div className="text-center">
              <Button 
                onClick={onBack}
                className="bg-gradient-to-r from-[#48a89a] to-[#3d8a7e] text-white px-12 py-4 text-xl font-bold rounded-xl"
              >
                🏠 Back to Home
              </Button>
            </div>
          </RevealCard>
        </div>
      </div>
    );
  };
  
  // ============================================
  // MAIN RENDER
  // ============================================
  
  const renderPhase = () => {
    switch (room?.phase) {
      case 'lobby': return renderLobby();
      case 'intro': return renderIntro();
      case 'round1': return renderRound1();
      case 'round1-debrief': return renderDebrief();
      case 'round2': return renderRound1(); // Reuse round1 UI
      case 'round2-debrief': return renderDebrief();
      case 'ethics': return renderEthics();
      case 'legal': return renderLegal();
      case 'werewolf': return renderWerewolf();
      case 'werewolf-vote': return renderWerewolfVote();
      case 'results': return renderResults();
      default: return renderLobby();
    }
  };
  
  return (
    <div className="relative">
      {renderPhase()}
      
      {/* Back button */}
      <button 
        onClick={onBack}
        className="fixed top-4 left-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium transition-all"
      >
        ← Exit Game
      </button>
      
      {/* Dashboard button for host */}
      {isHost && (
        <button 
          onClick={onOpenDashboard}
          className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium transition-all"
        >
          📊 Dashboard
        </button>
      )}
    </div>
  );
};

export default SpotTheFake;

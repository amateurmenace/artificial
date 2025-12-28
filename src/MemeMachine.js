// MEME MACHINE - Enhanced Game Component
// Create viral civic advocacy memes with AI - featuring Byte the AI Host!
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Timer, PlayerList, Input, ImageUploader, ReactionBar, Badge, Alert } from './components';
import { updateGamePhase, submitToGame, addReaction, uploadImage, subscribeToRoom } from './firebase';
import { critiqueMeme, generateCaptionOptions, suggestImageEdits, generateImage, hasApiKey } from './ai-services';

// Byte - our AI host character
const ByteCharacter = ({ message, emotion = 'happy', size = 'md' }) => {
  const emotions = {
    happy: '🤖',
    thinking: '🤔',
    excited: '🎉',
    cooking: '👨‍🍳',
    proud: '✨',
  };
  
  const sizes = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
  };
  
  return (
    <div className="flex items-start gap-4">
      <div className={`${sizes[size]} animate-bounce`}>
        {emotions[emotion]}
      </div>
      {message && (
        <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-lg border-2 border-[#d4a84b] max-w-md">
          <p className="text-[#3d5a4c] font-medium">{message}</p>
          <p className="text-xs text-gray-400 mt-1">— BYTE, your AI co-pilot</p>
        </div>
      )}
    </div>
  );
};

// Cooking Animation Component
const CookingAnimation = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [particles, setParticles] = useState([]);
  
  const phases = [
    { text: 'ANALYZING YOUR IDEA...', emoji: '🔍', progress: 10 },
    { text: 'MIXING PIXELS...', emoji: '🎨', progress: 25 },
    { text: 'ADDING ARTISTIC FLAIR...', emoji: '✨', progress: 40 },
    { text: 'GENERATING IMAGE...', emoji: '🖼️', progress: 60 },
    { text: 'APPLYING STYLE...', emoji: '🎭', progress: 75 },
    { text: 'FINAL TOUCHES...', emoji: '👨‍🍳', progress: 90 },
    { text: 'MEME READY!', emoji: '🚀', progress: 100 },
  ];
  
  useEffect(() => {
    if (phase < phases.length - 1) {
      const timer = setTimeout(() => setPhase(p => p + 1), 1500);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      setTimeout(onComplete, 500);
    }
  }, [phase, phases.length, onComplete]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticle = {
          id: Date.now(),
          x: 20 + Math.random() * 60,
          emoji: ['✨', '🔥', '💫', '⚡', '🌟'][Math.floor(Math.random() * 5)]
        };
        return [...prev.slice(-15), newParticle];
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);
  
  const currentPhase = phases[phase];
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#2d3436] to-[#636e72] rounded-3xl p-8 max-w-lg w-full mx-4 relative overflow-hidden">
        {/* Floating particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute text-2xl animate-float-up"
            style={{ left: `${p.x}%`, bottom: '30%' }}
          >
            {p.emoji}
          </div>
        ))}
        
        {/* Machine frame */}
        <div className="text-center relative z-10">
          <div className="text-8xl mb-4 animate-pulse">{currentPhase.emoji}</div>
          <h2 className="text-white text-2xl font-black mb-4">{currentPhase.text}</h2>
          
          {/* Progress bar */}
          <div className="h-4 bg-black/50 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-[#d4a84b] via-[#48a89a] to-[#d4a84b] transition-all duration-500"
              style={{ width: `${currentPhase.progress}%` }}
            />
          </div>
          
          <p className="text-white/60">{currentPhase.progress}%</p>
          
          {/* Byte comment */}
          <div className="mt-6 bg-white/10 rounded-xl p-4">
            <ByteCharacter 
              emotion="cooking" 
              size="sm"
              message={phase < 3 ? "Working on something amazing..." : "Almost there! This is going to be good!"}
            />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(0.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Caption Customizer Component
const CaptionCustomizer = ({ caption, style, onChange }) => {
  const fonts = [
    { id: 'impact', name: 'Impact', style: 'Impact, sans-serif' },
    { id: 'arial', name: 'Arial Black', style: 'Arial Black, sans-serif' },
    { id: 'comic', name: 'Comic', style: 'Comic Sans MS, cursive' },
    { id: 'times', name: 'Classic', style: 'Times New Roman, serif' },
  ];
  
  const sizes = ['Small', 'Medium', 'Large', 'XL'];
  const colors = ['#FFFFFF', '#000000', '#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7'];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-bold text-[#3d5a4c] mb-2 block">📝 FONT STYLE</label>
        <div className="flex flex-wrap gap-2">
          {fonts.map(font => (
            <button
              key={font.id}
              onClick={() => onChange({ ...style, font: font.style })}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                style.font === font.style 
                  ? 'border-[#d4a84b] bg-[#d4a84b]/10' 
                  : 'border-gray-300 hover:border-[#d4a84b]'
              }`}
              style={{ fontFamily: font.style }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="text-sm font-bold text-[#3d5a4c] mb-2 block">📏 TEXT SIZE</label>
        <div className="flex gap-2">
          {sizes.map((size, i) => (
            <button
              key={size}
              onClick={() => onChange({ ...style, size: i })}
              className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                style.size === i 
                  ? 'border-[#d4a84b] bg-[#d4a84b]/10' 
                  : 'border-gray-300 hover:border-[#d4a84b]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="text-sm font-bold text-[#3d5a4c] mb-2 block">🎨 TEXT COLOR</label>
        <div className="flex gap-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => onChange({ ...style, color })}
              className={`w-10 h-10 rounded-full border-4 transition-all ${
                style.color === color ? 'border-[#d4a84b] scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      <div>
        <label className="text-sm font-bold text-[#3d5a4c] mb-2 block">📍 POSITION</label>
        <div className="flex gap-2">
          {['Top', 'Bottom', 'Both'].map(pos => (
            <button
              key={pos}
              onClick={() => onChange({ ...style, position: pos.toLowerCase() })}
              className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                style.position === pos.toLowerCase() 
                  ? 'border-[#d4a84b] bg-[#d4a84b]/10' 
                  : 'border-gray-300 hover:border-[#d4a84b]'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Image Generation Wizard
const ImageWizard = ({ description, onChange, onGenerate, generating }) => {
  const [settings, setSettings] = useState({
    style: 'cartoon',
    colors: 'vibrant',
    mood: 'inspiring',
    realism: 50,
  });
  
  const styles = [
    { id: 'cartoon', name: 'Cartoon', emoji: '🎨' },
    { id: 'photorealistic', name: 'Photo-real', emoji: '📷' },
    { id: 'illustration', name: 'Illustration', emoji: '✏️' },
    { id: 'poster', name: 'Poster Art', emoji: '🎭' },
    { id: 'comic', name: 'Comic Book', emoji: '💥' },
  ];
  
  const colors = [
    { id: 'vibrant', name: 'Vibrant', emoji: '🌈' },
    { id: 'pastel', name: 'Pastel', emoji: '🌸' },
    { id: 'bold', name: 'Bold', emoji: '⚡' },
    { id: 'monochrome', name: 'B&W', emoji: '⬛' },
    { id: 'earth', name: 'Earth Tones', emoji: '🌿' },
  ];
  
  const moods = [
    { id: 'inspiring', name: 'Inspiring', emoji: '✨' },
    { id: 'urgent', name: 'Urgent', emoji: '🚨' },
    { id: 'hopeful', name: 'Hopeful', emoji: '🌅' },
    { id: 'funny', name: 'Funny', emoji: '😂' },
    { id: 'serious', name: 'Serious', emoji: '🎯' },
  ];
  
  const buildPrompt = () => {
    return `${description}. Style: ${settings.style}. Colors: ${settings.colors}. Mood: ${settings.mood}. Realism level: ${settings.realism}%. No text in image.`;
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-4 border-[#d4a84b]">
        <h3 className="text-xl font-bold text-[#3d5a4c] mb-4 flex items-center gap-2">
          <span>🎨</span> IMAGE STYLE
        </h3>
        <div className="flex flex-wrap gap-2">
          {styles.map(style => (
            <button
              key={style.id}
              onClick={() => setSettings(s => ({ ...s, style: style.id }))}
              className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                settings.style === style.id 
                  ? 'border-[#d4a84b] bg-[#d4a84b]/20 scale-105' 
                  : 'border-gray-300 hover:border-[#d4a84b]'
              }`}
            >
              <span className="text-2xl">{style.emoji}</span>
              <span className="font-medium">{style.name}</span>
            </button>
          ))}
        </div>
      </Card>
      
      <Card className="border-4 border-[#48a89a]">
        <h3 className="text-xl font-bold text-[#3d5a4c] mb-4 flex items-center gap-2">
          <span>🌈</span> COLOR PALETTE
        </h3>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <button
              key={color.id}
              onClick={() => setSettings(s => ({ ...s, colors: color.id }))}
              className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                settings.colors === color.id 
                  ? 'border-[#48a89a] bg-[#48a89a]/20 scale-105' 
                  : 'border-gray-300 hover:border-[#48a89a]'
              }`}
            >
              <span className="text-2xl">{color.emoji}</span>
              <span className="font-medium">{color.name}</span>
            </button>
          ))}
        </div>
      </Card>
      
      <Card className="border-4 border-purple-300">
        <h3 className="text-xl font-bold text-[#3d5a4c] mb-4 flex items-center gap-2">
          <span>😊</span> MOOD & VIBE
        </h3>
        <div className="flex flex-wrap gap-2">
          {moods.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSettings(s => ({ ...s, mood: mood.id }))}
              className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                settings.mood === mood.id 
                  ? 'border-purple-500 bg-purple-500/20 scale-105' 
                  : 'border-gray-300 hover:border-purple-500'
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="font-medium">{mood.name}</span>
            </button>
          ))}
        </div>
      </Card>
      
      <Card>
        <h3 className="text-xl font-bold text-[#3d5a4c] mb-4 flex items-center gap-2">
          <span>📊</span> REALISM LEVEL
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-2xl">🎨</span>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.realism}
            onChange={(e) => setSettings(s => ({ ...s, realism: parseInt(e.target.value) }))}
            className="flex-1 h-4 bg-gray-200 rounded-full appearance-none cursor-pointer"
          />
          <span className="text-2xl">📷</span>
        </div>
        <div className="text-center mt-2 text-sm text-gray-500">
          {settings.realism < 30 ? 'Abstract/Artistic' : settings.realism < 70 ? 'Balanced' : 'Photo-realistic'}
        </div>
      </Card>
      
      <Button 
        onClick={() => onGenerate(buildPrompt())}
        disabled={generating || !hasApiKey()}
        size="lg"
        className="w-full text-xl py-4"
      >
        {generating ? '🔄 GENERATING...' : '🚀 GENERATE MY MEME IMAGE!'}
      </Button>
    </div>
  );
};

// Main MemeMachine Component
const MemeMachine = ({ gameCode, room, userId, isHost, onBack, onOpenDashboard }) => {
  // State
  const [selectedIssue, setSelectedIssue] = useState('');
  const [customIssue, setCustomIssue] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [memeImageUrl, setMemeImageUrl] = useState('');
  const [memeCaption, setMemeCaption] = useState('');
  const [captionStyle, setCaptionStyle] = useState({
    font: 'Impact, sans-serif',
    size: 2,
    color: '#FFFFFF',
    position: 'bottom',
  });
  const [critique, setCritique] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCooking, setShowCooking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  
  // Loading states
  const [generatingImage, setGeneratingImage] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const communityIssues = [
    { id: 'climate', name: 'Climate Action', icon: '🌍', description: 'Environment & sustainability' },
    { id: 'transit', name: 'Public Transit', icon: '🚌', description: 'Buses, trains, bike lanes' },
    { id: 'parks', name: 'Parks & Green Space', icon: '🌳', description: 'Public parks, playgrounds' },
    { id: 'housing', name: 'Affordable Housing', icon: '🏠', description: 'Rent, home ownership' },
    { id: 'education', name: 'Education Access', icon: '📚', description: 'Schools, learning' },
    { id: 'health', name: 'Public Health', icon: '🏥', description: 'Healthcare for all' },
    { id: 'voting', name: 'Voting Rights', icon: '🗳️', description: 'Democracy & participation' },
    { id: 'community', name: 'Community Building', icon: '🤝', description: 'Neighbors helping neighbors' },
  ];
  
  const phases = ['lobby', 'intro', 'issue', 'describe', 'wizard', 'generate', 'caption', 'preview', 'critique', 'finalize', 'gallery', 'vote', 'results'];
  const currentPhaseIndex = phases.indexOf(room?.phase);
  
  // Timer effect
  useEffect(() => {
    if (room?.phaseEndTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((room.phaseEndTime - Date.now()) / 1000));
        setTimeLeft(remaining);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [room?.phaseEndTime]);
  
  const getCurrentIssue = () => {
    if (selectedIssue === 'custom') return customIssue;
    return communityIssues.find(i => i.id === selectedIssue)?.name || '';
  };
  
  const handleGenerateImage = async (prompt) => {
    setShowCooking(true);
    setGeneratingImage(true);
    try {
      const result = await generateImage(prompt);
      setMemeImageUrl(result.url);
    } catch (error) {
      alert('Failed to generate image: ' + error.message);
    } finally {
      setGeneratingImage(false);
    }
  };
  
  const handleGetCritique = async () => {
    setAnalyzing(true);
    try {
      const result = await critiqueMeme(
        imageDescription,
        memeCaption,
        getCurrentIssue()
      );
      setCritique(result);
    } catch (error) {
      alert('Failed to get critique: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };
  
  const handleSubmitMeme = async () => {
    if (!memeImageUrl || !memeCaption) return;
    
    await submitToGame(gameCode, {
      type: 'meme',
      imageUrl: memeImageUrl,
      caption: memeCaption,
      captionStyle,
      issue: getCurrentIssue(),
      description: imageDescription,
      playerName: room?.players?.find(p => p.id === userId)?.name || 'Unknown',
      playerId: userId,
      critiqueScore: critique?.scores?.overall || 0,
      submittedAt: Date.now(),
    });
    
    setIsSubmitted(true);
  };
  
  const handleDownloadMeme = () => {
    // Create a canvas to combine image and text
    const link = document.createElement('a');
    link.href = memeImageUrl;
    link.download = `meme-${getCurrentIssue().replace(/\s+/g, '-')}.png`;
    link.click();
  };
  
  const handleReaction = async (submissionId, reactionType) => {
    await addReaction(gameCode, submissionId, reactionType);
  };
  
  // Big Countdown Timer Component
  const BigTimer = ({ seconds }) => {
    const isUrgent = seconds < 30;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    return (
      <div className={`fixed top-4 right-4 z-40 p-4 rounded-2xl shadow-2xl ${
        isUrgent ? 'bg-red-600 animate-pulse' : 'bg-[#3d5a4c]'
      }`}>
        <div className="text-white text-center">
          <div className="text-4xl font-mono font-black">
            {minutes}:{secs.toString().padStart(2, '0')}
          </div>
          {isUrgent && <div className="text-sm font-bold">⚠️ HURRY!</div>}
        </div>
      </div>
    );
  };
  
  const renderPhase = () => {
    switch (room?.phase) {
      case 'lobby':
        return (
          <div className="space-y-6">
            {/* Hero intro card */}
            <div className="bg-gradient-to-br from-[#d4a84b] to-[#c49a3a] rounded-3xl p-8 text-white text-center shadow-2xl">
              <div className="text-8xl mb-4">🚀</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">MEME MACHINE</h2>
              <p className="text-xl text-white/90 max-w-lg mx-auto">
                Create viral memes for causes you care about!
              </p>
            </div>
            
            <Card className="border-4 border-[#d4a84b]">
              <ByteCharacter 
                emotion="happy" 
                message="Hey there! I'm BYTE, your AI co-pilot for meme creation. Together, we'll make something awesome that can change minds and inspire action!"
              />
            </Card>
            
            <Card>
              <h3 className="text-xl font-bold text-[#3d5a4c] mb-4">👥 PLAYERS READY</h3>
              <PlayerList players={room?.players} currentUserId={userId} />
            </Card>
            
            {isHost && (
              <div className="flex gap-4 justify-center">
                <Button onClick={() => updateGamePhase(gameCode, 'intro')} size="lg" className="text-xl px-8 py-4 animate-pulse">
                  🚀 START GAME
                </Button>
                <Button variant="secondary" onClick={onOpenDashboard} size="lg">
                  📊 Dashboard
                </Button>
              </div>
            )}
          </div>
        );
      
      case 'intro':
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[#3d5a4c] to-[#48a89a] text-white border-0">
              <div className="text-center">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-3xl font-black mb-4">AI FOR GOOD!</h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  This game isn't about the dangers of AI — it's about the <strong>power</strong> of AI to spread important messages and inspire change!
                </p>
              </div>
            </Card>
            
            <Card className="border-4 border-[#d4a84b]">
              <h3 className="text-2xl font-bold text-[#3d5a4c] mb-4">🎯 YOUR MISSION</h3>
              <p className="text-lg text-[#6b7c74] mb-4">
                Create a meme that advocates for a civic cause. The best memes spread awareness, inspire action, and maybe even go viral!
              </p>
              
              {/* Example meme */}
              <div className="bg-[#f5f3ef] rounded-xl p-4">
                <h4 className="font-bold text-[#3d5a4c] mb-3">💡 EXAMPLE: A Meme for Change</h4>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-sm mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop" 
                    alt="Example meme"
                    className="w-full h-48 object-cover"
                  />
                  <div className="bg-black text-white text-center py-3 font-bold text-lg" style={{ fontFamily: 'Impact, sans-serif' }}>
                    TREES DON'T CARE ABOUT YOUR POLITICS
                    <br />
                    <span className="text-sm">THEY JUST WANT TO BREATHE</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Simple, visual, shareable — that's a good civic meme!
                </p>
              </div>
            </Card>
            
            <Card>
              <h3 className="text-xl font-bold text-[#3d5a4c] mb-4">🎮 HOW IT WORKS</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { step: '1', icon: '💡', title: 'Pick a Cause', desc: 'Choose what matters to you' },
                  { step: '2', icon: '🎨', title: 'Create', desc: 'Design your image with AI' },
                  { step: '3', icon: '✍️', title: 'Caption', desc: 'Add punchy text' },
                  { step: '4', icon: '🔍', title: 'Critique', desc: 'Get AI feedback' },
                  { step: '5', icon: '🚀', title: 'Submit', desc: 'Share with the group' },
                  { step: '6', icon: '🏆', title: 'Vote', desc: 'Best meme wins!' },
                ].map(item => (
                  <div key={item.step} className="text-center p-4 bg-[#f5f3ef] rounded-xl">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-bold text-[#3d5a4c]">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
            
            {isHost && (
              <Button onClick={() => updateGamePhase(gameCode, 'issue')} size="lg" className="w-full text-xl">
                LET'S BEGIN! →
              </Button>
            )}
          </div>
        );
      
      case 'issue':
        return (
          <div className="space-y-6">
            {timeLeft !== null && <BigTimer seconds={timeLeft} />}
            
            <Card className="bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] text-white border-0">
              <h2 className="text-3xl font-black text-center">💡 STEP 1: PICK YOUR CAUSE</h2>
              <p className="text-center mt-2">What issue fires you up?</p>
            </Card>
            
            <ByteCharacter 
              emotion="thinking"
              message="Pick something you genuinely care about — your passion will show in your meme!"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {communityIssues.map(issue => (
                <button
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue.id)}
                  className={`p-4 rounded-2xl border-4 text-center transition-all hover:scale-105 ${
                    selectedIssue === issue.id 
                      ? 'border-[#d4a84b] bg-[#d4a84b]/20 scale-105' 
                      : 'border-gray-200 bg-white hover:border-[#d4a84b]'
                  }`}
                >
                  <div className="text-4xl mb-2">{issue.icon}</div>
                  <div className="font-bold text-[#3d5a4c]">{issue.name}</div>
                  <div className="text-xs text-gray-500">{issue.description}</div>
                </button>
              ))}
            </div>
            
            <Card>
              <p className="text-center text-gray-500 mb-2">Or write your own:</p>
              <Input
                value={customIssue}
                onChange={(e) => {
                  setCustomIssue(e.target.value);
                  setSelectedIssue('custom');
                }}
                placeholder="My own cause: e.g., 'Save the Bees'"
                className="text-center text-lg"
              />
            </Card>
            
            <Button 
              onClick={() => updateGamePhase(gameCode, 'describe')}
              disabled={!selectedIssue && !customIssue}
              size="lg"
              className="w-full text-xl"
            >
              NEXT: DESCRIBE YOUR IMAGE →
            </Button>
          </div>
        );
      
      case 'describe':
        return (
          <div className="space-y-6">
            {timeLeft !== null && <BigTimer seconds={timeLeft} />}
            
            <Card className="bg-gradient-to-r from-[#48a89a] to-[#3d5a4c] text-white border-0">
              <h2 className="text-3xl font-black text-center">📝 STEP 2: DESCRIBE YOUR IMAGE</h2>
              <p className="text-center mt-2">Tell the AI what you want to see!</p>
            </Card>
            
            <Card className="border-4 border-[#48a89a]">
              <ByteCharacter 
                emotion="excited"
                message={`Great choice with "${getCurrentIssue()}"! Now describe the image you want. Be specific — the more detail, the better the result!`}
              />
            </Card>
            
            <Card>
              <label className="block text-lg font-bold text-[#3d5a4c] mb-3">
                🎨 What should your meme image look like?
              </label>
              <textarea
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder={`Example: "A cartoon Earth wearing sunglasses and giving a thumbs up, with solar panels and wind turbines in the background. Bright, optimistic colors."`}
                className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-[#48a89a] focus:ring-2 focus:ring-[#48a89a]/20"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Tip: Include details about style, mood, colors, and specific elements you want to see.
              </p>
            </Card>
            
            <Button 
              onClick={() => updateGamePhase(gameCode, 'wizard')}
              disabled={!imageDescription.trim()}
              size="lg"
              className="w-full text-xl"
            >
              NEXT: CUSTOMIZE STYLE →
            </Button>
          </div>
        );
      
      case 'wizard':
        return (
          <div className="space-y-6">
            {timeLeft !== null && <BigTimer seconds={timeLeft} />}
            
            <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">
              <h2 className="text-3xl font-black text-center">🎨 STEP 3: STYLE WIZARD</h2>
              <p className="text-center mt-2">Fine-tune your image's look!</p>
            </Card>
            
            <Card className="border-4 border-purple-300">
              <ByteCharacter 
                emotion="cooking"
                message="Time to add some flair! These controls will help me understand exactly how you want your image to look."
              />
            </Card>
            
            <ImageWizard 
              description={imageDescription}
              onGenerate={(prompt) => {
                handleGenerateImage(prompt);
                updateGamePhase(gameCode, 'generate');
              }}
              generating={generatingImage}
            />
          </div>
        );
      
      case 'generate':
        return (
          <div className="space-y-6">
            {showCooking && !memeImageUrl && (
              <CookingAnimation onComplete={() => setShowCooking(false)} />
            )}
            
            {memeImageUrl ? (
              <>
                <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  <h2 className="text-3xl font-black text-center">✨ IMAGE GENERATED!</h2>
                </Card>
                
                <Card className="border-4 border-green-300 p-0 overflow-hidden">
                  <img 
                    src={memeImageUrl} 
                    alt="Your meme"
                    className="w-full"
                  />
                </Card>
                
                <ByteCharacter 
                  emotion="proud"
                  message="Looking good! Now let's add a killer caption to make this meme complete."
                />
                
                <div className="flex gap-4">
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      setMemeImageUrl('');
                      updateGamePhase(gameCode, 'wizard');
                    }}
                    size="lg"
                  >
                    ← TRY AGAIN
                  </Button>
                  <Button 
                    onClick={() => updateGamePhase(gameCode, 'caption')}
                    size="lg"
                    className="flex-1"
                  >
                    ADD CAPTION →
                  </Button>
                </div>
              </>
            ) : (
              <Card className="text-center p-8">
                <div className="text-6xl animate-spin mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-[#3d5a4c]">Creating your masterpiece...</h3>
                <p className="text-gray-500">This usually takes 10-20 seconds</p>
              </Card>
            )}
          </div>
        );
      
      case 'caption':
        return (
          <div className="space-y-6">
            {timeLeft !== null && <BigTimer seconds={timeLeft} />}
            
            <Card className="bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] text-white border-0">
              <h2 className="text-3xl font-black text-center">✍️ STEP 4: ADD YOUR CAPTION</h2>
            </Card>
            
            {/* Live preview */}
            <Card className="bg-black p-0 overflow-hidden">
              <div className="relative">
                <img src={memeImageUrl} alt="Meme" className="w-full" />
                {memeCaption && (
                  <div 
                    className={`absolute left-0 right-0 p-4 text-center ${
                      captionStyle.position === 'top' ? 'top-0' : 
                      captionStyle.position === 'bottom' ? 'bottom-0' : 
                      'top-0 bottom-0 flex items-center justify-center'
                    }`}
                    style={{
                      fontFamily: captionStyle.font,
                      fontSize: ['1rem', '1.25rem', '1.5rem', '2rem'][captionStyle.size],
                      color: captionStyle.color,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    {memeCaption}
                  </div>
                )}
              </div>
            </Card>
            
            <Card>
              <label className="block text-lg font-bold text-[#3d5a4c] mb-3">
                💬 Your Caption
              </label>
              <textarea
                value={memeCaption}
                onChange={(e) => setMemeCaption(e.target.value)}
                placeholder="Write something punchy, memorable, and shareable!"
                className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-[#d4a84b]"
                rows={3}
              />
            </Card>
            
            <CaptionCustomizer 
              caption={memeCaption}
              style={captionStyle}
              onChange={setCaptionStyle}
            />
            
            <Button 
              onClick={() => updateGamePhase(gameCode, 'preview')}
              disabled={!memeCaption.trim()}
              size="lg"
              className="w-full text-xl"
            >
              PREVIEW MY MEME →
            </Button>
          </div>
        );
      
      case 'preview':
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-[#48a89a] to-[#3d5a4c] text-white border-0">
              <h2 className="text-3xl font-black text-center">👀 PREVIEW YOUR MEME</h2>
            </Card>
            
            {/* Final meme preview */}
            <Card className="bg-black p-0 overflow-hidden shadow-2xl">
              <div className="relative">
                <img src={memeImageUrl} alt="Meme" className="w-full" />
                <div 
                  className={`absolute left-0 right-0 p-4 text-center ${
                    captionStyle.position === 'top' ? 'top-0' : 'bottom-0'
                  }`}
                  style={{
                    fontFamily: captionStyle.font,
                    fontSize: ['1rem', '1.25rem', '1.5rem', '2rem'][captionStyle.size],
                    color: captionStyle.color,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                >
                  {memeCaption}
                </div>
              </div>
              <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
                <span className="text-sm">@{room?.players?.find(p => p.id === userId)?.name}</span>
                <span className="text-sm">#{getCurrentIssue().replace(/\s+/g, '')}</span>
              </div>
            </Card>
            
            <ByteCharacter 
              emotion="happy"
              message="Nice work! Ready to see how effective your meme is? Let's get some feedback!"
            />
            
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => updateGamePhase(gameCode, 'caption')} size="lg">
                ← EDIT CAPTION
              </Button>
              <Button onClick={() => updateGamePhase(gameCode, 'critique')} size="lg" className="flex-1">
                GET AI FEEDBACK →
              </Button>
            </div>
          </div>
        );
      
      case 'critique':
        return (
          <div className="space-y-6">
            {!critique ? (
              <>
                <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">
                  <h2 className="text-3xl font-black text-center">🔍 AI CRITIQUE</h2>
                  <p className="text-center">Let's see how effective your meme is!</p>
                </Card>
                
                <Card className="text-center">
                  <Button onClick={handleGetCritique} size="lg" disabled={analyzing}>
                    {analyzing ? '🔄 Analyzing...' : '🎯 GET MY CRITIQUE'}
                  </Button>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  <h2 className="text-3xl font-black text-center">📊 YOUR MEME SCORE</h2>
                  <div className="text-6xl text-center font-black mt-4">
                    {critique.scores?.overall || 7}/10
                  </div>
                </Card>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-4 border-green-300">
                    <h3 className="text-lg font-bold text-green-700 mb-2">💪 STRENGTHS</h3>
                    <ul className="space-y-2">
                      {(critique.strengths || []).map((s, i) => (
                        <li key={i} className="text-green-600">✓ {s}</li>
                      ))}
                    </ul>
                  </Card>
                  
                  <Card className="border-4 border-yellow-300">
                    <h3 className="text-lg font-bold text-yellow-700 mb-2">💡 TO IMPROVE</h3>
                    <ul className="space-y-2">
                      {(critique.improvements || []).map((s, i) => (
                        <li key={i} className="text-yellow-600">→ {s}</li>
                      ))}
                    </ul>
                  </Card>
                </div>
                
                {critique.revisedCaption && critique.revisedCaption !== memeCaption && (
                  <Card className="border-4 border-[#d4a84b]">
                    <h3 className="font-bold text-[#3d5a4c] mb-2">💡 Suggested Caption:</h3>
                    <p className="text-lg italic">"{critique.revisedCaption}"</p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setMemeCaption(critique.revisedCaption)}
                    >
                      Use This Caption
                    </Button>
                  </Card>
                )}
                
                <div className="flex gap-4">
                  <Button variant="secondary" onClick={() => updateGamePhase(gameCode, 'caption')} size="lg">
                    ← MAKE CHANGES
                  </Button>
                  <Button onClick={() => updateGamePhase(gameCode, 'finalize')} size="lg" className="flex-1">
                    FINALIZE MEME →
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      
      case 'finalize':
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] text-white border-0">
              <h2 className="text-3xl font-black text-center">🚀 SUBMIT YOUR MEME!</h2>
            </Card>
            
            {/* Final preview */}
            <Card className="bg-black p-0 overflow-hidden shadow-2xl">
              <div className="relative">
                <img src={memeImageUrl} alt="Final meme" className="w-full" />
                <div 
                  className={`absolute left-0 right-0 p-4 text-center ${
                    captionStyle.position === 'top' ? 'top-0' : 'bottom-0'
                  }`}
                  style={{
                    fontFamily: captionStyle.font,
                    fontSize: ['1rem', '1.25rem', '1.5rem', '2rem'][captionStyle.size],
                    color: captionStyle.color,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                >
                  {memeCaption}
                </div>
              </div>
            </Card>
            
            {!isSubmitted ? (
              <div className="space-y-4">
                <Button onClick={handleSubmitMeme} size="lg" className="w-full text-xl py-4 animate-pulse">
                  🚀 SUBMIT TO GALLERY!
                </Button>
                <Button variant="secondary" onClick={handleDownloadMeme} size="lg" className="w-full">
                  📥 Download My Meme
                </Button>
              </div>
            ) : (
              <Alert type="success">
                <div className="text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-xl font-bold">MEME SUBMITTED!</p>
                  <p>Your meme is now in the gallery. Waiting for others...</p>
                </div>
              </Alert>
            )}
            
            {isHost && (
              <Button 
                onClick={() => updateGamePhase(gameCode, 'gallery')}
                variant="secondary"
                className="w-full"
              >
                → View Gallery & Start Voting
              </Button>
            )}
          </div>
        );
      
      case 'gallery':
      case 'vote':
        const submissions = room?.submissions?.filter(s => s.type === 'meme') || [];
        
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-[#48a89a] to-[#3d5a4c] text-white border-0">
              <h2 className="text-3xl font-black text-center">🗳️ VOTE FOR THE BEST!</h2>
              <p className="text-center">React to memes and help them go viral!</p>
            </Card>
            
            <div className="space-y-6">
              {submissions.map((sub, i) => (
                <Card key={i} className="border-4 border-[#e2e0dc] p-0 overflow-hidden">
                  <div className="bg-[#f5f3ef] p-3 flex justify-between items-center">
                    <span className="font-bold text-[#3d5a4c]">@{sub.playerName}</span>
                    <span className="text-sm text-gray-500">#{sub.issue?.replace(/\s+/g, '')}</span>
                  </div>
                  
                  <div className="relative">
                    <img src={sub.imageUrl} alt="" className="w-full" />
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-4 text-center"
                      style={{
                        fontFamily: sub.captionStyle?.font || 'Impact, sans-serif',
                        fontSize: ['1rem', '1.25rem', '1.5rem', '2rem'][sub.captionStyle?.size || 2],
                        color: sub.captionStyle?.color || '#FFFFFF',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                      }}
                    >
                      {sub.caption}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <ReactionBar 
                      reactions={room?.reactions?.[sub.oderId] || {}}
                      onReact={(type) => handleReaction(sub.oderId, type)}
                    />
                  </div>
                </Card>
              ))}
            </div>
            
            {isHost && (
              <Button onClick={() => updateGamePhase(gameCode, 'results')} size="lg" className="w-full text-xl">
                🏆 SHOW RESULTS →
              </Button>
            )}
          </div>
        );
      
      case 'results':
        const allMemes = room?.submissions?.filter(s => s.type === 'meme') || [];
        const sortedMemes = [...allMemes].sort((a, b) => {
          const getScore = (sub) => {
            const reactions = room?.reactions?.[sub.oderId] || {};
            return Object.values(reactions).reduce((sum, count) => sum + count, 0);
          };
          return getScore(b) - getScore(a);
        });
        const winner = sortedMemes[0];
        
        return (
          <div className="space-y-6 text-center">
            <div className="text-8xl animate-bounce">🏆</div>
            <h2 className="text-4xl font-black text-[#3d5a4c]">THE WINNER!</h2>
            
            {winner && (
              <Card className="bg-gradient-to-r from-[#d4a84b] to-[#c49a3a] text-white border-0 p-0 overflow-hidden">
                <div className="relative">
                  <img src={winner.imageUrl} alt="" className="w-full" />
                  <div 
                    className="absolute bottom-0 left-0 right-0 p-4 text-center"
                    style={{
                      fontFamily: winner.captionStyle?.font || 'Impact, sans-serif',
                      color: '#FFFFFF',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    {winner.caption}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <p className="text-2xl font-bold">🎉 by {winner.playerName}</p>
                </div>
              </Card>
            )}
            
            <Card>
              <h3 className="text-xl font-bold text-[#3d5a4c] mb-4">🏅 All Submissions</h3>
              <div className="space-y-2">
                {sortedMemes.map((meme, i) => (
                  <div key={i} className={`flex justify-between p-4 rounded-xl ${
                    i === 0 ? 'bg-[#d4a84b]/20' : 'bg-[#f5f3ef]'
                  }`}>
                    <span className="flex items-center gap-2">
                      {i === 0 && '🥇'}
                      {i === 1 && '🥈'}
                      {i === 2 && '🥉'}
                      {meme.playerName}
                    </span>
                    <span className="font-bold">
                      {Object.values(room?.reactions?.[meme.oderId] || {}).reduce((a, b) => a + b, 0)} reactions
                    </span>
                  </div>
                ))}
              </div>
            </Card>
            
            <ByteCharacter 
              emotion="proud"
              message="Amazing work everyone! Remember: great memes can spread important messages and inspire real change. Now go make the world a better place!"
            />
            
            <Button onClick={onBack} variant="secondary" size="lg" className="text-xl">
              🏠 BACK TO GAMES
            </Button>
          </div>
        );
      
      default:
        return <div>Unknown phase: {room?.phase}</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#f5f3ef] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-[#6b7c74] hover:text-[#3d5a4c] font-bold">
            ← BACK
          </button>
          <div className="flex items-center gap-4">
            {isHost && (
              <Button variant="ghost" size="sm" onClick={onOpenDashboard}>
                📊 Dashboard
              </Button>
            )}
            <div className="bg-[#d4a84b] text-white px-4 py-2 rounded-xl font-mono font-bold">
              CODE: {gameCode}
            </div>
          </div>
        </div>
        
        {renderPhase()}
      </div>
    </div>
  );
};

export default MemeMachine;

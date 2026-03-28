// SPOT THE FAKE v6 - Fixed Round Progression
// All rounds work: Real vs AI, Edited, Ethics, Legal, Werewolf, Quiz

import React, { useState, useEffect } from 'react';
import { Button, useKeyboardShortcuts, ShareableResultCard } from './components';
import { playDing, playTick, playCelebration } from './sounds';
import { updateGamePhase, updatePlayerScore, submitToGame, submitVote } from './firebase';
import { round1Pairs, round2Pairs, getShuffledPairs } from './image-database';
import { educationalContent, getDiscussionPrompts, getQuizQuestions } from './educational-content';

// ============================================
// SCORING
// ============================================

const POINTS = {
  correct: 10,
  speed: 2,
  streak: 3,
  werewolfDetective: 30,
  werewolfImpostor: 50,
  quiz: 15,
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

const BigTimer = ({ seconds, totalSeconds, label }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 100;
  return (
    <div className={`rounded-2xl p-4 ${seconds <= 10 ? 'bg-gradient-to-r from-red-600 to-rose-600 animate-pulse' : seconds <= 30 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}>
      <div className="flex items-center justify-between text-white">
        <div className="text-sm font-medium opacity-80">{label || '⏱️ TIME'}</div>
        <div className="text-4xl font-mono font-black">{mins}:{secs.toString().padStart(2, '0')}</div>
      </div>
      <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white/60 transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

const ByteHost = ({ message, mood = 'thinking' }) => {
  const moods = {
    thinking: { emoji: '🤔', color: 'from-blue-500 to-cyan-500' },
    teaching: { emoji: '🎓', color: 'from-purple-500 to-pink-500' },
    excited: { emoji: '🤩', color: 'from-yellow-500 to-orange-500' },
    proud: { emoji: '✨', color: 'from-pink-500 to-rose-500' },
    detective: { emoji: '🕵️', color: 'from-slate-600 to-slate-700' },
    warning: { emoji: '⚠️', color: 'from-red-500 to-orange-500' }
  };
  const { emoji, color } = moods[mood] || moods.thinking;
  return (
    <div className="flex gap-4 items-start bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>{emoji}</div>
      <div className="flex-1"><div className="text-slate-100 leading-relaxed">{message}</div><div className="text-slate-500 text-xs mt-2">— BYTE</div></div>
    </div>
  );
};

const LearningTipCard = ({ tip, onContinue, isCorrect }) => (
  <div className={`rounded-3xl p-6 border-2 ${isCorrect ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/40' : 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/40'}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="text-5xl">{tip?.icon || '💡'}</div>
      <div>
        <div className={`text-sm font-bold ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>{isCorrect ? '✓ CORRECT!' : '✗ NOT QUITE'}</div>
        <h3 className="text-xl font-black text-white">{tip?.title || 'Learning Tip'}</h3>
      </div>
    </div>
    <p className="text-slate-200 mb-3">{tip?.content || 'AI detection takes practice!'}</p>
    <div className="bg-black/30 rounded-xl p-4 mb-4">
      <div className="text-cyan-400 text-xs font-bold mb-1">💡 PRO TIP</div>
      <p className="text-slate-300 text-sm">{tip?.detail || 'Look for inconsistencies.'}</p>
    </div>
    <button onClick={onContinue} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold transition-colors">Continue →</button>
  </div>
);

const ImageChoice = ({ image, label, onClick, selected, disabled, result }) => (
  <button onClick={onClick} disabled={disabled}
    className={`relative rounded-2xl overflow-hidden transition-all ${disabled ? '' : 'hover:scale-[1.02] hover:shadow-xl cursor-pointer'} ${selected && result === 'correct' ? 'ring-4 ring-emerald-500' : selected && result === 'wrong' ? 'ring-4 ring-red-500' : selected ? 'ring-4 ring-cyan-500' : ''}`}>
    <img src={image} alt={label} className="w-full aspect-square object-cover" loading="lazy" />
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <div className="text-white font-bold text-lg">{label}</div>
    </div>
    {result && (
      <div className={`absolute inset-0 flex items-center justify-center ${result === 'correct' ? 'bg-emerald-500/40' : 'bg-red-500/40'}`}>
        <div className="text-6xl">{result === 'correct' ? '✓' : '✗'}</div>
      </div>
    )}
  </button>
);

const RoundProgress = ({ current, total, round }) => (
  <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700">
    <div className="flex justify-between items-center mb-2">
      <span className="text-slate-400 text-sm">{round}</span>
      <span className="text-white font-bold">{current} / {total}</span>
    </div>
    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300" style={{ width: `${(current / total) * 100}%` }} />
    </div>
  </div>
);

const ScoreDisplay = ({ score, streak }) => (
  <div className="flex gap-4">
    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl px-4 py-2 text-white">
      <div className="text-xs opacity-80">SCORE</div>
      <div className="text-2xl font-black">{score}</div>
    </div>
    {streak > 1 && (
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl px-4 py-2 text-white">
        <div className="text-xs opacity-80">STREAK</div>
        <div className="text-2xl font-black">🔥 {streak}</div>
      </div>
    )}
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const SpotTheFake = ({ gameCode, room, userId, isHost, onBack, onOpenDashboard }) => {
  // Game state
  const [pairs, setPairs] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  
  // Score
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  
  // Timer
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSetting, setTimerSetting] = useState(30);
  
  // Werewolf
  const [isImpostor, setIsImpostor] = useState(false);
  const [assignedImage, setAssignedImage] = useState(null);
  const [werewolfVote, setWerewolfVote] = useState(null);
  const [werewolfTimer, setWerewolfTimer] = useState(60);
  const [impostorPlayerId, setImpostorPlayerId] = useState(null);
  
  // Quiz
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Keyboard shortcuts for image selection
  useKeyboardShortcuts({
    'ArrowLeft': () => { if (!showResult && !showTip) handleChoice('left'); },
    'ArrowRight': () => { if (!showResult && !showTip) handleChoice('right'); },
    '1': () => { if (!showResult && !showTip) handleChoice('left'); },
    '2': () => { if (!showResult && !showTip) handleChoice('right'); },
  });
  
  const currentPair = pairs[currentPairIndex];
  const phase = room?.phase || 'lobby';
  
  // Determine which round we're in based on phase
  const isRound1 = phase === 'round1-play';
  const isRound2 = phase === 'round2-play';
  const currentRound = isRound2 ? 2 : 1;
  
  // Initialize when phase changes
  useEffect(() => {
    console.log('Phase changed to:', phase);
    
    if (phase === 'round1-play') {
      const gamePairs = getShuffledPairs(round1Pairs, 5);
      console.log('Round 1 pairs:', gamePairs.length);
      setPairs(gamePairs);
      setCurrentPairIndex(0);
      setCorrectCount(0);
      setRoundComplete(false);
      setShowResult(false);
      setShowTip(false);
      setSelectedChoice(null);
      setTimeLeft(room?.timerSeconds || timerSetting);
      setTotalTime(room?.timerSeconds || timerSetting);
      setTimerActive(true);
    } else if (phase === 'round2-play') {
      const gamePairs = getShuffledPairs(round2Pairs, 5);
      console.log('Round 2 pairs:', gamePairs.length);
      setPairs(gamePairs);
      setCurrentPairIndex(0);
      setCorrectCount(0);
      setRoundComplete(false);
      setShowResult(false);
      setShowTip(false);
      setSelectedChoice(null);
      setTimeLeft(room?.timerSeconds || timerSetting);
      setTotalTime(room?.timerSeconds || timerSetting);
      setTimerActive(true);
    } else if (phase === 'quiz') {
      setQuizQuestions(getQuizQuestions(5));
      setCurrentQuizIndex(0);
      setQuizAnswer(null);
      setShowQuizResult(false);
    } else if (phase === 'werewolf-assign') {
      const players = Object.values(room?.players || {});
      if (players.length > 0) {
        const idx = Math.floor(Math.random() * players.length);
        const impId = players[idx]?.id;
        setImpostorPlayerId(impId);
        setIsImpostor(userId === impId);
        
        const realImages = [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        ];
        const aiImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
        setAssignedImage(userId === impId ? aiImage : realImages[Math.floor(Math.random() * realImages.length)]);
      }
      setWerewolfVote(null);
      setWerewolfTimer(60);
    } else if (phase === 'werewolf-vote') {
      setWerewolfTimer(60);
    }
  }, [phase, userId, room?.timerSeconds]);
  
  // Timer countdown
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          playDing();
          if (!showResult && !showTip && currentPair) {
            setShowResult(true);
            setStreak(0);
            setTimeout(() => { setShowResult(false); setShowTip(true); }, 1500);
          }
          return 0;
        }
        if (prev <= 10) playTick();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, showResult, showTip, currentPair]);
  
  // Reset timer for each new pair
  useEffect(() => {
    if (currentPair && !showResult && !showTip && !roundComplete && (isRound1 || isRound2)) {
      setTimeLeft(room?.timerSeconds || timerSetting);
      setTotalTime(room?.timerSeconds || timerSetting);
      setTimerActive(true);
    }
  }, [currentPairIndex, isRound1, isRound2, roundComplete]);
  
  // Werewolf timer
  useEffect(() => {
    if (phase === 'werewolf-vote' && werewolfTimer > 0) {
      const timer = setInterval(() => setWerewolfTimer(prev => prev > 0 ? prev - 1 : 0), 1000);
      return () => clearInterval(timer);
    }
  }, [phase, werewolfTimer]);
  
  const handleChoice = (choice) => {
    if (showResult || showTip || roundComplete) return;
    setTimerActive(false);
    setSelectedChoice(choice);
    
    let isCorrect = false;
    if (isRound1) {
      const realIsLeft = !currentPair.swapped;
      isCorrect = (choice === 'left' && realIsLeft) || (choice === 'right' && !realIsLeft);
    } else {
      const originalIsLeft = !currentPair.swapped;
      isCorrect = (choice === 'left' && originalIsLeft) || (choice === 'right' && !originalIsLeft);
    }
    
    if (isCorrect) {
      const points = POINTS.correct + (streak * POINTS.streak) + Math.floor(timeLeft / 5) * POINTS.speed;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setShowResult(true);
    setTimeout(() => { setShowResult(false); setShowTip(true); }, 1500);
  };
  
  const handleContinue = () => {
    setShowTip(false);
    setSelectedChoice(null);
    
    if (currentPairIndex < pairs.length - 1) {
      setCurrentPairIndex(prev => prev + 1);
    } else {
      setRoundComplete(true);
      updatePlayerScore(gameCode, userId, score);
      submitToGame(gameCode, { type: `round${currentRound}-complete`, playerId: userId, score, correct: correctCount, total: pairs.length });
    }
  };
  
  const getResult = (choice) => {
    if (!showResult || selectedChoice !== choice) return null;
    if (isRound1) {
      const realIsLeft = !currentPair.swapped;
      return ((choice === 'left' && realIsLeft) || (choice === 'right' && !realIsLeft)) ? 'correct' : 'wrong';
    }
    const originalIsLeft = !currentPair.swapped;
    return ((choice === 'left' && originalIsLeft) || (choice === 'right' && !originalIsLeft)) ? 'correct' : 'wrong';
  };
  
  const isCorrectAnswer = () => {
    if (!selectedChoice || !currentPair) return false;
    if (isRound1) {
      const realIsLeft = !currentPair.swapped;
      return (selectedChoice === 'left' && realIsLeft) || (selectedChoice === 'right' && !realIsLeft);
    }
    const originalIsLeft = !currentPair.swapped;
    return (selectedChoice === 'left' && originalIsLeft) || (selectedChoice === 'right' && !originalIsLeft);
  };
  
  const handleQuizAnswer = (answer) => {
    setQuizAnswer(answer);
    setShowQuizResult(true);
    if (answer === quizQuestions[currentQuizIndex].correct) {
      setScore(prev => prev + POINTS.quiz);
    }
  };
  
  const handleQuizNext = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setQuizAnswer(null);
      setShowQuizResult(false);
    } else {
      updatePlayerScore(gameCode, userId, score);
    }
  };
  
  const handleWerewolfVote = (playerId) => {
    if (werewolfVote) return;
    setWerewolfVote(playerId);
    submitVote(gameCode, userId, playerId);
    if (playerId === impostorPlayerId) {
      setScore(prev => prev + POINTS.werewolfDetective);
      updatePlayerScore(gameCode, userId, score + POINTS.werewolfDetective);
    }
  };
  
  // ============================================
  // RENDER PHASES
  // ============================================
  
  const renderLobby = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <FloatingParticles count={20} />
      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="text-5xl font-black text-white mb-2">SPOT THE</h1>
        <h2 className="text-4xl font-black text-red-500 mb-6">FAKE</h2>
        
        <div className="bg-slate-800 rounded-2xl p-8 mb-8 border border-slate-700">
          <div className="font-mono text-4xl font-black text-cyan-400 tracking-widest mb-2">{gameCode}</div>
          <p className="text-slate-500 text-sm">Share this code</p>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
          <h3 className="text-white font-bold mb-3">🎮 Game Rounds</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-cyan-500/20 text-cyan-400 p-2 rounded">1. Real vs AI</div>
            <div className="bg-purple-500/20 text-purple-400 p-2 rounded">2. Spot the Edit</div>
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded">3. Ethics</div>
            <div className="bg-red-500/20 text-red-400 p-2 rounded">4. Legal</div>
            <div className="bg-pink-500/20 text-pink-400 p-2 rounded col-span-2">5. 🕵️ Werewolf Finale</div>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-slate-500 mb-3">Players: {Object.keys(room?.players || {}).length}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.values(room?.players || {}).map(p => (
              <span key={p.id} className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm">{p.name}</span>
            ))}
          </div>
        </div>
        
        {isHost && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <label className="block text-slate-400 text-sm mb-2">Timer per image</label>
              <div className="flex gap-2 justify-center">
                {[15, 20, 30, 45, 60].map(t => (
                  <button key={t} onClick={() => setTimerSetting(t)}
                    className={`px-4 py-2 rounded-lg font-bold ${timerSetting === t ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{t}s</button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => updateGamePhase(gameCode, 'intro', { timerSeconds: timerSetting })} className="bg-cyan-600 text-white px-8 py-3 font-bold rounded-xl">Start Game</Button>
              <Button onClick={onOpenDashboard} className="bg-slate-700 text-white px-6 py-3 rounded-xl">Dashboard</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderIntro = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <FloatingParticles />
      <div className="max-w-3xl w-full relative z-10 space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-4xl font-black text-white mb-2">THE AGE OF AI IMAGES</h1>
        </div>
        <ByteHost message={<div><p className="mb-2">Welcome! I'm BYTE. Today we train your eyes to spot AI-generated images.</p><p className="text-amber-400 font-medium">This is a critical skill in today's world!</p></div>} mood="teaching" />
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold text-lg mb-4">📊 Did you know?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {educationalContent.introduction.keyStats.map((stat, i) => (
              <div key={i} className="bg-slate-900/50 rounded-xl p-4"><p className="text-cyan-400 text-sm">{stat}</p></div>
            ))}
          </div>
        </div>
        {isHost && (
          <div className="text-center">
            <Button onClick={() => updateGamePhase(gameCode, 'round1-play', { timerSeconds: timerSetting })} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-12 py-4 text-xl font-bold rounded-xl">Begin Round 1 →</Button>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderRoundPlay = () => {
    if (roundComplete) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
          <FloatingParticles count={30} />
          <div className="max-w-2xl w-full text-center relative z-10 space-y-6">
            <div className="text-7xl mb-4">🎉</div>
            <h1 className="text-4xl font-black text-white">ROUND {currentRound} COMPLETE!</h1>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-amber-500/20 rounded-xl p-4"><div className="text-3xl font-black text-amber-400">{score}</div><div className="text-slate-400 text-sm">Points</div></div>
                <div className="bg-emerald-500/20 rounded-xl p-4"><div className="text-3xl font-black text-emerald-400">{correctCount}/{pairs.length}</div><div className="text-slate-400 text-sm">Correct</div></div>
                <div className="bg-purple-500/20 rounded-xl p-4"><div className="text-3xl font-black text-purple-400">{pairs.length > 0 ? Math.round((correctCount/pairs.length)*100) : 0}%</div><div className="text-slate-400 text-sm">Accuracy</div></div>
              </div>
              <ByteHost message={correctCount >= pairs.length * 0.8 ? "Excellent! Sharp eye!" : "Good job! Keep practicing!"} mood={correctCount >= pairs.length * 0.6 ? 'proud' : 'teaching'} />
            </div>
            {isHost && (
              <Button onClick={() => updateGamePhase(gameCode, isRound1 ? 'round1-debrief' : 'round2-debrief')} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-12 py-4 text-xl font-bold rounded-xl">Continue →</Button>
            )}
          </div>
        </div>
      );
    }
    
    if (!currentPair) {
      return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-white text-xl">Loading images...</div></div>;
    }
    
    // Determine images based on round type
    let leftImage, rightImage;
    if (isRound1) {
      if (currentPair.swapped) {
        leftImage = currentPair.aiDemo?.url || currentPair.ai?.url;
        rightImage = currentPair.real.url;
      } else {
        leftImage = currentPair.real.url;
        rightImage = currentPair.aiDemo?.url || currentPair.ai?.url;
      }
    } else {
      if (currentPair.swapped) {
        leftImage = currentPair.edited?.url;
        rightImage = currentPair.original?.url;
      } else {
        leftImage = currentPair.original?.url;
        rightImage = currentPair.edited?.url;
      }
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
        <FloatingParticles count={10} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-black text-white">ROUND {currentRound}: {isRound1 ? 'REAL VS AI' : 'SPOT THE EDIT'}</h1>
            <ScoreDisplay score={score} streak={streak} />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <BigTimer seconds={timeLeft} totalSeconds={totalTime} />
            <RoundProgress current={currentPairIndex + 1} total={pairs.length} round={`Round ${currentRound}`} />
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">🤔 {isRound1 ? 'Which is REAL?' : 'Which is ORIGINAL?'}</h2>
          </div>
          
          {!showTip ? (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <ImageChoice image={leftImage} label="Image A" onClick={() => handleChoice('left')} selected={selectedChoice === 'left'} disabled={showResult || showTip} result={getResult('left')} />
              <ImageChoice image={rightImage} label="Image B" onClick={() => handleChoice('right')} selected={selectedChoice === 'right'} disabled={showResult || showTip} result={getResult('right')} />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <LearningTipCard tip={currentPair.tip} isCorrect={isCorrectAnswer()} onContinue={handleContinue} />
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderDebrief = () => {
    const prompts = getDiscussionPrompts(isRound1 ? 'round1' : 'round2');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-y-auto">
        <FloatingParticles count={15} />
        <div className="max-w-3xl mx-auto py-8 relative z-10 space-y-6">
          <div className="text-center"><h1 className="text-3xl font-black text-white mb-2">💬 DISCUSSION</h1></div>
          <ByteHost message="Take a few minutes to discuss. There are no wrong answers!" mood="teaching" />
          <div className="space-y-4">
            {prompts.map((q, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">{i + 1}</div><p className="text-white text-lg">{q}</p></div>
              </div>
            ))}
          </div>
          {isHost && (
            <div className="text-center">
              <Button onClick={() => updateGamePhase(gameCode, phase === 'round1-debrief' ? 'round2-intro' : 'ethics')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 text-xl font-bold rounded-xl">{phase === 'round1-debrief' ? 'Start Round 2 →' : 'Ethics Discussion →'}</Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderRound2Intro = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <FloatingParticles />
      <div className="max-w-3xl w-full relative z-10 space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">✂️</div>
          <h1 className="text-4xl font-black text-white mb-2">ROUND 2: SPOT THE EDIT</h1>
          <p className="text-slate-400 text-lg">Can you find the manipulated photo?</p>
        </div>
        <ByteHost message={<div><p className="mb-2">Nice work on Round 1! Now things get trickier.</p><p>Both images start from the same real photo, but <strong className="text-red-400">ONE has been edited</strong>.</p><p className="mt-2 text-amber-400">Pick the ORIGINAL, unedited version!</p></div>} mood="teaching" />
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold text-lg mb-4">Types of Edits:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[{ icon: '✨', title: 'Face Smoothing', desc: 'Skin too perfect' }, { icon: '🌊', title: 'Body Reshaping', desc: 'Warped backgrounds' }, { icon: '🌈', title: 'Color Changes', desc: 'Over-saturated' }].map((e, i) => (
              <div key={i} className="text-center bg-slate-900/50 rounded-xl p-4"><div className="text-3xl mb-2">{e.icon}</div><div className="text-white font-bold text-sm">{e.title}</div><div className="text-slate-400 text-xs">{e.desc}</div></div>
            ))}
          </div>
        </div>
        {isHost && (
          <div className="text-center">
            <Button onClick={() => updateGamePhase(gameCode, 'round2-play', { timerSeconds: timerSetting })} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 text-xl font-bold rounded-xl">Start Round 2 →</Button>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderEthics = () => {
    const ethicsContent = educationalContent.ethics;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-y-auto">
        <FloatingParticles count={15} />
        <div className="max-w-3xl mx-auto py-8 relative z-10 space-y-6">
          <div className="text-center"><div className="text-6xl mb-4">⚖️</div><h1 className="text-3xl font-black text-white mb-2">{ethicsContent.title}</h1></div>
          <ByteHost message="AI images aren't inherently good or bad - it's about how they're used." mood="teaching" />
          <div className="space-y-6">
            {ethicsContent.questions.map((q, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">{i + 1}</div><h3 className="text-xl font-bold text-white">{q.question}</h3></div>
                {q.scenarios && <div className="space-y-2 mt-4">{q.scenarios.map((s, j) => (
                  <div key={j} className={`p-3 rounded-lg text-sm ${s.startsWith('✅') ? 'bg-emerald-500/20 text-emerald-300' : s.startsWith('⚠️') ? 'bg-amber-500/20 text-amber-300' : s.startsWith('❌') ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'}`}>{s}</div>
                ))}</div>}
              </div>
            ))}
          </div>
          {isHost && (<div className="text-center"><Button onClick={() => updateGamePhase(gameCode, 'legal')} className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-12 py-4 text-xl font-bold rounded-xl">Legal Implications →</Button></div>)}
        </div>
      </div>
    );
  };
  
  const renderLegal = () => {
    const legalContent = educationalContent.legal;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-y-auto">
        <FloatingParticles count={15} />
        <div className="max-w-3xl mx-auto py-8 relative z-10 space-y-6">
          <div className="text-center"><div className="text-6xl mb-4">📜</div><h1 className="text-3xl font-black text-white mb-2">{legalContent.title}</h1></div>
          <ByteHost message="Laws are rapidly evolving. Here's what you need to know." mood="warning" />
          <div className="space-y-4">
            {legalContent.categories.map((cat, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{cat.area}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${cat.status.includes('Illegal') ? 'bg-red-500/30 text-red-300' : cat.status.includes('Restricted') ? 'bg-amber-500/30 text-amber-300' : 'bg-blue-500/30 text-blue-300'}`}>{cat.status}</span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{cat.details}</p>
                <p className="text-red-400 text-xs">⚖️ {cat.penalties}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-500/20 rounded-2xl p-6 border border-amber-500/30">
            <h3 className="text-amber-400 font-bold mb-3">📋 Pending Legislation</h3>
            <ul className="space-y-2">{legalContent.pendingLegislation.map((law, i) => <li key={i} className="text-slate-300 text-sm flex items-center gap-2"><span className="text-amber-400">→</span> {law}</li>)}</ul>
          </div>
          {isHost && (<div className="text-center"><Button onClick={() => updateGamePhase(gameCode, 'werewolf-intro')} className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-12 py-4 text-xl font-bold rounded-xl">🕵️ Werewolf Finale →</Button></div>)}
        </div>
      </div>
    );
  };
  
  const renderWerewolfIntro = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <FloatingParticles count={30} />
      <div className="max-w-3xl w-full text-center relative z-10 space-y-6">
        <div className="text-8xl mb-4">🕵️</div>
        <h1 className="text-4xl font-black text-white mb-2">THE WEREWOLF FINALE</h1>
        <h2 className="text-2xl text-purple-400">Find the AI Impostor!</h2>
        <ByteHost message={<div><p className="mb-2">Each player gets an image. <strong className="text-red-400">ONE has an AI image</strong> - they're the impostor!</p></div>} mood="detective" />
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-white font-bold mb-4">🎮 How It Works</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-slate-300"><span className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">1</span> Each player gets a secret image</div>
            <div className="flex items-center gap-3 text-slate-300"><span className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">2</span> One player gets an AI image!</div>
            <div className="flex items-center gap-3 text-slate-300"><span className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">3</span> Everyone shows their image and discusses</div>
            <div className="flex items-center gap-3 text-slate-300"><span className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">4</span> Vote on who has the AI image!</div>
          </div>
        </div>
        <div className="bg-amber-500/20 rounded-2xl p-6 border border-amber-500/30">
          <h3 className="text-amber-400 font-bold mb-2">🏆 Scoring</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-slate-300"><span className="text-amber-400 font-bold">+{POINTS.werewolfDetective}</span> correctly identify impostor</div>
            <div className="text-slate-300"><span className="text-amber-400 font-bold">+{POINTS.werewolfImpostor}</span> impostor escapes detection</div>
          </div>
        </div>
        {isHost && (<div className="text-center"><Button onClick={() => updateGamePhase(gameCode, 'werewolf-assign')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 text-xl font-bold rounded-xl">🎭 Assign Roles →</Button></div>)}
      </div>
    </div>
  );
  
  const renderWerewolfAssign = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <FloatingParticles count={20} />
      <div className="max-w-xl w-full relative z-10">
        <div className={`rounded-3xl p-8 text-center ${isImpostor ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-emerald-600 to-teal-600'}`}>
          <div className="text-8xl mb-4">{isImpostor ? '🤖' : '👤'}</div>
          <h2 className="text-3xl font-black text-white mb-2">{isImpostor ? 'THE IMPOSTOR!' : 'HUMAN'}</h2>
          <p className="text-white/80 mb-4">{isImpostor ? `You have the AI image! If no one guesses you, +${POINTS.werewolfImpostor} points!` : "You have a real photo. Find the impostor!"}</p>
          {assignedImage && (
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/60 text-sm mb-2">Your image:</p>
              <img src={assignedImage} alt="Your image" className="w-40 h-40 object-cover rounded-lg mx-auto" />
            </div>
          )}
        </div>
        <div className="mt-6 text-center">
          <p className="text-purple-400 text-sm mb-4">{isImpostor ? "🤫 Don't let anyone know!" : "👀 Study images carefully!"}</p>
          {isHost && (<Button onClick={() => updateGamePhase(gameCode, 'werewolf-reveal')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 font-bold rounded-xl">👁️ Reveal All Images →</Button>)}
        </div>
      </div>
    </div>
  );
  
  const renderWerewolfReveal = () => {
    const players = Object.values(room?.players || {});
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <FloatingParticles count={20} />
        <div className="max-w-4xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8"><h1 className="text-3xl font-black text-white mb-2">👁️ REVEAL TIME</h1><p className="text-purple-400">Show images! Discuss!</p></div>
          <ByteHost message="Look carefully! AI struggles with hands, text, and hair boundaries." mood="detective" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
            {players.map(p => (
              <div key={p.id} className="bg-slate-800 rounded-xl p-4 text-center border border-purple-500/30">
                <div className="text-white font-bold mb-2">{p.name}</div>
                <div className="text-slate-500 text-sm">Showing image...</div>
              </div>
            ))}
          </div>
          {isHost && (<div className="text-center"><Button onClick={() => updateGamePhase(gameCode, 'werewolf-vote')} className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-12 py-4 font-bold rounded-xl">🗳️ Begin Voting (60s) →</Button></div>)}
        </div>
      </div>
    );
  };
  
  const renderWerewolfVote = () => {
    const players = Object.values(room?.players || {}).filter(p => p.id !== userId);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
        <FloatingParticles count={20} />
        <div className="max-w-2xl mx-auto py-8 relative z-10">
          <div className="text-center mb-6"><h1 className="text-3xl font-black text-white mb-2">🗳️ VOTE NOW!</h1></div>
          <BigTimer seconds={werewolfTimer} totalSeconds={60} label="🕐 VOTING ENDS IN" />
          <div className="mt-6">
            <h3 className="text-white font-bold mb-4 text-center">Who has the AI image?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {players.map(p => (
                <button key={p.id} onClick={() => handleWerewolfVote(p.id)} disabled={!!werewolfVote}
                  className={`p-4 rounded-xl transition-all min-h-[64px] ${werewolfVote === p.id ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'} ${werewolfVote ? 'opacity-50' : ''}`}>
                  <div className="text-2xl mb-1">👤</div>
                  <div className="font-bold text-sm sm:text-base">{p.name}</div>
                </button>
              ))}
            </div>
          </div>
          {werewolfVote && <div className="mt-6 text-center"><p className="text-emerald-400">✓ Vote submitted!</p></div>}
          {isHost && (<div className="text-center mt-8"><Button onClick={() => updateGamePhase(gameCode, 'werewolf-results')} className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 font-bold rounded-xl">Reveal Results →</Button></div>)}
        </div>
      </div>
    );
  };
  
  const renderWerewolfResults = () => {
    const impostor = Object.values(room?.players || {}).find(p => p.id === impostorPlayerId);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <FloatingParticles count={30} />
        <div className="max-w-2xl w-full text-center relative z-10 space-y-6">
          <div className="text-8xl mb-4">🎭</div>
          <h1 className="text-4xl font-black text-white">THE IMPOSTOR WAS...</h1>
          <div className="bg-red-500/20 rounded-3xl p-8 border border-red-500/30">
            <p className="text-6xl mb-4">🤖</p>
            <p className="text-2xl font-bold text-red-400">{impostor?.name || 'Unknown'}</p>
            <p className="text-slate-400 mt-2">They had the AI-generated image!</p>
          </div>
          <ByteHost message="Great detective work! These skills apply to everything you see online." mood="proud" />
          {isHost && (<Button onClick={() => updateGamePhase(gameCode, 'quiz')} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-12 py-4 font-bold rounded-xl">📝 Final Quiz →</Button>)}
        </div>
      </div>
    );
  };
  
  const renderQuiz = () => {
    if (quizQuestions.length === 0) return null;
    const currentQ = quizQuestions[currentQuizIndex];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <FloatingParticles count={15} />
        <div className="max-w-2xl mx-auto py-8 relative z-10 space-y-6">
          <div className="text-center"><h1 className="text-3xl font-black text-white mb-2">📝 FINAL QUIZ</h1><p className="text-slate-400">Question {currentQuizIndex + 1}/{quizQuestions.length}</p></div>
          <RoundProgress current={currentQuizIndex + 1} total={quizQuestions.length} round="Quiz" />
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">{currentQ.question}</h3>
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => (
                <button key={i} onClick={() => !showQuizResult && handleQuizAnswer(i)} disabled={showQuizResult}
                  className={`w-full p-4 rounded-xl text-left transition-colors ${showQuizResult && i === currentQ.correct ? 'bg-emerald-500 text-white' : showQuizResult && quizAnswer === i ? 'bg-red-500 text-white' : quizAnswer === i ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {showQuizResult && (
            <div className={`rounded-xl p-4 ${quizAnswer === currentQ.correct ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <p className={`font-bold ${quizAnswer === currentQ.correct ? 'text-emerald-400' : 'text-red-400'}`}>{quizAnswer === currentQ.correct ? '✓ Correct!' : '✗ Incorrect'}</p>
              <p className="text-slate-300 text-sm mt-1">{currentQ.explanation}</p>
            </div>
          )}
          {showQuizResult && (<Button onClick={handleQuizNext} className="w-full bg-cyan-600 text-white py-3 rounded-xl font-bold">{currentQuizIndex < quizQuestions.length - 1 ? 'Next →' : 'See Results →'}</Button>)}
          {isHost && currentQuizIndex >= quizQuestions.length - 1 && showQuizResult && (<Button onClick={() => updateGamePhase(gameCode, 'results')} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl font-bold">🏆 Final Results</Button>)}
        </div>
      </div>
    );
  };
  
  const renderResults = () => {
    const players = Object.values(room?.players || {}).sort((a, b) => (b.score || 0) - (a.score || 0));
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-y-auto" ref={(el) => { if (el) playCelebration(); }}>
        <FloatingParticles count={40} />
        <div className="max-w-2xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8"><div className="text-7xl mb-4">🏆</div><h1 className="text-4xl font-black text-white mb-2">FINAL RESULTS</h1></div>
          <div className="space-y-3 mb-8">
            {players.map((p, i) => (
              <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl ${i === 0 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : i === 1 ? 'bg-slate-300 text-slate-800' : i === 2 ? 'bg-orange-200 text-orange-900' : 'bg-slate-800 text-white'}`}>
                <div className="flex items-center gap-3"><span className="text-2xl font-black">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`}</span><span className="font-bold">{p.name}</span></div>
                <span className="text-2xl font-black">{p.score || 0}</span>
              </div>
            ))}
          </div>
          <ByteHost message={<div><p className="mb-2">Congratulations! You've learned:</p><ul className="text-sm text-slate-300 space-y-1"><li>• How to detect AI images</li><li>• Ethical considerations</li><li>• Legal implications</li><li>• Media literacy</li></ul></div>} mood="proud" />
          <div className="mt-8">
            <ShareableResultCard playerName={room?.players?.find(p => p.id === userId)?.name} gameName="Spot the Fake" score={score} award={players[0]?.id === userId ? 'Truth Detective' : null} />
          </div>
          <div className="text-center mt-6"><Button onClick={onBack} className="bg-cyan-600 text-white px-8 py-3 font-bold rounded-xl">Back to Home</Button></div>
        </div>
      </div>
    );
  };
  
  // Main render
  const renderPhase = () => {
    switch (phase) {
      case 'lobby': return renderLobby();
      case 'intro': return renderIntro();
      case 'round1-play': return renderRoundPlay();
      case 'round1-debrief': return renderDebrief();
      case 'round2-intro': return renderRound2Intro();
      case 'round2-play': return renderRoundPlay();
      case 'round2-debrief': return renderDebrief();
      case 'ethics': return renderEthics();
      case 'legal': return renderLegal();
      case 'werewolf-intro': return renderWerewolfIntro();
      case 'werewolf-assign': return renderWerewolfAssign();
      case 'werewolf-reveal': return renderWerewolfReveal();
      case 'werewolf-vote': return renderWerewolfVote();
      case 'werewolf-results': return renderWerewolfResults();
      case 'quiz': return renderQuiz();
      case 'results': return renderResults();
      default: return renderLobby();
    }
  };
  
  return (
    <div className="relative">
      {renderPhase()}
      <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-700">Exit</button>
      {isHost && onOpenDashboard && (
        <button onClick={onOpenDashboard} className="fixed top-4 left-28 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium border border-purple-500/50 shadow-lg flex items-center gap-1.5">
          📊 Dashboard
        </button>
      )}
    </div>
  );
};

export default SpotTheFake;

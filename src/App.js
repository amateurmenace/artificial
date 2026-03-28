// ARTIFICIAL: Games for AI Literacy v5
// Main App Component with Tournament Mode

import React, { useState, useEffect, useRef } from 'react';
import { auth, signInAnon, createGameRoom, joinGameRoom, subscribeToRoom, updateGamePhase } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setApiKey, getApiKey, hasApiKey, setProvider, getProvider, AI_PROVIDERS, getProviderConfig } from './ai-services';
import { Logo, Button, Input, Modal, Alert } from './components';
import { FacilitatorDashboard, ProjectorDisplay } from './FacilitatorDashboard';
import EnhancedHomepage, { InfoPage } from './EnhancedHomepage';
import SpotTheFake from './SpotTheFake';
import MemeMachine from './MemeMachine';
import VibeCodeChallenge from './VibeCodeChallenge';
import { APISettingsModal } from './APISettingsModal';


// ============================================
// HUMAN AWARD CERTIFICATE COMPONENT
// ============================================

const HumanAwardCertificate = ({ playerName, totalScore, onClose, onDownload }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(0.5, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Border
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    
    // Inner border
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, width - 70, height - 70);
    
    // Decorative corners
    const cornerSize = 30;
    ctx.fillStyle = '#22d3ee';
    [[40, 40], [width - 40, 40], [40, height - 40], [width - 40, height - 40]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', width / 2, 120);
    
    // Award name
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 72px Impact, sans-serif';
    ctx.fillText('THE HUMAN AWARD', width / 2, 200);
    
    // Trophy emoji (as text)
    ctx.font = '80px Arial';
    ctx.fillText('🏆', width / 2, 300);
    
    // This certifies
    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px Georgia, serif';
    ctx.fillText('This certifies that', width / 2, 360);
    
    // Player name
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 56px Georgia, serif';
    ctx.fillText(playerName, width / 2, 420);
    
    // Colon and PERSON
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 36px Impact, sans-serif';
    ctx.fillText(': PERSON', width / 2, 470);
    
    // Achievement text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Georgia, serif';
    ctx.fillText('Has demonstrated exceptional AI literacy skills', width / 2, 510);
    ctx.fillText(`and earned ${totalScore} points across all challenges`, width / 2, 540);
    
    // Date
    ctx.fillStyle = '#64748b';
    ctx.font = '16px Georgia, serif';
    ctx.fillText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), width / 2, 575);
  }, [playerName, totalScore]);
  
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${playerName}-Human-Award.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    if (onDownload) onDownload();
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">🏆 THE HUMAN AWARD</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="flex justify-center mb-6">
          <canvas ref={canvasRef} className="rounded-lg shadow-2xl max-w-full" style={{ maxHeight: '60vh' }} />
        </div>
        
        <div className="flex gap-4 justify-center">
          <button onClick={handleDownload} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-3 rounded-xl font-bold">
            📥 Download Certificate
          </button>
          <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-bold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TOURNAMENT RESULTS COMPONENT
// ============================================

const TournamentResults = ({ room, gameCode, onClose, onNextGame, currentGameIndex, isHost }) => {
  const [showCertificate, setShowCertificate] = useState(null);
  const players = Object.values(room?.players || {}).sort((a, b) => (b.tournamentScore || 0) - (a.tournamentScore || 0));
  const games = ['spotTheFake', 'memeMachine', 'vibeCode'];
  const gameNames = { spotTheFake: 'Spot the Fake', memeMachine: 'Meme Machine', vibeCode: 'Vibe Code Challenge' };
  const isComplete = currentGameIndex >= 2;
  const winner = players[0];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">{isComplete ? '🏆' : '📊'}</div>
          <h1 className="text-4xl font-black text-white mb-2">
            {isComplete ? 'TOURNAMENT COMPLETE!' : 'TOURNAMENT STANDINGS'}
          </h1>
          <p className="text-cyan-400">
            {isComplete ? 'The ultimate AI literacy champion has been crowned!' : `Game ${currentGameIndex + 1} of 3 complete`}
          </p>
        </div>
        
        {/* Progress */}
        <div className="flex justify-center gap-4 mb-8">
          {games.map((g, i) => (
            <div key={g} className={`px-4 py-2 rounded-xl text-sm font-bold ${
              i < currentGameIndex ? 'bg-emerald-500 text-white' :
              i === currentGameIndex ? 'bg-cyan-500 text-white' :
              'bg-slate-700 text-slate-400'
            }`}>
              {i < currentGameIndex ? '✓' : i + 1}. {gameNames[g]}
            </div>
          ))}
        </div>
        
        {/* Leaderboard */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🏅 Tournament Leaderboard</h2>
          <div className="space-y-3">
            {players.map((player, i) => (
              <div key={player.id} className={`flex items-center justify-between p-4 rounded-xl ${
                i === 0 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
                i === 1 ? 'bg-slate-300 text-slate-800' :
                i === 2 ? 'bg-orange-200 text-orange-900' :
                'bg-slate-700 text-white'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`}</span>
                  <span className="font-bold text-lg">{player.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black">{player.tournamentScore || 0}</div>
                  <div className="text-xs opacity-80">total points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Winner & Human Award */}
        {isComplete && winner && (
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-8 border border-amber-500/30 mb-8 text-center">
            <div className="text-6xl mb-4">👑</div>
            <h2 className="text-3xl font-black text-amber-400 mb-2">THE HUMAN AWARD WINNER</h2>
            <p className="text-5xl font-black text-white mb-4">{winner.name}</p>
            <p className="text-slate-300 mb-6">{winner.name}: PERSON</p>
            <button 
              onClick={() => setShowCertificate(winner)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-8 py-4 rounded-xl font-bold text-lg"
            >
              🏆 Generate Certificate
            </button>
          </div>
        )}
        
        {/* Actions */}
        <div className="text-center space-y-4">
          {!isComplete && isHost && (
            <button 
              onClick={onNextGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-12 py-4 rounded-xl font-bold text-xl"
            >
              Start Next Game: {gameNames[games[currentGameIndex + 1]]} →
            </button>
          )}
          <button 
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-bold"
          >
            {isComplete ? 'Back to Home' : 'View Current Game'}
          </button>
        </div>
      </div>
      
      {showCertificate && (
        <HumanAwardCertificate 
          playerName={showCertificate.name} 
          totalScore={showCertificate.tournamentScore || 0}
          onClose={() => setShowCertificate(null)}
        />
      )}
    </div>
  );
};

function App() {
  // Auth & user state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation state
  const [view, setView] = useState('home');
  const [currentGame, setCurrentGame] = useState(null);
  const [gameCode, setGameCode] = useState('');
  const [room, setRoom] = useState(null);
  
  // Tournament state
  const [isTournament, setIsTournament] = useState(false);
  const [tournamentGameIndex, setTournamentGameIndex] = useState(0);
  const [showTournamentResults, setShowTournamentResults] = useState(false);
  const TOURNAMENT_GAMES = ['spotTheFake', 'memeMachine', 'vibeCode'];
  
  // UI state
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [showGameInfo, setShowGameInfo] = useState(null);
  const [error, setError] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showProjector, setShowProjector] = useState(false);
  
  // Initialize auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        try {
          await signInAnon();
        } catch (err) {
          console.error('Auth error:', err);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // Subscribe to room updates
  useEffect(() => {
    if (!gameCode) return;
    const unsubscribe = subscribeToRoom(gameCode, (roomData) => {
      setRoom(roomData);
    });
    return () => unsubscribe();
  }, [gameCode]);
  
  // Check for saved API key and provider
  useEffect(() => {
    const savedProvider = getProvider();
    setSelectedProvider(savedProvider);
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKeyInput(savedKey);
    }
  }, []);
  
  // Handle URL routing for dashboard and info pages
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    if (path === '/dashboard' || path.startsWith('/dashboard')) {
      const code = params.get('code');
      if (code) {
        setGameCode(code);
        setShowDashboard(true);
      }
    }
    
    // Handle info page routes
    if (path.startsWith('/info/')) {
      setCurrentInfoPage(path.replace('/info/', ''));
    }
  }, []);
  
  // Info pages state
  const [currentInfoPage, setCurrentInfoPage] = useState(null);
  
  // Game definitions
  const games = [
    {
      id: 'spotTheFake',
      name: 'Spot the Fake',
      icon: '🔍',
      tagline: 'Can you tell real from AI?',
      description: 'Learn to identify AI-generated images. Includes werewolf-style finale where one player has the AI image!',
      duration: '30-45 min',
      players: '2-20',
      features: ['Real vs AI detection', 'Ethics discussion', 'Legal landscape', 'Werewolf finale'],
      color: '#48a89a'
    },
    {
      id: 'memeMachine',
      name: 'Meme Machine',
      icon: '🚀',
      tagline: 'Create viral advocacy content',
      description: 'Build memes for community causes. Watch them go viral with reactions, comments, and voting!',
      duration: '45-60 min',
      players: '3-20',
      features: ['AI image creation', 'Virality simulation', 'Emoji reactions', 'Most Viral & Most Dank awards'],
      color: '#d4a84b'
    },
    {
      id: 'vibeCode',
      name: 'Vibe Code Challenge',
      icon: '💻',
      tagline: 'Build apps with AI, defeat the villains!',
      description: 'Battle CHAOS, COMPLEXITY, and BUGS to create real apps. Get voted on your creations!',
      duration: '45-60 min',
      players: '2-15',
      features: ['Villain battles', 'AI code generation', 'App showcase', 'Best Vibe Coder award'],
      color: '#6b8cce'
    },
    {
      id: 'tournament',
      name: 'TOURNAMENT MODE',
      icon: '🏆',
      tagline: 'Play all 3 games, win the Human Award!',
      description: 'The ultimate AI literacy challenge! Play all three games back-to-back. Top scorer wins the Human Award certificate.',
      duration: '2-3 hours',
      players: '3-15',
      features: ['All 3 games', 'Persistent leaderboard', 'Human Award certificate', 'Ultimate champion'],
      color: '#ec4899',
      isTournament: true
    }
  ];
  
  // Host a game (or tournament)
  const handleHost = async (gameType) => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    try {
      const actualGameType = gameType === 'tournament' ? 'spotTheFake' : gameType;
      const code = await createGameRoom(actualGameType, playerName);
      setGameCode(code);
      setCurrentGame(actualGameType);
      setIsTournament(gameType === 'tournament');
      setTournamentGameIndex(0);
      setView('game');
      setShowGameInfo(null);
    } catch (err) {
      setError('Failed to create game: ' + err.message);
    }
  };
  
  // Handle tournament next game
  const handleNextTournamentGame = async () => {
    const nextIndex = tournamentGameIndex + 1;
    if (nextIndex < TOURNAMENT_GAMES.length) {
      setTournamentGameIndex(nextIndex);
      setCurrentGame(TOURNAMENT_GAMES[nextIndex]);
      setShowTournamentResults(false);
      await updateGamePhase(gameCode, 'lobby');
    }
  };

  
  // Join a game
  const handleJoin = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!joinCode.trim() || joinCode.length !== 6) {
      setError('Please enter a valid 6-character game code');
      return;
    }
    setError('');
    try {
      const roomData = await joinGameRoom(joinCode.toUpperCase(), playerName);
      setGameCode(joinCode.toUpperCase());
      setCurrentGame(roomData.gameType);
      setView('game');
    } catch (err) {
      setError('Failed to join: ' + err.message);
    }
  };
  
  // Save API key
  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiModal(false);
    }
  };
  
  // Back to home
  const handleBackToHome = () => {
    setView('home');
    setCurrentGame(null);
    setGameCode('');
    setRoom(null);
    setShowDashboard(false);
  };
  
  // Check if current user is host
  const isHost = room?.hostId === user?.uid;
  
  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-[#6b7c74]">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Facilitator Dashboard
  if (showDashboard && room && isHost) {
    return (
      <FacilitatorDashboard 
        gameCode={gameCode}
        room={room}
        userId={user?.uid}
        onClose={() => setShowDashboard(false)}
      />
    );
  }
  
  // Projector Display
  if (showProjector && room) {
    return (
      <ProjectorDisplay 
        room={room}
        displayMode={room.displayMode}
      />
    );
  }
  
  // Tournament Results
  if (showTournamentResults && isTournament && room) {
    return (
      <TournamentResults
        room={room}
        gameCode={gameCode}
        currentGameIndex={tournamentGameIndex}
        isHost={isHost}
        onClose={() => {
          if (tournamentGameIndex >= 2) {
            handleBackToHome();
          } else {
            setShowTournamentResults(false);
          }
        }}
        onNextGame={handleNextTournamentGame}
      />
    );
  }
  
  // Game views
  if (view === 'game' && currentGame && gameCode) {
    const gameProps = {
      gameCode,
      room,
      userId: user?.uid,
      isHost,
      onBack: handleBackToHome,
      onOpenDashboard: () => setShowDashboard(true),
      isTournament,
      onGameComplete: () => {
        if (isTournament) {
          setShowTournamentResults(true);
        }
      },
    };
    
    switch (currentGame) {
      case 'spotTheFake':
        return <SpotTheFake {...gameProps} />;
      case 'memeMachine':
        return <MemeMachine {...gameProps} />;
      case 'vibeCode':
        return <VibeCodeChallenge {...gameProps} />;
      default:
        return <div>Unknown game</div>;
    }
  }
  
  // Info page view
  if (currentInfoPage) {
    return (
      <InfoPage 
        pageId={currentInfoPage}
        onClose={() => setCurrentInfoPage(null)}
      />
    );
  }
  
  // Home view
  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-[#e2e0dc] px-4 py-3 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <a href="#about" className="text-sm text-[#6b7c74] hover:text-[#3d5a4c] hidden md:block">About</a>
            <a href="#faq" className="text-sm text-[#6b7c74] hover:text-[#3d5a4c] hidden md:block">FAQ</a>
            <button 
              onClick={() => setShowApiModal(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                hasApiKey() 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {hasApiKey() ? `✓ ${AI_PROVIDERS[getProvider()]?.name}` : '⚠️ Set AI Provider'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Add padding for fixed header */}
      <div className="pt-16">
        <EnhancedHomepage 
          onHost={() => setView('host')}
          onJoin={() => setView('join')}
          onOpenSettings={() => setShowSettings(true)}
          onSelectGame={(gameId) => {
            setShowGameInfo(games.find(g => g.id === gameId));
          }}
          onShowInfoPage={(pageId) => setCurrentInfoPage(pageId)}
          games={games}
        />
      </div>
      
      {/* Footer */}
      <footer className="bg-[#3d5a4c] text-white/70 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <Logo />
              <p className="mt-4 text-sm text-white/50">
                Educational games for AI literacy.
                Built with ❤️ for communities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                <li><button onClick={() => setShowApiModal(true)} className="hover:text-white">API Settings</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">For Facilitators</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setShowProjector(true)} className="hover:text-white">📺 Projector Mode</button></li>
                <li><span className="text-white/50">Dashboard available in-game</span></li>
              </ul>
            </div>
          </div>
          
          {/* Credits Section */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-base text-white font-medium">
                  A community AI app from <a href="https://brooklineinteractive.org" target="_blank" rel="noopener noreferrer" className="text-[#48a89a] hover:text-[#5bc4b4] underline decoration-2 underline-offset-4 transition-colors">Brookline Interactive Group</a> in partnership with <a href="https://weirdmachine.org" target="_blank" rel="noopener noreferrer" className="text-[#48a89a] hover:text-[#5bc4b4] underline decoration-2 underline-offset-4 transition-colors">Neighborhood AI</a>.
                </p>
                <p className="text-base text-white mt-2 font-medium">
                  Game Designed and Developed by{' '}
                  <a 
                    href="https://weirdmachine.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#48a89a] hover:text-[#5bc4b4] font-bold underline decoration-2 underline-offset-4 transition-colors"
                  >
                    Stephen Walter
                  </a>
                  {' '}+ AI in 2026.
                </p>
              </div>
              
              {/* Logo Links */}
              <div className="flex items-center gap-4">
                <a href="https://weirdmachine.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <img src="/weirdmachine.png" alt="Weird Machine" className="h-10 bg-white rounded p-1" />
                </a>
                <a href="https://brooklineinteractive.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <img src="/big-logo.png" alt="Brookline Interactive Group" className="h-10" />
                </a>
                <a href="https://github.com/amateurmenace/artificial" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white" title="View on GitHub">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* License */}
            <div className="mt-4 text-center text-xs text-white/40 flex items-center justify-center gap-2">
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white/60">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
                </svg>
                CC BY-SA 4.0
              </a>
              <span>•</span>
              <span>Free for educational use</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Host Modal */}
      <Modal 
        isOpen={view === 'host'} 
        onClose={() => setView('home')}
        title="Host a Game"
        size="md"
      >
        <div className="space-y-4">
          <Input 
            label="Your Name"
            placeholder="Enter your name..."
            value={playerName}
            onChange={setPlayerName}
          />
          
          {error && <Alert type="error">{error}</Alert>}
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-[#3d5a4c]">Select a game:</p>
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => handleHost(game.id)}
                disabled={!playerName}
                className="w-full p-4 border-2 border-[#e2e0dc] rounded-xl text-left hover:border-[#48a89a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4"
              >
                <span className="text-3xl">{game.icon}</span>
                <div>
                  <div className="font-semibold text-[#3d5a4c]">{game.name}</div>
                  <div className="text-sm text-[#6b7c74]">{game.tagline}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>
      
      {/* Join Modal */}
      <Modal 
        isOpen={view === 'join'} 
        onClose={() => setView('home')}
        title="Join a Game"
        size="sm"
      >
        <div className="space-y-4">
          <Input 
            label="Your Name"
            placeholder="Enter your name..."
            value={playerName}
            onChange={setPlayerName}
          />
          <Input 
            label="Game Code"
            placeholder="Enter 6-character code..."
            value={joinCode}
            onChange={(v) => setJoinCode(v.toUpperCase())}
          />
          
          {error && <Alert type="error">{error}</Alert>}
          
          <Button onClick={handleJoin} disabled={!playerName || !joinCode} className="w-full">
            Join Game
          </Button>
        </div>
      </Modal>
      
      {/* Game Info Modal */}
      <Modal 
        isOpen={!!showGameInfo} 
        onClose={() => setShowGameInfo(null)}
        title={showGameInfo?.name}
        size="md"
      >
        {showGameInfo && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{showGameInfo.icon}</div>
              <div>
                <p className="text-[#48a89a] font-medium">{showGameInfo.tagline}</p>
                <div className="flex gap-4 text-sm text-[#6b7c74] mt-1">
                  <span>⏱ {showGameInfo.duration}</span>
                  <span>👥 {showGameInfo.players} players</span>
                </div>
              </div>
            </div>
            
            <p className="text-[#6b7c74]">{showGameInfo.description}</p>
            
            <div className="bg-[#f5f3ef] rounded-xl p-4">
              <h4 className="font-semibold text-[#3d5a4c] mb-2">Features:</h4>
              <ul className="space-y-1">
                {showGameInfo.features.map((feature, i) => (
                  <li key={i} className="text-sm text-[#6b7c74] flex items-center gap-2">
                    <span className="text-[#48a89a]">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <Input 
              label="Your Name"
              placeholder="Enter your name to host..."
              value={playerName}
              onChange={setPlayerName}
            />
            
            {error && <Alert type="error">{error}</Alert>}
            
            <Button 
              onClick={() => handleHost(showGameInfo.id)} 
              disabled={!playerName}
              className="w-full"
              size="lg"
            >
              Host This Game
            </Button>
          </div>
        )}
      </Modal>
      
      {/* API Key Modal */}
      <Modal 
        isOpen={showApiModal} 
        onClose={() => setShowApiModal(false)}
        title="AI Settings"
        size="md"
      >
        <div className="space-y-5">
          <p className="text-[#6b7c74] text-sm">
            Choose your AI provider and enter your API key to enable AI features.
          </p>
          
          {/* Provider Selector */}
          <div>
            <label className="block text-sm font-medium text-[#3d5a4c] mb-2">AI Provider</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(AI_PROVIDERS).map(([id, provider]) => (
                <button
                  key={id}
                  onClick={() => {
                    setSelectedProvider(id);
                    setProvider(id);
                    setApiKeyInput(localStorage.getItem(`ai_key_${id}`) || '');
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedProvider === id
                      ? 'border-[#48a89a] bg-[#48a89a]/10'
                      : 'border-[#e2e0dc] hover:border-[#48a89a]/50'
                  }`}
                >
                  <div className="font-bold text-[#3d5a4c]">{provider.name}</div>
                  <div className="text-xs text-[#6b7c74] mt-1">{provider.description}</div>
                  {!provider.imageModel && (
                    <div className="text-xs text-amber-600 mt-1">⚠️ No image generation</div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* API Key Input (if required) */}
          {AI_PROVIDERS[selectedProvider]?.requiresKey && (
            <div>
              <Input 
                label={`${AI_PROVIDERS[selectedProvider]?.name} API Key`}
                placeholder={AI_PROVIDERS[selectedProvider]?.keyPlaceholder}
                value={apiKeyInput}
                onChange={setApiKeyInput}
                type="password"
              />
              <p className="text-xs text-[#6b7c74] mt-2">
                Get a key at{' '}
                <a 
                  href={AI_PROVIDERS[selectedProvider]?.keyLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#48a89a] underline"
                >
                  {AI_PROVIDERS[selectedProvider]?.keyLink?.replace('https://', '')}
                </a>
              </p>
            </div>
          )}
          
          {!AI_PROVIDERS[selectedProvider]?.requiresKey && (
            <Alert type="info">
              {selectedProvider === 'ollama' 
                ? 'Make sure Ollama is running locally on port 11434. No API key needed!'
                : 'This provider does not require an API key.'}
            </Alert>
          )}
          
          <Alert type="info">
            Your settings are stored locally in your browser and never sent to our servers.
          </Alert>
          
          <Button 
            onClick={() => {
              setProvider(selectedProvider);
              if (apiKeyInput.trim()) {
                setApiKey(apiKeyInput.trim());
              }
              setShowApiModal(false);
            }} 
            disabled={AI_PROVIDERS[selectedProvider]?.requiresKey && !apiKeyInput} 
            className="w-full"
          >
            Save Settings
          </Button>
          
          {/* Current Status */}
          <div className="pt-3 border-t border-[#e2e0dc]">
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7c74]">Current Provider:</span>
              <span className="font-medium text-[#3d5a4c]">{AI_PROVIDERS[getProvider()]?.name}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-[#6b7c74]">Status:</span>
              <span className={hasApiKey() ? 'text-green-600' : 'text-amber-600'}>
                {hasApiKey() ? '✓ Ready' : '⚠ Key Required'}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;

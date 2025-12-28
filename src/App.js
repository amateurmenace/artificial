// ARTIFICIAL: Games for AI Literacy v4
// Main App Component

import React, { useState, useEffect } from 'react';
import { auth, signInAnon, createGameRoom, joinGameRoom, subscribeToRoom } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setApiKey, getApiKey, hasApiKey } from './ai-services';
import { Logo, Button, Input, Modal, Alert } from './components';
import { FacilitatorDashboard, ProjectorDisplay } from './FacilitatorDashboard';
import EnhancedHomepage from './EnhancedHomepage';
import SpotTheFake from './SpotTheFake';
import MemeMachine from './MemeMachine';
import VibeCodeChallenge from './VibeCodeChallenge';

function App() {
  // Auth & user state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation state
  const [view, setView] = useState('home');
  const [currentGame, setCurrentGame] = useState(null);
  const [gameCode, setGameCode] = useState('');
  const [room, setRoom] = useState(null);
  
  // UI state
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
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
  
  // Check for saved API key
  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKeyInput(savedKey);
    }
  }, []);
  
  // Game definitions
  const games = [
    {
      id: 'spotTheFake',
      name: 'Spot the Fake',
      icon: '🔍',
      tagline: 'Can you tell real from AI?',
      description: 'Learn to identify AI-generated images through hands-on practice. Includes real-world examples, detection techniques, and discussions about ethics and legal implications.',
      duration: '30-45 min',
      players: '2-20',
      features: ['Real vs AI detection', 'Editing recognition', 'Create & deceive round', 'Ethics discussion', 'Legal landscape'],
      color: '#48a89a'
    },
    {
      id: 'memeMachine',
      name: 'Meme Machine',
      icon: '🚀',
      tagline: 'Create viral advocacy content',
      description: 'Build memes for community causes using AI tools. Get feedback on effectiveness, iterate on your designs, and watch them "go viral" in simulation.',
      duration: '45-60 min',
      players: '3-20',
      features: ['AI caption generation', 'AI image creation', 'Expert critique', 'Edit & improve', 'Viral simulation'],
      color: '#d4a84b'
    },
    {
      id: 'vibeCode',
      name: 'Vibe Code Challenge',
      icon: '💻',
      tagline: 'Build apps with AI, no coding needed',
      description: 'Create real, working apps by describing what you want in plain language. AI writes the code while you guide the vision.',
      duration: '45-60 min',
      players: '2-15',
      features: ['Problem clarification', 'Feature planning', 'AI code generation', 'Iterate & debug', 'Polish & demo'],
      color: '#6b8cce'
    }
  ];
  
  // Host a game
  const handleHost = async (gameType) => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    try {
      const code = await createGameRoom(gameType, playerName);
      setGameCode(code);
      setCurrentGame(gameType);
      setView('game');
      setShowGameInfo(null);
    } catch (err) {
      setError('Failed to create game: ' + err.message);
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
  
  // Game views
  if (view === 'game' && currentGame && gameCode) {
    const gameProps = {
      gameCode,
      room,
      userId: user?.uid,
      isHost,
      onBack: handleBackToHome,
      onOpenDashboard: () => setShowDashboard(true),
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
              {hasApiKey() ? '✓ AI Ready' : '⚠️ Set API Key'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Add padding for fixed header */}
      <div className="pt-16">
        <EnhancedHomepage 
          onHost={() => setView('host')}
          onJoin={() => setView('join')}
          onSelectGame={(gameId) => {
            setShowGameInfo(games.find(g => g.id === gameId));
          }}
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
                <p className="text-sm text-white/70">
                  A community AI app from <a href="https://brooklineinteractive.org" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Brookline Interactive Group</a> in partnership with <a href="https://weirdmachine.org" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Neighborhood AI</a>.
                </p>
                <p className="text-sm text-white/50 mt-1">
                  Game Designed and Developed by Stephen Walter + AI in 2025.
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
        title="OpenAI API Key"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[#6b7c74] text-sm">
            Enter your OpenAI API key to enable AI features like image generation, 
            caption suggestions, and code generation.
          </p>
          
          <Input 
            label="API Key"
            placeholder="sk-..."
            value={apiKeyInput}
            onChange={setApiKeyInput}
            type="password"
          />
          
          <Alert type="info">
            Your API key is stored locally in your browser and never sent to our servers.
            Get a key at <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a>
          </Alert>
          
          <Button onClick={handleSaveApiKey} disabled={!apiKeyInput} className="w-full">
            Save API Key
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;

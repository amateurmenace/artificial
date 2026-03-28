// FACILITATOR DASHBOARD v6 - With Submission Galleries
// Galleries for memes and apps, return to game functionality, real-time updates

import React, { useState, useEffect } from 'react';
import { Button, Badge } from './components';
import { updateGamePhase } from './firebase';

// ============================================
// 8-BIT PIXEL CHARACTER (matches VibeCodeChallenge)
// ============================================

const PixelCharacter = ({ type, size = 32 }) => {
  const byteFrame = `<rect x="8" y="8" width="32" height="32" fill="#00D4FF" rx="4"/>
     <rect x="14" y="16" width="6" height="6" fill="#0a0a0a"/>
     <rect x="28" y="16" width="6" height="6" fill="#0a0a0a"/>
     <rect x="16" y="28" width="16" height="4" fill="#0a0a0a"/>
     <rect x="4" y="20" width="4" height="8" fill="#00D4FF"/>
     <rect x="40" y="20" width="4" height="8" fill="#00D4FF"/>`;
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <g dangerouslySetInnerHTML={{ __html: byteFrame }} />
    </svg>
  );
};

// ============================================
// BIG TIMER - With red warning state
// ============================================

const BigTimer = ({ seconds, totalSeconds, showControls, onAddTime, onSubtractTime }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 100;
  const isUrgent = seconds <= 60 && seconds > 30;
  const isCritical = seconds <= 30;
  
  return (
    <div className={`rounded-3xl p-8 transition-all duration-500 ${
      isCritical ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse shadow-red-500/50 shadow-2xl' :
      isUrgent ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30 shadow-xl' :
      'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/20 shadow-lg'
    }`}>
      <div className="text-center text-white">
        <div className="text-sm uppercase tracking-widest opacity-80 mb-3 font-medium">
          {isCritical ? '⚠️ TIME RUNNING OUT!' : isUrgent ? '⏰ Hurry Up!' : '⏱️ Time Remaining'}
        </div>
        <div className={`text-8xl font-mono font-black tracking-tight transition-transform ${
          isCritical ? 'scale-110 animate-bounce' : ''
        }`}>
          {mins}:{secs.toString().padStart(2, '0')}
        </div>
        
        {isCritical && (
          <div className="text-xl font-bold mt-3 animate-pulse">
            🚨 FINAL COUNTDOWN! 🚨
          </div>
        )}
        
        {/* Progress bar */}
        <div className="mt-6 h-4 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              isCritical ? 'bg-white animate-pulse' : 'bg-white/70'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Timer controls for host */}
        {showControls && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onSubtractTime}
              className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-xl font-bold transition-all hover:scale-105"
            >
              -30s
            </button>
            <button
              onClick={onAddTime}
              className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-xl font-bold transition-all hover:scale-105"
            >
              +30s
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// STAT CARD - Lighter design
// ============================================

const StatCard = ({ icon, value, label, color }) => (
  <div className={`${color} rounded-2xl p-5 text-white shadow-lg hover:scale-105 transition-transform`}>
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-white/80 text-sm font-medium">{label}</span>
    </div>
    <div className="text-4xl font-black">{value}</div>
  </div>
);

// ============================================
// ACTIVITY FEED - Lighter theme
// ============================================

const ActivityFeed = ({ activities = [] }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full border border-slate-200">
    <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4">
      <h3 className="text-white font-bold flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        Live Activity
        <span className="ml-auto text-xs text-white/50 font-normal">{activities.length} events</span>
      </h3>
    </div>
    <div className="p-4 h-64 overflow-y-auto bg-slate-50">
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <span className="text-4xl mb-2">⏳</span>
          <p>Waiting for activity...</p>
          <p className="text-xs mt-1">Player actions will appear here in real time</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.slice(0, 20).map((act, i) => (
            <div
              key={i}
              className={`p-2.5 rounded-xl text-sm transition-all flex items-center gap-2 ${
                i === 0 ? 'bg-amber-50 border-l-4 border-amber-500' : 'bg-white border border-slate-200'
              }`}
            >
              <span className="text-base flex-shrink-0">{act.icon || '⚡'}</span>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-slate-800">{act.player}</span>
                <span className="text-slate-600"> {act.action}</span>
              </div>
              {act.time && (
                <span className="text-slate-400 text-[10px] flex-shrink-0">{act.time}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ============================================
// LEADERBOARD - Lighter theme
// ============================================

const Leaderboard = ({ players = [] }) => {
  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full border border-slate-200">
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          🏆 Leaderboard
        </h3>
      </div>
      <div className="p-4 bg-slate-50">
        {sorted.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <span className="text-4xl block mb-2">📊</span>
            <p>No scores yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.slice(0, 10).map((p, i) => (
              <div 
                key={p.id} 
                className={`flex justify-between items-center p-3 rounded-xl transition-all hover:scale-102 ${
                  i === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md' :
                  i === 1 ? 'bg-slate-200 text-slate-800' :
                  i === 2 ? 'bg-orange-100 text-orange-900' :
                  'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black w-6">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </span>
                  <span className="font-bold">{p.name}</span>
                </div>
                <span className="font-black text-xl">{p.score || 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MEME GALLERY - Display submitted memes
// ============================================

const MemeGallery = ({ submissions = [], onSelectForDemo }) => {
  const memes = submissions.filter(s => s.type === 'meme-complete');
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          🎨 Meme Gallery ({memes.length} submissions)
        </h3>
      </div>
      <div className="p-4 bg-slate-50">
        {memes.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <span className="text-5xl block mb-3">🖼️</span>
            <p className="font-medium">No memes submitted yet</p>
            <p className="text-sm">They'll appear here as players submit</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {memes.map((meme, i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:scale-105 cursor-pointer group"
                onClick={() => onSelectForDemo && onSelectForDemo(meme)}
              >
                {/* Meme image */}
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  {meme.imageUrl ? (
                    <img 
                      src={meme.imageUrl} 
                      alt={meme.caption || 'Meme'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🖼️
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold">📺 Show on Screen</span>
                  </div>
                </div>
                {/* Caption and creator */}
                <div className="p-3">
                  <p className="text-slate-800 text-sm font-medium line-clamp-2">{meme.caption || 'No caption'}</p>
                  <p className="text-slate-500 text-xs mt-1">by {meme.playerName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-purple-500 font-medium">{meme.issue || 'Advocacy'}</span>
                    {meme.votes > 0 && (
                      <span className="text-amber-500 text-xs font-bold">❤️ {meme.votes}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// APP GALLERY - Display submitted vibe code apps
// ============================================

const AppGallery = ({ submissions = [], onSelectForDemo }) => {
  const apps = submissions.filter(s => s.type === 'app-complete');
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <PixelCharacter type="byte" size={24} />
          App Gallery ({apps.length} submissions)
        </h3>
      </div>
      <div className="p-4 bg-slate-50">
        {apps.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <span className="text-5xl block mb-3">💻</span>
            <p className="font-medium">No apps submitted yet</p>
            <p className="text-sm">They'll appear here as players submit</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app, i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:scale-102 cursor-pointer group"
                onClick={() => onSelectForDemo && onSelectForDemo(app)}
              >
                {/* App preview iframe */}
                <div className="aspect-video bg-white relative overflow-hidden border-b border-slate-200">
                  {app.code ? (
                    <iframe
                      srcDoc={app.code}
                      title={app.appIdea}
                      className="w-full h-full pointer-events-none"
                      style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      📱
                    </div>
                  )}
                  {/* Demo button overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="text-white font-bold bg-cyan-500 px-4 py-2 rounded-lg">
                      🎤 Demo This App
                    </span>
                  </div>
                </div>
                {/* App info */}
                <div className="p-4">
                  <h4 className="text-slate-800 font-bold line-clamp-1">{app.appIdea || 'Untitled App'}</h4>
                  <p className="text-cyan-600 text-sm mt-1 line-clamp-1">{app.twist || 'Creative app'}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-slate-500 text-sm">by <span className="font-medium">{app.playerName}</span></p>
                    <div className="flex items-center gap-2 text-xs">
                      {app.aiUsage > 0 && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          🤖 AI: {app.aiUsage}x
                        </span>
                      )}
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        🔄 {app.iterations || 0} iterations
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// DEMO MODAL - Full screen presentation view
// ============================================

const DemoModal = ({ item, type, onClose }) => {
  if (!item) return null;
  
  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between ${
          type === 'meme' 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
            : 'bg-gradient-to-r from-cyan-500 to-blue-500'
        }`}>
          <div className="text-white">
            <h2 className="text-2xl font-bold">{item.playerName}'s {type === 'meme' ? 'Meme' : 'App'}</h2>
            <p className="text-white/80">{type === 'meme' ? item.issue : item.appIdea}</p>
          </div>
          <button 
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-bold transition-colors"
          >
            ✕ Close
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {type === 'meme' ? (
            <div className="text-center">
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.caption} 
                  className="max-w-2xl mx-auto rounded-xl shadow-lg mb-6"
                />
              )}
              <p className="text-2xl font-bold text-slate-800 mb-4">"{item.caption}"</p>
              <p className="text-slate-500">Issue: {item.issue}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-xl overflow-hidden" style={{ height: '60vh' }}>
                {item.code && (
                  <iframe
                    srcDoc={item.code}
                    title={item.appIdea}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-forms allow-modals"
                  />
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Twist: <span className="font-medium text-cyan-600">{item.twist}</span></span>
                <span>Iterations: {item.iterations || 0} | AI Usage: {item.aiUsage || 0}x</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// PLAYER GRID - Lighter theme
// ============================================

const PlayerGrid = ({ players = [] }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
      <h3 className="text-white font-bold flex items-center gap-2">
        👥 Players ({players.length})
      </h3>
    </div>
    <div className="p-4 bg-slate-50">
      <div className="flex flex-wrap gap-2">
        {players.map(p => (
          <div 
            key={p.id}
            className="bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-700 flex items-center gap-2 border border-slate-200 shadow-sm hover:shadow transition-shadow"
          >
            <span className={`w-2 h-2 rounded-full ${p.connected !== false ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
            {p.name}
            {p.score > 0 && <span className="text-amber-600 font-bold">({p.score})</span>}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================
// PHASE CONTROLS - For facilitator
// ============================================

const PhaseControls = ({ gameCode, currentPhase, gameType }) => {
  const getPhases = () => {
    if (gameType === 'spotTheFake') {
      return [
        { id: 'lobby', label: 'Lobby', icon: '🏠' },
        { id: 'intro', label: 'Introduction', icon: '📖' },
        { id: 'round1-play', label: 'Round 1', icon: '🎮' },
        { id: 'round2', label: 'Round 2 Intro', icon: '📖' },
        { id: 'round2-play', label: 'Round 2', icon: '🎮' },
        { id: 'results', label: 'Results', icon: '🏆' },
      ];
    } else if (gameType === 'memeMachine') {
      return [
        { id: 'lobby', label: 'Lobby', icon: '🏠' },
        { id: 'build', label: 'Create Memes', icon: '🎨' },
        { id: 'vote', label: 'Voting', icon: '🗳️' },
        { id: 'results', label: 'Results', icon: '🏆' },
      ];
    } else {
      return [
        { id: 'lobby', label: 'Lobby', icon: '🏠' },
        { id: 'build', label: 'Build Apps', icon: '💻' },
        { id: 'vote', label: 'Demo & Vote', icon: '🗳️' },
        { id: 'results', label: 'Results', icon: '🏆' },
      ];
    }
  };
  
  const phases = getPhases();
  const currentIndex = phases.findIndex(p => p.id === currentPhase);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4">
        <h3 className="text-white font-bold">🎮 Game Controls</h3>
      </div>
      <div className="p-4 bg-slate-50">
        <div className="space-y-2 mb-4">
          {phases.map((phase, i) => (
            <div 
              key={phase.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                i === currentIndex 
                  ? 'bg-cyan-500 text-white shadow-md' 
                  : i < currentIndex 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              <span className="text-lg">{phase.icon}</span>
              <span className="font-medium">{phase.label}</span>
              {i === currentIndex && <span className="ml-auto animate-pulse">â—€ CURRENT</span>}
              {i < currentIndex && <span className="ml-auto">✓</span>}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          {currentIndex > 0 && (
            <button
              onClick={() => updateGamePhase(gameCode, phases[currentIndex - 1].id)}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-medium transition-colors"
            >
              ← Previous
            </button>
          )}
          {currentIndex < phases.length - 1 && (
            <button
              onClick={() => updateGamePhase(gameCode, phases[currentIndex + 1].id)}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Next Phase →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD
// ============================================

export const FacilitatorDashboard = ({ 
  gameCode, 
  room, 
  onClose,
  onReturnToGame,
  timerSeconds = 0,
  totalTimerSeconds = 0,
  onAddTime,
  onSubtractTime
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoItem, setDemoItem] = useState(null);
  const [demoType, setDemoType] = useState(null);
  
  const players = Object.values(room?.players || {});
  const submissions = Object.values(room?.submissions || {});
  
  // Build comprehensive activity feed from all room data
  const activities = (() => {
    const acts = [];

    // Player join events
    players.forEach(p => {
      acts.push({
        player: p.name || 'Unknown',
        action: 'joined the game',
        icon: '👋',
        time: '',
        priority: 0,
      });
    });

    // Submission events
    submissions.forEach(s => {
      const actionMap = {
        'meme-complete': { text: 'submitted their meme', icon: '🎨' },
        'app-complete': { text: 'submitted their app', icon: '💻' },
        'round1-complete': { text: `finished Round 1 (${s.correct || 0}/${s.total || 0} correct)`, icon: '🔍' },
        'round2-complete': { text: `finished Round 2 (${s.correct || 0}/${s.total || 0} correct)`, icon: '🔍' },
        'reaction': { text: `reacted ${s.reaction || ''} to ${s.targetPlayerId ? 'a submission' : 'something'}`, icon: '💬' },
        'comment': { text: `commented on a submission`, icon: '💬' },
        'share': { text: `shared a submission`, icon: '📤' },
        'vote': { text: `cast their vote`, icon: '🗳️' },
        'remix': { text: `submitted a remix`, icon: '🔀' },
      };
      const mapped = actionMap[s.type] || { text: `${s.type || 'did something'}`, icon: '⚡' };
      acts.push({
        player: s.playerName || 'Player',
        action: mapped.text,
        icon: mapped.icon,
        time: s.timestamp ? new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '',
        priority: s.timestamp || 0,
      });
    });

    // Vote events from room.votes
    if (room?.votes) {
      Object.entries(room.votes).forEach(([oderId, targetId]) => {
        const voter = players.find(p => p.id === oderId);
        const target = players.find(p => p.id === targetId);
        if (voter) {
          acts.push({
            player: voter.name || 'Player',
            action: `voted for ${target?.name || 'someone'}`,
            icon: '🗳️',
            time: '',
            priority: 1,
          });
        }
      });
    }

    // Phase change info
    if (room?.phase) {
      acts.push({
        player: 'Game',
        action: `phase: ${room.phase}`,
        icon: '🎯',
        time: '',
        priority: -1,
      });
    }

    // Sort by timestamp (newest first), with player joins last
    return acts.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  })();
  
  const handleSelectForDemo = (item, type) => {
    setDemoItem(item);
    setDemoType(type);
  };
  
  const gameType = room?.gameType;
  const showMemeGallery = gameType === 'memeMachine';
  const showAppGallery = gameType === 'vibeCode';
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-100 to-slate-200 z-50 overflow-y-auto">
      {/* Demo Modal */}
      {demoItem && (
        <DemoModal item={demoItem} type={demoType} onClose={() => setDemoItem(null)} />
      )}
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Facilitator Dashboard</h1>
            <p className="text-slate-500">Game Code: <span className="text-cyan-600 font-mono font-bold text-xl">{gameCode}</span></p>
          </div>
          <div className="flex gap-3">
            {onReturnToGame && (
              <button
                onClick={onReturnToGame}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                🎮 Return to Game
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              ✕ Close Dashboard
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-cyan-500 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📊 Overview
          </button>
          {showMemeGallery && (
            <button 
              onClick={() => setActiveTab('memes')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'memes' ? 'bg-purple-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🎨 Meme Gallery
            </button>
          )}
          {showAppGallery && (
            <button 
              onClick={() => setActiveTab('apps')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'apps' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              💻 App Gallery
            </button>
          )}
          <button 
            onClick={() => setActiveTab('projector')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'projector' ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📺 Projector View
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Timer */}
              <BigTimer 
                seconds={timerSeconds} 
                totalSeconds={totalTimerSeconds}
                showControls={true}
                onAddTime={onAddTime}
                onSubtractTime={onSubtractTime}
              />
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  icon="👥" 
                  value={players.length} 
                  label="Players" 
                  color="bg-gradient-to-br from-cyan-400 to-blue-500" 
                />
                <StatCard 
                  icon="✅" 
                  value={submissions.filter(s => s.type?.includes('complete')).length} 
                  label="Completed" 
                  color="bg-gradient-to-br from-emerald-400 to-teal-500" 
                />
              </div>
              
              {/* Phase Controls */}
              <PhaseControls 
                gameCode={gameCode} 
                currentPhase={room?.phase} 
                gameType={room?.gameType}
              />
            </div>
            
            {/* Middle Column */}
            <div className="space-y-6">
              <ActivityFeed activities={activities} />
              <PlayerGrid players={players} />
            </div>
            
            {/* Right Column */}
            <div>
              <Leaderboard players={players} />
            </div>
          </div>
        )}
        
        {activeTab === 'memes' && (
          <MemeGallery 
            submissions={submissions} 
            onSelectForDemo={(meme) => handleSelectForDemo(meme, 'meme')}
          />
        )}
        
        {activeTab === 'apps' && (
          <AppGallery 
            submissions={submissions} 
            onSelectForDemo={(app) => handleSelectForDemo(app, 'app')}
          />
        )}
        
        {activeTab === 'projector' && (
          <ProjectorDisplay 
            gameCode={gameCode}
            room={room}
            timerSeconds={timerSeconds}
            totalTimerSeconds={totalTimerSeconds}
          />
        )}
      </div>
    </div>
  );
};

// ============================================
// PROJECTOR DISPLAY - For room projection
// ============================================

export const ProjectorDisplay = ({ 
  gameCode, 
  room,
  timerSeconds = 0,
  totalTimerSeconds = 0 
}) => {
  const players = Object.values(room?.players || {});
  const submissions = Object.values(room?.submissions || {});
  const completedCount = submissions.filter(s => s.type?.includes('complete')).length;
  
  // Get phase display name
  const getPhaseDisplay = () => {
    const phase = room?.phase || 'lobby';
    const displays = {
      'lobby': '🏠 Waiting to Start',
      'intro': '📖 Introduction',
      'round1': '🎮 Round 1',
      'round1-play': '🎮 Round 1 - Playing!',
      'round2': '📖 Round 2',
      'round2-play': '🎮 Round 2 - Playing!',
      'build': '🎨 Create Time!',
      'vote': '🗳️ Voting Time!',
      'results': '🏆 Results!'
    };
    return displays[phase] || phase;
  };
  
  const isUrgent = timerSeconds <= 60 && timerSeconds > 30;
  const isCritical = timerSeconds <= 30;
  
  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 min-h-[600px]">
      {/* Game Code */}
      <div className="text-center mb-8">
        <div className="inline-block bg-slate-700 rounded-2xl px-8 py-4 border border-slate-600">
          <div className="text-slate-400 text-sm uppercase tracking-widest mb-1">Join at artificial.game</div>
          <div className="text-6xl font-mono font-black text-cyan-400 tracking-widest">{gameCode}</div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Timer */}
        <div className={`rounded-3xl p-8 transition-all ${
          isCritical ? 'bg-red-500 animate-pulse' :
          isUrgent ? 'bg-amber-500' :
          'bg-emerald-500'
        }`}>
          <div className="text-center text-white">
            <div className="text-sm uppercase tracking-widest opacity-80 mb-2">
              {isCritical ? '⚠️ HURRY!' : 'Time Remaining'}
            </div>
            <div className={`text-7xl font-mono font-black ${isCritical ? 'animate-bounce' : ''}`}>
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        
        {/* Phase & Stats */}
        <div className="bg-slate-700 rounded-3xl p-8 text-center">
          <div className="text-3xl font-bold text-white mb-4">{getPhaseDisplay()}</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyan-500/20 rounded-2xl p-4">
              <div className="text-4xl font-black text-cyan-400">{players.length}</div>
              <div className="text-cyan-400/80 text-sm">Players</div>
            </div>
            <div className="bg-emerald-500/20 rounded-2xl p-4">
              <div className="text-4xl font-black text-emerald-400">{completedCount}</div>
              <div className="text-emerald-400/80 text-sm">Finished</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leaderboard for projection */}
      <div className="bg-slate-700 rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">🏆 Leaderboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {players
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 10)
            .map((p, i) => (
              <div 
                key={p.id}
                className={`rounded-xl p-4 text-center ${
                  i === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                  i === 1 ? 'bg-slate-300' :
                  i === 2 ? 'bg-orange-300' :
                  'bg-slate-600'
                }`}
              >
                <div className="text-2xl mb-1">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}
                </div>
                <div className={`font-bold truncate ${i < 3 ? 'text-slate-900' : 'text-white'}`}>
                  {p.name}
                </div>
                <div className={`text-2xl font-black ${i < 3 ? 'text-slate-800' : 'text-cyan-400'}`}>
                  {p.score || 0}
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* Players list */}
      <div className="mt-6">
        <div className="flex flex-wrap justify-center gap-2">
          {players.map(p => (
            <div 
              key={p.id}
              className="bg-slate-700 border border-slate-600 px-4 py-2 rounded-full text-white text-sm flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacilitatorDashboard;

// FACILITATOR DASHBOARD v4 - ASCII-safe, working app gallery with demos
import React, { useState, useEffect } from 'react';
import { Button, Badge } from './components';
import { updateGamePhase } from './firebase';

// Timer component
const BigTimer = ({ seconds, totalSeconds, phase }) => {
  const isUrgent = seconds < 30;
  const isCritical = seconds < 10;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - seconds) / totalSeconds) * 100 : 0;
  
  return (
    <div className={`rounded-2xl p-6 ${
      isCritical ? 'bg-gradient-to-br from-red-600 to-red-800' : 
      isUrgent ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 
      'bg-gradient-to-br from-emerald-600 to-teal-700'
    }`}>
      <div className="text-center text-white">
        <div className="text-sm uppercase tracking-wider opacity-80 mb-2">Time Remaining</div>
        <div className="text-7xl font-mono font-black">
          {mins}:{secs.toString().padStart(2, '0')}
        </div>
        {isCritical && (
          <div className="text-lg font-bold mt-2 animate-pulse">!! FINAL COUNTDOWN !!</div>
        )}
        <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 px-3 py-1 bg-white/10 rounded-lg inline-block text-sm">
          Phase: {phase?.toUpperCase().replace(/-/g, ' ') || 'WAITING'}
        </div>
      </div>
    </div>
  );
};

// Stats Card
const StatsCard = ({ icon, label, value, color }) => (
  <div className={`${color} rounded-xl p-4 text-white text-center`}>
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-4xl font-black">{value}</div>
    <div className="text-xs opacity-80 mt-1">{label}</div>
  </div>
);

// Activity Feed
const ActivityFeed = ({ activities = [] }) => (
  <div className="bg-white/95 backdrop-blur rounded-xl p-4 h-72 overflow-hidden shadow">
    <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
      [LIVE] Activity Feed
    </h3>
    <div className="space-y-2 h-52 overflow-y-auto">
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <div className="text-3xl mb-2">...</div>
          <p>Waiting for activity</p>
        </div>
      ) : (
        activities.slice(-12).reverse().map((act, i) => (
          <div key={i} className={`p-2 rounded-lg text-sm ${
            i === 0 ? 'bg-amber-100 border border-amber-300' : 'bg-slate-100'
          }`}>
            <span className="font-bold text-slate-800">{act.player}</span>
            <span className="text-slate-600"> {act.action}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

// Leaderboard
const Leaderboard = ({ players = [] }) => {
  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  
  return (
    <div className="bg-white/95 backdrop-blur rounded-xl p-4 shadow">
      <h3 className="text-lg font-black text-slate-800 mb-3">[#] Leaderboard</h3>
      {sorted.length === 0 ? (
        <div className="text-center text-slate-400 py-4">No scores yet</div>
      ) : (
        <div className="space-y-2">
          {sorted.slice(0, 8).map((p, i) => (
            <div key={p.id} className={`flex justify-between items-center p-2 rounded-lg ${
              i === 0 ? 'bg-amber-400 text-white font-bold' :
              i === 1 ? 'bg-slate-300 text-slate-800' :
              i === 2 ? 'bg-orange-300 text-orange-900' :
              'bg-slate-100 text-slate-700'
            }`}>
              <span>{i + 1}. {p.name}</span>
              <span className="font-bold">{p.score || 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// App Gallery with working demos
const AppGallery = ({ submissions = [], onDemo }) => (
  <div className="bg-white/95 backdrop-blur rounded-xl p-4 shadow">
    <h3 className="text-lg font-black text-slate-800 mb-3">
      [Apps] Gallery ({submissions.length})
    </h3>
    {submissions.length === 0 ? (
      <div className="text-center text-slate-400 py-8">
        <div className="text-2xl mb-2">{'</>'}</div>
        <p>No apps submitted yet</p>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto">
        {submissions.map((sub, i) => (
          <div key={i} className="bg-slate-100 rounded-lg overflow-hidden">
            {/* Mini preview */}
            <div className="h-20 bg-white overflow-hidden border-b">
              <iframe
                title={sub.appIdea || 'App'}
                srcDoc={sub.code}
                className="w-full h-full pointer-events-none"
                style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%', height: '400%' }}
              />
            </div>
            <div className="p-2">
              <div className="text-xs font-bold text-slate-800 truncate">{sub.appIdea || 'Untitled'}</div>
              <div className="text-xs text-slate-500 mb-2">by {sub.playerName}</div>
              <button
                onClick={() => onDemo(sub.code, sub.appIdea || 'App')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded font-medium"
              >
                [Demo]
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Fullscreen Demo Modal
const FullscreenDemo = ({ code, title, onClose }) => {
  if (!code) return null;
  
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900">
        <span className="text-white font-medium">{title}</span>
        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg"
        >
          [X] Close
        </button>
      </div>
      <iframe
        title={title}
        srcDoc={code}
        className="flex-1 bg-white"
        sandbox="allow-scripts allow-forms allow-modals"
      />
    </div>
  );
};

// Player Grid
const PlayerGrid = ({ players = [] }) => (
  <div className="bg-white/95 backdrop-blur rounded-xl p-4 shadow">
    <h3 className="text-lg font-black text-slate-800 mb-3">
      [Players] {players.length} Online
    </h3>
    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
      {players.map(p => (
        <div key={p.id} className={`p-2 rounded-lg text-center text-xs ${
          p.submitted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
        }`}>
          <div className="font-bold truncate">{p.name}</div>
          <div className="text-[10px] opacity-75">{p.submitted ? 'Done' : 'Working'}</div>
        </div>
      ))}
    </div>
  </div>
);

// Phase Controls
const PhaseControls = ({ room, gameCode, phases }) => {
  const idx = phases.indexOf(room?.phase);
  const progress = phases.length > 0 ? ((idx + 1) / phases.length) * 100 : 0;
  
  return (
    <div className="bg-white/95 backdrop-blur rounded-xl p-4 shadow">
      <h3 className="text-lg font-black text-slate-800 mb-3">[Flow] Game Progress</h3>
      
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-slate-600 mb-3">
        <span>Phase {idx + 1}/{phases.length}</span>
        <span className="font-bold uppercase">{room?.phase?.replace(/-/g, ' ')}</span>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={() => {
            const prev = phases[Math.max(0, idx - 1)];
            if (prev) updateGamePhase(gameCode, prev);
          }}
          disabled={idx <= 0}
          className="flex-1 bg-slate-300 hover:bg-slate-400 disabled:opacity-30"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            const next = phases[Math.min(phases.length - 1, idx + 1)];
            if (next) updateGamePhase(gameCode, next);
          }}
          disabled={idx >= phases.length - 1}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// Quick Actions
const QuickActions = ({ onAddTime, onSkip, onEnd }) => (
  <div className="bg-white/95 backdrop-blur rounded-xl p-4 shadow">
    <h3 className="text-lg font-black text-slate-800 mb-3">[!] Quick Actions</h3>
    <div className="grid grid-cols-2 gap-2">
      <Button onClick={onAddTime} className="bg-blue-500 hover:bg-blue-600 py-2 text-sm">
        +1 Min
      </Button>
      <Button onClick={onSkip} className="bg-orange-500 hover:bg-orange-600 py-2 text-sm">
        Skip
      </Button>
      <Button onClick={onEnd} className="col-span-2 bg-red-500 hover:bg-red-600 py-2 text-sm">
        End Game
      </Button>
    </div>
  </div>
);

// Main Dashboard
export const FacilitatorDashboard = ({ gameCode, room, userId, onClose }) => {
  const [timer, setTimer] = useState(180);
  const [activities, setActivities] = useState([]);
  const [demoApp, setDemoApp] = useState(null);
  
  const phaseLists = {
    spotTheFake: ['lobby', 'intro', 'round1', 'round1-debrief', 'round2', 'round2-debrief', 'ethics', 'legal', 'quiz', 'werewolf', 'werewolf-vote', 'results'],
    memeMachine: ['lobby', 'intro', 'issue', 'describe', 'wizard', 'generate', 'caption', 'preview', 'critique', 'finalize', 'gallery', 'vote', 'results'],
    vibeCode: ['lobby', 'intro', 'build', 'present', 'vote', 'results'],
  };
  
  const phases = phaseLists[room?.gameType] || [];
  
  // Timer
  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timer]);
  
  // Track activities
  useEffect(() => {
    const players = Object.values(room?.players || {});
    const subs = Object.values(room?.submissions || {});
    
    const acts = [];
    players.forEach(p => acts.push({ player: p.name, action: 'joined' }));
    subs.forEach(s => acts.push({ 
      player: s.playerName || 'Someone', 
      action: s.type === 'app-complete' ? 'submitted app' : 'submitted'
    }));
    
    setActivities(acts);
  }, [room]);
  
  const players = Object.values(room?.players || {});
  const submissions = Object.values(room?.submissions || {});
  const appSubs = submissions.filter(s => s.type === 'app-complete' && s.code);
  const submitted = players.filter(p => p.submitted).length;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-black/20">
        <div className="flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-white">[Dashboard] Facilitator View</h1>
            <Badge className="bg-emerald-600 text-white text-lg px-4">{gameCode}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm">
              {room?.gameType?.toUpperCase()} | {players.length} players
            </span>
            <Button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white">
              [X] Close
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Grid */}
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-5">
          
          {/* Left Column */}
          <div className="col-span-4 space-y-5">
            <BigTimer seconds={timer} totalSeconds={180} phase={room?.phase} />
            
            <div className="grid grid-cols-2 gap-3">
              <StatsCard 
                icon="[P]" 
                label="Players" 
                value={players.length}
                color="bg-blue-600"
              />
              <StatsCard 
                icon="[+]" 
                label="Submitted" 
                value={submitted}
                color="bg-emerald-600"
              />
              <StatsCard 
                icon="[R]" 
                label="Round" 
                value={Math.max(1, phases.indexOf(room?.phase) + 1)}
                color="bg-amber-600"
              />
              <StatsCard 
                icon="[A]" 
                label="Apps" 
                value={appSubs.length}
                color="bg-purple-600"
              />
            </div>
            
            <QuickActions 
              onAddTime={() => setTimer(t => t + 60)}
              onSkip={() => {
                const idx = phases.indexOf(room?.phase);
                const next = phases[Math.min(phases.length - 1, idx + 1)];
                if (next) updateGamePhase(gameCode, next);
              }}
              onEnd={() => updateGamePhase(gameCode, 'results')}
            />
          </div>
          
          {/* Middle Column */}
          <div className="col-span-5 space-y-5">
            <ActivityFeed activities={activities} />
            
            {room?.gameType === 'vibeCode' && (
              <AppGallery 
                submissions={appSubs}
                onDemo={(code, title) => setDemoApp({ code, title })}
              />
            )}
          </div>
          
          {/* Right Column */}
          <div className="col-span-3 space-y-5">
            <Leaderboard players={players} />
            <PlayerGrid players={players} />
            <PhaseControls room={room} gameCode={gameCode} phases={phases} />
          </div>
        </div>
        
        {/* Tip */}
        <div className="mt-5 text-center py-3 bg-white/5 rounded-xl">
          <p className="text-white/40 text-sm">
            Tip: Press F11 for fullscreen. Connect to a projector for presentations!
          </p>
        </div>
      </div>
      
      {/* Demo Modal */}
      {demoApp && (
        <FullscreenDemo
          code={demoApp.code}
          title={demoApp.title}
          onClose={() => setDemoApp(null)}
        />
      )}
    </div>
  );
};

// Projector Display
export const ProjectorDisplay = ({ room }) => {
  const players = Object.values(room?.players || {});
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">{'</>'}</div>
        <h1 className="text-5xl font-black text-white mb-4">WAITING FOR PLAYERS</h1>
        <div className="text-7xl font-mono font-black text-emerald-400 mb-8">{room?.code}</div>
        <p className="text-xl text-white/60 mb-8">Join at artificial.game</p>
        
        <div className="flex flex-wrap justify-center gap-3">
          {players.map(p => (
            <span key={p.id} className="bg-white/10 text-white px-4 py-2 rounded-full">
              {p.name}
            </span>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 bg-black/50 px-4 py-2 rounded-full">
        <span className="text-white/60">Code: </span>
        <span className="text-emerald-400 font-mono font-bold">{room?.code}</span>
      </div>
    </div>
  );
};

export default FacilitatorDashboard;

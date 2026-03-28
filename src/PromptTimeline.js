// PROMPT TIMELINE - Shared prompt history/replay component
// Track, visualize, and learn from all AI prompts during a session

import React, { useState, useContext, createContext, useCallback } from 'react';

// ============================================
// CONTEXT & HOOK
// ============================================

const PromptTimelineContext = createContext(null);

export const PromptTimelineProvider = ({ children, game }) => {
  const [history, setHistory] = useState([]);

  const addEntry = useCallback((entry) => {
    setHistory(prev => [...prev, {
      id: `prompt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      game: game || 'unknown',
      ...entry,
    }]);
  }, [game]);

  const clearHistory = useCallback(() => setHistory([]), []);

  return (
    <PromptTimelineContext.Provider value={{ history, addEntry, clearHistory }}>
      {children}
    </PromptTimelineContext.Provider>
  );
};

export const usePromptTimeline = () => {
  const ctx = useContext(PromptTimelineContext);
  if (!ctx) return { history: [], addEntry: () => {}, clearHistory: () => {} };
  return ctx;
};

// ============================================
// PROMPT ENTRY CARD
// ============================================

const PromptEntry = ({ entry, index }) => {
  const [expanded, setExpanded] = useState(false);

  const stageColors = {
    problem: 'border-red-500 bg-red-500/10',
    users: 'border-blue-500 bg-blue-500/10',
    features: 'border-emerald-500 bg-emerald-500/10',
    twist: 'border-purple-500 bg-purple-500/10',
    style: 'border-amber-500 bg-amber-500/10',
    build: 'border-cyan-500 bg-cyan-500/10',
    iterate: 'border-orange-500 bg-orange-500/10',
    issue: 'border-green-500 bg-green-500/10',
    prompt: 'border-yellow-500 bg-yellow-500/10',
    enhance: 'border-indigo-500 bg-indigo-500/10',
    generate: 'border-pink-500 bg-pink-500/10',
    caption: 'border-teal-500 bg-teal-500/10',
    critique: 'border-rose-500 bg-rose-500/10',
  };

  const stageIcons = {
    problem: '🎯', users: '👥', features: '⚡', twist: '✨', style: '🎨',
    build: '🔨', iterate: '🔄', issue: '📢', prompt: '💭', enhance: '🚀',
    generate: '🖼️', caption: '💬', critique: '🔍',
  };

  const colorClass = stageColors[entry.stage] || 'border-slate-500 bg-slate-500/10';
  const icon = stageIcons[entry.stage] || '📝';
  const timeStr = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`border-l-4 rounded-r-xl p-3 mb-3 ${colorClass} cursor-pointer transition-all hover:brightness-110`} onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{entry.stage}</span>
          {entry.wasEnhanced && <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full">Enhanced</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{timeStr}</span>
          <span className="text-xs text-slate-500">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      <p className="text-sm text-white/70 mt-1 line-clamp-2">{entry.originalPrompt}</p>

      {expanded && (
        <div className="mt-3 space-y-3">
          {/* Original Prompt */}
          <div className="bg-black/20 rounded-lg p-3">
            <p className="text-xs font-bold text-slate-400 mb-1">YOUR PROMPT</p>
            <p className="text-sm text-white/80">{entry.originalPrompt}</p>
          </div>

          {/* Enhanced Prompt */}
          {entry.wasEnhanced && entry.enhancedPrompt && (
            <div className="bg-cyan-900/20 rounded-lg p-3 border border-cyan-500/20">
              <p className="text-xs font-bold text-cyan-400 mb-1">ENHANCED VERSION</p>
              <p className="text-sm text-white/80">{entry.enhancedPrompt}</p>
            </div>
          )}

          {/* AI Response */}
          {entry.aiResponse && (
            <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
              <p className="text-xs font-bold text-purple-400 mb-1">AI RESPONSE</p>
              <p className="text-sm text-white/70 line-clamp-4">{entry.aiResponse}</p>
            </div>
          )}

          {/* Provider */}
          {entry.provider && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Model: {entry.provider}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// PROMPT INSIGHTS
// ============================================

const PromptInsights = ({ history }) => {
  const totalPrompts = history.length;
  const enhancedCount = history.filter(h => h.wasEnhanced).length;
  const enhancementRate = totalPrompts > 0 ? Math.round((enhancedCount / totalPrompts) * 100) : 0;
  const avgLength = totalPrompts > 0 ? Math.round(history.reduce((sum, h) => sum + (h.originalPrompt?.length || 0), 0) / totalPrompts) : 0;

  const stages = {};
  history.forEach(h => { stages[h.stage] = (stages[h.stage] || 0) + 1; });
  const mostActiveStage = Object.entries(stages).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
      <h4 className="text-sm font-bold text-white mb-3">Session Insights</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-700/50 rounded-lg p-2 text-center">
          <div className="text-2xl font-black text-cyan-400">{totalPrompts}</div>
          <div className="text-xs text-slate-400">Total Prompts</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-2 text-center">
          <div className="text-2xl font-black text-purple-400">{enhancementRate}%</div>
          <div className="text-xs text-slate-400">Enhanced</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-2 text-center">
          <div className="text-2xl font-black text-amber-400">{avgLength}</div>
          <div className="text-xs text-slate-400">Avg Length</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-2 text-center">
          <div className="text-lg font-black text-emerald-400 capitalize">{mostActiveStage?.[0] || '-'}</div>
          <div className="text-xs text-slate-400">Most Active</div>
        </div>
      </div>

      {totalPrompts > 3 && (
        <div className="mt-3 p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <p className="text-xs text-cyan-300">
            {enhancementRate > 50
              ? "You're using AI enhancements well! Notice how enhanced prompts get better results."
              : avgLength > 50
              ? "Your prompts are detailed! Specific descriptions help AI understand your vision."
              : "Try writing longer, more descriptive prompts. The more detail you give AI, the better the results!"}
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================
// SIDEBAR COMPONENT
// ============================================

export const PromptTimelineSidebar = ({ isOpen, onClose }) => {
  const { history } = usePromptTimeline();
  const [filter, setFilter] = useState('all');

  const filteredHistory = filter === 'all'
    ? history
    : history.filter(h => h.wasEnhanced === (filter === 'enhanced'));

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-slate-900 border-l border-slate-700 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📜</span> Prompt Timeline
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">&times;</button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'enhanced', label: 'Enhanced' },
                { id: 'original', label: 'Original Only' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === f.id ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {history.length > 0 && <PromptInsights history={history} />}

            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-slate-400 text-sm">
                  {history.length === 0
                    ? "No prompts yet! Start creating to see your timeline."
                    : "No prompts match this filter."}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-500 mb-3">{filteredHistory.length} prompt{filteredHistory.length !== 1 ? 's' : ''}</p>
                {[...filteredHistory].reverse().map((entry, i) => (
                  <PromptEntry key={entry.id} entry={entry} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-slate-700">
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-1">Study your prompts to improve!</p>
                <p className="text-xs text-cyan-400">
                  Look for patterns: Which prompts got the best results? What details made the difference?
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ============================================
// TOGGLE BUTTON
// ============================================

export const PromptTimelineButton = ({ onClick }) => {
  const { history } = usePromptTimeline();

  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-40 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-full text-sm font-medium border border-slate-700 flex items-center gap-2 transition-colors shadow-lg"
    >
      <span>📜</span>
      <span className="hidden sm:inline">Prompts</span>
      {history.length > 0 && (
        <span className="bg-cyan-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {history.length}
        </span>
      )}
    </button>
  );
};

export default PromptTimelineSidebar;

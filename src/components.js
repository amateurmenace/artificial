// Shared UI Components for ARTIFICIAL
import React, { useState, useEffect, useRef } from 'react';

// ============================================
// BASIC COMPONENTS
// ============================================

export const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="flex flex-col gap-1">
      <div className="w-10 h-2 bg-[#3d5a4c] rounded-full"></div>
      <div className="w-10 h-2 bg-[#48a89a] rounded-full"></div>
    </div>
    <div>
      <div className="text-2xl font-bold text-[#3d5a4c] tracking-wider">ARTIFICIAL</div>
      <div className="text-xs font-medium text-[#48a89a] tracking-wide">games for ai literacy</div>
    </div>
  </div>
);

export const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', loading = false, type = 'button', style = {} }) => {
  const variants = {
    primary: 'bg-[#3d5a4c] hover:bg-[#4a6b5a] text-white',
    secondary: 'bg-white border-2 border-[#3d5a4c] text-[#3d5a4c] hover:bg-[#f5f3ef]',
    accent: 'bg-[#48a89a] hover:bg-[#5bc4b4] text-white',
    ghost: 'bg-transparent hover:bg-[#e2e0dc] text-[#3d5a4c]',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    custom: '',
  };
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      className={`${sizes[size]} rounded-lg font-medium transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {loading && <span className="animate-spin">â³</span>}
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', onClick, hover = false, padding = 'p-6' }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl border border-[#e2e0dc] shadow-sm ${padding}
      ${hover ? 'cursor-pointer hover:shadow-md hover:border-[#48a89a] transition-all' : ''} ${className}`}
  >
    {children}
  </div>
);

export const Input = ({ label, placeholder, value, onChange, type = 'text', multiline = false, disabled = false, error, hint }) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium text-[#3d5a4c]">{label}</label>}
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-[#e2e0dc]'} focus:border-[#48a89a] focus:outline-none focus:ring-2 focus:ring-[#48a89a]/20 transition-all resize-none disabled:bg-gray-100`}
        rows={4}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-[#e2e0dc]'} focus:border-[#48a89a] focus:outline-none focus:ring-2 focus:ring-[#48a89a]/20 transition-all disabled:bg-gray-100`}
      />
    )}
    {hint && <p className="text-xs text-[#6b7c74]">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export const Timer = ({ seconds, onComplete, paused = false, extension = 0 }) => {
  const [time, setTime] = useState(seconds + extension);
  
  useEffect(() => {
    setTime(seconds + extension);
  }, [seconds, extension]);
  
  useEffect(() => {
    if (paused || time <= 0) {
      if (time <= 0) onComplete?.();
      return;
    }
    const interval = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [time, onComplete, paused]);
  
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  const isLow = time <= 60;
  
  return (
    <div className="flex items-center gap-2">
      {paused && <span className="text-yellow-500">â¸ï¸</span>}
      <div className={`font-mono text-2xl font-bold ${isLow ? 'text-red-500 animate-pulse' : 'text-[#3d5a4c]'}`}>
        {mins}:{secs.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export const ProgressSteps = ({ steps, currentStep, onStepClick }) => (
  <div className="flex items-center gap-2">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <button
          onClick={() => onStepClick?.(i)}
          disabled={!onStepClick}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${i < currentStep 
              ? 'bg-[#48a89a] text-white' 
              : i === currentStep 
                ? 'bg-[#3d5a4c] text-white ring-4 ring-[#3d5a4c]/20' 
                : 'bg-[#e2e0dc] text-[#6b7c74]'}
            ${onStepClick ? 'cursor-pointer hover:scale-110' : ''}`}
        >
          {i < currentStep ? 'âœ“' : i + 1}
        </button>
        {i < steps.length - 1 && (
          <div className={`h-1 w-8 rounded ${i < currentStep ? 'bg-[#48a89a]' : 'bg-[#e2e0dc]'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

export const PlayerList = ({ players, currentUserId, showScores = true }) => (
  <div className="space-y-2">
    <div className="text-sm font-medium text-[#3d5a4c]">Players ({players?.length || 0})</div>
    <div className="flex flex-wrap gap-2">
      {players?.map((player, i) => (
        <div 
          key={player.id || i}
          className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-all
            ${player.id === currentUserId ? 'bg-[#48a89a] text-white' : 'bg-[#f5f3ef] text-[#3d5a4c]'}`}
        >
          {player.isHost && <span>ðŸ‘‘</span>}
          <span>{player.name}</span>
          {showScores && player.score > 0 && <span className="font-bold">({player.score})</span>}
        </div>
      ))}
    </div>
  </div>
);

export const ScoreDisplay = ({ score, label = 'Score', size = 'md' }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };
  return (
    <div className="text-center">
      <div className={`font-bold text-[#48a89a] ${sizes[size]}`}>{score}</div>
      <div className="text-xs text-[#6b7c74]">{label}</div>
    </div>
  );
};

// ============================================
// IMAGE COMPONENTS
// ============================================

export const ImageUploader = ({ onUpload, uploading, accept = 'image/*', preview = null }) => {
  const fileInputRef = useRef(null);
  
  return (
    <div 
      onClick={() => !uploading && fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
        ${uploading ? 'border-[#48a89a] bg-[#48a89a]/10' : 'border-[#e2e0dc] hover:border-[#48a89a] hover:bg-[#f5f3ef]'}`}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept={accept} 
        onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
        className="hidden"
      />
      {preview ? (
        <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
      ) : uploading ? (
        <div className="text-[#48a89a]">
          <div className="text-4xl animate-spin mb-2">â³</div>
          <div>Uploading...</div>
        </div>
      ) : (
        <div>
          <div className="text-4xl mb-2">ðŸ“¤</div>
          <div className="text-[#3d5a4c] font-medium">Click to upload</div>
          <div className="text-xs text-[#6b7c74]">PNG, JPG, GIF up to 10MB</div>
        </div>
      )}
    </div>
  );
};

export const ImageCard = ({ src, alt, onClick, selected, label, overlay }) => (
  <div 
    onClick={onClick}
    className={`relative rounded-xl overflow-hidden cursor-pointer transition-all
      ${selected ? 'ring-4 ring-[#48a89a] scale-[1.02]' : 'hover:shadow-lg'}`}
  >
    <img src={src} alt={alt} className="w-full h-48 object-cover" />
    {overlay && (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="text-white text-center">{overlay}</div>
      </div>
    )}
    {label && (
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-3">
        <div className="text-white text-sm font-medium">{label}</div>
      </div>
    )}
    {selected && (
      <div className="absolute top-2 right-2 w-8 h-8 bg-[#48a89a] rounded-full flex items-center justify-center text-white">
        âœ“
      </div>
    )}
  </div>
);

// ============================================
// FEEDBACK COMPONENTS
// ============================================

export const Alert = ({ type = 'info', children, onClose }) => {
  const types = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };
  const icons = {
    info: 'â„¹ï¸',
    success: 'âœ…',
    warning: 'âš ï¸',
    error: 'âŒ',
  };
  
  return (
    <div className={`${types[type]} border rounded-xl p-4 flex items-start gap-3`}>
      <span>{icons[type]}</span>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="opacity-50 hover:opacity-100">Ã—</button>
      )}
    </div>
  );
};

export const ScoreBar = ({ scores, maxScore = 10 }) => (
  <div className="space-y-2">
    {Object.entries(scores).map(([label, value]) => (
      <div key={label} className="flex items-center gap-3">
        <div className="w-32 text-sm text-[#6b7c74]">{label}</div>
        <div className="flex-1 h-3 bg-[#e2e0dc] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#48a89a] to-[#3d5a4c] transition-all duration-500"
            style={{ width: `${(value / maxScore) * 100}%` }}
          />
        </div>
        <div className="w-8 text-right font-bold text-[#3d5a4c]">{value}</div>
      </div>
    ))}
  </div>
);

export const ReactionBar = ({ reactions, onReact }) => {
  const reactionTypes = [
    { emoji: 'ðŸ˜‚', name: 'funny', label: 'Funny' },
    { emoji: 'â¤ï¸', name: 'love', label: 'Love' },
    { emoji: 'ðŸ˜®', name: 'wow', label: 'Wow' },
    { emoji: 'ðŸ˜ ', name: 'angry', label: 'Angry' },
    { emoji: 'ðŸ”„', name: 'share', label: 'Share' },
  ];
  
  return (
    <div className="flex gap-2 flex-wrap">
      {reactionTypes.map(({ emoji, name, label }) => (
        <button
          key={name}
          onClick={() => onReact(name)}
          className="flex items-center gap-1 px-3 py-2 rounded-full border border-[#e2e0dc] hover:border-[#48a89a] hover:bg-[#48a89a]/10 hover:scale-105 transition-all"
          title={label}
        >
          <span className="text-lg">{emoji}</span>
          <span className="text-sm font-medium text-[#3d5a4c]">{reactions?.[name] || 0}</span>
        </button>
      ))}
    </div>
  );
};

// ============================================
// MODAL & OVERLAY COMPONENTS
// ============================================

export const Modal = ({ isOpen, onClose, title, children, size = 'md', showClose = true }) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        {(title || showClose) && (
          <div className="flex justify-between items-center p-4 border-b border-[#e2e0dc]">
            {title && <h2 className="text-xl font-bold text-[#3d5a4c]">{title}</h2>}
            {showClose && (
              <button onClick={onClose} className="text-[#6b7c74] hover:text-[#3d5a4c] text-2xl">
                Ã—
              </button>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-[#6b7c74] mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
      <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
    </div>
  </Modal>
);

// ============================================
// BADGE COMPONENT
// ============================================

export const Badge = ({ game, playerName, onExport }) => {
  const badges = {
    spotTheFake: { title: 'Truth Detective', icon: 'ðŸ”', color: '#48a89a' },
    memeMachine: { title: 'Viral Visionary', icon: 'ðŸš€', color: '#d4a84b' },
    vibeCode: { title: 'Civic Coder', icon: 'ðŸ’»', color: '#6b8cce' },
  };
  const badge = badges[game] || badges.spotTheFake;
  
  return (
    <div className="inline-flex flex-col items-center p-8 bg-gradient-to-br from-white to-[#f5f3ef] rounded-2xl border-2 border-[#e2e0dc] shadow-lg">
      <div 
        className="w-28 h-28 rounded-full flex items-center justify-center text-5xl mb-4 shadow-inner"
        style={{ backgroundColor: badge.color + '20', border: `4px solid ${badge.color}` }}
      >
        {badge.icon}
      </div>
      <div className="text-xl font-bold text-[#3d5a4c]">{badge.title}</div>
      <div className="text-[#6b7c74]">{playerName}</div>
      <div className="text-xs text-[#6b7c74] mt-2 mb-4">ARTIFICIAL: Games for AI Literacy</div>
      {onExport && (
        <Button variant="secondary" size="sm" onClick={onExport}>
          ðŸ“¥ Export Badge
        </Button>
      )}
    </div>
  );
};

// ============================================
// AI CHAT ASSISTANT
// ============================================

export const AIChatAssistant = ({ context, placeholder, onResponse, disabled, initialMessage }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(initialMessage ? [{ role: 'assistant', content: initialMessage }] : []);
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);
  
  const sendMessage = async () => {
    if (!message.trim() || loading || disabled) return;
    
    const userMessage = message;
    setMessage('');
    setHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    
    try {
      const { chatCompletion } = await import('./ai-services');
      const messages = [
        { role: 'system', content: context },
        ...history,
        { role: 'user', content: userMessage }
      ];
      
      const response = await chatCompletion(messages);
      setHistory(prev => [...prev, { role: 'assistant', content: response }]);
      onResponse?.(response);
    } catch (error) {
      setHistory(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="border border-[#e2e0dc] rounded-xl overflow-hidden">
      <div className="h-56 overflow-y-auto p-4 bg-[#f5f3ef] space-y-3">
        {history.length === 0 && (
          <div className="text-[#6b7c74] text-center py-8">
            <div className="text-3xl mb-2">ðŸ¤–</div>
            <div>Ask the AI assistant for help!</div>
          </div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-[#3d5a4c] text-white ml-12' : 'bg-white mr-12 shadow-sm'}`}>
            <div className="text-xs opacity-70 mb-1">{msg.role === 'user' ? 'You' : 'ðŸ¤– AI Assistant'}</div>
            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="bg-white p-3 rounded-lg mr-12 shadow-sm">
            <div className="text-xs opacity-70 mb-1">ðŸ¤– AI Assistant</div>
            <div className="text-sm flex items-center gap-2">
              <span className="animate-pulse">Thinking</span>
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2 p-3 bg-white border-t border-[#e2e0dc]">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={placeholder || "Ask AI for help..."}
          disabled={disabled || loading}
          className="flex-1 px-3 py-2 border border-[#e2e0dc] rounded-lg text-sm focus:outline-none focus:border-[#48a89a] disabled:bg-gray-100"
        />
        <Button size="sm" onClick={sendMessage} loading={loading} disabled={disabled}>
          Send
        </Button>
      </div>
    </div>
  );
};

// ============================================
// CODE PREVIEW COMPONENT - FIXED
// ============================================

export const CodePreview = ({ code, onEdit, height = '600px' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    if (code) {
      setKey(k => k + 1);
    }
  }, [code]);
  
  const handleRefresh = () => setKey(k => k + 1);
  
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-app.html';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (!code) {
    return (
      <div className="border-2 border-[#e2e0dc] rounded-2xl overflow-hidden shadow-lg">
        <div className="flex justify-center items-center bg-gradient-to-br from-[#f5f3ef] to-[#e8e6e2]" style={{ height }}>
          <div className="text-center text-[#6b7c74]">
            <div className="text-6xl mb-4 animate-pulse">📱</div>
            <div className="text-xl font-medium">Your app will appear here</div>
            <div className="text-sm mt-2 opacity-70">Start building to see the preview</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900 p-4' : 'relative'}`}>
      <div className={`bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700 ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
        <div className="flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer" onClick={() => setIsFullscreen(true)}></div>
            </div>
            <span className="text-sm font-medium text-gray-300">🖥️ App Preview</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleRefresh} className="text-gray-400 hover:text-white px-2 py-1 rounded text-sm hover:bg-gray-700 transition-all" title="Refresh">🔄</button>
            <button onClick={() => setShowCode(!showCode)} className={`px-2 py-1 rounded text-sm transition-all ${showCode ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>{showCode ? '📱' : '💻'}</button>
            {onEdit && <button onClick={onEdit} className="text-gray-400 hover:text-white px-2 py-1 rounded text-sm hover:bg-gray-700 transition-all">✏️</button>}
            <button onClick={handleDownload} className="text-gray-400 hover:text-white px-2 py-1 rounded text-sm hover:bg-gray-700 transition-all">⬇️</button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-gray-400 hover:text-white px-2 py-1 rounded text-sm hover:bg-gray-700 transition-all">{isFullscreen ? '🗕' : '⛶'}</button>
          </div>
        </div>
        <div className={isFullscreen ? 'flex-1 overflow-hidden' : ''} style={!isFullscreen ? { height } : {}}>
          {showCode ? (
            <pre className="h-full overflow-auto p-4 text-sm text-green-400 bg-gray-950 font-mono">{code}</pre>
          ) : (
            <iframe key={key} title="App Preview" srcDoc={code} className="w-full h-full bg-white" sandbox="allow-scripts allow-forms allow-modals" style={{ border: 'none' }} />
          )}
        </div>
      </div>
      {isFullscreen && (
        <button onClick={() => setIsFullscreen(false)} className="absolute top-8 right-8 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full font-medium backdrop-blur-sm">✕ Close</button>
      )}
    </div>
  );
};


export const CodeEditor = ({ code, onChange, language = 'html' }) => {
  return (
    <div className="border border-[#e2e0dc] rounded-xl overflow-hidden">
      <div className="px-4 py-2 bg-gray-800 flex justify-between items-center">
        <span className="text-sm text-gray-400">{language.toUpperCase()}</span>
        <Button size="xs" variant="ghost" onClick={() => navigator.clipboard.writeText(code)} className="text-gray-400">
          ðŸ“‹ Copy
        </Button>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none resize-none"
        spellCheck={false}
      />
    </div>
  );
};

// ============================================
// CODE STREAMING ANIMATION
// ============================================

export const CodeStreamingAnimation = ({ code, onComplete, speed = 5 }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!code || currentIndex >= code.length) {
      if (code && currentIndex >= code.length && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
      return;
    }
    
    // Add characters in chunks for faster rendering
    const chunkSize = Math.max(1, Math.floor(speed));
    const timer = setTimeout(() => {
      const nextChunk = code.slice(currentIndex, currentIndex + chunkSize);
      setDisplayedCode(prev => prev + nextChunk);
      setCurrentIndex(prev => prev + chunkSize);
    }, 10);
    
    return () => clearTimeout(timer);
  }, [code, currentIndex, speed, onComplete, isComplete]);
  
  useEffect(() => {
    // Auto-scroll to bottom
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedCode]);
  
  // Reset when code changes
  useEffect(() => {
    setDisplayedCode('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [code]);
  
  const progress = code ? Math.round((currentIndex / code.length) * 100) : 0;
  
  return (
    <div className="border border-[#e2e0dc] rounded-xl overflow-hidden">
      {/* Terminal header */}
      <div className="px-4 py-2 bg-gray-900 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-400 text-sm ml-2 font-mono">BYTE is coding...</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">{progress}%</div>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Code display */}
      <div 
        ref={containerRef}
        className="h-80 overflow-auto bg-gray-950 p-4 font-mono text-sm"
      >
        <pre className="text-green-400 whitespace-pre-wrap break-all">
          {displayedCode}
          {!isComplete && <span className="animate-pulse text-green-300">â–‹</span>}
        </pre>
      </div>
      
      {/* Status bar */}
      <div className="px-4 py-2 bg-gray-900 border-t border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!isComplete ? (
            <>
              <span className="animate-spin text-green-400">âš¡</span>
              <span className="text-green-400 text-sm">Generating code...</span>
            </>
          ) : (
            <>
              <span className="text-green-400">âœ“</span>
              <span className="text-green-400 text-sm">Code complete!</span>
            </>
          )}
        </div>
        <div className="text-gray-500 text-xs">
          {displayedCode.length.toLocaleString()} characters
        </div>
      </div>
    </div>
  );
};

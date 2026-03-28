// ACCESSIBILITY CHALLENGE - Bonus Mini-Game
// Evaluate AI outputs for accessibility: color contrast, alt text, ARIA, keyboard nav
// Educational round teaching WCAG basics through hands-on evaluation

import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, ShareableResultCard } from './components';
import { updateGamePhase, updatePlayerScore, submitToGame, submitVote } from './firebase';
import { playCelebration, playDing } from './sounds';

// ============================================
// CHALLENGE DATA
// ============================================

const CHALLENGES = [
  {
    id: 'contrast-1',
    type: 'contrast',
    title: 'Color Contrast Check',
    description: 'Which color combination meets WCAG AA contrast requirements for normal text?',
    options: [
      { id: 'a', preview: { bg: '#1e293b', fg: '#f8fafc', label: 'Dark blue + White' }, correct: true, ratio: '15.3:1' },
      { id: 'b', preview: { bg: '#e2e8f0', fg: '#94a3b8', label: 'Light gray + Medium gray' }, correct: false, ratio: '2.1:1' },
      { id: 'c', preview: { bg: '#fef3c7', fg: '#f59e0b', label: 'Light yellow + Amber' }, correct: false, ratio: '1.8:1' },
    ],
    explanation: 'WCAG AA requires a minimum contrast ratio of 4.5:1 for normal text. Dark backgrounds with light text typically achieve the best ratios.',
    tip: 'Use tools like WebAIM Contrast Checker to verify your color choices meet accessibility standards.',
  },
  {
    id: 'contrast-2',
    type: 'contrast',
    title: 'Button Contrast',
    description: 'Which button design is accessible to users with low vision?',
    options: [
      { id: 'a', preview: { bg: '#10b981', fg: '#ffffff', label: 'Green + White' }, correct: true, ratio: '4.6:1' },
      { id: 'b', preview: { bg: '#86efac', fg: '#ffffff', label: 'Light green + White' }, correct: false, ratio: '1.5:1' },
      { id: 'c', preview: { bg: '#fbbf24', fg: '#ffffff', label: 'Yellow + White' }, correct: false, ratio: '1.3:1' },
    ],
    explanation: 'Light colors on white backgrounds fail contrast requirements. Green (#10b981) on white barely passes at 4.6:1.',
    tip: 'Never rely on color alone to convey information. Add icons, underlines, or patterns as secondary indicators.',
  },
  {
    id: 'alt-text-1',
    type: 'alt-text',
    title: 'Best Alt Text',
    description: 'An AI generated a photo of a golden retriever catching a frisbee in a park. Which alt text is best?',
    options: [
      { id: 'a', text: 'image.jpg', correct: false },
      { id: 'b', text: 'Dog', correct: false },
      { id: 'c', text: 'Golden retriever leaping to catch a red frisbee in a sunny park', correct: true },
    ],
    explanation: 'Good alt text describes the content AND context of an image. "Dog" is too vague, and filenames are meaningless to screen readers.',
    tip: 'Ask: "If I could not see this image, what would I need to know?" That is your alt text.',
  },
  {
    id: 'alt-text-2',
    type: 'alt-text',
    title: 'Decorative Image',
    description: 'A website has a decorative swirl pattern between sections. What should the alt text be?',
    options: [
      { id: 'a', text: 'Decorative swirl pattern divider', correct: false },
      { id: 'b', text: '' , correct: true, display: 'Empty string (alt="")' },
      { id: 'c', text: 'image', correct: false },
    ],
    explanation: 'Purely decorative images should have empty alt text (alt="") so screen readers skip them. Describing decorations adds noise.',
    tip: 'Use alt="" (empty) for decorative images. Screen readers will ignore them entirely, reducing clutter for users.',
  },
  {
    id: 'aria-1',
    type: 'aria',
    title: 'Missing ARIA',
    description: 'This hamburger menu button has no text label. What attribute should be added?',
    codeSnippet: '<button class="menu-btn">\n  <svg><!-- 3 horizontal lines --></svg>\n</button>',
    options: [
      { id: 'a', text: 'aria-label="Open navigation menu"', correct: true },
      { id: 'b', text: 'title="Menu"', correct: false },
      { id: 'c', text: 'role="menu"', correct: false },
    ],
    explanation: 'aria-label provides an accessible name for elements without visible text. title is a tooltip (not reliably read), and role="menu" describes the menu content, not the button.',
    tip: 'Every interactive element needs an accessible name. For icon-only buttons, use aria-label to describe the action.',
  },
  {
    id: 'aria-2',
    type: 'aria',
    title: 'Live Regions',
    description: 'A chat app shows new messages in real-time. How should the message container be marked for screen readers?',
    codeSnippet: '<div class="messages">\n  <!-- new messages appear here -->\n</div>',
    options: [
      { id: 'a', text: 'aria-live="polite"', correct: true },
      { id: 'b', text: 'aria-hidden="true"', correct: false },
      { id: 'c', text: 'role="alert"', correct: false },
    ],
    explanation: 'aria-live="polite" announces new content when the user is idle. role="alert" is too aggressive for chat messages, and aria-hidden would hide them entirely!',
    tip: 'Use aria-live="polite" for non-urgent updates and aria-live="assertive" (or role="alert") only for critical notifications.',
  },
  {
    id: 'keyboard-1',
    type: 'keyboard',
    title: 'Keyboard Navigation',
    description: 'A custom dropdown menu is built with div elements. What is needed for keyboard accessibility?',
    options: [
      { id: 'a', text: 'Add tabindex="0", role="listbox", and arrow key handlers', correct: true },
      { id: 'b', text: 'Just add tabindex="0" to each item', correct: false },
      { id: 'c', text: 'Add onclick handlers to each item', correct: false },
    ],
    explanation: 'Custom components need both focusability (tabindex) AND the right ARIA role AND keyboard interaction patterns. Click handlers alone do not help keyboard users.',
    tip: 'Whenever possible, use native HTML elements (select, button) instead of custom ones. They come with free keyboard support!',
  },
  {
    id: 'keyboard-2',
    type: 'keyboard',
    title: 'Focus Management',
    description: 'When a modal dialog opens, what should happen with keyboard focus?',
    options: [
      { id: 'a', text: 'Focus should move to the first interactive element inside the modal', correct: true },
      { id: 'b', text: 'Focus should stay where it was', correct: false },
      { id: 'c', text: 'Focus should move to the modal title', correct: false },
    ],
    explanation: 'When a modal opens, focus should move inside it and be trapped there until it closes. This prevents keyboard users from interacting with content behind the modal.',
    tip: 'A focus trap ensures Tab and Shift+Tab cycle only through elements inside the modal. Escape should close it.',
  },
];

const CHALLENGE_TYPES = {
  contrast: { name: 'Color Contrast', icon: '🎨', color: 'from-purple-500 to-pink-500' },
  'alt-text': { name: 'Alt Text', icon: '🖼️', color: 'from-cyan-500 to-blue-500' },
  aria: { name: 'ARIA Labels', icon: '🏷️', color: 'from-amber-500 to-orange-500' },
  keyboard: { name: 'Keyboard Nav', icon: '⌨️', color: 'from-emerald-500 to-teal-500' },
};

const FloatingParticles = ({ count = 20 }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="absolute rounded-full opacity-20 animate-pulse" style={{
        width: `${Math.random() * 6 + 2}px`, height: `${Math.random() * 6 + 2}px`,
        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
        backgroundColor: ['#22d3ee', '#a855f7', '#f59e0b', '#10b981'][i % 4],
        animationDelay: `${Math.random() * 5}s`, animationDuration: `${Math.random() * 3 + 2}s`,
      }} />
    ))}
  </div>
);

// ============================================
// CHALLENGE COMPONENTS
// ============================================

const ContrastPreview = ({ bg, fg, label }) => (
  <div className="rounded-xl p-4 text-center font-bold" style={{ backgroundColor: bg, color: fg, minHeight: 60 }}>
    {label || 'Sample Text'}
  </div>
);

const CodeSnippet = ({ code }) => (
  <pre className="bg-slate-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto whitespace-pre-wrap">{code}</pre>
);

// ============================================
// MAIN COMPONENT
// ============================================

const AccessibilityChallenge = ({ gameCode, room, userId, isHost, onBack, onOpenDashboard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState('intro'); // intro, play, results

  const challenge = CHALLENGES[currentIndex];
  const typeInfo = challenge ? CHALLENGE_TYPES[challenge.type] : null;
  const progress = ((currentIndex + 1) / CHALLENGES.length) * 100;

  const handleAnswer = (optionId) => {
    if (showExplanation) return;
    setSelectedAnswer(optionId);
    setShowExplanation(true);
    const option = challenge.options.find(o => o.id === optionId);
    if (option?.correct) {
      setScore(s => s + 10);
      playDing();
    }
    setAnswers(prev => [...prev, { challengeId: challenge.id, answer: optionId, correct: option?.correct }]);
  };

  const handleNext = () => {
    if (currentIndex < CHALLENGES.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setPhase('results');
      if (isHost && gameCode) {
        updatePlayerScore(gameCode, userId, score);
      }
    }
  };

  const renderIntro = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <FloatingParticles count={25} />
      <div className="max-w-3xl mx-auto py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">♿</div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">ACCESSIBILITY CHALLENGE</h1>
          <p className="text-purple-300 text-lg">Can you make AI outputs accessible to everyone?</p>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-6 border border-purple-500/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">What You'll Learn</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(CHALLENGE_TYPES).map(([key, type]) => (
              <div key={key} className={`bg-gradient-to-br ${type.color} rounded-xl p-3 text-center`}>
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-xs font-bold text-white">{type.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
          <h3 className="text-white font-bold mb-3">Why Accessibility Matters</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• Over 1 billion people worldwide live with some form of disability</li>
            <li>• AI-generated content often fails basic accessibility checks</li>
            <li>• Accessible design benefits everyone (captions help in noisy rooms!)</li>
            <li>• WCAG guidelines ensure the web works for all users</li>
          </ul>
        </div>

        <div className="text-center">
          <Button onClick={() => setPhase('play')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 text-xl font-bold rounded-xl">
            Start Challenge ({CHALLENGES.length} questions)
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPlay = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <FloatingParticles count={15} />
      <div className="max-w-3xl mx-auto py-4 sm:py-8 relative z-10">
        {/* Progress bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-sm text-slate-400 font-mono">{currentIndex + 1}/{CHALLENGES.length}</div>
          <div className="text-sm font-bold text-cyan-400">{score} pts</div>
        </div>

        {/* Challenge type badge */}
        {typeInfo && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${typeInfo.color} text-white text-sm font-medium mb-4`}>
            <span>{typeInfo.icon}</span>
            <span>{typeInfo.name}</span>
          </div>
        )}

        {/* Question */}
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">{challenge.title}</h2>
          <p className="text-slate-300">{challenge.description}</p>

          {/* Code snippet if applicable */}
          {challenge.codeSnippet && (
            <div className="mt-4">
              <CodeSnippet code={challenge.codeSnippet} />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {challenge.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.correct;
            let borderColor = 'border-slate-600 hover:border-purple-400';
            if (showExplanation) {
              if (isCorrect) borderColor = 'border-green-500 bg-green-500/10';
              else if (isSelected && !isCorrect) borderColor = 'border-red-500 bg-red-500/10';
              else borderColor = 'border-slate-700 opacity-50';
            } else if (isSelected) {
              borderColor = 'border-purple-500';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={showExplanation}
                className={`w-full text-left rounded-xl p-4 border-2 transition-all ${borderColor} min-h-[56px]`}
              >
                {/* Contrast preview */}
                {challenge.type === 'contrast' && option.preview && (
                  <div className="mb-2">
                    <ContrastPreview {...option.preview} />
                    {showExplanation && <div className="text-xs text-slate-400 mt-1">Ratio: {option.ratio}</div>}
                  </div>
                )}

                {/* Text option */}
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    showExplanation && isCorrect ? 'bg-green-500 text-white' :
                    showExplanation && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {showExplanation && isCorrect ? '✓' : showExplanation && isSelected && !isCorrect ? '✗' : option.id.toUpperCase()}
                  </span>
                  <span className="text-white text-sm sm:text-base font-mono">
                    {option.display || option.text || option.preview?.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="animate-fadeIn">
            <div className={`rounded-2xl p-5 border mb-4 ${
              challenge.options.find(o => o.id === selectedAnswer)?.correct
                ? 'bg-green-900/30 border-green-500/50'
                : 'bg-red-900/30 border-red-500/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{challenge.options.find(o => o.id === selectedAnswer)?.correct ? '✅' : '❌'}</span>
                <span className="font-bold text-white">{challenge.options.find(o => o.id === selectedAnswer)?.correct ? 'Correct!' : 'Not quite!'}</span>
              </div>
              <p className="text-slate-300 text-sm mb-3">{challenge.explanation}</p>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-xs font-bold text-cyan-400 mb-1">Pro Tip</div>
                <p className="text-slate-400 text-xs">{challenge.tip}</p>
              </div>
            </div>
            <div className="text-center">
              <Button onClick={handleNext} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 font-bold rounded-xl">
                {currentIndex < CHALLENGES.length - 1 ? 'Next Challenge' : 'See Results'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderResults = () => {
    const correct = answers.filter(a => a.correct).length;
    const total = CHALLENGES.length;
    const pct = Math.round((correct / total) * 100);
    const byType = {};
    answers.forEach(a => {
      const ch = CHALLENGES.find(c => c.id === a.challengeId);
      if (!ch) return;
      if (!byType[ch.type]) byType[ch.type] = { correct: 0, total: 0 };
      byType[ch.type].total++;
      if (a.correct) byType[ch.type].correct++;
    });

    let award = null;
    if (pct === 100) award = 'Accessibility Champion';
    else if (pct >= 75) award = 'A11y Advocate';
    else if (pct >= 50) award = 'Inclusion Learner';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6" ref={(el) => { if (el) playCelebration(); }}>
        <FloatingParticles count={40} />
        <div className="max-w-2xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">♿</div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">RESULTS</h1>
            {award && <div className="text-xl text-amber-400 font-bold">{award}</div>}
          </div>

          {/* Score card */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-purple-500/30 mb-6 text-center">
            <div className="text-6xl font-black text-cyan-400">{score}</div>
            <div className="text-slate-400">points</div>
            <div className="text-lg text-white mt-2">{correct}/{total} correct ({pct}%)</div>
          </div>

          {/* Breakdown by type */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(byType).map(([type, data]) => {
              const info = CHALLENGE_TYPES[type];
              return (
                <div key={type} className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 text-center">
                  <div className="text-2xl mb-1">{info?.icon}</div>
                  <div className="text-xs font-bold text-white">{info?.name}</div>
                  <div className="text-sm text-cyan-400 font-mono">{data.correct}/{data.total}</div>
                </div>
              );
            })}
          </div>

          {/* Key takeaways */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
            <h3 className="text-white font-bold mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Always check color contrast ratios (minimum 4.5:1 for normal text)</li>
              <li>• Write descriptive alt text; use empty alt for decorative images</li>
              <li>• Add aria-label to icon-only buttons and interactive elements</li>
              <li>• Use native HTML elements when possible for built-in keyboard support</li>
              <li>• Test with a screen reader and keyboard-only navigation</li>
            </ul>
          </div>

          <div className="mt-6">
            <ShareableResultCard
              playerName={room?.players?.find(p => p.id === userId)?.name || 'Player'}
              gameName="Accessibility Challenge"
              score={score}
              award={award}
            />
          </div>

          <div className="text-center mt-6">
            <Button onClick={onBack} className="bg-cyan-600 text-white px-8 py-3 font-bold rounded-xl">Back to Home</Button>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard button for host
  const dashboardBtn = isHost && onOpenDashboard && (
    <button onClick={onOpenDashboard} className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
      Dashboard
    </button>
  );

  return (
    <div>
      {dashboardBtn}
      {phase === 'intro' && renderIntro()}
      {phase === 'play' && renderPlay()}
      {phase === 'results' && renderResults()}
    </div>
  );
};

export default AccessibilityChallenge;

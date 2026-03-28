// GAME SHOWCASE - Enhanced homepage sections for all games
// Scrolling showcase with detailed info, learning outcomes, and examples

import React, { useState, useEffect } from 'react';
import { Button } from './components';

// ============================================
// ANIMATED PREVIEW COMPONENTS (New bonus games)
// ============================================

const ModelComparisonPreview = ({ onClick }) => {
  const [activeModel, setActiveModel] = useState(0);
  const labels = ['Model A', 'Model B', 'Model C'];
  const colors = ['text-cyan-400', 'text-purple-400', 'text-amber-400'];
  const outputs = ['function solve(n) {\n  return n * 2;\n}', 'const solve = n => n + n;', 'def solve(n):\n  return n * 2'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModel(m => (m + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button onClick={onClick} className="relative bg-gradient-to-br from-indigo-900 via-slate-800 to-indigo-900 rounded-2xl p-5 text-left w-full hover:scale-[1.02] transition-all overflow-hidden group border-2 border-indigo-400/50 hover:border-indigo-400 shadow-lg h-[280px] flex flex-col">
      <div className="relative flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">⚔️</span>
          <span className="text-indigo-400 font-bold text-sm uppercase tracking-wider">Model Comparison</span>
          <span className="ml-auto bg-indigo-500/30 text-indigo-300 text-xs px-2 py-1 rounded-full">Bonus</span>
        </div>

        {/* VS display */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-2 w-full">
            {labels.map((label, i) => (
              <div key={i} className={`rounded-lg p-2 transition-all duration-300 ${i === activeModel ? 'bg-slate-700 scale-105 border border-slate-500' : 'bg-slate-800/50 opacity-60'}`}>
                <p className={`text-xs font-bold mb-1 ${colors[i]}`}>{label}</p>
                <pre className="text-[9px] text-slate-400 font-mono line-clamp-3 leading-tight">{outputs[i]}</pre>
              </div>
            ))}
          </div>
        </div>

        {/* VS badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-indigo-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg animate-pulse">VS</div>
        </div>

        <div className="mt-2 text-slate-400 text-xs">Same prompt, different AI results</div>
      </div>
    </button>
  );
};

const RemixPreview = ({ onClick }) => {
  const [phase, setPhase] = useState(0); // 0: original, 1: fork, 2: remix

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button onClick={onClick} className="relative bg-gradient-to-br from-purple-900 via-slate-800 to-purple-900 rounded-2xl p-5 text-left w-full hover:scale-[1.02] transition-all overflow-hidden group border-2 border-purple-400/50 hover:border-purple-400 shadow-lg h-[280px] flex flex-col">
      <div className="relative flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🔀</span>
          <span className="text-purple-400 font-bold text-sm uppercase tracking-wider">Remix Mode</span>
          <span className="ml-auto bg-purple-500/30 text-purple-300 text-xs px-2 py-1 rounded-full">Bonus</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 w-full">
            {/* Original */}
            <div className={`flex-1 rounded-xl p-3 transition-all duration-500 ${phase >= 0 ? 'bg-slate-700 border border-slate-500' : 'bg-slate-800/50'}`}>
              <p className="text-xs text-slate-400 mb-1">Original</p>
              <div className="text-3xl text-center">📱</div>
              <p className="text-xs text-white text-center mt-1">Task App</p>
            </div>

            {/* Arrow */}
            <div className={`text-2xl transition-all duration-500 ${phase >= 1 ? 'text-purple-400 scale-125' : 'text-slate-600'}`}>
              →
            </div>

            {/* Remix */}
            <div className={`flex-1 rounded-xl p-3 transition-all duration-500 ${phase >= 2 ? 'bg-purple-500/20 border border-purple-500/50 scale-105' : 'bg-slate-800/50'}`}>
              <p className="text-xs text-purple-400 mb-1">Remix</p>
              <div className="text-3xl text-center">🚀</div>
              <p className="text-xs text-white text-center mt-1">Task App Pro</p>
            </div>
          </div>
        </div>

        {/* Remix badge */}
        {phase === 2 && (
          <div className="absolute bottom-12 right-4">
            <div className="bg-purple-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg animate-bounce">REMIXED!</div>
          </div>
        )}

        <div className="mt-2 text-slate-400 text-xs">Fork, iterate, collaborate</div>
      </div>
    </button>
  );
};

// ============================================
// LEARNING OUTCOME BADGE
// ============================================

const LearningBadge = ({ icon, text, color }) => (
  <div className={`flex items-center gap-2 bg-${color}-500/10 border border-${color}-500/30 rounded-full px-3 py-1.5`}>
    <span className="text-sm">{icon}</span>
    <span className={`text-xs font-medium text-${color}-300`}>{text}</span>
  </div>
);

// ============================================
// SHOWCASE SECTION COMPONENT
// ============================================

const ShowcaseSection = ({ title, icon, color, gradient, tagline, preview, funPoints, learningOutcomes, example, cta, isBonus, isReversed }) => (
  <section className={`py-16 px-4 ${gradient}`}>
    <div className="max-w-6xl mx-auto">
      <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 items-center`}>
        {/* Preview */}
        <div className="lg:w-5/12 w-full">
          {preview}
        </div>

        {/* Content */}
        <div className="lg:w-7/12 w-full">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{icon}</span>
            <h2 className="text-3xl font-black text-slate-800">{title}</h2>
            {isBonus && <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">BONUS GAME</span>}
          </div>
          <p className="text-lg text-slate-600 mb-6">{tagline}</p>

          {/* What makes it fun */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">What Makes It Fun</h3>
            <div className="space-y-2">
              {funPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg">{point.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{point.title}</p>
                    <p className="text-sm text-slate-500">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What you'll learn */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">What You'll Learn</h3>
            <div className="flex flex-wrap gap-2">
              {learningOutcomes.map((outcome, i) => (
                <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium`} style={{ backgroundColor: `${color}15`, color: color, border: `1px solid ${color}40` }}>
                  <span>{outcome.icon}</span>
                  <span>{outcome.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Example */}
          {example && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Example</h4>
              {example}
            </div>
          )}

          {/* CTA */}
          {cta}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// MAIN GAME SHOWCASE COMPONENT
// ============================================

const GameShowcase = ({ onSelectGame, SpotTheFakePreview, MemeMachinePreview, VibeCodePreview }) => {
  return (
    <div>
      {/* Section header */}
      <div className="py-12 px-4 bg-slate-50 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Explore the Games</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Each game teaches different AI literacy skills through hands-on gameplay. Dive deep into what makes each one special.
        </p>
      </div>

      {/* 1. Spot the Fake */}
      <ShowcaseSection
        title="Spot the Fake"
        icon="🔍"
        color="#14b8a6"
        gradient="bg-gradient-to-br from-teal-50 to-slate-50"
        tagline="Can you tell what's real in an AI world? Sharpen your detection skills and think critically about what you see online."
        preview={<SpotTheFakePreview onClick={() => onSelectGame('spotTheFake')} />}
        funPoints={[
          { icon: '🕵️', title: 'Detective Work', desc: 'Examine images for telltale AI artifacts — distorted hands, impossible text, and suspicious backgrounds' },
          { icon: '🐺', title: 'Werewolf Finale', desc: 'One player secretly has the AI image and must bluff the group. Social deduction meets AI literacy!' },
          { icon: '⚖️', title: 'Ethics Debate', desc: 'Discuss real-world cases where AI fakes caused real harm — from stock market crashes to political manipulation' },
          { icon: '📜', title: 'Legal Landscape', desc: 'Learn what laws exist (and don\'t) around deepfakes and AI-generated content' },
        ]}
        learningOutcomes={[
          { icon: '🔍', text: 'AI Detection' },
          { icon: '🧠', text: 'Critical Thinking' },
          { icon: '⚖️', text: 'Digital Ethics' },
          { icon: '📰', text: 'Media Literacy' },
        ]}
        example={
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-teal-600">Round 1:</span> "Is this sunset photo real?" — Look closely: the clouds are too symmetrical and the water reflection doesn't match.
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-bold text-teal-600">Werewolf Round:</span> "I swear my image is real! Look at the natural lighting..." — Can you spot the liar?
            </p>
          </div>
        }
        cta={
          <Button onClick={() => onSelectGame('spotTheFake')} className="text-white font-bold rounded-xl" style={{ backgroundColor: '#14b8a6' }}>
            Play Spot the Fake
          </Button>
        }
      />

      {/* Divider */}
      <div className="h-px bg-slate-200" />

      {/* 2. Meme Machine */}
      <ShowcaseSection
        title="Meme Machine"
        icon="🚀"
        color="#d97706"
        gradient="bg-gradient-to-br from-amber-50 to-slate-50"
        tagline="Create AI-powered advocacy memes for causes you care about. Learn prompt engineering by making content that goes viral!"
        preview={<MemeMachinePreview onClick={() => onSelectGame('memeMachine')} />}
        isReversed
        funPoints={[
          { icon: '🎨', title: 'AI Image Creation', desc: 'Craft prompts for AI image generation — learn how specificity, style, and mood affect results' },
          { icon: '🦥', title: 'Battle Senor Slop', desc: 'A lazy villain appears when your prompts are too vague! Defeat him by writing better, more detailed prompts' },
          { icon: '📈', title: 'Virality Simulation', desc: 'Watch your meme "go viral" with emoji reactions, comments, and share counts from other players' },
          { icon: '🏆', title: 'Three Awards', desc: 'Win Most Viral (reactions), Most Dank (votes), or Slop Slayer (best prompt engineering)' },
        ]}
        learningOutcomes={[
          { icon: '✍️', text: 'Prompt Engineering' },
          { icon: '🎨', text: 'AI Art Generation' },
          { icon: '📢', text: 'Digital Advocacy' },
          { icon: '🔄', text: 'Iteration Skills' },
        ]}
        example={
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-amber-600">Bad prompt:</span> "climate change" — Senor Slop appears! Too vague.
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-bold text-amber-600">Good prompt:</span> "A dramatic propaganda-style poster of Earth as a patient on a hospital bed, with smokestacks as IV drips, hopeful sunrise in the background" — Now we're talking!
            </p>
          </div>
        }
        cta={
          <Button onClick={() => onSelectGame('memeMachine')} className="text-white font-bold rounded-xl" style={{ backgroundColor: '#d97706' }}>
            Play Meme Machine
          </Button>
        }
      />

      <div className="h-px bg-slate-200" />

      {/* 3. Vibe Code Challenge */}
      <ShowcaseSection
        title="Vibe Code Challenge"
        icon="💻"
        color="#6366f1"
        gradient="bg-gradient-to-br from-indigo-50 to-slate-50"
        tagline="Build real, working web apps by describing what you want. No coding experience needed — you guide the vision, AI writes the code!"
        preview={<VibeCodePreview onClick={() => onSelectGame('vibeCode')} />}
        funPoints={[
          { icon: '🤖', title: 'Meet BYTE', desc: 'Your AI mentor guides you step-by-step through designing your app — from problem to polished product' },
          { icon: '👾', title: 'Battle Villains', desc: 'Face Lord CHAOS, Baron COMPLEXITY, and Captain BUGS — real dev challenges personified as 8-bit bosses' },
          { icon: '📱', title: 'Real Working Apps', desc: 'Your app actually works! See it live in a preview, download it, or deploy it to the web' },
          { icon: '🚀', title: 'Deploy to the Web', desc: 'After building, deploy your app to GitHub Pages and get a real live URL to share!' },
        ]}
        learningOutcomes={[
          { icon: '💻', text: 'Vibe Coding' },
          { icon: '🤝', text: 'Human-AI Collaboration' },
          { icon: '🎯', text: 'Product Thinking' },
          { icon: '🔄', text: 'Design Iteration' },
          { icon: '🌐', text: 'Web Deployment' },
        ]}
        example={
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-indigo-600">You describe:</span> "A mood tracker for students with emoji buttons, daily streaks, and a calming gradient design"
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-bold text-indigo-600">BYTE enhances:</span> "Added localStorage for persistence, confetti on streak milestones, and a breathing exercise easter egg"
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-bold text-indigo-600">Result:</span> A fully working app you can deploy and share!
            </p>
          </div>
        }
        cta={
          <Button onClick={() => onSelectGame('vibeCode')} className="text-white font-bold rounded-xl" style={{ backgroundColor: '#6366f1' }}>
            Play Vibe Code Challenge
          </Button>
        }
      />

      <div className="h-px bg-slate-200" />

      {/* 4. Model Comparison (Bonus) */}
      <ShowcaseSection
        title="Model Comparison"
        icon="⚔️"
        color="#8b5cf6"
        gradient="bg-gradient-to-br from-violet-50 to-slate-50"
        tagline="Same prompt, different AI models — which one wins? Test your judgment in a blind comparison challenge!"
        preview={<ModelComparisonPreview onClick={() => onSelectGame('modelComparison')} />}
        isReversed
        isBonus
        funPoints={[
          { icon: '🤖', title: 'Blind Testing', desc: 'Outputs are labeled "Model A", "Model B" — you don\'t know which AI made which until the big reveal!' },
          { icon: '🗳️', title: 'Vote & Rank', desc: 'Players vote for the best output, then discover if their favorite came from GPT, Gemini, Claude, or Llama' },
          { icon: '🎭', title: 'The Big Reveal', desc: 'A dramatic unmasking shows which model created which output — surprises guaranteed!' },
          { icon: '📊', title: 'Learn Model Differences', desc: 'Discover that different AI models have different strengths — there\'s no universal "best"' },
        ]}
        learningOutcomes={[
          { icon: '🧠', text: 'AI Model Knowledge' },
          { icon: '⚖️', text: 'Critical Evaluation' },
          { icon: '🔬', text: 'Blind Testing' },
          { icon: '🎯', text: 'Tool Selection' },
        ]}
        example={
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-violet-600">Prompt given to all models:</span> "Build a habit tracker app"
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-bold text-violet-600">Model A:</span> Clean, minimal design with drag-and-drop — <span className="italic">turns out to be Gemini!</span>
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-bold text-violet-600">Model B:</span> Feature-rich with charts and streaks — <span className="italic">that was GPT!</span>
            </p>
          </div>
        }
        cta={
          <Button onClick={() => onSelectGame('modelComparison')} className="text-white font-bold rounded-xl" style={{ backgroundColor: '#8b5cf6' }}>
            Try Model Comparison
          </Button>
        }
      />

      <div className="h-px bg-slate-200" />

      {/* 5. Remix Mode (Bonus) */}
      <ShowcaseSection
        title="Remix Mode"
        icon="🔀"
        color="#ec4899"
        gradient="bg-gradient-to-br from-pink-50 to-slate-50"
        tagline="Fork someone else's creation and make it your own. The best ideas are built on other ideas!"
        preview={<RemixPreview onClick={() => onSelectGame('remix')} />}
        isBonus
        funPoints={[
          { icon: '🍴', title: 'Fork & Iterate', desc: 'Browse everyone\'s submissions, pick one that inspires you, and build on top of it' },
          { icon: '🎨', title: 'Creative Collaboration', desc: 'Add features, change styles, or take the idea in a completely different direction' },
          { icon: '📊', title: 'Side-by-Side Compare', desc: 'See the original next to your remix — what did you improve? What did you change?' },
          { icon: '🏆', title: 'Remix Awards', desc: 'Win Best Remix, Most Remixed Original, or Best Collaborator' },
        ]}
        learningOutcomes={[
          { icon: '🤝', text: 'Collaboration' },
          { icon: '🔄', text: 'Iteration' },
          { icon: '💡', text: 'Building on Ideas' },
          { icon: '🗣️', text: 'Giving Feedback' },
        ]}
        example={
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-pink-600">Original app:</span> A simple todo list with checkboxes
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-bold text-pink-600">Your remix:</span> "Add categories, dark mode, and a satisfying animation when you complete all tasks"
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-bold text-pink-600">Result:</span> A todo app with confetti explosions and a productivity score!
            </p>
          </div>
        }
        cta={
          <Button onClick={() => onSelectGame('remix')} className="text-white font-bold rounded-xl" style={{ backgroundColor: '#ec4899' }}>
            Try Remix Mode
          </Button>
        }
      />

      <div className="h-px bg-slate-200" />

      {/* 6. Tournament Mode */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-100 to-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-3xl font-black text-slate-800 mb-3">Tournament Mode</h2>
          <p className="text-lg text-slate-600 mb-8">
            Play all three core games back-to-back with persistent scoring. The ultimate AI literacy challenge!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-bold text-slate-700 mb-1">Game 1: Spot the Fake</h3>
              <p className="text-sm text-slate-500">Detect AI images, debate ethics</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold text-slate-700 mb-1">Game 2: Meme Machine</h3>
              <p className="text-sm text-slate-500">Create viral advocacy memes</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-3xl mb-2">💻</div>
              <h3 className="font-bold text-slate-700 mb-1">Game 3: Vibe Code</h3>
              <p className="text-sm text-slate-500">Build real working apps</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 inline-block">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👑</span>
              <div className="text-left">
                <p className="font-bold text-amber-800">The Human Award</p>
                <p className="text-sm text-amber-600">Top scorer wins a downloadable certificate proclaiming them: PERSON</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">2-3 hrs</p>
              <p className="text-xs text-slate-500">Full tournament</p>
            </div>
            <div className="text-slate-300 text-2xl">|</div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">3-15</p>
              <p className="text-xs text-slate-500">Players</p>
            </div>
            <div className="text-slate-300 text-2xl">|</div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">1</p>
              <p className="text-xs text-slate-500">Champion</p>
            </div>
          </div>

          <div className="mt-8">
            <Button onClick={() => onSelectGame('tournament')} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 font-bold rounded-xl text-lg">
              Start Tournament
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GameShowcase;

// Enhanced Homepage Component v2
// Lighter theme, modern design, swapped sections, API key info

import React, { useState, useEffect, useRef } from 'react';
import { Button, Logo } from './components';
import GameShowcase from './GameShowcase';

// ============================================
// INFO PAGES CONTENT
// ============================================

const INFO_PAGES = {
  'ai-image-generation': {
    title: 'AI Image Generation',
    icon: '🎨',
    color: '#48a89a',
    sections: [
      {
        heading: 'What is AI Image Generation?',
        content: `AI image generation uses machine learning models to create images from text descriptions (prompts) or to modify existing images. Popular tools include DALL-E, Midjourney, Stable Diffusion, and Adobe Firefly.`
      },
      {
        heading: 'How Does It Work?',
        content: `These systems are trained on billions of images paired with text descriptions. They learn patterns, styles, and concepts, then use this knowledge to generate new images. The AI doesn't copy existing images—it creates new ones based on learned patterns.`
      },
      {
        heading: 'Key Concepts',
        list: [
          'Diffusion Models: Start with noise and gradually refine it into an image',
          'Prompts: Text descriptions that guide what the AI creates',
          'Negative Prompts: Tell the AI what NOT to include',
          'Seeds: Random numbers that make results reproducible',
          'CFG Scale: How closely the AI follows your prompt'
        ]
      },
      {
        heading: 'Ethical Considerations',
        content: `AI-generated images raise important questions about consent (training data often includes artists' work without permission), authenticity (fake photos can spread misinformation), and job displacement (commercial art may be affected). Always consider these factors when creating and sharing AI images.`
      },
      {
        heading: 'Try It In ARTIFICIAL',
        content: `Our Meme Machine game lets you experience AI image generation firsthand. Create advocacy memes, learn prompt engineering, and understand how AI interprets your instructions.`
      }
    ]
  },
  'ai-detection-skills': {
    title: 'AI Detection Skills',
    icon: '🔍',
    color: '#d4a84b',
    sections: [
      {
        heading: 'Why Detection Matters',
        content: `As AI-generated content becomes more sophisticated, the ability to distinguish real from synthetic content is crucial. Misinformation, deepfakes, and AI-generated images can spread rapidly and influence public opinion.`
      },
      {
        heading: 'Common Signs of AI Images',
        list: [
          'Distorted hands, fingers, or teeth',
          'Asymmetric facial features or jewelry',
          'Blurry or nonsensical text',
          'Unrealistic backgrounds or blending errors',
          'Too-perfect skin texture or lighting',
          'Inconsistent shadows or reflections'
        ]
      },
      {
        heading: 'Detection Strategies',
        list: [
          'Zoom in on details—AI often struggles with fine details',
          'Check for consistency in lighting and shadows',
          'Look for unnatural smoothness or plastic-like textures',
          'Examine edges where objects meet backgrounds',
          'Consider context—is this too perfect or convenient?',
          'Reverse image search to find original sources'
        ]
      },
      {
        heading: 'Limitations',
        content: `AI detection is an ongoing challenge. As generators improve, detection becomes harder. No method is 100% reliable. The goal is to develop critical thinking habits, not achieve perfect accuracy.`
      },
      {
        heading: 'Try It In ARTIFICIAL',
        content: `Spot the Fake helps you practice detection skills with real examples. Learn to identify AI-generated images while exploring the ethics and legal landscape of synthetic media.`
      }
    ]
  },
  'prompt-engineering': {
    title: 'Prompt Engineering',
    icon: '✨',
    color: '#6b8cce',
    sections: [
      {
        heading: 'What is Prompt Engineering?',
        content: `Prompt engineering is the art of crafting effective instructions for AI systems. Whether generating images, writing code, or having conversations, how you phrase your request dramatically affects the output quality.`
      },
      {
        heading: 'Key Principles',
        list: [
          'Be Specific: "A golden retriever" vs "A fluffy golden retriever puppy playing in autumn leaves"',
          'Include Context: Who, what, where, when, why, and how',
          'Use References: "In the style of..." or "Similar to..."',
          'Iterate: Refine your prompts based on results',
          'Break It Down: Complex requests work better as steps'
        ]
      },
      {
        heading: 'For Image Generation',
        list: [
          'Describe the subject, setting, lighting, and mood',
          'Specify art style, camera angle, and composition',
          'Use quality modifiers like "high detail," "professional," "4K"',
          'Add negative prompts to exclude unwanted elements'
        ]
      },
      {
        heading: 'For Code Generation (Vibe Coding)',
        list: [
          'Describe the problem you\'re solving',
          'Define your target users and their needs',
          'List specific features with UI details',
          'Reference existing apps for style inspiration',
          'Iterate with specific change requests'
        ]
      },
      {
        heading: 'Try It In ARTIFICIAL',
        content: `Both Meme Machine and Vibe Code Challenge teach prompt engineering. Learn to communicate effectively with AI systems through hands-on practice.`
      }
    ]
  },
  'for-educators': {
    title: 'For Educators',
    icon: '📚',
    color: '#48a89a',
    sections: [
      {
        heading: 'Why AI Literacy in the Classroom?',
        content: `Students are already encountering AI daily—in social media, search results, and creative tools. Teaching AI literacy helps them become critical consumers and responsible creators of AI-generated content.`
      },
      {
        heading: 'Curriculum Integration',
        list: [
          'Media Literacy: Use Spot the Fake to discuss misinformation',
          'Art & Design: Explore AI creation with Meme Machine',
          'Computer Science: Introduce coding concepts with Vibe Code',
          'Ethics: Discuss consent, bias, and authenticity',
          'Social Studies: Examine AI\'s impact on society'
        ]
      },
      {
        heading: 'Lesson Planning Tips',
        list: [
          'Start with a demonstration before student play',
          'Use the Facilitator Dashboard to control pacing',
          'Plan discussion questions for each game phase',
          'Connect games to current events and real examples',
          'Allow time for reflection and debrief'
        ]
      },
      {
        heading: 'Age Recommendations',
        content: `ARTIFICIAL is designed for ages 13+. Content is educational and age-appropriate, but some real-world examples discuss misinformation, manipulation, and other mature themes. Preview games before use with younger students.`
      },
      {
        heading: 'Assessment Ideas',
        list: [
          'Reflection journals on AI ethics',
          'Create detection guides for peers',
          'Design original games teaching AI concepts',
          'Research projects on AI impact in various fields',
          'Present apps created in Vibe Code Challenge'
        ]
      }
    ]
  },
  'for-facilitators': {
    title: 'For Facilitators',
    icon: '🎯',
    color: '#d4a84b',
    sections: [
      {
        heading: 'Running Successful Sessions',
        content: `Whether you're running a community workshop, corporate training, or library program, these tips will help you create engaging, effective AI literacy experiences.`
      },
      {
        heading: 'Before the Session',
        list: [
          'Test your API key and internet connection',
          'Create a game room and test the join process',
          'Prepare discussion questions for each game',
          'Set up projector display for group viewing',
          'Have backup activities ready for technical issues'
        ]
      },
      {
        heading: 'During the Session',
        list: [
          'Use the Facilitator Dashboard to manage game flow',
          'Pause between rounds for discussion',
          'Encourage participants to share their thinking',
          'Celebrate creative solutions, not just "correct" answers',
          'Connect game concepts to real-world applications'
        ]
      },
      {
        heading: 'Technical Tips',
        list: [
          'Recommend participants use laptops/tablets over phones',
          'Have game codes visible throughout the session',
          'Use the projector URL for audience display',
          'Keep backup device ready to rejoin if needed'
        ]
      },
      {
        heading: 'Discussion Prompts',
        list: [
          '"What surprised you about identifying AI images?"',
          '"How might AI-generated content affect trust in media?"',
          '"What are the benefits and risks of AI creation tools?"',
          '"How can we use AI responsibly?"'
        ]
      }
    ]
  },
  'open-source': {
    title: 'Open Source',
    icon: '💻',
    color: '#6b8cce',
    sections: [
      {
        heading: 'Built for the Community',
        content: `ARTIFICIAL is open source and free to use for educational purposes. We believe AI literacy education should be accessible to everyone, regardless of budget.`
      },
      {
        heading: 'Technology Stack',
        list: [
          'React: Modern frontend framework',
          'Firebase: Real-time database and hosting',
          'OpenAI API: Image generation and code assistance',
          'Tailwind CSS: Utility-first styling',
          'Google Gemini: Alternative AI provider option'
        ]
      },
      {
        heading: 'Contributing',
        content: `We welcome contributions! Whether you're fixing bugs, adding features, improving documentation, or translating content, your help makes AI literacy education better for everyone.`
      },
      {
        heading: 'Getting Started',
        list: [
          'Fork the repository on GitHub',
          'Clone to your local machine',
          'Run npm install to set up dependencies',
          'Create a .env file with your API keys',
          'Run npm start to launch locally'
        ]
      },
      {
        heading: 'License',
        content: `ARTIFICIAL is released under the Creative Commons Attribution-ShareAlike 4.0 license. You're free to use, modify, and share it for educational purposes, as long as you give credit and share your improvements.`
      },
      {
        heading: 'Get the Code',
        link: {
          url: 'https://github.com/amateurmenace/artificial',
          text: 'View on GitHub →'
        }
      }
    ]
  }
};

// ============================================
// INFO PAGE COMPONENT
// ============================================

export const InfoPage = ({ pageId, onClose }) => {
  const page = INFO_PAGES[pageId];

  if (!page) return null;

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Fixed top nav */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-[#e2e0dc] px-4 py-3 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Logo onClick={onClose} />
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-sm text-[#6b7c74] hover:text-[#3d5a4c] hidden md:block">Games</button>
            <a href="#about" onClick={onClose} className="text-sm text-[#6b7c74] hover:text-[#3d5a4c] hidden md:block">About</a>
          </div>
        </div>
      </header>

      {/* Page header */}
      <header className="bg-gradient-to-r from-[#3d5a4c] to-[#48a89a] text-white py-8 px-4 mt-14">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            ← Back to Home
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: page.color + '30' }}
            >
              {page.icon}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{page.title}</h1>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="space-y-12">
          {page.sections.map((section, i) => (
            <section key={i} className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#3d5a4c] mb-4 flex items-center gap-3">
                <span 
                  className="w-2 h-8 rounded-full"
                  style={{ backgroundColor: page.color }}
                />
                {section.heading}
              </h2>
              
              {section.content && (
                <p className="text-[#6b7c74] leading-relaxed text-lg">
                  {section.content}
                </p>
              )}
              
              {section.list && (
                <ul className="space-y-3 mt-4">
                  {section.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-[#6b7c74]">
                      <span 
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: page.color }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {section.link && (
                <a 
                  href={section.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: page.color }}
                >
                  {section.link.text}
                </a>
              )}
            </section>
          ))}
        </div>
        
        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#3d5a4c] to-[#48a89a] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Learn by Playing?</h3>
          <p className="text-white/80 mb-6">Put these concepts into practice with our interactive games.</p>
          <Button 
            onClick={onClose}
            variant="custom"
            className="bg-white hover:bg-gray-100 text-[#3d5a4c] font-bold px-8 py-3 rounded-xl"
          >
            Explore Games →
          </Button>
        </div>
      </main>
    </div>
  );
};

// ============================================
// 8-BIT BYTE CHARACTER
// ============================================

const PixelByte = ({ size = 48, animate = true }) => {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    if (animate) {
      const interval = setInterval(() => setFrame(f => (f + 1) % 4), 300);
      return () => clearInterval(interval);
    }
  }, [animate]);
  
  const frames = [
    `<rect x="8" y="8" width="32" height="32" fill="#00D4FF" rx="4"/>
     <rect x="14" y="16" width="6" height="6" fill="#0a0a0a"/>
     <rect x="28" y="16" width="6" height="6" fill="#0a0a0a"/>
     <rect x="16" y="28" width="16" height="4" fill="#0a0a0a"/>
     <rect x="4" y="20" width="4" height="8" fill="#00D4FF"/>
     <rect x="40" y="20" width="4" height="8" fill="#00D4FF"/>`,
    `<rect x="8" y="8" width="32" height="32" fill="#00D4FF" rx="4"/>
     <rect x="14" y="18" width="6" height="2" fill="#0a0a0a"/>
     <rect x="28" y="18" width="6" height="2" fill="#0a0a0a"/>
     <rect x="16" y="28" width="16" height="4" fill="#0a0a0a"/>
     <rect x="4" y="22" width="4" height="8" fill="#00D4FF"/>
     <rect x="40" y="22" width="4" height="8" fill="#00D4FF"/>`,
    `<rect x="8" y="8" width="32" height="32" fill="#00D4FF" rx="4"/>
     <rect x="14" y="16" width="6" height="6" fill="#0a0a0a"/>
     <rect x="28" y="16" width="6" height="6" fill="#0a0a0a"/>
     <rect x="18" y="28" width="12" height="4" fill="#0a0a0a"/>
     <rect x="2" y="16" width="4" height="8" fill="#00D4FF"/>
     <rect x="42" y="16" width="4" height="8" fill="#00D4FF"/>`,
    `<rect x="8" y="6" width="32" height="32" fill="#00D4FF" rx="4"/>
     <rect x="14" y="14" width="6" height="8" fill="#0a0a0a"/>
     <rect x="28" y="14" width="6" height="8" fill="#0a0a0a"/>
     <rect x="16" y="28" width="16" height="4" fill="#0a0a0a"/>
     <rect x="2" y="12" width="4" height="8" fill="#00D4FF"/>
     <rect x="42" y="12" width="4" height="8" fill="#00D4FF"/>`
  ];
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <g dangerouslySetInnerHTML={{ __html: frames[frame] }} />
    </svg>
  );
};



// ============================================
// GAME PREVIEW CARDS - Equal Height
// ============================================

// Spot the Fake Preview
const SpotTheFakePreview = ({ onClick }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  
  const images = [
    { emoji: '🌅', label: 'Sunset Beach', isAI: false },
    { emoji: '🏔️', label: 'Mountain Vista', isAI: true },
    { emoji: '🌸', label: 'Cherry Blossoms', isAI: false },
    { emoji: '🦊', label: 'Fox Portrait', isAI: true },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setCurrentImage(c => (c + 1) % images.length);
      }, 1500);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(s => (s + 2) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const current = images[currentImage];
  
  return (
    <button 
      onClick={onClick}
      className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-5 text-left w-full hover:scale-[1.02] transition-all overflow-hidden group border-2 border-teal-400/50 hover:border-teal-400 shadow-lg h-[280px] flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      
      {/* Scanning effect */}
      <div 
        className="absolute left-0 right-0 h-0.5 bg-teal-400/50"
        style={{ top: `${scanLine}%` }}
      />
      
      <div className="relative flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔍</span>
          <span className="text-teal-400 font-bold text-sm uppercase tracking-wider">Spot the Fake</span>
          <span className="ml-auto">
            <span className={`inline-block w-2 h-2 rounded-full ${showResult ? (current.isAI ? 'bg-red-400' : 'bg-green-400') : 'bg-yellow-400'} animate-pulse`} />
          </span>
        </div>
        
        <div className="bg-black/40 rounded-xl p-4 flex-1 border border-teal-400/30">
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div 
                className="text-5xl transition-all duration-300"
                style={{ 
                  transform: showResult ? 'scale(0.9)' : 'scale(1)',
                  filter: showResult ? 'brightness(0.7)' : 'brightness(1)'
                }}
              >
                {current.emoji}
              </div>
              <div className="text-white/60 text-xs mt-2">{current.label}</div>
            </div>
            
            {showResult && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className={`text-lg font-black ${current.isAI ? 'text-red-400' : 'text-green-400'}`}>
                  {current.isAI ? '🤖 AI GENERATED' : '✓ REAL PHOTO'}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-teal-400 text-xs font-mono">
              {showResult ? (current.isAI ? '⚠️ AI DETECTED' : '✓ AUTHENTIC') : '🔍 Analyzing...'}
            </span>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity text-center">
          Click to play →
        </div>
      </div>
    </button>
  );
};

// Meme Machine Preview - FIXED HEIGHT
const MemeMachinePreview = ({ onClick }) => {
  const [cookingPhase, setCookingPhase] = useState(0);
  const [gears, setGears] = useState(0);
  
  const phases = [
    { label: 'LOADING IDEA...', progress: 15 },
    { label: 'MIXING PIXELS...', progress: 35 },
    { label: 'ADDING HUMOR...', progress: 55 },
    { label: 'GENERATING...', progress: 75 },
    { label: 'ALMOST READY...', progress: 90 },
    { label: 'MEME READY! 🔥', progress: 100 },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCookingPhase(p => (p + 1) % phases.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [phases.length]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGears(g => g + 15);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  const currentPhase = phases[cookingPhase];
  
  return (
    <button 
      onClick={onClick}
      className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-5 text-left w-full hover:scale-[1.02] transition-all overflow-hidden group border-2 border-amber-400/50 hover:border-amber-400 shadow-lg h-[280px] flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      
      <div 
        className="absolute top-3 right-3 text-2xl opacity-20"
        style={{ transform: `rotate(${gears}deg)` }}
      >
        ⚙️
      </div>
      
      <div className="relative flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🤖</span>
          <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">Meme Machine</span>
          <span className="ml-auto flex gap-1">
            {[0, 2, 4].map((threshold, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${cookingPhase > threshold ? 'bg-green-400' : 'bg-slate-600'} transition-all`} />
            ))}
          </span>
        </div>
        
        <div className="bg-black/40 rounded-xl p-4 flex-1 border border-amber-400/30">
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div 
                className="text-5xl"
                style={{ 
                  filter: cookingPhase < 3 ? 'blur(4px)' : cookingPhase < 5 ? 'blur(2px)' : 'blur(0px)',
                  opacity: 0.3 + (cookingPhase * 0.12)
                }}
              >
                🌍
              </div>
              {cookingPhase < 5 && (
                <div className="absolute">
                  <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <div 
                className="text-white text-xs mt-2 font-bold"
                style={{ opacity: cookingPhase > 2 ? 0.8 : 0 }}
              >
                SAVE THE PLANET
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                style={{ width: `${currentPhase.progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-amber-400 text-xs font-mono animate-pulse">
              {currentPhase.label}
            </span>
            <span className="text-slate-400 text-xs">
              {currentPhase.progress}%
            </span>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity text-center">
          Click to play →
        </div>
      </div>
    </button>
  );
};

// Vibe Code Preview - FIXED HEIGHT to match others
const VibeCodePreview = ({ onClick }) => {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState('');
  
  const codeSteps = [
    { prompt: '> describe your app...', response: '' },
    { prompt: '> "community event calendar"', response: '' },
    { prompt: '> analyzing requirements...', response: 'âš¡' },
    { prompt: '> writing code...', response: '💻' },
    { prompt: '> ✓ App created!', response: '🎉' },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % codeSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [codeSteps.length]);
  
  useEffect(() => {
    const text = codeSteps[step].prompt;
    setTyping('');
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setTyping(text.slice(0, i + 1));
        i++;
      }
    }, 50);
    return () => clearInterval(typeInterval);
  }, [step]);
  
  return (
    <button 
      onClick={onClick}
      className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-5 text-left w-full hover:scale-[1.02] transition-all overflow-hidden group border-2 border-blue-400/50 hover:border-blue-400 shadow-lg h-[280px] flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      
      <div className="relative flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <PixelByte size={28} />
          <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">Vibe Code</span>
          <span className="ml-auto text-xs text-slate-400">No coding needed</span>
        </div>
        
        <div className="bg-black/60 rounded-xl p-4 flex-1 border border-blue-400/30 font-mono">
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-500 text-xs ml-2">vibe-code.js</span>
          </div>
          
          {/* Code display */}
          <div className="space-y-2">
            <div className="text-green-400 text-sm flex items-center">
              {typing}
              <span className="ml-1 w-2 h-4 bg-green-400 animate-pulse" />
            </div>
            {codeSteps[step].response && (
              <div className="text-2xl animate-bounce">{codeSteps[step].response}</div>
            )}
            <div className="text-slate-600 text-xs mt-2">{"// AI builds it for you!"}</div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-center">
          Click to play →
        </div>
      </div>
    </button>
  );
};

// ============================================
// MAIN HOMEPAGE COMPONENT
// ============================================

const EnhancedHomepage = ({ onHost, onJoin, onSelectGame, onShowInfoPage, onOpenSettings }) => {
  const gamesRef = useRef(null);
  
  const scrollToGames = () => {
    gamesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      
      {/* Hero Section - Lighter - Full viewport height */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-teal-900 text-white overflow-hidden min-h-[92vh] flex flex-col">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10 flex-1 flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <PixelByte size={80} />
                <div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                    ARTIFICIAL
                  </h1>
                  <p className="text-teal-300 font-semibold text-xl md:text-2xl">Learn AI by Playing</p>
                </div>
              </div>
              
              <p className="text-2xl md:text-3xl text-white/80 mb-10 leading-relaxed">
                Five free multiplayer games that teach you to detect AI content, compare AI models,
                create and advocate for your community with AI tools, and build and deploy real, functioning
                apps without coding. Perfect for classrooms, workshops, and playful minds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onHost}
                  variant="custom"
                  size="lg"
                  className="bg-teal-400 hover:bg-teal-300 text-slate-900 hover:scale-105 transition-all shadow-lg font-bold text-lg px-8 py-4"
                >
                  🎮 Host a Game
                </Button>
                <Button 
                  onClick={onJoin}
                  variant="custom"
                  size="lg"
                  className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all text-lg px-8 py-4"
                >
                  🔗 Join with Code
                </Button>
              </div>
            </div>
            
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-3xl flex items-center justify-center animate-pulse">
                  <PixelByte size={200} />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 px-4 py-2 rounded-full text-base font-bold animate-bounce">
                  🎨 Create
                </div>
                <div className="absolute -bottom-4 -left-4 bg-teal-400 text-slate-900 px-4 py-2 rounded-full text-base font-bold animate-bounce" style={{ animationDelay: '0.5s' }}>
                  🔍 Detect
                </div>
                <div className="absolute top-1/2 -right-8 bg-blue-400 text-slate-900 px-4 py-2 rounded-full text-base font-bold animate-bounce" style={{ animationDelay: '1s' }}>
                  💻 Build
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/60 animate-bounce cursor-pointer" onClick={scrollToGames}>
          <span className="text-xs mb-2 hidden sm:block">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
      
      {/* Game Showcase - Compact grid with tabbed details */}
      <div id="games-section" ref={gamesRef}>
        <GameShowcase onSelectGame={onSelectGame} />
      </div>
      
      {/* How It Works - Simplified 3 steps */}
      <section className="py-16 px-4 bg-white" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
              Ready in 60 Seconds
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
            {[
              { step: '1', title: 'Gather Players', desc: 'Get 2-20 friends, students, or colleagues together',
                icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#3d5a4c" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg> },
              { step: '2', title: 'Share the Code', desc: 'Host a game and share the 6-character code',
                icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#3d5a4c" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg> },
              { step: '3', title: 'Play & Learn', desc: 'Build AI skills while competing and having fun!',
                icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#3d5a4c" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg> },
            ].map((item, i) => (
              <React.Fragment key={i}>
                <div className="flex-1 text-center group">
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 bg-[#48a89a]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#48a89a]/20 transition-all duration-300">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex items-center px-4">
                    <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-14 px-4 bg-slate-50" id="about">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 text-center">About ARTIFICIAL</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { emoji: '💡', title: 'Why AI Literacy?', desc: 'AI is everywhere. Understanding how it works helps you make better decisions about what to trust and how to use these powerful tools responsibly.' },
              { emoji: '🎯', title: 'Who Is This For?', desc: 'Community groups, educators, libraries, civic organizations, and anyone curious about AI. No technical background required.' },
              { emoji: '🛠️', title: 'How It\'s Built', desc: 'React + Firebase for real-time multiplayer. Connects to OpenAI, Anthropic, and Google Gemini. Fully open source.' },
              { emoji: '🆓', title: 'Free & Open', desc: 'ARTIFICIAL is free for educational use under CC BY-SA 4.0. Host unlimited games with your group.' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-xl">{card.emoji}</span> {card.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Closed by default */}
      <section className="py-16 px-4 bg-white" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {[
              { q: "Do I need coding experience?", a: "Nope! All games are designed for beginners. Vibe Code Challenge specifically teaches you to build apps by describing what you want." },
              { q: "How many players can join?", a: "Games support 2-20 players depending on the game. Perfect for classrooms, workshops, or small group sessions." },
              { q: "Can I use this for my class or workshop?", a: "Absolutely! ARTIFICIAL is designed for educational settings. Many educators use it for media literacy, computer science, and ethics discussions." },
              { q: "What ages is this appropriate for?", a: "We recommend ages 13+ due to some real-world examples discussing misinformation. Content is educational and age-appropriate." },
              { q: "Is it really free?", a: "Yes! ARTIFICIAL is free and open source. The only cost is a small per-use fee from the AI provider (typically pennies per generation) if you bring your own API key." },
            ].map((faq, i) => (
              <details key={i} className="bg-slate-50 rounded-xl px-5 py-4 cursor-pointer group border border-slate-200 hover:border-teal-300 transition-colors">
                <summary className="font-semibold text-slate-800 list-none flex justify-between items-center text-sm">
                  {faq.q}
                  <span className="text-teal-500 group-open:rotate-180 transition-transform ml-4 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-800 to-teal-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <PixelByte size={64} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Ready to Play?
          </h2>
          <p className="text-lg text-white/80 mb-6">
            Gather your group and start building AI literacy together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onHost} variant="custom" size="lg" className="bg-teal-400 hover:bg-teal-300 text-slate-900 hover:scale-105 transition-all shadow-lg font-bold">
              🎮 Host a Game Now
            </Button>
            <Button onClick={onJoin} variant="custom" size="lg" className="bg-amber-400 text-slate-900 hover:bg-amber-300 hover:scale-105 transition-all shadow-lg font-bold">
              🔗 Join with Code
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <button onClick={() => onShowInfoPage && onShowInfoPage('ai-image-generation')} className="text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium">AI Image Generation</button>
            <button onClick={() => onShowInfoPage && onShowInfoPage('prompt-engineering')} className="text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium">Prompt Engineering</button>
            <button onClick={() => onShowInfoPage && onShowInfoPage('for-facilitators')} className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">For Facilitators</button>
          </div>

          <div className="text-center text-sm text-white/60 space-y-1">
            <p>A <a href="https://community.weirdmachine.org" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">Community AI</a> app from <a href="https://brooklineinteractive.org" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">Brookline Interactive Group</a> in partnership with <a href="https://neighborhoodai.org" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">Neighborhood AI</a>.</p>
            <p>Game Designed and Developed by <a href="https://weirdmachine.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Stephen Walter</a> + AI in 2026.</p>
          </div>

          <div className="flex items-center justify-center gap-5 mt-5">
            <PixelByte size={28} />
            <a href="https://weirdmachine.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/weirdmachine.png" alt="Weird Machine" className="h-8 bg-white rounded p-0.5" />
            </a>
            <a href="https://brooklineinteractive.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/big-logo.png" alt="Brookline Interactive Group" className="h-8" />
            </a>
            <a href="https://github.com/amateurmenace/artificial" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors" title="View on GitHub">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </a>
          </div>

          <p className="text-center text-xs text-white/30 mt-4">CC BY-SA 4.0 · Free for educational use</p>
        </div>
      </footer>
      
      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedHomepage;

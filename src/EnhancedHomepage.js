// Enhanced Homepage Component v2
// Lighter theme, modern design, swapped sections, API key info

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './components';

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
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3d5a4c] to-[#48a89a] text-white py-8 px-4">
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
                Three multiplayer games that teach you to detect AI content, create with AI tools, 
                and build apps without coding. Perfect for classrooms, workshops, and curious minds.
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
      
      {/* SWAPPED: Choose Your Adventure Section - NOW FIRST */}
      <section className="py-20 px-4 bg-slate-50" id="games-section" ref={gamesRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              Choose Your Adventure
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Three games, three ways to understand AI. Each teaches different skills for navigating our AI-powered world.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Spot the Fake */}
            <div className="flex flex-col">
              <SpotTheFakePreview onClick={() => onSelectGame('spotTheFake')} />
              <div className="mt-5 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Spot the Fake</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Learn to detect AI-generated images. Explore real cases and sharpen your critical eye.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {['Detection', 'Ethics', 'Critical Thinking'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <span>⏱ 30-45 min</span>
                  <span>👥 2-20 players</span>
                </div>
              </div>
            </div>
            
            {/* Meme Machine */}
            <div className="flex flex-col">
              <MemeMachinePreview onClick={() => onSelectGame('memeMachine')} />
              <div className="mt-5 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Meme Machine</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Create advocacy memes with AI help. Get critique, iterate, and compete for virality!
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {['AI Art', 'Prompting', 'Creativity'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <span>⏱ 45-60 min</span>
                  <span>👥 3-20 players</span>
                </div>
              </div>
            </div>
            
            {/* Vibe Code Challenge */}
            <div className="flex flex-col">
              <VibeCodePreview onClick={() => onSelectGame('vibeCode')} />
              <div className="mt-5 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Vibe Code Challenge</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Build real apps by describing them. AI writes the code — you guide the vision!
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {['No Code', 'App Building', 'Prompting'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <span>⏱ 45-60 min</span>
                  <span>👥 2-15 players</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* SWAPPED: How It Works Section - NOW SECOND - Modern Design without emojis */}
      <section className="py-20 px-4 bg-white" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              How It Works
            </h2>
            <p className="text-slate-600">Get started in minutes with these simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                step: '01', 
                title: 'Gather Players', 
                desc: 'Get 2-20 friends, students, or colleagues together in person or online',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              { 
                step: '02', 
                title: 'Set Up API Keys', 
                desc: 'Add your OpenAI or Gemini API key to enable AI features (takes 2 min)',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                )
              },
              { 
                step: '03', 
                title: 'Share Code', 
                desc: 'Everyone joins with a simple 6-character code on their device',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )
              },
              { 
                step: '04', 
                title: 'Play & Learn', 
                desc: 'Build AI literacy skills while competing and having fun together',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-block mb-6">
                  {/* Modern card with gradient border */}
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-600 group-hover:from-teal-100 group-hover:to-teal-200 group-hover:text-teal-600 transition-all duration-300 shadow-lg">
                    {item.icon}
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-lg">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          {/* API Key Info Box */}
          <div className="mt-16 bg-gradient-to-r from-slate-100 to-teal-50 rounded-2xl p-8 border border-slate-200">
            <div className="flex items-start gap-6">
              <div className="bg-teal-500 text-white p-4 rounded-xl">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-lg mb-2">About API Keys</h4>
                <p className="text-slate-600 mb-4">
                  API keys let ARTIFICIAL connect to AI services like OpenAI and Google Gemini. 
                  Facilitators set these up once before hosting games. Usage has small costs 
                  (typically $0.01-0.10 per AI generation).
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                  >
                    Get OpenAI Key →
                  </a>
                  <a 
                    href="https://aistudio.google.com/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                  >
                    Get Gemini Key →
                  </a>
                  <button 
                    onClick={onOpenSettings}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                  >
                    Open Settings →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-20 px-4 bg-slate-50" id="about">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              About ARTIFICIAL
            </h2>
            <p className="text-slate-600">
              Educational games designed to build AI literacy for everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                Why AI Literacy?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                AI is everywhere—in your social feeds, search results, and creative tools. 
                Understanding how AI works helps you make better decisions about what to trust 
                and how to use these powerful tools responsibly.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                Who Is This For?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Community groups, educators, libraries, civic organizations, and anyone who wants to 
                understand AI better. No technical background required—just curiosity!
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </span>
                How It's Built
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Built with React and Firebase for real-time multiplayer. Connects to OpenAI, 
                Anthropic, and Google Gemini APIs. Designed to be accessible and engaging for all.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Free & Open
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                ARTIFICIAL is free to use for educational purposes. Host unlimited games with your 
                own API keys. Small API costs apply for AI features.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section - With API Key Info */}
      <section className="py-20 px-4 bg-white" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: "Do I need coding experience?",
                a: "Nope! All games are designed for beginners. Vibe Code Challenge specifically teaches you to build apps by describing what you want—no coding required."
              },
              {
                q: "What are API keys and do I need them?",
                a: "API keys are like passwords that let ARTIFICIAL connect to AI services. Facilitators need to set up at least one key (OpenAI or Gemini) to use AI features. Get them free at platform.openai.com or aistudio.google.com. There are small usage costs (~$0.01-0.10 per generation)."
              },
              {
                q: "How much does it cost to run a session?",
                a: "A typical workshop session costs $1-5 in API usage. Spot the Fake uses minimal AI. Meme Machine and Vibe Code use more. Set spending limits in your API provider dashboard."
              },
              {
                q: "How many players can join?",
                a: "Games support 2-20 players depending on the game. Perfect for classrooms, workshops, or small group sessions."
              },
              {
                q: "Can I use this for my class or workshop?",
                a: "Absolutely! ARTIFICIAL is designed for educational settings. Host as many sessions as you want. Many educators use it for media literacy, computer science, and ethics discussions."
              },
              {
                q: "What ages is this appropriate for?",
                a: "We recommend ages 13+ due to some real-world examples discussing misinformation. Content is educational and age-appropriate."
              },
            ].map((faq, i) => (
              <details 
                key={i}
                className="bg-slate-50 rounded-xl p-6 cursor-pointer group border border-slate-200"
              >
                <summary className="font-semibold text-slate-800 list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-teal-500 group-open:rotate-180 transition-transform ml-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-800 to-teal-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <PixelByte size={80} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Play?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Gather your group and start building AI literacy together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onHost}
              variant="custom"
              size="lg"
              className="bg-teal-400 hover:bg-teal-300 text-slate-900 hover:scale-105 transition-all shadow-lg font-bold"
            >
              🎮 Host a Game Now
            </Button>
            <Button 
              onClick={onJoin}
              variant="custom"
              size="lg"
              className="bg-amber-400 text-slate-900 hover:bg-amber-300 hover:scale-105 transition-all shadow-lg font-bold"
            >
              🔗 Join with Code
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer - Simplified & Centered */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          {/* Info Page Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <button 
              onClick={() => onShowInfoPage && onShowInfoPage('ai-image-generation')} 
              className="text-teal-400 hover:text-teal-300 transition-colors font-medium"
            >
              AI Image Generation
            </button>
            <button 
              onClick={() => onShowInfoPage && onShowInfoPage('prompt-engineering')} 
              className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
            >
              Prompt Engineering
            </button>
            <button 
              onClick={() => onShowInfoPage && onShowInfoPage('for-facilitators')} 
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              For Facilitators
            </button>
          </div>
          
          <p className="text-white/70 mb-2">
            A <a href="https://community.weirdmachine.org" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors">Community AI</a> app from <a href="https://brooklineinteractive.org" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors">Brookline Interactive Group</a> in partnership with <a href="https://neighborhoodai.org" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors">Neighborhood AI</a>.
          </p>
          <p className="text-white/70 mb-2">
            Game Designed and Developed by <a href="https://weirdmachine.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Stephen Walter</a> + AI in 2026.
          </p>
          <p className="text-white/50 text-sm mb-6">
            CC BY-SA 4.0 · Free for educational use
          </p>
          
          {/* Icons Row */}
          <div className="flex items-center justify-center gap-6">
            <PixelByte size={36} />
            <a 
              href="https://github.com/amateurmenace/artificial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              title="View on GitHub"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
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

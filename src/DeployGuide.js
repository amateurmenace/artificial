// DEPLOY GUIDE - Step-by-step wizard for deploying apps to GitHub Pages
// Helps players deploy their generated app to the web with a live URL

import React, { useState } from 'react';
import { Button } from './components';

// ============================================
// DEPLOY STEPS
// ============================================

const STEPS = [
  {
    id: 'intro',
    title: 'What is Deployment?',
    icon: '🌐',
    content: (
      <div className="space-y-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
          <p className="text-cyan-300 text-lg font-bold mb-2">Your app is about to go LIVE on the internet!</p>
          <p className="text-slate-300 text-sm">
            Right now, your app only exists on your computer. Deployment means putting it on a server so anyone
            with the link can use it — just like a real website!
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <div className="text-2xl mb-2">💻</div>
            <p className="text-xs text-slate-400">Your Computer</p>
            <p className="text-xs text-slate-500">Only you can see it</p>
          </div>
          <div className="text-2xl flex items-center justify-center text-cyan-400">→</div>
          <div className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/30">
            <div className="text-2xl mb-2">🌍</div>
            <p className="text-xs text-emerald-400">The Internet</p>
            <p className="text-xs text-emerald-300">Anyone can visit!</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm">
          We'll use <strong className="text-white">GitHub Pages</strong> — a free hosting service from GitHub.
          It's perfect for single-page apps like yours!
        </p>
      </div>
    ),
  },
  {
    id: 'github-account',
    title: 'Create a GitHub Account',
    icon: '👤',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">
          GitHub is where developers store and share code. You'll need a free account to deploy your app.
        </p>
        <div className="bg-slate-700/50 rounded-xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">1</span>
            <div>
              <p className="text-white text-sm font-medium">Go to GitHub</p>
              <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline">
                github.com/signup →
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">2</span>
            <div>
              <p className="text-white text-sm font-medium">Sign up with your email</p>
              <p className="text-slate-400 text-xs">Choose a username you'll remember — it becomes part of your URL!</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
            <div>
              <p className="text-white text-sm font-medium">Verify your email</p>
              <p className="text-slate-400 text-xs">Check your inbox for the verification link</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <p className="text-amber-300 text-sm">
            <strong>Already have an account?</strong> Skip to the next step!
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'create-repo',
    title: 'Create a Repository',
    icon: '📁',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">
          A repository (or "repo") is like a folder for your project on GitHub.
        </p>
        <div className="bg-slate-700/50 rounded-xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">1</span>
            <div>
              <p className="text-white text-sm font-medium">Go to Create New Repository</p>
              <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline">
                github.com/new →
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">2</span>
            <div>
              <p className="text-white text-sm font-medium">Name your repository</p>
              <p className="text-slate-400 text-xs">Use something descriptive like "my-awesome-app" or "habit-tracker"</p>
              <div className="mt-2 bg-slate-800 rounded-lg p-2 font-mono text-xs text-cyan-400">
                your-username/<span className="text-white">my-cool-app</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
            <div>
              <p className="text-white text-sm font-medium">Set to Public</p>
              <p className="text-slate-400 text-xs">GitHub Pages requires public repos on the free plan</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">4</span>
            <div>
              <p className="text-white text-sm font-medium">Click "Create repository"</p>
              <p className="text-slate-400 text-xs">Don't check any of the boxes (no README, no .gitignore)</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'upload-code',
    title: 'Upload Your Code',
    icon: '📤',
    actionRequired: true,
    content: null, // Dynamic - rendered in component
  },
  {
    id: 'enable-pages',
    title: 'Enable GitHub Pages',
    icon: '⚙️',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">
          Now tell GitHub to serve your app as a website!
        </p>
        <div className="bg-slate-700/50 rounded-xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">1</span>
            <div>
              <p className="text-white text-sm font-medium">Go to your repository's Settings</p>
              <p className="text-slate-400 text-xs">Click the "Settings" tab at the top of your repo</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">2</span>
            <div>
              <p className="text-white text-sm font-medium">Click "Pages" in the left sidebar</p>
              <p className="text-slate-400 text-xs">Under "Code and automation" section</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
            <div>
              <p className="text-white text-sm font-medium">Set Source to "Deploy from a branch"</p>
              <p className="text-slate-400 text-xs">Select <strong>main</strong> branch, <strong>/ (root)</strong> folder</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">4</span>
            <div>
              <p className="text-white text-sm font-medium">Click "Save"</p>
              <p className="text-slate-400 text-xs">GitHub will start building your site. It takes 1-2 minutes!</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <p className="text-amber-300 text-sm">
            <strong>Wait 1-2 minutes</strong> after saving. GitHub needs a moment to deploy your site.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'success',
    title: 'Your App is Live!',
    icon: '🎉',
    content: null, // Dynamic - rendered in component
  },
];

// ============================================
// DEPLOY GUIDE COMPONENT
// ============================================

const DeployGuide = ({ isOpen, onClose, appCode, appName }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [repoName, setRepoName] = useState('');
  const [username, setUsername] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const liveUrl = username && repoName ? `https://${username}.github.io/${repoName}/` : null;

  const handleDownload = () => {
    if (!appCode) return;
    const blob = new Blob([appCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const handleDownloadReadme = () => {
    const readme = `# ${appName || repoName || 'My App'}\n\nBuilt with ARTIFICIAL - AI Literacy Games Platform\n\nThis app was created during a Vibe Code Challenge, where humans guide the vision and AI helps with the code.\n\n## About\n\nThis is a single-page web application generated through human-AI collaboration.\n\n## How to Run\n\nSimply open \`index.html\` in any web browser!\n\n---\n\n*Created with [ARTIFICIAL](https://github.com/amateurmenace/artificial) - Games for AI Literacy*`;
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dynamic content for upload step
  const renderUploadStep = () => (
    <div className="space-y-4">
      <p className="text-slate-300 text-sm">
        First, download your app file, then upload it to GitHub.
      </p>

      {/* Download buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={handleDownload} className={`p-4 rounded-xl border-2 text-center transition-all ${downloaded ? 'border-emerald-500 bg-emerald-500/10' : 'border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500/20'}`}>
          <div className="text-2xl mb-1">{downloaded ? '✅' : '📥'}</div>
          <p className="text-white text-sm font-bold">Download index.html</p>
          <p className="text-xs text-slate-400">{downloaded ? 'Downloaded!' : 'Your app file'}</p>
        </button>
        <button onClick={handleDownloadReadme} className="p-4 rounded-xl border-2 border-slate-600 bg-slate-700/30 hover:bg-slate-700/50 text-center transition-all">
          <div className="text-2xl mb-1">📄</div>
          <p className="text-white text-sm font-bold">Download README.md</p>
          <p className="text-xs text-slate-400">Optional description</p>
        </button>
      </div>

      {/* Upload instructions */}
      <div className="bg-slate-700/50 rounded-xl p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">1</span>
          <div>
            <p className="text-white text-sm font-medium">In your new GitHub repo, click "uploading an existing file"</p>
            <p className="text-slate-400 text-xs">Or click "Add file" → "Upload files"</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">2</span>
          <div>
            <p className="text-white text-sm font-medium">Drag your downloaded files to the upload area</p>
            <p className="text-slate-400 text-xs">Upload <strong>index.html</strong> (and README.md if you downloaded it)</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
          <div>
            <p className="text-white text-sm font-medium">Click "Commit changes"</p>
            <p className="text-slate-400 text-xs">Leave the default commit message or add your own</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Dynamic content for success step
  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="text-6xl animate-bounce">🎉</div>
      <h2 className="text-3xl font-black text-white">Congratulations!</h2>
      <p className="text-emerald-300 text-lg">You deployed a real app to the internet!</p>

      {/* URL input */}
      <div className="bg-slate-700/50 rounded-xl p-5 space-y-3 text-left">
        <p className="text-slate-300 text-sm">Enter your GitHub details to see your live URL:</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">GitHub Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
              placeholder="your-username"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Repository Name</label>
            <input
              value={repoName}
              onChange={(e) => setRepoName(e.target.value.toLowerCase().trim())}
              placeholder="my-cool-app"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Live URL */}
      {liveUrl && (
        <div className="bg-emerald-500/20 border-2 border-emerald-500/40 rounded-2xl p-6">
          <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2">Your Live URL</p>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-bold text-white hover:text-cyan-300 underline break-all"
          >
            {liveUrl}
          </a>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => navigator.clipboard.writeText(liveUrl)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              📋 Copy URL
            </button>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-medium inline-block"
            >
              🔗 Visit Site
            </a>
          </div>
        </div>
      )}

      {/* What you learned */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-left">
        <h4 className="text-sm font-bold text-cyan-300 mb-2">🧠 What You Just Did</h4>
        <ul className="space-y-1 text-sm text-slate-300">
          <li>• Created a real web application with AI assistance</li>
          <li>• Deployed it to the internet using GitHub Pages</li>
          <li>• Learned the basics of version control (Git)</li>
          <li>• Got a live URL you can share with anyone!</li>
        </ul>
      </div>

      {/* Share */}
      <div className="bg-slate-700/50 rounded-xl p-4">
        <p className="text-slate-400 text-sm">
          Share your creation! Send the URL to friends, add it to your portfolio,
          or post it on social media. You built something real today!
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-700">
        {/* Header */}
        <div className="p-5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <h2 className="text-lg font-bold text-white">Deploy Your App</h2>
              <p className="text-xs text-slate-400">Step {currentStep + 1} of {STEPS.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Progress bar */}
        <div className="px-5 pt-4">
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 h-2 rounded-full overflow-hidden bg-slate-800">
                <div className={`h-full rounded-full transition-all duration-300 ${
                  i < currentStep ? 'bg-emerald-500 w-full' :
                  i === currentStep ? 'bg-cyan-500 w-full' :
                  'w-0'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{step.icon}</span>
            <h3 className="text-xl font-bold text-white">{step.title}</h3>
          </div>

          {step.id === 'upload-code' ? renderUploadStep() :
           step.id === 'success' ? renderSuccessStep() :
           step.content}
        </div>

        {/* Navigation */}
        <div className="p-5 border-t border-slate-700 flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2 bg-slate-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 font-bold rounded-xl"
            >
              Next Step →
            </Button>
          ) : (
            <Button onClick={onClose} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 font-bold rounded-xl">
              Done!
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeployGuide;

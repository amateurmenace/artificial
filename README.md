# ARTIFICIAL: Games for AI Literacy v4

Interactive multiplayer games that teach critical AI literacy skills through hands-on learning.

## 🎮 Games

### 🔍 Spot the Fake
Learn to identify AI-generated images through hands-on detection challenges.
- Real-world case studies (Pope puffer jacket, Pentagon explosion, etc.)
- Detection techniques by category (faces, backgrounds, metadata)
- Ethics and legal discussions
- Create & Deceive round

### 🖼️ Meme Machine
Create viral advocacy memes for community issues using AI tools.
- Step-by-step wizard interface
- AI caption generation & image creation
- Expert critique on effectiveness
- Viral simulation with reactions

### 💻 Vibe Code Challenge ✨ NEW
Build civic apps using AI - no coding experience required!

**8 Educational Steps:**
1. 💡 Spark - Choose from 24 civic app prompts
2. 🧠 Brainstorm - Chat with BYTE AI mentor
3. 🌀 Add Twist - Force uniqueness (no generic apps!)
4. ✏️ Wireframe - Sketch your UI layout
5. 🎨 Mockup - AI generates visual preview
6. ⚡ Build - Generate complete HTML app
7. ✨ Polish - Fix bugs with AI help
8. 🚀 Launch - Submit, download, or build another

**Features:**
- BYTE AI Mentor (witty artistic civic technologist)
- Villain popups (GLITCH, SCOPE CREEP, BLAND BOT, TIME THIEF)
- Prominent timer with urgency mode
- Multiple projects support
- Download code with usage guide

## 📊 Facilitator Dashboard

Unified view for projector/TV display:
- Large live timer with progress bar
- Phase control with navigation
- Real-time player/submission stats
- Activity feed
- Leaderboard
- Live submission gallery

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## ⚙️ Setup

### OpenAI API Key
1. Get a key from https://platform.openai.com
2. Click "⚠️ Set API Key" in the app header
3. Key is stored locally in your browser

### Firebase
Pre-configured with Anthropic's demo project. For your own:
1. Create a Firebase project
2. Enable Anonymous Auth and Firestore
3. Update `src/firebase.js` with your config

## 📁 Project Structure

```
artificial-v4/
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── index.js            # React entry point
│   ├── index.css           # Tailwind CSS + custom styles
│   ├── App.js              # Main app, routing, auth
│   ├── components.js       # Shared UI components
│   ├── firebase.js         # Firebase configuration
│   ├── ai-services.js      # OpenAI API integration
│   ├── EnhancedHomepage.js # Landing page
│   ├── SpotTheFake.js      # Detection game
│   ├── MemeMachine.js      # Meme creation game
│   ├── VibeCodeChallenge.js # Civic app building game
│   ├── FacilitatorDashboard.js # Projector display
│   ├── educational-content.js  # Real-world examples, ethics
│   └── image-database.js   # Demo images for Spot the Fake
├── build/                  # Production build (ready to deploy)
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 💰 API Costs

- **GPT-4o-mini**: ~$0.15 per 1M tokens
- **DALL-E 3**: ~$0.04 per image

Per 10-player session:
- Spot the Fake: $0-2
- Meme Machine: $1-3  
- Vibe Code: $2-6

## 🎓 Learning Objectives

- **Detection**: Spot AI-generated content
- **Ethics**: When is AI use appropriate vs harmful?
- **Creation**: Use AI tools effectively
- **Critical Thinking**: Question and evaluate AI outputs

## 📜 License

Free for educational use.

---

**ARTIFICIAL: games for ai literacy** 🎮

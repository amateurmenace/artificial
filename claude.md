# ARTIFICIAL - AI Literacy Games Platform

## Project Overview

**ARTIFICIAL** is an educational AI literacy game platform designed to teach AI concepts through interactive multiplayer gameplay. The platform consists of three core games that help players develop critical thinking skills about AI, learn prompt engineering, and understand human-AI collaboration.

**Live URL**: Deployed via Firebase Hosting
**Repository**: https://github.com/amateurmenace/artificial
**Creator**: Stephen Walter (weirdmachine.org)
**Partners**: Brookline Interactive Group, Neighborhood AI

---

## Core Games

### 1. 🔍 Spot the Fake
**Purpose**: Teach players to identify AI-generated images

**Features**:
- Real vs AI image detection rounds
- Ethics discussion phase
- Legal landscape education
- **Werewolf-style finale**: One player secretly has the AI image and must convince others it's real

**Flow**: Lobby → Detection Rounds → Ethics Phase → Legal Phase → Werewolf Finale → Results

### 2. 🚀 Meme Machine
**Purpose**: Teach prompt engineering through advocacy meme creation

**Features**:
- AI image generation with DALL-E
- Prompt enhancement education (shows original vs enhanced prompts)
- Señor Slop villain (represents lazy AI usage)
- Virality simulation with emoji reactions
- **Awards**: Most Viral Meme, Most Dank Meme

**Flow**: Lobby → Topic Selection → Prompt Writing → AI Generation → Critique → Iteration → Voting → Virality Simulation → Awards

### 3. 💻 Vibe Code Challenge
**Purpose**: Teach "vibe coding" - building apps by describing what you want

**Features**:
- Step-by-step guided journey with BYTE (AI mentor)
- Villain battles: CHAOS, COMPLEXITY, CONFUSION, BUGS, SCOPE CREEP
- **EnhancementCard**: Shows user input vs BYTE's enhancement with explanation
- **AI Generation tracking**: "Generate for me" button costs points
- Real app generation with live preview
- Terminal-style initialization animation
- **Awards**: Most Talked About, Best Vibe Coder, Most Likely to Be Replaced by AI

**Flow**: Lobby → Problem → Users → Features → Twist → Style → Review → Build → Iterate → Submit → Vote → Awards

---

## Tournament Mode

Play all three games back-to-back with persistent scoring across games. Winner receives the **Human Award Certificate** (downloadable PNG).

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 |
| Styling | Tailwind CSS |
| Database | Firebase Firestore (real-time) |
| Auth | Firebase Anonymous Auth |
| Hosting | Firebase Hosting |
| AI - Images | OpenAI DALL-E 3 |
| AI - Text/Code | OpenAI GPT, Google Gemini, Claude |

---

## File Structure

```
src/
├── App.js                    # Main app, routing, game orchestration, tournament mode
├── EnhancedHomepage.js       # Homepage with animated previews, info pages
├── GameShowcase.js           # Enhanced homepage showcase sections for all games
├── SpotTheFake.js            # Spot the Fake game (werewolf finale)
├── MemeMachine.js            # Meme Machine game (virality simulation)
├── VibeCodeChallenge.js      # Vibe Code game (villains, voting, awards)
├── ModelComparison.js        # AI Model Comparison bonus game (blind testing)
├── RemixMode.js              # Remix Mode bonus game (fork & iterate)
├── PromptTimeline.js         # Shared prompt history/replay sidebar
├── DeployGuide.js            # GitHub Pages deployment wizard
├── FacilitatorDashboard.js   # Host dashboard, projector display
├── components.js             # Shared UI components
├── firebase.js               # Firebase config, real-time subscriptions
├── ai-services.js            # AI API integrations (OpenAI, Gemini, Claude)
├── educational-content.js    # Educational text content
├── image-database.js         # Real/AI image pairs for Spot the Fake
├── index.js                  # React entry point
├── index.css                 # Global styles
└── index.html                # HTML template
```

---

## Key Components

### App.js
- Game state management (view, gameCode, room, currentGame)
- Tournament mode orchestration
- URL routing for dashboard (`/dashboard?code=XXXX`)
- Info page routing (`/info/[page-id]`)
- Human Award Certificate generation (canvas-based PNG)
- TournamentResults component

### EnhancedHomepage.js
- Animated game previews (SpotTheFakePreview, MemeMachinePreview, CodePreviewAnimation)
- INFO_PAGES content (6 educational pages)
- InfoPage component for rendering info pages
- Footer with clickable links

### VibeCodeChallenge.js (v9)
- BYTE AI mentor with animated moods
- VillainBanner component
- EnhancementCard (user input vs enhancement + explanation)
- AIGenerateButton with warning tooltip (-15 points per use)
- AppPreview with terminal initialization animation
- AwardCard for results display
- AI usage tracking for "Most Likely to Be Replaced by AI" award

### ai-services.js
- `chatCompletion()` - Unified API for text/code generation
- `generateImage()` - DALL-E image generation
- `hasApiKey()` / `getApiKey()` / `setApiKey()` - API key management
- `getProvider()` / `setProvider()` - Provider selection (openai, gemini, claude)
- Model configuration per provider

---

## AI Model Configuration

Current models in `ai-services.js` (updated to latest):

| Provider | Text/Code Model | Image Model |
|----------|-----------------|-------------|
| OpenAI | gpt-5-mini | dall-e-3 |
| Gemini | gemini-3-flash-preview | gemini-2.5-flash-image (Nano Banana) |
| Claude | claude-sonnet-4-5-20250929 | - |
| Groq | llama-3.3-70b-versatile | - |

**Default API Key**: A facilitator-provided Gemini API key is loaded from `.env` (`REACT_APP_DEFAULT_GEMINI_KEY`) as fallback, so users don't need to configure their own key. Users can still override with their own key via the settings modal. **Never hardcode API keys in source files** — use `.env` (gitignored) for all secrets.

---

## Firebase Structure

```
games/
└── {gameCode}/
    ├── hostId: string
    ├── gameType: 'spotTheFake' | 'memeMachine' | 'vibeCode' | 'tournament'
    ├── phase: string
    ├── currentRound: number
    ├── players/
    │   └── {oderId}/
    │       ├── id: string
    │       ├── name: string
    │       ├── score: number
    │       ├── votes: number
    │       └── tournamentScore: number
    └── submissions/
        └── {submissionId}/
            ├── type: string
            ├── playerId: string
            ├── content: any
            └── timestamp: number
```

---

## Recent Changes (v12)

1. **AI Model Comparison Game** - Same prompt sent to multiple AI models, blind voting, dramatic reveal. Includes **Image Generation** comparison (DALL-E vs Nano Banana vs Stable Diffusion vs FLUX). Parallel generation racing with 🥇🥈🥉 speed medals and timing. Per-provider model selection and temperature controls. Provider add/remove with smart filtering
2. **Prompt History/Replay Timeline** - Slide-out sidebar in Meme Machine and Vibe Code showing all prompts sent during the session with insights and filters
3. **Remix Mode** - New bonus mini-game: fork another player's app/meme, iterate on it, vote on best remixes
4. **Real-World Deployment** - Step-by-step GitHub Pages deployment wizard in Vibe Code — players leave with a live URL
5. **Enhanced Homepage** - Compact game grid with animated previews, gradient photo placeholders (no emojis), SVG pixel-art icons. Side-by-side "How to Play" + "What You'll Learn". About cards always visible. "Ready in 60 Seconds" with SVG icons (no emojis). FAQ collapsed. Single footer. Dashboard activity feed shows player joins, votes, reactions, submissions with timestamps
6. **multiProviderCompletion** - New AI service function for running the same prompt against multiple providers in parallel
7. **API Key Security** - All API keys moved from hardcoded source to `.env` environment variables. Old keys scrubbed from git history with `git-filter-repo`. `.env.example` provided for documentation
8. **Persistent Dashboard Button** - All three games now show a fixed "📊 Dashboard" button for the host on every phase (was previously only in lobby)
9. **Meme Machine UX** - Enhance button shows loading spinner while BYTE is working. "Skip enhancement" option to go straight to image generation. Fixed Firebase `arrayUnion` nested entity error on meme submission (removed `comments: []`, flattened `aiFeedback`)
10. **Navigation** - Logo is clickable (returns home) across all views. Info pages have fixed top nav bar. Consistent exit + dashboard buttons across all games
11. **Top Navigation** - Fixed ARTIFICIAL nav bar added to Info pages with Logo link home

## Previous Changes (v11)

1. **Default Gemini API Key** - Facilitator key hardcoded as fallback so users don't need their own
2. **Nano Banana Image Gen** - Switched from Imagen 3 to Gemini native image generation (`gemini-2.5-flash-image`)
3. **Gemini for All Games** - Meme Machine now uses Gemini for both chat and images (was OpenAI)
4. **Vibe Code UX Improvements**:
   - Glowing contextual input labels per step ("What problem will your app solve?", etc.)
   - Step-specific placeholder examples in input field
   - Cyan glow border on input to draw user attention
   - Fixed auto-generated response truncation (maxTokens 300→800)
   - Expandable prompt preview in AI Dashboard (was hard-truncated at 500 chars)
   - Download App button (available after build and after submission)
   - Increased code generation token limits (16K→32K) for complete apps

## Previous Changes (v10)

1. **AI Models Updated** - All providers using latest models
2. **claude.md created** - Project documentation for session continuity

## Previous Changes (v9)

1. **Dashboard routing fixed** - URL `/dashboard?code=XXXX` now works
2. **Combined "Choose Your Adventure" + "See What's Possible"** - Animated previews for all 3 games
3. **SpotTheFakePreview** - New animated component matching other game previews
4. **Info Pages** - 6 educational pages (AI Image Generation, AI Detection Skills, Prompt Engineering, For Educators, For Facilitators, Open Source)
5. **Footer links clickable** - All footer items link to info pages
6. **Footer styling** - Both credit lines same size, year changed to 2026
7. **Vibe Code enhancements**:
   - EnhancementCard shows user input vs BYTE's version with explanation
   - AIGenerateButton with -15 point penalty and warning tooltip
   - "Most Likely to Be Replaced by AI" award
   - Terminal initialization animation during code generation
   - Improved app generation prompt for more functional apps

---

## Deployment

```bash
# Install dependencies
npm install

# Run locally
npm start

# Deploy to Firebase
npm run build
firebase deploy
```

Requires:
- Firebase project configured
- API keys set in localStorage or environment

---

## API Key Setup

**IMPORTANT**: API keys are stored in `.env` (gitignored, never committed). See `.env.example` for the template.

Environment variables (loaded at build time by Create React App):
- `REACT_APP_DEFAULT_GEMINI_KEY` - Facilitator fallback key
- `REACT_APP_FIREBASE_API_KEY` - Firebase config
- `REACT_APP_FIREBASE_*` - Other Firebase config values

User-configured keys are stored in localStorage:
- `ai_provider`: 'openai' | 'gemini' | 'claude'
- `ai_key_openai`, `ai_key_gemini`, `ai_key_anthropic`

---

## Educational Philosophy

1. **Human + AI Collaboration**: AI assists but humans guide the vision
2. **Learn by Doing**: Hands-on gameplay teaches better than lectures
3. **Critical Thinking**: Detect AI content, understand limitations
4. **Responsible Use**: Track AI usage, warn against over-reliance
5. **Iteration**: Best results come from refining with AI feedback

---

## Known Issues / TODO

- [x] Update AI models to latest versions across all providers ✓
- [x] Default API key for zero-config user experience ✓
- [x] Nano Banana image generation ✓
- [x] Vibe Code UX clarity improvements ✓
- [x] Download app button ✓
- [ ] Mobile responsiveness improvements
- [ ] Offline mode / better error handling for API failures
- [ ] More image pairs for Spot the Fake
- [ ] Localization support
- [ ] Live collaboration mode (see each other's progress)
- [x] AI model comparison round ✓
- [x] Prompt history/replay timeline ✓
- [x] "Remix" mode (fork others' apps) ✓
- [ ] Accessibility challenge round
- [x] Real-world deployment (GitHub Pages) ✓

---

## Session Continuity Notes

When starting a new session:
1. Reference this claude.md for context
2. Check the current state of files in the project
3. User's GitHub: https://github.com/amateurmenace/artificial
4. Latest working version: artificial-v10-FINAL.zip

---

*Last updated: March 28, 2026 (v12)*

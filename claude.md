# ARTIFICIAL - AI Literacy Games Platform

## Project Overview

**ARTIFICIAL** is an educational AI literacy game platform designed to teach AI concepts through interactive multiplayer gameplay. The platform consists of three core games plus bonus mini-games that help players develop critical thinking skills about AI, learn prompt engineering, and understand human-AI collaboration.

**Live URL**: https://artificial-games.web.app
**Repository**: https://github.com/amateurmenace/artificial
**Creator**: Stephen Walter (weirdmachine.org)
**Partners**: Brookline Interactive Group, Neighborhood AI

---

## Core Games

### 1. Spot the Fake
**Purpose**: Teach players to identify AI-generated images

**Features**:
- Real vs AI image detection rounds
- Ethics discussion phase
- Legal landscape education
- **Werewolf-style finale**: One player secretly has the AI image and must convince others it's real
- Keyboard shortcuts: ArrowLeft/Right or 1/2 to select images
- Sound effects: tick countdown, ding on voting close, celebration on results

**Flow**: Lobby → Detection Rounds → Ethics Phase → Legal Phase → Werewolf Finale → Results

### 2. Meme Machine
**Purpose**: Teach prompt engineering through advocacy meme creation

**Features**:
- AI image generation with DALL-E / Nano Banana
- Prompt enhancement education (shows original vs enhanced prompts)
- Señor Slop villain (represents lazy AI usage) with whoosh sound effect
- Virality simulation with emoji reactions
- Live collaboration bar showing other players' progress
- **Awards**: Most Viral Meme, Most Dank Meme, Slop Slayer

**Flow**: Lobby → Topic Selection → Prompt Writing → AI Generation → Critique → Iteration → Voting → Virality Simulation → Awards

### 3. Vibe Code Challenge
**Purpose**: Teach "vibe coding" - building apps by describing what you want

**Features**:
- Step-by-step guided journey with BYTE (AI mentor)
- Villain battles: CHAOS, COMPLEXITY, CONFUSION, BUGS, SCOPE CREEP, SLOP
- **EnhancementCard**: Shows user input vs BYTE's enhancement with explanation
- **AI Generation tracking**: "Generate for me" button costs points
- Real app generation with live preview
- Terminal-style initialization animation
- Live collaboration bar showing other players' step progress
- **Awards**: Most Talked About, Best Vibe Coder, Most Likely to Be Replaced by AI

**Flow**: Lobby → Problem → Users → Features → Twist → Style → Review → Build → Iterate → Submit → Vote → Awards

---

## Bonus Games

### Model Comparison
- Same prompt sent to multiple AI models side-by-side
- Blind voting, then dramatic reveal of which model made which
- Image generation comparison (DALL-E vs Nano Banana vs Stable Diffusion vs FLUX)
- Parallel generation racing with speed medals and timing
- **Pre-built prompt templates** per category (code, image, meme, story, explain)

### Remix Mode
- Fork another player's app/meme, iterate on it
- Vote on best remixes
- Awards: Best Remix, Most Remixed, Best Collaborator

### Accessibility Challenge
- 8 challenges across 4 categories: color contrast, alt text, ARIA labels, keyboard navigation
- Teaches WCAG basics through hands-on evaluation
- Awards: Accessibility Champion, A11y Advocate, Inclusion Learner

### Tournament Mode
Play all three core games back-to-back with persistent scoring. Winner receives the **Human Award Certificate** (downloadable PNG).

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 |
| Styling | Tailwind CSS |
| Database | Firebase Firestore (real-time) |
| Auth | Firebase Anonymous Auth |
| Hosting | Firebase Hosting |
| AI - Images | OpenAI DALL-E 3, Gemini Nano Banana, Stability SD3.5, Together FLUX |
| AI - Text/Code | OpenAI GPT-5 Mini, Google Gemini 3 Flash, Claude Sonnet 4.5, Groq Llama 3.3 |
| Audio | Web Audio API (programmatic, no files) |

---

## File Structure

```
src/
├── App.js                    # Main app, routing, game orchestration, tournament mode
├── EnhancedHomepage.js       # Homepage with animated previews, info pages
├── GameShowcase.js           # Enhanced homepage showcase sections for all games
├── APISettingsModal.js       # API key and provider configuration modal
├── SpotTheFake.js            # Spot the Fake game (werewolf finale)
├── MemeMachine.js            # Meme Machine game (virality simulation)
├── VibeCodeChallenge.js      # Vibe Code game (villains, voting, awards)
├── ModelComparison.js        # AI Model Comparison bonus game (blind testing)
├── RemixMode.js              # Remix Mode bonus game (fork & iterate)
├── AccessibilityChallenge.js # Accessibility challenge bonus game (WCAG education)
├── PromptTimeline.js         # Shared prompt history/replay sidebar
├── DeployGuide.js            # GitHub Pages deployment wizard
├── FacilitatorDashboard.js   # Host dashboard, projector display, session export
├── components.js             # Shared UI components (see below)
├── firebase.js               # Firebase config, real-time subscriptions, timer sync
├── ai-services.js            # AI API integrations + retry/error handling
├── sounds.js                 # Web Audio API sound effects (no dependencies)
├── educational-content.js    # Educational text content
├── image-database.js         # Real/AI image pairs for Spot the Fake
├── index.js                  # React entry point
├── index.css                 # Global styles + mobile utilities
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
- Sound system initialization (`initAudio()` on first interaction)
- SoundToggle in header

### components.js — Shared UI Library
**Basic**: Logo, Button (7 variants, 5 sizes, 44px min touch targets), Card, Input
**Timer**: Timer (local), BigTimer (shared visual), SyncedTimer (Firebase server-time synced)
**Display**: ProgressSteps, PlayerList, ScoreDisplay, ScoreBar
**Images**: ImageUploader, ImageCard
**Feedback**: Alert, AIErrorBanner (retry/dismiss for AI errors), ReactionBar (5 emoji reactions)
**Modals**: Modal (with Escape key close), ConfirmDialog
**Social**: Badge, CollaborationBar (live player status during build phases)
**Results**: ShareableResultCard (canvas-based PNG download)
**Code**: AIChatAssistant, CodePreview (iframe sandbox), CodeEditor, CodeStreamingAnimation
**Hooks**: useKeyboardShortcuts (ignores events in inputs)
**Controls**: SoundToggle (mute/unmute with localStorage)

### ai-services.js
- `withRetry(fn, maxRetries, delayMs)` - Exponential backoff for retryable errors (429, 500, network)
- `formatUserError(error)` - Maps raw errors to friendly strings
- `chatCompletion()` - Unified API for text/code generation (wrapped with retry)
- `generateImage()` - Multi-provider image generation (wrapped with retry)
- `multiProviderCompletion()` - Parallel generation across providers
- `hasApiKey()` / `getApiKey()` / `setApiKey()` - API key management
- `getProvider()` / `setProvider()` - Provider selection
- Per-game model selection via `getProviderForGame()`
- Game-specific helpers: `critiqueMeme`, `suggestMemeEdits`, `generateMemeCaptions`, `generateMemeImagePrompt`, `brainstormMemeIdeas`, `generateInitialCode`, `iterateCode`, `polishCode`, `byteChat`, `analyzeImageAuthenticity`, `generateFakeDetectionTips`

### sounds.js
- `initAudio()` - Creates AudioContext on first user gesture
- `playDing()` - Ascending two-tone (voting close, phase transitions)
- `playWhoosh()` - Filtered noise sweep (villain appearances)
- `playCelebration()` - Arpeggiated chord (awards/results)
- `playTick()` - Short click (timer last 10 seconds)
- `isMuted()` / `setMuted()` / `toggleMute()` - Backed by localStorage
- Haptic feedback via `navigator.vibrate()` on supported mobile devices

### firebase.js
- `createGameRoom()` / `joinGameRoom()` / `subscribeToRoom()` - Room lifecycle
- `updateGamePhase()` / `submitToGame()` / `submitVote()` / `addReaction()` - Game actions
- `updatePlayerScore()` - Score management
- `startTimer(code, durationSeconds)` - Server-timestamped timer start
- `getTimerRemaining(room)` - Pure function computing seconds left from server time
- `updatePlayerStatus(code, playerId, status)` - Live collaboration (typing/progress/step)
- `setDisplayMode()` / `togglePause()` / `extendTimer()` - Facilitator controls

### FacilitatorDashboard.js
- BigTimer with add/subtract controls
- Activity feed (player joins, submissions, reactions)
- Leaderboard (top 10, medal badges)
- Meme Gallery + App Gallery with demo modals
- Projector View for classroom display
- **Export Session** - Downloads HTML report with leaderboard, submissions, summary

---

## AI Model Configuration

Current models in `ai-services.js`:

| Provider | Text/Code Model | Image Model |
|----------|-----------------|-------------|
| OpenAI | gpt-5-mini | dall-e-3 |
| Gemini | gemini-3-flash-preview | gemini-2.5-flash-image (Nano Banana) |
| Claude | claude-sonnet-4-5-20250929 | - |
| Groq | llama-3.3-70b-versatile | - |
| Ollama | llama3.2 (local) | - |
| Stability | - | sd3.5-large |
| Together | Llama-3.3-70B-Instruct-Turbo | FLUX.1-schnell |

**Default API Key**: A facilitator-provided Gemini API key is loaded from `.env` (`REACT_APP_DEFAULT_GEMINI_KEY`) as fallback, so users don't need to configure their own key. Users can still override with their own key via the settings modal. **Never hardcode API keys in source files** — use `.env` (gitignored) for all secrets.

---

## Firebase Structure

```
gameRooms/
└── {gameCode}/
    ├── code: string
    ├── gameType: 'spotTheFake' | 'memeMachine' | 'vibeCode' | 'modelComparison' | 'remix' | 'accessibility' | 'tournament'
    ├── hostId: string
    ├── hostName: string
    ├── phase: string
    ├── currentRound: number
    ├── isPaused: boolean
    ├── timerStart: serverTimestamp    # (v13) server-synced timer
    ├── timerDuration: number          # (v13) seconds
    ├── timerExtension: number
    ├── players: [{ id, name, isHost, score, joinedAt, tournamentScore }]
    ├── submissions: [{ oderId, type, timestamp, ...content }]
    ├── votes: { [userId]: voteData }
    ├── reactions: { [submissionId]: { [type]: count } }
    ├── playerStatus: { [playerId]: { typing, progress, currentStep, updatedAt } }  # (v13) live collab
    ├── displayMode: string | null
    ├── displayData: any | null
    ├── featuredSubmission: string | null
    ├── settings: { roundTime, maxPlayers }
    └── createdAt: serverTimestamp
```

---

## Recent Changes (v13)

1. **Error Handling Infrastructure** - `withRetry()` wrapper with exponential backoff for all AI calls. `formatUserError()` maps raw API errors to friendly messages ("AI is busy, trying again..."). `AIErrorBanner` component for consistent error display with retry/dismiss.
2. **Sound Effects System** - Web Audio API-based sounds (no npm deps): `playDing()`, `playWhoosh()`, `playCelebration()`, `playTick()`. Haptic feedback on mobile. `SoundToggle` mute button in header. New file: `src/sounds.js`
3. **Timer Sync & Auto-Advance** - `startTimer()` and `getTimerRemaining()` in firebase.js use server timestamps so all players see the same timer. Shared `BigTimer` and `SyncedTimer` components extracted to components.js.
4. **Mobile Responsiveness Pass** - Touch-friendly 44px minimum targets on all buttons. `touch-action: manipulation` prevents double-tap zoom. Responsive grids (`grid-cols-2 sm:grid-cols-3`) for style/mood selectors. Mobile hero text scaling. Scroll-snap CSS utilities.
5. **Prompt Templates for Model Comparison** - `PROMPT_TEMPLATES` constant with 2-3 curated prompts per comparison type. Template pill buttons below prompt input.
6. **Shareable Results Cards** - `ShareableResultCard` canvas-based PNG generation added to results phase of all 3 core games.
7. **Keyboard Shortcuts** - `useKeyboardShortcuts()` hook. ArrowLeft/ArrowRight or 1/2 for SpotTheFake image selection. Escape closes all modals.
8. **Accessibility Challenge Round** - New bonus game (`src/AccessibilityChallenge.js`) with 8 challenges across 4 categories: color contrast, alt text, ARIA labels, keyboard navigation.
9. **Live Collaboration Mode** - `updatePlayerStatus()` in firebase.js writes typing/progress/step to `playerStatus` map. `CollaborationBar` component shows other players' real-time progress. Integrated in VibeCode and MemeMachine build phases.
10. **Session Replay/Export** - "Export Session" button in FacilitatorDashboard generates downloadable HTML report with leaderboard, submissions, and summary.

## Previous Changes (v12)

1. **AI Model Comparison Game** - Same prompt sent to multiple AI models, blind voting, dramatic reveal. Image generation comparison. Parallel generation racing with speed medals.
2. **Prompt History/Replay Timeline** - Slide-out sidebar in Meme Machine and Vibe Code
3. **Remix Mode** - Fork another player's creation, iterate, vote on best remixes
4. **Real-World Deployment** - GitHub Pages deployment wizard in Vibe Code
5. **Enhanced Homepage** - Compact game grid with animated previews, SVG pixel-art icons
6. **multiProviderCompletion** - Parallel prompt execution across providers
7. **API Key Security** - Keys moved to `.env`, scrubbed from git history
8. **Persistent Dashboard Button** - All games show fixed Dashboard button for host
9. **Meme Machine UX** - Loading spinner, skip enhancement, fixed Firebase arrayUnion error
10. **Navigation** - Clickable logo, fixed nav bars, consistent exit/dashboard buttons

## Previous Changes (v11)

1. **Default Gemini API Key** - Facilitator key as fallback for zero-config
2. **Nano Banana Image Gen** - Gemini native image generation
3. **Gemini for All Games** - Meme Machine uses Gemini for chat and images
4. **Vibe Code UX** - Contextual labels, placeholder examples, cyan glow, expanded tokens

## Previous Changes (v10)

1. **AI Models Updated** - All providers using latest models
2. **claude.md created** - Project documentation for session continuity

## Previous Changes (v9)

1. **Dashboard routing** - URL `/dashboard?code=XXXX` works
2. **Game previews** - Animated previews for all 3 games
3. **Info Pages** - 6 educational pages with footer links
4. **Vibe Code** - EnhancementCard, AIGenerateButton, villain animations, terminal animation

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
- Firebase project configured (`artificial-games`)
- API keys set in `.env` (see `.env.example`)

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
- `sound_muted`: 'true' | 'false'

---

## Educational Philosophy

1. **Human + AI Collaboration**: AI assists but humans guide the vision
2. **Learn by Doing**: Hands-on gameplay teaches better than lectures
3. **Critical Thinking**: Detect AI content, understand limitations
4. **Responsible Use**: Track AI usage, warn against over-reliance
5. **Iteration**: Best results come from refining with AI feedback
6. **Accessibility**: Everyone should be able to participate (WCAG education)

---

## Known Issues / TODO

- [x] Update AI models to latest versions across all providers
- [x] Default API key for zero-config user experience
- [x] Nano Banana image generation
- [x] Vibe Code UX clarity improvements
- [x] Download app button
- [x] Mobile responsiveness improvements (v13)
- [x] Better error handling for API failures (v13)
- [x] Live collaboration mode (v13)
- [x] AI model comparison round
- [x] Prompt history/replay timeline
- [x] "Remix" mode (fork others' apps)
- [x] Accessibility challenge round (v13)
- [x] Real-world deployment (GitHub Pages)
- [x] Sound effects & haptic feedback (v13)
- [x] Timer sync across players (v13)
- [x] Pre-built prompt templates for Model Comparison (v13)
- [x] Shareable results cards (v13)
- [x] Keyboard shortcuts (v13)
- [x] Session replay/export (v13)
- [ ] More image pairs for Spot the Fake
- [ ] Localization support
- [ ] Offline mode / graceful degradation
- [ ] More accessibility challenge content
- [ ] Add Accessibility Challenge to GameShowcase.js grid

---

## Session Continuity Notes

When starting a new session:
1. Reference this CLAUDE.md for context
2. Check the current state of files in the project
3. User's GitHub: https://github.com/amateurmenace/artificial
4. Firebase project: `artificial-games`
5. Live URL: https://artificial-games.web.app

---

*Last updated: March 28, 2026 (v13)*

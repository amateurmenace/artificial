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
  },
  'about-artificial': {
    title: 'More About ARTIFICIAL',
    icon: '🧠',
    color: '#14b8a6',
    sections: [
      // ---- PHILOSOPHY ----
      {
        heading: 'Philosophy',
        content: `ARTIFICIAL is built on a simple conviction: the best way to understand AI is to use it, together, in a room full of people asking hard questions. Here's how that conviction shapes everything we build.`
      },
      {
        heading: 'Experiential Over Theoretical',
        content: `Slides and lectures about AI can't compete with the experience of generating an image from a prompt you wrote, or watching three different AI models produce wildly different answers to the same question. Every game in ARTIFICIAL puts tools directly in players' hands. You learn what "prompt engineering" means by watching your first terrible prompt produce a nonsensical image, then refining it until the AI gives you something you're proud of. That cycle of try, fail, iterate, succeed is the whole curriculum.`
      },
      {
        heading: 'Shared Experience, Shared Language',
        content: `AI literacy isn't just a technical skill. It's a cultural one. When a room full of people all look at the same image and disagree about whether it's real or AI-generated, that disagreement is the lesson. When one person's meme goes viral in the simulation and another's falls flat, the group can talk about why. ARTIFICIAL creates a shared vocabulary and a shared set of experiences that participants can reference long after the session ends.`
      },
      {
        heading: 'Critical Thinking First, Tools Second',
        content: `Knowing how to use AI tools is useful. Knowing when to question them is essential. Spot the Fake trains players to examine evidence before making judgments. The ethics and legal discussion phases built into every game ensure that "cool technology" never exists in a vacuum. Players leave not just knowing how to prompt an AI, but understanding the stakes of doing so.`
      },
      {
        heading: 'Playful, Not Patronizing',
        content: `ARTIFICIAL has villain bosses, meme virality simulations, and an award called "The Human Award" that certifies the winner as: PERSON. The tone is intentionally playful. But the underlying questions are serious: What does it mean when AI can generate any image you describe? Who's responsible when AI-generated content causes harm? Can you trust code you didn't write? The playfulness lowers the barrier to engaging with these questions honestly.`
      },
      {
        heading: 'A Comprehensive Primer',
        content: `Across its games and modes, ARTIFICIAL covers an unusually wide range of what AI can do right now: image generation, text and code generation, multi-model comparison, image authentication, accessibility evaluation, and collaborative remixing. The goal is to give players a hands-on survey of the AI landscape so they can make informed choices about which tools to use, when to be skeptical, and where the real controversies lie.`
      },
      // ---- TECHNOLOGY ----
      {
        heading: 'Technology',
        content: `ARTIFICIAL is a real-time multiplayer web application connecting players to multiple AI providers. Here's what powers it under the hood.`
      },
      {
        heading: 'Frontend Architecture',
        content: `The app is built with React 18 and styled with Tailwind CSS. It runs entirely in the browser with no server-side rendering. The UI is designed to work on phones, tablets, and desktops, with 44px minimum touch targets and responsive layouts throughout. Sound effects use the Web Audio API with no external dependencies.`
      },
      {
        heading: 'Real-Time Multiplayer',
        content: `Firebase Firestore provides the real-time database layer. When a host creates a game room, all players subscribe to a shared document that updates in real time, powering synchronized timers, live collaboration bars, voting, and the facilitator dashboard. Anonymous Firebase Auth handles player identity without requiring accounts.`
      },
      {
        heading: 'AI Integration',
        content: `ARTIFICIAL connects to seven AI providers: OpenAI (GPT-5 Mini, DALL-E 3), Google Gemini (Gemini 3 Flash, Nano Banana image generation), Anthropic Claude (Sonnet 4.5), Groq (Llama 3.3), Stability AI (SD3.5), Together AI (FLUX), and local Ollama. Each game uses the appropriate model for its task. The Model Battle game lets players see these models compete head-to-head. All API calls include exponential backoff retry logic and user-friendly error messages.`
      },
      {
        heading: 'Facilitator Tools',
        content: `The Facilitator Dashboard gives hosts full control: pause/resume games, extend timers, feature specific submissions on the projector display, view a live activity feed, and export complete session reports as downloadable HTML files. The projector URL works as a separate display for classroom or workshop settings.`
      },
      // ---- CREDITS ----
      {
        heading: 'Who Made This',
        content: `ARTIFICIAL was designed and developed by Stephen Walter (weirdmachine.org) in collaboration with Brookline Interactive Group and Neighborhood AI. The entire application was built using Claude Code, Anthropic's AI coding tool, as a demonstration that the same human-AI collaboration philosophy taught in the games applies to building them too.`
      },
      {
        heading: 'Open Source & License',
        content: `ARTIFICIAL is released under the Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0) license. You are free to use, modify, and redistribute it for educational purposes, provided you give credit and share your improvements under the same license. The full source code is available on GitHub.`,
        link: {
          url: 'https://github.com/amateurmenace/artificial',
          text: 'View on GitHub →'
        }
      },
      {
        heading: 'API Key Sponsorship',
        content: `The default Gemini API key that powers ARTIFICIAL out of the box is currently donated by the developer. This means facilitators and players can use the platform without needing their own API credentials. Users who want to use other providers (OpenAI, Anthropic, etc.) or who need higher usage limits can configure their own API keys through the settings panel.`
      }
    ]
  },
  'faqs': {
    title: 'Frequently Asked Questions',
    icon: '❓',
    color: '#6366f1',
    sections: [
      // Getting Started
      {
        heading: 'Getting Started',
        content: `Everything you need to know to start playing.`
      },
      {
        heading: 'How do I start a game?',
        content: `Click "Host a Game" on the homepage, choose a game type, and share the 6-character room code with your players. They visit the site and click "Join with Code" to enter. No accounts or downloads required.`
      },
      {
        heading: 'Do I need coding experience?',
        content: `Not at all. Every game is designed for complete beginners. Vibe Code Challenge specifically teaches "vibe coding," where you describe what you want in plain language and AI builds it for you. The most technical skill required is typing.`
      },
      {
        heading: 'What ages is this for?',
        content: `We recommend ages 13 and up. The games are educational and age-appropriate, but some content discusses real-world topics like misinformation, deepfakes, and AI ethics that may be more suitable for teens and adults. Educators should preview games before using them with younger groups.`
      },
      {
        heading: 'How many players can join?',
        content: `Most games support 2 to 20 players. Vibe Code and Remix Mode work best with 2 to 15. Tournament mode supports 3 to 15 players. The facilitator dashboard helps manage larger groups.`
      },
      {
        heading: 'What devices work?',
        content: `Any device with a modern web browser: phones, tablets, laptops, or desktops. The interface is optimized for touch on mobile. We recommend tablets or laptops for the best experience, especially for Vibe Code Challenge where you're working with more screen content.`
      },
      // About the Games
      {
        heading: 'About the Games',
        content: `What each game teaches and how they work.`
      },
      {
        heading: 'What does Spot the Fake teach?',
        content: `Spot the Fake teaches visual media literacy. Players learn to identify artifacts in AI-generated images, discuss the ethics of synthetic media, explore the legal landscape around AI content, and play a werewolf-style social deduction finale that tests their ability to argue convincingly about what's real.`
      },
      {
        heading: 'What does Meme Machine teach?',
        content: `Meme Machine teaches prompt engineering through advocacy meme creation. Players write prompts for AI image generation, learn how AI interprets instructions, battle "Senior Slop" (the lazy prompt villain), and watch their memes go through a virality simulation. It teaches both the technical skill of prompting and the creative skill of digital advocacy.`
      },
      {
        heading: 'What does Vibe Code teach?',
        content: `Vibe Code Challenge teaches "vibe coding," the practice of building apps by describing what you want rather than writing code. Players define problems, users, and features, then watch AI generate a working application. They learn about human-AI collaboration, iteration, and can even deploy their creations to the real web.`
      },
      {
        heading: 'What are the bonus games?',
        content: `Model Battle lets players compare different AI models head-to-head with blind voting. Remix Mode lets players fork and improve each other's creations. The Accessibility Challenge teaches WCAG basics through hands-on evaluation tasks. Tournament Mode combines all three core games with persistent scoring.`
      },
      // Technical & API
      {
        heading: 'Technical & API',
        content: `How the technology works behind the scenes.`
      },
      {
        heading: 'Do I need an API key?',
        content: `No. ARTIFICIAL comes with a default Gemini API key donated by the developer, so it works out of the box. If you want to use other AI providers like OpenAI or Anthropic, or if you need higher usage limits, you can add your own API key through the settings panel.`
      },
      {
        heading: 'What AI models does it use?',
        content: `ARTIFICIAL connects to multiple providers: OpenAI GPT-5 Mini and DALL-E 3, Google Gemini 3 Flash and Nano Banana (image generation), Anthropic Claude Sonnet 4.5, Groq Llama 3.3, Stability AI SD3.5, Together AI FLUX, and local Ollama. Different games use different models depending on the task.`
      },
      {
        heading: 'Is my data stored anywhere?',
        content: `Game sessions are stored temporarily in Firebase during gameplay so all players can interact in real time. No personal accounts are created. Player names are self-chosen nicknames. API keys are stored only in your browser's localStorage and are never sent to our servers.`
      },
      {
        heading: 'Does it cost anything to run?',
        content: `ARTIFICIAL itself is free and open source. The default API key covers normal educational use. If you bring your own API key, the AI provider charges small per-use fees (typically fractions of a cent per generation). Hosting your own instance requires a Firebase project (free tier is sufficient for most use cases).`
      },
      // Ownership & Community
      {
        heading: 'Ownership & Community',
        content: `Who made this and how you can get involved.`
      },
      {
        heading: 'Who owns ARTIFICIAL?',
        content: `ARTIFICIAL was created by Stephen Walter in collaboration with Brookline Interactive Group and Neighborhood AI. It is released under the Creative Commons Attribution-ShareAlike 4.0 license, which means it belongs to the community. You can use, modify, and share it freely for educational purposes.`
      },
      {
        heading: 'Can I contribute or modify it?',
        content: `Yes! The full source code is on GitHub. You can fork it, submit pull requests, add new games, translate content, or adapt it for your community's needs. We welcome contributions of all kinds.`
      },
      {
        heading: 'Was this really built with AI?',
        content: `Yes. ARTIFICIAL was built using Claude Code, Anthropic's AI coding tool. The developer guided the design and architecture while AI handled much of the implementation. It's a living example of the human-AI collaboration philosophy that the games teach.`
      },
      {
        heading: 'How can I use this in my classroom or workshop?',
        content: `Check out the "For Educators" and "For Facilitators" guides on the homepage. In short: test your setup beforehand, create a room, share the code, and use the Facilitator Dashboard to manage pacing. Plan discussion questions for between rounds. Many facilitators project the dashboard on a shared screen while players use their own devices.`
      }
    ]
  }
};

// ============================================
// ABOUT ARTIFICIAL - CUSTOM PAGE
// ============================================

const AboutPage = ({ onClose }) => (
  <div className="min-h-screen bg-[#f5f3ef]">
    {/* Fixed top nav */}
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-[#e2e0dc] px-4 py-3 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Logo onClick={onClose} />
        <button onClick={onClose} className="text-sm text-[#6b7c74] hover:text-[#3d5a4c]">Back to Games</button>
      </div>
    </header>

    {/* Hero with Dewey quote */}
    <header className="bg-gradient-to-br from-slate-800 via-slate-700 to-teal-900 text-white pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <button onClick={onClose} className="text-white/60 hover:text-white text-sm mb-8 inline-block transition-colors">← Back to Home</button>
        <h1 className="text-4xl md:text-5xl font-black mb-8">More About ARTIFICIAL</h1>
        <blockquote className="max-w-3xl mx-auto">
          <p className="text-xl md:text-2xl text-teal-200 leading-relaxed italic font-light">
            "The task of democracy is forever that of creation of a freer and more humane experience in which all share and to which all contribute."
          </p>
          <cite className="block mt-4 text-sm text-white/50 not-italic">
            John Dewey — "Creative Democracy: The Task Before Us" (1939)
          </cite>
        </blockquote>
      </div>
    </header>

    <main>
      {/* PHILOSOPHY SECTION */}
      <section className="py-16 px-4 bg-[#f5f3ef]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-3 h-3 rounded-full bg-teal-500" />
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Philosophy</h2>
            <div className="flex-1 h-px bg-slate-300" />
          </div>
          <p className="text-slate-600 mb-10 max-w-2xl">
            ARTIFICIAL is built on a simple conviction: the best way to understand AI is to use it, together,
            in a room full of people asking hard questions.
          </p>

          {/* Two-column philosophy grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Experiential Over Theoretical</h3>
              <p className="text-slate-600 leading-relaxed">
                Slides and lectures about AI can't compete with the experience of generating an image from a prompt you wrote,
                or watching three different AI models produce wildly different answers to the same question. You learn what
                "prompt engineering" means by watching your first terrible prompt produce a nonsensical image, then refining it
                until the AI gives you something you're proud of. That cycle of try, fail, iterate, succeed is the whole curriculum.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Shared Experience, Shared Language</h3>
              <p className="text-slate-600 leading-relaxed">
                AI literacy isn't just a technical skill — it's a cultural one. When a room full of people all look at the same image
                and disagree about whether it's real or AI-generated, that disagreement is the lesson. ARTIFICIAL creates a shared
                vocabulary and a shared set of experiences that participants can reference long after the session ends. The conversations
                that emerge between rounds are as valuable as the gameplay itself.
              </p>
            </div>
          </div>

          {/* Full-width highlight */}
          <div className="bg-gradient-to-r from-slate-800 to-teal-900 rounded-2xl p-8 md:p-10 text-white mb-10">
            <h3 className="text-xl font-bold mb-3">Critical Thinking First, Tools Second</h3>
            <p className="text-white/80 leading-relaxed max-w-3xl">
              Knowing how to use AI tools is useful. Knowing when to question them is essential. Spot the Fake trains players
              to examine evidence before making judgments. The ethics and legal discussion phases built into every game ensure
              that "cool technology" never exists in a vacuum. Players leave not just knowing how to prompt an AI, but
              understanding the stakes of doing so — who's affected, what's at risk, and what questions to ask before hitting "generate."
            </p>
          </div>

          {/* Two more philosophy points */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Playful, Not Patronizing</h3>
              <p className="text-slate-600 leading-relaxed">
                ARTIFICIAL has villain bosses, meme virality simulations, and an award called "The Human Award" that certifies
                the winner as: PERSON. The tone is intentionally playful. But the underlying questions are serious: What does
                it mean when AI can generate any image you describe? Who's responsible when AI-generated content causes harm?
                The playfulness lowers the barrier to engaging with these questions honestly.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">A Comprehensive Primer</h3>
              <p className="text-slate-600 leading-relaxed">
                Across its games and modes, ARTIFICIAL covers an unusually wide range of what AI can do right now: image
                generation and authentication, text and code generation, multi-model comparison, accessibility evaluation,
                and collaborative remixing. The goal is to give players a hands-on survey of the AI landscape so they can
                make informed choices about which tools to use, when to be skeptical, and where the real controversies lie.
              </p>
            </div>
          </div>

          {/* Real civic outputs callout */}
          <div className="mt-10 bg-teal-50 border border-teal-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-teal-800 mb-3">Players Leave with Real Things</h3>
            <p className="text-teal-700 leading-relaxed">
              This isn't a simulation. In Meme Machine, players create actual AI-generated advocacy memes for civic causes
              they care about — content they can share, print, and use in the real world. In Vibe Code Challenge, players
              describe an app and AI builds it into a real, functioning web application they can deploy live to GitHub Pages.
              The skills practiced in ARTIFICIAL produce tangible artifacts, not just abstract understanding.
            </p>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY SECTION */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Technology</h2>
            <div className="flex-1 h-px bg-slate-300" />
          </div>
          <p className="text-slate-600 mb-10 max-w-2xl">
            A real-time multiplayer web application connecting players to multiple AI providers.
          </p>

          {/* Tech grid - 2x2 */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                title: 'Frontend',
                desc: 'React 18 with Tailwind CSS, running entirely in the browser. Responsive layouts with 44px minimum touch targets. Sound effects via Web Audio API with no external dependencies. No server-side rendering required.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
                color: '#6366f1'
              },
              {
                title: 'Real-Time Multiplayer',
                desc: 'Firebase Firestore powers synchronized timers, live collaboration bars, voting, and the facilitator dashboard. All players subscribe to a shared document that updates instantly. Anonymous auth means no accounts needed.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
                color: '#14b8a6'
              },
              {
                title: 'AI Integration',
                desc: 'Seven providers: OpenAI (GPT-5 Mini, DALL-E 3), Google Gemini (Gemini 3 Flash, Nano Banana), Anthropic Claude (Sonnet 4.5), Groq (Llama 3.3), Stability AI (SD3.5), Together AI (FLUX), and local Ollama. All calls include exponential backoff retry logic.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>,
                color: '#8b5cf6'
              },
              {
                title: 'Facilitator Tools',
                desc: 'Full dashboard with pause/resume, timer controls, featured submissions on projector display, live activity feed, and exportable HTML session reports. The projector URL works as a separate display for classroom settings.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>,
                color: '#d97706'
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: item.color + '15' }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREDITS SECTION */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-800 via-slate-700 to-teal-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-3 h-3 rounded-full bg-teal-400" />
            <h2 className="text-2xl font-black uppercase tracking-wide">Who Made This</h2>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2">
              <p className="text-white/80 leading-relaxed text-lg mb-6">
                ARTIFICIAL was designed and developed by Stephen Walter
                (<a href="https://weirdmachine.org" target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal-200">weirdmachine.org</a>)
                in collaboration with <a href="https://brooklineinteractive.org" target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal-200">Brookline Interactive Group</a> and <a href="https://neighborhoodai.org" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200">Neighborhood AI</a>.
              </p>
              <p className="text-white/80 leading-relaxed mb-6">
                The entire application was built using Claude Code, Anthropic's AI coding tool, as a demonstration
                that the same human-AI collaboration philosophy taught in the games applies to building them too.
              </p>
              <p className="text-white/80 leading-relaxed">
                The default Gemini API key that powers ARTIFICIAL out of the box is currently donated by the developer,
                so facilitators and players can use the platform immediately without needing their own credentials.
                Users who want other providers or higher limits can configure their own keys via the settings panel.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wide mb-2">License</h4>
                <p className="text-white/70 text-sm">Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0). Free to use, modify, and share for educational purposes.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wide mb-2">Source Code</h4>
                <a href="https://github.com/amateurmenace/artificial" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white hover:text-teal-300 transition-colors text-sm font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  View on GitHub →
                </a>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wide mb-2">Built With</h4>
                <p className="text-white/70 text-sm">Claude Code by Anthropic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-[#f5f3ef]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to Learn by Playing?</h3>
          <p className="text-slate-500 mb-6">Put these ideas into practice with our interactive games.</p>
          <Button
            onClick={onClose}
            variant="custom"
            className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all"
          >
            Explore Games →
          </Button>
        </div>
      </section>
    </main>
  </div>
);

// ============================================
// INFO PAGE COMPONENT
// ============================================

export const InfoPage = ({ pageId, onClose }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageId]);

  // Custom page for About
  if (pageId === 'about-artificial') {
    return <AboutPage onClose={onClose} />;
  }

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
        <div className="space-y-8">
          {page.sections.map((section, i) => {
            // Section dividers: headings like "Philosophy", "Technology", "Getting Started" etc.
            // that have short content and no list — render as a visual divider
            const isDivider = section.content && !section.list && !section.link
              && section.content.length < 250
              && ['Philosophy', 'Technology', 'Getting Started', 'About the Games', 'Technical & API', 'Ownership & Community'].includes(section.heading);

            if (isDivider) {
              return (
                <div key={i} className="pt-8 first:pt-0">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: page.color }} />
                    <h2 className="text-2xl font-black text-[#3d5a4c] uppercase tracking-wide">{section.heading}</h2>
                    <div className="flex-1 h-px bg-[#e2e0dc]" />
                  </div>
                  <p className="text-[#6b7c74] text-base ml-7">{section.content}</p>
                </div>
              );
            }

            return (
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
            );
          })}
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
                  <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight">
                    ARTIFICIAL
                  </h1>
                  <p className="text-teal-300 font-semibold text-base sm:text-xl md:text-2xl">Learn AI by Playing</p>
                </div>
              </div>
              
              <p className="text-lg sm:text-2xl md:text-3xl text-white/80 mb-10 leading-relaxed">
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

      {/* Why AI Literacy Now */}
      <section className="py-16 px-4 bg-slate-50" id="about">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 text-center">Why AI Literacy Matters Now</h2>
          <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
            AI is reshaping how we create, communicate, and make decisions. Young people are encountering AI-generated
            content daily, often without the tools to evaluate it critically. ARTIFICIAL creates a shared space where
            players explore AI together — and walk away with real things they built: AI-generated advocacy memes
            for causes they care about, and fully functioning web apps they can deploy to the real internet.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: 'Build Real Things',
                desc: 'These aren\'t simulations. In Meme Machine, players create actual AI-generated civic advocacy memes they can share. In Vibe Code, they describe an app and AI builds it — then they deploy it live to GitHub Pages. Players leave with real artifacts, not just knowledge.',
                color: '#14b8a6',
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#14b8a6" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-3.26m0 0l5.1-3.26m-5.1 3.26V4.58a17.93 17.93 0 0112.06 0v7.33m-12.06 0l5.1 3.26m1.86 0l5.1-3.26m0 0V4.58m0 7.33l-5.1 3.26" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.32 18.43l5.1 3.26 5.1-3.26" /></svg>
              },
              {
                title: 'Play Together, Think Together',
                desc: 'AI literacy isn\'t a solo activity. ARTIFICIAL turns classrooms, libraries, and community spaces into collaborative AI labs where participants debate what\'s real, create for causes they believe in, and build alongside each other in real time.',
                color: '#d97706',
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
              },
              {
                title: 'From Ethics to Engineering',
                desc: 'Each game session naturally surfaces hard questions: Who owns AI art? Can you trust what you see? What happens when AI writes code? The games create shared experiences that make these conversations happen organically — not as lectures, but as play.',
                color: '#6366f1',
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onShowInfoPage && onShowInfoPage('about-artificial')}
              className="text-teal-600 hover:text-teal-700 font-semibold text-sm underline underline-offset-4 transition-colors"
            >
              More about ARTIFICIAL's philosophy and technology →
            </button>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3 text-center">What Players Learn</h2>
          <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">Skills and perspectives that transfer far beyond the games</p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Prompt Engineering',
                desc: 'Write specific, effective instructions that get AI to do what you actually want — the foundational skill for every AI tool.',
                color: '#d97706',
                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
              },
              {
                title: 'AI-Assisted Software Development',
                desc: 'Describe what you want in plain language and watch AI build a real, working app. Learn to guide, iterate, and deploy — no coding required.',
                color: '#6366f1',
                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
              },
              {
                title: 'AI for Civic Advocacy',
                desc: 'Create compelling visual content for causes you care about. Use AI as a tool for community action, not just entertainment.',
                color: '#14b8a6',
                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>
              },
              {
                title: 'Comparing AI Models & Providers',
                desc: 'See how GPT, Gemini, Claude, Llama, and others respond differently to the same prompt. Develop intuition for which tools work best for what.',
                color: '#8b5cf6',
                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
              },
              {
                title: 'AI for Truth, Not Deceit',
                desc: 'Practice detecting AI-generated content. Understand how synthetic media can mislead, and build the habit of questioning before believing.',
                color: '#14b8a6',
                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              },
              {
                title: 'Knowing When Not to Use AI',
                desc: 'The games track how much AI help each player uses. Learn to balance staying current with AI tools while knowing when human-first skills matter more.',
                color: '#f59e0b',
                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" /></svg>
              },
              {
                title: 'Digital Accessibility',
                desc: 'Evaluate real interfaces for color contrast, alt text, keyboard navigation, and screen reader support. WCAG basics through practice.',
                color: '#ec4899',
                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              },
              {
                title: 'Collaborative Creation',
                desc: 'Fork, remix, and build on each other\'s work. Learn that the best results come from humans iterating together with AI as a tool, not a replacement.',
                color: '#6366f1',
                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + '15' }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* At a Glance - Dashboard Facts Grid */}
      <section className="py-16 px-4 bg-slate-50" id="facts">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3 text-center">At a Glance</h2>
          <p className="text-slate-500 text-center mb-8">Everything you need to know before you play</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Ages', value: '13+', sub: 'Recommended', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> },
              { label: 'Players', value: '2-20', sub: 'Per session', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
              { label: 'Device', value: 'Any', sub: 'Mobile or desktop', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg> },
              { label: 'Software', value: 'Browser', sub: 'No download needed', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg> },
              { label: 'Core Games', value: '3', sub: 'Plus 3 bonus modes', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" /></svg> },
              { label: 'Cost', value: 'Free', sub: 'Open source', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> },
              { label: 'Session', value: '30-60 min', sub: 'Per game', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { label: 'AI Models', value: '7+', sub: 'GPT, Gemini, Claude...', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg> },
            ].map((fact, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center border border-slate-200 hover:border-teal-300 transition-colors">
                <div className="flex justify-center mb-1.5">{fact.icon}</div>
                <div className="text-2xl font-black text-slate-800">{fact.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{fact.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{fact.sub}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => onShowInfoPage && onShowInfoPage('faqs')}
              className="text-slate-600 hover:text-teal-600 font-semibold text-sm transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              FAQs
            </button>
            <button
              onClick={() => onShowInfoPage && onShowInfoPage('for-educators')}
              className="text-slate-600 hover:text-teal-600 font-semibold text-sm transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              For Educators
            </button>
            <button
              onClick={() => onShowInfoPage && onShowInfoPage('for-facilitators')}
              className="text-slate-600 hover:text-teal-600 font-semibold text-sm transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
              For Facilitators
            </button>
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
            <button onClick={() => onShowInfoPage && onShowInfoPage('about-artificial')} className="text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium">About</button>
            <button onClick={() => onShowInfoPage && onShowInfoPage('faqs')} className="text-white/70 hover:text-white transition-colors text-sm font-medium">FAQs</button>
            <button onClick={() => onShowInfoPage && onShowInfoPage('for-educators')} className="text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium">For Educators</button>
            <button onClick={() => onShowInfoPage && onShowInfoPage('for-facilitators')} className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">For Facilitators</button>
            <button onClick={() => onShowInfoPage && onShowInfoPage('prompt-engineering')} className="text-white/70 hover:text-white transition-colors text-sm font-medium">Prompt Engineering</button>
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

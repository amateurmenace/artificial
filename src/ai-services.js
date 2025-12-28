// AI Services - OpenAI Integration
// Enhanced with critique, editing suggestions, and comprehensive assistance

const OPENAI_API_URL = 'https://api.openai.com/v1';

let openaiApiKey = null;

export const setApiKey = (key) => {
  openaiApiKey = key;
  localStorage.setItem('openai_api_key', key);
};

export const getApiKey = () => {
  if (!openaiApiKey) {
    openaiApiKey = localStorage.getItem('openai_api_key');
  }
  return openaiApiKey;
};

export const hasApiKey = () => !!getApiKey();

// Base chat completion
export const chatCompletion = async (messages, options = {}) => {
  const key = getApiKey();
  if (!key) throw new Error('OpenAI API key not set');
  
  const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: options.model || 'gpt-4o-mini',
      messages: messages,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to get completion');
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
};

// DALL-E Image Generation
export const generateImage = async (prompt, size = '1024x1024') => {
  const key = getApiKey();
  if (!key) throw new Error('OpenAI API key not set');
  
  const response = await fetch(`${OPENAI_API_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: size,
      quality: 'standard'
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to generate image');
  }
  
  const data = await response.json();
  return {
    url: data.data[0].url,
    revisedPrompt: data.data[0].revised_prompt
  };
};

// ============================================
// MEME MACHINE AI SERVICES
// ============================================

// Comprehensive meme critique
export const critiqueMeme = async (imageDescription, caption, issue) => {
  const messages = [
    {
      role: 'system',
      content: `You are an expert in viral content, advocacy communications, and meme culture. Provide constructive critique on memes created for community advocacy.

Your critique should cover:
1. MESSAGE EFFECTIVENESS (1-10): Is the message clear? Will viewers understand the issue?
2. EMOTIONAL IMPACT (1-10): Does it evoke the right emotions? Will people care?
3. SHAREABILITY (1-10): Would you share this? Is it meme-worthy?
4. TECHNICAL QUALITY (1-10): Is the composition good? Is text readable?
5. ACCESSIBILITY (1-10): Can everyone understand it? Any exclusionary elements?
6. POTENTIAL ISSUES: Any risks of misinterpretation, offense, or misinformation?

Format your response as JSON with these exact fields:
{
  "scores": {
    "messageEffectiveness": X,
    "emotionalImpact": X,
    "shareability": X,
    "technicalQuality": X,
    "accessibility": X,
    "overall": X
  },
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "concerns": ["..."] or [],
  "revisedCaption": "suggested improved caption",
  "imageEditSuggestions": ["...", "..."]
}`
    },
    {
      role: 'user',
      content: `Please critique this advocacy meme:

ISSUE: ${issue}
CAPTION: "${caption}"
IMAGE DESCRIPTION: ${imageDescription}

Provide your detailed critique in the JSON format specified.`
    }
  ];
  
  const response = await chatCompletion(messages, { maxTokens: 1500 });
  
  try {
    // Try to parse as JSON
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    // If parsing fails, return a structured response
    return {
      scores: { overall: 7 },
      strengths: ["Creative approach"],
      improvements: [response],
      concerns: [],
      revisedCaption: caption,
      imageEditSuggestions: []
    };
  }
};

// Generate multiple caption options
export const generateCaptionOptions = async (issue, style = 'mixed') => {
  const messages = [
    {
      role: 'system',
      content: `You are a creative meme caption writer specializing in advocacy content. Generate 5 different caption options with varying styles.`
    },
    {
      role: 'user',
      content: `Generate 5 meme captions about: ${issue}

Provide variety:
1. Funny/humorous
2. Emotional/heartfelt  
3. Shocking/attention-grabbing
4. Relatable/everyday
5. Call-to-action focused

Format as JSON array:
[
  {"style": "funny", "caption": "...", "hashtags": ["...", "..."]},
  ...
]`
    }
  ];
  
  const response = await chatCompletion(messages);
  
  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return [{ style: 'general', caption: response, hashtags: [] }];
  }
};

// Generate image edit suggestions
export const suggestImageEdits = async (currentDescription, critique, issue) => {
  const messages = [
    {
      role: 'system',
      content: `You are a visual design expert. Based on critique feedback, suggest specific, actionable image edits that would improve a meme's effectiveness.`
    },
    {
      role: 'user',
      content: `Current image: ${currentDescription}
Issue: ${issue}
Critique feedback: ${JSON.stringify(critique)}

Suggest 3-5 specific image edits or a new image concept. Format as JSON:
{
  "edits": [
    {"type": "color", "suggestion": "..."},
    {"type": "composition", "suggestion": "..."},
    {"type": "text_placement", "suggestion": "..."}
  ],
  "alternativeImagePrompt": "A DALL-E prompt for a potentially better image"
}`
    }
  ];
  
  const response = await chatCompletion(messages);
  
  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { edits: [], alternativeImagePrompt: '' };
  }
};

// ============================================
// VIBE CODE CHALLENGE AI SERVICES
// ============================================

// Step 1: Problem clarification assistant
export const clarifyProblem = async (userProblem) => {
  const messages = [
    {
      role: 'system',
      content: `You help users clarify and refine their app ideas. Ask probing questions and help them think through their concept.`
    },
    {
      role: 'user',
      content: `I want to build an app that: ${userProblem}

Help me clarify this by:
1. Summarizing what you understand
2. Asking 2-3 clarifying questions
3. Suggesting how to narrow the scope for a 30-minute build`
    }
  ];
  
  return await chatCompletion(messages);
};

// Step 2: Feature brainstorming
export const brainstormFeatures = async (problem, constraints) => {
  const messages = [
    {
      role: 'system',
      content: `You help users brainstorm app features, categorizing them by priority and feasibility for a quick build.`
    },
    {
      role: 'user',
      content: `Problem: ${problem}
Constraints: ${constraints || 'Must be buildable in 30 minutes as a single HTML file'}

Generate a feature list in JSON format:
{
  "mustHave": [{"feature": "...", "description": "...", "complexity": "low/medium"}],
  "niceToHave": [{"feature": "...", "description": "...", "complexity": "..."}],
  "futureIdeas": [{"feature": "...", "description": "..."}],
  "technicalNotes": ["...", "..."]
}`
    }
  ];
  
  const response = await chatCompletion(messages, { maxTokens: 1500 });
  
  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { mustHave: [], niceToHave: [], futureIdeas: [], technicalNotes: [response] };
  }
};

// Step 3: Generate initial code - ENHANCED for complex apps
export const generateInitialCode = async (problem, features) => {
  const messages = [
    {
      role: 'system',
      content: `You are an expert web developer creating impressive, feature-rich apps. Generate sophisticated HTML/CSS/JS code that looks professional and has real functionality.

REQUIREMENTS:
- Single HTML file with embedded CSS and JS
- MUST include smooth CSS animations and transitions
- MUST include CSS gradients and shadows for depth
- MUST have hover effects on interactive elements
- Include localStorage for data persistence where appropriate
- Add loading states and visual feedback for actions
- Use CSS Grid or Flexbox for layouts
- Include a color scheme with at least 4 harmonious colors
- Add subtle micro-interactions (button ripples, form feedback, etc.)
- Include error handling and validation where needed
- Make it responsive with media queries
- Add custom scrollbar styling
- Include toast notifications or alerts for user feedback

STYLING REQUIREMENTS:
- Modern design with rounded corners (border-radius)
- Card-based layouts with shadows
- Gradient backgrounds or accents
- Icon usage (use emoji as icons if needed)
- Typography hierarchy (different font sizes/weights)
- Proper spacing and padding
- Dark/light color scheme option if appropriate

JAVASCRIPT REQUIREMENTS:
- Event listeners with visual feedback
- DOM manipulation for dynamic content
- Array methods for data handling
- Template literals for HTML generation
- Error handling with try/catch
- Console logging for debugging

Use this structure:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Name</title>
  <style>
    /* Reset and base styles */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    /* Custom properties / CSS variables */
    :root {
      --primary: #color;
      --secondary: #color;
      --accent: #color;
      --background: #color;
      --text: #color;
      --shadow: 0 4px 6px rgba(0,0,0,0.1);
      --radius: 12px;
      --transition: all 0.3s ease;
    }
    
    /* Animations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    
    /* Your styles here with animations, gradients, shadows */
  </style>
</head>
<body>
  <!-- HTML structure here -->
  <script>
    // App initialization
    document.addEventListener('DOMContentLoaded', () => {
      // Your JavaScript here with proper structure
    });
  </script>
</body>
</html>`
    },
    {
      role: 'user',
      content: `Create an impressive, feature-rich app for:
PROBLEM: ${problem}
FEATURES: ${JSON.stringify(features)}

Make it visually stunning with:
- Animated entrance for elements
- Gradient backgrounds or accents
- Card layouts with shadows
- Hover effects on all clickable items
- Toast notifications for actions
- LocalStorage for saving user data
- At least 200 lines of well-organized code

Generate the complete, working code that will impress users.`
    }
  ];
  
  return await chatCompletion(messages, { maxTokens: 4000, model: 'gpt-4o-mini' });
};

// Generate visual mockup description
export const generateMockup = async (designAnswers) => {
  const messages = [
    {
      role: 'system',
      content: `You are a UI/UX designer creating detailed mockup descriptions. Describe the visual layout of an app in ASCII art and detailed text format.`
    },
    {
      role: 'user',
      content: `Create a visual mockup description for this app:

Problem: ${designAnswers.problem}
Solution: ${designAnswers.solutions}
Technology: ${designAnswers.technology}
Visual Style: ${designAnswers.vibe}
Target Users: ${designAnswers.audience}
Goals: ${designAnswers.goals}
Core Features: ${designAnswers.mechanics}
Unique Element: ${designAnswers.twist}

Provide:
1. ASCII art showing the basic layout (use box drawing characters)
2. Color scheme (list 4-5 hex colors with their purpose)
3. Component list with descriptions
4. User flow description

Format as JSON:
{
  "asciiMockup": "ASCII art here using ┌─┐│└┘ characters",
  "colorScheme": [
    {"color": "#hex", "name": "name", "usage": "what it's used for"}
  ],
  "components": [
    {"name": "Header", "description": "what it contains", "position": "where it goes"}
  ],
  "userFlow": ["Step 1", "Step 2", "Step 3"]
}`
    }
  ];
  
  const response = await chatCompletion(messages, { maxTokens: 2000 });
  
  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      asciiMockup: `
┌────────────────────────────────────┐
│           HEADER / LOGO            │
├────────────────────────────────────┤
│                                    │
│         MAIN CONTENT AREA          │
│                                    │
│    ┌──────────┐  ┌──────────┐     │
│    │  Card 1  │  │  Card 2  │     │
│    └──────────┘  └──────────┘     │
│                                    │
├────────────────────────────────────┤
│           ACTION BUTTONS           │
└────────────────────────────────────┘`,
      colorScheme: [
        { color: '#3d5a4c', name: 'Primary', usage: 'Headers, buttons' },
        { color: '#48a89a', name: 'Accent', usage: 'Highlights, links' },
        { color: '#f5f3ef', name: 'Background', usage: 'Page background' },
        { color: '#d4a84b', name: 'Warning', usage: 'Alerts, CTAs' }
      ],
      components: [
        { name: 'Header', description: 'App title and navigation', position: 'Top' },
        { name: 'Main Content', description: 'Primary interaction area', position: 'Center' },
        { name: 'Footer', description: 'Actions and info', position: 'Bottom' }
      ],
      userFlow: ['Open app', 'View content', 'Take action', 'See result']
    };
  }
};

// Step 4: Iterate on code
export const iterateCode = async (currentCode, feedback, problem) => {
  const messages = [
    {
      role: 'system',
      content: `You are helping iterate on an app. Make the requested changes while keeping everything else working. Return the complete updated code.`
    },
    {
      role: 'user',
      content: `Current code:
\`\`\`html
${currentCode}
\`\`\`

Requested changes: ${feedback}

Original problem: ${problem}

Return the complete updated HTML file with the changes implemented.`
    }
  ];
  
  return await chatCompletion(messages, { maxTokens: 4000 });
};

// Step 5: Debug code
export const debugCode = async (code, errorDescription) => {
  const messages = [
    {
      role: 'system',
      content: `You are a debugging expert. Identify bugs, explain what's wrong, and provide fixed code.

Format your response as:
## Issue Found
[Explanation of the bug]

## How to Fix
[Step by step fix]

## Fixed Code
\`\`\`html
[Complete fixed code]
\`\`\``
    },
    {
      role: 'user',
      content: `This code has a problem: "${errorDescription}"

\`\`\`html
${code}
\`\`\`

Find and fix the issue.`
    }
  ];
  
  return await chatCompletion(messages, { maxTokens: 4000 });
};

// Step 6: Polish and enhance
export const polishCode = async (code, polishType) => {
  const polishPrompts = {
    ui: 'Improve the visual design: better colors, spacing, typography, and animations. Make it look professional.',
    ux: 'Improve user experience: add loading states, error handling, helpful messages, and intuitive interactions.',
    accessibility: 'Add accessibility features: ARIA labels, keyboard navigation, screen reader support, color contrast.',
    performance: 'Optimize performance: reduce code, improve efficiency, add lazy loading if applicable.',
    mobile: 'Enhance mobile experience: better touch targets, responsive design, mobile-specific features.',
    all: 'Comprehensively improve the code: better UI, UX, accessibility, performance, and mobile support.'
  };

  const messages = [
    {
      role: 'system',
      content: `You are a senior developer polishing an app. ${polishPrompts[polishType] || polishPrompts.all}
      
Return the complete improved code.`
    },
    {
      role: 'user',
      content: `Polish this code (focus: ${polishType}):

\`\`\`html
${code}
\`\`\`

Return the complete polished code.`
    }
  ];
  
  return await chatCompletion(messages, { maxTokens: 4000 });
};

// Step 7: Generate app description for demo
export const generateAppDescription = async (code, problem) => {
  const messages = [
    {
      role: 'system',
      content: `You help developers create compelling descriptions of their apps for demos and presentations.`
    },
    {
      role: 'user',
      content: `Generate a demo description for this app:

Problem: ${problem}
Code: ${code.substring(0, 2000)}...

Provide JSON:
{
  "name": "Catchy App Name",
  "tagline": "One-line description",
  "problem": "The problem it solves",
  "solution": "How it solves it",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "pitchScript": "30-second pitch script",
  "demoSteps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
}`
    }
  ];
  
  const response = await chatCompletion(messages);
  
  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      name: 'My App',
      tagline: problem,
      pitchScript: response
    };
  }
};

// Code analysis and suggestions
export const analyzeCode = async (code) => {
  const messages = [
    {
      role: 'system',
      content: `Analyze this code and provide suggestions in JSON format:
{
  "score": 1-10,
  "strengths": ["...", "..."],
  "issues": [{"severity": "high/medium/low", "issue": "...", "fix": "..."}],
  "suggestions": ["...", "..."],
  "nextSteps": ["...", "..."]
}`
    },
    {
      role: 'user',
      content: `Analyze this code:\n\`\`\`html\n${code}\n\`\`\``
    }
  ];
  
  const response = await chatCompletion(messages);
  
  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { score: 7, strengths: [], issues: [], suggestions: [response], nextSteps: [] };
  }
};

// ============================================
// SPOT THE FAKE AI SERVICES
// ============================================

// Generate detection tips for specific image
export const getDetectionTips = async (imageDescription, category) => {
  const messages = [
    {
      role: 'system',
      content: `You are an expert at identifying AI-generated images. Provide specific, educational tips.`
    },
    {
      role: 'user',
      content: `Give 5 specific tips for detecting AI-generated ${category} images like: ${imageDescription}

For each tip, explain:
1. What to look for
2. Why AI struggles with this
3. How to check

Format as JSON array of objects with "tip", "reason", and "howToCheck" fields.`
    }
  ];
  
  const response = await chatCompletion(messages);
  
  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return [{ tip: response, reason: '', howToCheck: '' }];
  }
};

// Analyze image for AI indicators (description-based)
export const analyzeForAIIndicators = async (imageDescription) => {
  const messages = [
    {
      role: 'system',
      content: `Based on an image description, identify potential AI generation indicators and provide an analysis.`
    },
    {
      role: 'user',
      content: `Analyze this image for AI indicators: ${imageDescription}

Respond with JSON:
{
  "likelyAI": true/false,
  "confidence": "high/medium/low",
  "indicators": [
    {"element": "...", "suspicion": "high/medium/low", "reason": "..."}
  ],
  "humanIndicators": ["...", "..."],
  "verdict": "Detailed explanation"
}`
    }
  ];
  
  const response = await chatCompletion(messages);
  
  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { verdict: response };
  }
};

// Generate discussion questions for ethics segment
export const generateEthicsQuestions = async (examples) => {
  const messages = [
    {
      role: 'system',
      content: `Generate thought-provoking discussion questions about AI image ethics based on real-world examples.`
    },
    {
      role: 'user',
      content: `Based on these examples: ${JSON.stringify(examples)}

Generate 5 discussion questions that:
1. Connect to the examples
2. Encourage critical thinking
3. Have no single right answer
4. Are appropriate for ages 8-80

Format as JSON array of objects with "question" and "followUps" (array of follow-up questions).`
    }
  ];
  
  const response = await chatCompletion(messages);
  
  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return [{ question: response, followUps: [] }];
  }
};

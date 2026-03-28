// AI Services - Multi-Provider Support with Per-Game Model Selection
// Updated December 2025: Best models for vibe coding

// ============================================
// DEFAULT API KEY (provided by facilitator via .env)
// ============================================
const DEFAULT_GEMINI_KEY = process.env.REACT_APP_DEFAULT_GEMINI_KEY || '';

// ============================================
// PROVIDER CONFIGURATION (March 2026)
// ============================================

export const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    chatModel: 'gpt-5-mini',
    imageModel: 'dall-e-3',
    apiUrl: 'https://api.openai.com/v1',
    description: 'GPT-5 Mini (Best for vibe coding)',
    requiresKey: true,
    keyPlaceholder: 'sk-...',
    keyLink: 'https://platform.openai.com/api-keys',
    supportsChat: true,
    supportsImage: true
  },
  anthropic: {
    name: 'Claude (Anthropic)',
    chatModel: 'claude-sonnet-4-5-20250929',
    imageModel: null,
    apiUrl: 'https://api.anthropic.com/v1',
    description: 'Claude Sonnet 4.5',
    requiresKey: true,
    keyPlaceholder: 'sk-ant-...',
    keyLink: 'https://console.anthropic.com/settings/keys',
    supportsChat: true,
    supportsImage: false
  },
  gemini: {
    name: 'Google Gemini',
    chatModel: 'gemini-3-flash-preview',
    imageModel: 'gemini-2.5-flash-image',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta',
    description: 'Gemini 3 Flash (Best for vibe coding!) + Nano Banana images',
    requiresKey: false,  // Default key provided
    keyPlaceholder: 'AI...',
    keyLink: 'https://aistudio.google.com/apikey',
    supportsChat: true,
    supportsImage: true
  },
  groq: {
    name: 'Groq (Free & Fast)',
    chatModel: 'llama-3.3-70b-versatile',
    imageModel: null,
    apiUrl: 'https://api.groq.com/openai/v1',
    description: 'Llama 3.3 70B',
    requiresKey: true,
    keyPlaceholder: 'gsk_...',
    keyLink: 'https://console.groq.com/keys',
    supportsChat: true,
    supportsImage: false
  },
  ollama: {
    name: 'Ollama (Local)',
    chatModel: 'llama3.2',
    imageModel: null,
    apiUrl: 'http://localhost:11434/api',
    description: 'Run locally',
    requiresKey: false,
    keyPlaceholder: '',
    keyLink: 'https://ollama.ai',
    supportsChat: true,
    supportsImage: false
  },
  stability: {
    name: 'Stability AI',
    chatModel: null,
    imageModel: 'sd3.5-large',
    apiUrl: 'https://api.stability.ai/v2beta',
    description: 'Stable Diffusion 3.5 (High quality images)',
    requiresKey: true,
    keyPlaceholder: 'sk-...',
    keyLink: 'https://platform.stability.ai/account/keys',
    supportsChat: false,
    supportsImage: true
  },
  together: {
    name: 'Together AI',
    chatModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    imageModel: 'black-forest-labs/FLUX.1-schnell',
    apiUrl: 'https://api.together.xyz/v1',
    description: 'FLUX.1 Schnell (Fast, high quality)',
    requiresKey: true,
    keyPlaceholder: '',
    keyLink: 'https://api.together.xyz/settings/api-keys',
    supportsChat: true,
    supportsImage: true
  }
};

// ============================================
// PER-GAME MODEL SELECTION
// ============================================

const DEFAULT_GAME_MODELS = {
  spotTheFake: { chat: 'gemini', image: null },
  memeMachine: { chat: 'gemini', image: 'gemini' },  // Nano Banana for image gen
  vibeCode: { chat: 'gemini', image: null }  // Gemini 3 Flash is best for vibe coding!
};

export const getGameModels = () => {
  const stored = localStorage.getItem('game_models');
  return stored ? JSON.parse(stored) : DEFAULT_GAME_MODELS;
};

export const setGameModel = (game, type, provider) => {
  const models = getGameModels();
  if (!models[game]) models[game] = {};
  models[game][type] = provider;
  localStorage.setItem('game_models', JSON.stringify(models));
};

export const getProviderForGame = (game, type = 'chat') => {
  const models = getGameModels();
  return models[game]?.[type] || (type === 'chat' ? 'gemini' : 'openai');
};

// ============================================
// STATE MANAGEMENT
// ============================================

let currentProvider = null;
let apiKey = null;

export const setProvider = (providerId) => {
  if (!AI_PROVIDERS[providerId]) throw new Error(`Unknown provider: ${providerId}`);
  currentProvider = providerId;
  localStorage.setItem('ai_provider', providerId);
  apiKey = localStorage.getItem(`ai_key_${providerId}`);
};

export const getProvider = () => {
  if (!currentProvider) currentProvider = localStorage.getItem('ai_provider') || 'gemini';
  return currentProvider;
};

export const getProviderConfig = () => AI_PROVIDERS[getProvider()];

export const setApiKey = (key) => {
  apiKey = key;
  localStorage.setItem(`ai_key_${getProvider()}`, key);
};

export const getApiKey = (providerId) => {
  const provider = providerId || getProvider();
  const storedKey = localStorage.getItem(`ai_key_${provider}`) || (provider === getProvider() ? apiKey : null);
  // Fall back to default Gemini key if no user key is set
  if (!storedKey && (provider === 'gemini' || provider === 'gemini_pro')) {
    return DEFAULT_GEMINI_KEY;
  }
  return storedKey;
};

export const hasApiKey = (providerId) => {
  const provider = providerId || getProvider();
  const config = AI_PROVIDERS[provider];
  if (!config?.requiresKey) return true;
  return !!getApiKey(provider);
};

export const clearCredentials = () => {
  localStorage.removeItem(`ai_key_${getProvider()}`);
  apiKey = null;
};

// ============================================
// OPENAI IMPLEMENTATION
// ============================================

const openaiChat = async (messages, options = {}) => {
  const key = getApiKey('openai');
  if (!key) throw new Error('OpenAI API key not configured');
  
  const config = AI_PROVIDERS.openai;
  const model = options.model || config.chatModel;
  
  console.log(`[OpenAI] Calling ${model} with ${messages.length} messages, maxTokens: ${options.maxTokens || 16384}`);
  
  const response = await fetch(`${config.apiUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      max_tokens: options.maxTokens || 16384,
      temperature: options.temperature || 0.7
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    console.error('[OpenAI] Error response:', data);
    throw new Error(data.error?.message || `OpenAI request failed: ${response.status}`);
  }
  
  console.log(`[OpenAI] Response received, finish_reason: ${data.choices?.[0]?.finish_reason}`);
  
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    console.error('[OpenAI] Empty content in response:', JSON.stringify(data, null, 2));
    throw new Error('OpenAI returned empty response. Check console for details.');
  }
  
  console.log(`[OpenAI] Content length: ${content.length} chars`);
  return content;
};

const openaiImage = async (prompt, size = '1024x1024') => {
  const key = getApiKey('openai');
  if (!key) throw new Error('OpenAI API key not configured');
  
  const config = AI_PROVIDERS.openai;
  
  console.log(`[OpenAI Image] Generating with ${config.imageModel}`);
  
  const response = await fetch(`${config.apiUrl}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: config.imageModel,
      prompt: prompt,
      n: 1,
      size: size,
      quality: 'standard'
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    console.error('[OpenAI Image] Error:', data);
    throw new Error(data.error?.message || 'Image generation failed');
  }
  
  // Handle both URL and base64 responses
  if (data.data[0].b64_json) {
    return { url: `data:image/png;base64,${data.data[0].b64_json}`, revisedPrompt: data.data[0].revised_prompt };
  }
  return { url: data.data[0].url, revisedPrompt: data.data[0].revised_prompt };
};

// ============================================
// CLAUDE (ANTHROPIC) IMPLEMENTATION
// ============================================

const claudeChat = async (messages, options = {}) => {
  const key = getApiKey('anthropic');
  if (!key) throw new Error('Anthropic API key not configured');
  
  const config = AI_PROVIDERS.anthropic;
  
  const systemMessage = messages.find(m => m.role === 'system');
  const chatMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role, content: m.content }));
  
  const requestBody = {
    model: options.model || config.chatModel,
    max_tokens: options.maxTokens || 8192,
    messages: chatMessages
  };
  
  if (systemMessage) {
    requestBody.system = systemMessage.content;
  }
  
  const response = await fetch(`${config.apiUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Claude request failed');
  }
  
  const data = await response.json();
  return data.content[0].text;
};

// ============================================
// GEMINI IMPLEMENTATION - FIXED
// ============================================

const geminiChat = async (messages, options = {}) => {
  const providerId = options.providerId || 'gemini';
  const key = getApiKey(providerId);
  if (!key) throw new Error('Gemini API key not configured');
  
  const config = AI_PROVIDERS[providerId] || AI_PROVIDERS.gemini;
  const model = options.model || config.chatModel;
  
  console.log(`[Gemini] Calling ${model} with ${messages.length} messages, maxTokens: ${options.maxTokens || 8192}`);
  
  const systemMessage = messages.find(m => m.role === 'system');
  const chatMessages = messages
    .filter(m => m.role !== 'system')
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
  
  // Ensure we have at least one user message
  if (chatMessages.length === 0) {
    throw new Error('Gemini requires at least one user message');
  }
  
  const requestBody = {
    contents: chatMessages,
    generationConfig: {
      temperature: options.temperature || 1.0, // Gemini 3 recommends 1.0
      maxOutputTokens: Math.min(options.maxTokens || 8192, 65536),
      candidateCount: 1
    },
    // Relaxed safety settings for creative content
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
    ]
  };
  
  // Add thinking level for Gemini 3 models (improves code generation)
  if (model.includes('gemini-3')) {
    requestBody.generationConfig.thinkingConfig = {
      thinkingLevel: 'medium' // Balance between speed and quality
    };
    console.log('[Gemini] Using thinking level: medium');
  }
  
  if (systemMessage) {
    requestBody.systemInstruction = { parts: [{ text: systemMessage.content }] };
  }
  
  const apiUrl = `${config.apiUrl}/models/${model}:generateContent?key=${key}`;
  console.log('[Gemini] Request URL:', apiUrl.replace(key, 'API_KEY_HIDDEN'));
  
  const response = await fetch(apiUrl, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(requestBody) 
  });
  
  const responseText = await response.text();
  console.log('[Gemini] Raw response (first 500 chars):', responseText.substring(0, 500));
  
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error('[Gemini] Failed to parse JSON:', responseText);
    throw new Error('Gemini returned invalid JSON response');
  }
  
  if (!response.ok) {
    console.error('[Gemini] HTTP Error:', response.status, data);
    throw new Error(data.error?.message || `Gemini request failed: ${response.status}`);
  }
  
  // Check for blocked responses
  if (data.promptFeedback?.blockReason) {
    console.error('[Gemini] Blocked:', data.promptFeedback);
    throw new Error(`Request blocked: ${data.promptFeedback.blockReason}`);
  }
  
  // Check for candidates
  if (!data.candidates || data.candidates.length === 0) {
    console.error('[Gemini] No candidates. Full response:', JSON.stringify(data));
    // Check if there's feedback about why
    if (data.promptFeedback) {
      throw new Error(`Gemini blocked the request: ${JSON.stringify(data.promptFeedback)}`);
    }
    throw new Error('Gemini returned no candidates. Try simplifying your prompt.');
  }
  
  const candidate = data.candidates[0];
  console.log('[Gemini] Finish reason:', candidate.finishReason);
  
  if (candidate.finishReason === 'SAFETY') {
    console.error('[Gemini] Safety block. Ratings:', candidate.safetyRatings);
    throw new Error('Response blocked by safety filters. Try a different prompt.');
  }
  
  if (candidate.finishReason === 'RECITATION') {
    throw new Error('Response blocked due to recitation policy.');
  }
  
  // Try multiple ways to get the text
  let content = null;
  
  // Standard format
  if (candidate.content?.parts) {
    content = candidate.content.parts
      .filter(p => p.text)
      .map(p => p.text)
      .join('');
  }
  // Alternative formats
  if (!content && candidate.text) {
    content = candidate.text;
  }
  if (!content && typeof candidate.content === 'string') {
    content = candidate.content;
  }
  
  if (!content || content.trim().length === 0) {
    console.error('[Gemini] Cannot extract text. Candidate:', JSON.stringify(candidate));
    throw new Error('Gemini returned empty content. Try again or use a different provider.');
  }
  
  console.log('[Gemini] Content length:', content.length);
  return content;
};

// Gemini image generation using Nano Banana (gemini-2.5-flash-image)
const geminiImage = async (prompt, size = '1024x1024') => {
  const key = getApiKey('gemini') || getApiKey('gemini_pro');
  if (!key) throw new Error('Gemini API key not configured');

  const config = AI_PROVIDERS.gemini;
  const imageModel = config.imageModel || 'gemini-2.5-flash-image';

  console.log(`[Gemini Image] Generating with Nano Banana (${imageModel})`);

  // Use native Gemini image generation (Nano Banana)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${imageModel}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Generate an image: ${prompt}` }]
        }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[Gemini Image] Error:', response.status, errorData);
    throw new Error(errorData.error?.message || `Nano Banana image generation failed: ${response.status}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData);

  if (imagePart?.inlineData) {
    console.log('[Gemini Image] Image generated successfully');
    return {
      url: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
      revisedPrompt: prompt
    };
  }

  // Check if there's text but no image
  const textPart = parts.find(p => p.text);
  if (textPart) {
    console.error('[Gemini Image] Got text instead of image:', textPart.text.substring(0, 200));
  }

  throw new Error('No image generated by Nano Banana. Try a different prompt.');
};

// ============================================
// GROQ IMPLEMENTATION
// ============================================

const groqChat = async (messages, options = {}) => {
  const key = getApiKey('groq');
  if (!key) throw new Error('Groq API key not configured');
  
  const config = AI_PROVIDERS.groq;
  
  const response = await fetch(`${config.apiUrl}/chat/completions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${key}` 
    },
    body: JSON.stringify({
      model: options.model || config.chatModel,
      messages: messages,
      max_tokens: options.maxTokens || 8192,
      temperature: options.temperature || 0.8
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Groq request failed');
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
};

// ============================================
// OLLAMA IMPLEMENTATION
// ============================================

const ollamaChat = async (messages, options = {}) => {
  const config = AI_PROVIDERS.ollama;
  
  const prompt = messages.map(m => {
    if (m.role === 'system') return `System: ${m.content}`;
    if (m.role === 'user') return `User: ${m.content}`;
    return `Assistant: ${m.content}`;
  }).join('\n\n');
  
  const response = await fetch(`${config.apiUrl}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: options.model || config.chatModel, prompt, stream: false })
  });
  
  if (!response.ok) throw new Error('Ollama request failed - is Ollama running?');
  const data = await response.json();
  return data.response;
};

// ============================================
// UNIFIED API
// ============================================

// Token limits per provider (output tokens) - conservative limits for reliability
const PROVIDER_TOKEN_LIMITS = {
  openai: 16384,
  anthropic: 8192,
  gemini: 65536,  // Gemini 3 Flash supports 65K output tokens
  groq: 8192,
  ollama: 4096
};

export const chatCompletion = async (messages, options = {}) => {
  const provider = options.provider || getProvider();
  
  console.log(`[chatCompletion] Provider: ${provider}, requested maxTokens: ${options.maxTokens}`);
  
  // Cap maxTokens to provider limit
  const providerLimit = PROVIDER_TOKEN_LIMITS[provider] || 4096;
  const cappedOptions = {
    ...options,
    maxTokens: Math.min(options.maxTokens || 4096, providerLimit)
  };
  
  console.log(`[chatCompletion] Capped maxTokens: ${cappedOptions.maxTokens}`);
  
  try {
    switch (provider) {
      case 'openai': return await openaiChat(messages, cappedOptions);
      case 'anthropic': return await claudeChat(messages, cappedOptions);
      case 'gemini': 
      case 'gemini_pro': return await geminiChat(messages, { ...cappedOptions, providerId: provider });
      case 'groq': return await groqChat(messages, cappedOptions);
      case 'ollama': return await ollamaChat(messages, cappedOptions);
      default: throw new Error(`Unknown provider: ${provider}`);
    }
  } catch (error) {
    console.error(`[chatCompletion] ${provider} failed:`, error.message);
    throw error;
  }
};

// Stability AI image generation
const stabilityImage = async (prompt, size = '1024x1024') => {
  const key = getApiKey('stability');
  if (!key) throw new Error('Stability AI API key not configured');

  const [width, height] = size.split('x').map(Number);
  const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sd3', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Accept': 'application/json',
    },
    body: (() => {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('output_format', 'png');
      formData.append('model', 'sd3.5-large');
      formData.append('aspect_ratio', width === height ? '1:1' : '16:9');
      return formData;
    })(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Stability API error: ${response.status}`);
  }

  const data = await response.json();
  return { url: `data:image/png;base64,${data.image}` };
};

// Together AI (FLUX) image generation
const togetherImage = async (prompt, size = '1024x1024') => {
  const key = getApiKey('together');
  if (!key) throw new Error('Together AI API key not configured');

  const [width, height] = size.split('x').map(Number);
  const response = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'black-forest-labs/FLUX.1-schnell',
      prompt,
      width: Math.min(width, 1024),
      height: Math.min(height, 1024),
      n: 1,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Together API error: ${response.status}`);
  }

  const data = await response.json();
  return { url: data.data?.[0]?.url || data.data?.[0]?.b64_json };
};

export const generateImage = async (prompt, size = '1024x1024', preferredProvider) => {
  // Use preferred provider or find one that supports images
  let provider = preferredProvider || getProvider();
  let config = AI_PROVIDERS[provider];

  // If current provider doesn't support images, find one that does
  if (!config?.supportsImage) {
    const imageProviders = ['openai', 'gemini', 'together', 'stability'];
    const found = imageProviders.find(p => hasApiKey(p) && AI_PROVIDERS[p]?.supportsImage);
    if (found) {
      provider = found;
      config = AI_PROVIDERS[found];
    } else {
      throw new Error('No image-capable AI provider configured. Please set up an API key for OpenAI, Gemini, Stability AI, or Together AI.');
    }
  }

  switch (provider) {
    case 'openai': return openaiImage(prompt, size);
    case 'gemini':
    case 'gemini_pro': return geminiImage(prompt, size);
    case 'stability': return stabilityImage(prompt, size);
    case 'together': return togetherImage(prompt, size);
    default: throw new Error(`Image generation not supported for ${provider}.`);
  }
};

// ============================================
// MEME MACHINE AI SERVICES
// ============================================

export const critiqueMeme = async (imageDescription, caption, issue) => {
  const provider = getProviderForGame('memeMachine', 'chat');
  
  const messages = [
    {
      role: 'system',
      content: `You are a viral content strategist and meme expert. Provide constructive, actionable critique.

SCORING (1-10 each):
1. MESSAGE CLARITY - Is the point immediately understood?
2. EMOTIONAL IMPACT - Does it create the right feeling?
3. VIRAL POTENTIAL - Would people share this?
4. VISUAL-TEXT HARMONY - Do image and caption work together?
5. AUDIENCE FIT - Will the target audience connect?

Be encouraging but honest. Give specific suggestions, not vague feedback.
Format with clear sections and scores. Keep it concise but helpful.`
    },
    {
      role: 'user',
      content: `Critique this advocacy meme:

ISSUE: ${issue}
IMAGE CONCEPT: ${imageDescription}
CAPTION: "${caption}"

Provide scores and 3 specific improvement suggestions.`
    }
  ];
  
  return await chatCompletion(messages, { maxTokens: 1500, provider });
};

export const suggestMemeEdits = async (imageDescription, caption, issue, critiquePoints) => {
  const provider = getProviderForGame('memeMachine', 'chat');
  
  const messages = [
    {
      role: 'system',
      content: `You are a meme optimization expert. Based on critique, suggest specific, actionable improvements.`
    },
    {
      role: 'user',
      content: `Improve this meme:

CURRENT:
- Issue: ${issue}
- Image: ${imageDescription}
- Caption: "${caption}"

FEEDBACK: ${critiquePoints}

Provide:
1. 3 alternative captions (different tones)
2. 2 image adjustments
3. 1 bold creative risk to consider`
    }
  ];
  
  return await chatCompletion(messages, { maxTokens: 1200, provider });
};

export const generateMemeCaptions = async (imageDescription, issue, style = 'humorous') => {
  const provider = getProviderForGame('memeMachine', 'chat');
  
  const styleGuides = {
    humorous: 'witty, clever, uses wordplay or irony',
    emotional: 'heartfelt, evocative, creates empathy',
    provocative: 'bold, challenging, conversation-starting',
    informative: 'clear, factual, shareable statistics'
  };

  const messages = [
    {
      role: 'system',
      content: `You are a viral meme caption writer. Generate captions that are ${styleGuides[style] || styleGuides.humorous}.

Each caption should:
- Be punchy and memorable (under 15 words ideal)
- Work with the visual concept
- Be shareable and non-offensive
- Include relevant hashtag ideas`
    },
    {
      role: 'user',
      content: `Generate 5 ${style} captions for:

ISSUE: ${issue}
IMAGE CONCEPT: ${imageDescription}

Format each with the caption, why it works, and 2 hashtags.`
    }
  ];
  
  return await chatCompletion(messages, { maxTokens: 1000, provider });
};

export const generateMemeImagePrompt = async (issue, style, mood, visualConcept) => {
  const provider = getProviderForGame('memeMachine', 'chat');
  
  const messages = [
    {
      role: 'system',
      content: `You are an expert visual designer creating image prompts for advocacy memes.

RULES:
- NO text in the image (captions added separately)
- Think editorial photography or conceptual art
- Use visual metaphors over literal representations
- Ensure it works at small sizes (social media thumbnails)
- Avoid clichÃ©s and generic stock photo looks
- Include: lighting, composition, color palette, mood, style`
    },
    {
      role: 'user',
      content: `Create a detailed image prompt for:

ADVOCACY ISSUE: ${issue}
VISUAL STYLE: ${style}
EMOTIONAL TONE: ${mood}
CONCEPT/IDEA: ${visualConcept}

Create a single, detailed prompt that will generate a striking, meme-worthy image. No text in the image.`
    }
  ];
  
  const prompt = await chatCompletion(messages, { maxTokens: 600, provider });
  return prompt;
};

export const brainstormMemeIdeas = async (issue, targetAudience) => {
  const provider = getProviderForGame('memeMachine', 'chat');
  
  const messages = [
    {
      role: 'system',
      content: `You are a viral content strategist specializing in advocacy and social media campaigns.

Generate creative meme concepts that:
- Connect emotionally with the target audience
- Use relatable scenarios or pop culture references
- Have viral potential through humor, surprise, or emotional resonance
- Avoid being preachy or heavy-handed`
    },
    {
      role: 'user',
      content: `Generate 5 creative meme concepts for this advocacy campaign:

ISSUE: ${issue}
TARGET AUDIENCE: ${targetAudience}

For each concept include:
1. A catchy title/hook
2. Visual description (what the image shows)
3. Suggested caption tone (funny, emotional, shocking, etc.)
4. Why it would resonate with the audience`
    }
  ];
  
  return await chatCompletion(messages, { maxTokens: 1500, provider });
};

// ============================================
// VIBE CODE CHALLENGE AI SERVICES
// ============================================

export const generateInitialCode = async (appIdea, description, features) => {
  const provider = getProviderForGame('vibeCode', 'chat');
  
  const featureDescriptions = {
    auth: 'User authentication with login/signup modals and profile management',
    data: 'Local storage persistence with add, edit, delete operations',
    social: 'Social features: like buttons with counts, sharing, comments',
    notifications: 'Toast notification system with success, error, info states',
    search: 'Real-time search/filter with highlighted results',
    dark: 'Dark mode with elegant color scheme and smooth toggle',
    animations: 'Micro-interactions: hover effects, transitions, loading states',
    charts: 'Data visualization with animated charts and statistics',
    gamification: 'Points, badges, streaks, and progress tracking',
    a11y: 'Enhanced accessibility: focus states, ARIA labels, keyboard nav',
    offline: 'Offline indicator and graceful degradation',
    export: 'Export functionality with download buttons'
  };
  
  const featureList = features.map(f => featureDescriptions[f] || f).join('\n- ');

  const messages = [
    {
      role: 'system',
      content: `You are an expert frontend developer creating sophisticated single-file HTML applications.

DESIGN STANDARDS:
- Modern, award-winning UI inspired by Linear, Vercel, Stripe
- Tailwind CSS via CDN for all styling
- Vanilla JavaScript with ES6+ features
- Mobile-responsive, accessible
- Subtle animations with cubic-bezier easing
- Glass morphism, gradients, shadows for depth
- All interactive elements must be fully functional

OUTPUT: Return ONLY the complete HTML code. No markdown, no explanations. Start with <!DOCTYPE html>.`
    },
    {
      role: 'user',
      content: `Create a production-quality web application:

APP: ${appIdea}
SPECIFICATION: ${description}

REQUIRED FEATURES:
- ${featureList}

Make it visually stunning with working JavaScript for all interactions.`
    }
  ];
  
  const code = await chatCompletion(messages, { maxTokens: 24000, temperature: 0.7, provider });
  return code.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
};

export const iterateCode = async (currentCode, changeRequest, appIdea) => {
  const provider = getProviderForGame('vibeCode', 'chat');
  
  const messages = [
    {
      role: 'system',
      content: `You are refining an existing HTML application. Apply the requested changes while maintaining all existing functionality and design quality.

OUTPUT: Return ONLY the complete modified HTML. No markdown, no explanations.`
    },
    {
      role: 'user',
      content: `MODIFY THIS APP:

App: ${appIdea}
Change Request: ${changeRequest}

CURRENT CODE:
${currentCode}

Apply the change and return the complete updated HTML.`
    }
  ];
  
  const code = await chatCompletion(messages, { maxTokens: 24000, temperature: 0.5, provider });
  return code.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
};

export const polishCode = async (currentCode, appIdea) => {
  const provider = getProviderForGame('vibeCode', 'chat');
  
  const messages = [
    {
      role: 'system',
      content: `You are a UI polish specialist doing a final pass. Focus on:
- Micro-interaction refinements
- Animation timing and easing
- Color consistency and contrast
- Spacing and alignment
- Loading states and error handling
- Accessibility improvements

OUTPUT: Return ONLY the polished HTML.`
    },
    {
      role: 'user',
      content: `FINAL POLISH:

App: ${appIdea}

CODE:
${currentCode}

Make it production-ready.`
    }
  ];
  
  const code = await chatCompletion(messages, { maxTokens: 24000, temperature: 0.5, provider });
  return code.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
};

// BYTE mentor chat - enhanced with personality
export const byteChat = async (userMessage, context, history = []) => {
  const provider = getProviderForGame('vibeCode', 'chat');
  
  const messages = [
    {
      role: 'system',
      content: `You are BYTE, a friendly AI coding mentor with a fun, encouraging personality.
      
Your traits:
- Enthusiastic but not overwhelming
- Explain things simply with examples
- Celebrate small wins
- Reference the "villains" (Chaos, Complexity, Confusion, Bugs, Scope Creep) when relevant
- Keep responses concise (2-4 sentences usually)

Context: ${context}`
    },
    ...history.slice(-10),
    { role: 'user', content: userMessage }
  ];
  
  return await chatCompletion(messages, { maxTokens: 800, temperature: 0.9, provider });
};

// ============================================
// SPOT THE FAKE AI SERVICES
// ============================================

export const analyzeImageAuthenticity = async (imageDescription) => {
  const provider = getProviderForGame('spotTheFake', 'chat');
  
  const messages = [
    {
      role: 'system',
      content: `You are a digital forensics expert specializing in AI-generated image detection. Provide educational analysis.

ANALYSIS FRAMEWORK:
1. ANATOMICAL - Hands, faces, teeth, symmetry
2. PHYSICS - Lighting, shadows, reflections
3. TEXTURES - Skin, hair, fabric details
4. CONTEXT - Does everything make sense?
5. ARTIFACTS - Blending, edges, patterns

Be educational and explain WHY things are red flags.`
    },
    {
      role: 'user',
      content: `Analyze for AI generation signs:\n\n${imageDescription}\n\nProvide detailed breakdown and confidence assessment.`
    }
  ];
  
  return await chatCompletion(messages, { maxTokens: 1200, provider });
};

export const generateFakeDetectionTips = async (imageType) => {
  const provider = getProviderForGame('spotTheFake', 'chat');
  
  const messages = [
    {
      role: 'system',
      content: `You are an AI literacy educator. Create engaging, practical tips for detecting AI-generated content.`
    },
    {
      role: 'user',
      content: `Create 5 expert tips for detecting AI-generated ${imageType}.

For each tip:
- Catchy name
- What to look for
- Specific example
- Difficulty level`
    }
  ];
  
  return await chatCompletion(messages, { maxTokens: 1000, provider });
};

// ============================================
// UTILITIES
// ============================================

export const testApiConnection = async (providerId) => {
  const provider = providerId || getProvider();
  
  try {
    const result = await chatCompletion([
      { role: 'user', content: 'Respond with exactly: "Connected"' }
    ], { maxTokens: 20, provider });
    return result.toLowerCase().includes('connected');
  } catch (error) {
    console.error('API test failed:', error);
    return false;
  }
};

export const getModelInfo = (providerId) => {
  const provider = providerId || getProvider();
  const config = AI_PROVIDERS[provider];
  
  return {
    provider: config?.name || provider,
    chatModel: config?.chatModel || 'Unknown',
    imageModel: config?.imageModel || 'None',
    supportsImages: config?.supportsImage || false
  };
};

export const getAllProviders = () => AI_PROVIDERS;

export const getImageCapableProviders = () => {
  return Object.entries(AI_PROVIDERS)
    .filter(([_, config]) => config.supportsImage)
    .map(([id, config]) => ({ id, ...config }));
};

// ============================================
// MULTI-PROVIDER COMPARISON
// ============================================

export const multiProviderCompletion = async (messages, providers, options = {}) => {
  const results = await Promise.allSettled(
    providers.map(p => chatCompletion(messages, { ...options, provider: p }))
  );
  return providers.map((p, i) => ({
    provider: p,
    content: results[i].status === 'fulfilled' ? results[i].value : null,
    error: results[i].status === 'rejected' ? results[i].reason.message : null
  }));
};

export default {
  AI_PROVIDERS, setProvider, getProvider, getProviderConfig,
  setApiKey, getApiKey, hasApiKey, clearCredentials,
  chatCompletion, generateImage,
  getGameModels, setGameModel, getProviderForGame,
  critiqueMeme, suggestMemeEdits, generateMemeCaptions, generateMemeImagePrompt, brainstormMemeIdeas,
  generateInitialCode, iterateCode, polishCode, byteChat,
  analyzeImageAuthenticity, generateFakeDetectionTips,
  testApiConnection, getModelInfo, getAllProviders, getImageCapableProviders,
  multiProviderCompletion
};

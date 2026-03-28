// Image Database for Spot the Fake v3
// Two-image comparison format: one real, one AI
// Round 2: Original vs Edited with matching images

// ============================================
// ROUND 1: REAL VS AI-GENERATED (Pick the Real One)
// ============================================

export const round1Pairs = [
  {
    id: 'pair-1',
    category: 'faces',
    difficulty: 'easy',
    real: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face',
      source: 'Unsplash - Joseph Gonzalez',
      description: 'Professional headshot of a man'
    },
    ai: {
      url: 'https://thispersondoesnotexist.com/',
      source: 'AI Generated (StyleGAN)',
      description: 'AI-generated face'
    },
    // Since we can't reliably get AI faces, use a second real photo marked as AI for demo
    aiDemo: {
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop&crop=face',
      source: 'Demo - treated as AI',
    },
    tip: {
      title: 'Check the Background',
      icon: '🔍',
      content: 'AI-generated faces often have blurry, nonsensical, or morphing backgrounds. Real photos have coherent environments.',
      detail: 'Look behind the person - does the background make sense? AI often creates abstract blobs or impossible spaces.'
    }
  },
  {
    id: 'pair-2',
    category: 'faces',
    difficulty: 'easy',
    real: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop&crop=face',
      source: 'Unsplash - Brooke Cagle'
    },
    aiDemo: {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop&crop=face',
      source: 'Demo - treated as AI'
    },
    tip: {
      title: 'Examine the Hair',
      icon: '💇',
      content: 'AI struggles with hair, especially where it meets the face or background. Look for unnatural merging or floating strands.',
      detail: 'Zoom into the hairline and where hair meets ears/forehead. AI often creates a "painted on" look.'
    }
  },
  {
    id: 'pair-3',
    category: 'faces',
    difficulty: 'medium',
    real: {
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=face',
      source: 'Unsplash - Linkedin Sales'
    },
    aiDemo: {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop&crop=face',
      source: 'Demo - treated as AI'
    },
    tip: {
      title: 'Check the Ears',
      icon: '👂',
      content: 'AI often creates asymmetrical or anatomically incorrect ears. Compare both sides carefully.',
      detail: 'Human ears are unique and complex. AI frequently makes them too smooth, misshapen, or oddly positioned.'
    }
  },
  {
    id: 'pair-4',
    category: 'faces',
    difficulty: 'medium',
    real: {
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop&crop=face',
      source: 'Unsplash - Christopher Campbell'
    },
    aiDemo: {
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop&crop=face',
      source: 'Demo - treated as AI'
    },
    tip: {
      title: 'Look at the Teeth',
      icon: '😁',
      content: 'AI-generated teeth are often TOO perfect, all the same size, or have the wrong number. Real smiles have character!',
      detail: 'Count the teeth if visible. Look for natural imperfections like slight gaps or different sizes.'
    }
  },
  {
    id: 'pair-5',
    category: 'faces',
    difficulty: 'hard',
    real: {
      url: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&h=500&fit=crop&crop=face',
      source: 'Unsplash - Daniil Kuzelev'
    },
    aiDemo: {
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop&crop=face',
      source: 'Demo - treated as AI'
    },
    tip: {
      title: 'Eye Reflections',
      icon: '👁️',
      content: 'The catch lights (reflections) in both eyes should match. AI often creates different reflections in each eye.',
      detail: 'Look closely at the bright spots in both eyes. In real photos, they reflect the same light source.'
    }
  },
  {
    id: 'pair-6',
    category: 'animals',
    difficulty: 'easy',
    real: {
      url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=500&fit=crop',
      source: 'Unsplash - Manja Vitolic'
    },
    aiDemo: {
      url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop',
      source: 'Demo - treated as AI'
    },
    tip: {
      title: 'Count the Features',
      icon: '🔢',
      content: 'AI often gets the wrong number of whiskers, legs, toes, or other features. Count them!',
      detail: 'Cats have about 12 whiskers per side. Dogs have 5 toes on front paws, 4 on back. AI forgets these rules.'
    }
  },
  {
    id: 'pair-7',
    category: 'landscapes',
    difficulty: 'medium',
    real: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      source: 'Unsplash - Ales Krivec'
    },
    aiDemo: {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop',
      source: 'Demo - treated as AI'
    },
    tip: {
      title: 'Physics Check',
      icon: '⚖️',
      content: 'AI landscapes often defy physics - water flowing uphill, impossible shadows, or floating objects.',
      detail: 'Ask yourself: does this scene make physical sense? Could this exist in real life?'
    }
  },
  {
    id: 'pair-8',
    category: 'objects',
    difficulty: 'easy',
    real: {
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop',
      source: 'Unsplash - Glenn Carstens-Peters'
    },
    aiDemo: {
      url: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=600&h=400&fit=crop',
      source: 'Demo - treated as AI'
    },
    tip: {
      title: 'Read the Text',
      icon: '📝',
      content: "AI's biggest weakness is TEXT! Look for gibberish, misspellings, or impossible letter combinations.",
      detail: 'Any visible text on screens, signs, or products is a giveaway. AI creates nonsense characters.'
    }
  },
  {
    id: 'pair-9',
    category: 'hands',
    difficulty: 'medium',
    real: {
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&h=500&fit=crop',
      source: 'Unsplash - Annie Spratt'
    },
    aiDemo: {
      url: 'https://images.unsplash.com/photo-1502781252888-9143f5176882?w=500&h=500&fit=crop',
      source: 'Demo - treated as AI'
    },
    tip: {
      title: 'The Hands Test',
      icon: '✋',
      content: 'AI notoriously struggles with hands. Count fingers, check joints, and look for impossible poses.',
      detail: 'Hands should have 5 fingers with 3 joints each (except thumb with 2). AI often merges or adds fingers.'
    }
  },
  {
    id: 'pair-10',
    category: 'food',
    difficulty: 'hard',
    real: {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
      source: 'Unsplash - Brooke Lark'
    },
    aiDemo: {
      url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
      source: 'Demo - treated as AI'
    },
    tip: {
      title: 'Utensil Check',
      icon: '🍴',
      content: 'Look at forks, knives, and spoons. AI often creates impossible utensils with wrong prong counts or bent handles.',
      detail: 'Standard forks have 4 tines. Spoons have smooth curves. AI makes surreal cutlery.'
    }
  }
];

// ============================================
// ROUND 2: ORIGINAL VS EDITED (Spot the Edit)
// Using same image with obvious modifications
// ============================================

export const round2Pairs = [
  {
    id: 'edit-1',
    title: 'Face Smoothing',
    description: 'Beauty filters can remove all natural skin texture',
    original: {
      url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop&crop=face',
      label: 'Natural skin with pores and texture visible'
    },
    edited: {
      url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop&crop=face&blur=1',
      label: 'Smoothed skin, plastic-like appearance',
      editType: 'Face smoothing / beauty filter'
    },
    tip: {
      title: 'Skin Texture',
      icon: '✨',
      content: 'Real skin has pores, fine lines, and texture. Over-edited photos look like plastic or wax.',
      detail: 'Zoom into cheeks and forehead. Real skin has visible texture. Edited skin looks airbrushed.'
    }
  },
  {
    id: 'edit-2',
    title: 'Body Reshaping',
    description: 'Warped backgrounds reveal body edits',
    original: {
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
      label: 'Straight lines in background'
    },
    edited: {
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&blur=0.5',
      label: 'Warped/bent lines near body',
      editType: 'Body reshaping / liquify'
    },
    tip: {
      title: 'Background Warping',
      icon: '🌊',
      content: 'When bodies are digitally reshaped, straight lines in the background get warped and bent.',
      detail: 'Look at door frames, tiles, fences - anything that should be straight. Curves near the body = editing.'
    }
  },
  {
    id: 'edit-3',
    title: 'Color Manipulation',
    description: 'Unnatural colors can change the mood entirely',
    original: {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
      label: 'Natural colors and lighting'
    },
    edited: {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&sat=200',
      label: 'Over-saturated, unnatural colors',
      editType: 'Color saturation boost'
    },
    tip: {
      title: 'Color Reality',
      icon: '🌈',
      content: 'Over-saturated photos have colors that are too vivid to be real. Skies, grass, and skin can look radioactive.',
      detail: 'Ask: have I ever seen grass THIS green or a sky THIS blue in person? Probably not.'
    }
  },
  {
    id: 'edit-4',
    title: 'Object Removal',
    description: 'Things removed leave telltale signs',
    original: {
      url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop',
      label: 'Complete urban scene'
    },
    edited: {
      url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop&blur=0.3',
      label: 'Repeating patterns where objects removed',
      editType: 'Object removal / clone stamp'
    },
    tip: {
      title: 'Clone Stamp Artifacts',
      icon: '👯',
      content: 'When objects are removed, editors often clone nearby textures. Look for unnatural repetition.',
      detail: 'Scan for identical patterns, repeated bricks, or suspiciously smooth areas where something was removed.'
    }
  },
  {
    id: 'edit-5',
    title: 'Fake Bokeh',
    description: 'Artificial blur has unnatural edges',
    original: {
      url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&h=500&fit=crop',
      label: 'Natural depth of field'
    },
    edited: {
      url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&h=500&fit=crop&blur=3',
      label: 'Artificial blur with harsh edges',
      editType: 'Portrait mode / fake bokeh'
    },
    tip: {
      title: 'Edge Quality',
      icon: '🔲',
      content: 'Real lens blur is smooth and gradual. Fake blur has harsh edges where the subject meets background.',
      detail: 'Look at hair edges, glasses, or thin objects. Real blur transitions smoothly. Fake blur has halos.'
    }
  }
];

// ============================================
// DETECTION TIPS DATABASE
// ============================================

export const allDetectionTips = [
  { category: 'faces', tip: 'AI struggles with asymmetry. Real faces have subtle differences between left and right sides.' },
  { category: 'faces', tip: 'Check jewelry - AI creates impossible earrings, necklaces, and accessories.' },
  { category: 'faces', tip: 'Hair should have individual strands. AI often creates solid masses of color.' },
  { category: 'hands', tip: 'Count fingers! AI often creates 4, 6, or more fingers on a single hand.' },
  { category: 'hands', tip: 'Look at fingernails - AI makes them the wrong shape, size, or places them incorrectly.' },
  { category: 'text', tip: 'Any readable text is a dead giveaway. AI cannot spell or create real words.' },
  { category: 'animals', tip: 'Check eye positions and ear shapes. AI often makes them unnaturally symmetrical.' },
  { category: 'landscapes', tip: 'Look for repeating patterns in clouds, trees, or water. AI loves to duplicate.' },
  { category: 'general', tip: 'Trust your gut. If something feels "off" even if you can\'t explain why, it might be AI.' },
  { category: 'general', tip: 'Zoom in! Many AI artifacts are only visible when you look closely at details.' }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getShuffledPairs = (pairs, count) => {
  const shuffled = [...pairs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(pair => ({
    ...pair,
    // Randomly swap which is shown on left vs right
    swapped: Math.random() > 0.5
  }));
};

export const getRandomTip = () => {
  return allDetectionTips[Math.floor(Math.random() * allDetectionTips.length)];
};

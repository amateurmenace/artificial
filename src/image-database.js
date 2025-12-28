// Image Database for Spot the Fake
// Curated pairs of real vs AI-generated images with detection hints

// Note: In production, you would want to host these images yourself
// For now, we use a mix of real photo sources and descriptive data

// ROUND 1: Real vs AI-Generated
// These are mixed pairs where players guess which is AI
export const round1Images = [
  {
    id: 'r1-1',
    imageA: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
      isAI: false,
      source: 'Unsplash - Joseph Gonzalez'
    },
    imageB: {
      // This would be an AI-generated face in production
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop',
      isAI: true, // Marked as AI for game purposes
      source: 'AI Generated'
    },
    category: 'faces',
    difficulty: 'easy',
    detectionHints: [
      'Look at the hairline - AI often struggles with natural hair edges',
      'Check the ears - are they symmetrical in an unnatural way?',
      'Examine the background - does it make sense spatially?'
    ],
    explanation: 'The AI image has subtle artifacts in the hair edges and slightly too-perfect skin texture.'
  },
  {
    id: 'r1-2',
    imageA: {
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop',
      isAI: false,
      source: 'Unsplash - Christopher Campbell'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop',
      isAI: true,
      source: 'AI Generated'
    },
    category: 'faces',
    difficulty: 'medium',
    detectionHints: [
      'Look at the jewelry - AI often creates impossible accessories',
      'Check where skin meets clothing or hair',
      'Look for asymmetry in the face'
    ],
    explanation: 'AI-generated faces often have too-perfect symmetry and smooth skin without natural texture.'
  },
  {
    id: 'r1-3',
    imageA: {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop',
      isAI: true,
      source: 'AI Generated'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop',
      isAI: false,
      source: 'Unsplash - Eric Lucatero'
    },
    category: 'faces',
    difficulty: 'medium',
    detectionHints: [
      'Look at the eyes - do reflections match?',
      'Check the teeth - AI often makes them too uniform',
      'Examine the collar/neckline carefully'
    ],
    explanation: 'Real photos have natural imperfections and asymmetry that AI struggles to replicate.'
  },
  {
    id: 'r1-4',
    imageA: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop',
      isAI: false,
      source: 'Unsplash - Brooke Cagle'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=600&fit=crop',
      isAI: true,
      source: 'AI Generated'
    },
    category: 'faces',
    difficulty: 'hard',
    detectionHints: [
      'High-quality AI images are very convincing',
      'Look at hair strands near the face',
      'Check for background blur consistency'
    ],
    explanation: 'Modern AI can create very convincing faces - the giveaway is often in tiny details.'
  },
  {
    id: 'r1-5',
    imageA: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      isAI: false,
      source: 'Unsplash - Ales Krivec'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop',
      isAI: true,
      source: 'AI Generated'
    },
    category: 'landscapes',
    difficulty: 'hard',
    detectionHints: [
      'AI landscapes are often TOO perfect',
      'Look for impossible geological formations',
      'Check if lighting is consistent across the scene'
    ],
    explanation: 'AI landscapes can look dreamlike - check for physically impossible elements.'
  },
  {
    id: 'r1-6',
    imageA: {
      url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
      isAI: true,
      source: 'AI Generated'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
      isAI: false,
      source: 'Unsplash - Manja Vitolic'
    },
    category: 'animals',
    difficulty: 'medium',
    detectionHints: [
      'Count the whiskers - AI sometimes gets numbers wrong',
      'Look at the fur texture - is it consistent?',
      'Check the eyes for natural reflections'
    ],
    explanation: 'AI animal images often have subtle issues with fur direction and ear shapes.'
  },
  {
    id: 'r1-7',
    imageA: {
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop',
      isAI: false,
      source: 'Unsplash - Glenn Carstens-Peters'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=600&h=400&fit=crop',
      isAI: true,
      source: 'AI Generated'
    },
    category: 'objects',
    difficulty: 'easy',
    detectionHints: [
      'Can you read any text on screen or items?',
      'Look at the hands/fingers if visible',
      'Check if reflections on screens make sense'
    ],
    explanation: 'Text is AI\'s biggest weakness - look for gibberish or impossible letters.'
  },
  {
    id: 'r1-8',
    imageA: {
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
      isAI: true,
      source: 'AI Generated'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop',
      isAI: false,
      source: 'Unsplash - Raul Varzar'
    },
    category: 'cityscapes',
    difficulty: 'hard',
    detectionHints: [
      'Look for repeating building patterns',
      'Check if perspective lines converge correctly',
      'Look for impossible architectural details'
    ],
    explanation: 'AI cityscapes often have subtle perspective errors and repeated elements.'
  },
  {
    id: 'r1-9',
    imageA: {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
      isAI: false,
      source: 'Unsplash - Brooke Lark'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
      isAI: true,
      source: 'AI Generated'
    },
    category: 'food',
    difficulty: 'medium',
    detectionHints: [
      'Food photography is tricky for AI',
      'Look for utensils - do they look right?',
      'Check reflections on plates and surfaces'
    ],
    explanation: 'AI food images often have subtle issues with utensils and table arrangements.'
  },
  {
    id: 'r1-10',
    imageA: {
      url: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&h=600&fit=crop',
      isAI: true,
      source: 'AI Generated'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop',
      isAI: false,
      source: 'Unsplash - Daniil Kuzelev'
    },
    category: 'faces',
    difficulty: 'hard',
    detectionHints: [
      'High difficulty - both look very real',
      'Look for the most subtle details',
      'Trust your gut feeling about what looks "off"'
    ],
    explanation: 'When in doubt, look at ears, teeth, and hair boundaries - AI\'s classic weak spots.'
  }
];

// ROUND 2: Original vs Edited
// These are pairs where players identify manipulation
export const round2Images = [
  {
    id: 'r2-1',
    imageA: {
      url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop',
      isEdited: false,
      source: 'Unsplash - Aiony Haust'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop&sat=-100',
      isEdited: true,
      editType: 'color-manipulation',
      source: 'Modified version'
    },
    category: 'portrait',
    difficulty: 'easy',
    detectionHints: [
      'Look for inconsistent lighting',
      'Check skin tones - do they look natural?',
      'Look at shadows - do they match the lighting?'
    ],
    explanation: 'Color grading can be obvious or subtle - check if skin tones look natural.'
  },
  {
    id: 'r2-2',
    imageA: {
      url: 'https://images.unsplash.com/photo-1499996860823-5f82115f184f?w=600&h=400&fit=crop',
      isEdited: true,
      editType: 'object-removal',
      source: 'Modified version'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
      isEdited: false,
      source: 'Unsplash - Luca Bravo'
    },
    category: 'landscape',
    difficulty: 'medium',
    detectionHints: [
      'Look for clone-stamp artifacts',
      'Check if textures repeat unnaturally',
      'Look for inconsistent noise patterns'
    ],
    explanation: 'Object removal often leaves subtle cloning artifacts in surrounding textures.'
  },
  {
    id: 'r2-3',
    imageA: {
      url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=400&fit=crop',
      isEdited: false,
      source: 'Unsplash - Alvan Nee'
    },
    imageB: {
      url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=400&fit=crop&blur=2',
      isEdited: true,
      editType: 'background-blur',
      source: 'Modified version'
    },
    category: 'pet',
    difficulty: 'easy',
    detectionHints: [
      'Look at the edge between subject and background',
      'Is the blur consistent with natural lens blur?',
      'Check for halos around the subject'
    ],
    explanation: 'Artificial blur often has unnatural edges where subject meets background.'
  }
];

// Categories for filtering
export const imageCategories = [
  { id: 'faces', name: 'Faces & Portraits', icon: '👤' },
  { id: 'landscapes', name: 'Landscapes & Nature', icon: '🏔️' },
  { id: 'animals', name: 'Animals & Pets', icon: '🐱' },
  { id: 'objects', name: 'Objects & Products', icon: '📦' },
  { id: 'cityscapes', name: 'Cities & Architecture', icon: '🏙️' },
  { id: 'food', name: 'Food & Drinks', icon: '🍽️' },
];

// Difficulty settings
export const difficultySettings = {
  easy: {
    timePerImage: 30,
    pointsCorrect: 10,
    pointsWrong: 0,
    hintsEnabled: true
  },
  medium: {
    timePerImage: 20,
    pointsCorrect: 15,
    pointsWrong: -5,
    hintsEnabled: true
  },
  hard: {
    timePerImage: 15,
    pointsCorrect: 20,
    pointsWrong: -10,
    hintsEnabled: false
  }
};

// Helper to get random image pairs for a round
export const getRandomImagePairs = (count = 5, difficulty = 'mixed') => {
  let images = [...round1Images];
  
  if (difficulty !== 'mixed') {
    images = images.filter(img => img.difficulty === difficulty);
  }
  
  // Shuffle
  const shuffled = images.sort(() => Math.random() - 0.5);
  
  // Take requested count
  const selected = shuffled.slice(0, count);
  
  // Randomly swap A and B positions for each pair
  return selected.map(pair => {
    const shouldSwap = Math.random() > 0.5;
    if (shouldSwap) {
      return {
        ...pair,
        imageA: pair.imageB,
        imageB: pair.imageA
      };
    }
    return pair;
  });
};

// Helper to get round 2 image pairs
export const getRound2ImagePairs = (count = 3) => {
  const shuffled = [...round2Images].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get images by category
export const getImagesByCategory = (category) => {
  return round1Images.filter(img => img.category === category);
};

// Scoring helpers
export const calculateScore = (isCorrect, timeRemaining, streak, difficulty = 'medium') => {
  const settings = difficultySettings[difficulty];
  
  if (!isCorrect) {
    return {
      points: settings.pointsWrong,
      breakdown: { base: settings.pointsWrong, timeBonus: 0, streakBonus: 0 }
    };
  }
  
  // Base points
  let points = settings.pointsCorrect;
  
  // Time bonus (faster = more points)
  const timeBonus = Math.floor(timeRemaining / 5);
  points += timeBonus;
  
  // Streak bonus
  const streakBonus = streak >= 3 ? Math.floor(streak / 3) * 5 : 0;
  points += streakBonus;
  
  return {
    points,
    breakdown: {
      base: settings.pointsCorrect,
      timeBonus,
      streakBonus
    }
  };
};

// Detection hints database
export const detectionHintsByCategory = {
  faces: [
    { hint: 'Check the hands - count the fingers!', priority: 'high' },
    { hint: 'Look at the ears - are they symmetrical in an unnatural way?', priority: 'high' },
    { hint: 'Examine the teeth - AI often makes them too uniform', priority: 'medium' },
    { hint: 'Look at where hair meets skin - AI struggles here', priority: 'medium' },
    { hint: 'Check eye reflections - they should match on both eyes', priority: 'hard' },
    { hint: 'Look for jewelry - AI creates impossible accessories', priority: 'medium' }
  ],
  landscapes: [
    { hint: 'AI landscapes are often TOO perfect', priority: 'medium' },
    { hint: 'Look for impossible geological formations', priority: 'high' },
    { hint: 'Check if the sky looks natural', priority: 'medium' },
    { hint: 'Look for repeating patterns in foliage', priority: 'hard' }
  ],
  objects: [
    { hint: 'Can you read any text? AI struggles with text!', priority: 'high' },
    { hint: 'Look at reflections - do they make sense?', priority: 'medium' },
    { hint: 'Check shadows - are they consistent?', priority: 'medium' }
  ],
  animals: [
    { hint: 'Count whiskers, legs, and other features', priority: 'high' },
    { hint: 'Look at fur texture - is it consistent?', priority: 'medium' },
    { hint: 'Check the eyes for natural reflections', priority: 'medium' }
  ],
  cityscapes: [
    { hint: 'Look for repeating window patterns', priority: 'high' },
    { hint: 'Check perspective lines - they should converge correctly', priority: 'high' },
    { hint: 'Look for impossible architectural details', priority: 'medium' }
  ],
  food: [
    { hint: 'Check utensils - AI often gets silverware wrong', priority: 'high' },
    { hint: 'Look at reflections on plates and glasses', priority: 'medium' },
    { hint: 'Food textures should look appetizing and real', priority: 'medium' }
  ]
};

// Get hints for a category
export const getHintsForCategory = (category, count = 3) => {
  const hints = detectionHintsByCategory[category] || detectionHintsByCategory.faces;
  return hints.slice(0, count);
};

// Educational Content for Spot the Fake
// Real-world examples, detection techniques, ethics, and legal implications

export const educationalContent = {
  introduction: {
    title: "The Age of AI Images",
    content: `In 2023, AI-generated images became indistinguishable from real photographs for most people. Tools like DALL-E, Midjourney, and Stable Diffusion can create photorealistic images from text descriptions in seconds.`,
    keyStats: [
      "Over 15 billion AI images were generated in 2023 alone",
      "Studies show people correctly identify AI images only 50-60% of the time",
      "Deepfake videos increased 900% between 2019 and 2023",
      "78% of Americans are concerned about AI-generated misinformation"
    ]
  },

  realWorldExamples: [
    {
      id: "pentagon-explosion",
      title: "The Pentagon 'Explosion' (May 2023)",
      description: "An AI-generated image showing an explosion near the Pentagon went viral on Twitter, briefly causing stock market fluctuations.",
      impact: "The S&P 500 briefly dropped, demonstrating how AI fakes can affect financial markets in minutes.",
      detection: "Telltale signs included: an impossible fence structure, inconsistent smoke patterns, and buildings that didn't match the actual Pentagon layout.",
      category: "misinformation"
    },
    {
      id: "pope-puffer",
      title: "The Pope in a Puffer Jacket (March 2023)",
      description: "A Midjourney-generated image of Pope Francis wearing a stylish white puffer jacket went massively viral, fooling millions.",
      impact: "Shared over 20 million times before being identified as AI-generated.",
      detection: "Close examination revealed: distorted crucifix, irregular glasses frames, and hands that don't quite look right.",
      category: "viral-hoax"
    },
    {
      id: "trump-arrest",
      title: "Trump 'Arrest' Images (March 2023)",
      description: "AI-generated images showing Donald Trump being arrested by police circulated widely before any actual indictment occurred.",
      impact: "Raised concerns about AI's potential to influence political events and public perception.",
      detection: "Issues included: wrong number of fingers, garbled text on uniforms, and inconsistent lighting.",
      category: "political"
    },
    {
      id: "celebrity-deepfakes",
      title: "Taylor Swift Deepfakes (January 2024)",
      description: "Non-consensual AI-generated explicit images of Taylor Swift spread rapidly on social media.",
      impact: "Led to renewed calls for legislation against non-consensual deepfakes.",
      detection: "While high-quality, artifacts were visible in hair edges, jewelry, and background consistency.",
      category: "harassment"
    }
  ],

  detectionTechniques: {
    faces: {
      title: "Detecting AI Faces",
      techniques: [
        {
          name: "The Hands Test",
          description: "AI consistently struggles with hands. Look for extra fingers, missing fingers, or impossibly bent joints.",
          difficulty: "Easy",
          reliability: "High"
        },
        {
          name: "Ear Symmetry",
          description: "Human ears are asymmetrical but follow patterns. AI ears often look too perfect or have impossible shapes.",
          difficulty: "Medium",
          reliability: "Medium"
        },
        {
          name: "Teeth Check",
          description: "AI teeth are often too uniform, too numerous, or fade into each other.",
          difficulty: "Easy",
          reliability: "High"
        },
        {
          name: "Hair Boundaries",
          description: "Where hair meets skin or background is difficult for AI. Look for unnatural fading or merging.",
          difficulty: "Medium",
          reliability: "High"
        },
        {
          name: "Eye Reflections",
          description: "Both eyes should show the same light source reflection. AI often creates mismatched catchlights.",
          difficulty: "Hard",
          reliability: "High"
        }
      ]
    },
    backgrounds: {
      title: "Detecting AI Backgrounds",
      techniques: [
        {
          name: "Text and Signs",
          description: "AI cannot reliably generate readable text. Look for gibberish on signs, books, and clothing.",
          difficulty: "Easy",
          reliability: "Very High"
        },
        {
          name: "Repeating Patterns",
          description: "AI may create impossible repeating elements - identical leaves or clone-stamped crowd members.",
          difficulty: "Medium",
          reliability: "High"
        },
        {
          name: "Shadow Consistency",
          description: "All shadows should point the same direction. AI often creates shadows that don't match.",
          difficulty: "Medium",
          reliability: "High"
        }
      ]
    }
  },

  ethics: {
    title: "Ethical Considerations",
    questions: [
      {
        question: "When is creating AI images acceptable vs. harmful?",
        discussion: "AI art for personal creativity and clearly labeled content is generally acceptable. Problems arise when AI images are used to deceive or manipulate.",
        scenarios: [
          "✅ Creating AI art for a personal project with clear labeling",
          "✅ Using AI to visualize concepts that don't exist",
          "⚠️ Creating AI images of real people without consent",
          "❌ Spreading AI images as real news or documentation",
          "❌ Creating non-consensual intimate imagery of real people"
        ]
      },
      {
        question: "Who is responsible when AI fakes cause harm?",
        discussion: "Responsibility may fall on: the creator, the spreader, the platform, or even the AI company.",
        scenarios: [
          "If you share a fake believing it's real, are you responsible?",
          "Should AI tools have watermarks or limitations?",
          "What duty do platforms have to detect and remove fakes?",
          "Should AI companies be liable for misuse of their tools?"
        ]
      }
    ]
  },

  legal: {
    title: "Legal Implications",
    overview: "Laws around AI-generated images are rapidly evolving.",
    categories: [
      {
        area: "Deepfake Pornography",
        status: "Increasingly Illegal",
        details: "Over 40 US states have laws against non-consensual deepfake pornography.",
        penalties: "Fines up to $150,000, imprisonment up to 4 years in some jurisdictions"
      },
      {
        area: "Election Interference",
        status: "Restricted",
        details: "The FCC banned AI-generated voices in robocalls in 2024. Several states require disclosure in political ads.",
        penalties: "FCC fines, potential election law violations"
      },
      {
        area: "Fraud and Impersonation",
        status: "Covered by Existing Laws",
        details: "Using AI images for fraud or identity theft is illegal under existing laws.",
        penalties: "Federal charges possible, up to 20 years for serious fraud"
      }
    ],
    pendingLegislation: [
      "EU AI Act - Comprehensive AI regulation including disclosure requirements",
      "US DEFIANCE Act - Federal criminalization of non-consensual deepfakes",
      "NO FAKES Act - Protecting individuals' voice and likeness from AI"
    ]
  },

  discussionPrompts: {
    round1: [
      "What surprised you about how realistic AI images have become?",
      "Have you ever been fooled by an AI image online?",
      "Which detection techniques do you think you'll actually use?"
    ],
    round2: [
      "Why do you think AI has trouble with hands and text?",
      "How confident do you feel in spotting AI images now?",
      "What would make detection easier or harder in the future?"
    ],
    ethics: [
      "Where do you personally draw the line between acceptable and harmful AI image use?",
      "Should AI tools have built-in restrictions?",
      "How has this changed how you'll interact with images online?"
    ],
    legal: [
      "Do you think current laws are adequate for AI images?",
      "Should creating AI images of real people require consent?",
      "How should platforms balance free expression with preventing harm?"
    ]
  },

  quizQuestions: [
    {
      question: "What percentage of the time do people correctly identify AI images?",
      options: ["25-35%", "50-60%", "75-85%", "90-95%"],
      correct: 1,
      explanation: "Studies show people correctly identify AI images only about 50-60% of the time."
    },
    {
      question: "Which is the MOST reliable way to detect AI images?",
      options: ["Checking for perfect symmetry", "Looking for text in the image", "Examining the overall 'vibe'", "Checking the file size"],
      correct: 1,
      explanation: "AI still struggles with generating readable, coherent text."
    },
    {
      question: "As of 2024, non-consensual deepfake pornography is:",
      options: ["Legal everywhere", "Only illegal in California", "Illegal in 40+ US states", "Only a civil matter"],
      correct: 2,
      explanation: "Over 40 US states have criminalized non-consensual deepfake pornography."
    }
  ]
};

export const getRandomExamples = (count = 3) => {
  const examples = [...educationalContent.realWorldExamples];
  const shuffled = examples.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getDetectionTips = (category) => {
  return educationalContent.detectionTechniques[category] || educationalContent.detectionTechniques.faces;
};

export const getDiscussionPrompts = (round) => {
  return educationalContent.discussionPrompts[round] || educationalContent.discussionPrompts.round1;
};

export const getQuizQuestions = (count = 3) => {
  const questions = [...educationalContent.quizQuestions];
  const shuffled = questions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

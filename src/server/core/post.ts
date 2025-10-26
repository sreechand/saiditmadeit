import { context, reddit } from '@devvit/web/server';

// Create a simple data URI background for the splash screen
function createDynamicBackground(theme: string): string {
  const themeColors = {
    Animals: { primary: '#f59e0b', secondary: '#d97706', accent: '#92400e' },
    Colors: { primary: '#ec4899', secondary: '#db2777', accent: '#be185d' },
    Food: { primary: '#ef4444', secondary: '#dc2626', accent: '#b91c1c' },
    Sports: { primary: '#3b82f6', secondary: '#2563eb', accent: '#1d4ed8' },
    Nature: { primary: '#10b981', secondary: '#059669', accent: '#047857' }
  };

  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.Animals;
  
  // Create a simple SVG background with theme colors
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0.9" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bg)"/>
      <g opacity="0.1">
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="1"/>
        </pattern>
        <rect width="800" height="600" fill="url(#grid)" />
      </g>
      <text x="400" y="300" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="white" opacity="0.3">🐍 ${theme.toUpperCase()}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  // Get a random theme for dynamic splash screen content
  const themes = ['Animals', 'Colors', 'Food', 'Sports', 'Nature'] as const;
  const randomTheme = themes[Math.floor(Math.random() * themes.length)] || 'Animals';
  
  // Create compelling, action-oriented descriptions with gamification
  const themeDescriptions = {
    Animals: `🦁 SAFARI WORD HUNT: Slither through the alphabet jungle! Your snake grows stronger with each creature name you discover. Find all 3 hidden animals to become the ultimate wildlife explorer! 🏆`,
    Colors: `🎨 RAINBOW EXPEDITION: Paint your path through a spectrum of letters! Each color word you spell adds vibrant power to your snake. Master the palette and claim your artist badge! ✨`,
    Food: `🍽️ CULINARY QUEST: Your snake is hungry for word-food! Feed it the perfect letter combinations to spell mouth-watering dishes. Complete the menu to earn your chef's crown! 👨‍🍳`,
    Sports: `🏆 CHAMPIONSHIP CHALLENGE: Train your snake to be a word athlete! Navigate the playing field of letters to spell winning sports terms. Victory awaits the ultimate word champion! 🥇`,
    Nature: `🌿 WILDERNESS ADVENTURE: Guide your snake through untamed letter landscapes! Discover the hidden words of nature to unlock the secrets of the wild. Become the forest word guardian! 🦅`
  };

  const themeEmojis = {
    Animals: '🐍🦁🐸',
    Colors: '🌈🎨✨', 
    Food: '🍎🍕🥗',
    Sports: '⚽🏀🏈',
    Nature: '🌲🌊⛰️'
  };

  const buttonLabels = {
    Animals: '🦁 Begin Safari Quest',
    Colors: '🌈 Start Color Hunt',
    Food: '🍕 Enter Kitchen Arena',
    Sports: '⚽ Join Championship',
    Nature: '🏔️ Explore Wilderness'
  };

  // Add achievement hints to make it more compelling
  const achievementHints = {
    Animals: 'Unlock: "Beast Master" achievement for finding all animals under 2 minutes!',
    Colors: 'Unlock: "Rainbow Warrior" achievement for perfect color spelling!',
    Food: 'Unlock: "Master Chef" achievement for zero wrong letters!',
    Sports: 'Unlock: "Champion" achievement for lightning-fast completion!',
    Nature: 'Unlock: "Nature Guardian" achievement for discovering all wilderness words!'
  };

  // Dynamic engagement hooks
  const engagementHooks = {
    Animals: ['Can you find the jungle king?', 'What creature rules the ocean?', 'Discover the fastest land animal!'],
    Colors: ['Paint the rainbow with words!', 'What color is the sky?', 'Find the color of fire!'],
    Food: ['What makes you hungry?', 'Find the breakfast favorite!', 'Discover the pizza topping!'],
    Sports: ['Score the winning goal!', 'What game uses a net?', 'Find the Olympic sport!'],
    Nature: ['What grows in the forest?', 'Find the mountain peak!', 'Discover the ocean wave!']
  };

  const currentTime = new Date();
  const timeOfDay = currentTime.getHours() < 12 ? 'Morning' : 
                   currentTime.getHours() < 17 ? 'Afternoon' : 'Evening';
  
  const randomHook = engagementHooks[randomTheme as keyof typeof engagementHooks];
  const selectedHook = randomHook ? randomHook[Math.floor(Math.random() * randomHook.length)] : 'Discover hidden words!';

  // Dynamic post titles with variety
  const titleVariations = [
    `🐍 ${timeOfDay} Word Challenge: ${randomTheme} Snake Puzzle!`,
    `🎯 Can You Find All ${randomTheme} Words? Snake Puzzle Challenge!`,
    `🏆 ${randomTheme} Word Hunt: Guide Your Snake to Victory!`,
    `🌟 New ${randomTheme} Puzzle: Snake Your Way to Success!`,
    `🎮 ${selectedHook} Play Snake Word Puzzle Now!`
  ];
  
  const selectedTitle = titleVariations[Math.floor(Math.random() * titleVariations.length)] || `🐍 Snake Word Puzzle - ${randomTheme} Challenge!`;
  
  const currentAchievementHint = achievementHints[randomTheme as keyof typeof achievementHints] || 'Complete all words to unlock achievements!';
  const safeSelectedHook = selectedHook || 'Discover hidden words!';

  return await reddit.submitCustomPost({
    splash: {
      // Compelling Splash Screen Configuration
      appDisplayName: 'Snake Word Puzzle',
      backgroundUri: createDynamicBackground(randomTheme),
      buttonLabel: buttonLabels[randomTheme as keyof typeof buttonLabels] || '🎮 Start Adventure',
      description: `${themeDescriptions[randomTheme as keyof typeof themeDescriptions] || 'Guide your snake through letters to discover hidden themed words!'}\n\n💡 ${achievementHints[randomTheme as keyof typeof achievementHints] || 'Complete all words to unlock special achievements!'}`,
      heading: `${themeEmojis[randomTheme as keyof typeof themeEmojis]} ${randomTheme} Word Hunt`,
      appIconUri: 'default-icon.png',
      entryUri: 'index.html'
    } as any, // Temporary type assertion to handle version mismatch
    postData: {
      gameState: 'initial',
      theme: randomTheme,
      difficulty: 'medium',
      splashTheme: randomTheme,
      createdAt: currentTime.toISOString(),
      timeOfDay: timeOfDay,
      selectedHook: safeSelectedHook,
      achievementHint: currentAchievementHint
    },
    subredditName: subredditName,
    title: selectedTitle,
  });
};

// Theme Definitions and Word Database

import type { Theme } from '../types/game.js';

export const THEME_DATABASE: Record<string, Theme> = {
  Animals: {
    name: 'Animals',
    category: 'Living Creatures',
    targetWords: [
      'CAT', 'DOG', 'BIRD', 'FISH', 'BEAR', 'WOLF', 'LION', 'TIGER',
      'MOUSE', 'HORSE', 'SHEEP', 'GOAT', 'DUCK', 'FROG', 'SNAKE'
    ],
    distractorWords: [
      'TREE', 'ROCK', 'BOOK', 'CHAIR', 'TABLE', 'PHONE', 'WATER',
      'FIRE', 'WIND', 'CLOUD', 'STAR', 'MOON', 'SUN', 'RAIN'
    ]
  },
  
  Colors: {
    name: 'Colors',
    category: 'Visual Spectrum',
    targetWords: [
      'RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK', 'WHITE', 'PINK',
      'BROWN', 'GRAY', 'ORANGE', 'PURPLE', 'GOLD', 'SILVER'
    ],
    distractorWords: [
      'HOUSE', 'TREE', 'BOOK', 'MUSIC', 'DANCE', 'SPORT', 'GAME',
      'FOOD', 'DRINK', 'PLANT', 'STONE', 'METAL', 'WOOD'
    ]
  },
  
  Food: {
    name: 'Food',
    category: 'Edible Items',
    targetWords: [
      'APPLE', 'BREAD', 'CHEESE', 'FISH', 'MEAT', 'RICE', 'PASTA',
      'PIZZA', 'CAKE', 'MILK', 'WATER', 'JUICE', 'SOUP', 'SALAD'
    ],
    distractorWords: [
      'CHAIR', 'TABLE', 'BOOK', 'PHONE', 'MUSIC', 'DANCE', 'SPORT',
      'TREE', 'FLOWER', 'STONE', 'METAL', 'GLASS', 'PAPER'
    ]
  },
  
  Sports: {
    name: 'Sports',
    category: 'Athletic Activities',
    targetWords: [
      'SOCCER', 'TENNIS', 'GOLF', 'SWIM', 'RUN', 'JUMP', 'BIKE',
      'SKATE', 'SURF', 'CLIMB', 'DANCE', 'YOGA', 'BOXING'
    ],
    distractorWords: [
      'BOOK', 'MUSIC', 'FOOD', 'HOUSE', 'TREE', 'FLOWER', 'WATER',
      'FIRE', 'STONE', 'METAL', 'GLASS', 'PAPER', 'CLOTH'
    ]
  },
  
  Nature: {
    name: 'Nature',
    category: 'Natural World',
    targetWords: [
      'TREE', 'FLOWER', 'GRASS', 'ROCK', 'WATER', 'FIRE', 'WIND',
      'CLOUD', 'RAIN', 'SNOW', 'SUN', 'MOON', 'STAR', 'OCEAN'
    ],
    distractorWords: [
      'HOUSE', 'CAR', 'PHONE', 'BOOK', 'MUSIC', 'DANCE', 'SPORT',
      'FOOD', 'CHAIR', 'TABLE', 'GLASS', 'METAL', 'PAPER'
    ]
  }
};

/**
 * Get a random theme
 */
export function getRandomTheme(): Theme {
  const themes = Object.values(THEME_DATABASE);
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  if (!randomTheme) {
    // Fallback to Animals theme if something goes wrong
    const animalsTheme = THEME_DATABASE['Animals'];
    if (!animalsTheme) {
      throw new Error('Animals theme not found in database');
    }
    return animalsTheme;
  }
  return randomTheme;
}

/**
 * Get theme by name
 */
export function getThemeByName(name: string): Theme | null {
  const theme = THEME_DATABASE[name];
  return theme || null;
}

/**
 * Get all available theme names
 */
export function getAvailableThemes(): string[] {
  return Object.keys(THEME_DATABASE);
}

/**
 * Select random words from theme for puzzle generation
 */
export function selectWordsForPuzzle(theme: Theme, targetCount: number = 3, distractorCount: number = 2): {
  targetWords: string[];
  distractorWords: string[];
} {
  // Shuffle and select target words
  const shuffledTargets = [...theme.targetWords].sort(() => Math.random() - 0.5);
  const targetWords = shuffledTargets.slice(0, targetCount);
  
  // Shuffle and select distractor words
  const shuffledDistractors = [...theme.distractorWords].sort(() => Math.random() - 0.5);
  const distractorWords = shuffledDistractors.slice(0, distractorCount);
  
  return { targetWords, distractorWords };
}

/**
 * Validate word length for grid placement
 */
export function validateWordLength(word: string, maxLength: number = 6): boolean {
  return word.length >= 3 && word.length <= maxLength;
}

/**
 * Filter words by length constraints
 */
export function filterWordsByLength(words: string[], minLength: number = 3, maxLength: number = 6): string[] {
  return words.filter(word => word.length >= minLength && word.length <= maxLength);
}
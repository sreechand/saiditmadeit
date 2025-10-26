// Theme Definitions and Word Database

import type { Theme } from '../types/game.js';

export const THEME_DATABASE: Record<string, Theme> = {
  Animals: {
    name: 'Animals',
    category: 'Living Creatures',
    targetWords: [
      'CAT', 'DOG', 'BIRD', 'FISH', 'BEAR', 'WOLF', 'LION', 'TIGER',
      'MOUSE', 'HORSE', 'SHEEP', 'GOAT', 'DUCK', 'FROG', 'SNAKE',
      'EAGLE', 'SHARK', 'WHALE', 'DEER', 'FOX', 'RABBIT', 'TURTLE'
    ],
    distractorWords: [
      'TREE', 'ROCK', 'BOOK', 'CHAIR', 'TABLE', 'PHONE', 'WATER',
      'FIRE', 'WIND', 'CLOUD', 'STAR', 'MOON', 'SUN', 'RAIN',
      'HOUSE', 'MUSIC', 'DANCE', 'SPORT', 'GAME', 'METAL', 'GLASS'
    ]
  },
  
  Colors: {
    name: 'Colors',
    category: 'Visual Spectrum',
    targetWords: [
      'RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK', 'WHITE', 'PINK',
      'BROWN', 'GRAY', 'ORANGE', 'PURPLE', 'GOLD', 'SILVER',
      'VIOLET', 'INDIGO', 'CORAL', 'LIME', 'NAVY', 'BEIGE'
    ],
    distractorWords: [
      'HOUSE', 'TREE', 'BOOK', 'MUSIC', 'DANCE', 'SPORT', 'GAME',
      'FOOD', 'DRINK', 'PLANT', 'STONE', 'METAL', 'WOOD',
      'CHAIR', 'TABLE', 'PHONE', 'WATER', 'FIRE', 'WIND', 'CLOUD'
    ]
  },
  
  Food: {
    name: 'Food',
    category: 'Edible Items',
    targetWords: [
      'APPLE', 'BREAD', 'CHEESE', 'FISH', 'MEAT', 'RICE', 'PASTA',
      'PIZZA', 'CAKE', 'MILK', 'WATER', 'JUICE', 'SOUP', 'SALAD',
      'BERRY', 'GRAPE', 'LEMON', 'PEACH', 'HONEY', 'BEANS', 'CORN'
    ],
    distractorWords: [
      'CHAIR', 'TABLE', 'BOOK', 'PHONE', 'MUSIC', 'DANCE', 'SPORT',
      'TREE', 'FLOWER', 'STONE', 'METAL', 'GLASS', 'PAPER',
      'HOUSE', 'WIND', 'CLOUD', 'STAR', 'MOON', 'FIRE', 'ROCK'
    ]
  },
  
  Sports: {
    name: 'Sports',
    category: 'Athletic Activities',
    targetWords: [
      'SOCCER', 'TENNIS', 'GOLF', 'SWIM', 'RUN', 'JUMP', 'BIKE',
      'SKATE', 'SURF', 'CLIMB', 'DANCE', 'YOGA', 'BOXING',
      'RUGBY', 'HOCKEY', 'TRACK', 'DIVE', 'RACE', 'THROW'
    ],
    distractorWords: [
      'BOOK', 'MUSIC', 'FOOD', 'HOUSE', 'TREE', 'FLOWER', 'WATER',
      'FIRE', 'STONE', 'METAL', 'GLASS', 'PAPER', 'CLOTH',
      'CHAIR', 'TABLE', 'PHONE', 'WIND', 'CLOUD', 'STAR', 'MOON'
    ]
  },
  
  Nature: {
    name: 'Nature',
    category: 'Natural World',
    targetWords: [
      'TREE', 'FLOWER', 'GRASS', 'ROCK', 'WATER', 'FIRE', 'WIND',
      'CLOUD', 'RAIN', 'SNOW', 'SUN', 'MOON', 'STAR', 'OCEAN',
      'RIVER', 'LAKE', 'HILL', 'BEACH', 'FOREST', 'FIELD', 'STONE'
    ],
    distractorWords: [
      'HOUSE', 'CAR', 'PHONE', 'BOOK', 'MUSIC', 'DANCE', 'SPORT',
      'FOOD', 'CHAIR', 'TABLE', 'GLASS', 'METAL', 'PAPER',
      'GAME', 'BREAD', 'CHEESE', 'PIZZA', 'CAKE', 'MILK', 'JUICE'
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
  // Use difficulty-aware selection with medium difficulty as default
  return getWordsForDifficulty(theme, 'medium', targetCount, distractorCount);
}

/**
 * Get theme statistics for analysis
 */
export function getThemeStats(theme: Theme): {
  totalTargetWords: number;
  totalDistractorWords: number;
  validTargetWords: number;
  validDistractorWords: number;
  averageTargetLength: number;
  averageDistractorLength: number;
} {
  const validTargets = filterValidWords(theme.targetWords);
  const validDistractors = filterValidWords(theme.distractorWords);
  
  const avgTargetLength = validTargets.length > 0 
    ? validTargets.reduce((sum, word) => sum + word.length, 0) / validTargets.length 
    : 0;
    
  const avgDistractorLength = validDistractors.length > 0
    ? validDistractors.reduce((sum, word) => sum + word.length, 0) / validDistractors.length
    : 0;
  
  return {
    totalTargetWords: theme.targetWords.length,
    totalDistractorWords: theme.distractorWords.length,
    validTargetWords: validTargets.length,
    validDistractorWords: validDistractors.length,
    averageTargetLength: Math.round(avgTargetLength * 10) / 10,
    averageDistractorLength: Math.round(avgDistractorLength * 10) / 10
  };
}

/**
 * Validate theme completeness
 */
export function validateTheme(theme: Theme): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check basic structure
  if (!theme.name || theme.name.trim() === '') {
    errors.push('Theme name is required');
  }
  
  if (!theme.category || theme.category.trim() === '') {
    errors.push('Theme category is required');
  }
  
  // Check word arrays
  if (!Array.isArray(theme.targetWords) || theme.targetWords.length === 0) {
    errors.push('Theme must have target words');
  }
  
  if (!Array.isArray(theme.distractorWords) || theme.distractorWords.length === 0) {
    errors.push('Theme must have distractor words');
  }
  
  // Check word validity
  const validTargets = filterValidWords(theme.targetWords);
  const validDistractors = filterValidWords(theme.distractorWords);
  
  if (validTargets.length < 5) {
    errors.push('Theme needs at least 5 valid target words');
  }
  
  if (validDistractors.length < 5) {
    errors.push('Theme needs at least 5 valid distractor words');
  }
  
  // Check for overlaps
  const targetSet = new Set(validTargets);
  const distractorSet = new Set(validDistractors);
  const overlaps = validTargets.filter(word => distractorSet.has(word));
  
  if (overlaps.length > 0) {
    errors.push(`Words appear in both target and distractor lists: ${overlaps.join(', ')}`);
  }
  
  // Warnings for potential issues
  if (validTargets.length < 10) {
    warnings.push('Consider adding more target words for variety');
  }
  
  if (validDistractors.length < 10) {
    warnings.push('Consider adding more distractor words for variety');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get random theme with validation
 */
export function getRandomValidTheme(): Theme {
  const themes = Object.values(THEME_DATABASE);
  const validThemes = themes.filter(theme => validateTheme(theme).isValid);
  
  if (validThemes.length === 0) {
    throw new Error('No valid themes available');
  }
  
  const randomTheme = validThemes[Math.floor(Math.random() * validThemes.length)];
  if (!randomTheme) {
    throw new Error('Failed to select random theme');
  }
  
  return randomTheme;
}

/**
 * Get theme by name with validation
 */
export function getValidThemeByName(name: string): Theme | null {
  const theme = THEME_DATABASE[name];
  if (!theme) {
    return null;
  }
  
  const validation = validateTheme(theme);
  return validation.isValid ? theme : null;
}

/**
 * Validate word for game use
 */
export function validateWord(word: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check length constraints
  if (word.length < 3) {
    errors.push('Word too short (minimum 3 letters)');
  }
  if (word.length > 6) {
    errors.push('Word too long (maximum 6 letters)');
  }
  
  // Check for valid characters (only letters)
  if (!/^[A-Z]+$/.test(word)) {
    errors.push('Word contains invalid characters (only A-Z allowed)');
  }
  
  // Check for repeated letters (makes placement difficult)
  const letterCounts = new Map<string, number>();
  for (const letter of word) {
    letterCounts.set(letter, (letterCounts.get(letter) || 0) + 1);
  }
  
  const maxRepeats = Math.max(...letterCounts.values());
  if (maxRepeats > 2) {
    errors.push('Word has too many repeated letters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
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

/**
 * Filter words by validation rules
 */
export function filterValidWords(words: string[]): string[] {
  return words.filter(word => validateWord(word).isValid);
}

/**
 * Remove words that share too many letters (to avoid confusion)
 */
export function filterConflictingWords(words: string[], maxSharedLetters: number = 2): string[] {
  const filtered: string[] = [];
  
  for (const word of words) {
    let hasConflict = false;
    
    for (const existingWord of filtered) {
      const sharedLetters = countSharedLetters(word, existingWord);
      if (sharedLetters > maxSharedLetters) {
        hasConflict = true;
        break;
      }
    }
    
    if (!hasConflict) {
      filtered.push(word);
    }
  }
  
  return filtered;
}

/**
 * Count shared letters between two words
 */
function countSharedLetters(word1: string, word2: string): number {
  const letters1 = new Set(word1);
  const letters2 = new Set(word2);
  
  let shared = 0;
  for (const letter of letters1) {
    if (letters2.has(letter)) {
      shared++;
    }
  }
  
  return shared;
}

/**
 * Get difficulty-appropriate word selection
 */
export function getWordsForDifficulty(
  theme: Theme,
  difficulty: 'easy' | 'medium' | 'hard',
  targetCount: number = 3,
  distractorCount: number = 2
): {
  targetWords: string[];
  distractorWords: string[];
} {
  let filteredTargets = filterValidWords(theme.targetWords);
  let filteredDistractors = filterValidWords(theme.distractorWords);
  
  // Apply difficulty-specific filtering
  switch (difficulty) {
    case 'easy':
      // Prefer shorter words for easy mode
      filteredTargets = filteredTargets.filter(word => word.length <= 5);
      filteredDistractors = filteredDistractors.filter(word => word.length <= 5);
      break;
      
    case 'medium':
      // Mix of word lengths
      break;
      
    case 'hard':
      // Allow longer, more complex words
      filteredTargets = filteredTargets.filter(word => word.length >= 4);
      break;
  }
  
  // Remove conflicting words to avoid confusion
  const allWords = [...filteredTargets, ...filteredDistractors];
  const nonConflicting = filterConflictingWords(allWords, difficulty === 'hard' ? 3 : 2);
  
  // Separate back into targets and distractors
  const finalTargets = nonConflicting.filter(word => filteredTargets.includes(word));
  const finalDistractors = nonConflicting.filter(word => filteredDistractors.includes(word));
  
  // Select random words
  const shuffledTargets = [...finalTargets].sort(() => Math.random() - 0.5);
  const shuffledDistractors = [...finalDistractors].sort(() => Math.random() - 0.5);
  
  return {
    targetWords: shuffledTargets.slice(0, targetCount),
    distractorWords: shuffledDistractors.slice(0, distractorCount)
  };
}
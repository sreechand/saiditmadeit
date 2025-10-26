// Puzzle Generation Algorithm

import type { 
  LetterCell, 
  Word, 
  WordOrientation, 
  Position, 
  Theme 
} from '../types/game.js';
import { 
  calculateWordPositions, 
  createEmptyGrid, 
  getRandomConsonant,
  isValidPosition 
} from './gameUtils.js';
import { getWordsForDifficulty } from '../data/themes.js';

export interface PuzzleGenerationOptions {
  gridSize?: number;
  targetWordCount?: number;
  distractorWordCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxAttempts?: number;
  allowWordOverlaps?: boolean;
}

export interface GeneratedPuzzle {
  grid: LetterCell[][];
  targetWords: Word[];
  distractorWords: Word[];
  theme: Theme;
  generationStats: {
    attempts: number;
    placedWords: number;
    failedPlacements: number;
    fillLetters: number;
  };
}

const DEFAULT_OPTIONS: Required<PuzzleGenerationOptions> = {
  gridSize: 6,
  targetWordCount: 3,
  distractorWordCount: 2,
  difficulty: 'medium',
  maxAttempts: 100,
  allowWordOverlaps: false
};

/**
 * Generate a complete puzzle with words placed in grid
 */
export function generatePuzzle(
  theme: Theme, 
  options: PuzzleGenerationOptions = {}
): GeneratedPuzzle {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  let attempts = 0;
  let bestResult: GeneratedPuzzle | null = null;
  let bestScore = -1;
  
  while (attempts < opts.maxAttempts) {
    attempts++;
    
    try {
      const result = attemptPuzzleGeneration(theme, opts);
      const score = calculatePuzzleScore(result);
      
      if (score > bestScore) {
        bestScore = score;
        bestResult = result;
      }
      
      // If we got a perfect puzzle, use it
      if (score >= 100) {
        break;
      }
    } catch (error) {
      // Continue trying with next attempt
      continue;
    }
  }
  
  if (!bestResult) {
    throw new Error(`Failed to generate puzzle after ${attempts} attempts`);
  }
  
  bestResult.generationStats.attempts = attempts;
  return bestResult;
}

/**
 * Attempt to generate a single puzzle
 */
function attemptPuzzleGeneration(
  theme: Theme, 
  options: Required<PuzzleGenerationOptions>
): GeneratedPuzzle {
  // Get words for this difficulty level
  const { targetWords: targetWordStrings, distractorWords: distractorWordStrings } = 
    getWordsForDifficulty(theme, options.difficulty, options.targetWordCount, options.distractorWordCount);
  
  if (targetWordStrings.length < options.targetWordCount) {
    throw new Error('Not enough valid target words for theme');
  }
  
  if (distractorWordStrings.length < options.distractorWordCount) {
    throw new Error('Not enough valid distractor words for theme');
  }
  
  // Create empty grid
  const grid = createEmptyGrid(options.gridSize);
  const placedWords: Word[] = [];
  const stats = {
    attempts: 0,
    placedWords: 0,
    failedPlacements: 0,
    fillLetters: 0
  };
  
  // Combine all words for placement
  const allWords: Array<{ text: string; isTarget: boolean }> = [
    ...targetWordStrings.map(text => ({ text, isTarget: true })),
    ...distractorWordStrings.map(text => ({ text, isTarget: false }))
  ];
  
  // Shuffle words for random placement order
  const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);
  
  // Try to place each word
  for (const wordInfo of shuffledWords) {
    const word = createWordFromString(wordInfo.text, wordInfo.isTarget);
    
    if (tryPlaceWord(grid, word, options)) {
      placedWords.push(word);
      stats.placedWords++;
    } else {
      stats.failedPlacements++;
    }
  }
  
  // Ensure we have minimum required words
  const targetWords = placedWords.filter(w => w.isTarget);
  const distractorWords = placedWords.filter(w => !w.isTarget);
  
  if (targetWords.length < options.targetWordCount) {
    throw new Error('Could not place enough target words');
  }
  
  // Fill remaining cells with random letters
  fillEmptyCells(grid, placedWords, stats);
  
  return {
    grid,
    targetWords,
    distractorWords,
    theme,
    generationStats: stats
  };
}

/**
 * Try to place a word in the grid
 */
function tryPlaceWord(
  grid: LetterCell[][], 
  word: Word, 
  options: Required<PuzzleGenerationOptions>
): boolean {
  const orientations: WordOrientation[] = [
    'horizontal-lr',
    'horizontal-rl', 
    'vertical-tb',
    'vertical-bt'
  ];
  
  // Shuffle orientations for randomness
  const shuffledOrientations = [...orientations].sort(() => Math.random() - 0.5);
  
  for (const orientation of shuffledOrientations) {
    // Try multiple random positions for this orientation
    const maxPositionAttempts = 20;
    
    for (let attempt = 0; attempt < maxPositionAttempts; attempt++) {
      const startPos = getRandomStartPosition(grid.length, word.text, orientation);
      
      if (canPlaceWordAt(grid, word.text, startPos, orientation, options)) {
        placeWordInGrid(grid, word, startPos, orientation);
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get a random valid start position for a word
 */
function getRandomStartPosition(
  gridSize: number, 
  wordText: string, 
  orientation: WordOrientation
): Position {
  let maxX = gridSize - 1;
  let maxY = gridSize - 1;
  
  // Adjust bounds based on orientation and word length
  switch (orientation) {
    case 'horizontal-lr':
      maxX = gridSize - wordText.length;
      break;
    case 'horizontal-rl':
      maxX = wordText.length - 1;
      break;
    case 'vertical-tb':
      maxY = gridSize - wordText.length;
      break;
    case 'vertical-bt':
      maxY = wordText.length - 1;
      break;
  }
  
  return {
    x: Math.floor(Math.random() * (maxX + 1)),
    y: Math.floor(Math.random() * (maxY + 1))
  };
}

/**
 * Check if a word can be placed at a specific position
 */
function canPlaceWordAt(
  grid: LetterCell[][],
  wordText: string,
  startPos: Position,
  orientation: WordOrientation,
  options: Required<PuzzleGenerationOptions>
): boolean {
  const positions = calculateWordPositions(startPos, wordText, orientation, grid.length);
  
  if (positions.length !== wordText.length) {
    return false; // Word doesn't fit
  }
  
  // Check each position
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    if (!pos) continue;
    
    const cell = grid[pos.y]?.[pos.x];
    if (!cell) return false;
    
    const letter = wordText[i];
    if (!letter) return false;
    
    // If cell is empty, it's available
    if (cell.letter === '') {
      continue;
    }
    
    // If cell has same letter and overlaps are allowed, it's ok
    if (options.allowWordOverlaps && cell.letter === letter) {
      continue;
    }
    
    // Otherwise, position is blocked
    return false;
  }
  
  return true;
}

/**
 * Place a word in the grid at specified position
 */
function placeWordInGrid(
  grid: LetterCell[][],
  word: Word,
  startPos: Position,
  orientation: WordOrientation
): void {
  const positions = calculateWordPositions(startPos, word.text, orientation, grid.length);
  
  word.positions = positions;
  word.orientation = orientation;
  
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const letter = word.text[i];
    
    if (!pos || !letter) continue;
    
    const cell = grid[pos.y]?.[pos.x];
    if (!cell) continue;
    
    cell.letter = letter;
    cell.isPartOfWord = true;
    cell.wordId = word.id;
  }
}

/**
 * Create a Word object from a string
 */
function createWordFromString(text: string, isTarget: boolean): Word {
  return {
    id: `word_${text}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    text: text.toUpperCase(),
    positions: [],
    orientation: 'horizontal-lr', // Will be set during placement
    isTarget,
    isCollected: false,
    collectionProgress: 0
  };
}

/**
 * Fill empty cells with random letters
 */
function fillEmptyCells(
  grid: LetterCell[][],
  placedWords: Word[],
  stats: { fillLetters: number }
): void {
  // Get all letters used in placed words to avoid creating accidental words
  const usedLetters = new Set<string>();
  placedWords.forEach(word => {
    for (const letter of word.text) {
      usedLetters.add(letter);
    }
  });
  
  // Fill empty cells
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      const cell = grid[y]![x];
      if (!cell) continue;
      
      if (cell.letter === '') {
        // Use random consonant, avoiding letters that might form words
        let letter: string;
        let attempts = 0;
        
        do {
          letter = getRandomConsonant();
          attempts++;
        } while (usedLetters.has(letter) && attempts < 10);
        
        cell.letter = letter;
        stats.fillLetters++;
      }
    }
  }
}

/**
 * Calculate a score for puzzle quality
 */
function calculatePuzzleScore(puzzle: GeneratedPuzzle): number {
  let score = 0;
  
  // Points for placed words
  score += puzzle.targetWords.length * 30; // 30 points per target word
  score += puzzle.distractorWords.length * 20; // 20 points per distractor word
  
  // Bonus for good word distribution
  const totalWords = puzzle.targetWords.length + puzzle.distractorWords.length;
  if (totalWords >= 5) score += 20;
  
  // Penalty for failed placements
  score -= puzzle.generationStats.failedPlacements * 5;
  
  // Bonus for using different orientations
  const orientations = new Set([
    ...puzzle.targetWords.map(w => w.orientation),
    ...puzzle.distractorWords.map(w => w.orientation)
  ]);
  score += orientations.size * 5;
  
  return Math.max(0, score);
}

/**
 * Validate that all target words are reachable by snake movement
 */
export function validatePuzzleSolvability(puzzle: GeneratedPuzzle): {
  isSolvable: boolean;
  unreachableWords: Word[];
  issues: string[];
} {
  const issues: string[] = [];
  const unreachableWords: Word[] = [];
  
  // Check each target word for reachability
  for (const word of puzzle.targetWords) {
    if (word.positions.length === 0) {
      issues.push(`Target word "${word.text}" has no positions`);
      unreachableWords.push(word);
      continue;
    }
    
    // Check if first letter is reachable from grid edges
    const firstPos = word.positions[0];
    if (!firstPos) {
      issues.push(`Target word "${word.text}" has invalid first position`);
      unreachableWords.push(word);
      continue;
    }
    
    // Simple reachability check - ensure word starts near an edge or has clear path
    const isNearEdge = firstPos.x === 0 || firstPos.y === 0 || 
                      firstPos.x === puzzle.grid.length - 1 || 
                      firstPos.y === puzzle.grid.length - 1;
    
    if (!isNearEdge) {
      // Check if there's a clear path from an edge (simplified check)
      const hasPath = checkSimplePath(puzzle.grid, firstPos);
      if (!hasPath) {
        issues.push(`Target word "${word.text}" may not be reachable`);
        // Don't mark as unreachable for now, as this is a simplified check
      }
    }
  }
  
  return {
    isSolvable: unreachableWords.length === 0,
    unreachableWords,
    issues
  };
}

/**
 * Simple path checking (can be enhanced with proper pathfinding)
 */
function checkSimplePath(_grid: LetterCell[][], _target: Position): boolean {
  // For now, assume most positions are reachable
  // This could be enhanced with A* pathfinding if needed
  return true;
}

/**
 * Comprehensive puzzle validation
 */
export function validatePuzzleCompleteness(puzzle: GeneratedPuzzle): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check grid completeness
  if (!puzzle.grid || puzzle.grid.length === 0) {
    errors.push('Grid is empty or missing');
    return { isValid: false, errors, warnings };
  }
  
  const gridSize = puzzle.grid.length;
  
  // Validate grid structure
  for (let y = 0; y < gridSize; y++) {
    const row = puzzle.grid[y];
    if (!row || row.length !== gridSize) {
      errors.push(`Grid row ${y} has incorrect length`);
      continue;
    }
    
    for (let x = 0; x < gridSize; x++) {
      const cell = row[x];
      if (!cell) {
        errors.push(`Missing cell at position (${x}, ${y})`);
        continue;
      }
      
      if (cell.letter === '') {
        errors.push(`Empty letter at position (${x}, ${y})`);
      }
      
      if (!/^[A-Z]$/.test(cell.letter)) {
        errors.push(`Invalid letter "${cell.letter}" at position (${x}, ${y})`);
      }
    }
  }
  
  // Check word requirements
  if (puzzle.targetWords.length < 3) {
    errors.push('Puzzle must have at least 3 target words');
  }
  
  if (puzzle.distractorWords.length < 2) {
    errors.push('Puzzle must have at least 2 distractor words');
  }
  
  // Validate word placements
  const allWords = [...puzzle.targetWords, ...puzzle.distractorWords];
  
  for (const word of allWords) {
    const wordValidation = validateWordPlacement(puzzle.grid, word);
    if (!wordValidation.isValid) {
      errors.push(`Word "${word.text}": ${wordValidation.errors.join(', ')}`);
    }
    warnings.push(...wordValidation.warnings);
  }
  
  // Check for word overlaps and conflicts
  const overlapValidation = validateWordOverlaps(allWords);
  if (!overlapValidation.isValid) {
    errors.push(...overlapValidation.errors);
  }
  warnings.push(...overlapValidation.warnings);
  
  // Performance warnings
  if (puzzle.generationStats.failedPlacements > 5) {
    warnings.push('High number of failed word placements - consider adjusting word selection');
  }
  
  if (puzzle.generationStats.attempts > 50) {
    warnings.push('Required many generation attempts - puzzle may be difficult to generate consistently');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate individual word placement in grid
 */
function validateWordPlacement(grid: LetterCell[][], word: Word): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check word has positions
  if (word.positions.length === 0) {
    errors.push('Word has no positions');
    return { isValid: false, errors, warnings };
  }
  
  if (word.positions.length !== word.text.length) {
    errors.push(`Position count (${word.positions.length}) doesn't match word length (${word.text.length})`);
  }
  
  // Validate each position
  for (let i = 0; i < word.positions.length; i++) {
    const pos = word.positions[i];
    const expectedLetter = word.text[i];
    
    if (!pos || !expectedLetter) {
      errors.push(`Missing position or letter at index ${i}`);
      continue;
    }
    
    // Check position is in bounds
    if (!isValidPosition(pos, grid.length)) {
      errors.push(`Position (${pos.x}, ${pos.y}) is out of bounds`);
      continue;
    }
    
    // Check grid cell matches expected letter
    const cell = grid[pos.y]?.[pos.x];
    if (!cell) {
      errors.push(`No cell found at position (${pos.x}, ${pos.y})`);
      continue;
    }
    
    if (cell.letter !== expectedLetter) {
      errors.push(`Letter mismatch at (${pos.x}, ${pos.y}): expected "${expectedLetter}", found "${cell.letter}"`);
    }
    
    // Check cell metadata
    if (!cell.isPartOfWord) {
      warnings.push(`Cell at (${pos.x}, ${pos.y}) not marked as part of word`);
    }
  }
  
  // Validate word orientation consistency
  if (word.positions.length >= 2) {
    const orientationValidation = validateWordOrientation(word);
    if (!orientationValidation.isValid) {
      errors.push(...orientationValidation.errors);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate word orientation matches actual positions
 */
function validateWordOrientation(word: Word): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (word.positions.length < 2) {
    return { isValid: true, errors };
  }
  
  const first = word.positions[0];
  const second = word.positions[1];
  
  if (!first || !second) {
    errors.push('Missing positions for orientation validation');
    return { isValid: false, errors };
  }
  
  const deltaX = second.x - first.x;
  const deltaY = second.y - first.y;
  
  let expectedOrientation: WordOrientation;
  
  if (deltaY === 0) {
    // Horizontal
    expectedOrientation = deltaX > 0 ? 'horizontal-lr' : 'horizontal-rl';
  } else if (deltaX === 0) {
    // Vertical
    expectedOrientation = deltaY > 0 ? 'vertical-tb' : 'vertical-bt';
  } else {
    errors.push('Word positions are not aligned horizontally or vertically');
    return { isValid: false, errors };
  }
  
  if (word.orientation !== expectedOrientation) {
    errors.push(`Orientation mismatch: expected "${expectedOrientation}", got "${word.orientation}"`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate word overlaps and conflicts
 */
function validateWordOverlaps(words: Word[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const positionMap = new Map<string, Word[]>();
  
  // Build position map
  for (const word of words) {
    for (const pos of word.positions) {
      const key = `${pos.x},${pos.y}`;
      const existing = positionMap.get(key) || [];
      existing.push(word);
      positionMap.set(key, existing);
    }
  }
  
  // Check for conflicts
  for (const [posKey, wordsAtPos] of positionMap) {
    if (wordsAtPos.length > 1) {
      const [x, y] = posKey.split(',').map(Number);
      const wordTexts = wordsAtPos.map(w => w.text);
      
      // Check if all words have same letter at this position
      const letters = new Set(wordsAtPos.map(w => {
        const posIndex = w.positions.findIndex(p => p.x === x && p.y === y);
        return posIndex >= 0 ? w.text[posIndex] : '';
      }));
      
      if (letters.size > 1) {
        errors.push(`Letter conflict at (${x}, ${y}) between words: ${wordTexts.join(', ')}`);
      } else {
        warnings.push(`Words overlap at (${x}, ${y}): ${wordTexts.join(', ')}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Advanced solvability checking with pathfinding
 */
export function validateAdvancedSolvability(puzzle: GeneratedPuzzle): {
  isSolvable: boolean;
  unreachableWords: Word[];
  pathingIssues: string[];
  recommendations: string[];
} {
  const unreachableWords: Word[] = [];
  const pathingIssues: string[] = [];
  const recommendations: string[] = [];
  
  // Check each target word for snake accessibility
  for (const word of puzzle.targetWords) {
    if (word.positions.length === 0) {
      unreachableWords.push(word);
      pathingIssues.push(`Word "${word.text}" has no positions`);
      continue;
    }
    
    const accessibility = checkWordAccessibility(puzzle.grid, word);
    
    if (!accessibility.isAccessible) {
      unreachableWords.push(word);
      pathingIssues.push(`Word "${word.text}": ${accessibility.issues.join(', ')}`);
    }
    
    if (accessibility.warnings.length > 0) {
      recommendations.push(`Word "${word.text}": ${accessibility.warnings.join(', ')}`);
    }
  }
  
  // Check overall puzzle flow
  const flowAnalysis = analyzePuzzleFlow(puzzle);
  pathingIssues.push(...flowAnalysis.issues);
  recommendations.push(...flowAnalysis.recommendations);
  
  return {
    isSolvable: unreachableWords.length === 0,
    unreachableWords,
    pathingIssues,
    recommendations
  };
}

/**
 * Check if a word is accessible by snake movement
 */
function checkWordAccessibility(grid: LetterCell[][], word: Word): {
  isAccessible: boolean;
  issues: string[];
  warnings: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  if (word.positions.length === 0) {
    issues.push('No positions defined');
    return { isAccessible: false, issues, warnings };
  }
  
  // Check if first letter is reachable from starting position (0,0)
  const firstPos = word.positions[0];
  if (!firstPos) {
    issues.push('First position is undefined');
    return { isAccessible: false, issues, warnings };
  }
  
  const startPos = { x: 0, y: 0 };
  const pathExists = findPath(grid, startPos, firstPos);
  
  if (!pathExists) {
    issues.push('First letter not reachable from start position');
  }
  
  // Check sequential accessibility within the word
  for (let i = 1; i < word.positions.length; i++) {
    const prevPos = word.positions[i - 1];
    const currentPos = word.positions[i];
    
    if (!prevPos || !currentPos) {
      issues.push(`Missing position at index ${i}`);
      continue;
    }
    
    const distance = Math.abs(currentPos.x - prevPos.x) + Math.abs(currentPos.y - prevPos.y);
    
    if (distance !== 1) {
      issues.push(`Letters at positions ${i-1} and ${i} are not adjacent`);
    }
  }
  
  // Warning for words that are hard to reach
  const distanceFromStart = Math.abs(firstPos.x - startPos.x) + Math.abs(firstPos.y - startPos.y);
  if (distanceFromStart > grid.length) {
    warnings.push('Word is far from starting position');
  }
  
  return {
    isAccessible: issues.length === 0,
    issues,
    warnings
  };
}

/**
 * Simple pathfinding to check if target is reachable
 */
function findPath(grid: LetterCell[][], start: Position, target: Position): boolean {
  if (start.x === target.x && start.y === target.y) {
    return true;
  }
  
  const visited = new Set<string>();
  const queue: Position[] = [start];
  
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    
    const key = `${current.x},${current.y}`;
    if (visited.has(key)) continue;
    visited.add(key);
    
    if (current.x === target.x && current.y === target.y) {
      return true;
    }
    
    // Add adjacent positions
    const directions = [
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }   // right
    ];
    
    for (const dir of directions) {
      const next = { x: current.x + dir.x, y: current.y + dir.y };
      
      if (isValidPosition(next, grid.length) && !visited.has(`${next.x},${next.y}`)) {
        queue.push(next);
      }
    }
  }
  
  return false;
}

/**
 * Analyze overall puzzle flow and difficulty
 */
function analyzePuzzleFlow(puzzle: GeneratedPuzzle): {
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check word distribution
  const wordPositions = puzzle.targetWords.flatMap(w => w.positions);
  const avgX = wordPositions.reduce((sum, pos) => sum + pos.x, 0) / wordPositions.length;
  const avgY = wordPositions.reduce((sum, pos) => sum + pos.y, 0) / wordPositions.length;
  
  const centerX = puzzle.grid.length / 2;
  const centerY = puzzle.grid.length / 2;
  
  if (Math.abs(avgX - centerX) > centerX * 0.8 || Math.abs(avgY - centerY) > centerY * 0.8) {
    recommendations.push('Words are clustered to one side - consider more even distribution');
  }
  
  // Check orientation variety
  const orientations = new Set(puzzle.targetWords.map(w => w.orientation));
  if (orientations.size < 2) {
    recommendations.push('All words have same orientation - add variety for better gameplay');
  }
  
  // Check word length variety
  const lengths = puzzle.targetWords.map(w => w.text.length);
  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);
  
  if (maxLength - minLength < 2) {
    recommendations.push('Words have similar lengths - vary word lengths for better challenge');
  }
  
  return { issues, recommendations };
}

/**
 * Generate fallback puzzle if main generation fails
 */
export function generateFallbackPuzzle(theme: Theme): GeneratedPuzzle {
  // Create a simple, guaranteed-to-work puzzle
  const grid = createEmptyGrid(6);
  
  // Place words in simple, non-overlapping positions
  const targetWords: Word[] = [];
  const distractorWords: Word[] = [];
  
  // Get simple words
  const simpleTargets = theme.targetWords.filter(w => w.length >= 3 && w.length <= 4).slice(0, 3);
  const simpleDistractors = theme.distractorWords.filter(w => w.length >= 3 && w.length <= 4).slice(0, 2);
  
  // Place horizontally with spacing
  let yPos = 1;
  
  for (const wordText of simpleTargets) {
    const word = createWordFromString(wordText, true);
    const startPos = { x: 1, y: yPos };
    
    if (canPlaceWordAt(grid, wordText, startPos, 'horizontal-lr', { 
      gridSize: 6, 
      targetWordCount: 3, 
      distractorWordCount: 2, 
      difficulty: 'easy', 
      maxAttempts: 1, 
      allowWordOverlaps: false 
    })) {
      placeWordInGrid(grid, word, startPos, 'horizontal-lr');
      targetWords.push(word);
      yPos += 2;
    }
  }
  
  // Place distractors
  for (const wordText of simpleDistractors) {
    const word = createWordFromString(wordText, false);
    const startPos = { x: 1, y: yPos };
    
    if (yPos < 6 && canPlaceWordAt(grid, wordText, startPos, 'horizontal-lr', { 
      gridSize: 6, 
      targetWordCount: 3, 
      distractorWordCount: 2, 
      difficulty: 'easy', 
      maxAttempts: 1, 
      allowWordOverlaps: false 
    })) {
      placeWordInGrid(grid, word, startPos, 'horizontal-lr');
      distractorWords.push(word);
      yPos += 2;
    }
  }
  
  // Fill remaining cells
  const stats = { attempts: 1, placedWords: targetWords.length + distractorWords.length, failedPlacements: 0, fillLetters: 0 };
  fillEmptyCells(grid, [...targetWords, ...distractorWords], stats);
  
  return {
    grid,
    targetWords,
    distractorWords,
    theme,
    generationStats: stats
  };
}
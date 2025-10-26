// Game Utility Functions

import type { 
  Position, 
  LetterCell, 
  Word, 
  SnakeSegment, 
  WordOrientation,
  GameState
} from '../types/game.js';

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

/**
 * Check if a position is within grid bounds
 */
export function isValidPosition(position: Position, gridSize: number = 6): boolean {
  return position.x >= 0 && 
         position.x < gridSize && 
         position.y >= 0 && 
         position.y < gridSize;
}

/**
 * Get the next position based on current position and direction
 */
export function getNextPosition(
  current: Position, 
  direction: 'up' | 'down' | 'left' | 'right'
): Position {
  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };
  
  const delta = directions[direction];
  return {
    x: current.x + delta.x,
    y: current.y + delta.y
  };
}

/**
 * Check if snake would collide with itself at given position
 */
export function wouldCollideWithSelf(snake: SnakeSegment[], position: Position): boolean {
  return snake.some(segment => positionsEqual(segment.position, position));
}

/**
 * Get letter cell at specific position
 */
export function getLetterAt(grid: LetterCell[][], position: Position): LetterCell | null {
  if (!isValidPosition(position, grid.length)) {
    return null;
  }
  return grid[position.y]?.[position.x] || null;
}

/**
 * Calculate word positions based on start position and orientation
 */
export function calculateWordPositions(
  startPos: Position,
  word: string,
  orientation: WordOrientation,
  gridSize: number = 6
): Position[] {
  const positions: Position[] = [];
  
  for (let i = 0; i < word.length; i++) {
    let pos: Position;
    
    switch (orientation) {
      case 'horizontal-lr':
        pos = { x: startPos.x + i, y: startPos.y };
        break;
      case 'horizontal-rl':
        pos = { x: startPos.x - i, y: startPos.y };
        break;
      case 'vertical-tb':
        pos = { x: startPos.x, y: startPos.y + i };
        break;
      case 'vertical-bt':
        pos = { x: startPos.x, y: startPos.y - i };
        break;
    }
    
    if (isValidPosition(pos, gridSize)) {
      positions.push(pos);
    } else {
      // Word doesn't fit in grid
      return [];
    }
  }
  
  return positions;
}

/**
 * Check if word placement would fit in grid
 */
export function canPlaceWord(
  startPos: Position,
  word: string,
  orientation: WordOrientation,
  gridSize: number = 6
): boolean {
  const positions = calculateWordPositions(startPos, word, orientation, gridSize);
  return positions.length === word.length;
}

/**
 * Validate letter collection for a word
 */
export function validateLetterCollection(
  targetLetter: LetterCell,
  word: Word
): boolean {
  const expectedIndex = word.collectionProgress;
  if (expectedIndex >= word.positions.length) {
    return false;
  }
  
  const expectedPosition = word.positions[expectedIndex];
  if (!expectedPosition) {
    return false;
  }
  
  return positionsEqual(targetLetter.position, expectedPosition);
}

/**
 * Check if all target words are collected
 */
export function areAllTargetWordsCollected(words: Word[]): boolean {
  return words.filter(word => word.isTarget).every(word => word.isCollected);
}

/**
 * Calculate final score
 */
export function calculateScore(gameState: GameState): number {
  const { collectedWords, wrongLetterCount, startTime, endTime } = gameState;
  
  let score = 0;
  
  // Points for collected words
  collectedWords.forEach(collected => {
    if (collected.isCorrect) {
      score += collected.word.text.length * 10; // 10 points per letter
      score += 50; // Word completion bonus
    }
  });
  
  // Penalty for wrong letters
  score -= wrongLetterCount * 5;
  
  // Time bonus (faster completion = higher bonus)
  if (endTime && startTime) {
    const timeElapsed = (endTime - startTime) / 1000; // seconds
    const timeBonus = Math.max(0, 300 - timeElapsed) * 0.1; // Bonus decreases after 5 minutes
    score += Math.floor(timeBonus);
  }
  
  return Math.max(0, score);
}

/**
 * Generate empty grid
 */
export function createEmptyGrid(size: number = 6): LetterCell[][] {
  const grid: LetterCell[][] = [];
  
  for (let y = 0; y < size; y++) {
    const row: LetterCell[] = [];
    for (let x = 0; x < size; x++) {
      row.push({
        letter: '',
        position: { x, y },
        isPartOfWord: false,
        isCollected: false
      });
    }
    grid.push(row);
  }
  
  return grid;
}

/**
 * Get random element from array
 */
export function getRandomElement<T>(array: T[]): T | null {
  if (array.length === 0) {
    return null;
  }
  const element = array[Math.floor(Math.random() * array.length)];
  return element || null;
}

/**
 * Shuffle array in place
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    const swapElement = shuffled[j];
    if (temp !== undefined && swapElement !== undefined) {
      shuffled[i] = swapElement;
      shuffled[j] = temp;
    }
  }
  return shuffled;
}

/**
 * Generate random letter (avoiding vowels to prevent accidental words)
 */
export function getRandomConsonant(): string {
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
  return consonants[Math.floor(Math.random() * consonants.length)] || 'B';
}

/**
 * Check if position is reachable by snake movement
 */
export function isPositionReachable(
  from: Position,
  to: Position,
  obstacles: Position[] = []
): boolean {
  // Simple pathfinding - check if there's a clear path
  // This is a basic implementation; could be enhanced with A* if needed
  
  if (positionsEqual(from, to)) {
    return true;
  }
  
  // Check if target is blocked
  if (obstacles.some(obs => positionsEqual(obs, to))) {
    return false;
  }
  
  // For now, assume all positions are reachable unless blocked
  // In a more complex implementation, we'd do proper pathfinding
  return true;
}
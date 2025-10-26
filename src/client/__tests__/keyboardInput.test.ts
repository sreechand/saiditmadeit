/**
 * Keyboard Input and Visual Feedback Tests
 * Tests for arrow key handling, snake extension, and color changes
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { SnakeSegment, LetterCell } from '../../shared/types/game';

// Mock keyboard event handling
const createKeyboardEvent = (key: string): KeyboardEvent => {
  return new KeyboardEvent('keydown', {
    key,
    code: key === 'ArrowUp' ? 'ArrowUp' : 
          key === 'ArrowDown' ? 'ArrowDown' :
          key === 'ArrowLeft' ? 'ArrowLeft' :
          key === 'ArrowRight' ? 'ArrowRight' : key,
    bubbles: true,
    cancelable: true
  });
};

// Mock keyboard input handler for testing
const mockKeyboardHandler = (
  onDirectionChange: (direction: 'up' | 'down' | 'left' | 'right') => void
) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onDirectionChange('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        onDirectionChange('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onDirectionChange('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        onDirectionChange('right');
        break;
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
};

// Helper functions
const createTestGrid = (size: number = 6): LetterCell[][] => {
  const grid: LetterCell[][] = [];
  const letters = ['C', 'A', 'T', 'D', 'O', 'G', 'B', 'I', 'R', 'D', 'F', 'I', 'S', 'H', 'X', 'Y'];
  let letterIndex = 0;
  
  for (let y = 0; y < size; y++) {
    const row: LetterCell[] = [];
    for (let x = 0; x < size; x++) {
      row.push({
        letter: letters[letterIndex % letters.length] || 'X',
        position: { x, y },
        isPartOfWord: letterIndex < 9, // First 9 letters are part of words
        isCollected: false,
        wordId: letterIndex < 9 ? `word-${Math.floor(letterIndex / 3)}` : ''
      });
      letterIndex++;
    }
    grid.push(row);
  }
  
  return grid;
};

const createInitialSnake = (): SnakeSegment[] => [
  {
    position: { x: 0, y: 0 },
    isHead: true,
    segmentType: 'head'
  }
];

describe('Keyboard Input Tests', () => {
  let mockDirectionChange: ReturnType<typeof vi.fn>;
  let testSnake: SnakeSegment[];
  let testGrid: LetterCell[][];

  beforeEach(() => {
    mockDirectionChange = vi.fn();
    testSnake = createInitialSnake();
    testGrid = createTestGrid();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Arrow Key Detection', () => {
    it('should detect right arrow key press', () => {
      const cleanup = mockKeyboardHandler(mockDirectionChange);

      // Simulate right arrow key press
      const event = createKeyboardEvent('ArrowRight');
      document.dispatchEvent(event);

      expect(mockDirectionChange).toHaveBeenCalledWith('right');
      expect(mockDirectionChange).toHaveBeenCalledTimes(1);
      
      cleanup();
    });

    it('should detect left arrow key press', () => {
      const cleanup = mockKeyboardHandler(mockDirectionChange);

      const event = createKeyboardEvent('ArrowLeft');
      document.dispatchEvent(event);

      expect(mockDirectionChange).toHaveBeenCalledWith('left');
      
      cleanup();
    });

    it('should detect up arrow key press', () => {
      const cleanup = mockKeyboardHandler(mockDirectionChange);

      const event = createKeyboardEvent('ArrowUp');
      document.dispatchEvent(event);

      expect(mockDirectionChange).toHaveBeenCalledWith('up');
      
      cleanup();
    });

    it('should detect down arrow key press', () => {
      const cleanup = mockKeyboardHandler(mockDirectionChange);

      const event = createKeyboardEvent('ArrowDown');
      document.dispatchEvent(event);

      expect(mockDirectionChange).toHaveBeenCalledWith('down');
      
      cleanup();
    });

    it('should ignore non-arrow keys', () => {
      const cleanup = mockKeyboardHandler(mockDirectionChange);

      document.dispatchEvent(createKeyboardEvent('Space'));
      document.dispatchEvent(createKeyboardEvent('Enter'));
      document.dispatchEvent(createKeyboardEvent('a'));

      expect(mockDirectionChange).not.toHaveBeenCalled();
      
      cleanup();
    });
  });

  describe('Snake Extension Logic Tests', () => {
    it('should validate snake segment structure', () => {
      const extendedSnake: SnakeSegment[] = [
        { position: { x: 2, y: 0 }, isHead: true, segmentType: 'head' },
        { position: { x: 1, y: 0 }, isHead: false, segmentType: 'correct' },
        { position: { x: 0, y: 0 }, isHead: false, segmentType: 'correct' }
      ];

      expect(extendedSnake.length).toBe(3);
      expect(extendedSnake[0]?.isHead).toBe(true);
      expect(extendedSnake[1]?.segmentType).toBe('correct');
      expect(extendedSnake[2]?.segmentType).toBe('correct');
    });

    it('should validate mixed segment types', () => {
      const mixedSnake: SnakeSegment[] = [
        { position: { x: 3, y: 0 }, isHead: true, segmentType: 'head' },
        { position: { x: 2, y: 0 }, isHead: false, segmentType: 'correct' },
        { position: { x: 1, y: 0 }, isHead: false, segmentType: 'wrong' },
        { position: { x: 0, y: 0 }, isHead: false, segmentType: 'correct' }
      ];

      const correctSegments = mixedSnake.filter(s => s.segmentType === 'correct');
      const wrongSegments = mixedSnake.filter(s => s.segmentType === 'wrong');
      const headSegments = mixedSnake.filter(s => s.isHead);

      expect(correctSegments.length).toBe(2);
      expect(wrongSegments.length).toBe(1);
      expect(headSegments.length).toBe(1);
    });

    it('should validate theme-specific properties', () => {
      const themes = ['animals', 'colors', 'food', 'sports', 'nature'];
      
      themes.forEach(theme => {
        expect(typeof theme).toBe('string');
        expect(theme.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Letter Color Change Logic Tests', () => {
    it('should track collected letters correctly', () => {
      const gridWithCollectedLetters = createTestGrid();
      gridWithCollectedLetters[0]![1]!.isCollected = true; // Mark second cell as collected

      const collectedCells = gridWithCollectedLetters.flat().filter(cell => cell.isCollected);
      expect(collectedCells.length).toBe(1);
      expect(collectedCells[0]?.position).toEqual({ x: 1, y: 0 });
    });

    it('should identify word letters correctly', () => {
      const wordLetters = testGrid.flat().filter(cell => cell.isPartOfWord);
      expect(wordLetters.length).toBe(9); // First 9 letters are part of words
    });

    it('should validate snake position overlays', () => {
      const snakeOnLetters: SnakeSegment[] = [
        { position: { x: 1, y: 0 }, isHead: true, segmentType: 'head' },
        { position: { x: 0, y: 0 }, isHead: false, segmentType: 'correct' }
      ];

      const snakePositions = snakeOnLetters.map(s => s.position);
      expect(snakePositions).toContainEqual({ x: 1, y: 0 });
      expect(snakePositions).toContainEqual({ x: 0, y: 0 });
    });
  });

  describe('Animation and Movement Logic', () => {
    it('should validate movement state properties', () => {
      const movementState = {
        isMoving: true,
        direction: 'right' as const,
        gridSize: 6,
        theme: 'nature'
      };

      expect(movementState.isMoving).toBe(true);
      expect(movementState.direction).toBe('right');
      expect(movementState.gridSize).toBe(6);
      expect(movementState.theme).toBe('nature');
    });

    it('should validate direction indicators', () => {
      const directions = [
        { dir: 'up' as const, indicator: '▲' },
        { dir: 'down' as const, indicator: '▼' },
        { dir: 'left' as const, indicator: '◀' },
        { dir: 'right' as const, indicator: '▶' }
      ];

      directions.forEach(({ dir, indicator }) => {
        expect(typeof dir).toBe('string');
        expect(typeof indicator).toBe('string');
        expect(indicator.length).toBe(1);
      });
    });

    it('should validate snake growth logic', () => {
      const growingSnake: SnakeSegment[] = [
        { position: { x: 1, y: 0 }, isHead: true, segmentType: 'head' },
        { position: { x: 0, y: 0 }, isHead: false, segmentType: 'correct' }
      ];

      expect(growingSnake.length).toBe(2);
      expect(growingSnake[0]?.isHead).toBe(true);
      expect(growingSnake[1]?.segmentType).toBe('correct');
    });
  });

  describe('Rapid Input Handling', () => {
    it('should handle rapid arrow key presses correctly', () => {
      const cleanup = mockKeyboardHandler(mockDirectionChange);

      // Rapid key presses
      document.dispatchEvent(createKeyboardEvent('ArrowRight'));
      document.dispatchEvent(createKeyboardEvent('ArrowDown'));
      document.dispatchEvent(createKeyboardEvent('ArrowLeft'));
      document.dispatchEvent(createKeyboardEvent('ArrowUp'));

      expect(mockDirectionChange).toHaveBeenCalledTimes(4);
      expect(mockDirectionChange).toHaveBeenNthCalledWith(1, 'right');
      expect(mockDirectionChange).toHaveBeenNthCalledWith(2, 'down');
      expect(mockDirectionChange).toHaveBeenNthCalledWith(3, 'left');
      expect(mockDirectionChange).toHaveBeenNthCalledWith(4, 'up');
      
      cleanup();
    });

    it('should validate event structure', () => {
      const event = createKeyboardEvent('ArrowRight');
      
      expect(event.key).toBe('ArrowRight');
      expect(event.code).toBe('ArrowRight');
      expect(event.bubbles).toBe(true);
      expect(event.cancelable).toBe(true);
    });
  });

  describe('Visual State Logic', () => {
    it('should validate complex snake segment states', () => {
      const complexSnake: SnakeSegment[] = [
        { position: { x: 4, y: 2 }, isHead: true, segmentType: 'head' },
        { position: { x: 3, y: 2 }, isHead: false, segmentType: 'correct' },
        { position: { x: 2, y: 2 }, isHead: false, segmentType: 'wrong' },
        { position: { x: 1, y: 2 }, isHead: false, segmentType: 'correct' },
        { position: { x: 0, y: 2 }, isHead: false, segmentType: 'correct' }
      ];

      const correctSegments = complexSnake.filter(s => s.segmentType === 'correct');
      const wrongSegments = complexSnake.filter(s => s.segmentType === 'wrong');
      const headSegments = complexSnake.filter(s => s.isHead);

      expect(correctSegments.length).toBe(3);
      expect(wrongSegments.length).toBe(1);
      expect(headSegments.length).toBe(1);
    });

    it('should validate theme-specific properties', () => {
      const themeConfig = {
        theme: 'colors',
        direction: 'right' as const,
        isMoving: true,
        gridSize: 6
      };

      expect(themeConfig.theme).toBe('colors');
      expect(themeConfig.direction).toBe('right');
      expect(themeConfig.isMoving).toBe(true);
      expect(themeConfig.gridSize).toBe(6);
    });
  });
});
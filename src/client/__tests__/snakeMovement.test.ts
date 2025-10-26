/**
 * Snake Movement Test Cases
 * Tests for arrow key movement, snake extension, and letter color changes
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSnake } from '../hooks/useSnake';
import { useGameState, GameProvider } from '../hooks/useGameState';
import type { GameState, LetterCell, SnakeSegment, Position } from '../../shared/types/game';
import { getNextPosition, isValidPosition } from '../../shared/utils/gameUtils';
import React from 'react';

// Mock performance.now for consistent timing
const mockPerformanceNow = vi.fn();
Object.defineProperty(global, 'performance', {
  value: { now: mockPerformanceNow },
  writable: true
});

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();
Object.defineProperty(global, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
  writable: true
});
Object.defineProperty(global, 'cancelAnimationFrame', {
  value: mockCancelAnimationFrame,
  writable: true
});

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(GameProvider, {}, children);
};

// Helper function to create test grid with letters
const createTestGrid = (size: number = 6): LetterCell[][] => {
  const grid: LetterCell[][] = [];
  const letters = ['C', 'A', 'T', 'D', 'O', 'G', 'B', 'I', 'R', 'D', 'F', 'I', 'S', 'H', 'X', 'Y', 'Z', 'Q'];
  let letterIndex = 0;
  
  for (let y = 0; y < size; y++) {
    const row: LetterCell[] = [];
    for (let x = 0; x < size; x++) {
      row.push({
        letter: letters[letterIndex % letters.length] || 'X',
        position: { x, y },
        isPartOfWord: letterIndex < 12, // First 12 letters are part of words
        isCollected: false,
        wordId: letterIndex < 12 ? `word-${Math.floor(letterIndex / 3)}` : undefined
      });
      letterIndex++;
    }
    grid.push(row);
  }
  
  return grid;
};

// Helper function to create initial snake
const createInitialSnake = (): SnakeSegment[] => [
  {
    position: { x: 0, y: 0 },
    isHead: true,
    segmentType: 'head'
  }
];

describe('Snake Movement Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformanceNow.mockReturnValue(0);
    mockRequestAnimationFrame.mockImplementation((callback) => {
      setTimeout(callback, 16); // Simulate 60fps
      return 1;
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Arrow Key Movement', () => {
    it('should move snake right when right arrow is pressed', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      // Initialize game with test data
      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
      });

      const initialPosition = result.current.gameState.gameState.snake[0]?.position;
      expect(initialPosition).toEqual({ x: 0, y: 0 });

      // Simulate right arrow key press
      act(() => {
        result.current.snake.changeDirection('right');
      });

      // Check that snake moved right
      const newPosition = result.current.gameState.gameState.snake[0]?.position;
      expect(newPosition).toEqual({ x: 1, y: 0 });
      expect(result.current.gameState.gameState.snakeDirection).toBe('right');
    });

    it('should move snake left when left arrow is pressed', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      // Initialize with snake at position (2, 0) to allow left movement
      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
        
        // Move snake to position (2, 0)
        result.current.gameState.dispatch({
          type: 'UPDATE_SNAKE',
          snake: [{ position: { x: 2, y: 0 }, isHead: true, segmentType: 'head' }]
        });
      });

      // Simulate left arrow key press
      act(() => {
        result.current.snake.changeDirection('left');
      });

      // Check that snake moved left
      const newPosition = result.current.gameState.gameState.snake[0]?.position;
      expect(newPosition).toEqual({ x: 1, y: 0 });
      expect(result.current.gameState.gameState.snakeDirection).toBe('left');
    });

    it('should move snake up when up arrow is pressed', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      // Initialize with snake at position (0, 2) to allow up movement
      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
        
        result.current.gameState.dispatch({
          type: 'UPDATE_SNAKE',
          snake: [{ position: { x: 0, y: 2 }, isHead: true, segmentType: 'head' }]
        });
      });

      // Simulate up arrow key press
      act(() => {
        result.current.snake.changeDirection('up');
      });

      // Check that snake moved up
      const newPosition = result.current.gameState.gameState.snake[0]?.position;
      expect(newPosition).toEqual({ x: 0, y: 1 });
      expect(result.current.gameState.gameState.snakeDirection).toBe('up');
    });

    it('should move snake down when down arrow is pressed', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
      });

      // Simulate down arrow key press
      act(() => {
        result.current.snake.changeDirection('down');
      });

      // Check that snake moved down
      const newPosition = result.current.gameState.gameState.snake[0]?.position;
      expect(newPosition).toEqual({ x: 0, y: 1 });
      expect(result.current.gameState.gameState.snakeDirection).toBe('down');
    });
  });

  describe('Snake Extension and Letter Collection', () => {
    it('should extend snake when collecting a letter', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
      });

      const initialLength = result.current.gameState.gameState.snake.length;
      expect(initialLength).toBe(1);

      // Move snake to a letter position and collect it
      act(() => {
        result.current.snake.changeDirection('right');
      });

      // Simulate letter collection by growing snake
      act(() => {
        const newSnake = result.current.snake.growSnake({ x: 1, y: 0 }, 'correct');
        result.current.gameState.dispatch({
          type: 'UPDATE_SNAKE',
          snake: newSnake
        });
      });

      // Check that snake grew
      const newLength = result.current.gameState.gameState.snake.length;
      expect(newLength).toBe(2);
      
      // Check that new segment has correct type
      const newSegment = result.current.gameState.gameState.snake[1];
      expect(newSegment?.segmentType).toBe('correct');
    });

    it('should change letter color to green when collecting correct letter', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
      });

      // Simulate collecting a correct letter
      act(() => {
        const newSnake = result.current.snake.growSnake({ x: 1, y: 0 }, 'correct');
        result.current.gameState.dispatch({
          type: 'UPDATE_SNAKE',
          snake: newSnake
        });
      });

      // Check that the new segment has 'correct' type (which should render as green)
      const correctSegment = result.current.gameState.gameState.snake.find(s => s.segmentType === 'correct');
      expect(correctSegment).toBeDefined();
      expect(correctSegment?.segmentType).toBe('correct');
    });

    it('should change letter color to red when collecting wrong letter', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
      });

      // Simulate collecting a wrong letter
      act(() => {
        const newSnake = result.current.snake.growSnake({ x: 1, y: 0 }, 'wrong');
        result.current.gameState.dispatch({
          type: 'UPDATE_SNAKE',
          snake: newSnake
        });
      });

      // Check that the new segment has 'wrong' type (which should render as red)
      const wrongSegment = result.current.gameState.gameState.snake.find(s => s.segmentType === 'wrong');
      expect(wrongSegment).toBeDefined();
      expect(wrongSegment?.segmentType).toBe('wrong');
    });
  });

  describe('Movement Validation', () => {
    it('should prevent moving backwards into snake body', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      // Create a snake with multiple segments
      const multiSegmentSnake: SnakeSegment[] = [
        { position: { x: 2, y: 0 }, isHead: true, segmentType: 'head' },
        { position: { x: 1, y: 0 }, isHead: false, segmentType: 'correct' },
        { position: { x: 0, y: 0 }, isHead: false, segmentType: 'correct' }
      ];

      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
        
        result.current.gameState.dispatch({
          type: 'UPDATE_SNAKE',
          snake: multiSegmentSnake
        });
      });

      const initialPosition = result.current.gameState.gameState.snake[0]?.position;
      expect(initialPosition).toEqual({ x: 2, y: 0 });

      // Try to move left (backwards into body)
      act(() => {
        result.current.snake.changeDirection('left');
      });

      // Snake should not have moved backwards
      const finalPosition = result.current.gameState.gameState.snake[0]?.position;
      expect(finalPosition).toEqual({ x: 2, y: 0 }); // Should remain in same position
    });

    it('should stop snake at grid boundaries', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      // Position snake at right edge
      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
        
        result.current.gameState.dispatch({
          type: 'UPDATE_SNAKE',
          snake: [{ position: { x: 5, y: 0 }, isHead: true, segmentType: 'head' }]
        });
      });

      // Try to move right (out of bounds)
      act(() => {
        result.current.snake.changeDirection('right');
      });

      // Snake should be stopped due to boundary collision
      expect(result.current.gameState.gameState.isSnakeStopped).toBe(true);
    });
  });

  describe('Direction Change Validation', () => {
    it('should update snake direction immediately on arrow key press', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
      });

      expect(result.current.gameState.gameState.snakeDirection).toBe('right');

      // Change direction to down
      act(() => {
        result.current.snake.changeDirection('down');
      });

      expect(result.current.gameState.gameState.snakeDirection).toBe('down');

      // Change direction to left
      act(() => {
        result.current.snake.changeDirection('left');
      });

      expect(result.current.gameState.gameState.snakeDirection).toBe('left');
    });

    it('should handle rapid direction changes correctly', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
      });

      // Rapid direction changes
      act(() => {
        result.current.snake.changeDirection('down');
        result.current.snake.changeDirection('left');
        result.current.snake.changeDirection('up');
      });

      // Should end up with the last direction
      expect(result.current.gameState.gameState.snakeDirection).toBe('up');
    });
  });

  describe('Snake Movement Animation', () => {
    it('should trigger movement animation when snake moves', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
      });

      // Start movement
      act(() => {
        result.current.snake.startMovement();
      });

      // Check that requestAnimationFrame was called (indicating animation started)
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it('should stop movement animation when snake is stopped', async () => {
      const { result } = renderHook(() => {
        const gameState = useGameState();
        const snake = useSnake();
        return { gameState, snake };
      }, { wrapper: TestWrapper });

      act(() => {
        result.current.gameState.initializeGame({
          grid: createTestGrid(),
          targetWords: [],
          distractorWords: [],
          theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
          difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
        });
      });

      // Start then stop movement
      act(() => {
        result.current.snake.startMovement();
        result.current.snake.stopMovement();
      });

      // Check that cancelAnimationFrame was called
      expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Game Utility Functions', () => {
    it('should calculate next position correctly for all directions', () => {
      const startPos: Position = { x: 2, y: 2 };

      expect(getNextPosition(startPos, 'up')).toEqual({ x: 2, y: 1 });
      expect(getNextPosition(startPos, 'down')).toEqual({ x: 2, y: 3 });
      expect(getNextPosition(startPos, 'left')).toEqual({ x: 1, y: 2 });
      expect(getNextPosition(startPos, 'right')).toEqual({ x: 3, y: 2 });
    });

    it('should validate positions correctly', () => {
      expect(isValidPosition({ x: 0, y: 0 }, 6)).toBe(true);
      expect(isValidPosition({ x: 5, y: 5 }, 6)).toBe(true);
      expect(isValidPosition({ x: -1, y: 0 }, 6)).toBe(false);
      expect(isValidPosition({ x: 6, y: 0 }, 6)).toBe(false);
      expect(isValidPosition({ x: 0, y: -1 }, 6)).toBe(false);
      expect(isValidPosition({ x: 0, y: 6 }, 6)).toBe(false);
    });
  });
});

describe('Integration Tests - Full Movement Scenarios', () => {
  it('should complete a full movement sequence with letter collection', async () => {
    const { result } = renderHook(() => {
      const gameState = useGameState();
      const snake = useSnake();
      return { gameState, snake };
    }, { wrapper: TestWrapper });

    act(() => {
      result.current.gameState.initializeGame({
        grid: createTestGrid(),
        targetWords: [],
        distractorWords: [],
        theme: { name: 'Test', category: 'Test', targetWords: [], distractorWords: [] },
        difficulty: { level: 'medium', showWords: false, showWordBlanks: true, snakeSpeed: 2, allowSharedLetters: false }
      });
    });

    // Sequence: Right -> Down -> Right -> Collect Letter
    act(() => {
      result.current.snake.changeDirection('right');
    });
    
    let position = result.current.gameState.gameState.snake[0]?.position;
    expect(position).toEqual({ x: 1, y: 0 });

    act(() => {
      result.current.snake.changeDirection('down');
    });
    
    position = result.current.gameState.gameState.snake[0]?.position;
    expect(position).toEqual({ x: 1, y: 1 });

    act(() => {
      result.current.snake.changeDirection('right');
    });
    
    position = result.current.gameState.gameState.snake[0]?.position;
    expect(position).toEqual({ x: 2, y: 1 });

    // Simulate letter collection
    act(() => {
      const newSnake = result.current.snake.growSnake({ x: 2, y: 1 }, 'correct');
      result.current.gameState.dispatch({
        type: 'UPDATE_SNAKE',
        snake: newSnake
      });
    });

    // Verify final state
    expect(result.current.gameState.gameState.snake.length).toBe(2);
    expect(result.current.gameState.gameState.snake[0]?.position).toEqual({ x: 2, y: 1 });
    expect(result.current.gameState.gameState.snake[1]?.segmentType).toBe('correct');
  });
});
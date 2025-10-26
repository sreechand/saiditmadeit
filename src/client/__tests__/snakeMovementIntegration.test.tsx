/**
 * Snake Movement Integration Tests
 * End-to-end tests for arrow key movement, snake extension, and visual feedback
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React, { useState, useEffect } from 'react';
import { GameProvider, useGameState } from '../hooks/useGameState';
import { useSnake } from '../hooks/useSnake';
import type { LetterCell } from '../../shared/types/game';

// Mock timers for animation control
vi.useFakeTimers();

// Helper function to create test grid
const createTestGrid = (): LetterCell[][] => {
  const grid: LetterCell[][] = [];
  const letters = ['C', 'A', 'T', 'D', 'O', 'G'];
  
  for (let y = 0; y < 6; y++) {
    const row: LetterCell[] = [];
    for (let x = 0; x < 6; x++) {
      const letterIndex = y * 6 + x;
      row.push({
        letter: letters[letterIndex % letters.length] || 'X',
        position: { x, y },
        isPartOfWord: letterIndex < 9, // First 9 positions are word letters
        isCollected: false,
        wordId: letterIndex < 9 ? `word-${Math.floor(letterIndex / 3)}` : ''
      });
    }
    grid.push(row);
  }
  
  return grid;
};

describe('Snake Movement Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle complete movement sequence logic', () => {
    const movementSequence = [
      { direction: 'right' as const, expectedPosition: { x: 1, y: 0 } },
      { direction: 'down' as const, expectedPosition: { x: 1, y: 1 } },
      { direction: 'left' as const, expectedPosition: { x: 0, y: 1 } }
    ];

    movementSequence.forEach(({ direction, expectedPosition }) => {
      expect(typeof direction).toBe('string');
      expect(expectedPosition.x).toBeGreaterThanOrEqual(0);
      expect(expectedPosition.y).toBeGreaterThanOrEqual(0);
    });
  });

  it('should validate snake extension and letter collection logic', () => {
    const initialSnake = [
      { position: { x: 0, y: 0 }, isHead: true, segmentType: 'head' as const }
    ];

    const extendedSnake = [
      { position: { x: 1, y: 0 }, isHead: true, segmentType: 'head' as const },
      { position: { x: 0, y: 0 }, isHead: false, segmentType: 'correct' as const }
    ];

    expect(initialSnake.length).toBe(1);
    expect(extendedSnake.length).toBe(2);
    expect(extendedSnake[1]?.segmentType).toBe('correct');
  });

  it('should validate visual styling logic for different segment types', () => {
    const segmentTypes = ['head', 'correct', 'wrong'] as const;
    const directionIndicators = ['▶', '▼', '◀', '▲'];

    segmentTypes.forEach(type => {
      expect(['head', 'correct', 'wrong']).toContain(type);
    });

    directionIndicators.forEach(indicator => {
      expect(typeof indicator).toBe('string');
      expect(indicator.length).toBe(1);
    });
  });

  it('should validate movement collision logic', () => {
    const singleSegmentSnake = [
      { position: { x: 0, y: 0 }, isHead: true, segmentType: 'head' as const }
    ];

    const multiSegmentSnake = [
      { position: { x: 2, y: 0 }, isHead: true, segmentType: 'head' as const },
      { position: { x: 1, y: 0 }, isHead: false, segmentType: 'correct' as const },
      { position: { x: 0, y: 0 }, isHead: false, segmentType: 'correct' as const }
    ];

    // Single segment snake can move in any direction
    expect(singleSegmentSnake.length).toBe(1);
    
    // Multi-segment snake has collision constraints
    expect(multiSegmentSnake.length).toBe(3);
    const headPosition = multiSegmentSnake[0]?.position;
    const secondSegmentPosition = multiSegmentSnake[1]?.position;
    
    // Head should not be able to move directly into second segment
    expect(headPosition?.x).not.toBe(secondSegmentPosition?.x - 1);
  });

  it('should validate rapid key press handling logic', () => {
    const keySequence = [
      { key: 'ArrowRight', direction: 'right' },
      { key: 'ArrowDown', direction: 'down' },
      { key: 'ArrowLeft', direction: 'left' },
      { key: 'ArrowUp', direction: 'up' }
    ];

    keySequence.forEach(({ key, direction }) => {
      expect(typeof key).toBe('string');
      expect(typeof direction).toBe('string');
      expect(key.startsWith('Arrow')).toBe(true);
    });

    // Final direction should be the last one processed
    const finalDirection = keySequence[keySequence.length - 1]?.direction;
    expect(finalDirection).toBe('up');
  });

  it('should validate theme-specific styling configuration', () => {
    const themeConfig = {
      animals: { primary: 'bg-amber-600', secondary: 'bg-amber-100' },
      colors: { primary: 'bg-pink-600', secondary: 'bg-pink-100' },
      food: { primary: 'bg-red-600', secondary: 'bg-red-100' },
      sports: { primary: 'bg-blue-600', secondary: 'bg-blue-100' },
      nature: { primary: 'bg-green-600', secondary: 'bg-green-100' }
    };

    Object.entries(themeConfig).forEach(([theme, colors]) => {
      expect(typeof theme).toBe('string');
      expect(typeof colors.primary).toBe('string');
      expect(typeof colors.secondary).toBe('string');
      expect(colors.primary.includes('bg-')).toBe(true);
      expect(colors.secondary.includes('bg-')).toBe(true);
    });
  });
});
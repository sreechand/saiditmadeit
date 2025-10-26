import { useCallback } from 'react';
import type { Position, SnakeSegment, Word } from '../../shared/types/game.js';
import { getNextPosition, isValidPosition, positionsEqual } from '../../shared/utils/gameUtils.js';
import { useGameState } from './useGameState.js';

export const useSnake = () => {
  const { gameState, dispatch } = useGameState();

  /**
   * Move snake in a direction when user presses arrow key
   * This immediately moves the snake one cell in the given direction
   */
  const moveSnake = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const currentSnake = gameState.snake;

    if (currentSnake.length === 0) {
      console.log('No snake to move');
      return;
    }

    const currentHead = currentSnake[0];
    const nextPosition = getNextPosition(currentHead.position, direction);

    console.log('moveSnake:', direction, 'from', currentHead.position, 'to', nextPosition);

    // Check if position is valid (within grid bounds)
    if (!isValidPosition(nextPosition, gameState.gridSize)) {
      console.log('Invalid position - out of bounds');
      return;
    }

    // Check if snake would collide with itself
    const bodySegments = currentSnake.slice(1);
    if (bodySegments.some(segment => segment.position.x === nextPosition.x && segment.position.y === nextPosition.y)) {
      console.log('Invalid position - collision with self');
      return;
    }

    // Create new snake with head at new position
    // Don't remove the tail - let the snake grow with each movement
    const newSnake: SnakeSegment[] = [
      {
        position: nextPosition,
        isHead: true,
        segmentType: 'head'
      },
      ...currentSnake.map(segment => ({
        ...segment,
        isHead: false
      }))
    ];

    console.log('New snake:', newSnake.map(s => ({ x: s.position.x, y: s.position.y, isHead: s.isHead })));

    // Update the snake in game state
    dispatch({
      type: 'MOVE_SNAKE_TO_POSITION',
      snake: newSnake,
      isSnakeStopped: false
    });

    // Update direction
    dispatch({
      type: 'MOVE',
      direction
    });

    // Check which words the snake has passed through and update their status
    checkAndUpdateWords(nextPosition, newSnake);
  }, [gameState.snake, gameState.gridSize, dispatch]);

  /**
   * Check if the snake has passed through any complete words
   * If a word is complete, highlight it as valid or invalid
   */
  const checkAndUpdateWords = useCallback((
    newHeadPosition: Position,
    newSnake: SnakeSegment[]
  ) => {
    const allWords = [...gameState.targetWords, ...gameState.distractorWords];

    // Get all positions currently occupied by the snake
    const snakePositions = newSnake.map(s => s.position);

    // Check each word to see if all its positions are covered by the snake
    allWords.forEach(word => {
      const wordPositions = word.positions;
      const isWordComplete = wordPositions.every(wordPos =>
        snakePositions.some(snakePos => positionsEqual(snakePos, wordPos))
      );

      if (isWordComplete && !word.isCollected) {
        console.log('Word found:', word.text);
        // Mark the word as collected
        const updatedWord = { ...word, isCollected: true };

        dispatch({
          type: 'COMPLETE_WORD',
          word: updatedWord,
          isTargetWord: word.isTarget
        });
      }
    });
  }, [gameState.targetWords, gameState.distractorWords, dispatch]);

  /**
   * Grow snake when collecting a letter
   */
  const growSnake = useCallback((
    newHeadPosition: Position,
    segmentType: 'correct' | 'wrong'
  ) => {
    const currentSnake = gameState.snake;

    const newSnake: SnakeSegment[] = [
      {
        position: newHeadPosition,
        isHead: true,
        segmentType: 'head'
      },
      {
        position: currentSnake[0].position,
        isHead: false,
        segmentType: segmentType
      },
      ...currentSnake.slice(1)
    ];

    return newSnake;
  }, [gameState.snake]);

  return {
    moveSnake,
    growSnake
  };
};

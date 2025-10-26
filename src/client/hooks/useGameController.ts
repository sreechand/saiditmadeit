import { useCallback, useEffect } from 'react';
import { useGameState } from './useGameState.js';
import { useSnake } from './useSnake.js';
import { useWordCollection } from './useWordCollection.js';
import type { Position } from '../../shared/types/game.js';
import { getLetterAt } from '../../shared/utils/gameUtils.js';

/**
 * Main game controller that coordinates snake movement, word collection, and game flow
 */
export const useGameController = () => {
  const { gameState, dispatch } = useGameState();
  const { 
    changeDirection, 
    continueMovement, 
    resetSnake,
    startMovement,
    stopMovement
  } = useSnake();
  const { collectLetter } = useWordCollection();

  // Handle letter collection when snake stops at a letter
  const handleLetterCollection = useCallback((position: Position) => {
    const letterCell = getLetterAt(gameState.grid, position);
    
    if (letterCell && !letterCell.isCollected) {
      // Collect the letter using the word collection system
      collectLetter(position);
      
      // After processing the letter, continue snake movement
      setTimeout(() => {
        continueMovement();
      }, 100); // Small delay for visual feedback
    }
  }, [gameState.grid, collectLetter, continueMovement]);

  // Handle keyboard input for snake movement
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState.gameStatus !== 'playing' || gameState.isPaused) {
      return;
    }

    // Prevent default behavior for game keys
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
    if (gameKeys.includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        changeDirection('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        changeDirection('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        changeDirection('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        changeDirection('right');
        break;
      case ' ': // Spacebar for pause/resume
        event.preventDefault();
        if (gameState.isPaused) {
          dispatch({ type: 'RESUME' });
        } else {
          dispatch({ type: 'PAUSE' });
        }
        break;
      case 'r':
      case 'R':
        // Reset game
        resetSnake();
        break;
    }
  }, [gameState.gameStatus, gameState.isPaused, changeDirection, dispatch, resetSnake]);

  // Handle touch/swipe input for mobile
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (gameState.gameStatus !== 'playing' || gameState.isPaused) {
      return;
    }

    const touch = event.touches[0];
    if (touch) {
      // Store initial touch position for swipe detection
      (event.target as any)._touchStartX = touch.clientX;
      (event.target as any)._touchStartY = touch.clientY;
    }
  }, [gameState.gameStatus, gameState.isPaused]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (gameState.gameStatus !== 'playing' || gameState.isPaused) {
      return;
    }

    const touch = event.changedTouches[0];
    const target = event.target as any;
    
    if (touch && target._touchStartX !== undefined && target._touchStartY !== undefined) {
      const deltaX = touch.clientX - target._touchStartX;
      const deltaY = touch.clientY - target._touchStartY;
      const minSwipeDistance = 30;

      // Determine swipe direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          changeDirection(deltaX > 0 ? 'right' : 'left');
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          changeDirection(deltaY > 0 ? 'down' : 'up');
        }
      }

      // Clean up touch data
      delete target._touchStartX;
      delete target._touchStartY;
    }
  }, [gameState.gameStatus, gameState.isPaused, changeDirection]);

  // Set up event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleKeyPress, handleTouchStart, handleTouchEnd]);

  // Handle letter collection when snake stops
  useEffect(() => {
    if (gameState.isSnakeStopped && gameState.snake.length > 0) {
      const headPosition = gameState.snake[0]?.position;
      if (headPosition) {
        handleLetterCollection(headPosition);
      }
    }
  }, [gameState.isSnakeStopped, gameState.snake, handleLetterCollection]);

  // Auto-start movement when game begins
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && 
        !gameState.isPaused && 
        !gameState.isSnakeStopped &&
        gameState.targetWords.length > 0) {
      startMovement();
    } else {
      stopMovement();
    }
  }, [
    gameState.gameStatus, 
    gameState.isPaused, 
    gameState.isSnakeStopped,
    gameState.targetWords.length,
    startMovement,
    stopMovement
  ]);

  return {
    // Game state
    gameState,
    
    // Control methods
    changeDirection,
    pauseGame: () => dispatch({ type: 'PAUSE' }),
    resumeGame: () => dispatch({ type: 'RESUME' }),
    resetGame: resetSnake,
    
    // Input handlers (for manual binding if needed)
    handleKeyPress,
    handleTouchStart,
    handleTouchEnd
  };
};
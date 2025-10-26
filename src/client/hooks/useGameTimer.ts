import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameState } from './useGameState.js';

/**
 * Game timer hook that provides frame-rate independent timing system
 * Handles game loop timing, pause/resume functionality, and configurable speeds
 */
export const useGameTimer = () => {
  const { gameState } = useGameState();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  
  // Timer references
  const gameLoopRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const totalPausedTimeRef = useRef<number>(0);
  
  // Calculate movement interval based on difficulty
  const getMovementInterval = useCallback(() => {
    return 1000 / gameState.difficulty.snakeSpeed; // Convert cells per second to milliseconds
  }, [gameState.difficulty.snakeSpeed]);

  // Get current game time (excluding paused time)
  const getCurrentGameTime = useCallback(() => {
    if (gameState.gameStatus === 'playing') {
      return Date.now() - gameState.startTime - totalPausedTimeRef.current;
    } else if (gameState.gameStatus === 'paused') {
      return pausedTimeRef.current - gameState.startTime - totalPausedTimeRef.current;
    } else if (gameState.endTime) {
      return gameState.endTime - gameState.startTime - totalPausedTimeRef.current;
    }
    return 0;
  }, [gameState.gameStatus, gameState.startTime, gameState.endTime]);

  // Start the game timer
  const startTimer = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    const gameLoop = (currentTime: number) => {
      // Update elapsed time since last frame
      if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = currentTime;
      }
      
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // Update game time (only when playing)
      if (gameState.gameStatus === 'playing') {
        const currentGameTime = getCurrentGameTime();
        setGameTime(currentGameTime);
        setElapsedTime(deltaTime);
      }

      // Continue the loop if game is active
      if (gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused') {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.gameStatus, getCurrentGameTime]);

  // Stop the game timer
  const stopTimer = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    lastFrameTimeRef.current = 0;
  }, []);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (gameState.gameStatus === 'playing') {
      pausedTimeRef.current = Date.now();
    }
  }, [gameState.gameStatus]);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    if (gameState.gameStatus === 'paused' && pausedTimeRef.current > 0) {
      const pauseDuration = Date.now() - pausedTimeRef.current;
      totalPausedTimeRef.current += pauseDuration;
      pausedTimeRef.current = 0;
    }
  }, [gameState.gameStatus]);

  // Reset timer state
  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsedTime(0);
    setGameTime(0);
    pausedTimeRef.current = 0;
    totalPausedTimeRef.current = 0;
  }, [stopTimer]);

  // Handle game state changes
  useEffect(() => {
    switch (gameState.gameStatus) {
      case 'playing':
        if (gameState.isPaused) {
          // Game is playing but paused
          pauseTimer();
        } else {
          // Game is actively playing
          resumeTimer();
          startTimer();
        }
        break;
      case 'paused':
        pauseTimer();
        break;
      case 'won':
      case 'lost':
        stopTimer();
        break;
      default:
        break;
    }
  }, [gameState.gameStatus, gameState.isPaused, startTimer, stopTimer, pauseTimer, resumeTimer]);

  // Reset timer when game is reset
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.startTime > 0) {
      // Check if this is a new game (startTime changed)
      const currentTime = Date.now();
      if (Math.abs(currentTime - gameState.startTime) < 1000) {
        resetTimer();
      }
    }
  }, [gameState.startTime, gameState.gameStatus, resetTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // Format time for display
  const formatTime = useCallback((timeMs: number) => {
    const seconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  }, []);

  return {
    // Time values
    elapsedTime,
    gameTime,
    formattedGameTime: formatTime(gameTime),
    
    // Timer controls
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    
    // Utility functions
    getMovementInterval,
    getCurrentGameTime,
    formatTime
  };
};
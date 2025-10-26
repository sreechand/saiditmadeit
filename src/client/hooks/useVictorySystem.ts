import { useCallback, useEffect } from 'react';
import { useGameState } from './useGameState.js';
import type { ThemeName } from '../../shared/types/game.js';

/**
 * Hook for managing victory conditions, score calculation, and game completion
 */
export const useVictorySystem = () => {
  const { gameState, dispatch, resetGame } = useGameState();

  // Check for victory condition
  const checkVictory = useCallback(() => {
    if (gameState.gameStatus === 'playing') {
      dispatch({ type: 'CHECK_VICTORY' });
    }
  }, [gameState.gameStatus, dispatch]);

  // Submit score to server
  const submitScore = useCallback(async (finalScore: number) => {
    if (!gameState.currentTheme?.name || !gameState.endTime) {
      return false;
    }

    try {
      const gameTime = gameState.endTime - gameState.startTime - (gameState.totalPausedTime || 0);
      
      const response = await fetch('/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: gameState.currentTheme.name,
          score: finalScore,
          timeElapsed: gameTime,
          wrongLetters: gameState.wrongLetterCount,
          difficulty: gameState.difficulty.level,
          snakeLength: gameState.snake.length,
          wordsCollected: gameState.collectedWords.length
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit score: ${response.status}`);
      }

      const result = await response.json();
      return result.success || true;
    } catch (error) {
      console.error('Failed to submit score:', error);
      return false;
    }
  }, [gameState]);

  // Start a new game with the same theme and difficulty
  const playAgain = useCallback(async () => {
    if (!gameState.currentTheme?.name) {
      return false;
    }

    try {
      const response = await fetch('/api/generate-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: gameState.currentTheme.name,
          difficulty: gameState.difficulty.level
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate new puzzle: ${response.status}`);
      }

      const puzzleData = await response.json();
      
      if (puzzleData.type !== 'puzzle') {
        throw new Error('Invalid puzzle response');
      }

      // Initialize new game with the same settings
      dispatch({
        type: 'INITIALIZE',
        puzzle: {
          grid: puzzleData.grid,
          targetWords: puzzleData.targetWords,
          distractorWords: puzzleData.distractorWords,
          theme: puzzleData.theme,
          difficulty: gameState.difficulty // Keep current difficulty
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to start new game:', error);
      return false;
    }
  }, [gameState.currentTheme, gameState.difficulty, dispatch]);

  // Start a new game with a different theme
  const playWithNewTheme = useCallback(async (theme: ThemeName) => {
    try {
      const response = await fetch('/api/generate-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          difficulty: gameState.difficulty.level
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate puzzle for theme ${theme}: ${response.status}`);
      }

      const puzzleData = await response.json();
      
      if (puzzleData.type !== 'puzzle') {
        throw new Error('Invalid puzzle response');
      }

      // Initialize new game with new theme
      dispatch({
        type: 'INITIALIZE',
        puzzle: {
          grid: puzzleData.grid,
          targetWords: puzzleData.targetWords,
          distractorWords: puzzleData.distractorWords,
          theme: puzzleData.theme,
          difficulty: gameState.difficulty // Keep current difficulty
        }
      });

      return true;
    } catch (error) {
      console.error(`Failed to start game with theme ${theme}:`, error);
      return false;
    }
  }, [gameState.difficulty, dispatch]);

  // Close victory screen without starting new game
  const closeVictoryScreen = useCallback(() => {
    dispatch({
      type: 'UPDATE_SCORE',
      score: gameState.score,
      wrongLetterCount: gameState.wrongLetterCount
    });
    
    // Just hide the victory screen, keep the game state
    // This allows players to review the completed game
    resetGame();
  }, [gameState.score, gameState.wrongLetterCount, dispatch, resetGame]);

  // Auto-check victory when target words change
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.targetWords.length > 0) {
      const allTargetWordsCollected = gameState.targetWords.every(word => word.isCollected);
      if (allTargetWordsCollected) {
        checkVictory();
      }
    }
  }, [gameState.targetWords, gameState.gameStatus, checkVictory]);

  // Auto-submit score when game is won (optional)
  useEffect(() => {
    if (gameState.gameStatus === 'won' && gameState.endTime && gameState.score > 0) {
      // Auto-submit score in the background
      submitScore(gameState.score).catch(error => {
        console.warn('Auto score submission failed:', error);
      });
    }
  }, [gameState.gameStatus, gameState.endTime, gameState.score, submitScore]);

  return {
    // Victory state
    isVictorious: gameState.gameStatus === 'won',
    showVictoryScreen: gameState.showVictoryScreen,
    
    // Actions
    checkVictory,
    submitScore,
    playAgain,
    playWithNewTheme,
    closeVictoryScreen,
    
    // Game completion data
    finalScore: gameState.score,
    gameTime: gameState.endTime 
      ? gameState.endTime - gameState.startTime - (gameState.totalPausedTime || 0)
      : 0,
    completionStats: {
      theme: gameState.currentTheme?.name || '',
      difficulty: gameState.difficulty.level,
      snakeLength: gameState.snake.length,
      wrongLetters: gameState.wrongLetterCount,
      wordsCollected: gameState.collectedWords.length,
      targetWordsFound: gameState.collectedWords.filter(cw => cw.isCorrect).length
    }
  };
};
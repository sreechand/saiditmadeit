import { useCallback, useMemo } from 'react';
import { useGameState } from './useGameState.js';
import type { DifficultySettings } from '../../shared/types/game.js';
import { GAME_CONFIG } from '../../shared/types/game.js';

/**
 * Hook for managing difficulty levels and their effects on gameplay
 */
export const useDifficulty = () => {
  const { gameState, dispatch } = useGameState();

  // Get difficulty settings for each level
  const getDifficultySettings = useCallback((level: 'easy' | 'medium' | 'hard'): DifficultySettings => {
    const baseSettings = {
      level,
      allowSharedLetters: true
    };

    switch (level) {
      case 'easy':
        return {
          ...baseSettings,
          showWords: true,           // Show target words to player
          showWordBlanks: false,     // Don't show word blanks (words are visible)
          snakeSpeed: GAME_CONFIG.SNAKE_SPEEDS.easy  // Slower snake speed
        };
      
      case 'medium':
        return {
          ...baseSettings,
          showWords: false,          // Don't show target words
          showWordBlanks: true,      // Show word blanks with letter counts
          snakeSpeed: GAME_CONFIG.SNAKE_SPEEDS.medium  // Medium snake speed
        };
      
      case 'hard':
        return {
          ...baseSettings,
          showWords: false,          // Don't show target words
          showWordBlanks: false,     // No hints at all
          snakeSpeed: GAME_CONFIG.SNAKE_SPEEDS.hard  // Faster snake speed
        };
      
      default:
        return {
          ...baseSettings,
          showWords: false,
          showWordBlanks: true,
          snakeSpeed: GAME_CONFIG.SNAKE_SPEEDS.medium
        };
    }
  }, []);

  // Change difficulty level
  const changeDifficulty = useCallback(async (
    newLevel: 'easy' | 'medium' | 'hard',
    regeneratePuzzle: boolean = true
  ) => {
    const newDifficultySettings = getDifficultySettings(newLevel);
    
    if (regeneratePuzzle && gameState.currentTheme?.name) {
      try {
        // Generate new puzzle with new difficulty
        const response = await fetch('/api/generate-puzzle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            theme: gameState.currentTheme.name,
            difficulty: newLevel
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to generate puzzle with difficulty ${newLevel}: ${response.status}`);
        }

        const puzzleData = await response.json();
        
        if (puzzleData.type !== 'puzzle') {
          throw new Error('Invalid puzzle response');
        }

        // Initialize new game with new difficulty
        dispatch({
          type: 'INITIALIZE',
          puzzle: {
            grid: puzzleData.grid,
            targetWords: puzzleData.targetWords,
            distractorWords: puzzleData.distractorWords,
            theme: puzzleData.theme,
            difficulty: newDifficultySettings
          }
        });

        return true;
      } catch (error) {
        console.error(`Failed to change difficulty to ${newLevel}:`, error);
        return false;
      }
    } else {
      // Just update difficulty settings without regenerating puzzle
      dispatch({
        type: 'INITIALIZE',
        puzzle: {
          grid: gameState.grid,
          targetWords: gameState.targetWords,
          distractorWords: gameState.distractorWords,
          theme: gameState.currentTheme,
          difficulty: newDifficultySettings
        }
      });
      return true;
    }
  }, [gameState, getDifficultySettings, dispatch]);

  // Get UI hints based on current difficulty
  const getUIHints = useMemo(() => {
    const difficulty = gameState.difficulty;
    
    return {
      // Word visibility
      showTargetWords: difficulty.showWords,
      showWordBlanks: difficulty.showWordBlanks,
      
      // Visual hints
      showWordCount: difficulty.level !== 'hard',
      showLetterCount: difficulty.showWordBlanks,
      showThemeHint: difficulty.level === 'easy',
      
      // Gameplay hints
      highlightNextLetter: difficulty.level === 'easy',
      showWordProgress: difficulty.level !== 'hard',
      
      // Speed indicators
      snakeSpeedIndicator: difficulty.level === 'hard' ? 'Fast' : 
                          difficulty.level === 'medium' ? 'Medium' : 'Slow'
    };
  }, [gameState.difficulty]);

  // Get difficulty description for UI
  const getDifficultyDescription = useCallback((level: 'easy' | 'medium' | 'hard') => {
    switch (level) {
      case 'easy':
        return {
          name: 'Easy',
          description: 'Target words are visible, slower snake speed',
          features: [
            'Target words shown',
            'Slow snake movement',
            'Theme hints provided'
          ],
          color: 'green'
        };
      
      case 'medium':
        return {
          name: 'Medium',
          description: 'Word blanks with letter counts, medium snake speed',
          features: [
            'Word blanks shown',
            'Letter count hints',
            'Medium snake speed'
          ],
          color: 'yellow'
        };
      
      case 'hard':
        return {
          name: 'Hard',
          description: 'No hints, faster snake speed',
          features: [
            'No word hints',
            'Fast snake movement',
            'Theme discovery only'
          ],
          color: 'red'
        };
      
      default:
        return {
          name: 'Unknown',
          description: 'Unknown difficulty level',
          features: [],
          color: 'gray'
        };
    }
  }, []);

  // Check if difficulty can be changed (not during active gameplay)
  const canChangeDifficulty = useMemo(() => {
    return gameState.gameStatus !== 'playing' || 
           gameState.snake.length <= 1 || // Only initial snake
           gameState.collectedWords.length === 0; // No words collected yet
  }, [gameState.gameStatus, gameState.snake.length, gameState.collectedWords.length]);

  // Get scoring multiplier based on difficulty
  const getDifficultyMultiplier = useCallback((level: 'easy' | 'medium' | 'hard') => {
    switch (level) {
      case 'easy':
        return 1.0;   // No bonus/penalty
      case 'medium':
        return 1.2;   // 20% bonus
      case 'hard':
        return 1.5;   // 50% bonus
      default:
        return 1.0;
    }
  }, []);

  return {
    // Current difficulty state
    currentDifficulty: gameState.difficulty,
    currentLevel: gameState.difficulty.level,
    
    // Difficulty management
    changeDifficulty,
    getDifficultySettings,
    getDifficultyDescription,
    canChangeDifficulty,
    
    // UI configuration
    uiHints: getUIHints,
    
    // Scoring
    difficultyMultiplier: getDifficultyMultiplier(gameState.difficulty.level),
    
    // Utility functions
    isEasyMode: gameState.difficulty.level === 'easy',
    isMediumMode: gameState.difficulty.level === 'medium',
    isHardMode: gameState.difficulty.level === 'hard'
  };
};
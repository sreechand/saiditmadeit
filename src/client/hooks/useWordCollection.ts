import { useCallback } from 'react';
import type { 
  Position, 
  Word
} from '../../shared/types/game.js';
import { 
  validateLetterCollection,
  getLetterAt,
  positionsEqual
} from '../../shared/utils/gameUtils.js';
import { useGameState } from './useGameState.js';
import { useSnake } from './useSnake.js';

// Word collection logic uses shared action types from game.ts

export const useWordCollection = () => {
  const { gameState, dispatch } = useGameState();
  const { growSnake } = useSnake();

  // Find which word (if any) the letter belongs to
  const findWordForLetter = useCallback((position: Position): Word | null => {
    const allWords = [...gameState.targetWords, ...gameState.distractorWords];
    
    for (const word of allWords) {
      const letterIndex = word.positions.findIndex(pos => 
        positionsEqual(pos, position)
      );
      
      if (letterIndex !== -1) {
        return word;
      }
    }
    
    return null;
  }, [gameState.targetWords, gameState.distractorWords]);

  // Validate if the letter collection is correct for the word
  const validateLetterForWord = useCallback((
    position: Position, 
    word: Word
  ): boolean => {
    const letterCell = getLetterAt(gameState.grid, position);
    if (!letterCell) {
      return false;
    }

    return validateLetterCollection(letterCell, word);
  }, [gameState.grid]);

  // Handle letter collection when snake reaches a letter
  const collectLetter = useCallback((position: Position) => {
    const letterCell = getLetterAt(gameState.grid, position);
    if (!letterCell) {
      return;
    }

    // Find which word this letter belongs to
    const word = findWordForLetter(position);
    
    if (!word) {
      // Letter doesn't belong to any word - treat as wrong letter
      const newSnake = growSnake(position, 'wrong');
      
      dispatch({
        type: 'UPDATE_SNAKE',
        snake: newSnake
      });

      dispatch({
        type: 'UPDATE_SCORE',
        score: gameState.score - 5, // Penalty for wrong letter
        wrongLetterCount: gameState.wrongLetterCount + 1
      });

      return;
    }

    // Check if this is the correct next letter for the word
    const isCorrectLetter = validateLetterForWord(position, word);
    
    if (isCorrectLetter) {
      // Correct letter - grow snake with correct segment
      const newSnake = growSnake(position, 'correct');
      
      // Update word progress
      const updatedWord: Word = {
        ...word,
        collectionProgress: word.collectionProgress + 1,
        isCollected: word.collectionProgress + 1 >= word.text.length
      };

      // Word lists will be updated by the reducer

      dispatch({
        type: 'COLLECT_WORD_LETTER',
        position,
        word: updatedWord,
        isCorrectLetter: true
      });

      dispatch({
        type: 'UPDATE_SNAKE',
        snake: newSnake
      });

      // Update score for correct letter
      const newScore = gameState.score + 10;
      dispatch({
        type: 'UPDATE_SCORE',
        score: newScore,
        wrongLetterCount: gameState.wrongLetterCount
      });

      // Check if word is complete
      if (updatedWord.isCollected) {
        dispatch({
          type: 'COMPLETE_WORD',
          word: updatedWord,
          isTargetWord: word.isTarget
        });

        // Bonus points for completing a word
        const wordBonus = word.isTarget ? 50 : 25;
        dispatch({
          type: 'UPDATE_SCORE',
          score: newScore + wordBonus,
          wrongLetterCount: gameState.wrongLetterCount
        });

        // Check for victory condition
        if (word.isTarget) {
          dispatch({ type: 'CHECK_VICTORY' });
        }
      }

    } else {
      // Wrong letter for this word - treat as incorrect
      const newSnake = growSnake(position, 'wrong');
      
      dispatch({
        type: 'UPDATE_SNAKE',
        snake: newSnake
      });

      dispatch({
        type: 'UPDATE_SCORE',
        score: gameState.score - 5, // Penalty for wrong letter
        wrongLetterCount: gameState.wrongLetterCount + 1
      });
    }

    // Mark the letter cell as collected
    const updatedGrid = gameState.grid.map(row =>
      row.map(cell =>
        positionsEqual(cell.position, position)
          ? { ...cell, isCollected: true }
          : cell
      )
    );

    dispatch({
      type: 'UPDATE_GRID',
      grid: updatedGrid
    });

  }, [
    gameState.grid,
    gameState.score,
    gameState.wrongLetterCount,
    gameState.targetWords,
    gameState.distractorWords,
    findWordForLetter,
    validateLetterForWord,
    growSnake,
    dispatch
  ]);

  // Get current word being formed (if any)
  const getCurrentWordProgress = useCallback((): {
    word: Word;
    progress: string;
    isTarget: boolean;
  } | null => {
    const allWords = [...gameState.targetWords, ...gameState.distractorWords];
    
    for (const word of allWords) {
      if (word.collectionProgress > 0 && !word.isCollected) {
        const progress = word.text.substring(0, word.collectionProgress);
        return {
          word,
          progress,
          isTarget: word.isTarget
        };
      }
    }
    
    return null;
  }, [gameState.targetWords, gameState.distractorWords]);

  // Get visual feedback for snake segments
  const getSnakeSegmentFeedback = useCallback(() => {
    return gameState.snake.map((segment) => ({
      position: segment.position,
      isHead: segment.isHead,
      segmentType: segment.segmentType,
      color: segment.segmentType === 'head' ? 'blue' :
             segment.segmentType === 'correct' ? 'green' : 'red'
    }));
  }, [gameState.snake]);

  // Get collected words with visual feedback
  const getCollectedWordsDisplay = useCallback(() => {
    return gameState.collectedWords.map(collected => ({
      word: collected.word.text,
      isCorrect: collected.isCorrect,
      isTarget: collected.word.isTarget,
      collectedAt: collected.collectedAt,
      color: collected.isCorrect ? 'green' : 'orange'
    }));
  }, [gameState.collectedWords]);

  // Calculate current game statistics
  const getGameStatistics = useCallback(() => {
    const targetWordsCollected = gameState.collectedWords.filter(
      cw => cw.word.isTarget
    ).length;
    
    const totalTargetWords = gameState.targetWords.length;
    const completionPercentage = totalTargetWords > 0 
      ? (targetWordsCollected / totalTargetWords) * 100 
      : 0;

    return {
      score: gameState.score,
      wrongLetterCount: gameState.wrongLetterCount,
      targetWordsCollected,
      totalTargetWords,
      completionPercentage,
      snakeLength: gameState.snake.length,
      timeElapsed: gameState.startTime ? Date.now() - gameState.startTime : 0
    };
  }, [
    gameState.score,
    gameState.wrongLetterCount,
    gameState.collectedWords,
    gameState.targetWords.length,
    gameState.snake.length,
    gameState.startTime
  ]);

  return {
    collectLetter,
    getCurrentWordProgress,
    getSnakeSegmentFeedback,
    getCollectedWordsDisplay,
    getGameStatistics,
    targetWords: gameState.targetWords,
    distractorWords: gameState.distractorWords,
    collectedWords: gameState.collectedWords
  };
};
import React, { useCallback, useReducer, useContext, createContext, ReactNode } from 'react';
import type { 
  GameState, 
  GameAction, 
  LetterCell, 
  Word, 
  Theme, 
  DifficultySettings,
  CollectedWord
} from '../../shared/types/game.js';
import { GAME_CONFIG } from '../../shared/types/game.js';
import { createEmptyGrid } from '../../shared/utils/gameUtils.js';

// Initial game state
const createInitialGameState = (): GameState => ({
  grid: createEmptyGrid(GAME_CONFIG.GRID_SIZE),
  gridSize: GAME_CONFIG.GRID_SIZE,
  snake: [{
    position: { x: 0, y: 0 },
    isHead: true,
    segmentType: 'head'
  }],
  snakeDirection: 'right',
  isSnakeStopped: false,
  targetWords: [],
  distractorWords: [],
  collectedWords: [],
  currentTheme: {
    name: '',
    category: '',
    targetWords: [],
    distractorWords: []
  },
  gameStatus: 'playing',
  difficulty: {
    level: 'medium',
    showWords: false,
    showWordBlanks: true,
    snakeSpeed: GAME_CONFIG.SNAKE_SPEEDS.medium,
    allowSharedLetters: true
  },
  score: 0,
  wrongLetterCount: 0,
  startTime: Date.now(),
  totalPausedTime: 0,
  showVictoryScreen: false,
  isPaused: false
});

// Game state reducer
function gameStateReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        grid: action.puzzle.grid,
        targetWords: action.puzzle.targetWords,
        distractorWords: action.puzzle.distractorWords,
        currentTheme: action.puzzle.theme,
        difficulty: action.puzzle.difficulty,
        gameStatus: 'playing',
        startTime: Date.now(),
        score: 0,
        wrongLetterCount: 0,
        collectedWords: [],
        showVictoryScreen: false,
        isPaused: false,
        totalPausedTime: 0,
        snake: [{
          position: { x: 0, y: 0 },
          isHead: true,
          segmentType: 'head'
        }],
        snakeDirection: 'right',
        isSnakeStopped: false
      };

    case 'MOVE':
      if (state.gameStatus !== 'playing' || state.isPaused || state.isSnakeStopped) {
        return state;
      }
      
      return {
        ...state,
        snakeDirection: action.direction,
        isSnakeStopped: false
      };

    case 'COLLECT_LETTER':
      // Stop the snake when it reaches a letter cell
      return {
        ...state,
        isSnakeStopped: true
      };

    case 'MOVE_SNAKE_TO_POSITION':
      return {
        ...state,
        snake: action.snake,
        isSnakeStopped: action.isSnakeStopped
      };

    case 'RESUME_SNAKE_MOVEMENT':
      return {
        ...state,
        isSnakeStopped: false
      };

    case 'UPDATE_SNAKE':
      return {
        ...state,
        snake: action.snake,
        isSnakeStopped: action.isSnakeStopped ?? state.isSnakeStopped
      };

    case 'COLLECT_WORD_LETTER':
      // Update the appropriate word list based on whether it's a target word
      const updatedTargetWords = action.word.isTarget
        ? state.targetWords.map(w => w.id === action.word.id ? action.word : w)
        : state.targetWords;
      
      const updatedDistractorWords = !action.word.isTarget
        ? state.distractorWords.map(w => w.id === action.word.id ? action.word : w)
        : state.distractorWords;

      return {
        ...state,
        targetWords: updatedTargetWords,
        distractorWords: updatedDistractorWords
      };

    case 'COMPLETE_WORD':
      const collectedWord: CollectedWord = {
        word: action.word,
        collectedAt: Date.now(),
        isCorrect: action.isTargetWord
      };

      return {
        ...state,
        collectedWords: [...state.collectedWords, collectedWord]
      };

    case 'UPDATE_SCORE':
      return {
        ...state,
        score: action.score,
        wrongLetterCount: action.wrongLetterCount
      };

    case 'UPDATE_GRID':
      return {
        ...state,
        grid: action.grid
      };

    case 'CHECK_VICTORY':
      const allTargetWordsCollected = state.targetWords.every(word => word.isCollected);
      
      if (allTargetWordsCollected && state.gameStatus === 'playing') {
        const endTime = Date.now();
        const gameTime = endTime - state.startTime - (state.totalPausedTime || 0);
        
        // Calculate final score with bonuses
        let finalScore = state.score;
        
        // Time bonus (faster completion = higher bonus)
        const timeInSeconds = gameTime / 1000;
        const maxTimeBonus = 200;
        const timeBonus = Math.max(0, maxTimeBonus - Math.floor(timeInSeconds * 0.1));
        
        // Efficiency bonus (fewer wrong letters = higher bonus)
        const maxEfficiencyBonus = 100;
        const efficiencyBonus = Math.max(0, maxEfficiencyBonus - (state.wrongLetterCount * 10));
        
        finalScore += timeBonus + efficiencyBonus;
        
        return {
          ...state,
          gameStatus: 'won',
          showVictoryScreen: true,
          endTime,
          score: finalScore
        };
      }
      
      return state;

    case 'PAUSE':
      return {
        ...state,
        isPaused: true,
        gameStatus: 'paused',
        pausedAt: Date.now()
      };

    case 'RESUME':
      const resumeTime = Date.now();
      const pauseDuration = state.pausedAt ? resumeTime - state.pausedAt : 0;
      
      return {
        ...state,
        isPaused: false,
        gameStatus: 'playing',
        totalPausedTime: (state.totalPausedTime || 0) + pauseDuration
      };

    case 'RESET':
      return createInitialGameState();

    default:
      return state;
  }
}

// Game context
interface GameContextType {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
  initializeGame: (puzzle: {
    grid: LetterCell[][];
    targetWords: Word[];
    distractorWords: Word[];
    theme: Theme;
    difficulty: DifficultySettings;
  }) => void;
  moveSnake: (direction: 'up' | 'down' | 'left' | 'right') => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

// Game provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameState, dispatch] = useReducer(gameStateReducer, createInitialGameState());

  const initializeGame = useCallback((puzzle: {
    grid: LetterCell[][];
    targetWords: Word[];
    distractorWords: Word[];
    theme: Theme;
    difficulty: DifficultySettings;
  }) => {
    dispatch({
      type: 'INITIALIZE',
      puzzle
    });
  }, []);

  const moveSnake = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    dispatch({
      type: 'MOVE',
      direction
    });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const contextValue: GameContextType = {
    gameState,
    dispatch,
    initializeGame,
    moveSnake,
    pauseGame,
    resumeGame,
    resetGame
  };

  return React.createElement(
    GameContext.Provider,
    { value: contextValue },
    children
  );
};

// Custom hook to use game context
export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};

// Custom hook for game initialization
export const useGameInitialization = () => {
  const { initializeGame } = useGameState();

  const generateAndInitializePuzzle = useCallback(async (
    theme: string, 
    difficulty: 'easy' | 'medium' | 'hard'
  ) => {
    try {
      const response = await fetch('/api/generate-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, difficulty })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate puzzle: ${response.status}`);
      }

      const puzzleData = await response.json();
      
      if (puzzleData.type !== 'puzzle') {
        throw new Error('Invalid puzzle response');
      }

      initializeGame({
        grid: puzzleData.grid,
        targetWords: puzzleData.targetWords,
        distractorWords: puzzleData.distractorWords,
        theme: puzzleData.theme,
        difficulty: puzzleData.difficulty
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize game:', error);
      return false;
    }
  }, [initializeGame]);

  return { generateAndInitializePuzzle };
};
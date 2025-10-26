// Core Game Types for Snake Word Game

export interface Position {
  x: number;
  y: number;
}

export type WordOrientation = 
  | 'horizontal-lr'  // left to right
  | 'horizontal-rl'  // right to left
  | 'vertical-tb'    // top to bottom
  | 'vertical-bt';   // bottom to top

export type GameStatus = 'playing' | 'paused' | 'won' | 'lost';

export type SegmentType = 'head' | 'correct' | 'wrong';

export interface LetterCell {
  letter: string;
  position: Position;
  isPartOfWord: boolean;
  wordId?: string;
  isCollected: boolean;
}

export interface SnakeSegment {
  position: Position;
  isHead: boolean;
  segmentType: SegmentType;
}

export interface Word {
  id: string;
  text: string;
  positions: Position[];
  orientation: WordOrientation;
  isTarget: boolean;
  isCollected: boolean;
  collectionProgress: number;
}

export interface CollectedWord {
  word: Word;
  collectedAt: number;
  isCorrect: boolean;
}

export interface Theme {
  name: string;
  category: string;
  targetWords: string[];
  distractorWords: string[];
}

export interface DifficultySettings {
  level: 'easy' | 'medium' | 'hard';
  showWords: boolean;
  showWordBlanks: boolean;
  snakeSpeed: number; // cells per second
  allowSharedLetters: boolean;
}

export interface GameState {
  // Grid and layout
  grid: LetterCell[][];
  gridSize: number; // 6x6 grid
  
  // Snake entity
  snake: SnakeSegment[];
  snakeDirection: 'up' | 'down' | 'left' | 'right';
  isSnakeStopped: boolean;
  
  // Words and puzzle
  targetWords: Word[];
  distractorWords: Word[];
  collectedWords: CollectedWord[];
  currentTheme: Theme;
  
  // Game state
  gameStatus: GameStatus;
  difficulty: DifficultySettings;
  
  // Scoring and progress
  score: number;
  wrongLetterCount: number;
  startTime: number;
  endTime?: number;
  
  // UI state
  showVictoryScreen: boolean;
  isPaused: boolean;
}

// Game configuration constants
export const GAME_CONFIG = {
  GRID_SIZE: 6,
  MIN_TARGET_WORDS: 3,
  MIN_DISTRACTOR_WORDS: 2,
  SNAKE_SPEEDS: {
    easy: 2,    // 2 cells per second
    medium: 3,  // 3 cells per second
    hard: 4     // 4 cells per second
  },
  SCORING: {
    CORRECT_LETTER: 10,
    WRONG_LETTER_PENALTY: -5,
    WORD_COMPLETION_BONUS: 50,
    TIME_BONUS_MULTIPLIER: 0.1
  }
} as const;

// Available themes
export const AVAILABLE_THEMES = [
  'Animals',
  'Colors', 
  'Food',
  'Sports',
  'Nature'
] as const;

export type ThemeName = typeof AVAILABLE_THEMES[number];

// Movement directions
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
} as const;

// Utility types for game actions
export interface MoveAction {
  type: 'MOVE';
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface CollectLetterAction {
  type: 'COLLECT_LETTER';
  position: Position;
}

export interface PauseAction {
  type: 'PAUSE';
}

export interface ResumeAction {
  type: 'RESUME';
}

export interface ResetAction {
  type: 'RESET';
}

export interface InitializeGameAction {
  type: 'INITIALIZE';
  puzzle: {
    grid: LetterCell[][];
    targetWords: Word[];
    distractorWords: Word[];
    theme: Theme;
    difficulty: DifficultySettings;
  };
}

export interface MoveSnakeToPositionAction {
  type: 'MOVE_SNAKE_TO_POSITION';
  snake: SnakeSegment[];
  isSnakeStopped: boolean;
}

export interface ResumeSnakeMovementAction {
  type: 'RESUME_SNAKE_MOVEMENT';
}

export interface UpdateSnakeAction {
  type: 'UPDATE_SNAKE';
  snake: SnakeSegment[];
  isSnakeStopped?: boolean;
}

export interface CollectWordLetterAction {
  type: 'COLLECT_WORD_LETTER';
  position: Position;
  word: Word;
  isCorrectLetter: boolean;
}

export interface CompleteWordAction {
  type: 'COMPLETE_WORD';
  word: Word;
  isTargetWord: boolean;
}

export interface UpdateScoreAction {
  type: 'UPDATE_SCORE';
  score: number;
  wrongLetterCount: number;
}

export interface CheckVictoryAction {
  type: 'CHECK_VICTORY';
}

export interface UpdateGridAction {
  type: 'UPDATE_GRID';
  grid: LetterCell[][];
}

export type GameAction = 
  | MoveAction 
  | CollectLetterAction 
  | PauseAction 
  | ResumeAction 
  | ResetAction 
  | InitializeGameAction
  | MoveSnakeToPositionAction
  | ResumeSnakeMovementAction
  | UpdateSnakeAction
  | CollectWordLetterAction
  | CompleteWordAction
  | UpdateScoreAction
  | CheckVictoryAction
  | UpdateGridAction;
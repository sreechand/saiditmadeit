// Import game types first
import type { 
  GameState, 
  LetterCell, 
  Word, 
  Theme, 
  DifficultySettings,
  SnakeSegment,
  Position,
  WordOrientation,
  GameStatus,
  CollectedWord
} from './game.js';

// Legacy API types (for existing code compatibility)
export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

// Snake Word Game API Types

export type GeneratePuzzleRequest = {
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type GeneratePuzzleResponse = {
  type: 'puzzle';
  grid: LetterCell[][];
  targetWords: Word[];
  distractorWords: Word[];
  theme: Theme;
  difficulty: DifficultySettings;
};

export type SubmitScoreRequest = {
  theme: string;
  score: number;
  timeElapsed: number;
  wrongLetters: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type SubmitScoreResponse = {
  type: 'score-submitted';
  success: boolean;
  leaderboardPosition?: number;
};

export type LeaderboardResponse = {
  type: 'leaderboard';
  scores: LeaderboardEntry[];
};

export type LeaderboardEntry = {
  username: string;
  score: number;
  timeElapsed: number;
  wrongLetters: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completedAt: number;
};

// Re-export game types for API usage
export type { 
  GameState, 
  LetterCell, 
  Word, 
  Theme, 
  DifficultySettings,
  SnakeSegment,
  Position,
  WordOrientation,
  GameStatus,
  CollectedWord
};

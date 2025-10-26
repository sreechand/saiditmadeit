import { useState, useEffect, useCallback } from 'react';
import { navigateTo } from '@devvit/web/client';
import { useGameState } from './hooks/useGameState';
import { useSnake } from './hooks/useSnake';
import { useWordCollection } from './hooks/useWordCollection';
import { useVictorySystem } from './hooks/useVictorySystem';
import { useDifficulty } from './hooks/useDifficulty';
import { GameBoard, WordTracker, GameControls, VictoryScreen } from './components';
import { AnimationSystem, useAnimations } from './components/AnimationSystem';
import { GAME_CONFIG, DifficultySettings, ThemeName } from '../shared/types/game';

export const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game state hooks
  const { gameState, initializeGame, pauseGame, resumeGame, resetGame } = useGameState();
  const { moveSnake } = useSnake();
  const {
    showVictoryScreen,
    playAgain,
    playWithNewTheme,
    closeVictoryScreen
  } = useVictorySystem();
  const { 
    changeDifficulty, 
    canChangeDifficulty
  } = useDifficulty();
  useWordCollection();
  
  // Animation system
  const {
    animationEvents,
    clearProcessedEvents,
    triggerVictory
  } = useAnimations();
  
  // Handle game initialization
  const handleStartGame = () => {
    setGameStarted(true);
    // Initialize with default settings - this will be replaced with actual puzzle generation
    const mockPuzzle = {
      grid: Array(GAME_CONFIG.GRID_SIZE).fill(null).map((_, y) =>
        Array(GAME_CONFIG.GRID_SIZE).fill(null).map((_, x) => ({
          letter: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
          position: { x, y },
          isPartOfWord: false,
          isCollected: false
        }))
      ),
      targetWords: [],
      distractorWords: [],
      theme: { name: 'Animals', category: 'Animals', targetWords: [], distractorWords: [] },
      difficulty: { 
        level: 'easy' as const, 
        showWords: true, 
        showWordBlanks: false, 
        snakeSpeed: 2, 
        allowSharedLetters: true 
      }
    };
    initializeGame(mockPuzzle);
  };
  
  // Game control handlers
  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.gameStatus === 'playing') {
      moveSnake(direction);
    }
  };
  
  const handleDifficultyChange = async (difficulty: DifficultySettings['level']) => {
    if (canChangeDifficulty) {
      const success = await changeDifficulty(difficulty, true);
      if (!success) {
        console.error('Failed to change difficulty to:', difficulty);
      }
    } else {
      console.warn('Cannot change difficulty during active gameplay');
    }
  };
  
  const handleThemeChange = (theme: ThemeName) => {
    // This will be implemented when we have puzzle generation
    console.log('Theme changed to:', theme);
  };

  // Global keyboard handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!gameStarted || gameState.gameStatus !== 'playing') {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        handleMove('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        handleMove('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        handleMove('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        handleMove('right');
        break;
      case ' ':
        event.preventDefault();
        if (gameState.gameStatus === 'paused') {
          resumeGame();
        } else if (gameState.gameStatus === 'playing') {
          pauseGame();
        }
        break;
      case 'r':
      case 'R':
        event.preventDefault();
        resetGame();
        break;
    }
  }, [gameStarted, gameState.gameStatus, handleMove, pauseGame, resumeGame, resetGame]);

  // Set up global keyboard listener
  useEffect(() => {
    if (gameStarted) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [gameStarted, handleKeyDown]);

  // Trigger animations based on game state changes
  useEffect(() => {
    // Trigger victory animation when game is won
    if (gameState.gameStatus === 'won' && gameState.currentTheme) {
      triggerVictory(gameState.currentTheme.category);
    }
  }, [gameState.gameStatus, gameState.currentTheme, triggerVictory]);

  // Handle animation event processing
  const handleAnimationEventProcessed = useCallback((eventIndex: number) => {
    clearProcessedEvents([eventIndex]);
  }, [clearProcessedEvents]);
  
  // Show splash screen if game hasn't started
  if (!gameStarted) {
    return (
      <div className="flex relative flex-col justify-center items-center min-h-screen gap-4 bg-gradient-to-b from-blue-50 to-green-50">
        <img className="object-contain w-1/2 max-w-[200px] mx-auto" src="/snoo.png" alt="Snoo" />
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Snake Word Game
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Guide your snake through the grid to collect letters and spell out hidden themed words!
          </p>
          <button
            onClick={handleStartGame}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            🐍 Start Playing
          </button>
        </div>
        <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 text-sm text-gray-600">
          <button
            className="cursor-pointer hover:text-blue-600"
            onClick={() => navigateTo('https://developers.reddit.com/docs')}
          >
            Docs
          </button>
          <span className="text-gray-300">|</span>
          <button
            className="cursor-pointer hover:text-blue-600"
            onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
          >
            r/Devvit
          </button>
        </footer>
      </div>
    );
  }
  
  // Main game interface
  return (
    <div 
      className="min-h-screen bg-gray-100 p-4 focus:outline-none" 
      tabIndex={0}
      onClick={() => document.querySelector<HTMLDivElement>('.min-h-screen')?.focus()}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left sidebar - Word tracker and stats */}
          <div className="lg:col-span-1 space-y-4">
            <WordTracker
              targetWords={gameState.targetWords}
              collectedWords={gameState.collectedWords}
              wrongLetterCount={gameState.wrongLetterCount}
              difficulty={gameState.difficulty}
              currentTheme={gameState.currentTheme?.name}
            />
          </div>
          
          {/* Center - Game board */}
          <div className="lg:col-span-1 flex flex-col items-center space-y-4">
            <div className="relative">
              <GameBoard
                grid={gameState.grid}
                snake={gameState.snake}
                onCellClick={(x, y) => console.log('Cell clicked:', x, y)}
                theme={gameState.currentTheme?.category}
                isAnimating={gameState.gameStatus === 'playing' && !gameState.isSnakeStopped}
                snakeDirection={gameState.snakeDirection}
              />

              {/* Animation System Overlay */}
              <AnimationSystem
                gridSize={GAME_CONFIG.GRID_SIZE}
                cellSize={100 / GAME_CONFIG.GRID_SIZE}
                events={animationEvents}
                onEventProcessed={handleAnimationEventProcessed}
                className="absolute inset-0"
              />
            </div>
          </div>
          
          {/* Right sidebar - Game controls */}
          <div className="lg:col-span-1 space-y-4">
            <GameControls
              onMove={handleMove}
              onPause={pauseGame}
              onResume={resumeGame}
              onRestart={resetGame}
              onDifficultyChange={handleDifficultyChange}
              onThemeChange={handleThemeChange}
              isPaused={gameState.gameStatus === 'paused'}
              isGameActive={gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused'}
              currentDifficulty={gameState.difficulty.level}
              currentTheme={gameState.currentTheme?.name as ThemeName || 'Animals'}
            />
          </div>
        </div>
      </div>

      {/* Victory Screen Overlay */}
      {showVictoryScreen && (
        <VictoryScreen
          gameState={gameState}
          onPlayAgain={playAgain}
          onThemeSelect={playWithNewTheme}
          onClose={closeVictoryScreen}
        />
      )}
    </div>
  );
};

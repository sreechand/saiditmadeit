import React, { useEffect, useCallback, useState } from 'react';
import { DifficultySettings, ThemeName, AVAILABLE_THEMES } from '../../shared/types/game';

interface GameControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onDifficultyChange: (difficulty: DifficultySettings['level']) => void;
  onThemeChange: (theme: ThemeName) => void;
  isPaused: boolean;
  isGameActive: boolean;
  currentDifficulty: DifficultySettings['level'];
  currentTheme: ThemeName;
  className?: string;
}

interface TouchControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isGameActive: boolean;
}

interface KeyboardControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  isPaused: boolean;
  isGameActive: boolean;
}

// Touch/Swipe controls for mobile
const TouchControls: React.FC<TouchControlsProps> = ({ onMove, isGameActive }) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isGameActive) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isGameActive || !touchStart) return;
    
    const touch = e.changedTouches[0];
    if (!touch) return;
    
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Minimum swipe distance
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        onMove(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        onMove(deltaY > 0 ? 'down' : 'up');
      }
    }
    
    setTouchStart(null);
  };
  
  return (
    <div className="touch-controls grid grid-cols-3 gap-2 max-w-xs mx-auto">
      {/* Top row */}
      <div></div>
      <button
        className="control-btn bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg shadow-md active:scale-95 transition-all"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => isGameActive && onMove('up')}
        disabled={!isGameActive}
      >
        ↑
      </button>
      <div></div>
      
      {/* Middle row */}
      <button
        className="control-btn bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg shadow-md active:scale-95 transition-all"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => isGameActive && onMove('left')}
        disabled={!isGameActive}
      >
        ←
      </button>
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
      <button
        className="control-btn bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg shadow-md active:scale-95 transition-all"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => isGameActive && onMove('right')}
        disabled={!isGameActive}
      >
        →
      </button>
      
      {/* Bottom row */}
      <div></div>
      <button
        className="control-btn bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg shadow-md active:scale-95 transition-all"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => isGameActive && onMove('down')}
        disabled={!isGameActive}
      >
        ↓
      </button>
      <div></div>
    </div>
  );
};

// Keyboard controls hook
const useKeyboardControls = ({
  onMove,
  onPause,
  onResume,
  onRestart,
  isPaused,
  isGameActive
}: KeyboardControlsProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isGameActive) return;
    
    // Prevent default behavior for game keys
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' ', 'r'];
    if (gameKeys.includes(event.key.toLowerCase()) || gameKeys.includes(event.code)) {
      event.preventDefault();
    }
    
    switch (event.key.toLowerCase()) {
      // Arrow keys
      case 'arrowup':
        onMove('up');
        break;
      case 'arrowdown':
        onMove('down');
        break;
      case 'arrowleft':
        onMove('left');
        break;
      case 'arrowright':
        onMove('right');
        break;
      
      // WASD keys
      case 'w':
        onMove('up');
        break;
      case 's':
        onMove('down');
        break;
      case 'a':
        onMove('left');
        break;
      case 'd':
        onMove('right');
        break;
      
      // Game control keys
      case ' ':
        isPaused ? onResume() : onPause();
        break;
      case 'r':
        onRestart();
        break;
    }
  }, [onMove, onPause, onResume, onRestart, isPaused, isGameActive]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
};

// Game menu component
interface GameMenuProps {
  onDifficultyChange: (difficulty: DifficultySettings['level']) => void;
  onThemeChange: (theme: ThemeName) => void;
  currentDifficulty: DifficultySettings['level'];
  currentTheme: ThemeName;
  isOpen: boolean;
  onClose: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({
  onDifficultyChange,
  onThemeChange,
  currentDifficulty,
  currentTheme,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Game Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Difficulty Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Difficulty Level</h3>
          <div className="space-y-3">
            {(['easy', 'medium', 'hard'] as const).map(level => {
              const getDifficultyInfo = (level: 'easy' | 'medium' | 'hard') => {
                switch (level) {
                  case 'easy':
                    return {
                      description: 'Words visible, slow snake',
                      color: 'text-green-600',
                      bgColor: 'bg-green-50 border-green-200'
                    };
                  case 'medium':
                    return {
                      description: 'Word blanks, medium snake',
                      color: 'text-yellow-600',
                      bgColor: 'bg-yellow-50 border-yellow-200'
                    };
                  case 'hard':
                    return {
                      description: 'No hints, fast snake',
                      color: 'text-red-600',
                      bgColor: 'bg-red-50 border-red-200'
                    };
                }
              };
              
              const info = getDifficultyInfo(level);
              const isSelected = currentDifficulty === level;
              
              return (
                <div
                  key={level}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    isSelected 
                      ? `${info.bgColor} border-2` 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => onDifficultyChange(level)}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={isSelected}
                      onChange={() => onDifficultyChange(level)}
                      className="text-blue-600"
                    />
                    <div className="flex-1">
                      <div className={`font-medium capitalize ${isSelected ? info.color : 'text-gray-700'}`}>
                        {level}
                      </div>
                      <div className="text-xs text-gray-600">
                        {info.description}
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Theme Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Theme Category</h3>
          <select
            value={currentTheme}
            onChange={(e) => onThemeChange(e.target.value as ThemeName)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {AVAILABLE_THEMES.map(theme => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Apply Settings
        </button>
      </div>
    </div>
  );
};

export const GameControls: React.FC<GameControlsProps> = ({
  onMove,
  onPause,
  onResume,
  onRestart,
  onDifficultyChange,
  onThemeChange,
  isPaused,
  isGameActive,
  currentDifficulty,
  currentTheme,
  className = ''
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Set up keyboard controls
  useKeyboardControls({
    onMove,
    onPause,
    onResume,
    onRestart,
    isPaused,
    isGameActive
  });
  
  return (
    <div className={`game-controls ${className}`}>
      {/* Control buttons */}
      <div className="control-buttons flex flex-wrap gap-2 justify-center mb-4">
        <button
          onClick={isPaused ? onResume : onPause}
          disabled={!isGameActive}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        
        <button
          onClick={onRestart}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Restart
        </button>
        
        <button
          onClick={() => setShowMenu(true)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Settings
        </button>
      </div>
      
      {/* Touch controls for mobile */}
      {isMobile && (
        <div className="mobile-controls mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
            Touch Controls
          </h3>
          <TouchControls onMove={onMove} isGameActive={isGameActive} />
        </div>
      )}
      
      {/* Keyboard instructions for desktop */}
      {!isMobile && (
        <div className="keyboard-instructions bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <div className="text-center mb-2 font-semibold">Keyboard Controls</div>
          <div className="grid grid-cols-2 gap-2">
            <div>Arrow Keys / WASD: Move</div>
            <div>Spacebar: Pause/Resume</div>
            <div>R: Restart Game</div>
            <div>Settings: Click button above</div>
          </div>
        </div>
      )}
      
      {/* Game menu modal */}
      <GameMenu
        onDifficultyChange={onDifficultyChange}
        onThemeChange={onThemeChange}
        currentDifficulty={currentDifficulty}
        currentTheme={currentTheme}
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
      />
    </div>
  );
};

export default GameControls;
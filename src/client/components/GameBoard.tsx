import React, { useState, useEffect } from 'react';
import { LetterCell, SnakeSegment, GAME_CONFIG } from '../../shared/types/game';

interface GameBoardProps {
  grid: LetterCell[][];
  snake: SnakeSegment[];
  onCellClick?: (x: number, y: number) => void;
  className?: string;
  theme?: string;
  isAnimating?: boolean;
  snakeDirection?: 'up' | 'down' | 'left' | 'right';
}

interface LetterCellComponentProps {
  cell: LetterCell;
  snakeSegment?: SnakeSegment;
  onClick?: () => void;
  theme?: string;
  isAnimating?: boolean;
  snakeDirection?: 'up' | 'down' | 'left' | 'right';
}

const LetterCellComponent: React.FC<LetterCellComponentProps> = ({
  cell,
  snakeSegment,
  onClick,
  theme = '',
  isAnimating = false,
  snakeDirection = 'right'
}) => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [justCollected, setJustCollected] = useState(false);

  const isSnakeCell = !!snakeSegment;
  const isSnakeHead = snakeSegment?.isHead;
  const segmentType = snakeSegment?.segmentType;
  
  // Handle collection animation
  useEffect(() => {
    if (cell.isCollected && !justCollected) {
      setIsCollecting(true);
      setJustCollected(true);
      
      const timer = setTimeout(() => {
        setIsCollecting(false);
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [cell.isCollected, justCollected]);
  
  // Get theme-based colors
  const getThemeColors = () => {
    switch (theme.toLowerCase()) {
      case 'animals':
        return {
          primary: 'bg-amber-500',
          secondary: 'bg-amber-100',
          border: 'border-amber-300',
          hover: 'hover:bg-amber-200'
        };
      case 'colors':
        return {
          primary: 'bg-pink-500',
          secondary: 'bg-pink-100',
          border: 'border-pink-300',
          hover: 'hover:bg-pink-200'
        };
      case 'food':
        return {
          primary: 'bg-red-500',
          secondary: 'bg-red-100',
          border: 'border-red-300',
          hover: 'hover:bg-red-200'
        };
      case 'sports':
        return {
          primary: 'bg-blue-500',
          secondary: 'bg-blue-100',
          border: 'border-blue-300',
          hover: 'hover:bg-blue-200'
        };
      case 'nature':
        return {
          primary: 'bg-green-500',
          secondary: 'bg-green-100',
          border: 'border-green-300',
          hover: 'hover:bg-green-200'
        };
      default:
        return {
          primary: 'bg-blue-500',
          secondary: 'bg-blue-100',
          border: 'border-blue-300',
          hover: 'hover:bg-blue-200'
        };
    }
  };
  
  const themeColors = getThemeColors();

  // Get direction indicator for snake head
  const getDirectionIndicator = () => {
    switch (snakeDirection) {
      case 'up': return '▲';
      case 'down': return '▼';
      case 'left': return '◀';
      case 'right': return '▶';
      default: return '●';
    }
  };

  // Get segment content (letter, direction, or special symbol)
  const getSegmentContent = () => {
    if (isSnakeHead) return getDirectionIndicator();
    if (segmentType === 'correct') return '✓';
    if (segmentType === 'wrong') return '✗';
    return cell.letter.toUpperCase();
  };

  // Base cell styling with smooth transitions
  let cellClasses = 'w-full h-full flex items-center justify-center text-lg font-bold border transition-smooth cursor-pointer select-none relative overflow-hidden';
  
  // Add collection animation
  if (isCollecting) {
    cellClasses += ' animate-letter-collect';
  }
  
  // Snake segment styling with enhanced animations
  if (isSnakeCell) {
    if (isSnakeHead) {
      cellClasses += ' bg-blue-600 text-white border-blue-700 shadow-lg z-20';
      if (isAnimating) {
        cellClasses += ' animate-snake-slither';
      }
    } else if (segmentType === 'correct') {
      cellClasses += ' bg-green-500 text-white border-green-600 animate-snake-grow';
    } else if (segmentType === 'wrong') {
      cellClasses += ' bg-red-500 text-white border-red-600 animate-wrong-letter-shake';
    }
  } else {
    // Regular cell styling with theme colors
    if (cell.isCollected) {
      cellClasses += ` bg-yellow-200 text-gray-700 border-yellow-400 opacity-60`;
    } else if (cell.isPartOfWord) {
      cellClasses += ` ${themeColors.secondary} text-gray-800 ${themeColors.border} ${themeColors.hover}`;
    } else {
      cellClasses += ' bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
    }
  }
  
  return (
    <div 
      className={cellClasses}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {/* Letter or snake content */}
      <span className="relative z-10">
        {isSnakeCell ? getSegmentContent() : cell.letter.toUpperCase()}
      </span>
      
      {/* Glow effect for word letters */}
      {cell.isPartOfWord && !cell.isCollected && !isSnakeCell && (
        <div className={`absolute inset-0 ${themeColors.primary} opacity-20 animate-pulse`} />
      )}
      
      {/* Collection ripple effect */}
      {isCollecting && (
        <div className="absolute inset-0 bg-green-400 opacity-50 animate-ping" />
      )}
    </div>
  );
};

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  snake,
  onCellClick,
  className = '',
  theme = '',
  isAnimating = false,
  snakeDirection = 'right'
}) => {
  const [boardAnimation, setBoardAnimation] = useState('');

  console.log('GameBoard render:', {
    snakeLength: snake.length,
    snakeDirection,
    snakePositions: snake.map(s => ({ x: s.position.x, y: s.position.y, isHead: s.isHead, type: s.segmentType }))
  });

  // Create a map of snake positions for quick lookup
  const snakePositionMap = new Map<string, SnakeSegment>();
  snake.forEach(segment => {
    const key = `${segment.position.x},${segment.position.y}`;
    snakePositionMap.set(key, segment);
  });

  const handleCellClick = (x: number, y: number) => {
    onCellClick?.(x, y);
  };

  // Get theme-based board styling
  const getThemeBoardStyle = () => {
    switch (theme.toLowerCase()) {
      case 'animals':
        return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200';
      case 'colors':
        return 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200';
      case 'food':
        return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
      case 'sports':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
      case 'nature':
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
    }
  };

  // Trigger board shake animation on wrong moves
  useEffect(() => {
    const wrongSegments = snake.filter(s => s.segmentType === 'wrong');
    if (wrongSegments.length > 0) {
      setBoardAnimation('animate-wrong-letter-shake');
      const timer = setTimeout(() => setBoardAnimation(''), 500);
      return () => clearTimeout(timer);
    }
  }, [snake]);

  return (
    <div className={`game-board relative ${className}`}>
      {/* Game board container with responsive sizing and theme styling */}
      <div className="w-full max-w-md mx-auto aspect-square p-2">
        <div 
          className={`grid gap-1 w-full h-full p-2 rounded-lg shadow-lg border-2 transition-smooth ${getThemeBoardStyle()} ${boardAnimation}`}
          style={{ 
            gridTemplateColumns: `repeat(${GAME_CONFIG.GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GAME_CONFIG.GRID_SIZE}, 1fr)`
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const snakeSegment = snakePositionMap.get(`${x},${y}`);
              
              return (
                <LetterCellComponent
                  key={`${x}-${y}`}
                  cell={cell}
                  snakeSegment={snakeSegment}
                  onClick={() => handleCellClick(x, y)}
                  theme={theme}
                  isAnimating={isAnimating}
                  snakeDirection={snakeDirection}
                />
              );
            })
          )}
        </div>
      </div>
      
      {/* Theme indicator */}
      {theme && (
        <div className="mt-2 text-center">
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getThemeBoardStyle()} border`}>
            Theme: {theme}
          </div>
        </div>
      )}
      
      {/* Grid coordinates for debugging (hidden in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Grid: {GAME_CONFIG.GRID_SIZE}×{GAME_CONFIG.GRID_SIZE} | Snake segments: {snake.length}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
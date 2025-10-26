import React from 'react';
import { LetterCell, SnakeSegment, GAME_CONFIG } from '../../shared/types/game';

interface GameBoardProps {
  grid: LetterCell[][];
  snake: SnakeSegment[];
  onCellClick?: (x: number, y: number) => void;
  className?: string;
}

interface LetterCellComponentProps {
  cell: LetterCell;
  snakeSegment?: SnakeSegment;
  onClick?: () => void;
}

const LetterCellComponent: React.FC<LetterCellComponentProps> = ({ 
  cell, 
  snakeSegment, 
  onClick 
}) => {
  const isSnakeCell = !!snakeSegment;
  const isSnakeHead = snakeSegment?.isHead;
  const segmentType = snakeSegment?.segmentType;
  
  // Base cell styling
  let cellClasses = 'w-full h-full flex items-center justify-center text-lg font-bold border border-gray-300 transition-all duration-200 cursor-pointer select-none';
  
  // Snake segment styling
  if (isSnakeCell) {
    if (isSnakeHead) {
      cellClasses += ' bg-blue-600 text-white border-blue-700 shadow-lg';
    } else if (segmentType === 'correct') {
      cellClasses += ' bg-green-500 text-white border-green-600';
    } else if (segmentType === 'wrong') {
      cellClasses += ' bg-red-500 text-white border-red-600';
    }
  } else {
    // Regular cell styling
    if (cell.isCollected) {
      cellClasses += ' bg-yellow-100 text-gray-700 border-yellow-300';
    } else if (cell.isPartOfWord) {
      cellClasses += ' bg-blue-50 text-gray-800 border-blue-200 hover:bg-blue-100';
    } else {
      cellClasses += ' bg-white text-gray-700 hover:bg-gray-50';
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
      {cell.letter.toUpperCase()}
    </div>
  );
};

export const GameBoard: React.FC<GameBoardProps> = ({ 
  grid, 
  snake, 
  onCellClick,
  className = ''
}) => {
  // Create a map of snake positions for quick lookup
  const snakePositionMap = new Map<string, SnakeSegment>();
  snake.forEach(segment => {
    const key = `${segment.position.x},${segment.position.y}`;
    snakePositionMap.set(key, segment);
  });

  const handleCellClick = (x: number, y: number) => {
    onCellClick?.(x, y);
  };

  return (
    <div className={`game-board ${className}`}>
      {/* Game board container with responsive sizing */}
      <div className="w-full max-w-md mx-auto aspect-square p-2">
        <div 
          className="grid gap-1 w-full h-full bg-gray-200 p-2 rounded-lg shadow-lg"
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
                />
              );
            })
          )}
        </div>
      </div>
      
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
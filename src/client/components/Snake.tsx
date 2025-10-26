import React, { useState, useEffect } from 'react';
import { SnakeSegment } from '../../shared/types/game';

interface SnakeProps {
  snake: SnakeSegment[];
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  gridSize: number;
  className?: string;
  theme?: string;
}

interface SnakeSegmentComponentProps {
  segment: SnakeSegment;
  index: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  gridSize: number;
  theme?: string;
  isNewSegment?: boolean;
}

const SnakeSegmentComponent: React.FC<SnakeSegmentComponentProps> = ({
  segment,
  index,
  direction,
  isMoving,
  gridSize,
  theme = '',
  isNewSegment = false
}) => {
  const { position, isHead, segmentType } = segment;
  const [justGrew, setJustGrew] = useState(isNewSegment);
  
  // Calculate position as percentage of grid
  const leftPercent = (position.x / gridSize) * 100;
  const topPercent = (position.y / gridSize) * 100;
  const sizePercent = (1 / gridSize) * 100;
  
  // Handle growth animation
  useEffect(() => {
    if (isNewSegment) {
      setJustGrew(true);
      const timer = setTimeout(() => setJustGrew(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isNewSegment]);
  
  // Get theme-based head color
  const getHeadColor = () => {
    switch (theme.toLowerCase()) {
      case 'animals':
        return 'bg-amber-600 border-amber-800';
      case 'colors':
        return 'bg-pink-600 border-pink-800';
      case 'food':
        return 'bg-red-600 border-red-800';
      case 'sports':
        return 'bg-blue-600 border-blue-800';
      case 'nature':
        return 'bg-green-600 border-green-800';
      default:
        return 'bg-blue-600 border-blue-800';
    }
  };
  
  // Base segment styling with enhanced animations
  let segmentClasses = 'absolute transition-all duration-300 ease-in-out rounded-lg border-2 flex items-center justify-center shadow-md';
  
  // Add growth animation
  if (justGrew) {
    segmentClasses += ' animate-snake-grow';
  }
  
  // Add movement animation classes
  if (isMoving && isHead) {
    segmentClasses += ' animate-snake-slither';
  }
  
  // Head styling with direction indicator and theme colors
  if (isHead) {
    segmentClasses += ` ${getHeadColor()} text-white font-bold text-xs shadow-lg z-20`;
    
    // Add pulsing effect when moving
    if (isMoving) {
      segmentClasses += ' animate-pulse';
    }
  } else {
    // Body segment styling based on type with enhanced visuals
    switch (segmentType) {
      case 'correct':
        segmentClasses += ' bg-gradient-to-br from-green-400 to-green-600 border-green-700 text-white shadow-green-200';
        break;
      case 'wrong':
        segmentClasses += ' bg-gradient-to-br from-red-400 to-red-600 border-red-700 text-white shadow-red-200';
        if (justGrew) {
          segmentClasses += ' animate-wrong-letter-shake';
        }
        break;
      default:
        segmentClasses += ' bg-gradient-to-br from-gray-400 to-gray-600 border-gray-700 text-white';
    }
  }
  
  // Direction indicator for head with enhanced arrows
  const getDirectionIndicator = () => {
    if (!isHead) return null;
    
    switch (direction) {
      case 'up': return '▲';
      case 'down': return '▼';
      case 'left': return '◀';
      case 'right': return '▶';
      default: return '●';
    }
  };
  
  // Segment number or special indicator
  const getSegmentContent = () => {
    if (isHead) return getDirectionIndicator();
    if (segmentType === 'correct') return '✓';
    if (segmentType === 'wrong') return '✗';
    return index;
  };
  
  return (
    <div
      className={segmentClasses}
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        width: `${sizePercent}%`,
        height: `${sizePercent}%`,
        zIndex: isHead ? 20 : 15 - index, // Head on top, segments layered by age
        transform: justGrew ? 'scale(1)' : undefined
      }}
    >
      <span className="drop-shadow-sm">
        {getSegmentContent()}
      </span>
      
      {/* Glow effect for head */}
      {isHead && isMoving && (
        <div className="absolute inset-0 rounded-lg bg-white opacity-20 animate-ping" />
      )}
    </div>
  );
};

export const Snake: React.FC<SnakeProps> = ({
  snake,
  direction,
  isMoving,
  gridSize,
  className = '',
  theme = ''
}) => {
  const [previousLength, setPreviousLength] = useState(snake.length);
  
  // Track snake growth for animation
  useEffect(() => {
    setPreviousLength(snake.length);
  }, [snake.length]);
  
  console.log('Snake component render:', { snake, direction, isMoving });
  
  if (snake.length === 0) return null;
  
  // Get theme-based trail color
  const getTrailColor = () => {
    switch (theme.toLowerCase()) {
      case 'animals':
        return 'bg-amber-300';
      case 'colors':
        return 'bg-pink-300';
      case 'food':
        return 'bg-red-300';
      case 'sports':
        return 'bg-blue-300';
      case 'nature':
        return 'bg-green-300';
      default:
        return 'bg-blue-300';
    }
  };
  
  return (
    <div className={`snake-container relative ${className}`}>
      {snake.map((segment, index) => (
        <SnakeSegmentComponent
          key={`segment-${segment.position.x}-${segment.position.y}-${index}`}
          segment={segment}
          index={index}
          direction={direction}
          isMoving={isMoving}
          gridSize={gridSize}
          theme={theme}
          isNewSegment={index === 1 && snake.length > previousLength}
        />
      ))}
      
      {/* Enhanced snake trail effect for smooth movement */}
      {isMoving && snake.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {snake.slice(0, Math.min(3, snake.length)).map((segment, index) => (
            <div
              key={`trail-${index}`}
              className={`absolute ${getTrailColor()} opacity-20 rounded-full animate-ping`}
              style={{
                left: `${(segment.position.x / gridSize) * 100}%`,
                top: `${(segment.position.y / gridSize) * 100}%`,
                width: `${(1 / gridSize) * 100 * (0.9 - index * 0.1)}%`,
                height: `${(1 / gridSize) * 100 * (0.9 - index * 0.1)}%`,
                animationDelay: `${index * 150}ms`,
                animationDuration: `${800 + index * 200}ms`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Movement direction indicator */}
      {isMoving && snake[0] && (
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: `${(snake[0].position.x / gridSize) * 100}%`,
            top: `${(snake[0].position.y / gridSize) * 100}%`,
            width: `${(1 / gridSize) * 100}%`,
            height: `${(1 / gridSize) * 100}%`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-2 h-2 ${getTrailColor()} rounded-full animate-pulse opacity-60`} />
          </div>
        </div>
      )}
    </div>
  );
};

// Snake status indicator component
interface SnakeStatusProps {
  snake: SnakeSegment[];
  isMoving: boolean;
  isStopped: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
}

export const SnakeStatus: React.FC<SnakeStatusProps> = ({
  snake,
  isMoving,
  isStopped,
  direction
}) => {
  const correctSegments = snake.filter(s => s.segmentType === 'correct').length;
  const wrongSegments = snake.filter(s => s.segmentType === 'wrong').length;
  
  return (
    <div className="snake-status bg-white rounded-lg p-3 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Snake Status</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isMoving ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-xs text-gray-600">
            {isStopped ? 'Stopped' : isMoving ? 'Moving' : 'Ready'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="text-gray-600">Length</div>
          <div className="font-bold text-blue-600">{snake.length}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-600">Correct</div>
          <div className="font-bold text-green-600">{correctSegments}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-600">Wrong</div>
          <div className="font-bold text-red-600">{wrongSegments}</div>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <div className="text-xs text-gray-600">Direction</div>
        <div className="text-lg">
          {direction === 'up' && '↑'}
          {direction === 'down' && '↓'}
          {direction === 'left' && '←'}
          {direction === 'right' && '→'}
        </div>
      </div>
    </div>
  );
};

export default Snake;
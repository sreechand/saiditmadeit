import React from 'react';
import { SnakeSegment } from '../../shared/types/game';

interface SnakeProps {
  snake: SnakeSegment[];
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  gridSize: number;
  className?: string;
}

interface SnakeSegmentComponentProps {
  segment: SnakeSegment;
  index: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  gridSize: number;
}

const SnakeSegmentComponent: React.FC<SnakeSegmentComponentProps> = ({
  segment,
  index,
  direction,
  isMoving,
  gridSize
}) => {
  const { position, isHead, segmentType } = segment;
  
  // Calculate position as percentage of grid
  const leftPercent = (position.x / gridSize) * 100;
  const topPercent = (position.y / gridSize) * 100;
  const sizePercent = (1 / gridSize) * 100;
  
  // Base segment styling
  let segmentClasses = 'absolute transition-all duration-300 ease-in-out rounded-sm border-2 flex items-center justify-center';
  
  // Add movement animation classes
  if (isMoving) {
    segmentClasses += ' animate-pulse';
  }
  
  // Head styling with direction indicator
  if (isHead) {
    segmentClasses += ' bg-blue-600 border-blue-800 text-white font-bold text-xs shadow-lg z-10';
  } else {
    // Body segment styling based on type
    switch (segmentType) {
      case 'correct':
        segmentClasses += ' bg-green-500 border-green-700 text-white';
        break;
      case 'wrong':
        segmentClasses += ' bg-red-500 border-red-700 text-white';
        break;
      default:
        segmentClasses += ' bg-gray-500 border-gray-700 text-white';
    }
  }
  
  // Direction indicator for head
  const getDirectionIndicator = () => {
    if (!isHead) return null;
    
    switch (direction) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'left': return '←';
      case 'right': return '→';
      default: return '●';
    }
  };
  
  return (
    <div
      className={segmentClasses}
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        width: `${sizePercent}%`,
        height: `${sizePercent}%`,
        zIndex: isHead ? 20 : 10 - index // Head on top, segments layered by age
      }}
    >
      {isHead ? getDirectionIndicator() : index + 1}
    </div>
  );
};

export const Snake: React.FC<SnakeProps> = ({
  snake,
  direction,
  isMoving,
  gridSize,
  className = ''
}) => {
  if (snake.length === 0) return null;
  
  return (
    <div className={`snake-container relative ${className}`}>
      {snake.map((segment, index) => (
        <SnakeSegmentComponent
          key={`segment-${index}`}
          segment={segment}
          index={index}
          direction={direction}
          isMoving={isMoving}
          gridSize={gridSize}
        />
      ))}
      
      {/* Snake trail effect for smooth movement */}
      {isMoving && (
        <div className="absolute inset-0 pointer-events-none">
          {snake.slice(0, 3).map((segment, index) => (
            <div
              key={`trail-${index}`}
              className="absolute bg-blue-300 opacity-30 rounded-full animate-ping"
              style={{
                left: `${(segment.position.x / gridSize) * 100}%`,
                top: `${(segment.position.y / gridSize) * 100}%`,
                width: `${(1 / gridSize) * 100 * 0.8}%`,
                height: `${(1 / gridSize) * 100 * 0.8}%`,
                animationDelay: `${index * 100}ms`,
                animationDuration: '600ms'
              }}
            />
          ))}
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
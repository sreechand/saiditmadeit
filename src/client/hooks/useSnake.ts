import { useCallback, useEffect, useRef } from 'react';
import type { 
  Position, 
  SnakeSegment
} from '../../shared/types/game.js';
import { 
  getNextPosition, 
  isValidPosition, 
  wouldCollideWithSelf, 
  getLetterAt,
  positionsEqual
} from '../../shared/utils/gameUtils.js';
import { useGameState } from './useGameState.js';

export const useSnake = () => {
  const { gameState, dispatch } = useGameState();
  const movementTimerRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  // Calculate movement interval based on snake speed
  const getMovementInterval = useCallback(() => {
    return 1000 / gameState.difficulty.snakeSpeed; // Convert cells per second to milliseconds
  }, [gameState.difficulty.snakeSpeed]);

  // Move snake to next position
  const moveSnakeToPosition = useCallback((newHeadPosition: Position) => {
    const currentSnake = gameState.snake;
    const grid = gameState.grid;
    
    // Check for boundary collision
    if (!isValidPosition(newHeadPosition, gameState.gridSize)) {
      console.log('Snake hit boundary');
      return false;
    }

    // Check for self-collision (excluding current head position)
    const bodySegments = currentSnake.slice(1); // Exclude head
    if (wouldCollideWithSelf(bodySegments, newHeadPosition)) {
      console.log('Snake hit itself');
      return false;
    }

    // Get the letter at the new position
    const letterCell = getLetterAt(grid, newHeadPosition);
    
    if (letterCell && !letterCell.isCollected) {
      // Snake reached a letter cell - stop and wait for input
      dispatch({
        type: 'COLLECT_LETTER',
        position: newHeadPosition
      });
      return true;
    }

    // Move snake normally (no letter at position)
    const newSnake: SnakeSegment[] = [
      {
        position: newHeadPosition,
        isHead: true,
        segmentType: 'head'
      },
      // Convert old head to body segment
      ...currentSnake.map((segment, index) => ({
        ...segment,
        isHead: false,
        segmentType: index === 0 ? segment.segmentType : segment.segmentType
      })).slice(0, -1) // Remove tail (snake doesn't grow when moving to empty cell)
    ];

    // Update snake position
    dispatch({
      type: 'MOVE_SNAKE_TO_POSITION',
      snake: newSnake,
      isSnakeStopped: false
    } as any); // We'll add this action type

    return true;
  }, [gameState.snake, gameState.grid, gameState.gridSize, dispatch]);

  // Handle snake growth when collecting letters
  const growSnake = useCallback((
    newHeadPosition: Position, 
    segmentType: 'correct' | 'wrong'
  ) => {
    const currentSnake = gameState.snake;
    
    const newSnake: SnakeSegment[] = [
      {
        position: newHeadPosition,
        isHead: true,
        segmentType: 'head'
      },
      // Convert old head to body segment with appropriate type
      {
        position: currentSnake[0].position,
        isHead: false,
        segmentType: segmentType
      },
      // Keep all other segments
      ...currentSnake.slice(1)
    ];

    return newSnake;
  }, [gameState.snake]);

  // Frame-rate independent movement system
  const startMovement = useCallback(() => {
    if (movementTimerRef.current) {
      cancelAnimationFrame(movementTimerRef.current);
    }

    const moveInterval = getMovementInterval();
    lastMoveTimeRef.current = performance.now();
    accumulatedTimeRef.current = 0;
    
    const gameLoop = (currentTime: number) => {
      // Calculate delta time since last frame
      const deltaTime = currentTime - lastMoveTimeRef.current;
      lastMoveTimeRef.current = currentTime;
      
      // Don't move if game is paused, stopped, or not playing
      if (gameState.gameStatus !== 'playing' || 
          gameState.isPaused || 
          gameState.isSnakeStopped) {
        // Continue the loop but don't process movement
        movementTimerRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Accumulate time for frame-rate independent movement
      accumulatedTimeRef.current += deltaTime;
      
      // Check if enough time has passed for a movement
      if (accumulatedTimeRef.current >= moveInterval) {
        accumulatedTimeRef.current -= moveInterval;
        
        const currentHead = gameState.snake[0];
        if (currentHead) {
          const nextPosition = getNextPosition(currentHead.position, gameState.snakeDirection);
          
          // Attempt to move snake
          const moveSuccessful = moveSnakeToPosition(nextPosition);
          
          if (!moveSuccessful) {
            // Handle collision or boundary hit
            stopMovement();
            return;
          }
        }
      }

      // Continue the game loop
      movementTimerRef.current = requestAnimationFrame(gameLoop);
    };

    movementTimerRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, getMovementInterval, moveSnakeToPosition]);

  // Stop automatic movement
  const stopMovement = useCallback(() => {
    if (movementTimerRef.current) {
      cancelAnimationFrame(movementTimerRef.current);
      movementTimerRef.current = null;
    }
    accumulatedTimeRef.current = 0;
  }, []);

  // Continue movement after collecting a letter
  const continueMovement = useCallback(() => {
    if (gameState.gameStatus === 'playing' && !gameState.isPaused) {
      // Update snake state to not stopped
      dispatch({
        type: 'RESUME_SNAKE_MOVEMENT'
      } as any); // We'll add this action type
      
      // Restart movement timer
      startMovement();
    }
  }, [gameState.gameStatus, gameState.isPaused, dispatch, startMovement]);

  // Handle direction change
  const changeDirection = useCallback((newDirection: 'up' | 'down' | 'left' | 'right') => {
    // Prevent moving backwards into the snake body
    const currentHead = gameState.snake[0];
    if (!currentHead || gameState.snake.length < 2) {
      dispatch({
        type: 'MOVE',
        direction: newDirection
      });
      return;
    }

    const nextPosition = getNextPosition(currentHead.position, newDirection);
    const secondSegment = gameState.snake[1];
    
    // Don't allow moving directly into the second segment (backwards)
    if (secondSegment && positionsEqual(nextPosition, secondSegment.position)) {
      return;
    }

    dispatch({
      type: 'MOVE',
      direction: newDirection
    });
  }, [gameState.snake, dispatch]);

  // Reset snake to initial position
  const resetSnake = useCallback(() => {
    stopMovement();
    dispatch({ type: 'RESET' });
  }, [stopMovement, dispatch]);

  // Effect to manage movement based on game state
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && 
        !gameState.isPaused && 
        !gameState.isSnakeStopped) {
      startMovement();
    } else {
      stopMovement();
    }

    // Cleanup on unmount
    return () => {
      stopMovement();
    };
  }, [
    gameState.gameStatus, 
    gameState.isPaused, 
    gameState.isSnakeStopped,
    startMovement,
    stopMovement
  ]);

  // Effect to update movement speed when difficulty changes
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && !gameState.isPaused) {
      startMovement(); // Restart with new speed
    }
  }, [gameState.difficulty.snakeSpeed, gameState.gameStatus, gameState.isPaused, startMovement]);

  return {
    snake: gameState.snake,
    snakeDirection: gameState.snakeDirection,
    isSnakeStopped: gameState.isSnakeStopped,
    changeDirection,
    continueMovement,
    resetSnake,
    growSnake,
    startMovement,
    stopMovement
  };
};
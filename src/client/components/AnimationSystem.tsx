import React, { useState, useEffect, useCallback } from 'react';
import { Position } from '../../shared/types/game';

// Animation types
export interface ParticleEffect {
  id: string;
  type: 'letter-collect' | 'word-complete' | 'wrong-letter' | 'victory';
  position: Position;
  color: string;
  startTime: number;
  duration: number;
}

export interface AnimationEvent {
  type: 'letter-collected' | 'word-completed' | 'wrong-letter' | 'victory' | 'snake-grow';
  position?: Position;
  color?: string;
  data?: any;
}

interface AnimationSystemProps {
  gridSize: number;
  cellSize: number;
  events: AnimationEvent[];
  onEventProcessed: (eventIndex: number) => void;
  className?: string;
}

// Individual particle component
interface ParticleProps {
  effect: ParticleEffect;
  gridSize: number;
  cellSize: number;
}

const Particle: React.FC<ParticleProps> = ({ effect, gridSize, cellSize }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, effect.duration);

    return () => clearTimeout(timer);
  }, [effect.duration]);

  if (!isVisible) return null;

  const leftPercent = (effect.position.x / gridSize) * 100;
  const topPercent = (effect.position.y / gridSize) * 100;

  const getParticleStyle = () => {
    const baseStyle = {
      left: `${leftPercent}%`,
      top: `${topPercent}%`,
      color: effect.color,
      backgroundColor: effect.color,
    };

    switch (effect.type) {
      case 'letter-collect':
        return {
          ...baseStyle,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
        };
      case 'word-complete':
        return {
          ...baseStyle,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
        };
      case 'wrong-letter':
        return {
          ...baseStyle,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
        };
      case 'victory':
        return {
          ...baseStyle,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
        };
      default:
        return baseStyle;
    }
  };

  const getAnimationClass = () => {
    switch (effect.type) {
      case 'letter-collect':
        return 'animate-particle-float';
      case 'word-complete':
        return 'animate-particle-burst';
      case 'wrong-letter':
        return 'animate-wrong-letter-shake';
      case 'victory':
        return 'animate-confetti-fall';
      default:
        return '';
    }
  };

  return (
    <div
      className={`absolute pointer-events-none z-30 ${getAnimationClass()}`}
      style={getParticleStyle()}
    />
  );
};

// Confetti component for victory celebration
interface ConfettiProps {
  isActive: boolean;
  theme: string;
}

const Confetti: React.FC<ConfettiProps> = ({ isActive, theme }) => {
  const [particles, setParticles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    color: string;
    delay: number;
  }>>([]);

  const getThemeColors = (themeName: string) => {
    switch (themeName.toLowerCase()) {
      case 'animals':
        return ['#f59e0b', '#d97706', '#92400e', '#fbbf24'];
      case 'colors':
        return ['#ec4899', '#db2777', '#be185d', '#f472b6'];
      case 'food':
        return ['#ef4444', '#dc2626', '#b91c1c', '#f87171'];
      case 'sports':
        return ['#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa'];
      case 'nature':
        return ['#10b981', '#059669', '#047857', '#34d399'];
      default:
        return ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
    }
  };

  useEffect(() => {
    if (isActive) {
      const colors = getThemeColors(theme);
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: `confetti-${i}`,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)]!,
        delay: Math.random() * 2000,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isActive, theme]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}
    </div>
  );
};

// Main animation system component
export const AnimationSystem: React.FC<AnimationSystemProps> = ({
  gridSize,
  cellSize,
  events,
  onEventProcessed,
  className = '',
}) => {
  const [activeEffects, setActiveEffects] = useState<ParticleEffect[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('');

  // Process animation events
  useEffect(() => {
    events.forEach((event, index) => {
      processAnimationEvent(event);
      onEventProcessed(index);
    });
  }, [events, onEventProcessed]);

  const processAnimationEvent = useCallback((event: AnimationEvent) => {
    const now = Date.now();
    
    switch (event.type) {
      case 'letter-collected':
        if (event.position) {
          const effect: ParticleEffect = {
            id: `letter-${now}-${Math.random()}`,
            type: 'letter-collect',
            position: event.position,
            color: event.color || '#10b981',
            startTime: now,
            duration: 800,
          };
          addEffect(effect);
        }
        break;

      case 'word-completed':
        if (event.position) {
          // Create multiple particles for word completion
          for (let i = 0; i < 5; i++) {
            const effect: ParticleEffect = {
              id: `word-${now}-${i}`,
              type: 'word-complete',
              position: {
                x: event.position.x + (Math.random() - 0.5) * 0.5,
                y: event.position.y + (Math.random() - 0.5) * 0.5,
              },
              color: event.color || '#10b981',
              startTime: now + i * 100,
              duration: 600,
            };
            setTimeout(() => addEffect(effect), i * 100);
          }
        }
        break;

      case 'wrong-letter':
        if (event.position) {
          const effect: ParticleEffect = {
            id: `wrong-${now}-${Math.random()}`,
            type: 'wrong-letter',
            position: event.position,
            color: '#ef4444',
            startTime: now,
            duration: 500,
          };
          addEffect(effect);
        }
        break;

      case 'victory':
        setCurrentTheme(event.data?.theme || '');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        break;
    }
  }, []);

  const addEffect = useCallback((effect: ParticleEffect) => {
    setActiveEffects(prev => [...prev, effect]);
    
    // Remove effect after its duration
    setTimeout(() => {
      setActiveEffects(prev => prev.filter(e => e.id !== effect.id));
    }, effect.duration);
  }, []);

  return (
    <div className={`animation-system absolute inset-0 pointer-events-none ${className}`}>
      {/* Particle effects */}
      {activeEffects.map(effect => (
        <Particle
          key={effect.id}
          effect={effect}
          gridSize={gridSize}
          cellSize={cellSize}
        />
      ))}
      
      {/* Victory confetti */}
      <Confetti isActive={showConfetti} theme={currentTheme} />
    </div>
  );
};

// Hook for managing animations
export const useAnimations = () => {
  const [animationEvents, setAnimationEvents] = useState<AnimationEvent[]>([]);

  const triggerAnimation = useCallback((event: AnimationEvent) => {
    setAnimationEvents(prev => [...prev, event]);
  }, []);

  const clearProcessedEvents = useCallback((processedIndices: number[]) => {
    setAnimationEvents(prev => 
      prev.filter((_, index) => !processedIndices.includes(index))
    );
  }, []);

  const triggerLetterCollected = useCallback((position: Position, isCorrect: boolean) => {
    triggerAnimation({
      type: 'letter-collected',
      position,
      color: isCorrect ? '#10b981' : '#ef4444',
    });
  }, [triggerAnimation]);

  const triggerWordCompleted = useCallback((position: Position, isTarget: boolean) => {
    triggerAnimation({
      type: 'word-completed',
      position,
      color: isTarget ? '#10b981' : '#f59e0b',
    });
  }, [triggerAnimation]);

  const triggerWrongLetter = useCallback((position: Position) => {
    triggerAnimation({
      type: 'wrong-letter',
      position,
    });
  }, [triggerAnimation]);

  const triggerVictory = useCallback((theme: string) => {
    triggerAnimation({
      type: 'victory',
      data: { theme },
    });
  }, [triggerAnimation]);

  return {
    animationEvents,
    clearProcessedEvents,
    triggerLetterCollected,
    triggerWordCompleted,
    triggerWrongLetter,
    triggerVictory,
  };
};

export default AnimationSystem;
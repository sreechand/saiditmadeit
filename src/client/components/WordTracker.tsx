import React, { useState, useEffect } from 'react';
import { Word, CollectedWord, DifficultySettings } from '../../shared/types/game';

interface WordTrackerProps {
  targetWords: Word[];
  collectedWords: CollectedWord[];
  wrongLetterCount: number;
  difficulty: DifficultySettings;
  currentTheme?: string;
  className?: string;
}

interface WordProgressProps {
  word: Word;
  isCollected: boolean;
  collectedWord?: CollectedWord | undefined;
  difficulty: DifficultySettings;
}

const WordProgress: React.FC<WordProgressProps> = ({
  word,
  isCollected,
  collectedWord,
  difficulty
}) => {
  const [justCompleted, setJustCompleted] = useState(false);
  const [progressAnimation, setProgressAnimation] = useState('');
  const progressPercentage = (word.collectionProgress / word.text.length) * 100;
  
  // Handle completion animation
  useEffect(() => {
    if (isCollected && !justCompleted) {
      setJustCompleted(true);
      setProgressAnimation('animate-word-complete-glow');
      
      const timer = setTimeout(() => {
        setProgressAnimation('');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isCollected, justCompleted]);
  
  // Handle progress change animation
  useEffect(() => {
    if (word.collectionProgress > 0 && !isCollected) {
      setProgressAnimation('animate-pulse');
      const timer = setTimeout(() => setProgressAnimation(''), 500);
      return () => clearTimeout(timer);
    }
  }, [word.collectionProgress, isCollected]);
  
  // Determine what to show based on difficulty
  const getWordDisplay = () => {
    if (difficulty.showWords) {
      // Easy mode: show the actual word
      return word.text.toUpperCase();
    } else if (difficulty.showWordBlanks) {
      // Medium mode: show blanks with letter count
      return `${'_'.repeat(word.text.length)} (${word.text.length} letters)`;
    } else {
      // Hard mode: show only generic placeholder
      return `??? (${word.text.length})`;
    }
  };
  
  const getCollectedDisplay = () => {
    if (isCollected && collectedWord) {
      return collectedWord.word.text.toUpperCase();
    } else if (word.collectionProgress > 0) {
      // Show partial progress with animation
      const collected = word.text.slice(0, word.collectionProgress).toUpperCase();
      const remaining = '_'.repeat(word.text.length - word.collectionProgress);
      return (
        <span>
          <span className="text-green-600 font-bold">{collected}</span>
          <span className="text-gray-400">{remaining}</span>
        </span>
      );
    }
    return getWordDisplay();
  };
  
  return (
    <div className={`word-progress bg-white rounded-lg p-3 shadow-sm border transition-smooth ${progressAnimation}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            isCollected 
              ? (collectedWord?.isCorrect ? 'bg-green-500 animate-pulse' : 'bg-red-500')
              : word.collectionProgress > 0 
                ? 'bg-yellow-500 animate-pulse' 
                : 'bg-gray-300'
          }`} />
          <span className="text-sm font-medium text-gray-700 transition-smooth">
            {getCollectedDisplay()}
          </span>
        </div>
        
        {isCollected && (
          <div className={`text-xs px-2 py-1 rounded transition-bounce ${
            collectedWord?.isCorrect 
              ? 'bg-green-100 text-green-800 animate-bounce' 
              : 'bg-red-100 text-red-800'
          }`}>
            {collectedWord?.isCorrect ? 'Target ✓' : 'Distractor ✗'}
          </div>
        )}
      </div>
      
      {/* Enhanced progress bar with animations */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ease-out relative ${
            isCollected
              ? (collectedWord?.isCorrect ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600')
              : 'bg-gradient-to-r from-blue-400 to-blue-600'
          }`}
          style={{ width: `${isCollected ? 100 : progressPercentage}%` }}
        >
          {/* Progress bar shine effect */}
          {word.collectionProgress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
          )}
        </div>
      </div>
      
      {/* Progress text with enhanced styling */}
      <div className="text-xs text-gray-600 text-center font-medium">
        {isCollected 
          ? <span className="text-green-600 font-bold">Complete! 🎉</span>
          : `${word.collectionProgress}/${word.text.length} letters`
        }
      </div>
    </div>
  );
};

interface GameStatsProps {
  wrongLetterCount: number;
  totalCollected: number;
  targetWordsFound: number;
  totalTargetWords: number;
  gameTime?: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  wrongLetterCount,
  totalCollected,
  targetWordsFound,
  totalTargetWords,
  gameTime
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="game-stats bg-gray-50 rounded-lg p-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Game Statistics</h3>
      
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="text-center">
          <div className="text-gray-600">Target Words</div>
          <div className="font-bold text-blue-600">
            {targetWordsFound}/{totalTargetWords}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-gray-600">Wrong Letters</div>
          <div className="font-bold text-red-600">{wrongLetterCount}</div>
        </div>
        
        <div className="text-center">
          <div className="text-gray-600">Total Words</div>
          <div className="font-bold text-gray-700">{totalCollected}</div>
        </div>
        
        {gameTime !== undefined && (
          <div className="text-center">
            <div className="text-gray-600">Time</div>
            <div className="font-bold text-gray-700">{formatTime(gameTime)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CurrentWordFormationProps {
  currentWord?: string;
  isValidWord: boolean;
  className?: string;
}

const CurrentWordFormation: React.FC<CurrentWordFormationProps> = ({
  currentWord,
  isValidWord,
  className = ''
}) => {
  if (!currentWord || currentWord.length === 0) {
    return null;
  }
  
  return (
    <div className={`current-word-formation bg-white rounded-lg p-3 shadow-sm border ${className}`}>
      <div className="text-xs text-gray-600 mb-1">Current Word Formation</div>
      <div className="flex items-center gap-2">
        <div className={`text-lg font-mono font-bold ${
          isValidWord ? 'text-green-600' : 'text-gray-700'
        }`}>
          {currentWord.toUpperCase()}
        </div>
        {isValidWord && (
          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Valid Word!
          </div>
        )}
      </div>
    </div>
  );
};

export const WordTracker: React.FC<WordTrackerProps> = ({
  targetWords,
  collectedWords,
  wrongLetterCount,
  difficulty,
  currentTheme,
  className = ''
}) => {
  // Create a map of collected words for quick lookup
  const collectedWordsMap = new Map<string, CollectedWord>();
  collectedWords.forEach(cw => {
    collectedWordsMap.set(cw.word.id, cw);
  });
  
  // Calculate statistics
  const targetWordsFound = targetWords.filter(w => w.isCollected).length;
  const totalCollected = collectedWords.length;
  
  return (
    <div className={`word-tracker ${className}`}>
      {/* Theme display */}
      {currentTheme && (
        <div className="theme-display bg-blue-50 rounded-lg p-3 mb-4 text-center">
          <div className="text-xs text-blue-600 font-medium">Theme Category</div>
          <div className="text-lg font-bold text-blue-800">{currentTheme}</div>
        </div>
      )}
      
      {/* Target words progress */}
      <div className="target-words mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Target Words ({targetWordsFound}/{targetWords.length})
        </h3>
        <div className="space-y-2">
          {targetWords.map(word => (
            <WordProgress
              key={word.id}
              word={word}
              isCollected={word.isCollected}
              collectedWord={collectedWordsMap.get(word.id)}
              difficulty={difficulty}
            />
          ))}
        </div>
      </div>
      
      {/* Game statistics */}
      <GameStats
        wrongLetterCount={wrongLetterCount}
        totalCollected={totalCollected}
        targetWordsFound={targetWordsFound}
        totalTargetWords={targetWords.length}
      />
      
      {/* Collected distractor words */}
      {collectedWords.some(cw => !cw.isCorrect) && (
        <div className="distractor-words mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Distractor Words Found
          </h3>
          <div className="space-y-1">
            {collectedWords
              .filter(cw => !cw.isCorrect)
              .map((cw, index) => (
                <div 
                  key={index}
                  className="text-sm bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200"
                >
                  {cw.word.text.toUpperCase()}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

// Export individual components for flexibility
export { WordProgress, GameStats, CurrentWordFormation };
export default WordTracker;
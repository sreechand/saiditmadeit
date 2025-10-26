import React from 'react';
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
  const progressPercentage = (word.collectionProgress / word.text.length) * 100;
  
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
      // Show partial progress
      const collected = word.text.slice(0, word.collectionProgress).toUpperCase();
      const remaining = '_'.repeat(word.text.length - word.collectionProgress);
      return collected + remaining;
    }
    return getWordDisplay();
  };
  
  return (
    <div className="word-progress bg-white rounded-lg p-3 shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isCollected 
              ? (collectedWord?.isCorrect ? 'bg-green-500' : 'bg-red-500')
              : word.collectionProgress > 0 
                ? 'bg-yellow-500' 
                : 'bg-gray-300'
          }`} />
          <span className="text-sm font-medium text-gray-700">
            {getCollectedDisplay()}
          </span>
        </div>
        
        {isCollected && (
          <div className={`text-xs px-2 py-1 rounded ${
            collectedWord?.isCorrect 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {collectedWord?.isCorrect ? 'Target' : 'Distractor'}
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            isCollected
              ? (collectedWord?.isCorrect ? 'bg-green-500' : 'bg-red-500')
              : 'bg-blue-500'
          }`}
          style={{ width: `${isCollected ? 100 : progressPercentage}%` }}
        />
      </div>
      
      {/* Progress text */}
      <div className="text-xs text-gray-600 text-center">
        {isCollected 
          ? 'Complete' 
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
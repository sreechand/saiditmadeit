import React from 'react';
import type { GameState, ThemeName } from '../../shared/types/game.js';
import { GAME_CONFIG } from '../../shared/types/game.js';

interface VictoryScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onThemeSelect: (theme: ThemeName) => void;
  onClose: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  gameState,
  onPlayAgain,
  onThemeSelect,
  onClose
}) => {
  // Calculate game statistics
  const gameTime = gameState.endTime 
    ? gameState.endTime - gameState.startTime - (gameState.totalPausedTime || 0)
    : 0;
  
  const formatTime = (timeMs: number) => {
    const seconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  // Calculate final score with bonuses
  const calculateFinalScore = () => {
    let finalScore = gameState.score;
    
    // Time bonus (faster completion = higher bonus)
    const timeInSeconds = gameTime / 1000;
    const maxTimeBonus = 200; // Maximum time bonus
    const timeBonus = Math.max(0, maxTimeBonus - Math.floor(timeInSeconds * GAME_CONFIG.SCORING.TIME_BONUS_MULTIPLIER));
    
    // Efficiency bonus (fewer wrong letters = higher bonus)
    const maxEfficiencyBonus = 100;
    const efficiencyBonus = Math.max(0, maxEfficiencyBonus - (gameState.wrongLetterCount * 10));
    
    finalScore += timeBonus + efficiencyBonus;
    
    return {
      baseScore: gameState.score,
      timeBonus,
      efficiencyBonus,
      finalScore
    };
  };

  const scoreBreakdown = calculateFinalScore();

  // Separate collected words by type
  const correctWords = gameState.collectedWords.filter(cw => cw.isCorrect);
  const incorrectWords = gameState.collectedWords.filter(cw => !cw.isCorrect);

  // Available themes for selection
  const availableThemes: ThemeName[] = ['Animals', 'Colors', 'Food', 'Sports', 'Nature'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">🎉 Victory!</h2>
              <p className="text-lg opacity-90">You found all the words!</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Theme Reveal */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-2">Theme Revealed</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-800 text-center">
              {gameState.currentTheme.category}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Game Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Time</div>
              <div className="text-lg font-semibold">{formatTime(gameTime)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Snake Length</div>
              <div className="text-lg font-semibold">{gameState.snake.length}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Wrong Letters</div>
              <div className="text-lg font-semibold text-red-600">{gameState.wrongLetterCount}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Difficulty</div>
              <div className="text-lg font-semibold capitalize">{gameState.difficulty.level}</div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Score Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Score:</span>
              <span className="font-semibold">{scoreBreakdown.baseScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Time Bonus:</span>
              <span className="font-semibold text-green-600">+{scoreBreakdown.timeBonus}</span>
            </div>
            <div className="flex justify-between">
              <span>Efficiency Bonus:</span>
              <span className="font-semibold text-blue-600">+{scoreBreakdown.efficiencyBonus}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Final Score:</span>
              <span className="text-green-600">{scoreBreakdown.finalScore}</span>
            </div>
          </div>
        </div>

        {/* Collected Words */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Words Collected</h3>
          
          {/* Target Words */}
          <div className="mb-4">
            <h4 className="text-lg font-medium text-green-700 mb-2">
              ✅ Target Words ({correctWords.length})
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {correctWords.map((collectedWord, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-800">
                      {collectedWord.word.text.toUpperCase()}
                    </span>
                    <span className="text-sm text-green-600">
                      +{GAME_CONFIG.SCORING.WORD_COMPLETION_BONUS} points
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distractor Words */}
          {incorrectWords.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-red-700 mb-2">
                ❌ Distractor Words ({incorrectWords.length})
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {incorrectWords.map((collectedWord, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-red-800">
                        {collectedWord.word.text.toUpperCase()}
                      </span>
                      <span className="text-sm text-red-600">
                        Not part of theme
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Play Again Button */}
            <button
              onClick={onPlayAgain}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🔄 Play Again (Same Theme)
            </button>

            {/* Theme Selection */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Or try a different theme:</p>
              <div className="grid grid-cols-2 gap-2">
                {availableThemes.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => onThemeSelect(theme)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      theme === gameState.currentTheme.name
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                    }`}
                    disabled={theme === gameState.currentTheme.name}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
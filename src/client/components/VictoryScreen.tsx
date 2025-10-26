import React, { useState, useEffect } from 'react';
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
  const [showContent, setShowContent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [showWords, setShowWords] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setShowConfetti(true);
    const contentTimer = setTimeout(() => setShowContent(true), 300);
    const scoreTimer = setTimeout(() => setAnimateScore(true), 800);
    const wordsTimer = setTimeout(() => setShowWords(true), 1200);
    
    return () => {
      clearTimeout(contentTimer);
      clearTimeout(scoreTimer);
      clearTimeout(wordsTimer);
    };
  }, []);
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

  // Get theme-based colors
  const getThemeColors = () => {
    switch (gameState.currentTheme.category.toLowerCase()) {
      case 'animals':
        return 'from-amber-500 to-orange-500';
      case 'colors':
        return 'from-pink-500 to-purple-500';
      case 'food':
        return 'from-red-500 to-pink-500';
      case 'sports':
        return 'from-blue-500 to-indigo-500';
      case 'nature':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-green-500 to-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Confetti background */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#ef4444'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className={`bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 ${
        showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${getThemeColors()} text-white p-6 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold animate-victory-celebration">🎉 Victory!</h2>
              <p className="text-lg opacity-90 animate-bounce">You found all the words!</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold transition-transform hover:scale-110"
            >
              ×
            </button>
          </div>
        </div>

        {/* Theme Reveal */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <span className="animate-pulse">🎯</span>
            Theme Revealed
          </h3>
          <div className={`bg-gradient-to-r ${getThemeColors()} rounded-lg p-4 transform transition-all duration-500 ${
            showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <div className="text-3xl font-bold text-white text-center animate-pulse">
              {gameState.currentTheme.category}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="animate-bounce">📊</span>
            Game Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 transform transition-all duration-500 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="text-sm text-blue-600 font-medium">Time</div>
              <div className="text-xl font-bold text-blue-800">{formatTime(gameTime)}</div>
            </div>
            <div className={`bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 transform transition-all duration-500 delay-100 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="text-sm text-purple-600 font-medium">Snake Length</div>
              <div className="text-xl font-bold text-purple-800 animate-pulse">{gameState.snake.length}</div>
            </div>
            <div className={`bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200 transform transition-all duration-500 delay-200 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="text-sm text-red-600 font-medium">Wrong Letters</div>
              <div className="text-xl font-bold text-red-800">{gameState.wrongLetterCount}</div>
            </div>
            <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 transform transition-all duration-500 delay-300 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="text-sm text-green-600 font-medium">Difficulty</div>
              <div className="text-xl font-bold text-green-800 capitalize">{gameState.difficulty.level}</div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="animate-bounce">🏆</span>
            Score Breakdown
          </h3>
          <div className="space-y-3">
            <div className={`flex justify-between p-2 rounded transition-all duration-500 ${
              animateScore ? 'bg-gray-50' : 'bg-transparent'
            }`}>
              <span>Base Score:</span>
              <span className="font-semibold">{scoreBreakdown.baseScore}</span>
            </div>
            <div className={`flex justify-between p-2 rounded transition-all duration-500 delay-200 ${
              animateScore ? 'bg-green-50' : 'bg-transparent'
            }`}>
              <span>Time Bonus:</span>
              <span className="font-semibold text-green-600 animate-pulse">+{scoreBreakdown.timeBonus}</span>
            </div>
            <div className={`flex justify-between p-2 rounded transition-all duration-500 delay-400 ${
              animateScore ? 'bg-blue-50' : 'bg-transparent'
            }`}>
              <span>Efficiency Bonus:</span>
              <span className="font-semibold text-blue-600 animate-pulse">+{scoreBreakdown.efficiencyBonus}</span>
            </div>
            <div className={`border-t pt-3 flex justify-between text-xl font-bold p-3 rounded-lg transition-all duration-700 delay-600 ${
              animateScore ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 animate-word-complete-glow' : 'bg-transparent'
            }`}>
              <span>Final Score:</span>
              <span className="text-green-600 animate-bounce">{scoreBreakdown.finalScore}</span>
            </div>
          </div>
        </div>

        {/* Collected Words */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Words Collected</h3>
          
          {/* Target Words */}
          <div className="mb-4">
            <h4 className="text-lg font-medium text-green-700 mb-2 flex items-center gap-2">
              <span className="animate-bounce">✅</span>
              Target Words ({correctWords.length})
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {correctWords.map((collectedWord, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-3 transform transition-all duration-500 animate-word-complete-glow ${
                    showWords ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-800 text-lg">
                      {collectedWord.word.text.toUpperCase()}
                    </span>
                    <span className="text-sm text-green-600 font-medium animate-pulse">
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
              <h4 className="text-lg font-medium text-orange-700 mb-2 flex items-center gap-2">
                <span>⚠️</span>
                Distractor Words ({incorrectWords.length})
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {incorrectWords.map((collectedWord, index) => (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-3 transform transition-all duration-500 ${
                      showWords ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${(correctWords.length + index) * 200}ms` }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-orange-800">
                        {collectedWord.word.text.toUpperCase()}
                      </span>
                      <span className="text-sm text-orange-600 font-medium">
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
              className={`w-full bg-gradient-to-r ${getThemeColors()} hover:shadow-lg text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
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
                    className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      theme === gameState.currentTheme.name
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-800 hover:shadow-md'
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
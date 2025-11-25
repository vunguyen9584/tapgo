import React from 'react';
import type { Quote } from '../../types/quotes';

interface DifficultySelectorProps {
  selectedDifficulty: Quote['difficulty'] | 'all';
  onDifficultyChange: (difficulty: Quote['difficulty'] | 'all') => void;
  disabled?: boolean;
}

export default function DifficultySelector({ 
  selectedDifficulty, 
  onDifficultyChange, 
  disabled = false 
}: DifficultySelectorProps) {
  const difficulties: (Quote['difficulty'] | 'all')[] = ['all', 'easy', 'medium', 'hard'];
  
  const getDifficultyStyles = (difficulty: Quote['difficulty'] | 'all') => {
    if (difficulty === 'all') {
      return selectedDifficulty === 'all'
        ? 'bg-gray-600 text-white border-gray-600'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
    }
    
    if (difficulty === 'easy') {
      return selectedDifficulty === 'easy'
        ? 'bg-green-600 text-white border-green-600'
        : 'bg-white text-gray-700 border-green-300 hover:bg-green-50';
    }
    
    if (difficulty === 'medium') {
      return selectedDifficulty === 'medium'
        ? 'bg-yellow-600 text-white border-yellow-600'
        : 'bg-white text-gray-700 border-yellow-300 hover:bg-yellow-50';
    }
    
    // hard
    return selectedDifficulty === 'hard'
      ? 'bg-red-600 text-white border-red-600'
      : 'bg-white text-gray-700 border-red-300 hover:bg-red-50';
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Difficulty:</span>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            type="button"
            disabled={disabled}
            onClick={() => onDifficultyChange(difficulty)}
            className={`
              px-3 py-2 text-sm font-medium border-t border-b border-l transition-colors duration-200
              ${getDifficultyStyles(difficulty)}
              ${difficulty === difficulties[difficulties.length - 1] ? 'rounded-r-md' : ''}
              ${difficulty === difficulties[0] ? 'rounded-l-md' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

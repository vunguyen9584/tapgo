import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../lib/i18n';
import { saveProgress } from '../lib/firebase';
import type { User } from 'firebase/auth';

interface TypingStats {
  wpm: number;
  accuracy: number;
  time: number;
  errors: number;
  characters: number;
  correctChars: number;
}

interface Props {
  user?: import('firebase/auth').User | null;
}

const numberExercises = [
  {
    id: 'basic_numbers',
    title: 'basicNumbers',
    description: 'basicNumbersDescription',
    content: '1234567890',
    difficulty: 'easy',
  },
  {
    id: 'phone_numbers',
    title: 'phoneNumbers',
    description: 'phoneNumbersDescription',
    content: '555-123-4567',
    difficulty: 'easy',
  },
  {
    id: 'decimal_numbers',
    title: 'decimalNumbers',
    description: 'decimalNumbersDescription',
    content: '3.14159 2.71828 1.41421',
    difficulty: 'medium',
  },
  {
    id: 'mathematical',
    title: 'mathematical',
    description: 'mathematicalDescription',
    content: '2+2=4 5*5=25 10/2=5',
    difficulty: 'medium',
  },
  {
    id: 'financial',
    title: 'financial',
    description: 'financialDescription',
    content: '$1,234.56 $98,765.43 $0.99',
    difficulty: 'hard',
  },
  {
    id: 'mixed',
    title: 'mixed',
    description: 'mixedDescription',
    content: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7',
    difficulty: 'hard',
  },
];

export default function NumbersMode({ user }: Props) {
  const { t } = useI18n();
  const [selectedExercise, setSelectedExercise] = useState(numberExercises[0]);
  const [userInput, setUserInput] = useState('');
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    time: 0,
    errors: 0,
    characters: 0,
    correctChars: 0,
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);

  const currentContent = selectedExercise?.content || '';

  const startTest = () => {
    if (!currentContent) return;
    
    setUserInput('');
    setIsTestActive(true);
    setIsTestComplete(false);
    setStats({
      wpm: 0,
      accuracy: 0,
      time: 0,
      errors: 0,
      characters: 0,
      correctChars: 0,
    });
    startTimeRef.current = Date.now();
    inputRef.current?.focus();
  };

  const completeTest = () => {
    if (!startTimeRef.current) return;
    
    const endTime = Date.now();
    const timeElapsed = (endTime - startTimeRef.current) / 1000 / 60; // in minutes
    
    // Calculate stats
    const characters = userInput.length;
    const errors = calculateErrors(userInput, currentContent);
    const correctChars = characters - errors;
    const accuracy = characters > 0 ? Math.round((correctChars / characters) * 100) : 0;
    const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0;
    
    const finalStats: TypingStats = {
      wpm,
      accuracy,
      time: timeElapsed * 60, // convert back to seconds
      errors,
      characters,
      correctChars,
    };
    
    setStats(finalStats);
    setIsTestActive(false);
    setIsTestComplete(true);
    
    // Save progress if user is logged in
    if (user) {
      saveProgress(user.uid, {
        lessons: {
          [`numbers_${selectedExercise?.id}_${Date.now()}`]: {
            id: `numbers_${selectedExercise?.id}_${Date.now()}`,
            completed: true,
            wpm,
            accuracy,
            duration: timeElapsed * 60,
            errors,
            completedAt: new Date().toISOString(),
            attempts: 1,
            bestWpm: wpm,
            bestAccuracy: accuracy,
          }
        }
      });
    }
  };

  const calculateErrors = (input: string, target: string): number => {
    let errors = 0;
    const minLength = Math.min(input.length, target.length);
    
    for (let i = 0; i < minLength; i++) {
      if (input[i] !== target[i]) {
        errors++;
      }
    }
    
    return errors;
  };

  const resetTest = () => {
    setIsTestActive(false);
    setIsTestComplete(false);
    setStats({
      wpm: 0,
      accuracy: 0,
      time: 0,
      errors: 0,
      characters: 0,
      correctChars: 0,
    });
    startTimeRef.current = null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!isTestActive && value.length > 0) {
      startTest();
    }
    
    setUserInput(value);
    
    // Check if test is complete
    if (value === currentContent && isTestActive) {
      completeTest();
    }
  };

  const handleExerciseSelect = (exercise: typeof numberExercises[0]) => {
    setSelectedExercise(exercise);
    resetTest();
  };

  // Timer effect
  useEffect(() => {
    if (!isTestActive || !startTimeRef.current) return;
    
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current!) / 1000;
      // Auto-complete after 2 minutes
      if (elapsed >= 120) {
        completeTest();
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isTestActive]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('numbersMode')}</h1>
        <p className="text-gray-600">{t('numbersModeDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exercise Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('selectExercise')}</h2>
          
          <div className="space-y-3">
            {numberExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleExerciseSelect(exercise)}
                className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                  selectedExercise?.id === exercise.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{t(exercise.title)}</h3>
                    <p className="text-sm text-gray-600 mt-1">{t(exercise.description)}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                    {t(exercise.difficulty)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Typing Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t(selectedExercise.title)}</h2>
            <div className={`px-3 py-1 rounded text-sm font-medium ${getDifficultyColor(selectedExercise.difficulty)}`}>
              {t(selectedExercise?.difficulty || 'easy')}
            </div>
          </div>

          {/* Target Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('targetText')}</h3>
            <div className="text-2xl font-mono tracking-wider text-gray-900 break-all">
              {currentContent}
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-4">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder={t('startTyping')}
              className="w-full p-4 text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTestComplete}
            />
          </div>

          {/* Timer Display */}
          {isTestActive && (
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-blue-600">
                {Math.max(0, 120 - Math.floor((Date.now() - startTimeRef.current!) / 1000))}s
              </div>
            </div>
          )}

          {/* Results */}
          {isTestComplete && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">{t('results')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.wpm}</div>
                  <div className="text-sm text-gray-600">{t('wpmUnit')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
                  <div className="text-sm text-gray-600">{t('accuracy')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(stats.time)}s</div>
                  <div className="text-sm text-gray-600">{t('time')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                  <div className="text-sm text-gray-600">{t('errors')}</div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-4">
                <button
                  onClick={startTest}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
                >
                  {t('tryAgain')}
                </button>
                <button
                  onClick={() => handleExerciseSelect(numberExercises[(numberExercises.findIndex(e => e.id === selectedExercise?.id) + 1) % numberExercises.length] || numberExercises[0])}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
                >
                  {t('nextExercise')}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={startTest}
              disabled={!currentContent || isTestActive}
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isTestActive ? t('testing') : t('startTest')}
            </button>
            <button
              onClick={resetTest}
              className="bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
            >
              {t('reset')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
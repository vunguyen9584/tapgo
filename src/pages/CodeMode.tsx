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

const codeExercises = [
  {
    id: 'html_tags',
    title: 'htmlTags',
    description: 'htmlTagsDescription',
    content: '<div className="container"> <header> <nav> </nav> </header> <main> <section> <article> </article> </section> </main> <footer> </footer> </div>',
    difficulty: 'easy',
    language: 'html',
  },
  {
    id: 'css_properties',
    title: 'cssProperties',
    description: 'cssPropertiesDescription',
    content: 'display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 2rem; border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
    difficulty: 'medium',
    language: 'css',
  },
  {
    id: 'javascript_functions',
    title: 'javascriptFunctions',
    description: 'javascriptFunctionsDescription',
    content: 'function calculateTotal(items, tax) { const subtotal = items.reduce((sum, item) => sum + item.price, 0); return subtotal * (1 + tax); }',
    difficulty: 'medium',
    language: 'javascript',
  },
  {
    id: 'python_classes',
    title: 'pythonClasses',
    description: 'pythonClassesDescription',
    content: 'class TypingPractice: def __init__(self): self.wpm = 0; self.accuracy = 0; def practice(self, text): pass',
    difficulty: 'medium',
    language: 'python',
  },
  {
    id: 'sql_queries',
    title: 'sqlQueries',
    description: 'sqlQueriesDescription',
    content: 'SELECT users.name, COUNT(orders.id) FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE orders.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY);',
    difficulty: 'hard',
    language: 'sql',
  },
  {
    id: 'json_structure',
    title: 'jsonStructure',
    description: 'jsonStructureDescription',
    content: '{ "user": { "id": 123, "name": "John", "email": "john@example.com", "roles": ["admin", "user"] }, "settings": { "theme": "dark", "notifications": true } }',
    difficulty: 'medium',
    language: 'json',
  },
  {
    id: 'react_components',
    title: 'reactComponents',
    description: 'reactComponentsDescription',
    content: 'const Button = ({ onClick, children, variant = "primary" }) => { return <button onClick={onClick} className={`btn btn-${variant}`}>{children}</button>; };',
    difficulty: 'hard',
    language: 'javascript',
  },
  {
    id: 'api_endpoints',
    title: 'apiEndpoints',
    description: 'apiEndpointsDescription',
    content: 'GET /api/users/:id - Retrieve user information\nPOST /api/users - Create new user\nPUT /api/users/:id - Update user information\nDELETE /api/users/:id - Delete user',
    difficulty: 'hard',
    language: 'http',
  },
];

export default function CodeMode({ user }: Props) {
  const { t } = useI18n();
  const [selectedExercise, setSelectedExercise] = useState(codeExercises[0]);
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
          [`code_${selectedExercise?.id}_${Date.now()}`]: {
            id: `code_${selectedExercise?.id}_${Date.now()}`,
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

  const handleExerciseSelect = (exercise: typeof codeExercises[0]) => {
    setSelectedExercise(exercise);
    resetTest();
  };

  // Timer effect
  useEffect(() => {
    if (!isTestActive || !startTimeRef.current) return;
    
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current!) / 1000;
      // Auto-complete after 5 minutes for code
      if (elapsed >= 300) {
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

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'html': return 'bg-orange-100 text-orange-700';
      case 'css': return 'bg-blue-100 text-blue-700';
      case 'javascript': return 'bg-yellow-100 text-yellow-700';
      case 'python': return 'bg-green-100 text-green-700';
      case 'sql': return 'bg-purple-100 text-purple-700';
      case 'json': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('codeMode')}</h1>
        <p className="text-gray-600">{t('codeModeDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exercise Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('selectExercise')}</h2>
          
          <div className="space-y-3">
            {codeExercises.map((exercise) => (
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
                  <div className="flex gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {t(exercise.difficulty)}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(exercise.language)}`}>
                      {exercise.language.toUpperCase()}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Typing Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t(selectedExercise?.title || '')}</h2>
            <div className="flex gap-2">
              <div className={`px-3 py-1 rounded text-sm font-medium ${getDifficultyColor(selectedExercise?.difficulty || 'easy')}`}>
                {t(selectedExercise?.difficulty || 'easy')}
              </div>
              <div className={`px-3 py-1 rounded text-xs font-medium ${getLanguageColor(selectedExercise?.language || 'html')}`}>
                {selectedExercise?.language?.toUpperCase() || 'HTML'}
              </div>
            </div>
          </div>

          {/* Code Display */}
          <div className="mb-6 p-4 bg-gray-900 rounded-lg overflow-x-auto">
            <pre className="text-green-400 font-mono text-sm leading-relaxed">
              <code>{currentContent}</code>
            </pre>
          </div>

          {/* Input Field */}
          <div className="mb-4">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder={t('startTyping')}
              className="w-full p-4 text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-900 text-green-400"
              disabled={isTestComplete}
            />
          </div>

          {/* Timer Display */}
          {isTestActive && (
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-blue-600">
                {Math.max(0, 300 - Math.floor((Date.now() - startTimeRef.current!) / 1000))}s
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
                  onClick={() => {
                    const currentIndex = selectedExercise ? codeExercises.findIndex(e => e.id === selectedExercise.id) : -1;
                    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % codeExercises.length : 0;
                    const nextExercise = codeExercises[nextIndex];
                    if (nextExercise) {
                      handleExerciseSelect(nextExercise);
                    }
                  }}
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
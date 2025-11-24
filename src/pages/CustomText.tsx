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

const sampleTexts = [
  {
    title: 'The Quick Brown Fox',
    text: 'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.',
    difficulty: 'easy',
    category: 'classic',
  },
  {
    title: 'Technology Quote',
    text: 'The advance of technology is based on making it fit in so that you can find it easily.',
    difficulty: 'medium',
    category: 'quotes',
  },
  {
    title: 'Programming Code',
    text: 'function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price, 0); }',
    difficulty: 'hard',
    category: 'code',
  },
  {
    title: 'Legal Document',
    text: 'This agreement is made and entered into on this date by and between the parties named herein.',
    difficulty: 'medium',
    category: 'legal',
  },
  {
    title: 'Scientific Text',
    text: 'Photosynthesis is the process by which green plants, algae, and some bacteria, convert light energy into chemical energy.',
    difficulty: 'hard',
    category: 'science',
  },
];

export default function CustomText({ user }: Props) {
  const { t } = useI18n();
  const [customText, setCustomText] = useState('');
  const [selectedSample, setSelectedSample] = useState(sampleTexts[0]);
  const [timeLimit, setTimeLimit] = useState(60);
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
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number | null>(null);

  const currentText = customText || selectedSample?.text || '';

  // Calculate text difficulty
  const analyzeTextDifficulty = (text: string) => {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const uniqueChars = new Set(text.toLowerCase().replace(/\s/g, '')).size;
    const totalChars = text.replace(/\s/g, '').length;
    
    let difficulty = 'easy';
    let difficultyScore = 0;
    
    // Word length factor
    if (avgWordLength > 6) difficultyScore += 2;
    else if (avgWordLength > 4) difficultyScore += 1;
    
    // Character variety factor
    if (uniqueChars / totalChars > 0.7) difficultyScore += 1;
    
    // Special characters factor
    const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    difficultyScore += Math.min(specialChars / 10, 2);
    
    if (difficultyScore >= 4) difficulty = 'hard';
    else if (difficultyScore >= 2) difficulty = 'medium';
    
    return { difficulty, score: difficultyScore };
  };

  const textDifficulty = analyzeTextDifficulty(currentText);

  const startTest = () => {
    if (!currentText.trim()) return;
    
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
  };

  const completeTest = () => {
    if (!startTimeRef.current) return;
    
    const endTime = Date.now();
    const timeElapsed = (endTime - startTimeRef.current) / 1000 / 60; // in minutes
    
    // Calculate stats
    const characters = currentText.length;
    const errors = 0; // This would need error tracking implementation
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
          [`custom_${Date.now()}`]: {
            id: `custom_${Date.now()}`,
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomText(e.target.value);
    resetTest();
  };

  const handleSampleSelect = (sample: typeof sampleTexts[0]) => {
    setSelectedSample(sample);
    setCustomText('');
    resetTest();
  };

  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeLimit(parseInt(e.target.value) || 60);
    resetTest();
  };

  // Timer effect
  useEffect(() => {
    if (!isTestActive || !startTimeRef.current) return;
    
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current!) / 1000;
      if (elapsed >= timeLimit) {
        completeTest();
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isTestActive, timeLimit]);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('customText')}</h1>
        <p className="text-gray-600">{t('customTextDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text Input Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('textInput')}</h2>
          
          {/* Sample Text Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('sampleTexts')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleTexts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleSelect(sample)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                    selectedSample === sample
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">{sample.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{sample.category}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${getDifficultyColor(sample.difficulty)}`}>
                    {t(sample.difficulty)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('yourText')}
            </label>
            <textarea
              ref={textAreaRef}
              value={customText}
              onChange={handleTextChange}
              placeholder={t('enterCustomText')}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Text Analysis */}
          {customText && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('textAnalysis')}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{t('characterCount')}:</span>
                  <span className="font-medium">{customText.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t('wordCount')}:</span>
                  <span className="font-medium">{customText.split(/\s+/).filter(word => word.length > 0).length}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t('difficulty')}:</span>
                  <span className={`font-medium px-2 py-1 rounded ${getDifficultyColor(textDifficulty.difficulty)}`}>
                    {t(textDifficulty.difficulty)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">{t('estimatedTime')}:</span>
                  <span className="font-medium">{Math.ceil(customText.length / 200)} {t('minutes')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Time Limit */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('timeLimit')}
            </label>
            <select
              value={timeLimit}
              onChange={handleTimeLimitChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={30}>30 {t('seconds')}</option>
              <option value={60}>1 {t('minute')}</option>
              <option value={120}>2 {t('minutes')}</option>
              <option value={300}>5 {t('minutes')}</option>
              <option value={600}>10 {t('minutes')}</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={startTest}
              disabled={!currentText.trim() || isTestActive}
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

        {/* Typing Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('typingArea')}</h2>
          
          {/* Text Display */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-lg leading-relaxed font-mono">
              {currentText || t('selectTextAbove')}
            </p>
          </div>

          {/* Input Field */}
          <textarea
            placeholder={t('startTyping')}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-lg"
            disabled={!isTestActive}
          />

          {/* Timer Display */}
          {isTestActive && (
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.max(0, timeLimit - Math.floor((Date.now() - startTimeRef.current!) / 1000))}s
              </div>
            </div>
          )}

          {/* Results */}
          {isTestComplete && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
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
                  onClick={resetTest}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
                >
                  {t('newText')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
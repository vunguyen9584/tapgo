import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../lib/i18n';
import { saveProgress } from '../lib/firebase';

type TestMode = 'time' | 'words' | 'custom';
type Difficulty = 'easy' | 'medium' | 'hard';

type TestResult = {
  wpm: number;
  accuracy: number;
  time: number;
  errors: number;
  characters: number;
  correctChars: number;
};

type TestHistory = TestResult & {
  date: Date;
  mode: TestMode;
  difficulty: Difficulty;
};

const sampleTexts = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "Where there is a will, there is a way."
  ],
  medium: [
    "In the midst of winter, I found there was, within me, an invincible summer.",
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop."
  ],
  hard: [
    "The impediment to action advances action. What stands in the way becomes the way.",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    "The mind is everything. What you think you become. Imagine with your entire being.",
    "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    "Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship."
  ]
};

export default function Test() {
  const { t } = useI18n();
  const [mode, setMode] = useState<TestMode>('time');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timeLimit, setTimeLimit] = useState(60);
  const [wordLimit, setWordLimit] = useState(50);
  const [customText, setCustomText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load test history from localStorage
    try {
      const saved = localStorage.getItem('km_test_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTestHistory(parsed.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        })));
      }
    } catch (error) {
      console.error('Failed to load test history:', error);
    }
  }, []);

  useEffect(() => {
    // Select text based on mode and difficulty
    if (mode === 'custom' && customText) {
      setCurrentText(customText);
    } else if (mode === 'words') {
      const texts = sampleTexts[difficulty];
      const selectedText = texts[Math.floor(Math.random() * texts.length)] || '';
      // Limit to specified word count
      const words = selectedText.split(' ').slice(0, wordLimit).join(' ');
      setCurrentText(words);
    } else {
      const texts = sampleTexts[difficulty];
      setCurrentText(texts[Math.floor(Math.random() * texts.length)] || '');
    }
  }, [mode, difficulty, wordLimit, customText]);

  useEffect(() => {
    if (isTestActive && !endTime) {
      const timer = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - (startTime || now)) / 1000;
        
        if (mode === 'time' && elapsed >= timeLimit) {
          completeTest();
        }
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [isTestActive, startTime, endTime, mode, timeLimit]);

  const startTest = () => {
    if (!currentText) return;
    
    setUserInput('');
    setStartTime(Date.now());
    setEndTime(null);
    setIsTestActive(true);
    setIsTestComplete(false);
    setTestResult(null);
    inputRef.current?.focus();
  };

  const completeTest = () => {
    const end = Date.now();
    setEndTime(end);
    setIsTestActive(false);
    setIsTestComplete(true);
    
    const timeElapsed = (end - (startTime || end)) / 1000;
    const characters = userInput.length;
    const correctChars = calculateCorrectChars();
    const errors = characters - correctChars;
    const accuracy = characters > 0 ? Math.round((correctChars / characters) * 100) : 0;
    const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
    
    const result: TestResult = {
      wpm,
      accuracy,
      time: timeElapsed,
      errors,
      characters,
      correctChars
    };
    
    setTestResult(result);
    
    // Save to history
    const historyItem: TestHistory = {
      ...result,
      date: new Date(),
      mode,
      difficulty
    };
    
    const newHistory = [historyItem, ...testHistory].slice(0, 50); // Keep last 50 tests
    setTestHistory(newHistory);
    localStorage.setItem('km_test_history', JSON.stringify(newHistory));
  };

  const calculateCorrectChars = () => {
    let correct = 0;
    for (let i = 0; i < userInput.length && i < currentText.length; i++) {
      if (userInput[i] === currentText[i]) {
        correct++;
      }
    }
    return correct;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!isTestActive && value.length > 0) {
      startTest();
    }
    
    setUserInput(value);
    
    // Check if test is complete for word mode
    if (mode === 'words' && value.trim().split(' ').length >= wordLimit) {
      completeTest();
    }
    
    // Check if test is complete for custom text
    if (mode === 'custom' && value === currentText) {
      completeTest();
    }
  };

  const resetTest = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsTestActive(false);
    setIsTestComplete(false);
    setTestResult(null);
    setShowCertificate(false);
  };

  const downloadCertificate = () => {
    if (!testResult) return;
    
    const certificate = `
      ========================================
      KEYBOARD MASTER TYPING CERTIFICATE
      ========================================
      
      This certifies that the user has achieved:
      
      Speed: ${testResult.wpm} WPM
      Accuracy: ${testResult.accuracy}%
      Time: ${testResult.time.toFixed(1)} seconds
      
      Test Mode: ${mode}
      Difficulty: ${difficulty}
      Date: ${new Date().toLocaleDateString()}
      
      ========================================
    `;
    
    const blob = new Blob([certificate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typing-certificate-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCharacter = (char: string, index: number) => {
    let className = 'text-gray-600';
    
    if (index < userInput.length) {
      className = userInput[index] === char ? 'text-green-600' : 'text-red-600 bg-red-100';
    } else if (index === userInput.length) {
      className = 'bg-blue-200 text-blue-800';
    }
    
    return (
      <span key={index} className={className}>
        {char}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('test')}</h1>

      {/* Test Configuration */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('testConfiguration')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('testMode')}
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as TestMode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="time">{t('timeBased')}</option>
              <option value="words">{t('wordBased')}</option>
              <option value="custom">{t('customText')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('difficulty')}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">{t('easy')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="hard">{t('hard')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'time' ? t('timeLimit') : mode === 'words' ? t('wordLimit') : t('customText')}
            </label>
            {mode === 'time' && (
              <input
                type="number"
                min="10"
                max="300"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            {mode === 'words' && (
              <input
                type="number"
                min="10"
                max="200"
                value={wordLimit}
                onChange={(e) => setWordLimit(parseInt(e.target.value) || 50)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            {mode === 'custom' && (
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={t('enterCustomText')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            )}
          </div>
        </div>

        <button
          onClick={resetTest}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t('startNewTest')}
        </button>
      </div>

      {/* Test Area */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4 text-lg font-mono leading-relaxed">
          {currentText.split('').map((char, index) => renderCharacter(char, index))}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder={t('startTypingToBegin')}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isTestComplete}
        />

        {isTestActive && (
          <div className="mt-4 text-sm text-gray-600">
            {t('timeElapsed')}: {((Date.now() - (startTime || Date.now())) / 1000).toFixed(1)}s
          </div>
        )}
      </div>

      {/* Results */}
      {isTestComplete && testResult && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('results')}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{testResult.wpm}</div>
              <div className="text-sm text-gray-600">{t('wpmUnit')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{testResult.accuracy}%</div>
              <div className="text-sm text-gray-600">{t('accuracy')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{testResult.time.toFixed(1)}s</div>
              <div className="text-sm text-gray-600">{t('time')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{testResult.errors}</div>
              <div className="text-sm text-gray-600">{t('errors')}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t('tryAgain')}
            </button>
            <button
              onClick={() => setShowCertificate(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {t('generateCertificate')}
            </button>
          </div>
        </div>
      )}

      {/* Certificate */}
      {showCertificate && testResult && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('certificate')}</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
            {`
========================================
KEYBOARD MASTER TYPING CERTIFICATE
========================================

This certifies that the user has achieved:

Speed: ${testResult.wpm} WPM
Accuracy: ${testResult.accuracy}%
Time: ${testResult.time.toFixed(1)} seconds

Test Mode: ${mode}
Difficulty: ${difficulty}
Date: ${new Date().toLocaleDateString()}

========================================
            `}
          </pre>
          <button
            onClick={downloadCertificate}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t('downloadCertificate')}
          </button>
        </div>
      )}

      {/* Test History */}
      {testHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('testHistory')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">{t('date')}</th>
                  <th className="text-left py-2">{t('mode')}</th>
                  <th className="text-left py-2">{t('difficulty')}</th>
                  <th className="text-left py-2">{t('wpmUnit')}</th>
                  <th className="text-left py-2">{t('accuracy')}</th>
                  <th className="text-left py-2">{t('time')}</th>
                </tr>
              </thead>
              <tbody>
                {testHistory.slice(0, 10).map((test, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{test.date.toLocaleDateString()}</td>
                    <td className="py-2">{test.mode}</td>
                    <td className="py-2">{test.difficulty}</td>
                    <td className="py-2">{test.wpm}</td>
                    <td className="py-2">{test.accuracy}%</td>
                    <td className="py-2">{test.time.toFixed(1)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
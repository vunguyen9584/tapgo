import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { TypingEngineProps, TypingSession, CharacterResult, TypingMetrics } from '../types/typing';

const TypingEngine: React.FC<TypingEngineProps> = ({
  targetText,
  onSessionComplete,
  duration = 60,
  enabled = true
}) => {
  const [typedText, setTypedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [characterResults, setCharacterResults] = useState<CharacterResult[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [showPasteMessage, setShowPasteMessage] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Generate unique session ID
  const sessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Focus input on mount and when enabled changes
  useEffect(() => {
    if (enabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [enabled]);

  // Calculate real-time metrics
  const calculateMetrics = useCallback((): TypingMetrics => {
    const correctChars = characterResults.filter(r => r.isCorrect).length;
    const incorrectChars = characterResults.filter(r => !r.isCorrect).length;
    const totalChars = characterResults.length;
    
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;
    
    let wpm = 0;
    let netWpm = 0;
    
    if (startTime && isSessionActive) {
      const timeElapsedMinutes = (Date.now() - startTime.getTime()) / 60000;
      if (timeElapsedMinutes > 0) {
        const wordsTyped = correctChars / 5;
        wpm = wordsTyped / timeElapsedMinutes;
        
        const netWords = Math.max(0, correctChars - incorrectChars) / 5;
        netWpm = netWords / timeElapsedMinutes;
      }
    }
    
    return {
      wpm: Math.round(wpm * 10) / 10,
      accuracy: Math.round(accuracy * 10) / 10,
      netWpm: Math.round(netWpm * 10) / 10,
      correctChars,
      incorrectChars,
      totalChars
    };
  }, [characterResults, startTime, isSessionActive]);

  const completeSession = useCallback(() => {
    if (!startTime || !isSessionActive) return;
    
    const endTime = new Date();
    const sessionData: TypingSession = {
      id: sessionId.current,
      userId: 'current-user',
      targetText,
      typedText: typedText,
      startTime,
      endTime,
      duration: Math.round((endTime.getTime() - startTime.getTime()) / 1000),
      isPaused: false,
      currentCharIndex: typedText.length
    };
    
    const metrics = calculateMetrics();
    setIsSessionActive(false);
    
    onSessionComplete(sessionData, metrics);
  }, [startTime, isSessionActive, targetText, typedText, calculateMetrics, onSessionComplete]);

  // Validate and process character input
  const processCharacter = useCallback((newChar: string, position: number): boolean => {
    if (position >= targetText.length) return false;
    
    const targetChar = targetText[position];
    const isCorrect = newChar === targetChar;
    
    const result: CharacterResult = {
      char: newChar,
      isCorrect,
      position,
      timestamp: Date.now()
    };
    
    setCharacterResults(prev => [...prev, result]);
    
    if (!isCorrect) {
      setErrorCount(prev => prev + 1);
    }
    
    return isCorrect;
  }, [targetText]);

  // Handle typing input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!enabled || !targetText) return;
    
    const newTypedText = e.target.value.slice(0, targetText.length);
    
    if (!isSessionActive && newTypedText.length > 0 && typedText.length === 0) {
      setStartTime(new Date());
      setIsSessionActive(true);
    } else if (isSessionActive && newTypedText.length === 0) {
      setIsSessionActive(false);
      setStartTime(null);
    }
    
    setTypedText(newTypedText);
    setCurrentCharIndex(newTypedText.length);
    
    if (newTypedText.length < typedText.length) {
      setCharacterResults(prev => {
        const newCharacterResults = prev.slice(0, newTypedText.length);
        const newErrorCount = newCharacterResults.filter(r => !r.isCorrect).length;
        setErrorCount(newErrorCount);
        return newCharacterResults;
      });
    } else if (newTypedText.length > typedText.length) {
      const startIndex = typedText.length;
      for (let i = startIndex; i < newTypedText.length; i++) {
        const char = newTypedText[i];
        if (char) {
          processCharacter(char, i);
        }
      }
    }
  }, [enabled, targetText, typedText, isSessionActive, processCharacter]);

  // Handle session completion when text is fully typed
  useEffect(() => {
    if (isSessionActive && typedText.length === targetText.length) {
      completeSession();
    }
  }, [typedText, targetText, isSessionActive, completeSession]);

  // Handle timer completion
  useEffect(() => {
    if (!isSessionActive || !startTime) return;
    
    const timerDuration = duration * 1000;
    const elapsed = Date.now() - startTime.getTime();
    
    if (elapsed >= timerDuration) {
      completeSession();
    }
  }, [currentCharIndex, isSessionActive, startTime, duration, completeSession]);

  // Handle keyboard events for enhanced control
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!enabled) return;
    
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setShowPasteMessage(true);
        setTimeout(() => setShowPasteMessage(false), 2000);
        return;
      }
    }
    
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      return;
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      return;
    }
  }, [enabled]);

  // Block paste events
  const handlePaste = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    setShowPasteMessage(true);
    setTimeout(() => setShowPasteMessage(false), 2000);
  }, []);

  // Render character with appropriate styling
  const renderCharacter = (char: string, index: number) => {
    let className = 'text-gray-500';
    
    if (index < typedText.length) {
      const result = characterResults[index];
      if (result) {
        className = result.isCorrect ? 'text-green-400' : 'text-red-400';
      }
    } else if (index === currentCharIndex && isSessionActive) {
      className = 'bg-blue-500 text-white rounded px-0.5 transition-all duration-150';
    }
    
    return (
      <span 
        key={index} 
        className={className}
        role="char"
        aria-label={`Character ${char} at position ${index + 1}, ${index < typedText.length ? 'typed' : 'untyped'}`}
      >
        {char}
      </span>
    );
  };

  const currentMetrics = calculateMetrics();

  return (
    <div className="relative">
      <div 
        className="font-mono text-2xl leading-relaxed break-words mb-4 p-4 bg-gray-50 rounded-lg"
        role="textbox"
        aria-label="Typing practice text"
        aria-live="polite"
      >
        {targetText.split('').map((char, index) => renderCharacter(char, index))}
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg" role="status" aria-live="polite">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold">WPM:</span> {currentMetrics.wpm}
          </div>
          <div>
            <span className="font-semibold">Accuracy:</span> {currentMetrics.accuracy}%
          </div>
          <div>
            <span className="font-semibold">Errors:</span> {errorCount}
          </div>
        </div>
      </div>

      {showPasteMessage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <strong className="font-bold">Pasting is disabled!</strong>
          <span className="block sm:inline"> Please type the text manually.</span>
        </div>
      )}
      
      <textarea
        ref={inputRef}
        value={typedText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDrop={handlePaste}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default resize-none"
        disabled={!enabled}
        aria-label="Type here to practice"
        aria-describedby="typing-metrics"
      />
    </div>
  );
};

export default TypingEngine;
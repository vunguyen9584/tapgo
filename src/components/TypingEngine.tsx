import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { TypingEngineProps, TypingSession, CharacterResult, TypingMetrics, TimerState, SessionStatus } from '../types/typing';

const TypingEngine: React.FC<TypingEngineProps> = ({
  targetText,
  onSessionComplete,
  duration = 60,
  enabled = true,
  onTimerStart,
  onTimerPause,
  onTimerResume,
  onTimerComplete
}) => {
  const [typedText, setTypedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [characterResults, setCharacterResults] = useState<CharacterResult[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [showPasteMessage, setShowPasteMessage] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<TypingMetrics>({
    wpm: 0,
    accuracy: 100,
    netWpm: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0
  });
  const [timerState, setTimerState] = useState<TimerState>({
    remainingTime: duration,
    isRunning: false,
    isPaused: false,
    hasStarted: false,
    duration: duration
  });
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('not-started');
  const [showDurationSelector, setShowDurationSelector] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(duration);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Generate unique session ID
  const sessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Available duration options
  const durationOptions = [15, 30, 60, 120];

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle duration selection
  const handleDurationSelect = useCallback((newDuration: number) => {
    if (timerState.hasStarted) return; // Can't change duration after session starts
    
    setSelectedDuration(newDuration);
    setTimerState(prev => ({
      ...prev,
      duration: newDuration,
      remainingTime: newDuration
    }));
  }, [timerState.hasStarted]);

  // Start timer on first character input
  const startTimer = useCallback(() => {
    if (timerState.hasStarted) return;
    
    setTimerState(prev => ({
      ...prev,
      hasStarted: true,
      isRunning: true,
      isPaused: false,
      remainingTime: prev.duration
    }));
    setSessionStatus('in-progress');
    setShowDurationSelector(false);
    setStartTime(new Date());
    setIsSessionActive(true);
    
    if (onTimerStart) {
      onTimerStart();
    }
  }, [timerState.hasStarted, timerState.duration, onTimerStart]);

  // Pause timer (for sessions > 60 seconds)
  const pauseTimer = useCallback(() => {
    if (selectedDuration <= 60) return; // Only allow pause for sessions > 60 seconds
    if (!timerState.isRunning || timerState.isPaused) return;
    
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true
    }));
    setSessionStatus('paused');
    
    if (onTimerPause) {
      onTimerPause();
    }
  }, [selectedDuration, timerState.isRunning, timerState.isPaused, onTimerPause]);

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (!timerState.isPaused) return;
    
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false
    }));
    setSessionStatus('in-progress');
    
    if (onTimerResume) {
      onTimerResume();
    }
  }, [timerState.isPaused, onTimerResume]);

  // Complete timer/session
  const completeTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      hasStarted: true,
      remainingTime: 0
    }));
    setSessionStatus('completed');
    
    if (onTimerComplete) {
      onTimerComplete();
    }
  }, [onTimerComplete]);

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

  // Focus input on mount and when enabled changes
  useEffect(() => {
    if (enabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [enabled]);

  // Real-time metrics update with 100ms intervals
  useEffect(() => {
    if (!timerState.isRunning) {
      return;
    }

    const metricsUpdateInterval = setInterval(() => {
      const metrics = calculateMetrics();
      setCurrentMetrics(metrics);
    }, 100); // 100ms update frequency for smooth real-time display

    return () => {
      clearInterval(metricsUpdateInterval);
    };
  }, [timerState.isRunning, calculateMetrics]);

  // Timer countdown effect (1-second intervals)
  useEffect(() => {
    if (!timerState.isRunning) {
      return;
    }

    const timerInterval = setInterval(() => {
      setTimerState(prev => {
        if (prev.remainingTime <= 1) {
          // Timer expired
          completeTimer();
          return {
            ...prev,
            remainingTime: 0,
            isRunning: false
          };
        }
        
        return {
          ...prev,
          remainingTime: prev.remainingTime - 1
        };
      });
    }, 1000); // 1-second countdown

    return () => {
      clearInterval(timerInterval);
    };
  }, [timerState.isRunning, completeTimer]);

  // Update metrics immediately when character results change
  useEffect(() => {
    const metrics = calculateMetrics();
    setCurrentMetrics(metrics);
  }, [characterResults, calculateMetrics]);

  const completeSession = useCallback(() => {
    if (!startTime) return;
    
    completeTimer();
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
  }, [startTime, targetText, typedText, calculateMetrics, onSessionComplete, completeTimer]);

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
    
    // Auto-start timer on first character input (non-character keys won't trigger this)
    if (!timerState.hasStarted && newTypedText.length > 0 && typedText.length === 0) {
      // Only start on actual character input, not control keys
      const firstChar = newTypedText[newTypedText.length - 1];
      if (firstChar && firstChar.length === 1 && (!/[^\x20-\x7E]/.test(firstChar) || /[a-zA-Z0-9\s.,!?;:'"-]/.test(firstChar))) {
        startTimer();
      }
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
  }, [enabled, targetText, typedText, timerState.hasStarted, startTimer, processCharacter]);

  // Handle session completion when text is fully typed
  useEffect(() => {
    if (timerState.hasStarted && typedText.length === targetText.length) {
      completeSession();
    }
  }, [typedText, targetText, timerState.hasStarted, completeSession]);

  // Handle timer completion via countdown
  useEffect(() => {
    if (timerState.hasStarted && timerState.remainingTime === 0 && !timerState.isRunning) {
      completeSession();
    }
  }, [timerState.hasStarted, timerState.remainingTime, timerState.isRunning, completeSession]);

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
    } else if (index === currentCharIndex && timerState.hasStarted && !timerState.isPaused) {
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

  return (
    <div className="relative">
      {/* Duration Selector */}
      {showDurationSelector && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg" role="region" aria-label="Duration selection">
          <h3 className="text-lg font-semibold mb-3">Chọn thời gian luyện tập:</h3>
          <div className="grid grid-cols-4 gap-3">
            {durationOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleDurationSelect(option)}
                disabled={timerState.hasStarted}
                className={`p-3 rounded-lg font-medium transition-colors ${
                  selectedDuration === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                } ${timerState.hasStarted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-pressed={selectedDuration === option}
                aria-disabled={timerState.hasStarted}
              >
                {option}s
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timer Display */}
      {!showDurationSelector && (
        <div className={`mb-4 p-4 rounded-lg ${sessionStatus === 'paused' ? 'bg-yellow-50' : 'bg-green-50'}`} role="status" aria-live="polite">
          <div className="flex justify-between items-center">
            <div className="text-xl font-mono font-bold">
              {formatTime(timerState.remainingTime)}
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                sessionStatus === 'in-progress' ? 'bg-green-200 text-green-800' :
                sessionStatus === 'paused' ? 'bg-yellow-200 text-yellow-800' :
                'bg-gray-200 text-gray-800'
              }`}>
                {sessionStatus === 'in-progress' ? 'Đang diễn ra' :
                 sessionStatus === 'paused' ? 'Tạm dừng' :
                 'Chưa bắt đầu'}
              </span>
              {/* Pause/Resume controls for sessions > 60 seconds */}
              {selectedDuration > 60 && sessionStatus === 'in-progress' && (
                <button
                  onClick={pauseTimer}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                  aria-label="Tạm dừng phiên"
                >
                  Tạm dừng
                </button>
              )}
              {selectedDuration > 60 && sessionStatus === 'paused' && (
                <button
                  onClick={resumeTimer}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  aria-label="Tiếp tục phiên"
                >
                  Tiếp tục
                </button>
              )}
            </div>
          </div>
          {/* Time warning indicator */}
          {timerState.remainingTime <= 10 && timerState.remainingTime > 0 && sessionStatus === 'in-progress' && (
            <div className="mt-2 text-red-600 font-medium animate-pulse">
              ⚠️ Sắp hết thời gian!
            </div>
          )}
        </div>
      )}

      <div 
        className="font-mono text-2xl leading-relaxed break-words mb-4 p-4 bg-gray-50 rounded-lg"
        role="textbox"
        aria-label="Typing practice text"
        aria-live="polite"
      >
        {targetText.split('').map((char, index) => renderCharacter(char, index))}
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg" role="status" aria-live="polite">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-semibold">WPM:</span> {currentMetrics.wpm}
          </div>
          <div>
            <span className="font-semibold">Accuracy:</span> {currentMetrics.accuracy}%
          </div>
          <div>
            <span className="font-semibold">Net WPM:</span> {currentMetrics.netWpm}
          </div>
          <div>
            <span className="font-semibold">Errors:</span> {errorCount}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm mt-2">
          <div>
            <span className="font-semibold">Correct:</span> {currentMetrics.correctChars}
          </div>
          <div>
            <span className="font-semibold">Incorrect:</span> {currentMetrics.incorrectChars}
          </div>
          <div>
            <span className="font-semibold">Total:</span> {currentMetrics.totalChars}
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
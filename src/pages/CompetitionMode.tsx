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

interface Competitor {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  progress: number;
  avatar: string;
  isUser?: boolean;
}

interface RaceRoom {
  id: string;
  name: string;
  text: string;
  difficulty: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'waiting' | 'starting' | 'active' | 'finished';
  createdAt: Date;
}

interface Props {
  user?: import('firebase/auth').User | null;
}

const sampleTexts = [
  {
    id: 'short_easy',
    text: 'The quick brown fox jumps over the lazy dog near the river bank.',
    difficulty: 'easy',
    estimatedTime: 30,
  },
  {
    id: 'medium_medium',
    text: 'In the heart of the bustling city, where skyscrapers touch the clouds and streets never sleep, there exists a small coffee shop that serves the best espresso in town.',
    difficulty: 'medium',
    estimatedTime: 60,
  },
  {
    id: 'long_hard',
    text: 'Technology has revolutionized the way we communicate, work, and live our daily lives. From smartphones that connect us instantly to people across the globe, to artificial intelligence that can process vast amounts of information in seconds, we are witnessing unprecedented advancements that were once thought impossible.',
    difficulty: 'hard',
    estimatedTime: 120,
  },
];

const mockCompetitors: Competitor[] = [
  { id: '1', name: 'SpeedTypist99', wpm: 85, accuracy: 98, progress: 0, avatar: '🏃‍♂️' },
  { id: '2', name: 'CodeMaster', wpm: 92, accuracy: 96, progress: 0, avatar: '💻' },
  { id: '3', name: 'KeyboardNinja', wpm: 78, accuracy: 99, progress: 0, avatar: '🥷' },
  { id: '4', name: 'TypeKing', wpm: 88, accuracy: 97, progress: 0, avatar: '👑' },
];

const mockRooms: RaceRoom[] = [
  {
    id: 'room1',
    name: 'Beginner Race',
    text: sampleTexts[0]?.text || '',
    difficulty: 'easy',
    maxParticipants: 5,
    currentParticipants: 3,
    status: 'waiting',
    createdAt: new Date(),
  },
  {
    id: 'room2',
    name: 'Speed Challenge',
    text: sampleTexts[1]?.text || '',
    difficulty: 'medium',
    maxParticipants: 8,
    currentParticipants: 6,
    status: 'starting',
    createdAt: new Date(),
  },
  {
    id: 'room3',
    name: 'Pro Tournament',
    text: sampleTexts[2]?.text || '',
    difficulty: 'hard',
    maxParticipants: 10,
    currentParticipants: 9,
    status: 'active',
    createdAt: new Date(),
  },
];

export default function CompetitionMode({ user }: Props) {
  const { t } = useI18n();
  const [currentView, setCurrentView] = useState<'lobby' | 'room' | 'race'>('lobby');
  const [selectedRoom, setSelectedRoom] = useState<RaceRoom | null>(null);
  const [selectedText, setSelectedText] = useState(sampleTexts[0]);
  const [userInput, setUserInput] = useState('');
  const [isRaceActive, setIsRaceActive] = useState(false);
  const [isRaceComplete, setIsRaceComplete] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    time: 0,
    errors: 0,
    characters: 0,
    correctChars: 0,
  });
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [userPosition, setUserPosition] = useState(1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const raceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentText = selectedText?.text || '';

  const startRace = () => {
    if (!currentText) return;
    
    setUserInput('');
    setIsRaceActive(false);
    setIsRaceComplete(false);
    setStats({
      wpm: 0,
      accuracy: 0,
      time: 0,
      errors: 0,
      characters: 0,
      correctChars: 0,
    });
    
    // Initialize competitors with random progress simulation
    const initializedCompetitors = mockCompetitors.map(comp => ({
      ...comp,
      progress: 0,
    }));
    
    // Add user if logged in
    if (user) {
      initializedCompetitors.unshift({
        id: user.uid,
        name: user.displayName || 'You',
        wpm: 0,
        accuracy: 0,
        progress: 0,
        avatar: '🎯',
        isUser: true,
      });
    }
    
    setCompetitors(initializedCompetitors);
    
    // Start countdown
    setCountdown(3);
    setCurrentView('race');
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsRaceActive(true);
          startTimeRef.current = Date.now();
          inputRef.current?.focus();
          startCompetitorSimulation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startCompetitorSimulation = () => {
    const simulationInterval = setInterval(() => {
      setCompetitors(prevCompetitors => {
        return prevCompetitors.map(comp => {
          if (comp.isUser) return comp;
          
          // Simulate competitor progress
          const baseSpeed = comp.wpm / 100; // Convert to progress per second
          const randomVariation = (Math.random() - 0.5) * 0.02;
          const progressIncrease = (baseSpeed + randomVariation) * 0.1; // Update every 100ms
          
          const newProgress = Math.min(comp.progress + progressIncrease, 1);
          
          return {
            ...comp,
            progress: newProgress,
          };
        });
      });
    }, 100);
    
    raceTimerRef.current = simulationInterval;
  };

  const completeRace = () => {
    if (!startTimeRef.current) return;
    
    const endTime = Date.now();
    const timeElapsed = (endTime - startTimeRef.current) / 1000 / 60; // in minutes
    
    // Calculate stats
    const characters = userInput.length;
    const errors = calculateErrors(userInput, currentText);
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
    setIsRaceActive(false);
    setIsRaceComplete(true);
    
    // Update user competitor stats
    setCompetitors(prev => {
      const updated = prev.map(comp => {
        if (comp.isUser) {
          return {
            ...comp,
            wpm,
            accuracy,
            progress: 1,
          };
        }
        return comp;
      });
      
      // Sort by progress and WPM to determine position
      updated.sort((a, b) => {
        if (b.progress !== a.progress) {
          return b.progress - a.progress;
        }
        return b.wpm - a.wpm;
      });
      
      // Find user position
      const userIndex = updated.findIndex(comp => comp.isUser);
      if (userIndex >= 0) {
        setUserPosition(userIndex + 1);
      }
      
      return updated;
    });
    
    // Stop competitor simulation
    if (raceTimerRef.current) {
      clearInterval(raceTimerRef.current);
      raceTimerRef.current = null;
    }
    
    // Save progress if user is logged in
    if (user) {
      saveProgress(user.uid, {
        lessons: {
          [`competition_${Date.now()}`]: {
            id: `competition_${Date.now()}`,
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

  const resetRace = () => {
    setIsRaceActive(false);
    setIsRaceComplete(false);
    setStats({
      wpm: 0,
      accuracy: 0,
      time: 0,
      errors: 0,
      characters: 0,
      correctChars: 0,
    });
    setCountdown(0);
    setUserInput('');
    startTimeRef.current = null;
    
    if (raceTimerRef.current) {
      clearInterval(raceTimerRef.current);
      raceTimerRef.current = null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!isRaceActive && value.length > 0 && countdown === 0) {
      return; // Don't allow typing before race starts
    }
    
    setUserInput(value);
    
    // Update user progress
    const progress = value.length / currentText.length;
    setCompetitors(prev => prev.map(comp => 
      comp.isUser ? { ...comp, progress: Math.min(progress, 1) } : comp
    ));
    
    // Check if race is complete
    if (value === currentText && isRaceActive) {
      completeRace();
    }
  };

  const handleRoomSelect = (room: RaceRoom) => {
    setSelectedRoom(room);
    setSelectedText({
      id: room.id,
      text: room.text,
      difficulty: room.difficulty,
      estimatedTime: room.text.length * 0.3, // Rough estimate
    });
    setCurrentView('room');
  };

  const handleTextSelect = (text: typeof sampleTexts[0]) => {
    setSelectedText(text);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-gray-600 bg-gray-100';
      case 'starting': return 'text-yellow-600 bg-yellow-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'finished': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (raceTimerRef.current) {
        clearInterval(raceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('competitionMode')}</h1>
        <p className="text-gray-600">{t('competitionModeDescription')}</p>
      </div>

      {currentView === 'lobby' && (
        <div className="space-y-8">
          {/* Available Rooms */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('availableRooms')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockRooms.map((room) => (
                <div
                  key={room.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{room.name}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(room.status)}`}>
                      {t(room.status)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {t('participants')}: {room.currentParticipants}/{room.maxParticipants}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(room.difficulty)}`}>
                      {t(room.difficulty)}
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {t('joinRoom')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Race */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('quickRace')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('selectText')}
                </label>
                <div className="space-y-2">
                  {sampleTexts.map((text) => (
                    <button
                      key={text.id}
                      onClick={() => handleTextSelect(text)}
                      className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                        selectedText?.id === text.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 line-clamp-2">{text.text}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(text.difficulty)}`}>
                            {t(text.difficulty)}
                          </div>
                          <div className="text-xs text-gray-500">
                            ~{text.estimatedTime}s
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={startRace}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
              >
                {t('startRace')}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'room' && selectedRoom && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedRoom.name}</h2>
                <p className="text-gray-600">{t('roomInfo')}</p>
              </div>
              <button
                onClick={() => setCurrentView('lobby')}
                className="text-gray-500 hover:text-gray-700"
              >
                {t('backToLobby')}
              </button>
            </div>
            
            <div className="mb-6">
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-900 font-mono leading-relaxed">
                  {selectedRoom.text}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded text-sm font-medium ${getDifficultyColor(selectedRoom.difficulty)}`}>
                  {t(selectedRoom.difficulty)}
                </div>
                <div className="text-sm text-gray-600">
                  {t('participants')}: {selectedRoom.currentParticipants}/{selectedRoom.maxParticipants}
                </div>
              </div>
              
              <button
                onClick={startRace}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
              >
                {t('readyToRace')}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'race' && (
        <div className="space-y-8">
          {/* Competitors Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('raceProgress')}</h2>
            
            <div className="space-y-3">
              {competitors.map((competitor, index) => (
                <div
                  key={competitor.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    competitor.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-2xl">{competitor.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {competitor.name}
                        {competitor.isUser && ` (${t('you')})`}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round(competitor.progress * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          competitor.isUser ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${competitor.progress * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {competitor.wpm > 0 && `${competitor.wpm} WPM`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typing Area */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* Countdown */}
            {countdown > 0 && (
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-blue-600 animate-pulse">
                  {countdown}
                </div>
              </div>
            )}

            {/* Text Display */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-lg text-gray-900 leading-relaxed">
                {currentText.split('').map((char, index) => {
                  const isTyped = index < userInput.length;
                  const isCorrect = isTyped && userInput[index] === char;
                  const isCurrent = index === userInput.length;
                  
                  return (
                    <span
                      key={index}
                      className={`${
                        isTyped
                          ? isCorrect
                            ? 'text-green-600 bg-green-100'
                            : 'text-red-600 bg-red-100'
                          : isCurrent
                          ? 'bg-yellow-200 text-gray-900'
                          : 'text-gray-600'
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* Input Field */}
            <div className="mb-4">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder={countdown > 0 ? t('getReady') : t('startTyping')}
                className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isRaceActive || isRaceComplete}
              />
            </div>

            {/* Results */}
            {isRaceComplete && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  {t('raceComplete')} - {t('position')}: #{userPosition}
                </h3>
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
                    onClick={startRace}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
                  >
                    {t('raceAgain')}
                  </button>
                  <button
                    onClick={() => setCurrentView('lobby')}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
                  >
                    {t('backToLobby')}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isRaceComplete && (
              <div className="flex gap-4">
                <button
                  onClick={resetRace}
                  className="bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
                >
                  {t('exitRace')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
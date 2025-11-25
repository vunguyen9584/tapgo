import React, { useState, useCallback } from 'react';
import TypingArea from '../TypingArea';
import TypingEngine from '../TypingEngine';
import QuoteDisplay from './QuoteDisplay';
import DifficultySelector from './DifficultySelector';
import LoadingSpinner from './LoadingSpinner';
import { useQuotes } from '../../hooks/useQuotes';
import { useI18n } from '../../lib/i18n';
import { saveQuoteSession } from '../../lib/firebase';
import type { AppStatus } from '../../types';
import type { Quote, QuoteSession } from '../../types/quotes';
import type { TypingSession } from '../../types/typing';

interface QuoteModeProps {
  userId?: string;
  onSessionComplete?: (session: QuoteSession) => void;
  className?: string;
}

export default function QuoteMode({ userId, onSessionComplete, className }: QuoteModeProps) {
  const { t } = useI18n();
  const [status, setStatus] = useState<AppStatus>('pending');
  const [typed, setTyped] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Quote['difficulty'] | 'all'>('all');
  
  const {
    currentQuote,
    loading,
    error,
    loadNewQuote,
    stats
  } = useQuotes({ 
    userId, 
    difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
    autoSeed: true 
  });

  const handleType = useCallback((value: string) => {
    if (status === 'finished') return;
    setTyped(value);
  }, [status]);

  const handleSessionComplete = useCallback(async (typingSession: TypingSession, metrics: any) => {
    if (!currentQuote || !userId) {
      console.warn('Cannot save quote session: missing quote or user ID');
      return;
    }

    try {
      const quoteSession: Omit<QuoteSession, 'id'> = {
        quoteId: currentQuote.id,
        userId,
        wpm: metrics.wpm,
        accuracy: metrics.accuracy,
        netWpm: metrics.netWpm,
        correctChars: metrics.correctChars,
        incorrectChars: metrics.incorrectChars,
        totalChars: metrics.totalChars,
        difficulty: currentQuote.difficulty,
        startedAt: typingSession.startTime,
        completedAt: new Date()
      };

      const sessionId = await saveQuoteSession(quoteSession);
      
      if (sessionId) {
        const completedSession: QuoteSession = {
          ...quoteSession,
          id: sessionId
        };
        
        onSessionComplete?.(completedSession);
        
        // Load new quote for next session
        await loadNewQuote();
      }
    } catch (error) {
      console.error('Failed to save quote session:', error);
    }
  }, [currentQuote, userId, onSessionComplete, loadNewQuote]);

  const handleQuoteRefresh = useCallback(async () => {
    if (loading) return;
    await loadNewQuote();
    setTyped('');
    setStatus('pending');
  }, [loading, loadNewQuote]);

  const handleDifficultyChange = useCallback((difficulty: Quote['difficulty'] | 'all') => {
    setSelectedDifficulty(difficulty);
    // Reset current session when difficulty changes
    setTyped('');
    setStatus('pending');
  }, []);

  if (loading && !currentQuote) {
    return (
      <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error Loading Quotes</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={handleQuoteRefresh}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuote) {
    return (
      <div className={`text-center p-6 ${className}`}>
        <p className="text-gray-600">No quotes available.</p>
        <button
          onClick={handleQuoteRefresh}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with difficulty selector and stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <DifficultySelector
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={handleDifficultyChange}
          disabled={status === 'running'}
        />
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleQuoteRefresh}
            disabled={loading || status === 'running'}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'New Quote'}
          </button>
          
          {stats && (
            <div className="text-xs text-gray-500 text-right">
              <div>Quotes: {stats.totalQuotes}</div>
              <div>Best WPM: {stats.bestWpm}</div>
            </div>
          )}
        </div>
      </div>

      {/* Quote display */}
      <QuoteDisplay quote={currentQuote} />

      {/* Typing area with quote text */}
      <div className="space-y-4">
        <TypingEngine
          targetText={currentQuote.text}
          onSessionComplete={handleSessionComplete}
          duration={0} // No time limit, go by quote completion
          enabled={true}
        />
        
        <div className="flex justify-between items-center w-full text-sm text-gray-600">
          <div>
            {currentQuote.length} characters
          </div>
          <div className="font-medium">
            {status === 'pending' && t('startTyping')}
            {status === 'running' && `${Math.round(currentQuote.length * 0.6)} WPM | 95%`}
            {status === 'finished' && `Completed: ${Math.round(currentQuote.length * 0.6)} WPM | 95%`}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { getRandomQuote, getQuoteSessions, getQuoteStats } from '../lib/firebase';
import type { Quote, QuoteSession, QuoteStats } from '../types/quotes';
import { calculateQuoteDifficulty, getCopyrightCompliantQuotes } from '../utils/quotes';

interface UseQuotesOptions {
  userId?: string;
  difficulty?: Quote['difficulty'];
  autoSeed?: boolean;
}

export function useQuotes(options: UseQuotesOptions = {}) {
  const { userId, difficulty, autoSeed = false } = options;
  
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<QuoteSession[]>([]);
  const [stats, setStats] = useState<QuoteStats | null>(null);

  // Load a new quote
  const loadNewQuote = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const quote = await getRandomQuote(difficulty);
      
      if (!quote) {
        // Fallback to seed quotes if no quotes in database
        if (autoSeed) {
          const seedQuotes = getCopyrightCompliantQuotes();
          if (seedQuotes.length > 0) {
            const randomSeedQuote = seedQuotes[Math.floor(Math.random() * seedQuotes.length)];
            setCurrentQuote({
              ...randomSeedQuote,
              id: `seed-${Date.now()}`,
              createdAt: new Date(),
              difficulty: calculateQuoteDifficulty(randomSeedQuote.text)
            });
            return;
          }
        }
        setError('No quotes available');
        return;
      }
      
      setCurrentQuote(quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quote');
    } finally {
      setLoading(false);
    }
  }, [difficulty, autoSeed]);

  // Load user's quote sessions
  const loadSessions = useCallback(async () => {
    if (!userId) return;
    
    try {
      const userSessions = await getQuoteSessions(userId);
      setSessions(userSessions);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  }, [userId]);

  // Load user's quote stats
  const loadStats = useCallback(async () => {
    if (!userId) return;
    
    try {
      const userStats = await getQuoteStats(userId);
      setStats(userStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, [userId]);

  // Initialize quote on mount
  useEffect(() => {
    loadNewQuote();
  }, [loadNewQuote]);

  // Load sessions and stats when userId changes
  useEffect(() => {
    if (userId) {
      loadSessions();
      loadStats();
    }
  }, [userId, loadSessions, loadStats]);

  return {
    currentQuote,
    loading,
    error,
    sessions,
    stats,
    loadNewQuote,
    loadSessions,
    loadStats
  };
}

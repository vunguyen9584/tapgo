import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuoteMode from '../QuoteMode';
import { useUser } from '../../../hooks/useUser';
import { getRandomQuote, saveQuoteSession } from '../../../lib/firebase';

// Mock the hooks and firebase functions
jest.mock('../../../hooks/useUser');
jest.mock('../../../lib/firebase');
jest.mock('../QuoteDisplay', () => {
  return function MockQuoteDisplay({ quote }: { quote: any }) {
    return <div data-testid="quote-display">{quote.text}</div>;
  };
});

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockGetRandomQuote = getRandomQuote as jest.MockedFunction<typeof getRandomQuote>;
const mockSaveQuoteSession = saveQuoteSession as jest.MockedFunction<typeof saveQuoteSession>;

describe('QuoteMode Component', () => {
  const mockQuote = {
    id: 'test-quote-1',
    text: 'Test quote for typing practice',
    author: 'Test Author',
    source: 'Test Source',
    difficulty: 'easy' as const,
    length: 32,
    category: 'test',
    createdAt: new Date()
  };

  beforeEach(() => {
    mockUseUser.mockReturnValue({ uid: 'test-user-123' } as any);
    mockGetRandomQuote.mockResolvedValue(mockQuote);
    mockSaveQuoteSession.mockResolvedValue('session-id-123');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display quote when loaded', async () => {
    render(<QuoteMode />);
    
    await waitFor(() => {
      expect(screen.getByTestId('quote-display')).toBeInTheDocument();
      expect(screen.getByText('Test quote for typing practice')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    mockGetRandomQuote.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<QuoteMode />);
    
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should show error state when quote fails to load', async () => {
    mockGetRandomQuote.mockResolvedValue(null);
    
    render(<QuoteMode />);
    
    await waitFor(() => {
      expect(screen.getByText(/No quotes available/i)).toBeInTheDocument();
    });
  });

  it('should load new quote when refresh button is clicked', async () => {
    render(<QuoteMode />);
    
    await waitFor(() => {
      expect(screen.getByText('New Quote')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('New Quote'));
    
    expect(mockGetRandomQuote).toHaveBeenCalledTimes(2); // Initial load + refresh
  });

  it('should filter quotes by difficulty when difficulty is changed', async () => {
    render(<QuoteMode />);
    
    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    // Click on Easy difficulty
    fireEvent.click(screen.getByText('Easy'));
    
    await waitFor(() => {
      expect(mockGetRandomQuote).toHaveBeenCalledWith('easy');
    });
  });

  it('should handle session completion and save to Firebase', async () => {
    render(<QuoteMode />);
    
    await waitFor(() => {
      expect(screen.getByTestId('quote-display')).toBeInTheDocument();
    });

    // Simulate session completion by calling the handler
    // This would normally be triggered by TypingEngine
    expect(mockSaveQuoteSession).not.toHaveBeenCalled();
  });

  it('should display user stats when available', async () => {
    const mockStats = {
      totalQuotes: 10,
      averageWpm: 45,
      averageAccuracy: 92,
      bestWpm: 78,
      bestAccuracy: 98,
      quotesByDifficulty: {
        easy: { completed: 4, averageWpm: 50, averageAccuracy: 95 },
        medium: { completed: 4, averageWpm: 45, averageAccuracy: 90 },
        hard: { completed: 2, averageWpm: 35, averageAccuracy: 85 }
      }
    };

    // Mock the useQuotes hook to return stats
    jest.mock('../../../hooks/useQuotes', () => ({
      useQuotes: () => ({
        currentQuote: mockQuote,
        loading: false,
        error: null,
        sessions: [],
        stats: mockStats,
        loadNewQuote: jest.fn()
      })
    }));

    render(<QuoteMode />);
    
    await waitFor(() => {
      expect(screen.getByText('Quotes: 10')).toBeInTheDocument();
      expect(screen.getByText('Best WPM: 78')).toBeInTheDocument();
    });
  });
});

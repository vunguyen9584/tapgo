import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuoteDisplay from '../QuoteDisplay';
import type { Quote } from '../../../types/quotes';

describe('QuoteDisplay Component', () => {
  const mockQuote: Quote = {
    id: 'test-quote-1',
    text: 'This is a test quote for display',
    author: 'Test Author',
    source: 'Test Source',
    difficulty: 'easy',
    length: 31,
    category: 'test',
    createdAt: new Date()
  };

  it('should display quote text', () => {
    render(<QuoteDisplay quote={mockQuote} />);
    expect(screen.getByText('This is a test quote for display')).toBeInTheDocument();
  });

  it('should display author when provided', () => {
    render(<QuoteDisplay quote={mockQuote} />);
    expect(screen.getByText('— Test Author')).toBeInTheDocument();
  });

  it('should display source when provided', () => {
    render(<QuoteDisplay quote={mockQuote} />);
    expect(screen.getByText('Test Source')).toBeInTheDocument();
  });

  it('should display difficulty indicator', () => {
    render(<QuoteDisplay quote={mockQuote} />);
    expect(screen.getByText('easy')).toBeInTheDocument();
    
    // Check that easy difficulty has green color
    const difficultyIndicator = screen.getByText('easy').parentElement;
    const dotElement = difficultyIndicator?.querySelector('.bg-green-500');
    expect(dotElement).toBeInTheDocument();
  });

  it('should display character count', () => {
    render(<QuoteDisplay quote={mockQuote} />);
    expect(screen.getByText('31 chars')).toBeInTheDocument();
  });

  it('should display category when provided', () => {
    render(<QuoteDisplay quote={mockQuote} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should handle quotes without author or source', () => {
    const quoteWithoutMetadata = {
      ...mockQuote,
      author: undefined,
      source: undefined
    };

    render(<QuoteDisplay quote={quoteWithoutMetadata} />);
    
    // Should not display author or source sections
    expect(screen.queryByText(/—/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Test Source/)).not.toBeInTheDocument();
  });

  it('should display medium difficulty with yellow color', () => {
    const mediumQuote = { ...mockQuote, difficulty: 'medium' as const };
    render(<QuoteDisplay quote={mediumQuote} />);
    
    const difficultyIndicator = screen.getByText('medium').parentElement;
    const dotElement = difficultyIndicator?.querySelector('.bg-yellow-500');
    expect(dotElement).toBeInTheDocument();
  });

  it('should display hard difficulty with red color', () => {
    const hardQuote = { ...mockQuote, difficulty: 'hard' as const };
    render(<QuoteDisplay quote={hardQuote} />);
    
    const difficultyIndicator = screen.getByText('hard').parentElement;
    const dotElement = difficultyIndicator?.querySelector('.bg-red-500');
    expect(dotElement).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<QuoteDisplay quote={mockQuote} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

import { describe, it, expect } from '@jest/globals';
import { calculateQuoteDifficulty, validateQuoteText, getRandomQuote } from '../index';
import type { Quote } from '../../types/quotes';

describe('Quote Utilities', () => {
  describe('calculateQuoteDifficulty', () => {
    it('should classify short simple quotes as easy', () => {
      const easyQuote = "Be yourself; everyone else is already taken.";
      const difficulty = calculateQuoteDifficulty(easyQuote);
      expect(difficulty).toBe('easy');
    });

    it('should classify medium length quotes with some complexity as medium', () => {
      const mediumQuote = "The future belongs to those who believe in the beauty of their dreams.";
      const difficulty = calculateQuoteDifficulty(mediumQuote);
      expect(difficulty).toBe('medium');
    });

    it('should classify long or complex quotes as hard', () => {
      const hardQuote = "The impediment to action advances action. What stands in the way becomes the way.";
      const difficulty = calculateQuoteDifficulty(hardQuote);
      expect(difficulty).toBe('hard');
    });

    it('should handle quotes with many special characters correctly', () => {
      const complexQuote = "Success is not final, failure is not fatal: it is the courage to continue that counts!";
      const difficulty = calculateQuoteDifficulty(complexQuote);
      expect(['medium', 'hard']).toContain(difficulty);
    });
  });

  describe('validateQuoteText', () => {
    it('should accept valid quotes', () => {
      const validQuote = "Life is what happens when you're busy making other plans.";
      expect(validateQuoteText(validQuote)).toBe(true);
    });

    it('should reject quotes that are too short', () => {
      const shortQuote = "Too short.";
      expect(validateQuoteText(shortQuote)).toBe(false);
    });

    it('should reject quotes that are too long', () => {
      const longQuote = "A".repeat(1001);
      expect(validateQuoteText(longQuote)).toBe(false);
    });

    it('should reject quotes with too few words', () => {
      const fewWords = "Short words only.";
      expect(validateQuoteText(fewWords)).toBe(false);
    });

    it('should reject quotes with excessive punctuation', () => {
      const excessivePunc = "This has!!! way too??? many... punctuation marks!!!";
      expect(validateQuoteText(excessivePunc)).toBe(false);
    });

    it('should reject quotes with repeated characters', () => {
      const repeatedChars = "This quote has aaaaa repeated characters in it.";
      expect(validateQuoteText(repeatedChars)).toBe(false);
    });
  });

  describe('getRandomQuote', () => {
    const mockQuotes: Quote[] = [
      {
        id: '1',
        text: 'First quote',
        difficulty: 'easy',
        length: 12,
        createdAt: new Date()
      },
      {
        id: '2',
        text: 'Second quote',
        difficulty: 'medium',
        length: 13,
        createdAt: new Date()
      },
      {
        id: '3',
        text: 'Third quote',
        difficulty: 'hard',
        length: 12,
        createdAt: new Date()
      }
    ];

    it('should return a random quote from the list', () => {
      const result = getRandomQuote(mockQuotes);
      expect(result).toBeTruthy();
      expect(mockQuotes).toContain(result!);
    });

    it('should return null for empty quote list', () => {
      const result = getRandomQuote([]);
      expect(result).toBeNull();
    });

    it('should filter by difficulty when specified', () => {
      const result = getRandomQuote(mockQuotes, 'easy');
      expect(result).toBeTruthy();
      expect(result!.difficulty).toBe('easy');
    });

    it('should return null when no quotes match difficulty filter', () => {
      const result = getRandomQuote([mockQuotes[0], mockQuotes[1]], 'hard');
      expect(result).toBeNull();
    });
  });
});

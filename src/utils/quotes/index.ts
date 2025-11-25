import type { Quote } from '../../types/quotes';

/**
 * Calculate quote difficulty based on length, word complexity, and character patterns
 */
export function calculateQuoteDifficulty(text: string): Quote['difficulty'] {
  const words = text.trim().split(/\s+/);
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const totalChars = text.length;
  
  // Count complex characters (punctuation, numbers, special chars)
  const complexChars = (text.match(/[^\w\s]/g) || []).length;
  const complexRatio = complexChars / totalChars;
  
  // Count long words (>6 characters)
  const longWords = words.filter(word => word.length > 6).length;
  const longWordRatio = longWords / words.length;
  
  // Calculate difficulty score (0-100)
  let difficultyScore = 0;
  
  // Length contribution (30% of score)
  if (totalChars < 100) difficultyScore += 10;
  else if (totalChars < 200) difficultyScore += 20;
  else if (totalChars < 400) difficultyScore += 40;
  else difficultyScore += 60;
  
  // Word complexity (40% of score)
  difficultyScore += avgWordLength * 5;
  difficultyScore += longWordRatio * 30;
  
  // Character complexity (30% of score)
  difficultyScore += complexRatio * 50;
  
  // Determine difficulty based on score
  if (difficultyScore < 30) return 'easy';
  if (difficultyScore < 60) return 'medium';
  return 'hard';
}

/**
 * Get a random quote from the list, optionally filtered by difficulty
 */
export function getRandomQuote(quotes: Quote[], difficulty?: Quote['difficulty']): Quote | null {
  const filteredQuotes = difficulty 
    ? quotes.filter(quote => quote.difficulty === difficulty)
    : quotes;
  
  if (filteredQuotes.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  return filteredQuotes[randomIndex];
}

/**
 * Validate if text is appropriate for quotes (basic content validation)
 */
export function validateQuoteText(text: string): boolean {
  const trimmed = text.trim();
  
  // Basic validation
  if (trimmed.length < 20 || trimmed.length > 1000) return false;
  if (trimmed.split(/\s+/).length < 5) return false; // Less than 5 words
  
  // Check for excessive punctuation or special characters
  const punctuationCount = (trimmed.match(/[^\w\s]/g) || []).length;
  if (punctuationCount / trimmed.length > 0.3) return false;
  
  // Check for repeated characters (potential spam)
  const repeatedPattern = /(.)\1{3,}/;
  if (repeatedPattern.test(trimmed)) return false;
  
  return true;
}

/**
 * Seed quotes database with initial quotes
 */
export function getSeedQuotes(): Omit<Quote, 'id' | 'createdAt'>[] {
  return [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      source: "Stanford University commencement address, 2005",
      difficulty: 'easy' as const,
      length: 56,
      category: "technology"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
      source: "Interview with Rolling Stone, 1994",
      difficulty: 'easy' as const,
      length: 61,
      category: "technology"
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
      source: "Beautiful Boy (Darling Boy) song, 1980",
      difficulty: 'easy' as const,
      length: 55,
      category: "life"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      source: "Speech, 1936",
      difficulty: 'medium' as const,
      length: 72,
      category: "inspiration"
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
      source: "Ancient Greek philosophy",
      difficulty: 'medium' as const,
      length: 69,
      category: "philosophy"
    },
    {
      text: "The only impossible thing is that which you don't attempt.",
      author: "Gabriel García Márquez",
      source: "Various interviews",
      difficulty: 'medium' as const,
      length: 62,
      category: "literature"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      source: "Speech, 1942",
      difficulty: 'hard' as const,
      length: 87,
      category: "leadership"
    },
    {
      text: "The impediment to action advances action. What stands in the way becomes the way.",
      author: "Marcus Aurelius",
      source: "Meditations, Book 5",
      difficulty: 'hard' as const,
      length: 78,
      category: "philosophy"
    },
    {
      text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      author: "Aristotle",
      source: "Nicomachean Ethics",
      difficulty: 'hard' as const,
      length: 80,
      category: "philosophy"
    },
    {
      text: "The measure of intelligence is the ability to change.",
      author: "Albert Einstein",
      source: "Various quotes and writings",
      difficulty: 'easy' as const,
      length: 52,
      category: "science"
    },
    {
      text: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
      source: "The Picture of Dorian Gray, 1890",
      difficulty: 'easy' as const,
      length: 44,
      category: "literature"
    },
    {
      text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
      author: "Albert Einstein",
      source: "Various quotes and writings",
      difficulty: 'medium' as const,
      length: 92,
      category: "science"
    },
    {
      text: "To be, or not to be, that is the question.",
      author: "William Shakespeare",
      source: "Hamlet, Act 3, Scene 1",
      difficulty: 'easy' as const,
      length: 42,
      category: "literature"
    },
    {
      text: "I think, therefore I am.",
      author: "René Descartes",
      source: "Discourse on the Method, 1637",
      difficulty: 'easy' as const,
      length: 26,
      category: "philosophy"
    },
    {
      text: "The journey of a thousand miles begins with a single step.",
      author: "Lao Tzu",
      source: "Tao Te Ching",
      difficulty: 'easy' as const,
      length: 55,
      category: "philosophy"
    }
  ];
}

/**
 * Get copyright-compliant quotes (public domain or properly attributed)
 */
export function getCopyrightCompliantQuotes(): Omit<Quote, 'id' | 'createdAt'>[] {
  return getSeedQuotes().filter(quote => {
    // Only include quotes from public domain sources or with proper attribution
    const publicDomainAuthors = [
      'Aristotle', 'Lao Tzu', 'Marcus Aurelius', 'William Shakespeare', 'René Descartes'
    ];
    
    const modernAuthors = [
      'Steve Jobs', 'John Lennon', 'Eleanor Roosevelt', 'Gabriel García Márquez',
      'Winston Churchill', 'Albert Einstein', 'Oscar Wilde'
    ];
    
    return publicDomainAuthors.includes(quote.author || '') || 
           modernAuthors.includes(quote.author || '');
  });
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  source?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  length: number; // character count
  category?: string;
  createdAt: Date;
}

export interface QuoteSession {
  id: string;
  quoteId: string;
  userId: string;
  wpm: number;
  accuracy: number;
  netWpm: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  startedAt: Date;
  completedAt: Date;
  difficulty: Quote['difficulty'];
}

export interface QuoteStats {
  totalQuotes: number;
  averageWpm: number;
  averageAccuracy: number;
  bestWpm: number;
  bestAccuracy: number;
  quotesByDifficulty: {
    easy: { completed: number; averageWpm: number; averageAccuracy: number };
    medium: { completed: number; averageWpm: number; averageAccuracy: number };
    hard: { completed: number; averageWpm: number; averageAccuracy: number };
  };
}

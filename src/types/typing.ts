export interface TypingSession {
  id: string;
  userId: string;
  targetText: string;
  typedText: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  isPaused: boolean;
  currentCharIndex: number;
}

export interface CharacterResult {
  char: string;
  isCorrect: boolean;
  position: number;
  timestamp: number;
}

export interface TypingMetrics {
  wpm: number;
  accuracy: number;
  netWpm: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export interface TypingEngineProps {
  targetText: string;
  onSessionComplete: (session: TypingSession, metrics: TypingMetrics) => void;
  duration?: number;
  enabled?: boolean;
}

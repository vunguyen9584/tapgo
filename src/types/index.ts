export type AppStatus = 'pending' | 'running' | 'finished';

export type Mode = 'quote' | 'words' | 'chars' | 'lesson';

export type Lesson = {
  id: string;
  label: string;
  chars: string;
  wpmThreshold: number;
  accuracyThreshold: number;
};

export type LessonProgress = {
  completed: boolean;
  bestWpm?: number;
  bestAccuracy?: number;
  lastAt?: number; // epoch ms
};

export type LessonsProgressMap = Record<string, LessonProgress | undefined>;


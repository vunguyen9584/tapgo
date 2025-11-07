import type { Lesson } from '../types';

// 15 lessons from common to less common; ensure each has at least 2 chars
export const LESSONS: Lesson[] = [
  { id: 'lesson-1', label: 'Lesson 1', chars: 'fj', wpmThreshold: 15, accuracyThreshold: 95 },
  { id: 'lesson-2', label: 'Lesson 2', chars: 'dk', wpmThreshold: 16, accuracyThreshold: 95 },
  { id: 'lesson-3', label: 'Lesson 3', chars: 'sl', wpmThreshold: 17, accuracyThreshold: 95 },
  { id: 'lesson-4', label: 'Lesson 4', chars: 'ah', wpmThreshold: 18, accuracyThreshold: 95 },
  { id: 'lesson-5', label: 'Lesson 5', chars: 'ge', wpmThreshold: 19, accuracyThreshold: 95 },
  { id: 'lesson-6', label: 'Lesson 6', chars: 'ri', wpmThreshold: 20, accuracyThreshold: 95 },
  { id: 'lesson-7', label: 'Lesson 7', chars: 'to', wpmThreshold: 21, accuracyThreshold: 94 },
  { id: 'lesson-8', label: 'Lesson 8', chars: 'nu', wpmThreshold: 22, accuracyThreshold: 94 },
  { id: 'lesson-9', label: 'Lesson 9', chars: 'cm', wpmThreshold: 23, accuracyThreshold: 94 },
  { id: 'lesson-10', label: 'Lesson 10', chars: 'wy', wpmThreshold: 24, accuracyThreshold: 93 },
  { id: 'lesson-11', label: 'Lesson 11', chars: 'pb', wpmThreshold: 24, accuracyThreshold: 93 },
  // add common punctuation to ensure at least 2 keys per lesson
  { id: 'lesson-12', label: 'Lesson 12', chars: 'v;', wpmThreshold: 24, accuracyThreshold: 92 },
  { id: 'lesson-13', label: 'Lesson 13', chars: 'x,', wpmThreshold: 24, accuracyThreshold: 92 },
  { id: 'lesson-14', label: 'Lesson 14', chars: 'q.', wpmThreshold: 24, accuracyThreshold: 92 },
  { id: 'lesson-15', label: 'Lesson 15', chars: "z'", wpmThreshold: 24, accuracyThreshold: 92 },
];

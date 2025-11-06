 import type { Lesson } from '../types';

 export const LESSONS: Lesson[] = [
   { id: 'home-1', label: 'Home Row 1', chars: 'fj', wpmThreshold: 15, accuracyThreshold: 95 },
   { id: 'home-2', label: 'Home Row 2', chars: 'fjdk', wpmThreshold: 18, accuracyThreshold: 95 },
   { id: 'home-3', label: 'Home Row 3', chars: 'fjdksl', wpmThreshold: 20, accuracyThreshold: 95 },
   { id: 'home-4', label: 'Home Row Full', chars: 'asdfjkl;', wpmThreshold: 22, accuracyThreshold: 95 },
   { id: 'top-1', label: 'Top Row 1', chars: 'ru', wpmThreshold: 20, accuracyThreshold: 94 },
   { id: 'top-2', label: 'Top Row 2', chars: 'ruet', wpmThreshold: 22, accuracyThreshold: 94 },
   { id: 'top-3', label: 'Top Row 3', chars: 'ruetiy', wpmThreshold: 24, accuracyThreshold: 94 },
   { id: 'top-4', label: 'Top Row Full', chars: 'qwertyuiop', wpmThreshold: 26, accuracyThreshold: 93 },
   { id: 'bottom-1', label: 'Bottom Row 1', chars: 'vm', wpmThreshold: 20, accuracyThreshold: 94 },
   { id: 'bottom-2', label: 'Bottom Row 2', chars: 'vmc', wpmThreshold: 22, accuracyThreshold: 94 },
   { id: 'bottom-3', label: 'Bottom Row 3', chars: 'vmczx', wpmThreshold: 24, accuracyThreshold: 93 },
   { id: 'bottom-4', label: 'Bottom Row Full', chars: 'zxcvbnm', wpmThreshold: 26, accuracyThreshold: 92 }
 ];

 export const DURATION_OPTIONS = [15, 30, 60, 120] as const;

const QUOTES: readonly [string, ...string[]] = [
   'The quick brown fox jumps over the lazy dog.',
   'Simplicity is the soul of efficiency.',
   'Premature optimization is the root of all evil.',
   'In theory there is no difference between theory and practice.',
   'Code is like humor. When you have to explain it, it’s bad.',
   'Programs must be written for people to read, and only incidentally for machines to execute.',
   'Controlling complexity is the essence of computer programming.',
   'Talk is cheap. Show me the code.',
   'First, solve the problem. Then, write the code.',
   'Before software can be reusable it first has to be usable.'
 ];

 export function pickQuote(): string {
  const idx = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[idx] ?? QUOTES[0];
 }

 export function computeCorrectIncorrect(typed: string, target: string): { correct: number; incorrect: number } {
   let correct = 0, incorrect = 0;
   for (let i = 0; i < typed.length; i++) {
     if (typed[i] === target[i]) correct++;
     else incorrect++;
   }
   return { correct, incorrect };
 }

 function uniqueChars(input: string): string[] {
   const set = new Set<string>();
   for (const ch of input.toLowerCase()) {
     if (/^[a-z]$/.test(ch)) set.add(ch);
   }
   return Array.from(set);
 }

 export function generateCharPracticeText(chars: string, approxLength = 160): string {
   const pool = uniqueChars(chars);
   if (pool.length === 0) return 'Please configure character set (e.g. asdfg).';
   const words: string[] = [];
   let len = 0;
   while (len < approxLength) {
     const wLen = 3 + Math.floor(Math.random() * 5); // 3..7
     let w = '';
     for (let i = 0; i < wLen; i++) w += pool[Math.floor(Math.random() * pool.length)];
     words.push(w);
     len += w.length + 1;
   }
   return words.join(' ').slice(0, approxLength).trimEnd();
 }

const COMMON_WORDS = [
  'the','be','to','of','and','a','in','that','have','I',
  'it','for','not','on','with','he','as','you','do','at',
  'this','but','his','by','from','they','we','say','her','she',
  'or','an','will','my','one','all','would','there','their','what',
  'so','up','out','if','about','who','get','which','go','me',
  'when','make','can','like','time','no','just','him','know','take',
  'people','into','year','your','good','some','could','them','see','other'
];

export function generateWordPracticeText(count = 60): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * COMMON_WORDS.length);
    const w = COMMON_WORDS[idx] ?? 'the';
    words.push(w);
  }
  return words.join(' ');
}

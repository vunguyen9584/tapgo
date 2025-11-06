 import React from 'react';

 type WpmChartProps = { data: number[] };
 function WpmChart({ data }: WpmChartProps) {
   const width = 320;
   const height = 120;
   const maxVal = Math.max(1, ...data);
   const n = data.length;
   const points = n > 1
     ? data.map((v, i) => {
         const x = (i / (n - 1)) * width;
         const y = height - (v / maxVal) * height;
         return `${x},${y}`;
       }).join(' ')
     : `0,${height} ${width},${height}`;
   return (
     <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28">
       <rect width={width} height={height} fill="transparent" />
       <polyline fill="none" stroke="#38bdf8" strokeWidth={2} points={points} />
     </svg>
   );
 }

 function Stat({ label, value }: { label: string; value: string | number }) {
   return (
     <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
       <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
       <div className="text-xl sm:text-2xl font-semibold mt-1">{value}</div>
     </div>
   );
 }

type Props = {
   open: boolean;
   onClose: () => void;
   wpm: number;
   accuracy: number;
   correct: number;
   incorrect: number;
   wpmHistory: number[];
   duration: number;
  lessonLabel?: string;
  lessonPassed?: boolean;
 };

export default function Results({ open, onClose, wpm, accuracy, correct, incorrect, wpmHistory, duration, lessonLabel, lessonPassed }: Props) {
   if (!open) return null;
   return (
     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
       <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Results</h2>
        {lessonLabel && (
          <div className={`mb-4 text-sm ${lessonPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
            Lesson: {lessonLabel} — {lessonPassed ? 'Passed' : 'Not passed'}
          </div>
        )}
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
           <Stat label="Net WPM" value={wpm} />
           <Stat label="Accuracy" value={`${accuracy}%`} />
           <Stat label="Correct" value={correct} />
           <Stat label="Incorrect" value={incorrect} />
         </div>
         <div className="mb-6">
           <div className="flex items-center justify-between mb-2">
             <span className="text-slate-400 text-sm">WPM over time</span>
             <span className="text-slate-500 text-xs">{duration}s</span>
           </div>
           <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
             <WpmChart data={wpmHistory} />
           </div>
         </div>
         <div className="flex justify-end gap-2">
           <button onClick={onClose} className="px-4 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-400 transition-colors">Try Again</button>
         </div>
       </div>
     </div>
   );
 }

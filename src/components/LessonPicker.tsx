 import React from 'react';
 import type { Lesson, LessonsProgressMap } from '../types';

 type Props = {
   lessons: Lesson[];
   selectedId?: string;
   onSelect: (id: string) => void;
   disabled?: boolean;
   progress?: LessonsProgressMap;
 };

 export default function LessonPicker({ lessons, selectedId, onSelect, disabled, progress }: Props) {
   return (
     <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 sm:p-4">
       <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Lessons (easy → hard)</div>
       <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
         {lessons.map(l => {
           const done = progress?.[l.id]?.completed;
           return (
             <button
               key={l.id}
               disabled={disabled}
               onClick={() => onSelect(l.id)}
               className={`text-left px-3 py-2 rounded-md border transition-colors ${
                 selectedId === l.id ? 'bg-sky-500/20 border-sky-600' : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/50'
               } ${disabled ? 'opacity-60' : ''}`}
             >
               <div className="flex items-center justify-between gap-2">
                 <div>
                   <div className="font-medium text-slate-200 text-sm">{l.label}</div>
                   <div className="text-slate-400 text-xs">{l.chars}</div>
                 </div>
                 {done && <span className="text-emerald-400 text-xs">✓</span>}
               </div>
               <div className="text-slate-500 text-xs mt-1">Goal: ≥{l.wpmThreshold} WPM, ≥{l.accuracyThreshold}%</div>
             </button>
           );
         })}
       </div>
     </div>
   );
 }

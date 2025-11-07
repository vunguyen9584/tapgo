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
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
      <div className="text-xs uppercase tracking-wide text-[#666666] mb-2">Lessons (easy → hard)</div>
       <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
         {lessons.map(l => {
           const done = progress?.[l.id]?.completed;
           return (
             <button
               key={l.id}
               disabled={disabled}
               onClick={() => onSelect(l.id)}
              className={`text-left px-3 py-2 rounded-md border transition-colors ${
                selectedId === l.id ? 'bg-[#007BFF]/10 border-[#007BFF]' : 'bg-white border-gray-200 hover:bg-gray-100'
               } ${disabled ? 'opacity-60' : ''}`}
             >
               <div className="flex items-center justify-between gap-2">
                 <div>
                  <div className="font-medium text-[#222222] text-sm">{l.label}</div>
                  <div className="text-[#666666] text-xs">{l.chars}</div>
                 </div>
                {done && <span className="text-[#28A745] text-xs">✓</span>}
               </div>
              <div className="text-[#666666] text-xs mt-1">Goal: ≥{l.wpmThreshold} WPM, ≥{l.accuracyThreshold}%</div>
             </button>
           );
         })}
       </div>
     </div>
   );
 }

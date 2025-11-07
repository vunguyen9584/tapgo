 import React from 'react';

 type Props = {
   signs: number; // total typed chars
   progress: number; // 0..100
   wpm: number;
   errors: number;
   accuracy: number; // 0..100
   timeLeft: number; // seconds
 };

 export default function StatsBar({ signs, progress, wpm, errors, accuracy, timeLeft }: Props) {
   function fmtTime(secs: number) {
     const m = Math.floor(secs / 60);
     const s = secs % 60;
     return `${m}:${s.toString().padStart(2, '0')}`;
   }
   const items: { label: string; value: string | number }[] = [
     { label: 'Signs', value: signs },
     { label: 'Progress', value: `${Math.min(100, Math.max(0, Math.round(progress)))}%` },
     { label: 'WPM', value: Math.round(wpm) },
     { label: 'Errors', value: errors },
     { label: 'Accuracy', value: `${Math.round(accuracy)}%` },
     { label: 'Time', value: fmtTime(timeLeft) }
   ];
   return (
     <div className="classic-bar px-3 sm:px-4 py-2 flex flex-wrap gap-x-6 gap-y-2 items-center justify-center">
       {items.map(({ label, value }) => (
         <div key={label} className="flex items-baseline gap-2">
           <span className="text-xs uppercase tracking-wide text-[#666666]">{label}</span>
           <span className="text-base font-semibold text-[#222222]">{value}</span>
         </div>
       ))}
     </div>
   );
 }

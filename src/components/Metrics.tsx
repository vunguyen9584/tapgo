 import React from 'react';

 type Props = {
   wpm: number;
   accuracy: number;
   timeLeft: number;
 };

 export default function Metrics({ wpm, accuracy, timeLeft }: Props) {
   function fmtTime(secs: number) {
     const m = Math.floor(secs / 60);
     const s = secs % 60;
     return `${m}:${s.toString().padStart(2, '0')}`;
   }
   const items = [
     { label: 'WPM', value: wpm },
     { label: 'Accuracy', value: `${accuracy}%` },
     { label: 'Time', value: fmtTime(timeLeft) }
   ];
   return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
       {items.map(({ label, value }) => (
        <div key={label} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 text-center">
          <div className="text-xs uppercase tracking-wide text-[#666666]">{label}</div>
          <div className="text-2xl sm:text-3xl font-semibold mt-1 text-[#222222]">{value}</div>
         </div>
       ))}
     </div>
   );
 }

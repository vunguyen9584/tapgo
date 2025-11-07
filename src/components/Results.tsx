import React from 'react';
import { useI18n } from '../lib/i18n';

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
      <polyline fill="none" stroke="#007BFF" strokeWidth={2} points={points} />
     </svg>
   );
 }

 function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
      <div className="text-xs uppercase tracking-wide text-[#666666]">{label}</div>
      <div className="text-xl sm:text-2xl font-semibold mt-1 text-[#222222]">{value}</div>
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
  const { t } = useI18n();
   if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl p-6 text-[#222222]">
        <h2 className="text-xl font-semibold mb-2">{t('results')}</h2>
        {lessonLabel && (
          <div className={`mb-4 text-sm ${lessonPassed ? 'text-[#28A745]' : 'text-[#DC3545]'}`}>
            {t('lesson')}: {lessonLabel} — {lessonPassed ? t('passedShort') : t('notPassed')}
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
            <span className="text-[#666666] text-sm">{t('wpmOverTime')}</span>
            <span className="text-[#666666] text-xs">{duration}s</span>
           </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3">
             <WpmChart data={wpmHistory} />
           </div>
         </div>
         <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-[#007BFF] text-white hover:opacity-90 transition-colors">{t('tryAgain')}</button>
         </div>
       </div>
     </div>
   );
 }

import React from 'react';
import { useI18n } from '../lib/i18n';

 type Props = {
   signs: number; // total typed chars
   progress: number; // 0..100
   wpm: number;
   errors: number;
   accuracy: number; // 0..100
   timeLeft: number; // seconds
 };

 export default function StatsBar({ signs, progress, wpm, errors, accuracy, timeLeft }: Props) {
  const { t } = useI18n();
   function fmtTime(secs: number) {
     const m = Math.floor(secs / 60);
     const s = secs % 60;
     return `${m}:${s.toString().padStart(2, '0')}`;
   }
   const items: { label: string; value: string | number }[] = [
    { label: t('statsSigns'), value: signs },
    { label: t('statsProgress'), value: `${Math.min(100, Math.max(0, Math.round(progress)))}%` },
    { label: t('statsWpm'), value: Math.round(wpm) },
    { label: t('statsErrors'), value: errors },
    { label: t('statsAccuracy'), value: `${Math.round(accuracy)}%` },
    { label: t('statsTime'), value: fmtTime(timeLeft) }
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

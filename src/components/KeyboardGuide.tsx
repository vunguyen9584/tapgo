 import React from 'react';

 type Props = {
   activeChar?: string;
   show: boolean;
   onToggle: () => void;
 };

 type Finger = 'lp' | 'lr' | 'lm' | 'li' | 'ri' | 'rm' | 'rr' | 'rp' | 'thumb';

 const keyRows: string[][] = [
   ['`','1','2','3','4','5','6','7','8','9','0','-','='],
   ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
   ['a','s','d','f','g','h','j','k','l',';','\''],
   ['z','x','c','v','b','n','m',',','.','/']
 ];

 function normalize(ch?: string): string | undefined {
   if (!ch) return undefined;
   if (ch === ' ') return 'space';
   return ch.toLowerCase();
 }

 function fingerForKey(k: string): Finger {
   if (k === 'space') return 'thumb';
   const leftPinky = new Set(['`','1','q','a','z']);
   const leftRing = new Set(['2','w','s','x']);
   const leftMiddle = new Set(['3','e','d','c']);
   const leftIndex = new Set(['4','5','r','t','f','g','v','b']);
   const rightIndex = new Set(['6','7','y','u','h','j','n','m']);
   const rightMiddle = new Set(['8','i','k',',']);
   const rightRing = new Set(['9','o','l','.']);
   const rightPinky = new Set(['0','-','=', 'p','[',']','\\',';','\'','/']);
   if (leftPinky.has(k)) return 'lp';
   if (leftRing.has(k)) return 'lr';
   if (leftMiddle.has(k)) return 'lm';
   if (leftIndex.has(k)) return 'li';
   if (rightIndex.has(k)) return 'ri';
   if (rightMiddle.has(k)) return 'rm';
   if (rightRing.has(k)) return 'rr';
   if (rightPinky.has(k)) return 'rp';
   return 'thumb';
 }

 const fingerBg: Record<Finger, string> = {
   lp: 'bg-rose-600/30 border-rose-500/50',
   lr: 'bg-amber-600/30 border-amber-500/50',
   lm: 'bg-yellow-600/30 border-yellow-500/50',
   li: 'bg-lime-600/30 border-lime-500/50',
   ri: 'bg-sky-600/30 border-sky-500/50',
   rm: 'bg-blue-600/30 border-blue-500/50',
   rr: 'bg-indigo-600/30 border-indigo-500/50',
   rp: 'bg-violet-600/30 border-violet-500/50',
   thumb: 'bg-emerald-600/30 border-emerald-500/50'
 };

 export default function KeyboardGuide({ activeChar, show, onToggle }: Props) {
   const norm = normalize(activeChar);
   const activeKey = norm;
   const activeFinger: Finger | undefined = norm ? fingerForKey(norm) : undefined;

   return (
     <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 sm:p-4">
       <div className="flex items-center justify-between mb-2">
         <div className="text-xs uppercase tracking-wide text-slate-400">Keyboard & Hands</div>
         <button onClick={onToggle} className="text-xs px-2 py-1 rounded-md border border-slate-700 hover:bg-slate-800">
           {show ? 'Hide' : 'Show'}
         </button>
       </div>
       {show && (
         <div className="space-y-4">
           <div className="space-y-1">
             {keyRows.map((row, idx) => (
               <div key={idx} className="flex justify-center gap-1">
                 {row.map((k) => {
                   const f = fingerForKey(k);
                   const isActive = activeKey === k;
                   return (
                     <div
                       key={k}
                       className={`px-2 py-2 rounded-md border text-sm font-mono ${fingerBg[f]} ${isActive ? 'ring-2 ring-sky-400' : ''}`}
                     >{k}</div>
                   );
                 })}
               </div>
             ))}
             <div className="flex justify-center mt-2">
               <div className={`w-64 h-8 rounded-md border ${fingerBg['thumb']} ${activeKey==='space' ? 'ring-2 ring-sky-400' : ''}`}></div>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-2">
             <Hand side="left" active={activeFinger} />
             <Hand side="right" active={activeFinger} />
           </div>
         </div>
       )}
     </div>
   );
 }

 function Hand({ side, active }: { side: 'left' | 'right'; active?: Finger }) {
   const order: Finger[] = side === 'left' ? ['lp','lr','lm','li','thumb'] : ['thumb','ri','rm','rr','rp'];
   return (
     <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 flex items-end justify-center gap-1">
      {order.map((f) => {
        const base = `h-10 ${f==='thumb' ? 'w-8' : 'w-6'} rounded-md border`;
        const cls = active===f ? 'bg-sky-500/60 border-sky-400 ring-2 ring-sky-400' : fingerBg[f];
        return <div key={f} className={`${base} ${cls}`}></div>;
      })}
     </div>
   );
 }

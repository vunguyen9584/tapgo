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
    <div className="classic-panel p-3 sm:p-4 overflow-hidden">
       <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-wide text-[#666666]">Keyboard & Hands</div>
        <button onClick={onToggle} className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-100">
           {show ? 'Hide' : 'Show'}
         </button>
       </div>
       {show && (
        <div className="flex items-start gap-3 overflow-x-auto">
          <Hand side="left" active={activeFinger} />
          <div className="space-y-1 flex-1 min-w-0">
            {keyRows.map((row, idx) => (
              <div key={idx} className="flex justify-center gap-1">
                {row.map((k) => {
                  const isActive = activeKey === k;
                  return (
                    <div
                      key={k}
                      className={`keycap ${isActive ? 'keycap-active' : ''}`}
                    >{k}</div>
                  );
                })}
              </div>
            ))}
            <div className="flex justify-center mt-2">
              <div className={`w-64 h-8 keycap ${activeKey==='space' ? 'keycap-active' : ''}`}></div>
            </div>
          </div>
          <Hand side="right" active={activeFinger} />
        </div>
       )}
     </div>
   );
 }

 function Hand({ side, active }: { side: 'left' | 'right'; active?: Finger }) {
   const order: Finger[] = side === 'left' ? ['lp','lr','lm','li','thumb'] : ['thumb','ri','rm','rr','rp'];
   return (
    <div className="classic-panel p-2 flex flex-nowrap items-end justify-center gap-1 shrink-0 overflow-hidden">
       {order.map((f) => {
         const base = `relative h-10 ${f==='thumb' ? 'w-8' : 'w-6'} rounded-md border bg-white border-gray-300 flex-none`;
         const isActive = active===f;
         return (
           <div key={f} className={base}>
             {isActive && (
               <span className="absolute top-0 right-0 w-3 h-3 bg-[#00FF00] rounded-full translate-x-1/2 -translate-y-1/2"></span>
             )}
           </div>
         );
       })}
     </div>
   );
 }

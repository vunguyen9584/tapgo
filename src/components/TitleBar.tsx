 import React from 'react';

 export default function TitleBar({ title, right }: { title: string; right?: React.ReactNode }) {
   return (
     <div className="classic-bar px-4 py-3 flex items-center justify-between">
       <div className="flex items-center gap-2">
         <a href="/" title="Keyboard Master – Home" className="inline-flex items-center">
           <img src="/favicon.svg" alt="Keyboard Master" className="w-6 h-6" />
         </a>
         <div className="text-lg sm:text-xl font-semibold text-[#222222]">{title}</div>
       </div>
       <div>{right}</div>
     </div>
   );
 }

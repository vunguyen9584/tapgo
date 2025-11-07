 import React from 'react';

 export default function TitleBar({ title, right }: { title: string; right?: React.ReactNode }) {
   return (
     <div className="classic-bar px-4 py-3 flex items-center justify-between">
       <div className="text-lg sm:text-xl font-semibold text-[#222222]">{title}</div>
       <div>{right}</div>
     </div>
   );
 }

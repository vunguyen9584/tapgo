import React, { useEffect, useRef } from 'react';
 import type { AppStatus } from '../types';

 type Props = {
   text: string;
   typed: string;
   status: AppStatus;
   onType: (value: string) => void;
 };

 export default function TypingArea({ text, typed, status, onType }: Props) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { if (status !== 'finished') inputRef.current?.focus(); }, [status]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
     if (status === 'finished') return;
     if (e.ctrlKey || e.metaKey || e.altKey) return;
     const key = e.key;
    if (key === 'Tab' || key === 'Escape') { e.preventDefault(); return; }
    if (key === 'Enter') { e.preventDefault(); return; }
   }

  function block(e: React.SyntheticEvent) { e.preventDefault(); }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    const next = value.slice(0, text.length);
    onType(next);
  }

  const caretIndex = typed.length;

   return (
    <div className="space-y-3">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-6">
        <div className="font-mono text-lg sm:text-2xl leading-8 sm:leading-9 whitespace-pre-wrap break-words">
          {text.split('').map((ch, i) => {
            const typedCh = typed[i];
            const isCorrect = typedCh != null && typedCh === ch;
            const isWrong = typedCh != null && typedCh !== ch;
            const cls = isCorrect
              ? 'text-slate-200'
              : isWrong
              ? 'text-rose-500 underline decoration-rose-500/60'
              : 'text-slate-500';
            return (
              <span key={i} className={cls}>{ch}</span>
            );
          })}
        </div>
      </div>
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={block}
          onDrop={block}
          spellCheck={false}
          rows={3}
          className="w-full bg-transparent outline-none resize-none font-mono text-lg sm:text-2xl leading-8 sm:leading-9 text-slate-200 placeholder-slate-500"
          placeholder="Type here..."
        />
        <div className="text-xs text-slate-500 mt-2">Your input</div>
      </div>
    </div>
   );
 }

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

  // Compute next word highlight boundaries
  const caret = typed.length;
  let start = caret;
  while (start < text.length && /\s/.test(text[start] ?? '')) start++;
  let end = start;
  while (end < text.length && !/\s/.test(text[end] ?? '')) end++;

  return (
    <div className="space-y-3">
      <div className="classic-panel p-4 sm:p-6">
        <div className="font-mono text-lg sm:text-2xl leading-8 sm:leading-9 whitespace-pre-wrap break-words">
          {text.split('').map((ch, i) => {
            let cls = 'text-[#222222]';
            if (i < caret) cls = 'text-[#666666]';
            else if (i >= start && i < end) cls = 'text-[#0000FF] underline';
            return <span key={i} className={cls}>{ch}</span>;
          })}
        </div>
      </div>
      <div className="classic-panel p-3">
        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={block}
          onDrop={block}
          spellCheck={false}
          rows={3}
          className="w-full bg-white border border-gray-300 rounded-md outline-none resize-none font-mono text-lg sm:text-2xl leading-8 sm:leading-9 text-[#222222] placeholder-[#666666] px-2 py-1 focus:border-[#007BFF]"
          placeholder="Type here..."
        />
        <div className="text-xs text-[#666666] mt-2">Your input</div>
      </div>
    </div>
  );
}

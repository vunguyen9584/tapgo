import React, { useEffect, useRef } from 'react';
import { useI18n } from '../lib/i18n';
import type { AppStatus } from '../types';

type Props = {
  text: string;
  typed: string;
  status: AppStatus;
  onType: (value: string) => void;
  actions?: React.ReactNode;
  className?: string;
};

export default function TypingArea({ text, typed, status, onType, actions, className }: Props) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { t } = useI18n();

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
  // const nextIsSpace = caret < text.length && /\s/.test(text[caret] ?? '');
  // let start = caret;
  // while (start < text.length && /\s/.test(text[start] ?? '')) start++;
  // let end = start;
  // while (end < text.length && !/\s/.test(text[end] ?? '')) end++;

  return (
    <div className={`relative ${className || ''}`} onClick={() => inputRef.current?.focus()}>
      <div className="font-mono text-2xl leading-relaxed break-words">
        {text.split('').map((ch, i) => {
          const typedCh = i < caret ? typed[i] : undefined;
          let cls = 'text-gray-500'; // Default future text color

          if (i < caret) {
            // Past text
            cls = typedCh === ch ? 'text-green-400' : 'text-red-400';
          } else if (i === caret) {
            // Current character cursor
            cls = 'bg-blue-500 text-white rounded px-0.5';
          }

          return <span key={i} className={cls}>{ch}</span>;
        })}
      </div>

      {actions && (
        <div className="mt-4">
          {actions}
        </div>
      )}

      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={block}
        onDrop={block}
        spellCheck={false}
        className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default resize-none"
      />
    </div>
  );
}

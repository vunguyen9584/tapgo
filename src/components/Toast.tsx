import React, { useEffect } from 'react';

export type ToastItem = { id: string; message: string };

export function ToastContainer({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timers = items.map((it) => setTimeout(() => onDismiss(it.id), 3500));
    return () => { timers.forEach(clearTimeout); };
  }, [items, onDismiss]);

  if (!items.length) return null;
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2">
      {items.map((it) => (
        <div key={it.id} className="bg-[#222222] text-white text-sm px-3 py-2 rounded-md shadow-md max-w-xs">
          {it.message}
        </div>
      ))}
    </div>
  );
}

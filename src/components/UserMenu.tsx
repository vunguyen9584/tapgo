import React, { useEffect, useRef, useState } from 'react';

type FirebaseUser = import('firebase/auth').User;

export default function UserMenu({ user, onLogout }: { user: FirebaseUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const name = user.displayName || user.email || 'User';
  const initials = name?.trim()?.[0]?.toUpperCase() || 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-100"
        title={name}
      >
        <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-medium">
          {initials}
        </div>
        <span className="text-sm text-[#222222] hidden sm:inline max-w-[160px] truncate">{name}</span>
        <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="User menu"
          className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden"
        >
          <a
            href="/gioi-thieu.html"
            className="block px-3 py-2 text-sm text-[#222222] hover:bg-gray-100"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Giới thiệu
          </a>
          <button
            className="w-full text-left block px-3 py-2 text-sm text-[#222222] hover:bg-gray-100"
            role="menuitem"
            onClick={() => { setOpen(false); onLogout(); }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

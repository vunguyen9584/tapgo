import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { colors, transitions } from '../lib/design-system';

type Finger = 'lp' | 'lr' | 'lm' | 'li' | 'ri' | 'rm' | 'rr' | 'rp' | 'thumb';

interface KeyboardDisplayOptions {
  transparency: number;
  size: 'small' | 'medium' | 'large';
  showFingerGuides: boolean;
}

interface Props {
  activeChar?: string;
  show: boolean;
  onToggle: () => void;
  displayOptions?: KeyboardDisplayOptions;
  onDisplayOptionsChange?: (options: Partial<KeyboardDisplayOptions>) => void;
  theme?: 'light' | 'dark';
}

const keyRows: string[][] = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

function normalize(ch?: string): string | undefined {
  if (!ch) return undefined;
  if (ch === ' ') return 'space';
  const map: Record<string, string> = {
    '\u2018': '\'',
    '\u2019': '\'',
    '\u201C': '"',
    '\u201D': '"',
    '\u2013': '-',
    '\u2014': '-',
    '\u2026': '.',
    ':': ';',
    '"': '\'',
    '?': '/',
  };
  const repl = map[ch] ?? ch;
  return repl.toLowerCase();
}

function fingerForKey(k: string): Finger {
  if (k === 'space') return 'thumb';
  const leftPinky = new Set(['`', '1', 'q', 'a', 'z']);
  const leftRing = new Set(['2', 'w', 's', 'x']);
  const leftMiddle = new Set(['3', 'e', 'd', 'c']);
  const leftIndex = new Set(['4', '5', 'r', 't', 'f', 'g', 'v', 'b']);
  const rightIndex = new Set(['6', '7', 'y', 'u', 'h', 'j', 'n', 'm']);
  const rightMiddle = new Set(['8', 'i', 'k', ',']);
  const rightRing = new Set(['9', 'o', 'l', '.']);
  const rightPinky = new Set(['0', '-', '=', 'p', '[', ']', '\\', ';', '\'', '/']);
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

const fingerColors: Record<Finger, string> = {
  lp: 'bg-rose-500 border-rose-600',
  lr: 'bg-amber-500 border-amber-600',
  lm: 'bg-yellow-500 border-yellow-600',
  li: 'bg-lime-500 border-lime-600',
  ri: 'bg-sky-500 border-sky-600',
  rm: 'bg-blue-500 border-blue-600',
  rr: 'bg-indigo-500 border-indigo-600',
  rp: 'bg-violet-500 border-violet-600',
  thumb: 'bg-emerald-500 border-emerald-600'
};

const fingerBgColors: Record<Finger, string> = {
  lp: 'bg-rose-100 border-rose-500',
  lr: 'bg-amber-100 border-amber-500',
  lm: 'bg-yellow-100 border-yellow-500',
  li: 'bg-lime-100 border-lime-500',
  ri: 'bg-sky-100 border-sky-500',
  rm: 'bg-blue-100 border-blue-500',
  rr: 'bg-indigo-100 border-indigo-500',
  rp: 'bg-violet-100 border-violet-500',
  thumb: 'bg-emerald-100 border-emerald-500'
};

// Enhanced KeyCap Component
const KeyCap = ({
  char,
  isActive,
  size = 'medium',
  transparency = 1,
  finger,
  theme = 'light'
}: {
  char: string;
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
  transparency?: number;
  finger?: Finger;
  theme?: 'light' | 'dark';
}) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs min-w-[20px]',
    medium: 'px-3 py-2 text-sm min-w-[28px]',
    large: 'px-4 py-3 text-base min-w-[36px]'
  };

  const fingerColor = finger ? fingerColors[finger] : '';

  const baseBg = theme === 'dark' ? 'bg-[#2E324A] border-[#40445F] text-gray-300' : 'bg-white border-gray-300 text-gray-900';
  const activeBg = theme === 'dark' ? 'bg-blue-500 border-blue-400 text-white' : 'bg-green-100 border-green-500';

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-lg border transition-all duration-150 ease-out font-mono text-center
        ${isActive
          ? `${activeBg} shadow-lg transform scale-105 key-press`
          : `${baseBg} hover:border-gray-400 hover:transform hover:-translate-y-0.5`
        }
        ${fingerColor ? `relative` : ''}
      `}
      style={{
        opacity: transparency,
        transition: `all ${transitions.fast}`
      }}
    >
      {char}
      {finger && (
        <div
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${fingerColor}`}
          style={{ opacity: 0.8 }}
        />
      )}
    </div>
  );
};

// Enhanced Finger Guide Component
const FingerGuide = ({
  side,
  activeFinger,
  theme = 'light'
}: {
  side: 'left' | 'right';
  activeFinger?: Finger;
  theme?: 'light' | 'dark';
}) => {
  const order: Finger[] = side === 'left'
    ? ['lp', 'lr', 'lm', 'li', 'thumb']
    : ['thumb', 'ri', 'rm', 'rr', 'rp'];

  return (
    <div className={`p-2 flex flex-nowrap items-end justify-center gap-1 shrink-0 overflow-hidden rounded-xl ${theme === 'dark' ? 'bg-[#23263A]' : 'bg-white border border-gray-200'}`}>
      {order.map((f) => {
        const isActive = activeFinger === f;
        const baseClasses = `relative h-10 ${f === 'thumb' ? 'w-8' : 'w-6'} rounded-md border-2 flex-none transition-all duration-200`;
        const inactiveBg = theme === 'dark' ? 'bg-[#2E324A] border-[#40445F]' : 'bg-white border-gray-300';

        return (
          <div
            key={f}
            className={`
              ${baseClasses}
              ${isActive ? fingerBgColors[f] : inactiveBg}
              ${isActive ? 'shadow-md transform scale-105' : ''}
            `}
          >
            {isActive && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full transform translate-x-1/2 -translate-y-1/2 animate-pulse"></span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function EnhancedKeyboardGuide({
  activeChar,
  show,
  onToggle,
  displayOptions = {
    transparency: 1,
    size: 'medium',
    showFingerGuides: true
  },
  onDisplayOptionsChange,
  theme = 'light'
}: Props) {
  const { t } = useI18n();
  const [isAnimating, setIsAnimating] = useState(false);
  const norm = normalize(activeChar);
  const activeKey = norm;
  const activeFinger: Finger | undefined = norm ? fingerForKey(norm) : undefined;

  // Trigger animation when active key changes
  useEffect(() => {
    if (activeKey) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 150);
      return () => clearTimeout(timer);
    }
  }, [activeKey]);

  return (
    <div className={`p-3 sm:p-4 overflow-hidden rounded-xl ${theme === 'dark' ? 'bg-[#1A1C29]' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`text-xs uppercase tracking-wide font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('keyboardHands')}
        </div>
        <div className="flex items-center gap-2">
          {/* Display Options */}
          <div className="flex items-center gap-2">
            <label className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Size:</label>
            <select
              value={displayOptions.size}
              onChange={(e) => {
                const newSize = e.target.value as 'small' | 'medium' | 'large';
                onDisplayOptionsChange?.({ size: newSize });
              }}
              className={`text-xs border rounded px-2 py-1 ${theme === 'dark' ? 'bg-[#2E324A] border-[#40445F] text-gray-300' : 'bg-white border-gray-300'}`}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            <label className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Transparency:</label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.1"
              value={displayOptions.transparency}
              onChange={(e) => {
                const newTransparency = parseFloat(e.target.value);
                onDisplayOptionsChange?.({ transparency: newTransparency });
              }}
              className="w-16"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className={`flex items-center gap-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <input
                type="checkbox"
                checked={displayOptions.showFingerGuides}
                onChange={(e) => {
                  onDisplayOptionsChange?.({ showFingerGuides: e.target.checked });
                }}
                className="rounded"
              />
              Finger Guides
            </label>

            <button
              onClick={onToggle}
              className={`text-xs px-3 py-1.5 rounded-md border transition-colors duration-200 ${theme === 'dark' ? 'border-[#40445F] text-gray-300 hover:bg-[#2E324A]' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              {show ? t('hide') : t('show')}
            </button>
          </div>
        </div>
      </div>

      {show && (
        <div className="flex flex-col items-stretch gap-4 fade-in">
          {/* Keyboard Layout */}
          <div className="space-y-2 min-w-0">
            {keyRows.map((row, idx) => (
              <div key={idx} className="flex justify-center gap-1">
                {row.map((k) => {
                  const isActive = activeKey === k;
                  const finger = fingerForKey(k);
                  return (
                    <KeyCap
                      key={k}
                      char={k}
                      isActive={isActive}
                      size={displayOptions.size}
                      transparency={displayOptions.transparency}
                      finger={displayOptions.showFingerGuides ? finger : undefined}
                      theme={theme}
                    />
                  );
                })}
              </div>
            ))}
            {/* Space Bar */}
            <div className="flex justify-center mt-2">
              <div className="w-48 sm:w-64 h-8">
                <KeyCap
                  char=""
                  isActive={activeKey === 'space'}
                  size={displayOptions.size}
                  transparency={displayOptions.transparency}
                  finger={displayOptions.showFingerGuides ? 'thumb' : undefined}
                  theme={theme}
                />
              </div>
            </div>
          </div>

          {/* Finger Position Guides */}
          {displayOptions.showFingerGuides && (
            <div className="flex items-end justify-center gap-4">
              <FingerGuide side="left" activeFinger={activeFinger} theme={theme} />
              <div className={`text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                <div className="font-medium mb-1">Finger Position Guide</div>
                <div>Follow the highlighted fingers</div>
              </div>
              <FingerGuide side="right" activeFinger={activeFinger} theme={theme} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
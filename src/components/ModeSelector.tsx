import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

export type TypingMode = 'practice' | 'test' | 'custom' | 'numbers' | 'code' | 'competition';

interface Mode {
  id: TypingMode;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  locked?: boolean;
  comingSoon?: boolean;
}

interface Props {
  selectedMode?: TypingMode;
  onModeSelect?: (mode: TypingMode) => void;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const modes: Mode[] = [
  {
    id: 'practice',
    title: 'practice',
    description: 'practiceDescription',
    icon: '📝',
    difficulty: 'easy',
  },
  {
    id: 'test',
    title: 'test',
    description: 'testDescription',
    icon: '⏱️',
    difficulty: 'medium',
  },
  {
    id: 'custom',
    title: 'customText',
    description: 'customTextDescription',
    icon: '📄',
    difficulty: 'medium',
  },
  {
    id: 'numbers',
    title: 'numbersMode',
    description: 'numbersModeDescription',
    icon: '🔢',
    difficulty: 'medium',
  },
  {
    id: 'code',
    title: 'codeMode',
    description: 'codeModeDescription',
    icon: '💻',
    difficulty: 'hard',
  },
  {
    id: 'competition',
    title: 'competitionMode',
    description: 'competitionModeDescription',
    icon: '🏆',
    difficulty: 'hard',
    comingSoon: true,
  },
];

export default function ModeSelector({
  selectedMode,
  onModeSelect,
  showLabels = true,
  size = 'md',
}: Props) {
  const { t } = useI18n();
  const navigate = useNavigate();

  const sizeClasses = {
    sm: 'grid-cols-2 gap-2 p-2',
    md: 'grid-cols-3 gap-4 p-4',
    lg: 'grid-cols-3 gap-6 p-6',
  };

  const cardSizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  };

  const iconSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const handleModeClick = (mode: TypingMode) => {
    if (mode === 'competition') {
      // Show coming soon message for competition mode
      alert(t('comingSoon'));
      return;
    }
    
    if (onModeSelect) {
      onModeSelect(mode);
    } else {
      // Navigate to the mode page
      navigate(`/${mode}`);
    }
  };

  return (
    <div className={`w-full ${sizeClasses[size]}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('selectMode')}</h2>
        <p className="text-gray-600">{t('selectModeDescription')}</p>
      </div>

      <div className={`grid ${sizeClasses[size]}`}>
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const isLocked = mode.locked;
          const isComingSoon = mode.comingSoon;

          return (
            <div
              key={mode.id}
              onClick={() => !isLocked && !isComingSoon && handleModeClick(mode.id)}
              className={`
                relative bg-white border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer
                ${isSelected ? 'border-blue-500 shadow-lg transform scale-105' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}
                ${isLocked || isComingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:transform hover:-translate-y-1'}
                ${cardSizeClasses[size]}
              `}
            >
              {/* Coming Soon Badge */}
              {isComingSoon && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  {t('comingSoon')}
                </div>
              )}

              {/* Locked Badge */}
              {isLocked && (
                <div className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  {t('locked')}
                </div>
              )}

              {/* Mode Icon */}
              <div className={`text-center mb-3 ${iconSizeClasses[size]}`}>
                {mode.icon}
              </div>

              {/* Mode Title */}
              <div className="text-center">
                <h3 className={`font-bold text-gray-900 mb-2 ${showLabels ? '' : 'sr-only'}`}>
                  {t(mode.title)}
                </h3>
                
                {/* Difficulty Indicator */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">{t('difficulty')}:</span>
                  <div className="flex gap-1">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <div
                        key={level}
                        className={`
                          px-2 py-1 rounded text-xs font-medium
                          ${mode.difficulty === level
                            ? level === 'easy' ? 'bg-green-100 text-green-700'
                            : level === 'medium' ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                          }
                        `}
                      >
                        {t(level)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mode Description */}
              {showLabels && (
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  {t(mode.description)}
                </p>
              )}

              {/* Action Button */}
              {!isLocked && !isComingSoon && (
                <button
                  onClick={() => handleModeClick(mode.id)}
                  className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
                >
                  {isSelected ? t('continue') : t('start')}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for dashboard
export function CompactModeSelector({
  selectedMode,
  onModeSelect,
  className = '',
}: {
  selectedMode?: TypingMode;
  onModeSelect?: (mode: TypingMode) => void;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('quickAccess')}</h3>
      <div className="grid grid-cols-2 gap-2">
        {modes.slice(0, 4).map((mode) => {
          const isSelected = selectedMode === mode.id;
          const isComingSoon = mode.comingSoon;

          return (
            <button
              key={mode.id}
              onClick={() => !isComingSoon && onModeSelect?.(mode.id)}
              disabled={isComingSoon}
              className={`
                relative p-3 rounded-lg border transition-all duration-200 text-left
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                ${isComingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:transform hover:scale-105'}
              `}
            >
              {/* Coming Soon Badge */}
              {isComingSoon && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                  {t('soon')}
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-lg">{mode.icon}</span>
                <span className="text-sm font-medium text-gray-900">{t(mode.title)}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-3 text-center">
        <button
          onClick={() => onModeSelect?.('test')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {t('viewAllModes')}
        </button>
      </div>
    </div>
  );
}
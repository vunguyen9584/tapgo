import React from 'react';
import { useI18n } from '../lib/i18n';

type ProgressBarProps = {
  /**
   * Current progress value (0-100)
   */
  progress: number;
  /**
   * Optional label to display above or below the progress bar
   */
  label?: string;
  /**
   * Size of the progress bar
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color scheme for the progress bar
   */
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
  /**
   * Whether to show the percentage text
   */
  showPercentage?: boolean;
  /**
   * Whether to animate the progress bar
   */
  animated?: boolean;
  /**
   * Whether to show stripes pattern
   */
  striped?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom height for the progress bar
   */
  height?: string;
  /**
   * Whether to display as circular progress
   */
  circular?: boolean;
  /**
   * Size for circular progress (in pixels)
   */
  circularSize?: number;
};

export default function ProgressBar({
  progress,
  label,
  size = 'md',
  color = 'blue',
  showPercentage = true,
  animated = true,
  striped = false,
  className = '',
  height,
  circular = false,
  circularSize = 120,
}: ProgressBarProps) {
  const { t } = useI18n();

  // Ensure progress is within bounds
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Size configurations
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  // Color configurations
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  // Background color classes
  const bgColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
  };

  // Text color classes
  const textColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  // Circular progress component
  if (circular) {
    const radius = (circularSize - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    return (
      <div className={`flex flex-col items-center ${className}`}>
        {label && (
          <span className="text-sm font-medium text-gray-700 mb-2">{label}</span>
        )}
        <div className="relative" style={{ width: circularSize, height: circularSize }}>
          <svg
            className="transform -rotate-90"
            width={circularSize}
            height={circularSize}
          >
            {/* Background circle */}
            <circle
              cx={circularSize / 2}
              cy={circularSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx={circularSize / 2}
              cy={circularSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${colorClasses[color]} ${animated ? 'transition-all duration-500 ease-out' : ''}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${textColorClasses[color]}`}>
              {showPercentage ? `${Math.round(clampedProgress)}%` : ''}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Linear progress component
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className={`text-sm font-medium ${textColorClasses[color]}`}>
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${bgColorClasses[color]} rounded-full overflow-hidden ${
          height || sizeClasses[size]
        }`}
      >
        <div
          className={`h-full ${colorClasses[color]} rounded-full ${
            animated ? 'transition-all duration-500 ease-out' : ''
          } ${striped ? 'bg-stripes' : ''}`}
          style={{ width: `${clampedProgress}%` }}
        >
          {striped && (
            <div className="h-full w-full bg-stripes animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}

// Specialized progress components for different use cases

export function LessonProgressBar({
  completed,
  total,
  label,
  className = '',
}: {
  completed: number;
  total: number;
  label?: string;
  className?: string;
}) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <ProgressBar
      progress={progress}
      label={label || `${completed} of ${total} completed`}
      size="sm"
      color="green"
      className={className}
    />
  );
}

export function WPMProgressBar({
  currentWpm,
  targetWpm,
  label,
  className = '',
}: {
  currentWpm: number;
  targetWpm: number;
  label?: string;
  className?: string;
}) {
  const progress = targetWpm > 0 ? Math.min((currentWpm / targetWpm) * 100, 100) : 0;
  
  return (
    <ProgressBar
      progress={progress}
      label={label || `WPM: ${currentWpm} / ${targetWpm}`}
      size="md"
      color="blue"
      className={className}
    />
  );
}

export function AccuracyProgressBar({
  accuracy,
  label,
  className = '',
}: {
  accuracy: number;
  label?: string;
  className?: string;
}) {
  const progress = Math.min(accuracy, 100);
  const color = accuracy >= 95 ? 'green' : accuracy >= 85 ? 'yellow' : 'red';
  
  return (
    <ProgressBar
      progress={progress}
      label={label || `Accuracy: ${accuracy}%`}
      size="md"
      color={color}
      className={className}
    />
  );
}

export function StreakProgressBar({
  currentStreak,
  targetStreak,
  label,
  className = '',
}: {
  currentStreak: number;
  targetStreak: number;
  label?: string;
  className?: string;
}) {
  const progress = targetStreak > 0 ? Math.min((currentStreak / targetStreak) * 100, 100) : 0;
  
  return (
    <ProgressBar
      progress={progress}
      label={label || `Streak: ${currentStreak} / ${targetStreak} days`}
      size="md"
      color="orange"
      striped
      className={className}
    />
  );
}

export function CategoryProgressCard({
  title,
  progress,
  completedLessons,
  totalLessons,
  color = 'blue',
  className = '',
}: {
  title: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">
          {completedLessons}/{totalLessons}
        </span>
      </div>
      <ProgressBar
        progress={progress}
        size="sm"
        color={color}
        showPercentage={false}
      />
      <div className="mt-2 text-right">
        <span className="text-sm font-medium text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
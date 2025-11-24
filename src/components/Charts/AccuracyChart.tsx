import React from 'react';
import { useI18n } from '../../lib/i18n';
import { processAccuracyOverTime, type TimeSeriesData } from '../../lib/chartData';
import type { LessonProgress } from '../../lib/progressTracker';

type AccuracyChartProps = {
  lessons: Record<string, LessonProgress>;
  days?: number;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
};

export default function AccuracyChart({
  lessons,
  days = 30,
  height = 200,
  showGrid = true,
  showTooltip = true,
  className = '',
}: AccuracyChartProps) {
  const { t } = useI18n();
  const [hoveredPoint, setHoveredPoint] = React.useState<number | null>(null);
  
  const chartData: TimeSeriesData = React.useMemo(
    () => processAccuracyOverTime(lessons, days),
    [lessons, days]
  );

  const maxValue = 100; // Accuracy is always 0-100%
  const minValue = 0;
  const range = maxValue - minValue;

  // Generate points for path
  const generatePath = (data: number[]) => {
    if (data.length === 0) return '';
    
    const width = 100;
    const height = 100;
    const stepX = width / (data.length - 1 || 1);
    
    let path = `M 0,${height - (((data[0] || 0) - minValue) / range) * height}`;
    
    for (let i = 1; i < data.length; i++) {
      const x = i * stepX;
      const y = height - (((data[i] || 0) - minValue) / range) * height;
      path += ` L ${x},${y}`;
    }
    
    return path;
  };

  // Generate filled area path
  const generateAreaPath = (data: number[]) => {
    const linePath = generatePath(data);
    return `${linePath} L 100,100 L 0,100 Z`;
  };

  const mainDataset = chartData.datasets[0];

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('accuracyTrend')}</h3>
        <p className="text-sm text-gray-500">{t('lastNDays').replace('{days}', days.toString())}</p>
      </div>
      
      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {showGrid && (
            <g className="text-gray-200">
              {/* Horizontal grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={`h-${y}`}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              ))}
              {/* Vertical grid lines */}
              {chartData.labels.map((_, index) => {
                const x = (index / (chartData.labels.length - 1 || 1)) * 100;
                return (
                  <line
                    key={`v-${index}`}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                );
              })}
            </g>
          )}

          {/* Filled area */}
          <defs>
            <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0.05 }} />
            </linearGradient>
          </defs>
          
          <path
            d={generateAreaPath(mainDataset?.data || [])}
            fill="url(#accuracyGradient)"
            className="transition-all duration-300"
          />

          {/* Line */}
          <path
            d={generatePath(mainDataset?.data || [])}
            fill="none"
            stroke={mainDataset?.color || '#10B981'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Data points */}
          {(mainDataset?.data || []).map((value, index) => {
            const x = (index / ((mainDataset?.data?.length || 1) - 1 || 1)) * 100;
            const y = 100 - (((value || 0) - minValue) / range) * height;
            const isHovered = hoveredPoint === index;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 3 : 1.5}
                  fill={mainDataset?.color || '#10B981'}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {isHovered && showTooltip && (
                  <g>
                    <rect
                      x={x - 20}
                      y={y - 25}
                      width="40"
                      height="20"
                      fill="white"
                      stroke="#E5E7EB"
                      strokeWidth="0.5"
                      rx="4"
                    />
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      className="text-xs font-medium fill-gray-900"
                    >
                      {value}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-6">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* X-axis labels */}
        <div className="absolute left-0 bottom-0 w-full flex justify-between text-xs text-gray-500 -mb-6">
          {chartData.labels.map((label, index) => (
            <span
              key={index}
              className={
                index === 0 || index === chartData.labels.length - 1 || index % Math.ceil(chartData.labels.length / 6) === 0
                  ? 'block'
                  : 'hidden'
              }
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: mainDataset?.color || '#10B981' }}
          />
          <span className="text-sm text-gray-600">{mainDataset?.label || 'Accuracy'}</span>
        </div>
      </div>
    </div>
  );
}

// Compact version for dashboard
export function CompactAccuracyChart({
  lessons,
  days = 7,
  className = '',
}: {
  lessons: Record<string, LessonProgress>;
  days?: number;
  className?: string;
}) {
  const { t } = useI18n();
  const chartData: TimeSeriesData = React.useMemo(
    () => processAccuracyOverTime(lessons, days),
    [lessons, days]
  );

  const mainDataset = chartData.datasets[0];

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">{t('accuracyTrend')}</h4>
        <span className="text-xs text-gray-500">{t('lastNDays').replace('{days}', days.toString())}</span>
      </div>
      
      <div className="h-16 relative">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="compactAccuracyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          {/* Mini area chart */}
          <path
            d={(() => {
              const data = mainDataset?.data || [];
              if (data.length === 0) return '';
              
              const stepX = 100 / (data.length - 1 || 1);
              let path = `M 0,${100 - ((data[0] || 0) / 100) * 100}`;
              
              for (let i = 1; i < data.length; i++) {
                const x = i * stepX;
                const y = 100 - (((data[i] || 0) / 100) * 100);
                path += ` L ${x},${y}`;
              }
              
              return `${path} L 100,100 L 0,100 Z`;
            })()}
            fill="url(#compactAccuracyGradient)"
          />
          
          {/* Mini line */}
          <path
            d={(() => {
              const data = mainDataset?.data || [];
              if (data.length === 0) return '';
              
              const stepX = 100 / (data.length - 1 || 1);
              let path = `M 0,${100 - ((data[0] || 0) / 100) * 100}`;
              
              for (let i = 1; i < data.length; i++) {
                const x = i * stepX;
                const y = 100 - (((data[i] || 0) / 100) * 100);
                path += ` L ${x},${y}`;
              }
              
              return path;
            })()}
            fill="none"
            stroke={mainDataset?.color || '#10B981'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {t('average')}: {Math.round(((mainDataset?.data || []).reduce((a, b) => a + b, 0) / (mainDataset?.data?.length || 1) || 0))}%
      </div>
    </div>
  );
}
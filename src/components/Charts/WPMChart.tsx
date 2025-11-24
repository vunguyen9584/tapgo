import React from 'react';
import { useI18n } from '../../lib/i18n';
import { processWPMOverTime, type TimeSeriesData } from '../../lib/chartData';
import type { LessonProgress } from '../../lib/progressTracker';

type WPMChartProps = {
  lessons: Record<string, LessonProgress>;
  days?: number;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
};

export default function WPMChart({
  lessons,
  days = 30,
  height = 200,
  showGrid = true,
  showTooltip = true,
  className = '',
}: WPMChartProps) {
  const { t } = useI18n();
  const [hoveredPoint, setHoveredPoint] = React.useState<number | null>(null);
  
  const chartData: TimeSeriesData = React.useMemo(
    () => processWPMOverTime(lessons, days),
    [lessons, days]
  );

  const maxValue = Math.max(...(chartData.datasets[0]?.data || []), 10);
  const minValue = 0;
  const range = maxValue - minValue;

  // Generate points for the path
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
        <h3 className="text-lg font-semibold text-gray-900">{t('wpmOverTime')}</h3>
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
            <linearGradient id="wpmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0.05 }} />
            </linearGradient>
          </defs>
          
          <path
            d={generateAreaPath(mainDataset?.data || [])}
            fill="url(#wpmGradient)"
            className="transition-all duration-300"
          />

          {/* Line */}
          <path
            d={generatePath(mainDataset?.data || [])}
            fill="none"
            stroke={mainDataset?.color || '#3B82F6'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Data points */}
          {(mainDataset?.data || []).map((value, index) => {
            const x = (index / ((mainDataset?.data?.length || 1) - 1 || 1)) * 100;
            const y = 100 - ((value - minValue) / range) * 100;
            const isHovered = hoveredPoint === index;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 3 : 1.5}
                  fill={mainDataset?.color || '#3B82F6'}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {isHovered && showTooltip && (
                  <g>
                    <rect
                      x={x - 15}
                      y={y - 25}
                      width="30"
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
                      {value}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-6">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
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
            style={{ backgroundColor: mainDataset?.color || '#3B82F6' }}
          />
          <span className="text-sm text-gray-600">{mainDataset?.label || 'WPM'}</span>
        </div>
      </div>
    </div>
  );
}

// Compact version for dashboard
export function CompactWPMChart({
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
    () => processWPMOverTime(lessons, days),
    [lessons, days]
  );

  const maxValue = Math.max(...(chartData.datasets[0]?.data || []), 10);
  const mainDataset = chartData.datasets[0];

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">{t('wpmTrend')}</h4>
        <span className="text-xs text-gray-500">{t('lastNDays').replace('{days}', days.toString())}</span>
      </div>
      
      <div className="h-16 relative">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="compactWpmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          {/* Mini area chart */}
          <path
            d={(() => {
              const data = mainDataset?.data || [];
              if (data.length === 0) return '';
              
              const stepX = 100 / (data.length - 1 || 1);
              let path = `M 0,${100 - (((data[0] || 0) / maxValue) * 100)}`;
              
              for (let i = 1; i < data.length; i++) {
                const x = i * stepX;
                const y = 100 - (((data[i] || 0) / maxValue) * 100);
                path += ` L ${x},${y}`;
              }
              
              return `${path} L 100,100 L 0,100 Z`;
            })()}
            fill="url(#compactWpmGradient)"
          />
          
          {/* Mini line */}
          <path
            d={(() => {
              const data = mainDataset?.data || [];
              if (data.length === 0) return '';
              
              const stepX = 100 / (data.length - 1 || 1);
              let path = `M 0,${100 - (((data[0] || 0) / maxValue) * 100)}`;
              
              for (let i = 1; i < data.length; i++) {
                const x = i * stepX;
                const y = 100 - (((data[i] || 0) / maxValue) * 100);
                path += ` L ${x},${y}`;
              }
              
              return path;
            })()}
            fill="none"
            stroke={mainDataset?.color || '#3B82F6'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {t('average')}: {Math.round((mainDataset?.data || []).reduce((a, b) => a + b, 0) / (mainDataset?.data?.length || 1) || 0)} {t('wpmUnit')}
      </div>
    </div>
  );
}
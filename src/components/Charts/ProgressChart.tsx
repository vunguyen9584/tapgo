import React from 'react';
import { useI18n } from '../../lib/i18n';
import { processLessonCompletion, type PieChartData } from '../../lib/chartData';
import type { LessonProgress } from '../../lib/progressTracker';

type ProgressChartProps = {
  lessons: Record<string, LessonProgress>;
  showLabels?: boolean;
  showLegend?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function ProgressChart({
  lessons,
  showLabels = true,
  showLegend = true,
  size = 'md',
  className = '',
}: ProgressChartProps) {
  const { t } = useI18n();
  const [hoveredSegment, setHoveredSegment] = React.useState<number | null>(null);
  
  const chartData: PieChartData = React.useMemo(
    () => processLessonCompletion(lessons),
    [lessons]
  );

  const sizeConfig = {
    sm: { width: 120, height: 120, fontSize: 'text-xs' },
    md: { width: 200, height: 200, fontSize: 'text-sm' },
    lg: { width: 300, height: 300, fontSize: 'text-base' },
  };

  const config = sizeConfig[size];
  const centerX = config.width / 2;
  const centerY = config.height / 2;
  const radius = Math.min(centerX, centerY) - 10;

  // Calculate angles for each segment
  const total = (chartData.datasets[0]?.data || []).reduce((sum, value) => sum + value, 0);
  const angles = (chartData.datasets[0]?.data || []).map((value, index) => {
    const startAngle = (chartData.datasets[0]?.data || [])
      .slice(0, index)
      .reduce((sum, prevValue) => sum + (prevValue / total) * 360, 0);
    const endAngle = startAngle + (value / total) * 360;
    return { startAngle, endAngle, value, index };
  });

  // Generate path for pie segment
  const generateSegmentPath = (startAngle: number, endAngle: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  // Calculate label position
  const getLabelPosition = (startAngle: number, endAngle: number) => {
    const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
    const labelRadius = radius * 0.7;
    return {
      x: centerX + labelRadius * Math.cos(midAngle),
      y: centerY + labelRadius * Math.sin(midAngle),
    };
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('lessonProgress')}</h3>
        <p className="text-sm text-gray-500">{t('overallCompletion')}</p>
      </div>
      
      <div className="flex flex-col items-center">
        <svg
          width={config.width}
          height={config.height}
          viewBox={`0 0 ${config.width} ${config.height}`}
          className="transform -rotate-90"
        >
          {angles.map((angle, index) => {
            const isHovered = hoveredSegment === index;
            const color = chartData.datasets[0]?.colors?.[index] || '#6B7280';
            const path = generateSegmentPath(angle.startAngle, angle.endAngle);
            
            return (
              <g key={index}>
                <path
                  d={path}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className={`transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                  style={{
                    filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: `${centerX}px ${centerY}px`,
                  }}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
                
                {showLabels && angle.value > 0 && (
                  <text
                    x={getLabelPosition(angle.startAngle, angle.endAngle).y}
                    y={getLabelPosition(angle.startAngle, angle.endAngle).x}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`fill-white font-medium ${config.fontSize} transform rotate-90`}
                    style={{
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    {angle.value > 0 ? `${Math.round((angle.value / total) * 100)}%` : ''}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center" style={{ width: config.width, height: config.height }}>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(((chartData.datasets[0]?.data?.[0] || 0) / total) * 100)}%
          </div>
          <div className="text-sm text-gray-500">
            {t('completed')}
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {chartData.labels.map((label, index) => {
            const value = chartData.datasets[0]?.data?.[index] || 0;
            const color = chartData.datasets[0]?.colors?.[index] || '#6B7280';
            
            if (value === 0) return null;
            
            return (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-600">
                  {label} ({value})
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Donut chart variant
export function DonutChart({
  lessons,
  showLabels = true,
  showLegend = true,
  size = 'md',
  className = '',
}: ProgressChartProps) {
  const { t } = useI18n();
  const [hoveredSegment, setHoveredSegment] = React.useState<number | null>(null);
  
  const chartData: PieChartData = React.useMemo(
    () => processLessonCompletion(lessons),
    [lessons]
  );

  const sizeConfig = {
    sm: { width: 120, height: 120, fontSize: 'text-xs' },
    md: { width: 200, height: 200, fontSize: 'text-sm' },
    lg: { width: 300, height: 300, fontSize: 'text-base' },
  };

  const config = sizeConfig[size];
  const centerX = config.width / 2;
  const centerY = config.height / 2;
  const outerRadius = Math.min(centerX, centerY) - 10;
  const innerRadius = outerRadius * 0.6;

  // Calculate angles for each segment
  const total = (chartData.datasets[0]?.data || []).reduce((sum, value) => sum + value, 0);
  const angles = (chartData.datasets[0]?.data || []).map((value, index) => {
    const startAngle = (chartData.datasets[0]?.data || [])
      .slice(0, index)
      .reduce((sum, prevValue) => sum + (prevValue / total) * 360, 0);
    const endAngle = startAngle + (value / total) * 360;
    return { startAngle, endAngle, value, index };
  });

  // Generate path for donut segment
  const generateSegmentPath = (startAngle: number, endAngle: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);
    
    const x3 = centerX + innerRadius * Math.cos(startAngleRad);
    const y3 = centerY + innerRadius * Math.sin(startAngleRad);
    const x4 = centerX + innerRadius * Math.cos(endAngleRad);
    const y4 = centerY + innerRadius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${x3},${y3} L ${x1},${y1} A ${outerRadius},${outerRadius} 0 ${largeArcFlag},1 ${x2},${y2} L ${x4},${y4} A ${innerRadius},${innerRadius} 0 ${largeArcFlag},0 ${x3},${y3} Z`;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('lessonProgress')}</h3>
        <p className="text-sm text-gray-500">{t('overallCompletion')}</p>
      </div>
      
      <div className="flex flex-col items-center">
        <svg
          width={config.width}
          height={config.height}
          viewBox={`0 0 ${config.width} ${config.height}`}
          className="transform -rotate-90"
        >
          {angles.map((angle, index) => {
            const isHovered = hoveredSegment === index;
            const color = chartData.datasets[0]?.colors?.[index] || '#6B7280';
            const path = generateSegmentPath(angle.startAngle, angle.endAngle);
            
            return (
              <g key={index}>
                <path
                  d={path}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className={`transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                  style={{
                    filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: `${centerX}px ${centerY}px`,
                  }}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center" style={{ width: config.width, height: config.height }}>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(((chartData.datasets[0]?.data?.[0] || 0) / total) * 100)}%
          </div>
          <div className="text-sm text-gray-500">
            {t('completed')}
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {chartData.labels.map((label, index) => {
            const value = chartData.datasets[0]?.data?.[index] || 0;
            const color = chartData.datasets[0]?.colors?.[index] || '#6B7280';
            
            if (value === 0) return null;
            
            return (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-600">
                  {label} ({value})
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Compact version for dashboard
export function CompactProgressChart({
  lessons,
  className = '',
}: {
  lessons: Record<string, LessonProgress>;
  className?: string;
}) {
  const { t } = useI18n();
  const chartData: PieChartData = React.useMemo(
    () => processLessonCompletion(lessons),
    [lessons]
  );

  const total = (chartData.datasets[0]?.data || []).reduce((sum, value) => sum + value, 0);
  const completedPercentage = Math.round(((chartData.datasets[0]?.data?.[0] || 0) / total) * 100);

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">{t('completion')}</h4>
        <span className="text-xs text-gray-500">{t('overall')}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="transform -rotate-90">
            <path
              d={`M 18,18 m -14,0 a 14,14 0 1,0 28,0 a 14,14 0 1,0 -28,0`}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <path
              d={`M 18,18 m -14,0 a 14,14 0 1,0 ${28 * (completedPercentage / 100)},0 a 14,14 0 1,0 -${28 * (completedPercentage / 100)},0`}
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center transform rotate-90">
            <span className="text-sm font-bold text-gray-900">{completedPercentage}%</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">
            {chartData.labels[0]}: {chartData.datasets[0]?.data?.[0] || 0}
          </div>
          <div className="text-xs text-gray-500">
            {chartData.labels[1]}: {chartData.datasets[0]?.data?.[1] || 0}
          </div>
          <div className="text-xs text-gray-500">
            {chartData.labels[2]}: {chartData.datasets[0]?.data?.[2] || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
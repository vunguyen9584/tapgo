import type { LessonProgress } from './progressTracker';

export type ChartDataPoint = {
  label: string;
  value: number;
  date?: Date;
};

export type TimeSeriesData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
    fill?: boolean;
  }[];
};

export type PieChartData = {
  labels: string[];
  datasets: {
    data: number[];
    colors: string[];
  }[];
};

export type HeatmapData = {
  date: string;
  value: number;
  intensity: number;
}[];

/**
 * Process WPM data over time for line charts
 */
export function processWPMOverTime(lessons: Record<string, LessonProgress>, days: number = 30): TimeSeriesData {
  const now = new Date();
  const dates: string[] = [];
  const wpmData: number[] = [];
  
  // Generate date labels for the last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
    
    // Find lessons completed on this date
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const dayLessons = Object.values(lessons).filter(lesson => {
      if (!lesson.completedAt) return false;
      const completedDate = new Date(lesson.completedAt);
      return completedDate >= dayStart && completedDate <= dayEnd;
    });
    
    // Calculate average WPM for this day
    const dayWpm = dayLessons.length > 0
      ? Math.round(dayLessons.reduce((sum, lesson) => sum + lesson.wpm, 0) / dayLessons.length)
      : 0;
    
    wpmData.push(dayWpm);
  }
  
  return {
    labels: dates,
    datasets: [
      {
        label: 'WPM',
        data: wpmData,
        color: '#3B82F6',
        fill: true,
      },
    ],
  };
}

/**
 * Process accuracy data over time for area charts
 */
export function processAccuracyOverTime(lessons: Record<string, LessonProgress>, days: number = 30): TimeSeriesData {
  const now = new Date();
  const dates: string[] = [];
  const accuracyData: number[] = [];
  
  // Generate date labels for the last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
    
    // Find lessons completed on this date
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const dayLessons = Object.values(lessons).filter(lesson => {
      if (!lesson.completedAt) return false;
      const completedDate = new Date(lesson.completedAt);
      return completedDate >= dayStart && completedDate <= dayEnd;
    });
    
    // Calculate average accuracy for this day
    const dayAccuracy = dayLessons.length > 0
      ? Math.round(dayLessons.reduce((sum, lesson) => sum + lesson.accuracy, 0) / dayLessons.length)
      : 0;
    
    accuracyData.push(dayAccuracy);
  }
  
  return {
    labels: dates,
    datasets: [
      {
        label: 'Accuracy %',
        data: accuracyData,
        color: '#10B981',
        fill: true,
      },
    ],
  };
}

/**
 * Process lesson completion data for pie charts
 */
export function processLessonCompletion(lessons: Record<string, LessonProgress>): PieChartData {
  const lessonArray = Object.values(lessons);
  const completed = lessonArray.filter(lesson => lesson.completed).length;
  const inProgress = lessonArray.filter(lesson => !lesson.completed && lesson.attempts > 0).length;
  const notStarted = lessonArray.filter(lesson => !lesson.completed && lesson.attempts === 0).length;
  
  return {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [completed, inProgress, notStarted],
        colors: ['#10B981', '#F59E0B', '#6B7280'],
      },
    ],
  };
}

/**
 * Generate daily practice heatmap data
 */
export function generatePracticeHeatmap(lessons: Record<string, LessonProgress>, weeks: number = 12): HeatmapData {
  const now = new Date();
  const heatmapData: HeatmapData = [];
  
  // Generate data for the last N weeks
  for (let week = weeks - 1; week >= 0; week--) {
    for (let day = 6; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - (week * 7 + day));
      
      const dateStr = date.toISOString().split('T')[0] || '';
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      // Find lessons completed on this date
      const dayLessons = Object.values(lessons).filter(lesson => {
        if (!lesson.completedAt) return false;
        const completedDate = new Date(lesson.completedAt);
        return completedDate >= dayStart && completedDate <= dayEnd;
      });
      
      // Calculate intensity based on practice time
      const totalPracticeTime = dayLessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
      const intensity = Math.min(totalPracticeTime / 30, 1); // Normalize to 0-1 (30 minutes = full intensity)
      
      heatmapData.push({
        date: dateStr,
        value: totalPracticeTime,
        intensity,
      });
    }
  }
  
  return heatmapData;
}

/**
 * Calculate WPM distribution for histogram
 */
export function calculateWPMDistribution(lessons: Record<string, LessonProgress>): { range: string; count: number }[] {
  const completedLessons = Object.values(lessons).filter(lesson => lesson.completed);
  const wpms = completedLessons.map(lesson => lesson.wpm);
  
  const ranges = [
    { min: 0, max: 20, label: '0-20 WPM' },
    { min: 20, max: 30, label: '20-30 WPM' },
    { min: 30, max: 40, label: '30-40 WPM' },
    { min: 40, max: 50, label: '40-50 WPM' },
    { min: 50, max: 60, label: '50-60 WPM' },
    { min: 60, max: 80, label: '60-80 WPM' },
    { min: 80, max: 100, label: '80-100 WPM' },
    { min: 100, max: Infinity, label: '100+ WPM' },
  ];
  
  return ranges.map(range => ({
    range: range.label,
    count: wpms.filter(wpm => wpm >= range.min && wpm < range.max).length,
  }));
}

/**
 * Calculate accuracy distribution for histogram
 */
export function calculateAccuracyDistribution(lessons: Record<string, LessonProgress>): { range: string; count: number }[] {
  const completedLessons = Object.values(lessons).filter(lesson => lesson.completed);
  const accuracies = completedLessons.map(lesson => lesson.accuracy);
  
  const ranges = [
    { min: 0, max: 70, label: '0-70%' },
    { min: 70, max: 80, label: '70-80%' },
    { min: 80, max: 90, label: '80-90%' },
    { min: 90, max: 95, label: '90-95%' },
    { min: 95, max: 98, label: '95-98%' },
    { min: 98, max: 100, label: '98-100%' },
  ];
  
  return ranges.map(range => ({
    range: range.label,
    count: accuracies.filter(accuracy => accuracy >= range.min && accuracy < range.max).length,
  }));
}

/**
 * Generate weekly comparison data
 */
export function generateWeeklyComparison(lessons: Record<string, LessonProgress>): TimeSeriesData {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const avgWpmByDay: number[] = [0, 0, 0, 0, 0, 0, 0];
  const countByDay: number[] = [0, 0, 0, 0, 0, 0, 0];
  
  Object.values(lessons).forEach(lesson => {
    if (!lesson.completedAt) return;
    
    const date = new Date(lesson.completedAt);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek >= 0 && dayOfWeek < 7) {
      avgWpmByDay[dayOfWeek] = (avgWpmByDay[dayOfWeek] || 0) + lesson.wpm;
      countByDay[dayOfWeek] = (countByDay[dayOfWeek] || 0) + 1;
    }
  });
  
  // Calculate averages
  const avgWpmData = avgWpmByDay.map((total, index) =>
    countByDay[index] && countByDay[index] > 0 ? Math.round(total / countByDay[index]) : 0
  );
  
  return {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Average WPM',
        data: avgWpmData,
        color: '#8B5CF6',
      },
    ],
  };
}

/**
 * Calculate improvement trends
 */
export function calculateImprovementTrends(lessons: Record<string, LessonProgress>): {
  wpmTrend: 'improving' | 'declining' | 'stable';
  accuracyTrend: 'improving' | 'declining' | 'stable';
  wpmChange: number;
  accuracyChange: number;
} {
  const completedLessons = Object.values(lessons)
    .filter(lesson => lesson.completed && lesson.completedAt)
    .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());
  
  if (completedLessons.length < 2) {
    return {
      wpmTrend: 'stable',
      accuracyTrend: 'stable',
      wpmChange: 0,
      accuracyChange: 0,
    };
  }
  
  // Split into first half and second half
  const midpoint = Math.floor(completedLessons.length / 2);
  const firstHalf = completedLessons.slice(0, midpoint);
  const secondHalf = completedLessons.slice(midpoint);
  
  // Calculate averages for each half
  const firstHalfAvgWpm = firstHalf.reduce((sum, lesson) => sum + lesson.wpm, 0) / firstHalf.length;
  const secondHalfAvgWpm = secondHalf.reduce((sum, lesson) => sum + lesson.wpm, 0) / secondHalf.length;
  
  const firstHalfAvgAccuracy = firstHalf.reduce((sum, lesson) => sum + lesson.accuracy, 0) / firstHalf.length;
  const secondHalfAvgAccuracy = secondHalf.reduce((sum, lesson) => sum + lesson.accuracy, 0) / secondHalf.length;
  
  // Calculate changes
  const wpmChange = Math.round(((secondHalfAvgWpm - firstHalfAvgWpm) / firstHalfAvgWpm) * 100);
  const accuracyChange = Math.round(((secondHalfAvgAccuracy - firstHalfAvgAccuracy) / firstHalfAvgAccuracy) * 100);
  
  // Determine trends
  const wpmTrend = wpmChange > 5 ? 'improving' : wpmChange < -5 ? 'declining' : 'stable';
  const accuracyTrend = accuracyChange > 2 ? 'improving' : accuracyChange < -2 ? 'declining' : 'stable';
  
  return {
    wpmTrend,
    accuracyTrend,
    wpmChange,
    accuracyChange,
  };
}

/**
 * Generate insights and recommendations
 */
export function generateInsights(lessons: Record<string, LessonProgress>): {
  insights: string[];
  recommendations: string[];
} {
  const completedLessons = Object.values(lessons).filter(lesson => lesson.completed);
  const insights: string[] = [];
  const recommendations: string[] = [];
  
  if (completedLessons.length === 0) {
    return {
      insights: ['No lessons completed yet'],
      recommendations: ['Start with beginner lessons to build your foundation'],
    };
  }
  
  const avgWpm = completedLessons.reduce((sum, lesson) => sum + lesson.wpm, 0) / completedLessons.length;
  const avgAccuracy = completedLessons.reduce((sum, lesson) => sum + lesson.accuracy, 0) / completedLessons.length;
  const trends = calculateImprovementTrends(lessons);
  
  // Generate insights
  insights.push(`Completed ${completedLessons.length} lessons with average ${Math.round(avgWpm)} WPM`);
  insights.push(`Average accuracy: ${Math.round(avgAccuracy)}%`);
  
  if (trends.wpmTrend === 'improving') {
    insights.push(`Your speed is improving by ${Math.abs(trends.wpmChange)}%`);
  } else if (trends.wpmTrend === 'declining') {
    insights.push(`Your speed has decreased by ${Math.abs(trends.wpmChange)}%`);
  }
  
  if (trends.accuracyTrend === 'improving') {
    insights.push(`Your accuracy is improving by ${Math.abs(trends.accuracyChange)}%`);
  } else if (trends.accuracyTrend === 'declining') {
    insights.push(`Your accuracy has decreased by ${Math.abs(trends.accuracyChange)}%`);
  }
  
  // Generate recommendations
  if (avgWpm < 30) {
    recommendations.push('Focus on proper finger placement and posture');
    recommendations.push('Practice home row exercises regularly');
  } else if (avgWpm < 50) {
    recommendations.push('Try to maintain consistent rhythm while typing');
    recommendations.push('Practice with slightly more difficult texts');
  } else {
    recommendations.push('Challenge yourself with advanced lessons');
    recommendations.push('Focus on accuracy at high speeds');
  }
  
  if (avgAccuracy < 90) {
    recommendations.push('Slow down to focus on accuracy first');
    recommendations.push('Review and correct your mistakes');
  }
  
  if (trends.wpmTrend === 'declining') {
    recommendations.push('Take regular breaks to avoid fatigue');
    recommendations.push('Ensure proper ergonomics and posture');
  }
  
  return { insights, recommendations };
}
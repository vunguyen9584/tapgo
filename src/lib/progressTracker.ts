import type { User } from 'firebase/auth';

export type LessonProgress = {
  id: string;
  completed: boolean;
  wpm: number;
  accuracy: number;
  duration: number;
  errors: number;
  completedAt?: string;
  attempts: number;
  bestWpm: number;
  bestAccuracy: number;
};

export type ProgressStats = {
  totalLessons: number;
  completedLessons: number;
  averageWPM: number;
  averageAccuracy: number;
  bestWPM: number;
  bestAccuracy: number;
  practiceStreak: number;
  totalTime: number;
  lastPracticeDate: Date | null;
  weeklyProgress: number[];
  monthlyProgress: number[];
};

export type MilestoneAchievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  type: 'wpm' | 'accuracy' | 'streak' | 'lessons';
  unlocked: boolean;
  unlockedAt?: Date;
};

export class ProgressTracker {
  private static instance: ProgressTracker;
  
  static getInstance(): ProgressTracker {
    if (!ProgressTracker.instance) {
      ProgressTracker.instance = new ProgressTracker();
    }
    return ProgressTracker.instance;
  }

  /**
   * Calculate lesson completion percentage
   */
  calculateLessonCompletion(lessons: Record<string, LessonProgress>): number {
    const lessonArray = Object.values(lessons);
    if (lessonArray.length === 0) return 0;
    
    const completedLessons = lessonArray.filter(lesson => lesson.completed);
    return Math.round((completedLessons.length / lessonArray.length) * 100);
  }

  /**
   * Track best WPM and accuracy for a lesson
   */
  updateLessonBestScores(
    lesson: LessonProgress,
    newWpm: number,
    newAccuracy: number
  ): LessonProgress {
    return {
      ...lesson,
      bestWpm: Math.max(lesson.bestWpm, newWpm),
      bestAccuracy: Math.max(lesson.bestAccuracy, newAccuracy),
    };
  }

  /**
   * Generate comprehensive progress report
   */
  generateProgressReport(lessons: Record<string, LessonProgress>): ProgressStats {
    const lessonArray = Object.values(lessons);
    const completedLessons = lessonArray.filter(lesson => lesson.completed);
    
    // Basic statistics
    const totalLessons = lessonArray.length;
    const completedCount = completedLessons.length;
    
    // WPM and accuracy calculations
    const wpmValues = completedLessons.map(lesson => lesson.wpm || 0);
    const accuracyValues = completedLessons.map(lesson => lesson.accuracy || 0);
    
    const averageWPM = wpmValues.length > 0 
      ? Math.round(wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length)
      : 0;
    const averageAccuracy = accuracyValues.length > 0
      ? Math.round(accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length)
      : 0;
    const bestWPM = wpmValues.length > 0 ? Math.max(...wpmValues) : 0;
    const bestAccuracy = accuracyValues.length > 0 ? Math.max(...accuracyValues) : 0;

    // Practice streak calculation
    const practiceDates = completedLessons
      .filter(lesson => lesson.completedAt)
      .map(lesson => new Date(lesson.completedAt!))
      .sort((a, b) => b.getTime() - a.getTime());
    
    const lastPracticeDate = practiceDates.length > 0 ? practiceDates[0] : null;
    const practiceStreak = this.calculatePracticeStreak(practiceDates);

    // Total practice time
    const totalTime = completedLessons.reduce(
      (total, lesson) => total + (lesson.duration || 0),
      0
    );

    // Weekly and monthly progress (mock data for now)
    const weeklyProgress = this.generateWeeklyProgress(completedLessons);
    const monthlyProgress = this.generateMonthlyProgress(completedLessons);

    return {
      totalLessons,
      completedLessons: completedCount,
      averageWPM,
      averageAccuracy,
      bestWPM,
      bestAccuracy,
      practiceStreak,
      totalTime,
      lastPracticeDate,
      weeklyProgress,
      monthlyProgress,
    };
  }

  /**
   * Calculate practice streak in days
   */
  private calculatePracticeStreak(practiceDates: Date[]): number {
    if (practiceDates.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentDate = new Date(today);
    
    for (let i = 0; i < 365; i++) {
      const dateStr = currentDate.toDateString();
      const hasPracticeOnDate = practiceDates.some(
        date => date.toDateString() === dateStr
      );
      
      if (hasPracticeOnDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // Allow for one missed day if streak is already established
        if (streak > 0 && i === 0) {
          // Check if practiced yesterday
          currentDate.setDate(currentDate.getDate() - 1);
          const yesterdayStr = currentDate.toDateString();
          const practicedYesterday = practiceDates.some(
            date => date.toDateString() === yesterdayStr
          );
          if (practicedYesterday) {
            continue;
          }
        }
        break;
      }
    }
    
    return streak;
  }

  /**
   * Generate weekly progress data (last 7 days)
   */
  private generateWeeklyProgress(completedLessons: LessonProgress[]): number[] {
    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    
    completedLessons.forEach(lesson => {
      if (lesson.completedAt) {
        const completedDate = new Date(lesson.completedAt);
        const daysDiff = Math.floor((today.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 7 && daysDiff >= 0) {
          weeklyData[6 - daysDiff] += lesson.wpm || 0;
        }
      }
    });
    
    return weeklyData;
  }

  /**
   * Generate monthly progress data (last 30 days)
   */
  private generateMonthlyProgress(completedLessons: LessonProgress[]): number[] {
    const monthlyData = new Array(30).fill(0);
    const today = new Date();
    
    completedLessons.forEach(lesson => {
      if (lesson.completedAt) {
        const completedDate = new Date(lesson.completedAt);
        const daysDiff = Math.floor((today.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 30 && daysDiff >= 0) {
          monthlyData[29 - daysDiff] += lesson.wpm || 0;
        }
      }
    });
    
    return monthlyData;
  }

  /**
   * Handle milestone achievements
   */
  checkMilestones(stats: ProgressStats): MilestoneAchievement[] {
    const milestones: MilestoneAchievement[] = [
      {
        id: 'first_lesson',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        threshold: 1,
        type: 'lessons',
        unlocked: stats.completedLessons >= 1,
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Reach 60 WPM',
        icon: '⚡',
        threshold: 60,
        type: 'wpm',
        unlocked: stats.bestWPM >= 60,
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 100% accuracy',
        icon: '💯',
        threshold: 100,
        type: 'accuracy',
        unlocked: stats.bestAccuracy >= 100,
      },
      {
        id: 'dedicated',
        name: 'Dedicated',
        description: '7-day practice streak',
        icon: '🔥',
        threshold: 7,
        type: 'streak',
        unlocked: stats.practiceStreak >= 7,
      },
      {
        id: 'marathon_runner',
        name: 'Marathon Runner',
        description: 'Practice for 10 hours total',
        icon: '🏃',
        threshold: 600, // 10 hours in minutes
        type: 'lessons',
        unlocked: stats.totalTime >= 600,
      },
      {
        id: 'consistency_king',
        name: 'Consistency King',
        description: '30-day practice streak',
        icon: '👑',
        threshold: 30,
        type: 'streak',
        unlocked: stats.practiceStreak >= 30,
      },
      {
        id: 'speed_master',
        name: 'Speed Master',
        description: 'Reach 100 WPM',
        icon: '🚀',
        threshold: 100,
        type: 'wpm',
        unlocked: stats.bestWPM >= 100,
      },
      {
        id: 'lesson_collector',
        name: 'Lesson Collector',
        description: 'Complete 50 lessons',
        icon: '📚',
        threshold: 50,
        type: 'lessons',
        unlocked: stats.completedLessons >= 50,
      },
    ];

    return milestones;
  }

  /**
   * Get next milestone for motivation
   */
  getNextMilestone(stats: ProgressStats): MilestoneAchievement | null {
    const milestones = this.checkMilestones(stats);
    const unlockedMilestones = milestones.filter(m => m.unlocked);
    
    // Find the next unachieved milestone
    for (const milestone of milestones) {
      if (!milestone.unlocked) {
        return milestone;
      }
    }
    
    return null; // All milestones achieved
  }

  /**
   * Calculate improvement percentage
   */
  calculateImprovement(
    currentStats: ProgressStats,
    previousStats: ProgressStats
  ): { wpmImprovement: number; accuracyImprovement: number } {
    const wpmImprovement = previousStats.averageWPM > 0
      ? Math.round(((currentStats.averageWPM - previousStats.averageWPM) / previousStats.averageWPM) * 100)
      : 0;
    
    const accuracyImprovement = previousStats.averageAccuracy > 0
      ? Math.round(((currentStats.averageAccuracy - previousStats.averageAccuracy) / previousStats.averageAccuracy) * 100)
      : 0;
    
    return { wpmImprovement, accuracyImprovement };
  }
}

export default ProgressTracker.getInstance();
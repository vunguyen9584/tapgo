import { useState, useEffect, useCallback } from 'react';
import { saveProgress, loadProgress } from '../lib/firebase';
import progressTracker, { type LessonProgress, type ProgressStats, type MilestoneAchievement } from '../lib/progressTracker';
import type { User } from 'firebase/auth';

export function useProgress(user: User | null) {
  const [lessons, setLessons] = useState<Record<string, LessonProgress>>({});
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [milestones, setMilestones] = useState<MilestoneAchievement[]>([]);
  const [nextMilestone, setNextMilestone] = useState<MilestoneAchievement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load progress data
  const loadProgressData = useCallback(async () => {
    if (!user) {
      setLessons({});
      setStats(null);
      setMilestones([]);
      setNextMilestone(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const progressData = await loadProgress(user.uid);
      const lessonsData = progressData?.lessons || {};
      
      setLessons(lessonsData);

      // Calculate stats using progress tracker
      const progressStats = progressTracker.generateProgressReport(lessonsData);
      setStats(progressStats);

      // Check milestones
      const userMilestones = progressTracker.checkMilestones(progressStats);
      setMilestones(userMilestones);

      // Get next milestone for motivation
      const next = progressTracker.getNextMilestone(progressStats);
      setNextMilestone(next);

    } catch (err) {
      console.error('Failed to load progress:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update lesson progress
  const updateLessonProgress = useCallback(async (
    lessonId: string,
    updates: Partial<LessonProgress>
  ) => {
    if (!user) return;

    try {
      const currentLesson = lessons[lessonId] || {
        id: lessonId,
        completed: false,
        wpm: 0,
        accuracy: 0,
        duration: 0,
        errors: 0,
        attempts: 0,
        bestWpm: 0,
        bestAccuracy: 0,
      };

      // Update with new data
      let updatedLesson = { ...currentLesson, ...updates };

      // Update best scores if this is a completed attempt
      if (updates.wpm !== undefined || updates.accuracy !== undefined) {
        updatedLesson = progressTracker.updateLessonBestScores(
          updatedLesson,
          updates.wpm || currentLesson.wpm,
          updates.accuracy || currentLesson.accuracy
        );
      }

      // Increment attempts if this is a new attempt
      if (updates.wpm !== undefined || updates.accuracy !== undefined) {
        updatedLesson.attempts += 1;
      }

      // Mark as completed if accuracy and WPM meet minimum requirements
      if (updatedLesson.wpm >= 20 && updatedLesson.accuracy >= 90) {
        updatedLesson.completed = true;
        updatedLesson.completedAt = new Date().toISOString();
      }

      // Update local state
      const updatedLessons = { ...lessons, [lessonId]: updatedLesson };
      setLessons(updatedLessons);

      // Save to Firebase
      await saveProgress(user.uid, { lessons: updatedLessons });

      // Recalculate stats and milestones
      const newStats = progressTracker.generateProgressReport(updatedLessons);
      setStats(newStats);

      const newMilestones = progressTracker.checkMilestones(newStats);
      setMilestones(newMilestones);

      const next = progressTracker.getNextMilestone(newStats);
      setNextMilestone(next);

      return updatedLesson;
    } catch (err) {
      console.error('Failed to update lesson progress:', err);
      setError('Failed to update progress');
      throw err;
    }
  }, [user, lessons]);

  // Get lesson progress
  const getLessonProgress = useCallback((lessonId: string): LessonProgress | null => {
    return lessons[lessonId] || null;
  }, [lessons]);

  // Get completion percentage for a category
  const getCategoryCompletion = useCallback((lessonIds: string[]): number => {
    const categoryLessons = lessonIds.map(id => lessons[id]).filter(Boolean);
    if (categoryLessons.length === 0) return 0;
    
    const completed = categoryLessons.filter(lesson => lesson!.completed);
    return Math.round((completed.length / categoryLessons.length) * 100);
  }, [lessons]);

  // Get overall completion percentage
  const getOverallCompletion = useCallback((): number => {
    return progressTracker.calculateLessonCompletion(lessons);
  }, [lessons]);

  // Check if lesson is unlocked
  const isLessonUnlocked = useCallback((lessonId: string, requiredLessonIds: string[] = []): boolean => {
    // If no requirements, lesson is unlocked
    if (requiredLessonIds.length === 0) return true;

    // Check if all required lessons are completed
    return requiredLessonIds.every(id => lessons[id]?.completed);
  }, [lessons]);

  // Get practice streak
  const getPracticeStreak = useCallback((): number => {
    return stats?.practiceStreak || 0;
  }, [stats]);

  // Get weekly progress data
  const getWeeklyProgress = useCallback((): number[] => {
    return stats?.weeklyProgress || [0, 0, 0, 0, 0, 0, 0];
  }, [stats]);

  // Get monthly progress data
  const getMonthlyProgress = useCallback((): number[] => {
    return stats?.monthlyProgress || new Array(30).fill(0);
  }, [stats]);

  // Reset progress (for testing or user request)
  const resetProgress = useCallback(async () => {
    if (!user) return;

    try {
      await saveProgress(user.uid, { lessons: {} });
      setLessons({});
      setStats(null);
      setMilestones([]);
      setNextMilestone(null);
    } catch (err) {
      console.error('Failed to reset progress:', err);
      setError('Failed to reset progress');
      throw err;
    }
  }, [user]);

  // Export progress data
  const exportProgress = useCallback((): string => {
    const exportData = {
      lessons,
      stats,
      milestones,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(exportData, null, 2);
  }, [lessons, stats, milestones]);

  // Load progress on mount and when user changes
  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  return {
    // Data
    lessons,
    stats,
    milestones,
    nextMilestone,
    loading,
    error,

    // Methods
    updateLessonProgress,
    getLessonProgress,
    getCategoryCompletion,
    getOverallCompletion,
    isLessonUnlocked,
    getPracticeStreak,
    getWeeklyProgress,
    getMonthlyProgress,
    resetProgress,
    exportProgress,
    loadProgressData,
  };
}

export default useProgress;
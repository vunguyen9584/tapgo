import { useState, useEffect } from 'react';
import { loadProgress, loadSettings } from '../lib/firebase';
import type { User } from 'firebase/auth';

type UserStats = {
  totalLessonsCompleted: number;
  averageWPM: number;
  averageAccuracy: number;
  practiceStreak: number;
  totalTime: number;
  bestWPM: number;
  bestAccuracy: number;
  lastPracticeDate: Date | null;
};

type UserProgress = {
  lessons: Record<string, any>;
  settings: Record<string, any>;
  stats: UserStats;
};

export function useUserData(user: User | null) {
  const [userData, setUserData] = useState<UserProgress>({
    lessons: {},
    settings: {},
    stats: {
      totalLessonsCompleted: 0,
      averageWPM: 0,
      averageAccuracy: 0,
      practiceStreak: 0,
      totalTime: 0,
      bestWPM: 0,
      bestAccuracy: 0,
      lastPracticeDate: null,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        setUserData({
          lessons: {},
          settings: {},
          stats: {
            totalLessonsCompleted: 0,
            averageWPM: 0,
            averageAccuracy: 0,
            practiceStreak: 0,
            totalTime: 0,
            bestWPM: 0,
            bestAccuracy: 0,
            lastPracticeDate: null,
          },
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [progressData, settingsData] = await Promise.all([
          loadProgress(user.uid),
          loadSettings(user.uid),
        ]);

        const lessons = progressData?.lessons || {};
        const settings = settingsData || {};

        // Calculate statistics from lessons data
        const lessonArray = Object.values(lessons);
        const completedLessons = lessonArray.filter((lesson: any) => lesson.completed);
        
        const wpmValues = completedLessons.map((lesson: any) => lesson.wpm || 0);
        const accuracyValues = completedLessons.map((lesson: any) => lesson.accuracy || 0);
        
        const totalLessonsCompleted = completedLessons.length;
        const averageWPM = wpmValues.length > 0 
          ? Math.round(wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length)
          : 0;
        const averageAccuracy = accuracyValues.length > 0
          ? Math.round(accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length)
          : 0;
        const bestWPM = wpmValues.length > 0 ? Math.max(...wpmValues) : 0;
        const bestAccuracy = accuracyValues.length > 0 ? Math.max(...accuracyValues) : 0;

        // Calculate practice streak (simplified - could be enhanced)
        const practiceDates = completedLessons
          .filter((lesson: any) => lesson.completedAt)
          .map((lesson: any) => new Date(lesson.completedAt))
          .sort((a, b) => b.getTime() - a.getTime());
        
        const lastPracticeDate = practiceDates.length > 0 ? practiceDates[0] : null;
        
        // Simple streak calculation (consecutive days with practice)
        let practiceStreak = 0;
        if (lastPracticeDate) {
          const today = new Date();
          const currentDate = new Date(today);
          
          for (let i = 0; i < 365; i++) { // Check up to a year
            const dateStr = currentDate.toDateString();
            const hasPracticeOnDate = practiceDates.some(
              date => date.toDateString() === dateStr
            );
            
            if (hasPracticeOnDate) {
              practiceStreak++;
              currentDate.setDate(currentDate.getDate() - 1);
            } else {
              break;
            }
          }
        }

        // Calculate total practice time
        const totalTime = completedLessons.reduce(
          (total: number, lesson: any) => total + (lesson.duration || 0),
          0
        );

        const stats: UserStats = {
          totalLessonsCompleted,
          averageWPM,
          averageAccuracy,
          practiceStreak,
          totalTime,
          bestWPM,
          bestAccuracy,
          lastPracticeDate,
        };

        setUserData({
          lessons,
          settings,
          stats,
        });
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  const updateLocalData = (updates: Partial<UserProgress>) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const getLessonProgress = (lessonId: string) => {
    return userData.lessons[lessonId] || null;
  };

  const getSetting = (key: string, defaultValue: any = null) => {
    return userData.settings[key] ?? defaultValue;
  };

  return {
    userData,
    loading,
    error,
    updateLocalData,
    getLessonProgress,
    getSetting,
  };
}
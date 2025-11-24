import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { loadProgress, loadSettings } from '../lib/firebase';

type Props = {
  user?: import('firebase/auth').User | null;
};

type UserStats = {
  totalLessonsCompleted: number;
  averageWPM: number;
  averageAccuracy: number;
  practiceStreak: number;
  totalTime: number;
  bestWPM: number;
  bestAccuracy: number;
};

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
};

export default function Profile({ user }: Props) {
  const { t } = useI18n();
  const [stats, setStats] = useState<UserStats>({
    totalLessonsCompleted: 0,
    averageWPM: 0,
    averageAccuracy: 0,
    practiceStreak: 0,
    totalTime: 0,
    bestWPM: 0,
    bestAccuracy: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [progressData, settingsData] = await Promise.all([
          loadProgress(user.uid),
          loadSettings(user.uid),
        ]);

        // Calculate stats from progress data
        if (progressData && progressData.lessons) {
          const lessons = Object.values(progressData.lessons);
          const completedLessons = lessons.filter((lesson: any) => lesson.completed);
          const wpmValues = completedLessons.map((lesson: any) => lesson.wpm || 0);
          const accuracyValues = completedLessons.map((lesson: any) => lesson.accuracy || 0);

          setStats({
            totalLessonsCompleted: completedLessons.length,
            averageWPM: wpmValues.length > 0 ? Math.round(wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length) : 0,
            averageAccuracy: accuracyValues.length > 0 ? Math.round(accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length) : 0,
            practiceStreak: settingsData?.practiceStreak || 0,
            totalTime: settingsData?.totalTime || 0,
            bestWPM: Math.max(...wpmValues, 0),
            bestAccuracy: Math.max(...accuracyValues, 0),
          });
        }

        // Load achievements (mock data for now)
        setAchievements([
          {
            id: 'first_lesson',
            name: t('firstLessonAchievement'),
            description: t('firstLessonAchievementDesc'),
            icon: '🎯',
            unlocked: stats.totalLessonsCompleted > 0,
          },
          {
            id: 'speed_demon',
            name: t('speedDemonAchievement'),
            description: t('speedDemonAchievementDesc'),
            icon: '⚡',
            unlocked: stats.bestWPM >= 60,
          },
          {
            id: 'perfectionist',
            name: t('perfectionistAchievement'),
            description: t('perfectionistAchievementDesc'),
            icon: '💯',
            unlocked: stats.bestAccuracy >= 100,
          },
          {
            id: 'dedicated',
            name: t('dedicatedAchievement'),
            description: t('dedicatedAchievementDesc'),
            icon: '🔥',
            unlocked: stats.practiceStreak >= 7,
          },
        ]);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user, t]);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('profile')}</h1>
          <p className="text-gray-600">{t('pleaseLoginToViewProfile')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('profile')}</h1>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
            alt="Avatar"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.displayName || user.email}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              {t('memberSince')} {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('statistics')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalLessonsCompleted}</div>
            <div className="text-sm text-gray-600">{t('lessonsCompleted')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.averageWPM}</div>
            <div className="text-sm text-gray-600">{t('averageWPM')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.averageAccuracy}%</div>
            <div className="text-sm text-gray-600">{t('averageAccuracy')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.practiceStreak}</div>
            <div className="text-sm text-gray-600">{t('practiceStreak')}</div>
          </div>
        </div>
      </div>

      {/* Best Performance */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('bestPerformance')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.bestWPM}</div>
            <div className="text-sm text-gray-600">{t('bestWPM')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.bestAccuracy}%</div>
            <div className="text-sm text-gray-600">{t('bestAccuracy')}</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t('achievements')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.unlocked
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-gray-500">
                      {t('unlockedOn')} {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
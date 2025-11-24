import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import type { User } from 'firebase/auth';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  totalTests: number;
  streak: number;
  country: string;
  joinDate: string;
  isUser?: boolean;
}

interface Props {
  user?: import('firebase/auth').User | null;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    rank: 1,
    name: 'SpeedDemon',
    avatar: '👹',
    wpm: 145,
    accuracy: 99.2,
    totalTests: 1250,
    streak: 45,
    country: '🇺🇸',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    rank: 2,
    name: 'TypeMaster',
    avatar: '🎯',
    wpm: 138,
    accuracy: 98.8,
    totalTests: 980,
    streak: 32,
    country: '🇬🇧',
    joinDate: '2023-02-20',
  },
  {
    id: '3',
    rank: 3,
    name: 'KeyboardNinja',
    avatar: '🥷',
    wpm: 132,
    accuracy: 99.5,
    totalTests: 856,
    streak: 28,
    country: '🇯🇵',
    joinDate: '2023-03-10',
  },
  {
    id: '4',
    rank: 4,
    name: 'CodeWizard',
    avatar: '🧙‍♂️',
    wpm: 128,
    accuracy: 97.9,
    totalTests: 743,
    streak: 21,
    country: '🇩🇪',
    joinDate: '2023-04-05',
  },
  {
    id: '5',
    rank: 5,
    name: 'TypingQueen',
    avatar: '👸',
    wpm: 125,
    accuracy: 98.3,
    totalTests: 692,
    streak: 19,
    country: '🇨🇦',
    joinDate: '2023-05-12',
  },
  {
    id: '6',
    rank: 6,
    name: 'FastFingers',
    avatar: '🤘',
    wpm: 122,
    accuracy: 97.5,
    totalTests: 634,
    streak: 17,
    country: '🇦🇺',
    joinDate: '2023-06-08',
  },
  {
    id: '7',
    rank: 7,
    name: 'PixelTyper',
    avatar: '🎮',
    wpm: 119,
    accuracy: 96.8,
    totalTests: 587,
    streak: 15,
    country: '🇫🇷',
    joinDate: '2023-07-14',
  },
  {
    id: '8',
    rank: 8,
    name: 'SwiftKeys',
    avatar: '⚡',
    wpm: 116,
    accuracy: 97.2,
    totalTests: 523,
    streak: 14,
    country: '🇧🇷',
    joinDate: '2023-08-20',
  },
  {
    id: '9',
    rank: 9,
    name: 'RapidFire',
    avatar: '🔥',
    wpm: 114,
    accuracy: 96.5,
    totalTests: 489,
    streak: 12,
    country: '🇮🇳',
    joinDate: '2023-09-16',
  },
  {
    id: '10',
    rank: 10,
    name: 'BlazeTypist',
    avatar: '💫',
    wpm: 112,
    accuracy: 97.8,
    totalTests: 456,
    streak: 11,
    country: '🇲🇽',
    joinDate: '2023-10-22',
  },
];

type TimeFilter = 'today' | 'week' | 'month' | 'allTime';
type CategoryFilter = 'global' | 'country' | 'friends';

export default function Leaderboard({ user }: Props) {
  const { t } = useI18n();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('allTime');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('global');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch leaderboard data
    const fetchLeaderboardData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from Firebase/API
      let data = [...mockLeaderboardData];
      
      // Apply filters
      if (timeFilter === 'today') {
        // Simulate today's data with some variation
        data = data.map(entry => ({
          ...entry,
          wpm: Math.floor(entry.wpm * (0.9 + Math.random() * 0.2)),
        }));
      } else if (timeFilter === 'week') {
        // Simulate weekly data
        data = data.map(entry => ({
          ...entry,
          wpm: Math.floor(entry.wpm * (0.95 + Math.random() * 0.1)),
        }));
      }
      
      // Add user if logged in
      if (user) {
        const userEntry: LeaderboardEntry = {
          id: user.uid,
          rank: 25, // Simulated rank
          name: user.displayName || 'You',
          avatar: '🎯',
          wpm: 85,
          accuracy: 94.5,
          totalTests: 156,
          streak: 7,
          country: '🇺🇸',
          joinDate: '2023-11-01', // Simplified for now
          isUser: true,
        };
        
        setUserRank(userEntry);
        
        // Insert user at appropriate position if in top 100
        if (categoryFilter === 'global' && userEntry.rank <= 100) {
          data.splice(userEntry.rank - 1, 0, userEntry);
          // Update ranks for subsequent entries
          data = data.map((entry, index) => ({
            ...entry,
            rank: index + 1,
          }));
        }
      }
      
      setLeaderboardData(data);
      setLoading(false);
    };
    
    fetchLeaderboardData();
  }, [timeFilter, categoryFilter, user]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '⭐';
    if (rank <= 50) return '💎';
    if (rank <= 100) return '🏆';
    return '';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'text-gray-600 bg-gray-50 border-gray-200';
    if (rank === 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (rank <= 10) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (rank <= 50) return 'text-purple-600 bg-purple-50 border-purple-200';
    if (rank <= 100) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('leaderboard')}</h1>
        <p className="text-gray-600">{t('leaderboardDescription')}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeFilter === 'today'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('today')}
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeFilter === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('thisWeek')}
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeFilter === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('thisMonth')}
            </button>
            <button
              onClick={() => setTimeFilter('allTime')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeFilter === 'allTime'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('allTime')}
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter('global')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoryFilter === 'global'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('global')}
            </button>
            <button
              onClick={() => setCategoryFilter('country')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoryFilter === 'country'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('country')}
            </button>
            <button
              onClick={() => setCategoryFilter('friends')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoryFilter === 'friends'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('friends')}
            </button>
          </div>
        </div>
      </div>

      {/* User Rank Card */}
      {user && userRank && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{userRank.avatar}</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">{t('yourRank')}</h3>
                <p className="text-blue-700">
                  {t('rank')}: #{userRank.rank} • {userRank.wpm} {t('wpmUnit')} • {userRank.accuracy}% {t('accuracy')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">#{userRank.rank}</div>
              <div className="text-sm text-blue-600">{t('globalRanking')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">{t('loadingLeaderboard')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('rank')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('player')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('wpmUnit')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('accuracy')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tests')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('streak')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboardData.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      entry.isUser ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getRankColor(entry.rank)}`}>
                          #{entry.rank}
                        </span>
                        <span className="text-lg">{getRankBadge(entry.rank)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{entry.avatar}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entry.name}
                            {entry.isUser && <span className="ml-2 text-xs text-blue-600">({t('you')})</span>}
                          </div>
                          <div className="text-xs text-gray-500">
                            {entry.country} • {t('joined')} {new Date(entry.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{entry.wpm}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.accuracy}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.totalTests}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-900">{entry.streak}</span>
                        <span className="text-orange-500">🔥</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && leaderboardData.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {t('showing')} 1-{Math.min(10, leaderboardData.length)} {t('of')} {leaderboardData.length} {t('players')}
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              {t('previous')}
            </button>
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t('next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { useI18n } from '../lib/i18n';

type Props = {
    user?: import('firebase/auth').User | null;
};

export default function Dashboard({ user }: Props) {
    const { userData, loading } = useUserData(user || null);
    const { t } = useI18n();

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    const { stats } = userData;
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
                <p className="text-gray-500 mt-1">{t('dashboardDescription')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {['Week', 'Month', 'Year', 'All-time'].map((period) => (
                                    <button
                                        key={period}
                                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${period === 'Month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-sm font-medium text-gray-500">Words Per Minute (WPM)</span>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-blue-500">{stats.averageWPM}</span>
                                    <span className="text-sm font-medium text-green-500">↑ +5%</span>
                                    <span className="text-sm text-gray-400">{t('last30Days')}</span>
                                </div>
                                <div className="h-32 mt-4 w-full">
                                    {/* Mock Chart - WPM */}
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,30 Q10,10 20,20 T40,20 T60,10 T80,30 T100,15" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                        <defs>
                                            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.2 }} />
                                                <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0 }} />
                                            </linearGradient>
                                        </defs>
                                        <path d="M0,30 Q10,10 20,20 T40,20 T60,10 T80,30 T100,15 V40 H0 Z" fill="url(#grad1)" stroke="none" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-sm font-medium text-gray-500">Accuracy</span>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-gray-900">{stats.averageAccuracy}%</span>
                                    <span className="text-sm font-medium text-red-500">↓ -1%</span>
                                    <span className="text-sm text-gray-400">{t('last30Days')}</span>
                                </div>
                                <div className="h-32 mt-4 w-full">
                                    {/* Mock Chart - Accuracy */}
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,35 Q15,25 30,35 T60,30 T90,35 T100,38" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column Stats */}
                <div className="space-y-6">
                    {/* Streak */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{t('practiceStreak')}</h3>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                            <FireIcon />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900">{stats.practiceStreak}</div>
                            <div className="text-xs text-gray-500">{t('consecutiveDays')}</div>
                        </div>
                    </div>

                        {/* Calendar Mock */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            <div className="text-gray-300">28</div>
                            <div className="text-gray-300">29</div>
                            <div className="text-gray-300">30</div>
                            <div className="text-gray-300">31</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">1</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">2</div>
                            <div>3</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">4</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">5</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">6</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">7</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">8</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">9</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">10</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">11</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium mx-auto">12</div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-medium mx-auto">13</div>
                            <div>14</div>
                            <div>15</div>
                        </div>
                    </div>

                    {/* At a Glance */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('atAGlance')}</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="text-blue-500"><RocketIcon /></div>
                                    <span className="text-sm font-medium text-gray-700">{t('highestWPM')}</span>
                                </div>
                                <span className="text-lg font-bold text-blue-600">{stats.bestWPM}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="text-blue-600"><CheckCircleIcon /></div>
                                    <span className="text-sm font-medium text-gray-900">{t('bestAccuracy')}</span>
                                </div>
                                <span className="text-lg font-bold text-blue-600">{stats.bestAccuracy}%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-500"><ClockIcon /></div>
                                    <span className="text-sm font-medium text-gray-700">{t('totalPracticeTime')}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-900">{Math.floor(stats.totalTime / 60)}h</div>
                                    <div className="text-xs text-gray-500">{stats.totalTime % 60}m</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-500"><HashIcon /></div>
                                    <span className="text-sm font-medium text-gray-700">{t('testsCompleted')}</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{stats.totalLessonsCompleted}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t('achievements')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <AchievementCard
                        icon={<SpeedIcon />}
                        title="100 WPM Club"
                        status="Unlocked: Oct 23"
                        active
                        color="bg-blue-100 text-blue-600"
                    />
                    <AchievementCard
                        icon={<TargetIcon />}
                        title="Perfect Accuracy"
                        status="Unlocked: Oct 21"
                        active
                        color="bg-blue-100 text-blue-600"
                    />
                    <AchievementCard
                        icon={<FireIcon />}
                        title="10-Day Streak"
                        status="Unlocked: Oct 15"
                        active
                        color="bg-blue-100 text-blue-600"
                    />
                    <AchievementCard
                        icon={<LockIcon />}
                        title="Marathon Runner"
                        status="Type for 1 hour"
                        active={false}
                        color="bg-gray-100 text-gray-400"
                    />
                    <AchievementCard
                        icon={<LockIcon />}
                        title="Consistency King"
                        status="30-Day Streak"
                        active={false}
                        color="bg-gray-100 text-gray-400"
                    />
                </div>
            </div>
        </div>
    );
}

function AchievementCard({ icon, title, status, active, color }: any) {
    return (
        <div className={`flex flex-col items-center text-center p-4 rounded-xl ${active ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${color}`}>
                {icon}
            </div>
            <div className={`text-sm font-bold mb-1 ${active ? 'text-blue-900' : 'text-gray-500'}`}>{title}</div>
            <div className={`text-xs ${active ? 'text-blue-500' : 'text-gray-400'}`}>{status}</div>
        </div>
    );
}

// Icons
function FireIcon() {
    return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c4.97 0 9-4.03 9-9-1.68 0-3.22.5-4.5 1.38C15.87 12.2 14.88 10.75 13.5 10c-.35-.2-.7-.37-1.06-.53C13.7 7.53 15.2 5.96 16 4c-5 1-8 5-8 9 0 1.33.36 2.57 1 3.65C8.44 16.22 8 15.66 8 15c0-2.3 1.12-4.36 2.87-5.67C10.28 8.88 10 8.46 10 8c0-2.76 2.24-5 5-5 .26 0 .5.03.75.08C14.6 1.1 12.96 0 11 0 5.48 0 1 4.48 1 10c0 6.63 4.92 12 11 12z" /></svg>;
}
function RocketIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>; }
function CheckCircleIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function ClockIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function HashIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>; }
function SpeedIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>; } // Reusing rocket for speed
function TargetIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; } // Reusing check
function LockIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>; }

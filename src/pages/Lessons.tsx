import React from 'react';
import { LESSONS } from '../utils/lessons';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import { useI18n } from '../lib/i18n';

export default function Lessons() {
    const navigate = useNavigate();
    const { userData } = useUserData(null);
    const { t } = useI18n();

    // Mock data to match the image visuals
    const lessonDetails = [
        { title: "The Home Row", desc: "Focus on asdf jkl; keys", status: "Completed", difficulty: "Easy", color: "from-yellow-200 to-yellow-100" },
        { title: "Top Row Practice", desc: "Mastering qwert yuiop", status: "In Progress", difficulty: "Easy", color: "from-yellow-300 to-green-700" },
        { title: "Bottom Row Fun", desc: "Tackling zxcvb nm,.", status: "Available", difficulty: "Medium", color: "from-green-200 to-green-100" },
        { title: "Common English Words", desc: "Learn commas, periods, and more", status: "Locked", difficulty: "Medium", color: "from-green-200 to-green-100" },
        { title: "Punctuation Basics", desc: "Learn commas, periods, and more", status: "Locked", difficulty: "Hard", color: "from-teal-200 to-teal-700" },
        { title: "Capital Letters", desc: "Using the Shift key effectively", status: "Locked", difficulty: "Hard", color: "from-orange-200 to-orange-100" },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Beginner Lessons</h1>
                <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">Category Progress</span>
                            <span className="font-medium text-gray-700">45%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {LESSONS.slice(0, 6).map((lesson, index) => {
                    const lessonProgress = userData.lessons[lesson.id] || null;
                    const details = lessonDetails[index] || { title: lesson.label, desc: `Practice keys: ${lesson.chars}`, status: "Locked", difficulty: "Medium", color: "bg-gray-200" };
                    const isLocked = !lessonProgress || !lessonProgress.completed;

                    return (
                        <div key={lesson.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => !isLocked && navigate(`/practice?lesson=${lesson.id}`)}>
                            <div className={`h-32 rounded-xl mb-4 bg-gradient-to-br ${details.color} flex items-center justify-center`}>
                                {/* Placeholder for lesson image/gradient */}
                            </div>

                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900">{`Lesson ${index + 1}: ${details.title}`}</h3>
                                    <p className="text-sm text-gray-500">{details.desc}</p>
                                    {lessonProgress && (
                                        <div className="text-xs text-gray-600 mt-2">
                                            {t('wpm')}: {lessonProgress.wpm || 0} | {t('accuracy')}: {lessonProgress.accuracy || 0}%
                                        </div>
                                    )}
                                </div>
                                {details.status === 'Completed' && <div className="text-green-500"><CheckCircleIcon /></div>}
                                {details.status === 'In Progress' && <div className="text-yellow-500"><PlayCircleIcon /></div>}
                                {isLocked && <div className="text-gray-400"><LockIcon /></div>}
                            </div>

                            <div className="flex gap-2 mt-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${details.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        details.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                            details.status === 'Available' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-500'
                                    }`}>
                                    {details.status}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                                    {details.difficulty}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CheckCircleIcon() { return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>; }
function PlayCircleIcon() { return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>; }
function LockIcon() { return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>; }

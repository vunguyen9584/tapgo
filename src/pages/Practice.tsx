import React, { useEffect, useRef, useState } from 'react';
import TypingArea from '../components/TypingArea';
import EnhancedKeyboardGuide from '../components/EnhancedKeyboardGuide';
import Results from '../components/Results';
import { computeCorrectIncorrect, generateCharPracticeText, generateWordPracticeText, generateTypingTestText } from '../utils/text';
import { LESSONS } from '../utils/lessons';
import type { AppStatus, Mode, Lesson, LessonsProgressMap } from '../types';
import { useI18n } from '../lib/i18n';
import { useSearchParams } from 'react-router-dom';

export default function Practice() {
    const { t, locale } = useI18n();
    const [searchParams] = useSearchParams();
    const lessonId = searchParams.get('lesson');

    const [text, setText] = useState<string>('');
    const [typed, setTyped] = useState<string>('');
    const [status, setStatus] = useState<AppStatus>('pending');
    const [duration, setDuration] = useState<number>(60);
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [wpm, setWpm] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(100);
    const [wpmHistory, setWpmHistory] = useState<number[]>([]);
    const [correctChars, setCorrectChars] = useState<number>(0);
    const [incorrectChars, setIncorrectChars] = useState<number>(0);
    const [mode, setMode] = useState<Mode>('quote');

    // Keyboard options
    const [keyboardOptions, setKeyboardOptions] = useState({
        transparency: 1,
        size: 'medium' as 'small' | 'medium' | 'large',
        showFingerGuides: true
    });

    const startTimeRef = useRef<number | null>(null);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const typedRef = useRef<string>('');
    typedRef.current = typed;

    // Initialize text
    useEffect(() => {
        if (lessonId) {
            const lesson = LESSONS.find(l => l.id === lessonId);
            if (lesson) {
                setMode('lesson');
                setText(generateCharPracticeText(lesson.chars));
            }
        } else {
            setMode('quote');
            setText(generateTypingTestText({ lang: locale }));
        }
    }, [lessonId, locale]);

    // Timer logic (simplified from App.tsx)
    useEffect(() => {
        if (status !== 'running') return;
        const start = startTimeRef.current ?? Date.now();
        startTimeRef.current = start;

        tickRef.current = setInterval(() => {
            const now = Date.now();
            const elapsedSec = Math.floor((now - start) / 1000);
            const remaining = Math.max(0, duration - elapsedSec);
            setTimeLeft(remaining);

            const minutes = (now - start) / 60000;
            const { correct } = computeCorrectIncorrect(typedRef.current, text);
            const currentWpm = minutes > 0 ? (correct / 5) / minutes : 0;
            setWpm(currentWpm);
            setWpmHistory(prev => [...prev, currentWpm]);

            if (remaining <= 0) finish();
        }, 1000);

        return () => { if (tickRef.current) clearInterval(tickRef.current); };
    }, [status, duration, text]);

    function start() {
        if (status !== 'pending') return;
        setStatus('running');
        startTimeRef.current = Date.now();
    }

    function finish() {
        if (tickRef.current) clearInterval(tickRef.current);
        setStatus('finished');
    }

    function handleType(nextTyped: string) {
        if (status === 'pending' && nextTyped.length > 0) start();
        if (nextTyped.length >= text.length) {
            setTyped(nextTyped.slice(0, text.length));
            setTimeout(() => finish(), 0);
            return;
        }
        setTyped(nextTyped);

        // Update stats immediately
        const { correct, incorrect } = computeCorrectIncorrect(nextTyped, text);
        setCorrectChars(correct);
        setIncorrectChars(incorrect);
        setAccuracy(nextTyped.length > 0 ? (correct / nextTyped.length) * 100 : 100);
    }

    const activeChar = status === 'finished' ? undefined : text[typed.length];

    return (
        <div className="min-h-screen bg-[#1A1C29] text-white p-8 flex flex-col items-center justify-center">
            {/* Header Area */}
            <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                    </div>
                    <span className="font-bold text-xl">Keyboard Master</span>
                </div>
                <div className="flex gap-6 text-gray-400 text-sm font-medium">
                    <button className="hover:text-white transition-colors">Test</button>
                    <button className="text-white">Practice</button>
                    <button className="hover:text-white transition-colors">Profile</button>
                </div>
                <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
            </div>

            {/* Typing Area */}
            <div className="w-full max-w-4xl bg-[#23263A] rounded-2xl p-8 mb-8 shadow-xl border border-gray-800">
                <TypingArea
                    text={text}
                    typed={typed}
                    status={status}
                    onType={handleType}
                    className="font-mono text-2xl leading-relaxed text-gray-400"
                />
            </div>

            {/* Stats Row */}
            <div className="w-full max-w-4xl grid grid-cols-3 gap-6 mb-8">
                <div className="bg-[#23263A] rounded-xl p-4 border border-gray-800">
                    <div className="text-gray-400 text-sm mb-1">WPM</div>
                    <div className="text-4xl font-bold text-blue-400">{Math.round(wpm)}</div>
                </div>
                <div className="bg-[#23263A] rounded-xl p-4 border border-gray-800">
                    <div className="text-gray-400 text-sm mb-1">Accuracy</div>
                    <div className="text-4xl font-bold text-white">{Math.round(accuracy)}%</div>
                </div>
                <div className="bg-[#23263A] rounded-xl p-4 border border-gray-800">
                    <div className="text-gray-400 text-sm mb-1">Time</div>
                    <div className="text-4xl font-bold text-white">00:{timeLeft.toString().padStart(2, '0')}</div>
                </div>
            </div>

            {/* Keyboard */}
            <div className="w-full max-w-4xl">
                <EnhancedKeyboardGuide
                    activeChar={activeChar}
                    show={true}
                    onToggle={() => { }}
                    displayOptions={keyboardOptions}
                    onDisplayOptionsChange={() => { }}
                    theme="dark" // Pass a theme prop if supported, or we'll style it via CSS
                />
            </div>

            {/* Footer Controls */}
            <div className="mt-8 flex gap-4">
                <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl bg-[#23263A] text-white hover:bg-gray-700 font-medium flex items-center gap-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Restart Test
                </button>
                <button className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 font-medium flex items-center gap-2 transition-colors">
                    Next Test
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
            </div>

            <Results
                open={status === 'finished'}
                onRetry={() => window.location.reload()}
                wpm={Math.round(wpm)}
                accuracy={Math.round(accuracy)}
                correct={correctChars}
                incorrect={incorrectChars}
                wpmHistory={wpmHistory}
                duration={duration}
            />
        </div>
    );
}

import React, { useEffect, useRef, useState } from 'react';
import TypingArea from './components/TypingArea';
import StatsBar from './components/StatsBar';
import Results from './components/Results';
import KeyboardGuide from './components/KeyboardGuide';
import TitleBar from './components/TitleBar';
import { computeCorrectIncorrect, generateCharPracticeText, generateWordPracticeText, generateTypingTestText } from './utils/text';
import { LESSONS } from './utils/lessons';
import type { AppStatus, Mode, Lesson, LessonsProgressMap } from './types';
import { firebaseEnabled, onUserChange, loginWithGoogle, logout, loadProgress, saveProgress } from './lib/firebase';
import { useI18n } from './lib/i18n';
import './styles/styles.css';

export default function App() {
  const { t, locale, setLocale } = useI18n();
  const [text, setText] = useState<string>(() => generateTypingTestText({ lang: locale }));
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
  const [charSet, setCharSet] = useState<string>('asdfg');
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(undefined);
  type LessonVariant = 'new' | 'review' | 'exam';
  const [lessonVariant, setLessonVariant] = useState<LessonVariant>('new');
  const [lessonsProgress, setLessonsProgress] = useState<LessonsProgressMap>({});
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [lessonResult, setLessonResult] = useState<{ label?: string; passed?: boolean }>({});
  const [finishReason, setFinishReason] = useState<'none' | 'completed' | 'timeout'>('none');
  const [showGuide, setShowGuide] = useState<boolean>(() => {
    try { const v = localStorage.getItem('km_showGuide'); return v ? JSON.parse(v) : true; } catch { return true; }
  });

  const startTimeRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typedRef = useRef<string>('');
  typedRef.current = typed;

  useEffect(() => {
    const { correct, incorrect } = computeCorrectIncorrect(typed, text);
    setCorrectChars(correct);
    setIncorrectChars(incorrect);
    if (status === 'running') {
      const totalTyped = typed.length;
      setAccuracy(totalTyped > 0 ? (correct / totalTyped) * 100 : 100);
    }
  }, [typed, text, status]);

  // Recompute duration based on text length at 10 WPM whenever text changes (when not running)
  useEffect(() => {
    if (status === 'running') return;
    const seconds = Math.max(1, Math.ceil((text.length / 50) * 60)); // 10 wpm = 50 chars/min
    setDuration(seconds);
    setTimeLeft(seconds);
  }, [text, status]);

  useEffect(() => {
    const unsub = onUserChange(async (u) => {
      setUser(u);
      if (u && firebaseEnabled) {
        const data = await loadProgress(u.uid);
        const map = (data?.lessons as LessonsProgressMap) || {};
        setLessonsProgress(map);
      } else {
        try {
          const local = localStorage.getItem('km_lessons');
          setLessonsProgress(local ? JSON.parse(local) : {});
        } catch { setLessonsProgress({}); }
      }
    });
    return () => { unsub && unsub(); };
  }, []);

  useEffect(() => {
    if (status !== 'running') return;
    const start = startTimeRef.current ?? Date.now();
    startTimeRef.current = start;
    setTimeLeft(duration);

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
      const totalTyped = typedRef.current.length;
      setAccuracy(totalTyped > 0 ? (correct / totalTyped) * 100 : 100);

      if (remaining <= 0) finish('timeout');
    }, 1000);

    return () => { if (tickRef.current) clearInterval(tickRef.current); tickRef.current = null; };
  }, [status, duration, text]);

  function cumulativeChars(uptoId: string): string {
    const idx = LESSONS.findIndex(l => l.id === uptoId);
    const slice = idx >= 0 ? LESSONS.slice(0, idx + 1) : [];
    return slice.map(l => l.chars).join('');
  }

  function start() {
    if (status !== 'pending') return;
    setStatus('running');
    startTimeRef.current = Date.now();
    setWpmHistory([]);
    setFinishReason('none');
  }

  function finish(reason: 'completed' | 'timeout' = 'completed') {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    setStatus('finished');
    setTimeLeft(0);
    const now = Date.now();
    const minutes = startTimeRef.current ? (now - startTimeRef.current) / 60000 : duration / 60;
    const { correct } = computeCorrectIncorrect(typedRef.current, text);
    const finalWpm = minutes > 0 ? (correct / 5) / minutes : 0;
    setWpm(finalWpm);
    const totalTyped = typedRef.current.length;
    const finalAcc = totalTyped > 0 ? (correct / totalTyped) * 100 : 100;
    setAccuracy(finalAcc);
    setFinishReason(reason);

    if (reason === 'completed' && mode === 'lesson' && selectedLessonId) {
      const lesson: Lesson | undefined = LESSONS.find(l => l.id === selectedLessonId);
      if (lesson) {
        const isExam = lessonVariant === 'exam';
        const passed = isExam ? (Math.round(finalWpm) >= 30) : false;
        setLessonResult(isExam ? { label: lesson.label, passed } : {});
        if (isExam) {
          setLessonsProgress(prev => {
            const next = {
              ...prev, [lesson.id]: {
                completed: prev[lesson.id]?.completed || passed,
                bestWpm: Math.max(prev[lesson.id]?.bestWpm || 0, Math.round(finalWpm)),
                bestAccuracy: Math.max(prev[lesson.id]?.bestAccuracy || 0, Math.round(finalAcc)),
                lastAt: Date.now(),
              }
            };
            try {
              if (user && firebaseEnabled) {
                saveProgress(user.uid, next);
              } else {
                localStorage.setItem('km_lessons', JSON.stringify(next));
              }
            } catch { }
            return next;
          });
        }
      }
    } else if (reason === 'completed') {
      setLessonResult({});
    }
  }

  function handleType(nextTyped: string) {
    if (status === 'pending' && nextTyped.length > 0) start();
    if (nextTyped.length >= text.length) {
      setTyped(nextTyped.slice(0, text.length));
      setTimeout(() => finish('completed'), 0);
      return;
    }
    setTyped(nextTyped);
  }

  function restartSame() {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    // keep the same text
    setTyped('');
    startTimeRef.current = null;
    setStatus('pending');
    setFinishReason('none');
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);
    setWpmHistory([]);
    setCorrectChars(0);
    setIncorrectChars(0);
    setLessonResult({});
  }

  function restartNewText() {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    const lesson = LESSONS.find(l => l.id === selectedLessonId);
    const nextText = mode === 'quote'
      ? generateTypingTestText({ lang: locale })
      : mode === 'words'
        ? generateWordPracticeText()
        : mode === 'chars'
          ? generateCharPracticeText(charSet)
          : generateCharPracticeText(lesson?.chars || 'asdf');
    setText(nextText);
    setTyped('');
    startTimeRef.current = null;
    setStatus('pending');
    setFinishReason('none');
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);
    setWpmHistory([]);
    setCorrectChars(0);
    setIncorrectChars(0);
    setLessonResult({});
  }

  function goHome() {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    setMode('quote');
    setText(generateTypingTestText({ lang: locale }));
    setTyped('');
    startTimeRef.current = null;
    setStatus('pending');
    setFinishReason('none');
    setWpm(0);
    setAccuracy(100);
    setWpmHistory([]);
    setCorrectChars(0);
    setIncorrectChars(0);
    setLessonResult({});
  }

  // Duration is auto-computed from text; no manual changeDuration UI

  const netWpm = Math.round(wpm);
  const accPct = Math.round(accuracy);
  const selectedLesson = LESSONS.find(l => l.id === selectedLessonId);
  const activeChar = status === 'finished' ? undefined : text[typed.length];

  const title = mode === 'lesson'
    ? `${selectedLesson?.label ?? 'Lesson'}`
    : mode === 'chars'
      ? t('customCharacters')
      : t('typingTestTitle');

  const rightLogin = (
    <div className="flex items-center gap-2">
      <select value={locale} onChange={(e) => setLocale(e.target.value as any)} className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white">
        <option value="vi">VI</option>
        <option value="en">EN</option>
      </select>
      {firebaseEnabled ? (
        user ? (
          <div className="flex items-center gap-2">
            <span className="text-[#666666] text-sm hidden sm:inline">{user.displayName || user.email}</span>
            <button onClick={() => logout()} className="px-3 py-1.5 rounded-md text-sm border border-gray-300 hover:bg-gray-100">Logout</button>
          </div>
        ) : (
          <button onClick={() => loginWithGoogle()} className="px-3 py-1.5 rounded-md text-sm border border-gray-300 hover:bg-gray-100">Login</button>
        )
      ) : (
        <button disabled className="px-3 py-1.5 rounded-md text-sm border border-gray-200 text-[#666666]">Login (cfg required)</button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#222222] flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-4xl space-y-4">
        <TitleBar title={title} right={rightLogin} />
        <StatsBar
          signs={typed.length}
          progress={(typed.length / Math.max(1, text.length)) * 100}
          wpm={wpm}
          errors={incorrectChars}
          accuracy={accuracy}
          timeLeft={timeLeft}
        />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Side menu */}
          <aside className="space-y-4 lg:col-span-1">
            <div className="classic-panel p-3 sm:p-4">
              <div className="text-xs uppercase tracking-wide text-[#666666] mb-2">{t('lessonsHeading')}</div>
              <div className="flex flex-col gap-2">
                {LESSONS.map((l) => {
                  const examPassed = !!lessonsProgress[l.id]?.completed;
                  const isSelected = mode === 'lesson' && selectedLessonId === l.id;
                  return (
                    <div key={l.id} className={`rounded-md border ${isSelected ? 'border-[#007BFF]' : 'border-gray-300'}`}>
                      <button
                        className="w-full px-3 py-2 flex items-center justify-between"
                        onClick={() => {
                          if (status === 'running') return;
                          setMode('lesson');
                          setSelectedLessonId(l.id);
                        }}
                        disabled={status === 'running'}
                      >
                        <div className="text-left">
                          <div className="text-sm font-medium text-[#222222]">{l.label}</div>
                          <div className="text-xs text-[#666666]">{t('newKeys')}: {l.chars}</div>
                        </div>
                        {examPassed && <span className="text-[#28A745] text-xs">✓ {t('passed')}</span>}
                      </button>
                      {isSelected && (
                        <div className="px-2 pb-2 grid grid-cols-1 gap-1">
                          <button
                            disabled={status === 'running'}
                            onClick={() => {
                              if (status === 'running') return;
                              setMode('lesson');
                              setSelectedLessonId(l.id);
                              setLessonVariant('new');
                              setText(generateCharPracticeText(l.chars));
                              setTyped('');
                              setLessonResult({});
                            }}
                            className={`text-left px-2 py-1 rounded-md border text-xs ${isSelected && lessonVariant === 'new' ? 'bg-[#007BFF] text-white border-[#007BFF]' : 'bg-white border-gray-300 hover:bg-gray-100'
                              } ${status === 'running' ? 'opacity-60 pointer-events-none' : ''}`}
                          >{t('newKeysPractice')}</button>
                          <button
                            disabled={status === 'running'}
                            onClick={() => {
                              if (status === 'running') return;
                              setMode('lesson');
                              setSelectedLessonId(l.id);
                              setLessonVariant('review');
                              setText(generateCharPracticeText(cumulativeChars(l.id)));
                              setTyped('');
                              setLessonResult({});
                            }}
                            className={`text-left px-2 py-1 rounded-md border text-xs ${isSelected && lessonVariant === 'review' ? 'bg-[#007BFF] text-white border-[#007BFF]' : 'bg-white border-gray-300 hover:bg-gray-100'
                              } ${status === 'running' ? 'opacity-60 pointer-events-none' : ''}`}
                          >{t('reviewUpToNow')}</button>
                          <button
                            disabled={status === 'running'}
                            onClick={() => {
                              if (status === 'running') return;
                              setMode('lesson');
                              setSelectedLessonId(l.id);
                              setLessonVariant('exam');
                              setText(generateCharPracticeText(cumulativeChars(l.id)));
                              setTyped('');
                              setLessonResult({});
                            }}
                            className={`text-left px-2 py-1 rounded-md border text-xs ${isSelected && lessonVariant === 'exam' ? 'bg-[#007BFF] text-white border-[#007BFF]' : 'bg-white border-gray-300 hover:bg-gray-100'
                              } ${status === 'running' ? 'opacity-60 pointer-events-none' : ''}`}
                          >{t('finalExam')}</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="classic-panel p-3 sm:p-4">
              <div className="flex flex-col gap-2">
                <button
                  disabled={status === 'running'}
                  onClick={() => { if (status !== 'running') { setMode('chars'); setText(generateCharPracticeText(charSet)); setTyped(''); setLessonResult({}); } }}
                  className={`text-left px-3 py-1.5 rounded-md border text-sm ${mode === 'chars' ? 'bg-[#007BFF] text-white border-[#007BFF]' : 'bg-white border-gray-300 hover:bg-gray-100'
                    } ${status === 'running' ? 'opacity-60 pointer-events-none' : ''}`}
                >{t('customCharacters')}</button>
                <button
                  disabled={status === 'running'}
                  onClick={() => { if (status !== 'running') { setMode('quote'); setText(generateTypingTestText({ lang: locale })); setTyped(''); setLessonResult({}); } }}
                  className={`text-left px-3 py-1.5 rounded-md border text-sm ${mode === 'quote' ? 'bg-[#007BFF] text-white border-[#007BFF]' : 'bg-white border-gray-300 hover:bg-gray-100'
                    } ${status === 'running' ? 'opacity-60 pointer-events-none' : ''}`}
                >{t('typingTestTitle')}</button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Typing area is now the main focus; stats are unified above */}
            <section className="space-y-4">
              <TypingArea
                text={text}
                typed={typed}
                status={status}
                onType={handleType}
                actions={
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      title="Restart"
                      onClick={restartSame}
                      className="px-3 py-1.5 rounded-md text-sm border border-gray-300 hover:bg-gray-100"
                    >{t('restart')}</button>
                    <button
                      title="New text"
                      onClick={restartNewText}
                      className="px-3 py-1.5 rounded-md text-sm border border-gray-300 hover:bg-gray-100"
                    >{t('newText')}</button>
                  </div>
                }
              />
              {status === 'pending' && (
                <p className="text-[#666666] text-sm">{t('startTyping')}</p>
              )}
              {/* Removed time selection; duration auto-computed at 10 WPM */}

              {mode === 'chars' && (
                <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 w-full">
                  <label className="block text-xs uppercase tracking-wide text-[#666666] mb-1">Character group</label>
                  <div className="flex items-center gap-2">
                    <input
                      value={charSet}
                      disabled={status === 'running'}
                      onChange={(e) => setCharSet(e.target.value)}
                      placeholder="e.g. asdfg"
                      className="flex-1 bg-white border border-gray-300 rounded-md px-2 py-1 text-sm outline-none focus:border-[#007BFF]"
                    />
                    <button
                      disabled={status === 'running'}
                      onClick={() => { if (status !== 'running') { setText(generateCharPracticeText(charSet)); setTyped(''); } }}
                      className="px-3 py-1.5 rounded-md text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-60"
                    >Apply</button>
                  </div>
                </div>
              )}
              <KeyboardGuide activeChar={activeChar} show={showGuide} onToggle={() => { const next = !showGuide; setShowGuide(next); try { localStorage.setItem('km_showGuide', JSON.stringify(next)); } catch { } }} />
            </section>
          </div>

        </div>

      </div>

      <Results
        open={status === 'finished' && finishReason === 'completed'}
        onClose={restartNewText}
        wpm={Math.max(0, Math.round(wpm))}
        accuracy={accPct}
        correct={correctChars}
        incorrect={incorrectChars}
        wpmHistory={wpmHistory}
        duration={duration}
        lessonLabel={mode === 'lesson' && lessonVariant === 'exam' ? selectedLesson?.label : undefined}
        lessonPassed={mode === 'lesson' && lessonVariant === 'exam' ? lessonResult.passed : undefined}
      />

      {/* Timeout popup */}
      {status === 'finished' && finishReason === 'timeout' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 text-[#222222]">
            <h2 className="text-xl font-semibold mb-2">{t('timeIsUp')}</h2>
            <p className="text-[#666666] mb-6">{t('timeUpMsg')}</p>
            <div className="flex justify-end gap-2">
              <button onClick={goHome} className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100">{t('home')}</button>
              <button onClick={restartSame} className="px-4 py-2 rounded-md bg-[#007BFF] text-white hover:opacity-90">{t('restart')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

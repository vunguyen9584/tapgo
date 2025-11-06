 import React, { useEffect, useRef, useState } from 'react';
import TypingArea from './components/TypingArea';
import Metrics from './components/Metrics';
import Results from './components/Results';
import LessonPicker from './components/LessonPicker';
import KeyboardGuide from './components/KeyboardGuide';
import { computeCorrectIncorrect, pickQuote, DURATION_OPTIONS, generateCharPracticeText } from './utils/text';
import { LESSONS } from './utils/lessons';
import type { AppStatus, Mode, Lesson, LessonsProgressMap } from './types';
import { firebaseEnabled, onUserChange, loginWithGoogle, logout, loadProgress, saveProgress } from './lib/firebase';
 import './styles/styles.css';

 export default function App() {
   const [text, setText] = useState<string>(pickQuote());
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
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(LESSONS[0]?.id);
  const [lessonsProgress, setLessonsProgress] = useState<LessonsProgressMap>({});
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [lessonResult, setLessonResult] = useState<{ label?: string; passed?: boolean }>({});
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

       if (remaining <= 0) finish();
     }, 1000);

     return () => { if (tickRef.current) clearInterval(tickRef.current); tickRef.current = null; };
   }, [status, duration, text]);

   function start() {
     if (status !== 'pending') return;
     setStatus('running');
     startTimeRef.current = Date.now();
     setWpmHistory([]);
   }

   function finish() {
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

    if (mode === 'lesson' && selectedLessonId) {
      const lesson: Lesson | undefined = LESSONS.find(l => l.id === selectedLessonId);
      if (lesson) {
        const passed = finalWpm >= lesson.wpmThreshold && finalAcc >= lesson.accuracyThreshold;
        setLessonResult({ label: lesson.label, passed });
        setLessonsProgress(prev => {
          const next = { ...prev, [lesson.id]: {
            completed: prev[lesson.id]?.completed || passed,
            bestWpm: Math.max(prev[lesson.id]?.bestWpm || 0, Math.round(finalWpm)),
            bestAccuracy: Math.max(prev[lesson.id]?.bestAccuracy || 0, Math.round(finalAcc)),
            lastAt: Date.now(),
          }};
          try {
            if (user && firebaseEnabled) {
              saveProgress(user.uid, next);
            } else {
              localStorage.setItem('km_lessons', JSON.stringify(next));
            }
          } catch {}
          return next;
        });
      }
    } else {
      setLessonResult({});
    }
   }

   function handleType(nextTyped: string) {
     if (status === 'pending' && nextTyped.length > 0) start();
     if (nextTyped.length >= text.length) {
       setTyped(nextTyped.slice(0, text.length));
       setTimeout(finish, 0);
       return;
     }
     setTyped(nextTyped);
   }

   function restart() {
     if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    const lesson = LESSONS.find(l => l.id === selectedLessonId);
    const nextText = mode === 'quote' ? pickQuote() : mode === 'chars' ? generateCharPracticeText(charSet) : generateCharPracticeText(lesson?.chars || 'asdf');
    setText(nextText);
     setTyped('');
     startTimeRef.current = null;
     setStatus('pending');
     setTimeLeft(duration);
     setWpm(0);
     setAccuracy(100);
     setWpmHistory([]);
     setCorrectChars(0);
     setIncorrectChars(0);
    setLessonResult({});
   }

   function changeDuration(d: number) {
     if (status === 'running') return;
     setDuration(d);
     setTimeLeft(d);
   }

   const netWpm = Math.round(wpm);
   const accPct = Math.round(accuracy);
  const selectedLesson = LESSONS.find(l => l.id === selectedLessonId);
  const activeChar = status === 'finished' ? undefined : text[typed.length];

   return (
     <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-8">
       <div className="w-full max-w-4xl">
         <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
           <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Keyboard Master</h1>
           <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-md overflow-hidden border border-slate-700">
              <button
                onClick={() => { if (status !== 'running') { setMode('quote'); setText(pickQuote()); setTyped(''); setLessonResult({}); } }}
                className={`px-3 py-1.5 text-sm ${mode === 'quote' ? 'bg-sky-500 text-white' : 'bg-slate-900 hover:bg-slate-800'}`}
              >Quotes</button>
              <button
                onClick={() => { if (status !== 'running') { setMode('chars'); setText(generateCharPracticeText(charSet)); setTyped(''); setLessonResult({}); } }}
                className={`px-3 py-1.5 text-sm border-l border-slate-700 ${mode === 'chars' ? 'bg-sky-500 text-white' : 'bg-slate-900 hover:bg-slate-800'}`}
              >Char Practice</button>
              <button
                onClick={() => { if (status !== 'running') { setMode('lesson'); const l = LESSONS.find(ll => ll.id === selectedLessonId) || LESSONS[0]; setSelectedLessonId(l?.id); setText(generateCharPracticeText(l?.chars || 'asdf')); setTyped(''); setLessonResult({}); } }}
                className={`px-3 py-1.5 text-sm border-l border-slate-700 ${mode === 'lesson' ? 'bg-sky-500 text-white' : 'bg-slate-900 hover:bg-slate-800'}`}
              >Lessons</button>
            </div>
             {DURATION_OPTIONS.map(d => (
               <button
                 key={d}
                 onClick={() => changeDuration(d)}
                 className={`px-3 py-1.5 rounded-md text-sm transition-colors border ${
                   duration === d ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'
                 } ${status === 'running' ? 'opacity-60 pointer-events-none' : ''}`}
               >
                 {d}s
               </button>
             ))}
             <button
              onClick={restart}
               className="ml-2 px-3 py-1.5 rounded-md text-sm border border-slate-700 hover:bg-slate-800 transition-colors"
             >
               New text
             </button>
            <button
              onClick={() => { const next = !showGuide; setShowGuide(next); try { localStorage.setItem('km_showGuide', JSON.stringify(next)); } catch {} }}
              className="px-3 py-1.5 rounded-md text-sm border border-slate-700 hover:bg-slate-800"
            >{showGuide ? 'Hide guide' : 'Show guide'}</button>
            <div className="ml-2">
              {firebaseEnabled ? (
                user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm hidden sm:inline">{user.displayName || user.email}</span>
                    <button onClick={() => logout()} className="px-3 py-1.5 rounded-md text-sm border border-slate-700 hover:bg-slate-800">Logout</button>
                  </div>
                ) : (
                  <button onClick={() => loginWithGoogle()} className="px-3 py-1.5 rounded-md text-sm border border-slate-700 hover:bg-slate-800">Login</button>
                )
              ) : (
                <button disabled className="px-3 py-1.5 rounded-md text-sm border border-slate-800 text-slate-500">Login (cfg required)</button>
              )}
            </div>
           </div>
         </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Metrics wpm={netWpm} accuracy={accPct} timeLeft={timeLeft} />
            <section>
              <TypingArea
                text={text}
                typed={typed}
                status={status}
                onType={handleType}
              />
              {status === 'pending' && (
                <p className="mt-3 text-slate-400 text-sm">Start typing to begin the test.</p>
              )}
            </section>
          </div>
          <div className="space-y-4">
            <KeyboardGuide activeChar={activeChar} show={showGuide} onToggle={() => { const next = !showGuide; setShowGuide(next); try { localStorage.setItem('km_showGuide', JSON.stringify(next)); } catch {} }} />
            {mode === 'chars' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 sm:p-4 w-full">
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Character group</label>
                <div className="flex items-center gap-2">
                  <input
                    value={charSet}
                    disabled={status === 'running'}
                    onChange={(e) => setCharSet(e.target.value)}
                    placeholder="e.g. asdfg"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-sm outline-none focus:border-sky-600"
                  />
                  <button
                    disabled={status === 'running'}
                    onClick={() => { if (status !== 'running') { setText(generateCharPracticeText(charSet)); setTyped(''); } }}
                    className="px-3 py-1.5 rounded-md text-sm border border-slate-700 hover:bg-slate-800 disabled:opacity-60"
                  >Apply</button>
                </div>
              </div>
            )}
            {mode === 'lesson' && (
              <LessonPicker
                lessons={LESSONS}
                selectedId={selectedLessonId}
                disabled={status === 'running'}
                progress={lessonsProgress}
                onSelect={(id) => {
                  if (status === 'running') return;
                  setSelectedLessonId(id);
                  const l = LESSONS.find(x => x.id === id);
                  setText(generateCharPracticeText(l?.chars || 'asdf'));
                  setTyped('');
                }}
              />
            )}
          </div>
        </div>

       </div>

       <Results
         open={status === 'finished'}
         onClose={restart}
         wpm={Math.max(0, Math.round(wpm))}
         accuracy={accPct}
         correct={correctChars}
         incorrect={incorrectChars}
         wpmHistory={wpmHistory}
         duration={duration}
        lessonLabel={mode === 'lesson' ? selectedLesson?.label : undefined}
        lessonPassed={mode === 'lesson' ? lessonResult.passed : undefined}
       />
     </div>
   );
 }

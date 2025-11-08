import React, { createContext, useContext, useMemo, useState } from 'react';

export type Locale = 'vi' | 'en';

type Dict = Record<string, string>;

const resources: Record<Locale, Dict> = {
  vi: {
    appName: 'Keyboard Master',
    metaDescription: 'Luyện gõ phím online với bài tập đa dạng, theo dõi WPM, độ chính xác và biểu đồ theo thời gian. Miễn phí, không cần đăng ký.',
    lessonsHeading: 'Bài học',
    newKeysPractice: 'Thực hành phím mới',
    reviewUpToNow: 'Ôn tập các phím đến hiện tại',
    finalExam: 'Kiểm tra cuối bài',
    newKeys: 'Phím mới',
    passed: 'Đã đậu',
    typingTestTitle: 'Bài kiểm tra gõ',
    customCharacters: 'Tùy chỉnh ký tự',
    startTyping: 'Bắt đầu gõ để bắt đầu.',
    restart: 'Làm lại',
    newText: 'Văn bản mới',
    home: 'Trang chủ',
    timeIsUp: 'Hết thời gian',
    timeUpMsg: 'Bạn đã hết thời gian cho văn bản này.',
    keyboardHands: 'Bàn phím & bàn tay',
    show: 'Hiện',
    hide: 'Ẩn',
    yourInput: 'Nhập liệu của bạn',
    results: 'Kết quả',
    lesson: 'Bài học',
    passedShort: 'Đậu',
    notPassed: 'Chưa đạt',
    wpmOverTime: 'WPM theo thời gian',
    tryAgain: 'Thử lại',
    nextLesson: 'Chuyển sang bài kế tiếp',
    failReasonNotEnoughWpmPrefix: 'Bạn chưa đạt đủ số WPM tối thiểu (yêu cầu ≥',
    failReasonNotEnoughWpmSuffix: ' WPM). Bạn có thể thay đổi WPM này trong mục "Thiết lập".',
    statsSigns: 'Ký tự',
    statsProgress: 'Tiến độ',
    statsWpm: 'WPM',
    statsErrors: 'Lỗi',
    statsAccuracy: 'Độ chính xác',
    statsTime: 'Thời gian',
    about: 'Giới thiệu',
    settings: 'Thiết lập',
    logout: 'Đăng xuất'
  },
  en: {
    appName: 'Keyboard Master',
    metaDescription: 'Practice typing online with diverse exercises. Track WPM, accuracy, and progress over time. Free, no sign-up required.',
    lessonsHeading: 'Lessons',
    newKeysPractice: 'New keys practice',
    reviewUpToNow: 'Review keys up to now',
    finalExam: 'Final exam',
    newKeys: 'New keys',
    passed: 'Passed',
    typingTestTitle: 'Typing test',
    customCharacters: 'Custom Characters',
    startTyping: 'Start typing to begin the test.',
    restart: 'Restart',
    newText: 'New text',
    home: 'Home',
    timeIsUp: 'Time is up',
    timeUpMsg: 'You have run out of time for this text.',
    keyboardHands: 'Keyboard & Hands',
    show: 'Show',
    hide: 'Hide',
    yourInput: 'Your input',
    results: 'Results',
    lesson: 'Lesson',
    passedShort: 'Passed',
    notPassed: 'Not passed',
    wpmOverTime: 'WPM over time',
    tryAgain: 'Try Again',
    nextLesson: 'Next lesson',
    failReasonNotEnoughWpmPrefix: 'You did not reach the minimum WPM (requirement ≥',
    failReasonNotEnoughWpmSuffix: ' WPM). You can change this in "Settings".',
    statsSigns: 'Signs',
    statsProgress: 'Progress',
    statsWpm: 'WPM',
    statsErrors: 'Errors',
    statsAccuracy: 'Accuracy',
    statsTime: 'Time',
    about: 'About',
    settings: 'Settings',
    logout: 'Logout'
  }
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const initial = (() => {
    try {
      const v = localStorage.getItem('km_lang');
      return (v === 'en' || v === 'vi') ? (v as Locale) : 'vi';
    } catch {
      return 'vi';
    }
  })();
  const [locale, setLocaleState] = useState<Locale>(initial);
  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem('km_lang', l); } catch {}
  };
  const t = useMemo(() => (key: string) => resources[locale]?.[key] ?? key, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

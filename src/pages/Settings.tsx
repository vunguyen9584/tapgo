import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { saveSettings, loadSettings } from '../lib/firebase';

type SettingsData = {
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  timerDuration: number;
  showKeyboard: boolean;
  showHands: boolean;
  enableSound: boolean;
  wpmGoal: number;
  accuracyGoal: number;
  minExamWpm: number;
};

const defaultSettings: SettingsData = {
  theme: 'light',
  language: 'vi',
  timerDuration: 60,
  showKeyboard: true,
  showHands: true,
  enableSound: true,
  wpmGoal: 40,
  accuracyGoal: 95,
  minExamWpm: 30,
};

type Props = {
  user?: import('firebase/auth').User | null;
};

export default function Settings({ user }: Props) {
  const { t, locale, setLocale } = useI18n();
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadUserSettings() {
      if (user) {
        try {
          const userSettings = await loadSettings(user.uid);
          if (userSettings) {
            setSettings({ ...defaultSettings, ...userSettings });
          }
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      } else {
        // Load from localStorage for guest users
        try {
          const localSettings = localStorage.getItem('km_settings');
          if (localSettings) {
            setSettings({ ...defaultSettings, ...JSON.parse(localSettings) });
          }
        } catch (error) {
          console.error('Failed to load local settings:', error);
        }
      }
    }
    loadUserSettings();
  }, [user]);

  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLanguageChange = (newLocale: 'vi' | 'en') => {
    setLocale(newLocale);
    handleSettingChange('language', newLocale);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (user) {
        await saveSettings(user.uid, settings);
      } else {
        // Save to localStorage for guest users
        localStorage.setItem('km_settings', JSON.stringify(settings));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('settings')}</h1>

      {saved && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {t('save')} {t('settings')}!
        </div>
      )}

      <div className="space-y-8">
        {/* Appearance Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('appearance')}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('themeSelection')}
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => handleSettingChange('theme', 'light')}
                  className={`px-4 py-2 rounded-md border ${
                    settings.theme === 'light'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {t('lightTheme')}
                </button>
                <button
                  onClick={() => handleSettingChange('theme', 'dark')}
                  className={`px-4 py-2 rounded-md border ${
                    settings.theme === 'dark'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {t('darkTheme')}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('languageSelection')}
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => handleLanguageChange('vi')}
                  className={`px-4 py-2 rounded-md border ${
                    settings.language === 'vi'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Tiếng Việt
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-4 py-2 rounded-md border ${
                    settings.language === 'en'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('practice')}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('timerDuration')} (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={settings.timerDuration}
                onChange={(e) => handleSettingChange('timerDuration', parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('minWpmLabel')}
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={settings.minExamWpm}
                onChange={(e) => handleSettingChange('minExamWpm', parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Keyboard Display Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('keyboardDisplay')}</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {t('showKeyboard')}
              </label>
              <button
                onClick={() => handleSettingChange('showKeyboard', !settings.showKeyboard)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.showKeyboard ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.showKeyboard ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {t('showHands')}
              </label>
              <button
                onClick={() => handleSettingChange('showHands', !settings.showHands)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.showHands ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.showHands ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {t('enableSound')}
              </label>
              <button
                onClick={() => handleSettingChange('enableSound', !settings.enableSound)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.enableSound ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.enableSound ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('wpmAccuracyGoals')}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('wpmGoal')} ({t('wpmUnit')})
              </label>
              <input
                type="number"
                min="10"
                max="150"
                value={settings.wpmGoal}
                onChange={(e) => handleSettingChange('wpmGoal', parseInt(e.target.value) || 40)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('accuracyGoal')} (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={settings.accuracyGoal}
                onChange={(e) => handleSettingChange('accuracyGoal', parseInt(e.target.value) || 95)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Account Section */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t('accountSettings')}</h2>
            <div className="text-sm text-gray-600">
              <p>Email: {user.email}</p>
              <p>UID: {user.uid}</p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
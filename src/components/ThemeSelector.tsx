import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { 
  Theme, 
  defaultThemes, 
  fontOptions, 
  animationSpeeds, 
  applyTheme, 
  createCustomTheme, 
  exportTheme, 
  importTheme,
  getSystemTheme,
  watchSystemTheme,
} from '../lib/themes';
import { saveSettings, loadSettings } from '../lib/firebase';
import type { User } from 'firebase/auth';

interface Props {
  user?: import('firebase/auth').User | null;
  onThemeChange?: (theme: Theme) => void;
}

export default function ThemeSelector({ user, onThemeChange }: Props) {
  const { t } = useI18n();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(defaultThemes[0]!);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customThemeName, setCustomThemeName] = useState('');
  const [baseThemeId, setBaseThemeId] = useState('light');
  const [useSystemTheme, setUseSystemTheme] = useState(false);
  const [importError, setImportError] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);

  useEffect(() => {
    // Load saved theme settings
    const loadThemeSettings = async () => {
      if (!user) return;
      
      const settings = await loadSettings(user.uid);
      const themeSettings = settings?.theme;
      
      if (themeSettings) {
        if (themeSettings.useSystemTheme) {
          setUseSystemTheme(true);
          const systemTheme = getSystemTheme();
          const systemThemeObj = defaultThemes.find(t => t.id === systemTheme) || defaultThemes[0]!;
          setSelectedTheme(systemThemeObj);
          applyTheme(systemThemeObj);
        } else if (themeSettings.customTheme) {
          // Load custom theme
          const customTheme = importTheme(themeSettings.customTheme);
          if (customTheme) {
            setSelectedTheme(customTheme);
            applyTheme(customTheme);
            setCustomThemes([customTheme]);
          }
        } else if (themeSettings.themeId) {
          const theme = defaultThemes.find(t => t.id === themeSettings.themeId) || defaultThemes[0]!;
          setSelectedTheme(theme);
          applyTheme(theme);
        }
      } else {
        // Default to light theme
        setSelectedTheme(defaultThemes[0]!);
        applyTheme(defaultThemes[0]!);
      }
    };
    
    loadThemeSettings();
    
    // Watch system theme changes
    const cleanup = watchSystemTheme((systemTheme) => {
      if (useSystemTheme) {
        const systemThemeObj = defaultThemes.find(t => t.id === systemTheme) || defaultThemes[0]!;
        setSelectedTheme(systemThemeObj);
        applyTheme(systemThemeObj);
      }
    });
    
    return cleanup;
  }, [user, useSystemTheme]);

  const handleThemeSelect = async (theme: Theme) => {
    setSelectedTheme(theme);
    applyTheme(theme);
    onThemeChange?.(theme);
    
    // Save to Firebase if user is logged in
    if (user) {
      await saveSettings(user.uid, {
        theme: {
          themeId: theme.id,
          useSystemTheme: false,
        },
      });
    }
  };

  const handleSystemThemeToggle = async (enabled: boolean) => {
    setUseSystemTheme(enabled);
    
    if (enabled) {
      const systemTheme = getSystemTheme();
      const systemThemeObj = defaultThemes.find(t => t.id === systemTheme) || defaultThemes[0]!;
      setSelectedTheme(systemThemeObj);
      applyTheme(systemThemeObj);
    }
    
    // Save to Firebase if user is logged in
    if (user) {
      await saveSettings(user.uid, {
        theme: {
          useSystemTheme: enabled,
        },
      });
    }
  };

  const handleCreateCustomTheme = () => {
    setIsCreatingCustom(true);
    setCustomThemeName('');
    setBaseThemeId(selectedTheme.id);
  };

  const handleSaveCustomTheme = async () => {
    if (!customThemeName.trim()) return;
    
    const baseTheme = defaultThemes.find(t => t.id === baseThemeId) || defaultThemes[0]!;
    const customTheme = createCustomTheme(
      `custom_${Date.now()}`,
      customThemeName.trim(),
      baseTheme,
      {
        displayName: customThemeName.trim(),
      }
    );
    
    const newCustomThemes = [...customThemes, customTheme];
    setCustomThemes(newCustomThemes);
    setIsCreatingCustom(false);
    
    // Apply and save the new custom theme
    await handleThemeSelect(customTheme);
    
    // Save custom theme to settings
    if (user) {
      await saveSettings(user.uid, {
        theme: {
          customTheme: exportTheme(customTheme),
          useSystemTheme: false,
        },
      });
    }
  };

  const handleExportTheme = () => {
    const themeJson = exportTheme(selectedTheme);
    const blob = new Blob([themeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTheme.name}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const themeJson = e.target?.result as string;
        const importedTheme = importTheme(themeJson);
        
        if (importedTheme) {
          const newCustomThemes = [...customThemes, importedTheme];
          setCustomThemes(newCustomThemes);
          await handleThemeSelect(importedTheme);
          setShowImportDialog(false);
          setImportError('');
        } else {
          setImportError(t('invalidThemeFile'));
        }
      } catch (error) {
        setImportError(t('errorImportingTheme'));
      }
    };
    
    reader.readAsText(file);
  };

  const allThemes = [...defaultThemes, ...customThemes];

  return (
    <div className="space-y-6">
      {/* System Theme Toggle */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('systemTheme')}</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useSystemTheme}
            onChange={(e) => handleSystemThemeToggle(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">{t('useSystemTheme')}</span>
        </label>
      </div>

      {/* Theme Selection */}
      {!useSystemTheme && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('selectTheme')}</h3>
            <div className="flex gap-2">
              <button
                onClick={handleExportTheme}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                {t('export')}
              </button>
              <button
                onClick={() => setShowImportDialog(true)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                {t('import')}
              </button>
              <button
                onClick={handleCreateCustomTheme}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                {t('createCustom')}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allThemes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTheme.id === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{theme.displayName}</h4>
                    {theme.custom && (
                      <span className="text-xs text-gray-500">{t('custom')}</span>
                    )}
                  </div>
                </div>
                
                {/* Color Preview */}
                <div className="grid grid-cols-5 gap-1 mb-3">
                  <div
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.colors.success }}
                    title="Success"
                  />
                  <div
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.colors.error }}
                    title="Error"
                  />
                </div>
                
                {/* Font Preview */}
                <div className="text-xs text-gray-600">
                  <div style={{ fontFamily: theme.fonts.primary }}>
                    {t('sampleText')}
                  </div>
                  <div style={{ fontFamily: theme.fonts.monospace }}>
                    {t('monospaceText')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Theme Creation Dialog */}
      {isCreatingCustom && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('createCustomTheme')}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('themeName')}
              </label>
              <input
                type="text"
                value={customThemeName}
                onChange={(e) => setCustomThemeName(e.target.value)}
                placeholder={t('enterThemeName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('baseTheme')}
              </label>
              <select
                value={baseThemeId}
                onChange={(e) => setBaseThemeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {defaultThemes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveCustomTheme}
              disabled={!customThemeName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('save')}
            </button>
            <button
              onClick={() => setIsCreatingCustom(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('importTheme')}</h3>
          
          {importError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {importError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('selectThemeFile')}
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleImportTheme}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowImportDialog(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
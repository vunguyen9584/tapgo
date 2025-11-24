export interface Theme {
  id: string;
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
    primary: string;
    monospace: string;
  };
  animations: {
    enabled: boolean;
    speed: 'slow' | 'normal' | 'fast';
  };
  custom?: boolean;
}

export const defaultThemes: Theme[] = [
  {
    id: 'light',
    name: 'light',
    displayName: 'Light',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      monospace: 'JetBrains Mono, Consolas, monospace',
    },
    animations: {
      enabled: true,
      speed: 'normal',
    },
  },
  {
    id: 'dark',
    name: 'dark',
    displayName: 'Dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      accent: '#22d3ee',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      monospace: 'JetBrains Mono, Consolas, monospace',
    },
    animations: {
      enabled: true,
      speed: 'normal',
    },
  },
  {
    id: 'ocean',
    name: 'ocean',
    displayName: 'Ocean',
    colors: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#06b6d4',
      background: '#f0f9ff',
      surface: '#e0f2fe',
      text: '#0c4a6e',
      textSecondary: '#075985',
      border: '#7dd3fc',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0284c7',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      monospace: 'JetBrains Mono, Consolas, monospace',
    },
    animations: {
      enabled: true,
      speed: 'normal',
    },
  },
  {
    id: 'forest',
    name: 'forest',
    displayName: 'Forest',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      background: '#f0fdf4',
      surface: '#dcfce7',
      text: '#14532d',
      textSecondary: '#166534',
      border: '#86efac',
      success: '#16a34a',
      warning: '#ea580c',
      error: '#dc2626',
      info: '#0891b2',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      monospace: 'JetBrains Mono, Consolas, monospace',
    },
    animations: {
      enabled: true,
      speed: 'normal',
    },
  },
  {
    id: 'sunset',
    name: 'sunset',
    displayName: 'Sunset',
    colors: {
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#f97316',
      background: '#fff7ed',
      surface: '#fed7aa',
      text: '#7c2d12',
      textSecondary: '#9a3412',
      border: '#fdba74',
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
      info: '#2563eb',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      monospace: 'JetBrains Mono, Consolas, monospace',
    },
    animations: {
      enabled: true,
      speed: 'normal',
    },
  },
  {
    id: 'purple',
    name: 'purple',
    displayName: 'Purple',
    colors: {
      primary: '#9333ea',
      secondary: '#7c3aed',
      accent: '#a855f7',
      background: '#faf5ff',
      surface: '#f3e8ff',
      text: '#581c87',
      textSecondary: '#6b21a8',
      border: '#d8b4fe',
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
      info: '#2563eb',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      monospace: 'JetBrains Mono, Consolas, monospace',
    },
    animations: {
      enabled: true,
      speed: 'normal',
    },
  },
  {
    id: 'minimal',
    name: 'minimal',
    displayName: 'Minimal',
    colors: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#666666',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0',
      success: '#008000',
      warning: '#ff8c00',
      error: '#ff0000',
      info: '#0000ff',
    },
    fonts: {
      primary: 'system-ui, sans-serif',
      monospace: 'Consolas, monospace',
    },
    animations: {
      enabled: false,
      speed: 'normal',
    },
  },
  {
    id: 'cyberpunk',
    name: 'cyberpunk',
    displayName: 'Cyberpunk',
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ff0080',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#00ff00',
      textSecondary: '#ff00ff',
      border: '#ff00ff',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      info: '#00ffff',
    },
    fonts: {
      primary: 'Courier New, monospace',
      monospace: 'Courier New, monospace',
    },
    animations: {
      enabled: true,
      speed: 'fast',
    },
  },
];

export const fontOptions = [
  { value: 'Inter, system-ui, sans-serif', label: 'Inter' },
  { value: 'Roboto, system-ui, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, system-ui, sans-serif', label: 'Open Sans' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'JetBrains Mono, Consolas, monospace', label: 'JetBrains Mono' },
  { value: 'Fira Code, Consolas, monospace', label: 'Fira Code' },
  { value: 'Consolas, monospace', label: 'Consolas' },
  { value: 'Courier New, monospace', label: 'Courier New' },
];

export const animationSpeeds = [
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
];

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-success', theme.colors.success);
  root.style.setProperty('--color-warning', theme.colors.warning);
  root.style.setProperty('--color-error', theme.colors.error);
  root.style.setProperty('--color-info', theme.colors.info);
  
  root.style.setProperty('--font-primary', theme.fonts.primary);
  root.style.setProperty('--font-monospace', theme.fonts.monospace);
  
  // Apply animation settings
  if (theme.animations.enabled) {
    root.style.setProperty('--animation-duration', getAnimationDuration(theme.animations.speed));
  } else {
    root.style.setProperty('--animation-duration', '0s');
  }
  
  // Set data attribute for CSS targeting
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-animations', theme.animations.enabled.toString());
}

export function getAnimationDuration(speed: 'slow' | 'normal' | 'fast'): string {
  switch (speed) {
    case 'slow': return '0.5s';
    case 'normal': return '0.3s';
    case 'fast': return '0.15s';
    default: return '0.3s';
  }
}

export function createCustomTheme(
  id: string,
  name: string,
  baseTheme: Theme,
  customizations: Partial<Theme>
): Theme {
  return {
    ...baseTheme,
    id,
    name,
    displayName: name,
    ...customizations,
    custom: true,
  };
}

export function validateTheme(theme: Partial<Theme>): boolean {
  // Basic validation to ensure theme has required properties
  const requiredColors = [
    'primary', 'secondary', 'accent', 'background', 
    'surface', 'text', 'textSecondary', 'border',
    'success', 'warning', 'error', 'info'
  ];
  
  if (!theme.colors) return false;
  
  for (const color of requiredColors) {
    if (!theme.colors[color as keyof typeof theme.colors]) {
      return false;
    }
  }
  
  if (!theme.fonts || !theme.fonts.primary || !theme.fonts.monospace) {
    return false;
  }
  
  return true;
}

export function exportTheme(theme: Theme): string {
  return JSON.stringify(theme, null, 2);
}

export function importTheme(themeJson: string): Theme | null {
  try {
    const theme = JSON.parse(themeJson);
    if (validateTheme(theme)) {
      return theme as Theme;
    }
    return null;
  } catch (error) {
    console.error('Error importing theme:', error);
    return null;
  }
}

export function getSystemTheme(): 'light' | 'dark' {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function watchSystemTheme(callback: (theme: 'light' | 'dark') => void): () => void {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      callback(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Return cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }
  
  // Return no-op cleanup if not supported
  return () => {};
}
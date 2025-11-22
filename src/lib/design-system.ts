// Design System for Keyboard Master
// Based on Figma design specifications

export const colors = {
  primary: '#007BFF',
  secondary: '#6C757D',
  accent: '#28A745',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  neutral: '#F8F9FA',
  textPrimary: '#212529',
  textSecondary: '#6C757D',
} as const;

export const typography = {
  h1: 'text-2.5rem font-bold leading-1.2',
  h2: 'text-2rem font-semibold leading-1.3',
  h3: 'text-1.5rem font-semibold leading-1.4',
  body: 'text-1rem font-normal leading-1.5',
  small: 'text-0.875rem font-normal leading-1.4',
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  xxl: '3rem',   // 48px
} as const;

export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

export const transitions = {
  fast: '150ms ease-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
} as const;

// Animation keyframes
export const animations = {
  keyPress: 'key-press 0.15s ease-out',
  shake: 'shake 0.3s ease-in-out',
  pulse: 'pulse 1s ease-in-out infinite',
  slideIn: 'slide-in 0.3s ease-out',
  fadeIn: 'fade-in 0.2s ease-out',
} as const;

// Breakpoints
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
} as const;

// Component-specific styles
export const componentStyles = {
  button: {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200',
    ghost: 'hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200',
  },
  input: {
    default: 'border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    error: 'border border-red-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
  },
  card: {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm p-4',
    elevated: 'bg-white border border-gray-200 rounded-lg shadow-md p-4',
  },
} as const;
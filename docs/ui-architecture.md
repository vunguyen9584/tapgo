# <!-- Powered by BMAD™ Core -->

# Keyboard Master Frontend Architecture Document

## Template and Framework Selection

### Current Stack Analysis

Based on the existing codebase analysis, Keyboard Master is built using:

**Core Framework:**
- **React 18.3.1** with TypeScript - Modern React with strict typing
- **Vite 5.4.10** - Fast build tool and development server
- **Tailwind CSS 3.4.13** - Utility-first CSS framework

**Key Libraries:**
- **React Router DOM 7.9.6** - Client-side routing
- **Firebase 10.14.1** - Authentication and backend services
- **React Helmet Async 2.0.5** - Head tag management

### Architecture Decisions

**State Management Approach:**
- **Decision:** Continue with local component state using React hooks (useState, useEffect, useContext)
- **Rationale:** 
  - Lightweight approach aligns with project simplicity goals
  - Reduces bundle size and complexity
  - Sufficient for current application scope
  - Easy to understand and maintain
  - Can scale to Context API for cross-component state if needed

**Component Strategy:**
- **Decision:** Build custom components using Tailwind CSS
- **Rationale:**
  - Complete design control and consistency
  - Lightweight - no additional component library overhead
  - Tailwind provides excellent utility-first approach
  - Custom components match typing application's unique needs
  - Better performance with tree-shaking of unused utilities

**Testing Framework:**
- **Decision:** Implement Vitest with React Testing Library
- **Rationale:**
  - Vitest integrates seamlessly with Vite
  - Faster test execution compared to Jest
  - Modern ESM-first approach
  - React Testing Library provides best practices for component testing
  - Lightweight and minimal configuration

**Scaling Considerations:**
- **Focus:** Performance optimization and code maintainability
- **Approach:**
  - Lazy loading for route components
  - Code splitting for large features
  - Optimized bundle with Vite's built-in optimizations
  - Performance monitoring and metrics

### Project Structure Assessment

Current structure follows React best practices:
```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries and services
├── styles/        # Global styles
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

This structure supports:
- Clear separation of concerns
- Easy navigation and maintenance
- Scalable organization
- Type safety throughout the application

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-24 | 1.0 | Initial frontend architecture document | Winston (Architect) |

---

## Frontend Tech Stack

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Framework | React | 18.3.1 | UI framework with component-based architecture | Modern React with concurrent features, excellent TypeScript support, large ecosystem |
| UI Library | Custom Components | - | Reusable UI components built with Tailwind | Complete design control, lightweight, tailored to typing application needs |
| State Management | React Hooks | - | Local component state management | Built-in, lightweight, sufficient for current scope, easy to understand |
| Routing | React Router DOM | 7.9.6 | Client-side routing and navigation | De facto standard, excellent TypeScript support, route-based code splitting |
| Build Tool | Vite | 5.4.10 | Development server and build tool | Extremely fast HMR, optimized builds, minimal configuration, modern tooling |
| Styling | Tailwind CSS | 3.4.13 | Utility-first CSS framework | Rapid development, consistent design system, excellent performance, small bundle |
| Testing | Vitest + React Testing Library | Latest | Unit and integration testing | Fast test execution, Vite integration, component testing best practices |
| Component Library | Custom | - | Application-specific components | Tailored to typing application requirements, no unused dependencies |
| Form Handling | React Hook Form | Latest | Form state management and validation | Minimal re-renders, excellent performance, easy integration with TypeScript |
| Animation | Framer Motion | Latest | Component animations and transitions | Declarative animations, excellent performance, physics-based animations |
| Dev Tools | React DevTools | Latest | React application debugging | Essential for React development, component inspection, performance profiling |

---

## Project Structure

### Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, etc.)
│   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   ├── forms/           # Form-specific components
│   └── charts/          # Chart and visualization components
├── pages/               # Page-level components
│   ├── Dashboard/       # Dashboard page
│   ├── Practice/        # Practice typing page
│   ├── Lessons/         # Lessons page
│   ├── Settings/        # Settings page
│   ├── Profile/         # User profile page
│   ├── Test/            # Typing test page
│   ├── CustomText/      # Custom text practice
│   ├── NumbersMode/     # Numbers typing mode
│   ├── CodeMode/        # Code typing mode
│   ├── CompetitionMode/ # Competition mode
│   └── Leaderboard/     # Leaderboard page
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useLocalStorage.ts # Local storage hook
│   ├── useTyping.ts     # Typing logic hook
│   └── useSettings.ts   # Settings management hook
├── lib/                 # Utility libraries and services
│   ├── firebase.ts      # Firebase configuration
│   ├── i18n.ts          # Internationalization
│   ├── api.ts           # API client configuration
│   └── constants.ts     # Application constants
├── styles/              # Global styles
│   ├── globals.css      # Global CSS styles
│   ├── components.css   # Component-specific styles
│   └── utilities.css    # Utility classes
├── types/               # TypeScript type definitions
│   ├── auth.ts          # Authentication types
│   ├── typing.ts        # Typing-related types
│   ├── user.ts          # User types
│   └── api.ts           # API response types
├── utils/               # Utility functions
│   ├── formatting.ts    # Text formatting utilities
│   ├── validation.ts    # Validation utilities
│   ├── storage.ts       # Storage utilities
│   └── calculations.ts  # Typing calculations
├── assets/              # Static assets
│   ├── images/          # Image files
│   ├── icons/           # Icon files
│   └── fonts/           # Font files
└── tests/               # Test files
    ├── __mocks__/       # Mock files
    ├── components/      # Component tests
    ├── hooks/           # Hook tests
    ├── utils/           # Utility tests
    └── setup.ts         # Test setup configuration
```

### File Organization Principles

1. **Co-location:** Keep related files together (component, styles, tests)
2. **Index exports:** Use index files for clean imports
3. **Type safety:** Every module should have corresponding TypeScript types
4. **Test proximity:** Place test files close to source files
5. **Asset organization:** Group static assets by type

---

## Component Standards

### Component Template

```typescript
import React, { useState, useEffect } from 'react';
import { ComponentProps } from './types';

/**
 * Component description
 * 
 * @param props - Component props
 * @returns JSX element
 */
const Component: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2, 
  onAction 
}) => {
  // State management
  const [state, setState] = useState<Type>(initialValue);

  // Side effects
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  // Event handlers
  const handleClick = () => {
    onAction?.(data);
  };

  // Render
  return (
    <div className="component-base-classes">
      {/* Component JSX */}
    </div>
  );
};

export default Component;
```

### Naming Conventions

**Components:**
- Use PascalCase for component names: `UserProfile`, `TypingTest`
- File names match component names: `UserProfile.tsx`
- Export component as default: `export default UserProfile`

**Props and Types:**
- Interface names: `ComponentNameProps` → `UserProfileProps`
- Use descriptive prop names: `onSubmit` not `handleClick`
- Optional props with clear defaults: `disabled?: boolean`

**Files and Directories:**
- Component files: `ComponentName.tsx`
- Type files: `ComponentName.types.ts`
- Test files: `ComponentName.test.tsx`
- Story files: `ComponentName.stories.tsx` (if using Storybook)

**CSS Classes:**
- Use Tailwind utility classes primarily
- Custom classes with kebab-case: `typing-test-container`
- Component-specific prefixes: `tm-` (typing-master)

**Hooks:**
- Custom hooks start with `use`: `useTypingStats`
- Hook files: `useHookName.ts`
- Return objects for multiple values: `return { value, setValue }`

---

## State Management

### Store Structure

Since we're using React hooks for state management, the structure is distributed:

```
src/
├── hooks/               # Custom hooks for state logic
│   ├── useAuth.ts       # Authentication state
│   ├── useTyping.ts     # Typing session state
│   ├── useSettings.ts   # User preferences
│   └── useLocalStorage.ts # Persistent state
├── contexts/            # React contexts for global state
│   ├── AuthContext.tsx  # Authentication context
│   ├── SettingsContext.tsx # Settings context
│   └── ThemeContext.tsx # Theme context
└── lib/
    └── constants.ts     # Application constants
```

### State Management Template

```typescript
// hooks/useTyping.ts
import { useState, useEffect, useCallback } from 'react';
import { TypingSession, TypingStats } from '../types/typing';

interface UseTypingReturn {
  session: TypingSession | null;
  stats: TypingStats;
  startSession: (text: string) => void;
  endSession: () => void;
  recordKeystroke: (key: string, timestamp: number) => void;
  resetStats: () => void;
}

export const useTyping = (): UseTypingReturn => {
  const [session, setSession] = useState<TypingSession | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    startTime: null,
    endTime: null,
  });

  const startSession = useCallback((text: string) => {
    const newSession: TypingSession = {
      id: generateId(),
      text,
      startTime: Date.now(),
      keystrokes: [],
      completed: false,
    };
    setSession(newSession);
    setStats(prev => ({ ...prev, startTime: Date.now() }));
  }, []);

  const endSession = useCallback(() => {
    if (!session) return;
    
    const endTime = Date.now();
    const duration = (endTime - session.startTime) / 1000 / 60; // minutes
    
    setSession(prev => prev ? { ...prev, completed: true, endTime } : null);
    setStats(prev => ({
      ...prev,
      endTime,
      wpm: calculateWPM(session.text, duration),
      accuracy: calculateAccuracy(prev.correctKeystrokes, prev.totalKeystrokes),
    }));
  }, [session]);

  const recordKeystroke = useCallback((key: string, timestamp: number) => {
    if (!session) return;
    
    setSession(prev => prev ? {
      ...prev,
      keystrokes: [...prev.keystrokes, { key, timestamp, correct: true }]
    } : null);
    
    setStats(prev => ({
      ...prev,
      totalKeystrokes: prev.totalKeystrokes + 1,
      correctKeystrokes: prev.correctKeystrokes + 1,
    }));
  }, [session]);

  const resetStats = useCallback(() => {
    setSession(null);
    setStats({
      wpm: 0,
      accuracy: 100,
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      startTime: null,
      endTime: null,
    });
  }, []);

  return {
    session,
    stats,
    startSession,
    endSession,
    recordKeystroke,
    resetStats,
  };
};
```

---

## API Integration

### Service Template

```typescript
// lib/api.ts
import { ApiResponse, User, TypingResult } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // User endpoints
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`);
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Typing results endpoints
  async saveTypingResult(result: Omit<TypingResult, 'id'>): Promise<ApiResponse<TypingResult>> {
    return this.request<TypingResult>('/typing-results', {
      method: 'POST',
      body: JSON.stringify(result),
    });
  }

  async getTypingHistory(userId: string, limit = 10): Promise<ApiResponse<TypingResult[]>> {
    return this.request<TypingResult[]>(`/users/${userId}/typing-results?limit=${limit}`);
  }

  // Leaderboard endpoints
  async getLeaderboard(mode: string, limit = 10): Promise<ApiResponse<TypingResult[]>> {
    return this.request<TypingResult[]>(`/leaderboard/${mode}?limit=${limit}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### API Client Configuration

```typescript
// lib/api-config.ts
import { apiClient } from './api';
import { getAuthToken } from './firebase';

// Request interceptor for authentication
apiClient.addRequestInterceptor(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.addResponseInterceptor(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.status === 401) {
      // Redirect to login or refresh token
      window.location.href = '/login';
    }
    
    // Log errors for debugging
    console.error('API Error:', error);
    
    return Promise.reject(error);
  }
);

// Export configured API client
export { apiClient as api };
```

---

## Routing

### Route Configuration

```typescript
// src/router/index.tsx
import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Lazy loaded components
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Practice = React.lazy(() => import('../pages/Practice'));
const Lessons = React.lazy(() => import('../pages/Lessons'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Test = React.lazy(() => import('../pages/Test'));
const CustomText = React.lazy(() => import('../pages/CustomText'));
const NumbersMode = React.lazy(() => import('../pages/NumbersMode'));
const CodeMode = React.lazy(() => import('../pages/CodeMode'));
const CompetitionMode = React.lazy(() => import('../pages/CompetitionMode'));
const Leaderboard = React.lazy(() => import('../pages/Leaderboard'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'practice',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Practice />
          </Suspense>
        ),
      },
      {
        path: 'lessons',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Lessons />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'test',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Test />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Settings />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'custom',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <CustomText />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'numbers',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <NumbersMode />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'code',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <CodeMode />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'competition',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <CompetitionMode />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'leaderboard',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Leaderboard />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
```

---

## Styling Guidelines

### Styling Approach

**Primary Approach:** Tailwind CSS utility classes with custom CSS for complex animations and specific component styles.

**Guidelines:**
1. **Utility-First:** Use Tailwind utilities for 90% of styling needs
2. **Component Classes:** Create custom classes for complex, reusable patterns
3. **Responsive Design:** Mobile-first approach with Tailwind responsive prefixes
4. **Dark Mode:** Implement using Tailwind's dark mode variants
5. **Performance:** Purge unused utilities in production build

### Global Theme Variables

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Custom Properties for Theme */
:root {
  /* Colors */
  --color-primary: 59 130 246; /* blue-500 */
  --color-primary-foreground: 255 255 255;
  --color-secondary: 107 114 128; /* gray-500 */
  --color-secondary-foreground: 255 255 255;
  --color-background: 249 250 251; /* gray-50 */
  --color-foreground: 17 24 39; /* gray-900 */
  --color-muted: 243 244 246; /* gray-100 */
  --color-muted-foreground: 107 114 128; /* gray-500 */
  --color-border: 229 231 235; /* gray-200 */
  --color-input: 255 255 255;
  --color-ring: 59 130 246; /* blue-500 */
  
  /* Typing specific colors */
  --color-correct: 34 197 94; /* green-500 */
  --color-incorrect: 239 68 68; /* red-500 */
  --color-current: 59 130 246; /* blue-500 */
  --color-upcoming: 107 114 128; /* gray-500 */
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Typography */
  --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
  --font-family-sans: 'Inter', 'Helvetica Neue', sans-serif;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}

.dark {
  --color-background: 17 24 39; /* gray-900 */
  --color-foreground: 249 250 251; /* gray-50 */
  --color-muted: 31 41 55; /* gray-800 */
  --color-muted-foreground: 156 163 175; /* gray-400 */
  --color-border: 55 65 81; /* gray-700 */
  --color-input: 31 41 55; /* gray-800 */
}

/* Base styles */
@layer base {
  html {
    font-family: var(--font-family-sans);
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
  
  /* Typography for typing */
  .typing-text {
    font-family: var(--font-family-mono);
    letter-spacing: 0.05em;
    line-height: 1.6;
  }
}

/* Component styles */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background;
  }
  
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }
  
  .btn-secondary {
    @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
  }
  
  .typing-input {
    @apply w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent;
  }
  
  .card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }
  
  .typing-char {
    @apply relative transition-colors duration-150;
  }
  
  .typing-char.correct {
    @apply text-green-500;
  }
  
  .typing-char.incorrect {
    @apply text-red-500 bg-red-50 dark:bg-red-900/20;
  }
  
  .typing-char.current {
    @apply text-blue-500 bg-blue-50 dark:bg-blue-900/20 animate-pulse;
  }
}

/* Utility classes */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .animate-in {
    animation: animateIn 0.2s ease-out;
  }
  
  .animate-out {
    animation: animateOut 0.2s ease-in;
  }
}

/* Animations */
@keyframes animateIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes animateOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Typing specific animations */
@keyframes keystroke {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.keystroke-animation {
  animation: keystroke 0.1s ease-out;
}
```

---

## Testing Requirements

### Component Test Template

```typescript
// tests/components/Button.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Button } from '../../src/components/ui/Button';

describe('Button Component', () => {
  const defaultProps = {
    children: 'Test Button',
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders button with correct text', () => {
    render(<Button {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    render(<Button {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });
  });

  it('applies correct variant classes', () => {
    render(<Button {...defaultProps} variant="secondary" />);
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toHaveClass('bg-secondary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button {...defaultProps} disabled />);
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('does not call onClick when disabled', async () => {
    render(<Button {...defaultProps} disabled />);
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
  });
});
```

### Testing Best Practices

1. **Unit Tests**: Test individual components in isolation
   - Focus on component behavior, not implementation details
   - Test user interactions and state changes
   - Mock external dependencies

2. **Integration Tests**: Test component interactions
   - Test component composition
   - Verify data flow between components
   - Test routing and navigation

3. **E2E Tests**: Test critical user flows
   - Use Playwright for browser automation
   - Test complete user journeys
   - Focus on business-critical paths

4. **Coverage Goals**: Aim for 80% code coverage
   - Prioritize critical paths and edge cases
   - Use coverage reports to identify untested code
   - Focus on meaningful tests over coverage percentage

5. **Test Structure**: Arrange-Act-Assert pattern
   ```typescript
   // Arrange
   const props = { /* test props */ };
   
   // Act
   render(<Component {...props} />);
   fireEvent.click(screen.getByRole('button'));
   
   // Assert
   expect(mockFunction).toHaveBeenCalled();
   ```

6. **Mock External Dependencies**: API calls, routing, state management
   ```typescript
   vi.mock('../../src/lib/api', () => ({
     apiClient: {
       getUserProfile: vi.fn(),
     },
   }));
   ```

---

## Environment Configuration

### Required Environment Variables

```bash
# Development
VITE_API_BASE_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Production
VITE_API_BASE_URL=https://api.keyboardmaster.com/api
VITE_FIREBASE_API_KEY=your_production_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=keyboardmaster.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=keyboardmaster-prod
VITE_FIREBASE_STORAGE_BUCKET=keyboardmaster-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:fedcba

# Optional
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_ENABLE_DEBUG_MODE=false
```

### Environment Configuration File

```typescript
// src/config/env.ts
interface EnvConfig {
  apiBaseUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  googleAnalyticsId?: string;
  sentryDsn?: string;
  debugMode: boolean;
}

export const env: EnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  },
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
};

// Validation
export const validateEnv = (): void => {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
```

---

## Frontend Developer Standards

### Critical Coding Rules

**Universal Rules:**
1. **Type Safety**: All code must be fully typed with TypeScript
2. **Error Handling**: Every async operation must have proper error handling
3. **Performance**: Use React.memo, useMemo, and useCallback appropriately
4. **Accessibility**: All interactive elements must be keyboard accessible
5. **Security**: Never expose sensitive data in client-side code

**React-Specific Rules:**
1. **Component Structure**: Follow the component template exactly
2. **State Management**: Use the appropriate state management pattern for the scope
3. **Props**: Always define prop interfaces with proper types
4. **Effects**: Include proper dependency arrays in useEffect hooks
5. **Cleanup**: Always return cleanup functions from effects when needed

**Tailwind-Specific Rules:**
1. **Responsive Design**: Always use mobile-first approach
2. **Custom Classes**: Only create custom classes for complex, reusable patterns
3. **Dark Mode**: Always include dark mode variants for user-facing components
4. **Performance**: Avoid excessive utility class combinations

**File Organization Rules:**
1. **Index Exports**: Use index files for clean imports from directories
2. **Type Co-location**: Keep types close to their usage
3. **Test Proximity**: Place test files in the same directory as source files
4. **Asset Organization**: Group static assets by type and purpose

### Quick Reference

**Common Commands:**
```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run typecheck        # Type checking only
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
```

**Key Import Patterns:**
```typescript
// React imports
import React, { useState, useEffect, useCallback } from 'react';

// Component imports
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/layout/Layout';

// Hook imports
import { useAuth } from '@/hooks/useAuth';
import { useTyping } from '@/hooks/useTyping';

// Utility imports
import { formatTime } from '@/utils/formatting';
import { validateEmail } from '@/utils/validation';

// Type imports
import type { User, TypingSession } from '@/types';
```

**File Naming Conventions:**
- Components: `PascalCase.tsx` → `UserProfile.tsx`
- Hooks: `useCamelCase.ts` → `useUserProfile.ts`
- Utils: `camelCase.ts` → `formatting.ts`
- Types: `camelCase.ts` → `user.ts`
- Tests: `PascalCase.test.tsx` → `UserProfile.test.tsx`

**Project-Specific Patterns:**
```typescript
// Custom hook pattern
export const useCustomHook = <T>(initialValue: T) => {
  // Hook implementation
  return { value, setValue };
};

// API service pattern
export const apiService = {
  get: async <T>(endpoint: string): Promise<T> => {
    // Implementation
  },
  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    // Implementation
  },
};

// Component pattern with forwardRef
export const CustomComponent = React.forwardRef<
  HTMLDivElement,
  CustomComponentProps
>((props, ref) => {
  return <div ref={ref}>{/* Component content */}</div>;
});
```

---

*This frontend architecture document serves as the foundation for developing the Keyboard Master application with a focus on performance, maintainability, and developer experience.*
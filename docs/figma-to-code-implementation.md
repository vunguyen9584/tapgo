# Hướng Dẫn Chuyển Đổi Figma Design Sang Code

## 🎯 Tổng Quan

Bạn đã có thiết kế Figma hoàn chỉnh, bây giờ là lúc biến nó thành code! Hướng dẫn này sẽ giúp bạn áp dụng thiết kế Figma vào ứng dụng Keyboard Master một cách hiệu quả.

## 🛠️ Chuẩn Bị Công Cụ

### 1. Figma Dev Mode Setup
1. Mở Figma file của bạn
2. Click vào "Dev Mode" ở góc trên bên phải
3. Enable plugins:
   - **Tailwind CSS Generator**: Tự động generate Tailwind classes
   - **CSS Variables**: Export CSS variables
   - **Accessibility Checker**: Kiểm tra accessibility

### 2. VS Code Extensions
```bash
# Cài đặt các extensions cần thiết
- Tailwind CSS IntelliSense
- CSS to TailwindCSS Converter
- Figma for VS Code
- Prettier - Code formatter
- ES7+ React/Redux/React-Native snippets
```

### 3. Design System Setup
Tạo file design system để đảm bảo consistency:

```typescript
// src/lib/design-system.ts
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
```

## 📋 Quy Trình Triển Khai

### Bước 1: Phân Tích Figma Design

#### 1.1 Export Assets
1. **Icons**: Export dưới dạng SVG
2. **Images**: Export dưới dạng WebP/PNG
3. **Illustrations**: Export dưới dạng SVG

```bash
# Tạo thư mục assets
mkdir -p src/assets/icons src/assets/images src/assets/illustrations
```

#### 1.2 Extract Design Tokens
Sử dụng Figma Dev Mode để extract:
- Colors
- Typography
- Spacing
- Border radius
- Shadows

#### 1.3 Component Breakdown
Phân tích từng component trong Figma:
- Layout structure
- Responsive behavior
- Interactive states
- Animation specifications

### Bước 2: Bắt Đầu Với Virtual Keyboard Overlay

#### 2.1 Tạo Component Structure

```typescript
// src/components/EnhancedKeyboardGuide.tsx
import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { colors } from '../lib/design-system';

interface KeyboardDisplayOptions {
  transparency: number;
  size: 'small' | 'medium' | 'large';
  showFingerGuides: boolean;
}

interface Props {
  activeChar?: string;
  show: boolean;
  onToggle: () => void;
  displayOptions?: KeyboardDisplayOptions;
}

export default function EnhancedKeyboardGuide({ 
  activeChar, 
  show, 
  onToggle, 
  displayOptions = {
    transparency: 1,
    size: 'medium',
    showFingerGuides: true
  }
}: Props) {
  // Implementation sẽ đi ở đây
}
```

#### 2.2 Implement Keyboard Layout

```typescript
// Key rows từ Figma design
const keyRows: string[][] = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['a','s','d','f','g','h','j','k','l',';','\''],
  ['z','x','c','v','b','n','m',',','.','/']
];

// Component cho individual key
const KeyCap = ({ 
  char, 
  isActive, 
  size = 'medium',
  transparency = 1 
}: {
  char: string;
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
  transparency?: number;
}) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-3 text-base'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]}
        rounded-lg border transition-all duration-150 ease-out
        ${isActive 
          ? 'bg-green-100 border-green-500 shadow-lg transform scale-105' 
          : 'bg-white border-gray-300 hover:border-gray-400'
        }
      `}
      style={{ opacity: transparency }}
    >
      {char}
    </div>
  );
};
```

#### 2.3 Add Finger Positioning Guides

```typescript
// Finger positioning component
const FingerGuide = ({ 
  side, 
  activeFinger 
}: { 
  side: 'left' | 'right'; 
  activeFinger?: string;
}) => {
  const fingers = side === 'left' 
    ? ['pinky', 'ring', 'middle', 'index', 'thumb']
    : ['thumb', 'index', 'middle', 'ring', 'pinky'];

  const fingerColors = {
    pinky: 'bg-rose-500',
    ring: 'bg-amber-500',
    middle: 'bg-yellow-500',
    index: 'bg-lime-500',
    thumb: 'bg-emerald-500'
  };

  return (
    <div className="flex gap-1 justify-center">
      {fingers.map((finger) => (
        <div
          key={finger}
          className={`
            w-6 h-8 rounded-md border-2 border-gray-300
            ${activeFinger === finger ? fingerColors[finger] : 'bg-white'}
            transition-colors duration-200
          `}
        />
      ))}
    </div>
  );
};
```

### Bước 3: Enhanced Visual Feedback cho TypingArea

#### 3.1 Cải thiện TypingArea Component

```typescript
// src/components/EnhancedTypingArea.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../lib/i18n';
import type { AppStatus } from '../types';

interface CharacterState {
  char: string;
  status: 'untyped' | 'correct' | 'incorrect' | 'current' | 'upcoming';
  animation?: 'shake' | 'pulse' | 'slide-in';
}

export default function EnhancedTypingArea({ 
  text, 
  typed, 
  status, 
  onType, 
  actions 
}: Props) {
  const [characterStates, setCharacterStates] = useState<CharacterState[]>([]);
  const [showSpeedIndicator, setShowSpeedIndicator] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  // Calculate character states
  useEffect(() => {
    const states: CharacterState[] = text.split('').map((char, index) => {
      if (index < typed.length) {
        return {
          char,
          status: typed[index] === char ? 'correct' : 'incorrect',
          animation: typed[index] !== char ? 'shake' : undefined
        };
      } else if (index === typed.length) {
        return { char, status: 'current', animation: 'pulse' };
      } else {
        return { char, status: 'upcoming' };
      }
    });
    setCharacterStates(states);
  }, [text, typed]);

  // Calculate typing speed
  useEffect(() => {
    if (status === 'running') {
      const wpm = calculateWPM(typed, startTime);
      setCurrentSpeed(wpm);
      setShowSpeedIndicator(true);
    }
  }, [typed, status]);

  return (
    <div className="space-y-4">
      {/* Speed Indicator */}
      {showSpeedIndicator && (
        <SpeedIndicator wpm={currentSpeed} />
      )}
      
      {/* Enhanced Text Display */}
      <div className="classic-panel p-6">
        <div className="font-mono text-2xl leading-9">
          {characterStates.map((state, index) => (
            <CharacterSpan 
              key={index} 
              state={state}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Input Area */}
      <EnhancedInputArea 
        value={typed}
        onChange={onType}
        status={status}
      />
      
      {actions && <div className="mt-4">{actions}</div>}
    </div>
  );
}
```

#### 3.2 Character Span Component

```typescript
const CharacterSpan = ({ 
  state, 
  index 
}: { 
  state: CharacterState; 
  index: number;
}) => {
  const getClassName = () => {
    const baseClass = 'inline-block transition-all duration-200';
    
    switch (state.status) {
      case 'correct':
        return `${baseClass} text-gray-500`;
      case 'incorrect':
        return `${baseClass} text-red-500 ${state.animation === 'shake' ? 'animate-shake' : ''}`;
      case 'current':
        return `${baseClass} text-blue-500 underline ${state.animation === 'pulse' ? 'animate-pulse' : ''}`;
      case 'upcoming':
        return `${baseClass} text-gray-700`;
      default:
        return baseClass;
    }
  };

  return (
    <span className={getClassName()}>
      {state.char}
    </span>
  );
};
```

### Bước 4: Mobile Navigation Component

#### 4.1 Tạo Mobile Navigation

```typescript
// src/components/MobileNavigation.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from '../lib/design-system';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const tabs: TabItem[] = [
  { id: 'home', label: 'Home', icon: '🏠', path: '/' },
  { id: 'lessons', label: 'Lessons', icon: '📚', path: '/lessons' },
  { id: 'practice', label: 'Practice', icon: '⌨️', path: '/practice' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
  { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
];

export default function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = tabs.find(tab => tab.path === location.pathname);

  return (
    <>
      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
        <div className="flex justify-around items-center">
          {tabs.slice(0, 4).map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`
                flex flex-col items-center p-2 rounded-lg transition-colors
                ${activeTab?.id === tab.id 
                  ? 'text-blue-500' 
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
          
          {/* More Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center p-2 rounded-lg text-gray-500 hover:text-gray-700"
          >
            <span className="text-xl mb-1">⋯</span>
            <span className="text-xs">More</span>
          </button>
        </div>
      </div>

      {/* Slide-out Menu */}
      <SlideOutMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        tabs={tabs}
      />
    </>
  );
}
```

#### 4.2 Slide-out Menu Component

```typescript
const SlideOutMenu = ({ 
  isOpen, 
  onClose, 
  tabs 
}: {
  isOpen: boolean;
  onClose: () => void;
  tabs: TabItem[];
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Menu Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
          
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  navigate(tab.path);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
```

### Bước 5: Dashboard Component

#### 5.1 Dashboard Structure

```typescript
// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import ProgressChart from './ProgressChart';
import AchievementBadge from './AchievementBadge';
import { colors } from '../lib/design-system';

interface DashboardData {
  wpmHistory: { date: string; wpm: number }[];
  accuracyHistory: { date: string; accuracy: number }[];
  streak: number;
  totalPracticeTime: number;
  achievements: Achievement[];
}

export default function Dashboard() {
  const { t } = useI18n();
  const [data, setData] = useState<DashboardData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    // Fetch dashboard data from Firebase
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    // Implementation để fetch data
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <TimeRangeSelector 
          value={timeRange} 
          onChange={setTimeRange} 
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Current WPM" 
          value={data.wpmHistory[data.wpmHistory.length - 1]?.wpm || 0}
          icon="⚡"
        />
        <StatCard 
          title="Streak" 
          value={`${data.streak} days`}
          icon="🔥"
        />
        <StatCard 
          title="Practice Time" 
          value={`${data.totalPracticeTime}h`}
          icon="⏱️"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart 
          title="WPM Progress" 
          data={data.wpmHistory} 
          color={colors.primary}
        />
        <ProgressChart 
          title="Accuracy Progress" 
          data={data.accuracyHistory} 
          color={colors.success}
        />
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('achievements')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.achievements.map((achievement) => (
            <AchievementBadge 
              key={achievement.id}
              achievement={achievement}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 🎨 CSS Animations từ Figma

### Thêm Animations vào styles.css

```css
/* src/styles/styles.css */

/* Key press animation */
@keyframes key-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.key-press {
  animation: key-press 0.15s ease-out;
}

/* Shake animation for errors */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

/* Pulse animation for current character */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: pulse 1s ease-in-out infinite;
}

/* Slide in animation for menu */
@keyframes slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.slide-in {
  animation: slide-in 0.3s ease-out;
}

/* Enhanced caret animation */
.enhanced-caret {
  width: 2px;
  height: 1.4em;
  background-color: #007BFF;
  display: inline-block;
  transform: translateY(0.12em);
  animation: caret-blink-enhanced 1s steps(1) infinite;
  border-radius: 1px;
  transition: transform 0.1s ease-out;
}

@keyframes caret-blink-enhanced {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Speed indicator animation */
@keyframes speed-indicator {
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.speed-indicator {
  animation: speed-indicator 0.3s ease-out;
}
```

## 📱 Responsive Implementation

### Tailwind Breakpoints Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
        'wide': '1440px',
      },
    },
  },
}
```

### Responsive Component Patterns

```typescript
// Responsive utility hook
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet, isDesktop };
};
```

## 🧪 Testing Components

### Component Testing với Jest

```typescript
// src/components/__tests__/EnhancedKeyboardGuide.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedKeyboardGuide from '../EnhancedKeyboardGuide';

describe('EnhancedKeyboardGuide', () => {
  test('renders keyboard with all keys', () => {
    render(<EnhancedKeyboardGuide show={true} onToggle={() => {}} />);
    expect(screen.getByText('q')).toBeInTheDocument();
    expect(screen.getByText('w')).toBeInTheDocument();
    // ... test other keys
  });

  test('highlights active key', () => {
    render(
      <EnhancedKeyboardGuide 
        activeChar="a" 
        show={true} 
        onToggle={() => {}} 
      />
    );
    const activeKey = screen.getByText('a');
    expect(activeKey).toHaveClass('bg-green-100');
  });

  test('toggles visibility', () => {
    const onToggle = jest.fn();
    render(<EnhancedKeyboardGuide show={false} onToggle={onToggle} />);
    
    const toggleButton = screen.getByText('Show');
    fireEvent.click(toggleButton);
    expect(onToggle).toHaveBeenCalled();
  });
});
```

## 🚀 Deployment Steps

### 1. Code Review Checklist
- [ ] Components match Figma design
- [ ] Responsive behavior correct
- [ ] Accessibility features implemented
- [ ] Performance optimized
- [ ] Tests passing

### 2. Integration Testing
- [ ] All components work together
- [ ] Navigation flows work
- [ ] Data persistence works
- [ ] Mobile experience tested

### 3. Production Deployment
```bash
# Build và deploy
npm run build
npm run preview

# Test production build
npm run test:prod
```

## 📋 Troubleshooting Common Issues

### Design vs Code Mismatches
1. **Check Figma measurements**: Ensure pixels match
2. **Verify Tailwind classes**: Use Dev Mode suggestions
3. **Test on different devices**: Check responsive behavior

### Performance Issues
1. **Optimize animations**: Use CSS transforms
2. **Lazy load components**: Implement code splitting
3. **Monitor bundle size**: Use webpack-bundle-analyzer

### Accessibility Issues
1. **Run axe-core**: Automated accessibility testing
2. **Test with screen readers**: VoiceOver, NVDA
3. **Check color contrast**: Use contrast checker tools

---

## 🎉 Kết Luận

Với hướng dẫn này, bạn có thể áp dụng thiết kế Figma vào code một cách có hệ thống. Hãy bắt đầu với component đầu tiên (EnhancedKeyboardGuide) và làm theo từng bước.

**Lưu ý quan trọng**: Luôn test components trên nhiều thiết bị và trình duyệt để đảm bảo consistency với thiết kế Figma!

Chúc bạn triển khai thành công! 🚀
# Epic Technical Specification: Basic Typing Engine Foundation

Date: 2025-11-24
Author: BMad
Epic ID: epic-1
Status: Completed

---

## Overview

The Basic Typing Engine Foundation is a core component that provides the fundamental typing experience for Keyboard Master. This engine delivers real-time character-by-character input processing, visual feedback for typing accuracy, animated cursor positioning, and comprehensive metrics calculation including Words Per Minute (WPM) and accuracy percentages. The system serves as the foundation for all practice modes and ensures users receive immediate, accurate feedback during typing sessions.

## Objectives and Scope

### In Scope
- Real-time text input processing with character-by-character validation
- Visual feedback system with color-coded correctness indicators (green for correct, red for incorrect)
- Animated cursor showing current typing position with smooth transitions
- Comprehensive metrics calculation (WPM, accuracy, character counts, net WPM)
- Timer system supporting multiple durations (15, 30, 60, 120 seconds) with auto-start functionality
- Session management with pause/resume capabilities for longer sessions
- Input validation including special characters, punctuation, and backspace handling
- Paste functionality prevention to ensure manual typing practice

### Out of Scope
- Specific content generation (quotes, words, lessons) - handled by practice modes
- User authentication and profile management
- Competition mode and social features
- Advanced analytics and progress tracking
- Sound effects and audio feedback
- Theme and customization settings

## System Architecture Alignment

This engine integrates seamlessly with the existing React 18 + TypeScript + Tailwind CSS architecture. The component follows the established unidirectional data flow pattern using React Hooks for state management. Firebase integration is utilized for session data persistence, while maintaining the existing component-based organization within the features structure. The engine leverages the current Firebase configuration for authentication and Firestore for data storage, ensuring compatibility with the existing authentication system and user data models.

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs | Owner |
|--------|----------------|---------|---------|-------|
| TypingEngine | Core typing logic and character validation | Target text, user input | Validation results, cursor position | Component |
| MetricsCalculator | Real-time performance metrics | Typing events, time data | WPM, accuracy, character counts | Component |
| TimerManager | Session timing control | Duration settings, start/stop events | Time remaining, session state | Component |
| InputValidator | Input sanitization and validation | User keystrokes, paste events | Validated input, error states | Component |
| SessionManager | Session lifecycle management | Session start/end events | Session data for persistence | Component |

### Data Models and Contracts

```typescript
interface TypingSession {
  id: string;
  userId: string;
  targetText: string;
  typedText: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  isPaused: boolean;
  currentCharIndex: number;
}

interface TypingMetrics {
  wpm: number;
  accuracy: number;
  netWpm: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

interface CharacterResult {
  char: string;
  isCorrect: boolean;
  position: number;
  timestamp: number;
}
```

### APIs and Interfaces

```typescript
// Core typing interface
interface TypingEngineProps {
  targetText: string;
  onSessionComplete: (session: TypingSession, metrics: TypingMetrics) => void;
  duration: number; // seconds
  enabled?: boolean;
}

// Real-time metrics callback
interface MetricsCallback {
  (metrics: TypingMetrics): void;
}

// Timer events
interface TimerEvents {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
}
```

### Workflows and Sequencing

1. **Session Initialization**: Load target text → Initialize component state → Set up event listeners
2. **Typing Input Flow**: User keystroke → Validate character → Update visual feedback → Calculate metrics → Update cursor position
3. **Session Management**: Start timer on first keystroke → Track typing events → Handle pause/resume → Complete session on time/text completion
4. **Data Persistence**: Collect session data → Store to Firestore → Trigger completion callback

## Non-Functional Requirements

### Performance

- Typing input latency: < 50ms from keystroke to visual feedback
- Metrics update frequency: Every 100ms for smooth real-time display
- Memory usage: < 100MB for typical typing sessions
- Component render optimization using React.memo for expensive operations

### Security

- Input sanitization for XSS prevention
- Paste functionality disabled using preventDefault()
- Firebase security rules for session data access control
- Rate limiting for session creation to prevent abuse

### Reliability/Availability

- 99.9% uptime for typing sessions
- Graceful degradation during network interruptions with local storage fallback
- Automatic data backup every 6 hours for session history
- Error recovery time < 1 second for critical failures

### Observability

- Comprehensive error logging for typing input failures
- Performance metrics tracking for latency monitoring
- User interaction analytics for typing pattern analysis
- Session state logging for debugging and optimization

## Dependencies and Integrations

### External Dependencies
- React 18.3.1 for component lifecycle management
- Firebase Auth 10.14.1 for user authentication
- Firebase Firestore 10.14.1 for session data persistence
- TypeScript 5.6.3 for type safety
- Tailwind CSS 3.4.13 for styling

### Internal Integrations
- Firebase configuration from lib/firebase.ts
- Existing theme system for visual consistency
- Navigation system for session result routing
- Component library for UI elements

## Acceptance Criteria (Authoritative)

1. **Text Display and Input System**: Target text displays with character-by-character highlighting, animated cursor shows current position, typed characters highlighted as correct (green) or incorrect (red), cursor animates smoothly between characters
2. **Real-time Visual Feedback**: Correct typing turns characters green and advances cursor, incorrect typing turns characters red with error indication, error counter increments appropriately
3. **Special Characters Handling**: All keyboard characters including punctuation are validated and matched exactly, backspace clears previous characters properly and moves cursor back
4. **Input Validation**: Paste functionality is blocked with subtle message indication, all characters processed through validation pipeline
5. **Real-time Metrics**: WPM calculated and displayed in real-time, accuracy percentage updates continuously, character-level statistics tracked during typing
6. **Session Completion**: Final WPM, accuracy, and net WPM calculated correctly, correct vs incorrect character counts displayed, performance data stored for historical tracking
7. **Timer Management**: Multiple durations (15, 30, 60, 120 seconds) supported, timer auto-starts on first keystroke, session auto-completes on time/text expiration
8. **Pause/Resume**: Longer sessions (>60 seconds) support pause/resume, timer state preserved during pause, session status updates appropriately

## Traceability Mapping

| AC | Spec Section | Component/API | Test Idea |
|----|--------------|---------------|-----------|
| AC1 | Text Display and Input System | TypingEngine component | Verify character highlighting and cursor animation |
| AC2 | Real-time Visual Feedback | InputValidator + MetricsCalculator | Test correct/incorrect character feedback timing |
| AC3 | Special Characters Handling | InputValidator | Validate special character processing pipeline |
| AC4 | Input Validation | InputValidator | Test paste prevention and input sanitization |
| AC5 | Real-time Metrics | MetricsCalculator | Verify WPM and accuracy calculation accuracy |
| AC6 | Session Completion | SessionManager | Test final metrics calculation and data storage |
| AC7 | Timer Management | TimerManager | Verify auto-start, duration support, and auto-completion |
| AC8 | Pause/Resume | TimerManager + SessionManager | Test pause/resume functionality and state preservation |

## Risks, Assumptions, Open Questions

**Risks:**
- Browser inconsistencies in keyboard event handling could cause validation issues
- Performance degradation with very long target texts affecting real-time responsiveness
- Mobile device touch typing experience may differ from desktop keyboard behavior

**Assumptions:**
- Users have modern browsers supporting ES6+ features and React 18
- Firebase connectivity is available for session data persistence
- Users have basic typing familiarity and understand standard keyboard layouts

**Questions:**
- Should the engine support adaptive difficulty based on user performance?
- How should the system handle non-standard keyboard layouts (Dvorak, AZERTY)?
- What is the maximum target text length the engine should support efficiently?

## Test Strategy Summary

**Unit Tests:**
- Character validation logic with edge cases (special characters, Unicode)
- WPM and accuracy calculation algorithms with various input scenarios
- Timer state management and lifecycle events
- Component state transitions and error handling

**Integration Tests:**
- End-to-end typing session workflow from start to completion
- Firebase integration for session data persistence
- Component interaction with navigation system
- Performance testing with large texts and rapid typing

**Regression Tests:**
- Verify existing functionality remains intact after engine integration
- Test compatibility with all current practice modes
- Validate mobile responsiveness and cross-browser functionality
- Ensure accessibility features are maintained with keyboard navigation

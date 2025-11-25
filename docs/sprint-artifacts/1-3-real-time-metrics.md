# Story 1.3: Real-time Metrics Calculation

Status: ready-for-dev

## Story

As a user,
I want to see my typing speed and accuracy in real-time,
so that I can monitor my performance during practice sessions.

## Acceptance Criteria

1. Given I am actively typing, when I type characters, then WPM is calculated and displayed in real-time and accuracy percentage updates continuously and character-level statistics are tracked.

2. Given a typing session ends, when the session completes, then final WPM, accuracy, and net WPM are calculated and correct vs incorrect character counts are displayed and performance data is stored for historical tracking.

## Requirements Context Summary

Based on Epic 1 Technical Specification and PRD requirements, this story implements the core metrics calculation system that provides real-time feedback during typing sessions. The implementation follows established patterns from previous stories and integrates with the existing TypingEngine component.

**Key Requirements:**
- Real-time WPM calculation: (typed_characters / 5) / minutes_elapsed
- Accuracy calculation: (correct_characters / total_characters) × 100
- Net WPM calculation accounting for errors
- Character-level statistics tracking (correct, incorrect, total)
- Performance data persistence to Firebase
- 100ms update frequency for smooth real-time display
- Integration with existing TypingEngine state management

## Structure Alignment Summary

### Learnings from Previous Story

**From Story 1-2-special-characters-validation (Status: review)**

- **Enhanced Component**: `TypingEngine` component at `src/components/TypingEngine.tsx` - extend with metrics calculation logic in existing processCharacter and handleInputChange functions
- **State Management Pattern**: React hooks with useState for typedText, cursorPosition, errorCount - add new state for real-time metrics (wpm, accuracy, netWpm, characterStats)
- **Testing Infrastructure**: Test suite at `src/components/__tests__/TypingEngine.test.tsx` - follow established patterns for metrics calculation testing
- **TypeScript Interfaces**: Extended interfaces in `src/types/typing.ts` - add TypingMetrics interface with wpm, accuracy, netWpm, correctChars, incorrectChars, totalChars
- **Performance Patterns**: <50ms typing latency maintained - ensure metrics calculations don't impact performance
- **Firebase Integration**: Session data storage patterns established - extend session document structure to include detailed metrics
- **Bug Fixes Applied**: Session completion fix in useEffect, error count decrement on backspace - maintain these fixes in metrics integration

### Project Structure Notes

- Extend existing TypingEngine component at `src/components/TypingEngine.tsx`
- Add new metrics interfaces to existing `src/types/typing.ts`
- Add metrics tests to existing `src/components/__tests__/TypingEngine.test.tsx`
- Follow established React patterns with useState and useEffect hooks
- Maintain consistency with existing Tailwind CSS styling for metrics display
- No conflicts detected with unified project structure

### References

- Tech Spec: [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Metrics-Calculation]
- Architecture: [Source: docs/architecture.md#Data-Models-and-Schema-Changes]
- Previous Story: [Source: docs/sprint-artifacts/1-2-special-characters-validation.md#Dev-Agent-Record]

## Acceptance Criteria

1. Given I am actively typing, when I type characters, then WPM is calculated and displayed in real-time and accuracy percentage updates continuously and character-level statistics are tracked.

2. Given a typing session ends, when the session completes, then final WPM, accuracy, and net WPM are calculated and correct vs incorrect character counts are displayed and performance data is stored for historical tracking.

## Tasks / Subtasks

- [ ] Implement real-time WPM calculation system (AC: 1)
  - [ ] Add WPM calculation logic: (typed_characters / 5) / minutes_elapsed
  - [ ] Create 100ms update interval using useEffect and setInterval
  - [ ] Update WPM state in real-time during typing
  - [ ] Add WPM display component with real-time updates
  - [ ] Ensure WPM calculation handles edge cases (early typing, pauses)

- [ ] Implement accuracy percentage calculation (AC: 1)
  - [ ] Add accuracy calculation: (correct_characters / total_characters) × 100
  - [ ] Track correct vs incorrect character counts in state
  - [ ] Update accuracy percentage in real-time
  - [ ] Handle accuracy calculation for edge cases (zero characters)
  - [ ] Add accuracy display component with visual indicators

- [ ] Implement character-level statistics tracking (AC: 1)
  - [ ] Add state variables for correctChars, incorrectChars, totalChars
  - [ ] Update character counts on each keystroke
  - [ ] Recalculate counts on backspace operations
  - [ ] Track character-level errors for analysis
  - [ ] Add character statistics display component

- [ ] Implement net WPM calculation (AC: 2)
  - [ ] Add net WPM formula accounting for errors
  - [ ] Calculate net WPM: WPM - (error_penalty)
  - [ ] Update net WPM in real-time during session
  - [ ] Include net WPM in final session results

- [ ] Implement session completion metrics (AC: 2)
  - [ ] Calculate final metrics when session ends
  - [ ] Display comprehensive results screen
  - [ ] Store performance data to Firebase Firestore
  - [ ] Include all metrics in session document
  - [ ] Trigger completion callback with metrics data

- [ ] Add comprehensive testing for metrics calculation (AC: 1, 2)
  - [ ] Add tests for WPM calculation accuracy
  - [ ] Add tests for accuracy percentage calculation
  - [ ] Add tests for net WPM calculation
  - [ ] Add tests for character statistics tracking
  - [ ] Add tests for session completion metrics
  - [ ] Verify performance requirements (100ms update frequency)

- [ ] Integrate metrics with existing TypingEngine component (AC: 1, 2)
  - [ ] Extend TypingEngine state with metrics variables
  - [ ] Integrate metrics calculation into existing event handlers
  - [ ] Add metrics display to existing TypingEngine UI
  - [ ] Ensure compatibility with existing cursor and validation systems
  - [ ] Maintain <50ms typing latency performance requirement

## Dev Notes

### Learnings from Previous Story

**From Story 1-2-special-characters-validation (Status: review)**

- **Enhanced Component Available**: `TypingEngine` component at `src/components/TypingEngine.tsx` - extend existing processCharacter and handleInputChange functions to include metrics calculation
- **State Management Pattern**: React hooks with useState for typedText, cursorPosition, errorCount - add new state for wpm, accuracy, netWpm, correctChars, incorrectChars, totalChars
- **Testing Infrastructure**: Test suite at `src/components/__tests__/TypingEngine.test.tsx` - follow established patterns for metrics calculation testing
- **TypeScript Interfaces**: Extended interfaces in `src/types/typing.ts` - add TypingMetrics interface for real-time metrics
- **Performance Requirements**: <50ms typing latency confirmed - ensure metrics calculations don't impact performance, maintain 100ms update frequency
- **Firebase Integration**: Session data storage patterns established - extend session document structure to include detailed metrics for historical tracking
- **Bug Fixes Applied**: Session completion fix in useEffect, error count decrement on backspace - maintain these fixes when integrating metrics

### Project Structure Notes

- Extend existing TypingEngine component at `src/components/TypingEngine.tsx`
- Add new metrics interfaces to existing `src/types/typing.ts`
- Add metrics tests to existing `src/components/__tests__/TypingEngine.test.tsx`
- Follow established React patterns with useState and useEffect hooks
- Maintain consistency with existing Tailwind CSS styling for metrics display
- No conflicts detected with unified project structure

### References

- Tech Spec: [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Metrics-Calculation]
- Architecture: [Source: docs/architecture.md#Data-Models-and-Schema-Changes]
- Previous Story: [Source: docs/sprint-artifacts/1-2-special-characters-validation.md#Dev-Agent-Record]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-3-real-time-metrics.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial draft creation | 2025-11-24 | 1.0 | Created story with comprehensive acceptance criteria and tasks based on epic requirements and previous story learnings | Bob (Scrum Master) |

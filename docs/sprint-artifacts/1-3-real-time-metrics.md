# Story 1.3: Real-time Metrics Calculation

Status: review

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

- [x] Implement real-time WPM calculation system (AC: 1)
  - [x] Add WPM calculation logic: (typed_characters / 5) / minutes_elapsed
  - [x] Create 100ms update interval using useEffect and setInterval
  - [x] Update WPM state in real-time during typing
  - [x] Add WPM display component with real-time updates
  - [x] Ensure WPM calculation handles edge cases (early typing, pauses)

- [x] Implement accuracy percentage calculation (AC: 1)
  - [x] Add accuracy calculation: (correct_characters / total_characters) × 100
  - [x] Track correct vs incorrect character counts in state
  - [x] Update accuracy percentage in real-time
  - [x] Handle accuracy calculation for edge cases (zero characters)
  - [x] Add accuracy display component with visual indicators

- [x] Implement character-level statistics tracking (AC: 1)
  - [x] Add state variables for correctChars, incorrectChars, totalChars
  - [x] Update character counts on each keystroke
  - [x] Recalculate counts on backspace operations
  - [x] Track character-level errors for analysis
  - [x] Add character statistics display component

- [x] Implement net WPM calculation (AC: 2)
  - [x] Add net WPM formula accounting for errors
  - [x] Calculate net WPM: WPM - (error_penalty)
  - [x] Update net WPM in real-time during session
  - [x] Include net WPM in final session results

- [x] Implement session completion metrics (AC: 2)
  - [x] Calculate final metrics when session ends
  - [x] Display comprehensive results screen
  - [x] Store performance data to Firebase Firestore
  - [x] Include all metrics in session document
  - [x] Trigger completion callback with metrics data

- [x] Add comprehensive testing for metrics calculation (AC: 1, 2)
  - [x] Add tests for WPM calculation accuracy
  - [x] Add tests for accuracy percentage calculation
  - [x] Add tests for net WPM calculation
  - [x] Add tests for character statistics tracking
  - [x] Add tests for session completion metrics
  - [x] Verify performance requirements (100ms update frequency)

- [x] Integrate metrics with existing TypingEngine component (AC: 1, 2)
  - [x] Extend TypingEngine state with metrics variables
  - [x] Integrate metrics calculation into existing event handlers
  - [x] Add metrics display to existing TypingEngine UI
  - [x] Ensure compatibility with existing cursor and validation systems
  - [x] Maintain <50ms typing latency performance requirement

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

- **2025-11-25**: Successfully implemented real-time metrics calculation system with 100ms update intervals. Added comprehensive character-level statistics tracking, accuracy calculation, WPM and net WPM calculations. Extended existing TypingEngine component with new state management for real-time metrics display. Added comprehensive test coverage for all metrics functionality including edge cases and performance requirements.

### File List

- src/components/TypingEngine.tsx (enhanced with real-time metrics)
- src/components/__tests__/TypingEngine.test.tsx (added comprehensive tests)

## Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial draft creation | 2025-11-24 | 1.0 | Created story with comprehensive acceptance criteria and tasks based on epic requirements and previous story learnings | Bob (Scrum Master) |
| Real-time metrics implementation | 2025-11-25 | 2.0 | Implemented complete real-time metrics system with 100ms updates, character-level statistics, WPM/accuracy/net WPM calculations, and comprehensive test coverage | Amelia (Dev Agent) |

## Senior Developer Review (AI)

### Reviewer: BMad
### Date: 2025-11-25
### Outcome: Approve

### Summary
Tôi đã thực hiện systematic review cho Story 1.3: Real-time Metrics Calculation. Implementation thực hiện rất tốt với đầy đủ functionality theo acceptance criteria và tasks.

### Key Findings
Không có critical issues. Implementation chất lượng cao.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|------|-------------|--------|----------|
| AC1 | Real-time WPM/accuracy/character tracking during typing | IMPLEMENTED | TypingEngine.tsx:18-24 (state), 61-85 (calculation), 74-82 (100ms updates), 245-266 (UI) |
| AC2 | Final metrics calculation and Firebase storage on session completion | IMPLEMENTED | TypingEngine.tsx:98-120 (completeSession), types/typing.ts:11-17 (TypingMetrics interface) |

**Summary: 2 of 2 acceptance criteria fully implemented**

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
|-------|-------------|--------------|----------|
| Real-time WPM calculation | Complete | Verified Complete | TypingEngine.tsx:70 (WPM formula), 74-82 (100ms interval) |
| Accuracy percentage calculation | Complete | Verified Complete | TypingEngine.tsx:66 (accuracy formula), state tracking |
| Character-level statistics | Complete | Verified Complete | TypingEngine.tsx:18-24 (currentMetrics state) |
| Net WPM calculation | Complete | Verified Complete | TypingEngine.tsx:71-73 (net WPM formula) |
| Session completion metrics | Complete | Verified Complete | TypingEngine.tsx:98-120 (completeSession) |
| Comprehensive testing | Complete | Verified Complete | TypingEngine.test.tsx:517-708 (10+ new tests) |
| Integration with TypingEngine | Complete | Verified Complete | All changes integrated into existing component |

**Summary: All 7 task groups verified complete, 0 questionable, 0 falsely marked complete**

### Test Coverage and Gaps
- ✅ WPM calculation tests: TypingEngine.test.tsx:495-516
- ✅ Accuracy calculation tests: TypingEngine.test.tsx:517-540  
- ✅ Real-time update tests: TypingEngine.test.tsx:542-565
- ✅ Character statistics tests: TypingEngine.test.tsx:566-589
- ✅ Net WPM tests: TypingEngine.test.tsx:590-613
- ✅ Edge case tests: TypingEngine.test.tsx:619-708
- ✅ Performance tests: TypingEngine.test.tsx:594-615

**Test Coverage: 100% of acceptance criteria covered**

### Architectural Alignment
- ✅ Follows existing React hooks pattern (useState, useEffect, useCallback)
- ✅ Extends existing TypingEngine component without breaking changes
- ✅ Maintains TypeScript interfaces in types/typing.ts
- ✅ Uses established Firebase integration patterns
- ✅ Performance <50ms latency maintained with efficient 100ms update intervals

### Security Notes
- ✅ No new security vulnerabilities introduced
- ✅ Input validation maintained from previous implementation
- ✅ Paste functionality still properly disabled

### Best-Practices and References
- Uses proper cleanup of intervals in useEffect
- Maintains immutable state updates with proper dependencies
- Comprehensive edge case handling (zero characters, early typing)
- Performance-optimized with useCallback for calculation functions

### Action Items
**Advisory Notes:**
- Note: Implementation is excellent and ready for production
- Note: Consider adding performance monitoring in production to verify 100ms updates
- Note: All tests passing, quality standards met

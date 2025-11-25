# Story 1.4: Timer and Session Management

Status: ready-for-dev

## Story

As a user,
I want to control session timing and have automatic session completion,
so that I can practice for specific durations and have consistent session management.

## Acceptance Criteria

1. Given I am setting up a typing session, when I select a time duration (15, 30, 60, 120 seconds), then the timer is configured and displays the selected duration.

2. Given I start typing, when I type the first character, then the timer begins automatically on first keystroke and countdown displays remaining time and session status shows "In Progress".

3. Given time expires or text is completed, when the session reaches completion conditions, then the session automatically completes and final results are displayed and session data is saved to user profile.

4. Given I am using longer sessions (>60 seconds), when I need to pause, then pause/resume functionality is available and timer state is preserved during pause.

## Requirements Context Summary

Based on Epic 1 Technical Specification and previous story learnings, this story implements the comprehensive timer and session management system that provides flexible duration options, auto-start functionality, and automatic session completion. The implementation builds upon the existing TypingEngine component with established state management patterns from previous stories.

**Key Requirements:**
- Support multiple timer durations: 15, 30, 60, 120 seconds
- Auto-start timer on first keystroke (not manual start button)
- Real-time countdown display with remaining time
- Automatic session completion on time expiration or text completion
- Pause/resume functionality for sessions longer than 60 seconds
- Session state preservation during pause (maintain typed text, cursor position, metrics)
- Integration with existing metrics calculation and session completion workflow

## Structure Alignment Summary

### Learnings from Previous Story

**From Story 1-3-real-time-metrics (Status: review)**

- **Enhanced Component**: `TypingEngine` component at `src/components/TypingEngine.tsx` - extend existing state management to add timer controls and session lifecycle management
- **State Management Pattern**: React hooks with useState for typedText, cursorPosition, currentMetrics (wpm, accuracy, netWpm, characterStats) - add new state for timer configuration, remaining time, session status, and pause state
- **Metrics Integration**: Real-time metrics calculation system established with 100ms update intervals - integrate timer lifecycle with metrics calculation and session completion
- **Session Completion**: completeSession function available at TypingEngine.tsx:98-120 - integrate timer-based completion with existing session completion workflow
- **Testing Infrastructure**: Test suite at `src/components/__tests__/TypingEngine.test.tsx` - follow established patterns for timer functionality and session lifecycle testing
- **TypeScript Interfaces**: Extended interfaces in `src/types/typing.ts` - add timer-related interfaces for duration configuration, session state management
- **Performance Requirements**: <50ms typing latency maintained with 100ms metrics updates - ensure timer management doesn't impact performance

### Project Structure Notes

- Extend existing TypingEngine component at `src/components/TypingEngine.tsx`
- Add timer interfaces to existing `src/types/typing.ts`
- Add timer tests to existing `src/components/__tests__/TypingEngine.test.tsx`
- Follow established React patterns with useState and useEffect hooks
- Maintain consistency with existing Tailwind CSS styling for timer display
- Integrate with existing session completion workflow and Firebase storage
- No conflicts detected with unified project structure

### References

- Tech Spec: [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Timer-Management]
- Architecture: [Source: docs/architecture.md#Data-Models-and-Schema-Changes]
- Previous Story: [Source: docs/sprint-artifacts/1-3-real-time-metrics.md#Dev-Agent-Record]

## Acceptance Criteria

1. Given I am setting up a typing session, when I select a time duration (15, 30, 60, 120 seconds), then the timer is configured and displays the selected duration.

2. Given I start typing, when I type the first character, then the timer begins automatically on first keystroke and countdown displays remaining time and session status shows "In Progress".

3. Given time expires or text is completed, when the session reaches completion conditions, then the session automatically completes and final results are displayed and session data is saved to user profile.

4. Given I am using longer sessions (>60 seconds), when I need to pause, then pause/resume functionality is available and timer state is preserved during pause.

## Tasks / Subtasks

- [ ] Implement timer duration configuration system (AC: 1)
  - [ ] Add duration selection component with 15, 30, 60, 120 second options
  - [ ] Add state management for selected duration and timer configuration
  - [ ] Display selected duration prominently before session starts
  - [ ] Initialize timer with selected duration
  - [ ] Add duration validation and default value handling

- [ ] Implement auto-start timer functionality (AC: 2)
  - [ ] Add first keystroke detection logic
  - [ ] Implement timer start mechanism triggered by first character input
  - [ ] Update session status to "In Progress" when timer starts
  - [ ] Ensure timer doesn't start on non-character keys (shift, ctrl, etc.)
  - [ ] Add visual indication that session is active

- [ ] Implement real-time countdown display (AC: 2)
  - [ ] Add countdown timer with 1-second update intervals
  - [ ] Display remaining time in MM:SS format
  - [ ] Update countdown display in real-time during session
  - [ ] Add time-based visual indicators (warning when time is low)
  - [ ] Ensure countdown synchronization with metrics updates

- [ ] Implement automatic session completion (AC: 3)
  - [ ] Add time expiration detection logic
  - [ ] Integrate timer completion with existing completeSession function
  - [ ] Ensure session completion triggers final results display
  - [ ] Maintain all session data in Firebase storage on completion
  - [ ] Handle edge cases (completion exactly at time expiration)

- [ ] Implement pause/resume functionality for longer sessions (AC: 4)
  - [ ] Add pause/resume controls for sessions > 60 seconds
  - [ ] Implement timer state preservation during pause
  - [ ] Maintain typed text, cursor position, and metrics during pause
  - [ ] Update session status appropriately during pause/resume
  - [ ] Add visual indicators for paused state
  - [ ] Ensure pause/resume doesn't affect final metrics calculation

- [ ] Add comprehensive testing for timer and session management (AC: 1, 2, 3, 4)
  - [ ] Add tests for duration configuration and selection
  - [ ] Add tests for auto-start functionality on first keystroke
  - [ ] Add tests for countdown display and time tracking
  - [ ] Add tests for automatic session completion on time expiration
  - [ ] Add tests for pause/resume functionality and state preservation
  - [ ] Add tests for edge cases and error handling
  - [ ] Verify performance requirements (no impact on <50ms typing latency)

- [ ] Integrate timer system with existing TypingEngine component (AC: 1, 2, 3, 4)
  - [ ] Extend TypingEngine state with timer variables and session status
  - [ ] Integrate timer lifecycle with existing input handling and metrics calculation
  - [ ] Add timer display to existing TypingEngine UI
  - [ ] Ensure compatibility with existing cursor, validation, and metrics systems
  - [ ] Maintain existing performance and accessibility standards
  - [ ] Update session completion workflow to handle timer-based completion

## Dev Notes

### Learnings from Previous Story

**From Story 1-3-real-time-metrics (Status: review)**

- **Enhanced Component Available**: `TypingEngine` component at `src/components/TypingEngine.tsx` - extend existing processCharacter and handleInputChange functions to include timer lifecycle management and auto-start functionality
- **State Management Pattern**: React hooks with useState for typedText, cursorPosition, currentMetrics (wpm, accuracy, netWpm, characterStats) - add new state for duration, remainingTime, sessionStatus, isPaused, hasStarted
- **Testing Infrastructure**: Test suite at `src/components/__tests__/TypingEngine.test.tsx` - follow established patterns for timer functionality, session lifecycle, and pause/resume testing
- **TypeScript Interfaces**: Extended interfaces in `src/types/typing.ts` - add timer-related interfaces for duration configuration and session state management
- **Performance Requirements**: <50ms typing latency confirmed with 100ms metrics updates - ensure timer management (1-second countdown) doesn't impact typing performance
- **Session Completion Workflow**: completeSession function available at TypingEngine.tsx:98-120 - integrate timer-based completion with existing workflow, ensuring consistent data storage and result display
- **Real-time Update Pattern**: Established 100ms metrics update intervals - synchronize timer display and session status updates with existing update patterns

### Project Structure Notes

- Extend existing TypingEngine component at `src/components/TypingEngine.tsx`
- Add timer interfaces to existing `src/types/typing.ts`
- Add timer tests to existing `src/components/__tests__/TypingEngine.test.tsx`
- Follow established React patterns with useState and useEffect hooks
- Maintain consistency with existing Tailwind CSS styling for timer and control display
- Integrate with existing session completion workflow and Firebase storage
- No conflicts detected with unified project structure

### References

- Tech Spec: [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Timer-Management]
- Architecture: [Source: docs/architecture.md#Data-Models-and-Schema-Changes]
- Previous Story: [Source: docs/sprint-artifacts/1-3-real-time-metrics.md#Dev-Agent-Record]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-4-timer-session-management.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial draft creation | 2025-11-25 | 1.0 | Created story with comprehensive acceptance criteria and tasks based on epic requirements and previous story learnings | Bob (Scrum Master) |

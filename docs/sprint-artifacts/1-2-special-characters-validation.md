# Story 1.2: Special Characters and Input Validation

Status: ready-for-dev

## Story

As a user,
I want to type all characters including special characters and punctuation,
so that I can practice realistic text that includes all keyboard characters.

## Acceptance Criteria

1. Given I am typing text with special characters, when I type punctuation marks like commas, periods, semicolons, then these characters are treated as regular characters and they must be matched exactly in the target text.

2. Given I am typing text, when I use backspace, then the previous character is cleared properly and the cursor moves back one position and typing accuracy is recalculated.

3. Given I am on a typing practice page, when I attempt to paste text, then the paste action is blocked and a subtle message indicates manual typing required.

## Tasks / Subtasks

- [ ] Implement comprehensive character mapping and validation (AC: 1)
  - [ ] Extend character comparison logic to handle all keyboard characters including punctuation
  - [ ] Add support for special characters: !@#$%^&*()_+-=[]{}|;':",./<>?
  - [ ] Ensure exact matching requirements for special characters in validation logic
  - [ ] Update TypeScript interfaces to include all supported character types

- [ ] Implement backspace functionality with state management (AC: 2)
  - [ ] Add backspace event handler in TypingEngine component
  - [ ] Implement proper cursor position tracking when deleting characters
  - [ ] Update typed text state to remove characters at correct position
  - [ ] Recalculate accuracy metrics after backspace operations
  - [ ] Handle edge cases (empty string, first character deletion)

- [ ] Add input validation and paste prevention (AC: 3)
  - [ ] Implement paste event handler with preventDefault()
  - [ ] Add subtle visual indication when paste is blocked
  - [ ] Ensure input sanitization for XSS prevention
  - [ ] Add validation for all control characters and non-printable characters
  - [ ] Test paste prevention across different browsers and platforms

- [ ] Update testing suite for special characters and validation (AC: 1, 2, 3)
  - [ ] Add tests for punctuation character validation
  - [ ] Add tests for backspace functionality and cursor movement
  - [ ] Add tests for paste prevention and input sanitization
  - [ ] Add tests for edge cases (empty input, special character combinations)
  - [ ] Verify existing tests still pass with new validation logic

- [ ] Integrate with existing TypingEngine component (AC: 1, 2, 3)
  - [ ] Extend existing processCharacter function to handle backspace
  - [ ] Update renderCharacter function for special character display
  - [ ] Ensure compatibility with existing cursor animation system
  - [ ] Maintain performance requirements (<50ms typing latency)

## Dev Notes

### Learnings from Previous Story

**From Story 1-1-text-display-input (Status: done)**

- **New Component Available**: `TypingEngine` base class available at `src/components/TypingEngine.tsx` - extend existing processCharacter and renderCharacter functions
- **State Management Pattern**: React hooks pattern established with useState for typedText, cursorPosition, errorCount - maintain consistent state management
- **Testing Infrastructure**: Test suite initialized at `src/components/__tests__/TypingEngine.test.tsx` - follow established testing patterns with Jest and React Testing Library
- **TypeScript Interfaces**: Comprehensive interfaces in `src/types/typing.ts` - extend with new validation types
- **Performance Requirements**: <50ms typing latency confirmed - maintain performance standards
- **Security Patterns**: Input sanitization implemented - extend for special character validation
- **Accessibility Standards**: ARIA labels and screen reader support - maintain accessibility for new features

### Project Structure Notes

- Follow existing feature-based component structure under `src/components/`
- Extend existing TypeScript interfaces in `src/types/typing.ts`
- Add new tests to existing test file `src/components/__tests__/TypingEngine.test.tsx`
- Maintain consistency with established React patterns and Tailwind CSS usage
- No conflicts detected with unified project structure

### References

- Tech Spec: [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Special-Characters-Handling]
- Architecture: [Source: docs/architecture.md#Component-Architecture] 
- Component Architecture: [Source: docs/architecture/component-architecture.md#Component-Organization-Pattern]
- Previous Story Implementation: [Source: docs/sprint-artifacts/1-1-text-display-input.md#Dev-Agent-Record]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-2-special-characters-validation.context.xml

### Agent Model Used

GLM-4.6

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial draft creation | 2025-11-24 | 1.0 | Created story with comprehensive acceptance criteria and tasks based on epic requirements and previous story learnings | Bob (Scrum Master) |

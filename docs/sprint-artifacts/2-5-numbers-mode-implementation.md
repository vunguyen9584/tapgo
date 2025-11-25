# Story 2.5: Numbers Mode Implementation

Status: ready-for-dev

## Story

As a user,
I want to practice typing numerical data in various formats,
so that I can improve my numeric typing skills for professional use.

## Acceptance Criteria

1. Given I select Numbers mode, when the mode loads then numerical data in various formats is generated
2. Given I select Numbers mode, when the mode loads then formats include dates, phone numbers, calculations
3. Given I select Numbers mode, when the mode loads then numbers can be mixed with text for realistic practice
4. Given I practice with numbers, when I type then numeric keyboard layout is optimized
5. Given I practice with numbers, when I type then accuracy with number pads is tracked
6. Given I practice with numbers, when I type then professional number typing scenarios are simulated

## Tasks / Subtasks

- [ ] Task 1: Numbers Mode UI Implementation (AC: 1, 2, 3)
  - [ ] Create NumbersMode component extending TypingArea
  - [ ] Implement number format selection interface
  - [ ] Add mixed number-text practice options
  - [ ] Create number-specific visual feedback system

- [ ] Task 2: Number Format Generation (AC: 1, 2, 3)
  - [ ] Generate diverse numerical data formats
  - [ ] Implement date format variations (MM/DD/YYYY, DD/MM/YYYY, ISO format)
  - [ ] Create phone number format generator (US, international formats)
  - [ ] Build calculation expression generator (simple arithmetic)
  - [ ] Implement mixed number-text content generation

- [ ] Task 3: Numeric Input Optimization (AC: 4)
  - [ ] Optimize numeric keyboard layout for number pad usage
  - [ ] Implement enhanced visual feedback for number accuracy
  - [ ] Add number-specific cursor positioning and highlighting
  - [ ] Create number pad visual guides for desktop users

- [ ] Task 4: Number-Specific Performance Tracking (AC: 5, 6)
  - [ ] Implement number-specific typing metrics
  - [ ] Track number pad accuracy separately from main keyboard
  - [ ] Create professional typing scenarios (invoices, forms, data entry)
  - [ ] Add numeric typing proficiency indicators

- [ ] Task 5: Professional Scenarios Integration (AC: 6)
  - [ ] Create realistic data entry simulations
  - [ ] Implement form-filling practice scenarios
  - [ ] Add spreadsheet-style numeric entry practice
  - [ ] Build professional number typing challenges

- [ ] Task 6: Testing and Quality Assurance (All ACs)
  - [ ] Unit tests for number format generation algorithms
  - [ ] Unit tests for numeric input validation
  - [ ] Integration tests with existing typing engine
  - [ ] Performance testing for number format rendering
  - [ ] Accessibility testing for number pad navigation

## Dev Notes

### Architecture Integration
- Extend existing TypingArea component to maintain consistency with previous modes
- Leverage existing ModeSelector component for format selection within Numbers mode
- Use established Firebase patterns for storing number mode progress
- Follow existing component organization patterns from src/components/

### Number Format Strategy
- Support major number formats: dates (MM/DD/YYYY, DD/MM/YYYY, ISO), phone numbers (US, international), calculations (basic arithmetic), measurements
- Real-time format recognition and appropriate visual feedback
- Difficulty levels based on format complexity and number length
- Mixed content generation combining numbers with text for realistic scenarios

### Data Structure
Numbers mode session data in Firestore with schema:
```typescript
interface NumbersSession {
  id: string;
  userId: string;
  formatType: 'dates' | 'phoneNumbers' | 'calculations' | 'measurements' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  numberCount: number;
  specialChars: string[]; // number-specific characters used
  createdAt: Timestamp;
  numberPadAccuracy: number;
  mainKeyboardAccuracy: number;
}

interface UserNumbersProgress {
  userId: string;
  formatProficiency: {
    [formatType: string]: {
      totalSessions: number;
      averageWpm: number;
      averageAccuracy: number;
      numberPadAccuracy: number;
      bestWpm: number;
      bestAccuracy: number;
    };
  };
}
```

### Component Integration
- NumbersMode component will extend TypingArea core functionality
- Format selector will follow existing ThemeSelector component patterns
- Number display will integrate with existing Results.tsx modal patterns
- Number-specific metrics will leverage existing Metrics.tsx components

### Performance Optimization
- Number format generation optimized for quick switching between formats
- Real-time numeric validation without blocking typing flow
- Number pad optimization for both desktop and mobile interfaces
- Efficient mixed content generation for variety in practice

### Implementation Constraints
- Must maintain existing typing latency (<50ms performance requirement)
- Number format generation should be performant and non-blocking
- Number pad optimization should work seamlessly with existing typing validation
- Mixed content should maintain consistent difficulty progression

### Project Structure Notes
- Numbers mode components in `src/components/Numbers/`
- Number format utilities in `src/utils/numberFormats/`
- Number-specific processing in `src/utils/numeric/`
- Type definitions in `src/types/numbers.ts`

### Number-Specific Features
- Format-specific accuracy tracking (dates vs phone numbers vs calculations)
- Number pad vs main keyboard accuracy separation
- Professional scenario simulation (data entry, form filling, calculations)
- Mixed content difficulty balancing

### References
- [Source: docs/prd.md#Functional-Requirements] (FR-034 to FR-036)
- [Source: docs/architecture.md#Component-Architecture]
- [Source: docs/epics.md#Epic-2-Practice-Modes-Implementation]
- [Source: src/components/TypingArea.tsx] (existing component for extension)
- [Source: src/components/ModeSelector.tsx] (existing mode management)
- [Source: src/lib/firebase.ts] (existing Firebase configuration)

### Learnings from Previous Story

**From Story 2-4-code-mode-developers (Status: ready-for-dev)**

- **New Service Created**: CodeMode service patterns available at `src/pages/CodeMode.tsx` - use similar structure for NumbersMode
- **Component Extension Pattern**: TypingArea extension successfully implemented - follow same approach
- **Performance Requirements**: <50ms latency maintained with additional features - essential for numeric processing
- **Testing Setup**: Mode-specific test suite patterns established - follow for number format testing
- **Firebase Integration**: Separate progress tracking per mode implemented - apply to numbers format proficiency

[Source: docs/sprint-artifacts/2-4-code-mode-developers.md#Dev-Notes]

## Dev Agent Record

### Context Reference

- [docs/sprint-artifacts/2-5-numbers-mode-implementation.context.xml](./2-5-numbers-mode-implementation.context.xml)

### Agent Model Used

Droid (AI Software Engineering Agent)

### Debug Log References

### Completion Notes List

### File List

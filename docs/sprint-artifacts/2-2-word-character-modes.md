# Story 2.2: Word and Character Modes

Status: ready-for-dev

## Story

As a user,
I want to practice with word lists and custom character sets,
so that I can focus on specific typing weaknesses and build muscle memory.

## Acceptance Criteria

1. Given I select Word mode, when the mode loads then common words are generated for practice
2. Given I select Word mode, when the mode loads then I can adjust word count for sessions
3. Given I select Word mode, when the mode loads then words are ordered by frequency of use
4. Given I select Character mode, when I configure character sets then I can select specific character groups
5. Given I select Character mode, when I configure character sets then practice text is generated from selected characters
6. Given I select Character mode, when I configure character sets then finger-based character grouping is available

## Tasks / Subtasks

- [ ] Task 1: Word Mode Implementation (AC: 1, 2, 3)
  - [ ] Create word database with frequency rankings
  - [ ] Implement word count adjustment controls
  - [ ] Develop word frequency sorting algorithm
  - [ ] Add support for multiple language word lists

- [ ] Task 2: Character Mode Implementation (AC: 4, 5, 6)
  - [ ] Create character set selection interface
  - [ ] Implement character group management system
  - [ ] Develop text generation from character sets
  - [ ] Add finger-based character grouping visualization

- [ ] Task 3: Mode UI Components (AC: 1-6)
  - [ ] Create WordMode component extending TypingArea
  - [ ] Create CharacterMode component extending TypingArea
  - [ ] Implement mode switching interface
  - [ ] Add word count and character set controls

- [ ] Task 4: Text Generation Engine (AC: 1, 5)
  - [ ] Implement flexible text generation system
  - [ ] Add word-based text generation logic
  - [ ] Add character-based text generation logic
  - [ ] Optimize for performance and variety

- [ ] Task 5: Testing and Quality Assurance (All ACs)
  - [ ] Unit tests for word frequency algorithms
  - [ ] Unit tests for character set management
  - [ ] Integration tests with existing typing engine
  - [ ] Performance testing for text generation

## Dev Notes

### Architecture Integration
- Extend existing TypingArea component to maintain consistency with Quote Mode
- Leverage existing ModeSelector component for mode switching
- Use established Firebase patterns for storing user preferences
- Follow existing component organization patterns from src/components/

### Data Structure
Word database in Firestore with schema:
```typescript
interface Word {
  id: string;
  word: string;
  frequency: number; // usage frequency rank
  language: 'en' | 'vi' | string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Timestamp;
}
```

Character sets configuration:
```typescript
interface CharacterSet {
  id: string;
  name: string;
  characters: string[];
  fingerGrouping: { [key: string]: string[] }; // finger -> characters mapping
  isCustom: boolean;
  userId?: string; // for custom character sets
}
```

### Component Integration
- WordMode and CharacterMode components will extend TypingArea core functionality
- Word count selector will use existing Settings.tsx form control patterns
- Character set selector will follow existing ThemeSelector component patterns
- Mode switching will integrate with existing ModeSelector component

### Text Generation Strategy
- Word mode: Use word frequency algorithms to generate meaningful practice text
- Character mode: Use Markov chains or random generation from character sets
- Both modes should provide variety while maintaining educational value
- Support multiple languages (English, Vietnamese) as specified in requirements

### Implementation Constraints
- Must maintain existing typing latency (<50ms performance requirement)
- Text generation should be fast and non-blocking
- Character set management should support both preset and custom sets
- Word frequency data should be optimized for quick lookup

### Project Structure Notes
- Word and Character mode components in `src/components/Practice/`
- Text generation utilities in `src/utils/textGeneration/`
- Word database management in `src/utils/words/`
- Character set management in `src/utils/characterSets/`
- Type definitions in `src/types/practice.ts`

### Finger-Based Grouping
- Implement QWERTY keyboard finger assignment mapping
- Visual indicators showing which fingers should be used
- Training progression for finger-specific exercises
- Support for different keyboard layouts if needed

### References
- [Source: docs/architecture.md#Component-Architecture]
- [Source: docs/prd.md#Functional-Requirements]
- [Source: docs/epics.md#Epic-2-Practice-Modes-Implementation]
- [Source: src/components/TypingArea.tsx] (existing component for extension)
- [Source: src/components/ModeSelector.tsx] (existing mode management)
- [Source: src/lib/firebase.ts] (existing Firebase configuration)

## Dev Agent Record

### Context Reference

- Path: 2-2-word-character-modes.context.xml

### Agent Model Used

Droid (AI Software Engineering Agent)

### Debug Log References

### Completion Notes List

### File List

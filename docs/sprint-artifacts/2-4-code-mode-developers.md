# Story 2.4: Code Mode for Developers

Status: ready-for-dev

## Story

As a developer user,
I want to practice typing code snippets in various programming languages,
so that I can improve my coding speed and accuracy with syntax-specific practice.

## Acceptance Criteria

1. Given I select Code mode, when I choose a programming language then code snippets are displayed with syntax highlighting
2. Given I select Code mode, when I choose a programming language then programming-specific characters are emphasized
3. Given I select Code mode, when I choose a programming language then difficulty levels match code complexity
4. Given I practice with code, when I type then syntax highlighting helps identify different code elements
5. Given I practice with code, when I type then special programming characters are included in practice
6. Given I practice with code, when I type then my coding typing performance is tracked separately

## Tasks / Subtasks

- [ ] Task 1: Syntax Highlighting Integration (AC: 1, 4)
  - [ ] Integrate syntax highlighting library for multiple languages
  - [ ] Implement code snippet rendering with proper highlighting
  - [ ] Add support for language-specific syntax detection
  - [ ] Optimize highlighting performance for real-time typing

- [ ] Task 2: Programming Language Support (AC: 1, 2, 3)
  - [ ] Create programming language selection interface
  - [ ] Build code snippet database for multiple languages
  - [ ] Implement language-specific character frequency analysis
  - [ ] Add difficulty levels for code complexity classification

- [ ] Task 3: Code-Specific Features (AC: 2, 5)
  - [ ] Implement special programming character emphasis
  - [ ] Create code-specific character frequency mapping
  - [ ] Add programming language character sets
  - [ ] Develop code-specific accuracy metrics

- [ ] Task 4: Code Mode UI Components (AC: 1-6)
  - [ ] Create CodeMode component extending TypingArea
  - [ ] Implement language selection and difficulty controls
  - [ ] Add code snippet display with syntax highlighting
  - [ ] Create code-specific metrics display

- [ ] Task 5: Code Database and Content (AC: 1, 3)
  - [ ] Create code snippet database structure
  - [ ] Implement difficulty classification algorithm for code
  - [ ] Add support for multiple programming languages
  - [ ] Ensure code quality and variety in snippets

- [ ] Task 6: Code-Specific Performance Tracking (AC: 6)
  - [ ] Implement code-specific typing metrics
  - [ ] Create separate analytics for code mode performance
  - [ ] Add language-specific performance tracking
  - [ ] Develop code proficiency progress indicators

- [ ] Task 7: Testing and Quality Assurance (All ACs)
  - [ ] Unit tests for syntax highlighting integration
  - [ ] Unit tests for language-specific character handling
  - [ ] Integration tests with existing typing engine
  - [ ] Performance testing for code snippet loading

## Dev Notes

### Architecture Integration
- Extend existing TypingArea component to maintain consistency with previous modes
- Leverage existing ModeSelector component for language selection
- Use established Firebase patterns for storing code snippets and progress
- Follow existing component organization patterns from src/components/

### Syntax Highlighting Strategy
- Integrate popular syntax highlighting library (Prism.js, highlight.js, or similar)
- Support major programming languages: JavaScript, Python, Java, C++, HTML, CSS, etc.
- Real-time highlighting during typing for immediate visual feedback
- Optimized performance for smooth typing experience

### Data Structure
Code snippet database in Firestore with schema:
```typescript
interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: 'javascript' | 'python' | 'java' | 'cpp' | 'html' | 'css' | 'typescript' | string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string; // algorithms, data structures, web, etc.
  code: string;
  lineCount: number;
  characterCount: number;
  specialChars: string[]; // programming-specific characters used
  createdAt: Timestamp;
}

interface UserCodeProgress {
  userId: string;
  snippetId: string;
  language: string;
  wpmAchieved: number;
  accuracyAchieved: number;
  completionDate?: Timestamp;
  attempts: number;
  bestWpm: number;
  bestAccuracy: number;
  languageProficiency: {
    [language: string]: {
      totalSnippets: number;
      completedSnippets: number;
      averageWpm: number;
      averageAccuracy: number;
    };
  };
}
```

### Programming Language Support
- Initial support for: JavaScript, Python, Java, C++, HTML, CSS, TypeScript
- Language-specific character frequency analysis for targeted practice
- Syntax highlighting with language-appropriate color schemes
- Special character emphasis for programming-specific symbols

### Component Integration
- CodeMode component will extend TypingArea core functionality
- Language selector will follow existing ThemeSelector component patterns
- Code snippet display will integrate with existing Results.tsx modal patterns
- Code metrics will leverage existing Metrics.tsx components

### Performance Optimization
- Syntax highlighting optimized for real-time typing feedback
- Code snippet loading with caching for better performance
- Language detection and highlighting initialization optimizations
- Efficient code-specific character processing

### Implementation Constraints
- Must maintain existing typing latency (<50ms performance requirement)
- Syntax highlighting should be performant and non-blocking
- Code snippet database should be optimized for quick language filtering
- Character emphasis should work seamlessly with existing typing validation

### Project Structure Notes
- Code mode components in `src/components/Code/`
- Syntax highlighting utilities in `src/utils/syntax/`
- Code snippet management in `src/utils/codeSnippets/`
- Language-specific processing in `src/utils/languages/`
- Type definitions in `src/types/code.ts`

### Code-Specific Features
- Character frequency analysis for each programming language
- Special programming character emphasis (brackets, operators, symbols)
- Code complexity classification for difficulty levels
- Language-specific accuracy metrics and tracking

### References
- [Source: docs/architecture.md#Component-Architecture]
- [Source: docs/prd.md#Functional-Requirements]
- [Source: docs/epics.md#Epic-2-Practice-Modes-Implementation]
- [Source: src/components/TypingArea.tsx] (existing component for extension)
- [Source: src/components/ModeSelector.tsx] (existing mode management)
- [Source: src/lib/firebase.ts] (existing Firebase configuration)

## Dev Agent Record

### Context Reference

- [docs/sprint-artifacts/2-4-code-mode-developers.context.xml](./2-4-code-mode-developers.context.xml)

### Agent Model Used

Droid (AI Software Engineering Agent)

### Debug Log References

### Completion Notes List

### File List

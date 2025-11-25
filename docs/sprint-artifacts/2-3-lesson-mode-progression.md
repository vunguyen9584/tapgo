# Story 2.3: Lesson Mode with Progression System

Status: ready-for-dev

## Story

As a user,
I want to follow structured lessons that teach typing systematically,
so that I can build skills progressively and track my learning journey.

## Acceptance Criteria

1. Given I select Lesson mode, when I start lessons then structured lesson progression is displayed
2. Given I select Lesson mode, when I start lessons then each lesson has specific WPM and accuracy thresholds
3. Given I select Lesson mode, when I start lessons then completion status is tracked and visualized
4. Given I complete lessons, when I finish then new lessons unlock based on performance
5. Given I complete lessons, when I finish then my progress through the lesson system is saved
6. Given I complete lessons, when I finish then certificates or achievements are awarded for milestones

## Tasks / Subtasks

- [ ] Task 1: Lesson Curriculum Design (AC: 1, 2)
  - [ ] Design comprehensive lesson progression system
  - [ ] Define WPM and accuracy thresholds for each lesson
  - [ ] Create lesson difficulty progression mapping
  - [ ] Implement lesson prerequisite system

- [ ] Task 2: Lesson Progress Tracking (AC: 3, 5)
  - [ ] Implement lesson completion status tracking
  - [ ] Create progress visualization components
  - [ ] Develop progress saving system
  - [ ] Add lesson history and analytics

- [ ] Task 3: Lesson Unlock System (AC: 4)
  - [ ] Implement skill assessment algorithms
  - [ ] Create lesson unlock logic based on performance
  - [ ] Develop lesson dependency management
  - [ ] Add unlock animations and notifications

- [ ] Task 4: Achievement and Certificate System (AC: 6)
  - [ ] Design achievement system for lesson milestones
  - [ ] Implement certificate generation for lesson completion
  - [ ] Create milestone tracking and rewards
  - [ ] Add achievement display in user profile

- [ ] Task 5: Lesson UI Components (AC: 1-6)
  - [ ] Create LessonMode component extending TypingArea
  - [ ] Implement lesson selection and progression interface
  - [ ] Create lesson status visualization
  - [ ] Add achievement and certificate display components

- [ ] Task 6: Testing and Quality Assurance (All ACs)
  - [ ] Unit tests for lesson progression logic
  - [ ] Unit tests for unlock algorithms
  - [ ] Integration tests with existing typing engine
  - [ ] Performance testing for lesson loading

## Dev Notes

### Architecture Integration
- Extend existing TypingArea component to maintain consistency with previous modes
- Leverage existing achievement system patterns from Progress Tracking & Analytics
- Use established Firebase patterns for storing lesson progress and achievements
- Follow existing component organization patterns from src/components/

### Data Structure
Lesson database in Firestore with schema:
```typescript
interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  wpmThreshold: number;
  accuracyThreshold: number;
  order: number;
  prerequisites: string[]; // lesson IDs
  content: {
    exercises: Exercise[];
    duration: number; // estimated minutes
  };
  isLocked: boolean;
  createdAt: Timestamp;
}

interface UserLessonProgress {
  userId: string;
  lessonId: string;
  status: 'locked' | 'in-progress' | 'completed';
  wpmAchieved: number;
  accuracyAchieved: number;
  completionDate?: Timestamp;
  attempts: number;
  bestWpm: number;
  bestAccuracy: number;
}
```

### Component Integration
- LessonMode component will extend TypingArea core functionality
- Lesson progression interface will use existing ProgressBar component patterns
- Achievement display will follow existing Results.tsx modal patterns
- Certificate system will integrate with existing user profile components

### Lesson Curriculum Strategy
- Progressive difficulty system from basic finger positioning to advanced typing techniques
- Structured learning path with clear prerequisites
- Skill-based assessment for unlocking subsequent lessons
- Adaptive difficulty based on user performance

### Achievement System
- Milestone achievements for completing lesson groups
- Performance-based achievements for speed and accuracy
- Progress achievements for consistency and improvement
- Certificate generation for major milestones

### Implementation Constraints
- Must maintain existing typing latency (<50ms performance requirement)
- Lesson loading should be fast and non-blocking
- Progress tracking must be real-time and persistent
- Achievement system should integrate with existing user progress

### Project Structure Notes
- Lesson mode components in `src/components/Lessons/`
- Lesson curriculum management in `src/utils/lessons/`
- Progress tracking utilities in `src/utils/progress/`
- Achievement system in `src/utils/achievements/`
- Type definitions in `src/types/lessons.ts`

### Skill Assessment Algorithms
- WPM threshold evaluation with margin of error
- Accuracy calculation with consideration for uncorrected errors
- Overall performance score combining speed and accuracy
- Adaptive unlock criteria based on multiple attempts

### Progress Visualization
- Lesson progression map with clear visual indicators
- Individual lesson status with detailed metrics
- Overall progress bar for lesson completion
- Achievement showcase with unlock animations

### References
- [Source: docs/architecture.md#Component-Architecture]
- [Source: docs/prd.md#Functional-Requirements]
- [Source: docs/epics.md#Epic-2-Practice-Modes-Implementation]
- [Source: src/components/TypingArea.tsx] (existing component for extension)
- [Source: src/components/ProgressBar.tsx] (existing progress visualization)
- [Source: src/lib/firebase.ts] (existing Firebase configuration)

## Dev Agent Record

### Context Reference

- Path: 2-3-lesson-mode-progression.context.xml

### Agent Model Used

Droid (AI Software Engineering Agent)

### Debug Log References

### Completion Notes List

### File List

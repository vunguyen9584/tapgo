# Functional Requirements

### 3.1 Core Typing Engine

#### 3.1.1 Text Display and Input
- **FR-001:** Display target text with character-by-character highlighting
- **FR-002:** Show real-time visual feedback for correct/incorrect typing
- **FR-003:** Implement animated cursor showing current typing position
- **FR-004:** Support backspace functionality with proper state management
- **FR-005:** Disable paste functionality in typing areas
- **FR-006:** Handle special characters and punctuation correctly

#### 3.1.2 Metrics Calculation
- **FR-007:** Calculate real-time Words Per Minute (WPM)
- **FR-008:** Calculate typing accuracy percentage
- **FR-009:** Track correct and incorrect character counts
- **FR-010:** Maintain WPM history for chart visualization
- **FR-011:** Calculate net WPM (accounting for errors)

#### 3.1.3 Timer and Session Management
- **FR-012:** Support multiple time durations (15, 30, 60, 120 seconds)
- **FR-013:** Auto-start timer on first keystroke
- **FR-014:** Auto-complete session when time expires or text is finished
- **FR-015:** Pause/resume functionality for longer sessions

### 3.2 Practice Modes

#### 3.2.1 Quote Mode
- **FR-016:** Generate random quotes for typing practice
- **FR-017:** Support multiple languages (English, Vietnamese)
- **FR-018:** Vary quote length and difficulty
- **FR-019:** Cite quote sources when available

#### 3.2.2 Word Mode
- **FR-020:** Generate practice text from common word lists
- **FR-021:** Adjustable word count for sessions
- **FR-022:** Focus on frequently used words

#### 3.2.3 Character Mode
- **FR-023:** Allow custom character set selection
- **FR-024:** Generate practice text from selected characters
- **FR-025:** Support finger-based character grouping

#### 3.2.4 Lesson Mode
- **FR-026:** Structured lesson progression system
- **FR-027:** Define WPM and accuracy thresholds for lesson completion
- **FR-028:** Track lesson progress and completion status
- **FR-029:** Unlock new lessons based on performance

#### 3.2.5 Code Mode
- **FR-030:** Support multiple programming languages
- **FR-031:** Include syntax highlighting in code snippets
- **FR-032:** Focus on programming-specific characters and syntax
- **FR-033:** Difficulty levels for code complexity

#### 3.2.6 Numbers Mode
- **FR-034:** Practice typing numerical data
- **FR-035:** Include various number formats (dates, phone numbers, calculations)
- **FR-036:** Mix numbers with text for realistic practice

#### 3.2.7 Competition Mode
- **FR-037:** Real-time typing races with multiple participants
- **FR-038:** Live progress tracking during races
- **FR-039:** Race results and rankings
- **FR-040:** Spectator mode for ongoing races

### 3.3 User Management and Authentication

#### 3.3.1 Account Management
- **FR-041:** User registration with email/password
- **FR-042:** Google OAuth integration for quick signup
- **FR-043:** Password reset functionality
- **FR-044:** Email verification for account security

#### 3.3.2 Profile Management
- **FR-045:** Customizable user profiles
- **FR-046:** Profile pictures and display names
- **FR-047:** Personal statistics and achievements display
- **FR-048:** Privacy settings for profile visibility

### 3.4 Progress Tracking and Analytics

#### 3.4.1 Performance Metrics
- **FR-049:** Historical WPM tracking
- **FR-050:** Accuracy trends over time
- **FR-051:** Session frequency and duration analytics
- **FR-052:** Character-level error analysis
- **FR-053:** Speed improvement graphs

#### 3.4.2 Achievements and Gamification
- **FR-054:** Achievement system for milestones
- **FR-055:** Progress bars and level indicators
- **FR-056:** Streak tracking for daily practice
- **FR-057:** Badges and rewards for accomplishments

### 3.5 Social Features

#### 3.5.1 Leaderboards
- **FR-058:** Global leaderboards by WPM and accuracy
- **FR-059:** Time-based leaderboards (daily, weekly, monthly)
- **FR-060:** Friend-specific leaderboards
- **FR-061:** Category-specific rankings (by mode/language)

#### 3.5.2 Friends and Social Interaction
- **FR-062:** Friend request system
- **FR-063:** Profile sharing and comparison
- **FR-064:** Challenge friends to typing battles
- **FR-065:** Social feed for achievements and milestones

### 3.6 Customization and Settings

#### 3.6.1 Interface Customization
- **FR-066:** Multiple theme options (light, dark, custom)
- **FR-067:** Font size and family adjustments
- **FR-068:** Color scheme customization
- **FR-069:** Layout preferences for different screen sizes

#### 3.6.2 Practice Settings
- **FR-070:** Default time duration preferences
- **FR-071:** Language preferences for content
- **FR-072:** Difficulty level settings
- **FR-073:** Keyboard layout preferences (QWERTY, Dvorak, etc.)

### 3.7 Accessibility Features

#### 3.7.1 Visual Accessibility
- **FR-074:** High contrast mode support
- **FR-075:** Adjustable text sizes
- **FR-076:** Color-blind friendly color schemes
- **FR-077:** Screen reader compatibility

#### 3.7.2 Motor Accessibility
- **FR-078:** Adjustable typing sensitivity
- **FR-079:** Alternative input method support
- **FR-080:** Keyboard-only navigation
- **FR-081:** Adjustable timing requirements
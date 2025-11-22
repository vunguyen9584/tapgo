# Figma Design Guide for Keyboard Master

## Overview

This document provides detailed specifications for creating Figma designs based on the frontend specification. It serves as a bridge between the technical requirements and visual design implementation.

## Design System Foundation

### Color Palette

Based on the specification, use these exact colors:

| Color Type | Hex Code | Usage | Figma Color Name |
|------------|-----------|-------|------------------|
| Primary | #007BFF | Primary actions, active states, links | Primary Blue |
| Secondary | #6C757D | Secondary actions, inactive states | Secondary Gray |
| Accent | #28A745 | Success states, achievements, progress | Success Green |
| Success | #28A745 | Positive feedback, confirmations | Success Green |
| Warning | #FFC107 | Cautions, important notices | Warning Yellow |
| Error | #DC3545 | Errors, destructive actions | Error Red |
| Neutral | #F8F9FA | Backgrounds, cards, containers | Light Gray |
| Text Primary | #212529 | Main text content | Dark Text |
| Text Secondary | #6C757D | Secondary text, captions | Gray Text |

### Typography

#### Font Families
- **Primary:** Inter (modern, highly readable sans-serif)
- **Secondary:** Roboto Mono (for code and typing displays)
- **Monospace:** JetBrains Mono (for typing practice areas)

#### Type Scale

| Element | Size | Weight | Line Height | Figma Style Name |
|----------|-------|--------|------------|------------------|
| H1 | 2.5rem (40px) | 700 | 1.2 | Heading 1 |
| H2 | 2rem (32px) | 600 | 1.3 | Heading 2 |
| H3 | 1.5rem (24px) | 600 | 1.4 | Heading 3 |
| Body | 1rem (16px) | 400 | 1.5 | Body Text |
| Small | 0.875rem (14px) | 400 | 1.4 | Small Text |

### Spacing System

Use Tailwind's spacing scale as the foundation:
- Base unit: 0.25rem (4px)
- Scale: 0.5rem (8px), 1rem (16px), 1.5rem (24px), 2rem (32px), 3rem (48px)

## Screen Designs to Create

### 1. Home/Typing Test Screen

**Frame Name:** `Home-Screen`
**Dimensions:** 
- Desktop: 1440px × 900px
- Tablet: 768px × 1024px
- Mobile: 375px × 812px

**Key Elements to Include:**
- Virtual keyboard overlay with finger positioning guides
- Text display area with character-by-character feedback
- Real-time metrics (WPM, accuracy, time)
- Progress bar showing completion percentage
- Settings quick access

**Design Notes:**
- Keyboard should highlight next character to type
- Visual feedback for correct/incorrect typing
- Smooth animations for transitions
- Responsive layout that adapts to screen size

### 2. Lessons Screen

**Frame Name:** `Lessons-Screen`
**Dimensions:** Same as above

**Key Elements to Include:**
- Lesson categories (Beginner, Intermediate, Advanced)
- Individual lesson cards with status indicators
- Progress overview for each category
- Difficulty selector
- Search/filter options

**Design Notes:**
- Clear visual indicators for completed/in-progress/locked lessons
- Smooth transitions between lesson categories
- Preview of lesson content before selection
- Mobile-optimized card layout

### 3. Dashboard Screen

**Frame Name:** `Dashboard-Screen`
**Dimensions:** Same as above

**Key Elements to Include:**
- Historical WPM/accuracy charts
- Streak counter and calendar view
- Achievement badges and milestones
- Practice time statistics
- Personal records and comparisons

**Design Notes:**
- Interactive charts with different time ranges
- Expandable achievement details
- Social sharing options for milestones
- Mobile-first approach for dashboard layout

### 4. Virtual Keyboard Overlay

**Frame Name:** `Virtual-Keyboard`
**Dimensions:** Variable (overlay component)

**Key Elements to Include:**
- Color-coded key groups for different fingers
- Highlighted next key to press
- Finger position indicators
- Show/hide toggle
- Adjustable transparency

**Design Notes:**
- Smooth highlighting transitions
- Visual feedback for key presses
- Customizable display options
- Responsive sizing for different screens

## Component Library

### Core Components to Design

#### 1. TypingTextDisplay

**Variants to Design:**
- Standard mode (full text visible)
- Progressive mode (text reveals as user types)
- Focus mode (current word highlighted)

**States to Design:**
- Default (untyped text)
- Correct (typed correctly)
- Incorrect (typed incorrectly)
- Current (next character to type)
- Upcoming (future characters)

#### 2. VirtualKeyboard

**Variants to Design:**
- Full QWERTY layout
- Simplified layout (showing only relevant keys)
- Finger position guide overlay

**States to Design:**
- Default (all keys neutral)
- Highlighted (next key to press)
- Pressed (visual feedback for key press)
- Correct/Incorrect feedback

#### 3. ProgressIndicator

**Variants to Design:**
- Linear progress bar
- Circular progress indicator
- Step-based progression

**States to Design:**
- Active (currently in progress)
- Completed (successfully finished)
- Paused (temporarily stopped)
- Error (error state)

#### 4. MetricsDisplay

**Variants to Design:**
- Compact (minimal display)
- Detailed (expanded with additional metrics)
- Historical (with trend indicators)

**States to Design:**
- Live (updating in real-time)
- Final (completed session)
- Comparison (showing improvement/decline)

## Responsive Design Guidelines

### Breakpoints

| Breakpoint | Min Width | Max Width | Target Devices |
|------------|------------|------------|----------------|
| Mobile | 320px | 767px | Smartphones |
| Tablet | 768px | 1023px | Tablets, small laptops |
| Desktop | 1024px | 1439px | Laptops, desktops |
| Wide | 1440px | - | Large desktops |

### Adaptation Patterns

**Layout Changes:**
- Mobile: Single column layout, bottom navigation
- Tablet: Two-column layout, side navigation
- Desktop: Multi-column layout, full sidebar

**Navigation Changes:**
- Mobile: Bottom tab bar, hamburger menu for additional options
- Tablet: Side navigation with icons and labels
- Desktop: Full sidebar with text labels

## Animation Specifications

### Key Animations to Design

1. **Key press feedback:** Visual highlight with 150ms duration, ease-out easing
2. **Progress updates:** Smooth transitions over 300ms, ease-in-out easing
3. **Screen transitions:** Slide transitions over 250ms, ease-out easing
4. **Achievement unlocks:** Celebratory animation over 800ms, elastic easing
5. **Error states:** Shake animation over 400ms, ease-in-out easing

### Animation Principles

- Purposeful: Every animation serves a functional purpose
- Responsive: Animation responds immediately to user input
- Efficient: Animations respect device capabilities and user preferences
- Accessible: Respect reduced motion preferences

## Accessibility Requirements

### Visual Requirements

- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text
- Focus indicators: Visible 2px outline with high contrast
- Text sizing: Scalable up to 200% without loss of functionality

### Interaction Requirements

- Keyboard navigation: Full keyboard access to all interactive elements
- Screen reader support: Proper ARIA labels and semantic HTML
- Touch targets: Minimum 44x44px for touch interfaces

## Design Handoff Checklist

### For Each Screen

- [ ] All user flows documented
- [ ] Component inventory complete
- [ ] Accessibility requirements defined
- [ ] Responsive variants created
- [ ] Brand guidelines incorporated
- [ ] Animation specifications included

### For Component Library

- [ ] All component variants designed
- [ ] All component states designed
- [ ] Interaction patterns defined
- [ ] Responsive behavior specified
- [ ] Accessibility features included

## Next Steps

1. Create Figma file with proper naming conventions
2. Set up design system with colors, typography, and spacing
3. Create component library with all core components
4. Design all screen variants for different breakpoints
5. Create interactive prototypes for user flows
6. Prepare design handoff documentation
7. Set up design system for development handoff

## File Organization

```
Keyboard Master Design.fig
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Components
├── 📱 Screens
│   ├── Home Screen
│   ├── Lessons Screen
│   ├── Dashboard Screen
│   └── Settings Screen
├── 🧩 Components
│   ├── TypingTextDisplay
│   ├── VirtualKeyboard
│   ├── ProgressIndicator
│   └── MetricsDisplay
└── 📐 Responsive
    ├── Mobile
    ├── Tablet
    └── Desktop
```

## Testing and Validation

### Design Validation

- Test all interactive states
- Validate color contrast ratios
- Check touch target sizes
- Verify responsive behavior
- Test with screen readers

### User Testing

- Conduct usability testing with actual users
- Test on various devices and screen sizes
- Validate accessibility with assistive technology users
- Gather feedback on visual hierarchy and usability
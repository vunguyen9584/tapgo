import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TypingEngine from '../TypingEngine';
import type { TypingSession, TypingMetrics } from '../../types/typing';

// Mock the session complete callback
const mockOnSessionComplete = jest.fn();

describe('TypingEngine Component', () => {
  const targetText = 'hello world';

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date.now for consistent timing in tests
    jest.spyOn(Date, 'now').mockImplementation(() => 1000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AC1: Text Display and Cursor Animation', () => {
    test('renders target text with proper character display', () => {
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      // Check if all characters are displayed
      const characters = screen.getAllByRole('char');
      expect(characters).toHaveLength(targetText.length);
      
      // Initial state: all characters should be gray (untyped)
      characters.forEach((char, index) => {
        expect(char).toHaveClass('text-gray-500');
        expect(char).toHaveAttribute('aria-label', expect.stringContaining('untyped'));
      });
    });

    test('shows cursor at initial position when session starts', () => {
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const characters = screen.getAllByRole('char');
      // Cursor should be at first position when session is active
      expect(characters[0]).toBeInTheDocument();
      expect(characters[0]).toHaveClass('text-gray-500'); // untyped state
    });

    test('applies cursor styling with smooth transitions', () => {
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      // Check if cursor styling classes include transition on text display area
      const textDisplayArea = screen.getByRole('textbox', { name: 'Typing practice text' });
      expect(textDisplayArea).toBeInTheDocument();
      expect(textDisplayArea).toHaveAttribute('aria-label', 'Typing practice text');
    });

    test('renders characters with proper ARIA labels', () => {
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const characters = screen.getAllByRole('char');
      characters.forEach((char, index) => {
        expect(char).toHaveAttribute('aria-label', 
          expect.stringContaining(`Character ${targetText[index]} at position ${index + 1}`)
        );
      });
    });
  });

  describe('AC2: Correct Character Feedback and Cursor Advancement', () => {
    test('handles correct character input with green highlighting', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      // Type correct first character 'h'
      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      await user.type(textarea, 'h');

      const characters = screen.getAllByRole('char');
      
      // First character should be green (correct)
      expect(characters[0]).toHaveClass('text-green-400');
      expect(characters[0]).toHaveAttribute('aria-label', expect.stringContaining('typed'));
    });

    test('advances cursor after correct input', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      
      // Type correct characters
      await user.type(textarea, 'he');
      const characters = screen.getAllByRole('char');
      
      // First two characters should be green
      expect(characters[0]).toHaveClass('text-green-400');
      expect(characters[1]).toHaveClass('text-green-400');
      
      // Third character should have cursor (current position)
      expect(characters[2]).toHaveClass('bg-blue-500', 'text-white'); // cursor styling
    });

    test('updates typing metrics in real-time', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      // Initial metrics should show 0 WPM, 100% accuracy, 0 errors
      expect(screen.getByText(/WPM:/)).toBeInTheDocument();
      expect(screen.getByText(/Accuracy:/)).toBeInTheDocument();
      expect(screen.getByText(/Errors:/)).toBeInTheDocument();

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      await user.type(textarea, 'hello');

      // Metrics should be displayed after typing
      expect(screen.getByText(/WPM:/)).toBeInTheDocument();
      expect(screen.getByText(/Accuracy:/)).toBeInTheDocument();
    });

    test('starts session on first character input', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      
      // Session should start on first character
      await user.type(textarea, 'h');
      
      // Should show metrics update after session starts
      expect(screen.getByText(/WPM:/)).toBeInTheDocument();
    });
  });

  describe('AC3: Incorrect Character Feedback with Error Counter', () => {
    test('handles incorrect character input with red highlighting', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      // Type incorrect character
      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      await user.type(textarea, 'x');

      const characters = screen.getAllByRole('char');
      
      // First character should be red (incorrect)
      expect(characters[0]).toHaveClass('text-red-400');
      expect(characters[0]).toHaveAttribute('aria-label', expect.stringContaining('typed'));
    });

    test('keeps cursor at error position after incorrect input', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      await user.type(textarea, 'x');

      const characters = screen.getAllByRole('char');
      
      // First character should be red (incorrect)
      expect(characters[0]).toHaveClass('text-red-400');
      
      // Second character should have cursor (error position)
      expect(characters[1]).toHaveClass('bg-blue-500', 'text-white'); // cursor styling
    });

    test('increments error counter for incorrect characters', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      
      // Initial error count should be 0
      const errorsElement = screen.getByText(/Errors:/);
      const errorsParent = errorsElement.parentElement;
      expect(errorsParent).toHaveTextContent('Errors: 0');

      // Type incorrect characters
      await user.type(textarea, 'xyz');
      
      // Error count should be 3
      expect(errorsParent).toHaveTextContent('Errors: 3');
    });

    test('displays error counter with real-time updates', () => {
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      // Error counter should be displayed initially
      expect(screen.getByText(/Errors:/)).toBeInTheDocument();
      
      const errorsElement = screen.getByText(/Errors:/);
      expect(errorsElement.parentElement).toHaveTextContent('Errors: 0');
    });
  });

  describe('Session Completion Workflow', () => {
    test('completes session when target text is fully typed', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      
      // Type entire target text
      await user.type(textarea, targetText);

      // Wait for session completion callback
      await waitFor(() => {
        expect(mockOnSessionComplete).toHaveBeenCalledTimes(1);
      });

      // Verify session data structure
      const [session, metrics] = mockOnSessionComplete.mock.calls[0];
      
      expect(session).toMatchObject({
        targetText: targetText,
        typedText: targetText,
        duration: expect.any(Number),
        isPaused: false,
        currentCharIndex: targetText.length
      });

      expect(metrics).toMatchObject({
        wpm: expect.any(Number),
        accuracy: expect.any(Number),
        netWpm: expect.any(Number),
        correctChars: expect.any(Number),
        incorrectChars: expect.any(Number),
        totalChars: expect.any(Number)
      });
    });

    test('triggers session completion callback with correct data', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      await user.type(textarea, targetText);

      await waitFor(() => {
        expect(mockOnSessionComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.stringContaining('session-'),
            userId: 'current-user',
            targetText,
            typedText: targetText,
            startTime: expect.any(Date),
            endTime: expect.any(Date),
            duration: expect.any(Number),
            isPaused: false,
            currentCharIndex: targetText.length
          }),
          expect.objectContaining({
            wpm: expect.any(Number),
            accuracy: expect.any(Number),
            netWpm: expect.any(Number),
            correctChars: expect.any(Number),
            incorrectChars: expect.any(Number),
            totalChars: expect.any(Number)
          })
        );
      });
    });
  });

  describe('Accessibility and UX Compliance', () => {
    test('maintains proper accessibility attributes', () => {
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      // Check for proper ARIA attributes
      const textbox = screen.getByRole('textbox', { name: 'Type here to practice' });
      expect(textbox).toHaveAttribute('aria-label', 'Type here to practice');
      expect(textbox).toHaveAttribute('aria-describedby', 'typing-metrics');

      const metricsStatus = screen.getByRole('status');
      expect(metricsStatus).toBeInTheDocument();
    });

    test('supports keyboard navigation for screen readers', () => {
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      
      // Should have proper keyboard attributes
      expect(textarea).toHaveAttribute('autoComplete', 'off');
      expect(textarea).toHaveAttribute('autoCorrect', 'off');
      expect(textarea).toHaveAttribute('autoCapitalize', 'off');
      expect(textarea).toHaveAttribute('spellCheck', 'false');
    });
  });

  describe('Input Validation and Security', () => {
    test('blocks paste functionality', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      
      // Attempt to paste text
      const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
      Object.defineProperty(pasteEvent, 'preventDefault', {
        value: jest.fn(),
        writable: false
      });

      textarea.dispatchEvent(pasteEvent);
      
      expect(pasteEvent.preventDefault).toHaveBeenCalled();
    });

    test('handles backspace correctly', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      
      // Type some characters
      await user.type(textarea, 'hello');
      let characters = screen.getAllByRole('char');
      
      // First five characters should be green
      for (let i = 0; i < 5; i++) {
        expect(characters[i]).toHaveClass('text-green-400');
      }

      // Press backspace to delete last character
      await user.keyboard('{Backspace}');
      characters = screen.getAllByRole('char');
      
      // Fifth character should be reset to gray (untyped)
      expect(characters[4]).toHaveClass('bg-blue-500', 'text-white'); // cursor styling
      
      // First four characters should remain green
      for (let i = 0; i < 4; i++) {
        expect(characters[i]).toHaveClass('text-green-400');
      }
    });
  });

  describe('Real-time Metrics Calculation', () => {
    test('calculates WPM correctly', async () => {
      const user = userEvent.setup();
      
      // Mock Date.now to simulate time progression
      jest.spyOn(Date, 'now')
        .mockImplementationOnce(() => 1000000) // Start time
        .mockImplementationOnce(() => 1001000); // 1 second later

      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
          duration={60}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      await user.type(textarea, 'hello world');

      const metrics = screen.getByText(/WPM:/);
      expect(metrics.parentElement).toHaveTextContent(/WPM: \d+\.?\d*/);
    });

    test('calculates accuracy correctly', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      
      // Type 5 correct characters and 2 incorrect
      await user.type(textarea, 'helloxxy');

      const accuracyText = screen.getByText(/Accuracy:/);
      expect(accuracyText.parentElement).toHaveTextContent(/Accuracy: \d+\.?\d*%/);
    });

    test('meets <50ms typing latency requirement', async () => {
      const user = userEvent.setup();
      render(
        <TypingEngine 
          targetText={targetText} 
          onSessionComplete={mockOnSessionComplete}
        />
      );

      const textarea = screen.getByRole('textbox', { name: 'Type here to practice' });
      
      // Measure performance of character input
      const startTime = performance.now();
      
      // Type multiple characters rapidly
      await user.type(textarea, 'quick brown fox');
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTimePerChar = totalTime / 15; // 15 characters typed
      
      // Should average less than 50ms per character
      expect(avgTimePerChar).toBeLessThan(50);
    });
  });
});

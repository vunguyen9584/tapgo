import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TypingEngine from '../TypingEngine';

// Mock Date.now for consistent timing
jest.spyOn(Date, 'now').mockImplementation(() => 1000000);

describe('TypingEngine Timer Functionality', () => {
  const targetText = 'hello world';
  const mockOnSessionComplete = jest.fn();
  const mockOnTimerStart = jest.fn();
  const mockOnTimerPause = jest.fn();
  const mockOnTimerResume = jest.fn();
  const mockOnTimerComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders duration selector initially', () => {
    render(
      <TypingEngine 
        targetText={targetText} 
        onSessionComplete={mockOnSessionComplete}
        onTimerStart={mockOnTimerStart}
        onTimerPause={mockOnTimerPause}
        onTimerResume={mockOnTimerResume}
        onTimerComplete={mockOnTimerComplete}
      />
    );

    expect(screen.getByText('Chọn thời gian luyện tập:')).toBeInTheDocument();
    expect(screen.getByText('15s')).toBeInTheDocument();
    expect(screen.getByText('30s')).toBeInTheDocument();
    expect(screen.getByText('60s')).toBeInTheDocument();
    expect(screen.getByText('120s')).toBeInTheDocument();
  });

  test('can select duration', () => {
    render(
      <TypingEngine 
        targetText={targetText} 
        onSessionComplete={mockOnSessionComplete}
        duration={30}
      />
    );

    const duration60 = screen.getByText('60s');
    fireEvent.click(duration60);

    expect(duration60).toHaveClass('bg-blue-500', 'text-white');
  });

  test('timer starts on first character input', async () => {
    const user = userEvent.setup();
    render(
      <TypingEngine 
        targetText={targetText} 
        onSessionComplete={mockOnSessionComplete}
        onTimerStart={mockOnTimerStart}
        duration={60}
      />
    );

    const hiddenInput = screen.getByRole('textbox', { hidden: true });
    
    // Simulate typing first character
    await user.type(hiddenInput, 'h');

    expect(mockOnTimerStart).toHaveBeenCalledTimes(1);
    expect(screen.getByText('01:00')).toBeInTheDocument();
    expect(screen.getByText('Đang diễn ra')).toBeInTheDocument();
  });

  test('timer countdown works correctly', async () => {
    const user = userEvent.setup();
    render(
      <TypingEngine 
        targetText={targetText} 
        onSessionComplete={mockOnSessionComplete}
        duration={60}
      />
    );

    const hiddenInput = screen.getByRole('textbox', { hidden: true });
    
    // Start timer by typing first character
    await user.type(hiddenInput, 'h');
    
    // Check initial time
    expect(screen.getByText('01:00')).toBeInTheDocument();

    // Fast-forward time by 1 second
    jest.advanceTimersByTime(1000);
    
    // Check countdown updated
    expect(screen.getByText('00:59')).toBeInTheDocument();
  });

  test('pause/resume functionality for sessions > 60 seconds', async () => {
    const user = userEvent.setup();
    render(
      <TypingEngine 
        targetText={targetText} 
        onSessionComplete={mockOnSessionComplete}
        onTimerPause={mockOnTimerPause}
        onTimerResume={mockOnTimerResume}
        duration={120}
      />
    );

    // Start session
    const hiddenInput = screen.getByRole('textbox', { hidden: true });
    await user.type(hiddenInput, 'h');

    // Pause button should be visible for sessions > 60 seconds
    expect(screen.getByText('Tạm dừng')).toBeInTheDocument();
    
    // Click pause
    fireEvent.click(screen.getByText('Tạm dừng'));
    expect(mockOnTimerPause).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Tạm dừng')).toBeInTheDocument();
    
    // Resume button should appear
    expect(screen.getByText('Tiếp tục')).toBeInTheDocument();
    
    // Click resume
    fireEvent.click(screen.getByText('Tiếp tục'));
    expect(mockOnTimerResume).toHaveBeenCalledTimes(1);
  });

  test('no pause/resume for sessions <= 60 seconds', async () => {
    const user = userEvent.setup();
    render(
      <TypingEngine 
        targetText={targetText} 
        onSessionComplete={mockOnSessionComplete}
        duration={30}
      />
    );

    // Start session
    const hiddenInput = screen.getByRole('textbox', { hidden: true });
    await user.type(hiddenInput, 'h');

    // Pause/resume buttons should NOT be visible for sessions <= 60 seconds
    expect(screen.queryByText('Tạm dừng')).not.toBeInTheDocument();
    expect(screen.queryByText('Tiếp tục')).not.toBeInTheDocument();
  });

  test('time warning appears when less than 10 seconds', async () => {
    const user = userEvent.setup();
    render(
      <TypingEngine 
        targetText={targetText} 
        onSessionComplete={mockOnSessionComplete}
        duration={15}
      />
    );

    const hiddenInput = screen.getByRole('textbox', { hidden: true });
    
    // Start timer
    await user.type(hiddenInput, 'h');
    
    // Fast-forward to 6 seconds remaining
    jest.advanceTimersByTime(9000);
    
    // Warning should appear
    expect(screen.getByText('⚠️ Sắp hết thời gian!')).toBeInTheDocument();
  });

  test('session completes when timer expires', async () => {
    const user = userEvent.setup();
    render(
      <TypingEngine 
        targetText={targetText} 
        onSessionComplete={mockOnSessionComplete}
        onTimerComplete={mockOnTimerComplete}
        duration={15}
      />
    );

    const hiddenInput = screen.getByRole('textbox', { hidden: true });
    
    // Start timer
    await user.type(hiddenInput, 'h');
    
    // Fast-forward to completion
    jest.advanceTimersByTime(15000);
    
    // Session should complete
    expect(mockOnTimerComplete).toHaveBeenCalledTimes(1);
    expect(mockOnSessionComplete).toHaveBeenCalledTimes(1);
  });
});

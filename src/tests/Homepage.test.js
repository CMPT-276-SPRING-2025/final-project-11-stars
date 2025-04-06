// src/tests/Homepage.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../pages/Homepage';



jest.mock('../pages/Quizcategories', () => () => <div data-testid="quiz-category">Mocked QuizCategory</div>);

beforeEach(() => {
  localStorage.clear();
  document.body.className = '';
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('HomePage', () => {
  test('renders main heading and tagline', () => {
    render(<HomePage />);
    expect(screen.getByText(/BrainGoated/i)).toBeInTheDocument();
    expect(screen.getByText(/Water your curiosity/i)).toBeInTheDocument();
  });

  test('renders Bud-E iframe', () => {
    render(<HomePage />);
    const iframe = screen.getByTitle('Bud-E Animation');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', '/BudE_animation.html');
  });

  test('renders QuizCategory component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('quiz-category')).toBeInTheDocument();
  });

  test('toggles dark and light mode', () => {
    render(<HomePage />);
    const checkbox = screen.getByRole('checkbox');

    // Initially should be light mode
    expect(document.body.classList.contains('dark-mode')).toBe(false);
    expect(document.body.classList.contains('light-mode')).toBe(true);

    // Toggle to dark mode
    fireEvent.click(checkbox);
    expect(document.body.classList.contains('dark-mode')).toBe(true);
    expect(document.body.classList.contains('light-mode')).toBe(false);

    // Toggle back to light
    fireEvent.click(checkbox);
    expect(document.body.classList.contains('dark-mode')).toBe(false);
    expect(document.body.classList.contains('light-mode')).toBe(true);
  });

  test('saves dark mode preference in localStorage', () => {
    render(<HomePage />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(localStorage.getItem('darkMode')).toBe('true');

    fireEvent.click(checkbox);
    expect(localStorage.getItem('darkMode')).toBe('false');
  });

  test('scrolls to quiz-category-space after 3.5 seconds', async () => {
    const scrollIntoViewMock = jest.fn();
    const div = document.createElement('div');
    div.id = 'quiz-category-space';
    div.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(div);

    render(<HomePage />);
    jest.advanceTimersByTime(3500);

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });
});
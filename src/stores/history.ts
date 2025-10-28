import { writable } from 'svelte/store';
import type { Command } from '../interfaces/command';

// Initialize history with error handling
const initializeHistory = (): Array<Command> => {
  try {
    const stored = localStorage.getItem('history');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that it's an array
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load history from localStorage:', e);
  }
  return [];
};

export const history = writable<Array<Command>>(initializeHistory());

history.subscribe((value) => {
  try {
    localStorage.setItem('history', JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save history to localStorage:', e);
  }
});

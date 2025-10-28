import { writable } from 'svelte/store';
import themes from '../../themes.json';
import type { Theme } from '../interfaces/theme';

// Safely get default theme with fallback
const getDefaultTheme = (): Theme => {
  const catppuccinMocha = themes.find((t) => t.name === 'CatppuccinMocha');
  if (catppuccinMocha) {
    return catppuccinMocha;
  }
  
  // Fallback to first available theme or a safe default
  if (themes.length > 0) {
    return themes[0];
  }
  
  // Ultimate fallback
  return {
    name: 'Default',
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    cursorColor: '#cdd6f4',
    black: '#45475a',
    red: '#f38ba8',
    green: '#a6e3a1',
    yellow: '#f9e2af',
    blue: '#89b4fa',
    purple: '#f5c2e7',
    cyan: '#94e2d5',
    white: '#bac2de',
    brightBlack: '#585b70',
    brightRed: '#f38ba8',
    brightGreen: '#a6e3a1',
    brightYellow: '#f9e2af',
    brightBlue: '#89b4fa',
    brightPurple: '#f5c2e7',
    brightCyan: '#94e2d5',
    brightWhite: '#a6adc8'
  };
};

const defaultColorscheme: Theme = getDefaultTheme();

// Initialize theme with error handling
const initializeTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('colorscheme');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that parsed data has required properties
      if (parsed && typeof parsed === 'object' && parsed.name) {
        return parsed as Theme;
      }
    }
  } catch (e) {
    console.error('Failed to load theme from localStorage:', e);
  }
  return defaultColorscheme;
};

export const theme = writable<Theme>(initializeTheme());

theme.subscribe((value) => {
  try {
    localStorage.setItem('colorscheme', JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save theme to localStorage:', e);
  }
});

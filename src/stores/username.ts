import { writable } from 'svelte/store';

const storedUsername = localStorage.getItem('username') || '';

export const username = writable<string>(storedUsername || 'guest');
export const usernamePromptShown = writable<boolean>(!!storedUsername);

username.subscribe((value) => {
  if (value && value !== 'guest') {
    localStorage.setItem('username', value);
  }
});

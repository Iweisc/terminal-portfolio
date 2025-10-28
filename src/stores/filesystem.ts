import { writable } from 'svelte/store';

export const currentDirectory = writable<string>('~');

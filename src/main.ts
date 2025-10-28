import './app.css';
import App from './App.svelte';

const appElement = document.getElementById('app');

if (!appElement) {
  throw new Error('Failed to find #app element');
}

const app = new App({
  target: appElement,
});

export default app;

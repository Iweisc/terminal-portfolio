<script lang="ts">
  import { tick } from 'svelte';
  import Ps1 from './components/Ps1.svelte';
  import Input from './components/Input.svelte';
  import History from './components/History.svelte';
  import ThemeSelector from './components/ThemeSelector.svelte';
  import UsernamePrompt from './components/UsernamePrompt.svelte';
  import HistoryViewer from './components/HistoryViewer.svelte';
  import { theme } from './stores/theme';
  import { themeSelectorActive } from './stores/themeSelector';
  import { historyViewerActive } from './stores/commandHistory';
  import { usernamePromptShown } from './stores/username';
  import { history } from './stores/history';
  import { commands } from './utils/commands';
  import type { Theme } from './interfaces/theme';

  const handleThemeSelectorClose = async (selected: Theme | null) => {
    // Restore the previous history from sessionStorage
    const savedHistory = sessionStorage.getItem('themeCommandHistory');
    if (savedHistory) {
      try {
        const previousHistory = JSON.parse(savedHistory);
        const output = selected 
          ? `Theme set to ${selected.name}` 
          : 'Theme selection cancelled';
        
        // Restore history and add the theme command result
        history.set([...previousHistory, { command: 'theme', outputs: [output] }]);
        
        // Clean up
        sessionStorage.removeItem('themeCommandHistory');
      } catch (e) {
        console.error('Failed to restore history:', e);
      }
    }
    
    themeSelectorActive.set(false);
    
    // Wait for DOM update before refocusing
    await tick();
    const input = document.getElementById('command-input') as HTMLInputElement;
    input?.focus();
  };

  const handleUsernameComplete = async () => {
    // Load welcome message after username is set
    const catCommand = commands['cat'] as (args: string[]) => string;
    if (catCommand) {
      const output = catCommand(['welcome.txt']);
      history.set([{ command: 'cat welcome.txt', outputs: [output] }]);
    }
    
    // Refocus after username is set
    await tick();
    const input = document.getElementById('command-input') as HTMLInputElement;
    input?.focus();
  };

  const handleHistoryViewerClose = async () => {
    const savedHistory = sessionStorage.getItem('historyViewerHistory');
    if (savedHistory) {
      try {
        const previousHistory = JSON.parse(savedHistory);
        history.set([...previousHistory, { command: 'history', outputs: ['History viewer closed'] }]);
        sessionStorage.removeItem('historyViewerHistory');
      } catch (e) {
        console.error('Failed to restore history:', e);
      }
    }
    
    historyViewerActive.set(false);
    
    await tick();
    const input = document.getElementById('command-input') as HTMLInputElement;
    input?.focus();
  };
</script>

<svelte:head>
  {#if import.meta.env.VITE_TRACKING_ENABLED === 'true'}
    <script
      async
      defer
      data-website-id={import.meta.env.VITE_TRACKING_SITE_ID}
      src={import.meta.env.VITE_TRACKING_URL}
    ></script>
  {/if}
</svelte:head>

<main
  class="h-full border-2 rounded-md p-4 overflow-auto text-xs sm:text-sm md:text-base"
  style={`background-color: ${$theme.background}; color: ${$theme.foreground}; border-color: ${$theme.green};`}
>
  {#if !$usernamePromptShown}
    <UsernamePrompt onComplete={handleUsernameComplete} />
  {:else}
    <History />

    {#if $themeSelectorActive}
      <ThemeSelector onClose={handleThemeSelectorClose} />
    {/if}

    {#if $historyViewerActive}
      <HistoryViewer onClose={handleHistoryViewerClose} />
    {/if}

    <div class="flex flex-col md:flex-row">
      <Ps1 />

      <Input />
    </div>
  {/if}
</main>

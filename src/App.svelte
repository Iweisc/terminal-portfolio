<script lang="ts">
  import Ps1 from './components/Ps1.svelte';
  import Input from './components/Input.svelte';
  import History from './components/History.svelte';
  import ThemeSelector from './components/ThemeSelector.svelte';
  import { theme } from './stores/theme';
  import { themeSelectorActive } from './stores/themeSelector';
  import { history } from './stores/history';
  import type { Theme } from './interfaces/theme';

  const handleThemeSelectorClose = (selected: Theme | null) => {
    
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
    
    // Refocus the input after closing
    setTimeout(() => {
      const input = document.getElementById('command-input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
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
  <History />

  {#if $themeSelectorActive}
    <ThemeSelector onClose={handleThemeSelectorClose} />
  {:else}
    <!-- Theme selector not active: {$themeSelectorActive} -->
  {/if}

  <div class="flex flex-col md:flex-row">
    <Ps1 />

    <Input />
  </div>
</main>

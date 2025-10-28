<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { theme } from '../stores/theme';
  import themes from '../../themes.json';
  import type { Theme } from '../interfaces/theme';

  export let onClose: (selected: Theme | null) => void;

  let searchQuery = '';
  let selectedIndex = 0;
  let container: HTMLDivElement;
  let insertMode = false; // Vim-style insert mode for searching

  $: filteredThemes = themes.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  $: {
    // Reset selected index if it's out of bounds after filtering
    if (selectedIndex >= filteredThemes.length) {
      selectedIndex = Math.max(0, filteredThemes.length - 1);
    }
  }

  // Initialize selected index to current theme
  $: {
    const currentThemeIndex = filteredThemes.findIndex(t => t.name === $theme.name);
    if (currentThemeIndex !== -1 && searchQuery === '') {
      selectedIndex = currentThemeIndex;
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    // In INSERT MODE: handle search input
    if (insertMode) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        insertMode = false; // Exit insert mode
        return;
      }
      
      if (event.key === 'Backspace') {
        event.preventDefault();
        searchQuery = searchQuery.slice(0, -1);
        return;
      }
      
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        if (filteredThemes.length > 0) {
          theme.set(filteredThemes[selectedIndex]);
          onClose(filteredThemes[selectedIndex]);
        }
        return;
      }
      
      // Handle regular character input for search
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        searchQuery += event.key;
        selectedIndex = 0; // Reset to first result when searching
      }
      return;
    }

    // In NAVIGATION MODE: handle vim-style navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'k', 'j', 'h', 'l', 'Enter', 'Escape', 'i'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }

    switch (event.key) {
      case 'i':
        insertMode = true; // Enter insert mode
        break;
      case 'ArrowUp':
      case 'k':
        selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredThemes.length - 1;
        break;
      case 'ArrowDown':
      case 'j':
        selectedIndex = selectedIndex < filteredThemes.length - 1 ? selectedIndex + 1 : 0;
        break;
      case 'ArrowLeft':
      case 'h':
        selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredThemes.length - 1;
        break;
      case 'ArrowRight':
      case 'l':
        selectedIndex = selectedIndex < filteredThemes.length - 1 ? selectedIndex + 1 : 0;
        break;
      case 'Enter':
        if (filteredThemes.length > 0) {
          theme.set(filteredThemes[selectedIndex]);
          onClose(filteredThemes[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose(null);
        break;
    }
  };

  let keydownListenerActive = false;

  onMount(() => {
    // Use requestAnimationFrame for better timing than arbitrary timeouts
    // This waits for the next animation frame after mount
    requestAnimationFrame(() => {
      window.addEventListener('keydown', handleKeyDown);
      keydownListenerActive = true;
      container?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  });

  onDestroy(() => {
    if (keydownListenerActive) {
      window.removeEventListener('keydown', handleKeyDown);
    }
  });

  $: {
    // Auto-scroll selected item into view
    if (container) {
      const selected = container.querySelector(`[data-index="${selectedIndex}"]`);
      selected?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Clear search query on 'q' key for quit (only if search is empty)
  $: if (searchQuery === 'q') {
    searchQuery = '';
  }
</script>

<div bind:this={container} class="theme-selector my-4 w-full">
  <div class="border-2 p-3 mb-2" style={`border-color: ${$theme.green}; background-color: ${$theme.background}`}>
    <div class="mb-3">
      <div style={`color: ${$theme.cyan}; font-weight: bold;`}>╔═ Theme Selector ═╗</div>
      <div style={`color: ${$theme.brightBlack}`}>Navigation: ↑↓←→ or hjkl | Select: Enter | Cancel: Esc</div>
      <div style={`color: ${$theme.brightBlack}`}>Search: Press 'i' for insert mode | Esc to exit search</div>
      <div style={`margin-top: 0.5rem;`}>
        {#if insertMode}
          <span style={`color: ${$theme.yellow}; font-weight: bold;`}>-- INSERT --</span>
          {#if searchQuery}
            <span style={`color: ${$theme.foreground}; margin-left: 0.5rem;`}>
              "{searchQuery}" ({filteredThemes.length} results)
            </span>
          {/if}
        {:else}
          <span style={`color: ${$theme.green}; font-weight: bold;`}>-- NORMAL --</span>
        {/if}
      </div>
    </div>
    <div class="max-h-96 overflow-y-auto" style={`border: 1px solid ${$theme.brightBlack}; padding: 0.5rem;`}>
      {#if filteredThemes.length === 0}
        <div style={`color: ${$theme.red}; padding: 0.5rem;`}>
          No themes found matching "{searchQuery}"
        </div>
      {:else}
        {#each filteredThemes as themeOption, index}
          <div
            data-index={index}
            class="py-1 px-2"
            style={`
              background-color: ${index === selectedIndex ? $theme.brightBlack : 'transparent'};
              color: ${index === selectedIndex ? $theme.brightYellow : $theme.foreground};
              font-weight: ${index === selectedIndex ? 'bold' : 'normal'};
            `}
          >
            {index === selectedIndex ? '► ' : '  '}{themeOption.name}{themeOption.name === $theme.name ? ' ✓' : ''}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .theme-selector {
    user-select: none;
  }
</style>

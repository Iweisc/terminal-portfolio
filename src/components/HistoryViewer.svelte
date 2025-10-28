<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { theme } from '../stores/theme';
  import { history } from '../stores/history';

  export let onClose: () => void;

  let selectedIndex = Math.max(0, $history.length - 1);
  let container: HTMLDivElement;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'k', 'j', 'h', 'l', 'Enter', 'Escape', 'q'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'k':
        selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : $history.length - 1;
        break;
      case 'ArrowDown':
      case 'j':
        selectedIndex = selectedIndex < $history.length - 1 ? selectedIndex + 1 : 0;
        break;
      case 'Escape':
      case 'q':
        onClose();
        break;
    }
  };

  onMount(() => {
    // Delay adding the event listener to avoid catching the Enter key
    setTimeout(() => {
      window.addEventListener('keydown', handleKeyDown);
    }, 100);
    setTimeout(() => {
      container?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 10);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  $: {
    // Auto-scroll selected item into view
    if (container) {
      const selected = container.querySelector(`[data-index="${selectedIndex}"]`);
      selected?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
</script>

<div bind:this={container} class="history-viewer my-4 w-full">
  <div class="border-2 p-3 mb-2" style={`border-color: ${$theme.green}; background-color: ${$theme.background}`}>
    <div class="mb-3">
      <div style={`color: ${$theme.cyan}; font-weight: bold;`}>Command History</div>
      <div style={`color: ${$theme.brightBlack}`}>Navigation: ↑↓ or jk | Close: Esc/q</div>
    </div>
    <div class="max-h-96 overflow-y-auto" style={`border: 1px solid ${$theme.brightBlack}; padding: 0.5rem;`}>
      {#if $history.length === 0}
        <div style={`color: ${$theme.red}; padding: 0.5rem;`}>
          No command history
        </div>
      {:else}
        {#each $history as entry, index}
          <div
            data-index={index}
            class="py-1 px-2"
            style={`
              background-color: ${index === selectedIndex ? $theme.brightBlack : 'transparent'};
              color: ${index === selectedIndex ? $theme.brightYellow : $theme.foreground};
              font-weight: ${index === selectedIndex ? 'bold' : 'normal'};
            `}
          >
            {index === selectedIndex ? '> ' : '  '}{index + 1}. {entry.command}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .history-viewer {
    user-select: none;
  }
</style>

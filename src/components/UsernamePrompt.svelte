<script lang="ts">
  import { onMount } from 'svelte';
  import { theme } from '../stores/theme';
  import { username, usernamePromptShown } from '../stores/username';

  export let onComplete: () => void;

  let inputValue = '';
  let input: HTMLInputElement;

  onMount(() => {
    setTimeout(() => {
      input?.focus();
    }, 100);
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        username.set(trimmedValue);
        usernamePromptShown.set(true);
        onComplete();
      }
    }
  };
</script>

<div class="username-prompt my-4" style={`color: ${$theme.foreground}`}>
  <pre style={`color: ${$theme.cyan}`}>
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  Welcome to Abdullah Al Zawad's Terminal Portfolio!          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  </pre>
  
  <div class="mt-4">
    <p style={`color: ${$theme.green}`}>Please enter your name to continue:</p>
    <div class="flex items-center mt-2">
      <span style={`color: ${$theme.yellow}`}>Name: </span>
      <input
        bind:this={input}
        bind:value={inputValue}
        on:keydown={handleKeyDown}
        class="ml-2 bg-transparent outline-none flex-1"
        style={`color: ${$theme.foreground}; caret-color: ${$theme.green}`}
        type="text"
        maxlength="20"
        autocomplete="off"
      />
    </div>
    <p class="mt-2 text-sm" style={`color: ${$theme.brightBlack}`}>
      Press Enter to continue...
    </p>
  </div>
</div>

<style>
  .username-prompt {
    user-select: none;
  }
</style>

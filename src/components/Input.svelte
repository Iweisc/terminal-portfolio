<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { history } from '../stores/history';
  import { theme } from '../stores/theme';
  import { commands } from '../utils/commands';
  import { track } from '../utils/tracking';
  import { themeSelectorActive } from '../stores/themeSelector';
  import { historyViewerActive } from '../stores/commandHistory';
  import { usernamePromptShown } from '../stores/username';
  import { resolvePathForCompletion } from '../data/files';
  import { currentDirectory } from '../stores/filesystem';
  import { 
    createTabCompletionState, 
    resetTabCompletion, 
    handleTabCompletion,
    type TabCompletionState 
  } from '../utils/tabCompletion';

  /**
   * Keyboard proximity map for common typos
   * Maps each key to its adjacent keys on a QWERTY keyboard
   */
  const keyboardProximity: Record<string, string> = {
    'q': 'wa', 'w': 'qeas', 'e': 'wrds', 'r': 'etf', 't': 'ryg', 'y': 'tuh', 'u': 'yij', 'i': 'uok', 'o': 'ipl', 'p': 'ol',
    'a': 'qwsz', 's': 'awedxz', 'd': 'serfcx', 'f': 'drtgvc', 'g': 'ftyhbv', 'h': 'gyujnb', 'j': 'huikmn', 'k': 'jiol', 'l': 'kop',
    'z': 'asx', 'x': 'zsdc', 'c': 'xdfv', 'v': 'cfgb', 'b': 'vghn', 'n': 'bhjm', 'm': 'njk'
  };

  /**
   * Check if two characters are similar based on keyboard proximity or common substitutions
   * @param a First character
   * @param b Second character
   * @returns true if characters are similar
   */
  function areCharactersSimilar(a: string, b: string): boolean {
    if (a === b) return true;
    
    // Check keyboard proximity
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    
    if (keyboardProximity[aLower]?.includes(bLower)) return true;
    if (keyboardProximity[bLower]?.includes(aLower)) return true;
    
    // Common substitutions (vowels, similar looking letters)
    const similarGroups = [
      ['a', 'e', 'o'],
      ['i', 'l', '1'],
      ['o', '0'],
      ['s', 'z'],
      ['c', 'k']
    ];
    
    for (const group of similarGroups) {
      if (group.includes(aLower) && group.includes(bLower)) return true;
    }
    
    return false;
  }

  /**
   * Calculate weighted Levenshtein distance with character similarity
   * Uses dynamic programming to compute edit distance with custom weights
   * for similar characters (e.g., keyboard-adjacent keys get lower cost)
   * @param a First string
   * @param b Second string
   * @returns Weighted edit distance between strings
   */
  function levenshteinDistanceWeighted(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          // Lower cost for similar characters
          const substitutionCost = areCharactersSimilar(b.charAt(i - 1), a.charAt(j - 1)) ? 0.5 : 1;
          
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + substitutionCost, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Find the closest matching command for typo correction
   * Uses weighted Levenshtein distance to suggest corrections
   * @param input User's input command
   * @returns Closest matching command or null if no good match
   */
  function findClosestCommand(input: string): string | null {
    const availableCommands = Object.keys(commands);
    let closestCommand: string | null = null;
    let minDistance = Infinity;

    for (const cmd of availableCommands) {
      const distance = levenshteinDistanceWeighted(input.toLowerCase(), cmd.toLowerCase());
      
      // Only suggest if distance is small and length is similar
      if (distance <= 1.5 && distance < minDistance && Math.abs(input.length - cmd.length) <= 2) {
        minDistance = distance;
        closestCommand = cmd;
      }
    }

    return closestCommand;
  }

  let command = '';
  let historyIndex = -1;
  let tabCompletionState: TabCompletionState = createTabCompletionState();

  let input: HTMLInputElement;

  onMount(() => {
    input.focus();

    // Only show welcome message if username is already set
    if ($usernamePromptShown && $history.length === 0) {
      const catCommand = commands['cat'] as (args: string[]) => string;

      if (catCommand) {
        const output = catCommand(['welcome.txt']);

        $history = [...$history, { command: 'cat welcome.txt', outputs: [output] }];
      }
    }
  });

  afterUpdate(() => {
    input.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  const handleKeyDown = async (event: KeyboardEvent) => {
    if ($themeSelectorActive || $historyViewerActive) {
      return;
    }

    // Reset tab completion if user types something other than Tab
    if (event.key !== 'Tab') {
      resetTabCompletion(tabCompletionState);
    }
    
    if (event.key === 'Enter') {
      const [commandName, ...args] = command.split(' ');

      if (import.meta.env.VITE_TRACKING_ENABLED === 'true') {
        track(commandName, ...args);
      }

      const commandFunction = commands[commandName];

      if (commandFunction) {
        const output = await commandFunction(args);

        if (commandName === 'theme' || commandName === 'history') {
          // Theme/history command opens TUI and clears/saves history
          // The handler in App.svelte will restore and update history
          $history = [{ command, outputs: [] }];
        } else if (commandName !== 'clear') {
          $history = [...$history, { command, outputs: [output] }];
        }
      } else {
        // Try to find a similar command
        const suggestion = findClosestCommand(commandName);
        const output = suggestion
          ? `${commandName}: command not found\n\nDid you mean: ${suggestion}?`
          : `${commandName}: command not found`;

        $history = [...$history, { command, outputs: [output] }];
      }

      command = '';
    } else if (event.key === 'ArrowUp') {
      if (historyIndex < $history.length - 1) {
        historyIndex++;

        command = $history[$history.length - 1 - historyIndex].command;
      }

      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      if (historyIndex > -1) {
        historyIndex--;
        command =
          historyIndex >= 0
            ? $history[$history.length - 1 - historyIndex].command
            : '';
      }
      event.preventDefault();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      command = handleTabCompletion(
        command,
        Object.keys(commands),
        $currentDirectory,
        resolvePathForCompletion,
        tabCompletionState
      );
    } else if (event.ctrlKey && event.key === 'l') {
      event.preventDefault();

      $history = [];
    }
  };
</script>

<svelte:window
  on:click={() => {
    input.focus();
  }}
/>

<div class="flex w-full">
  <p class="visible md:hidden">❯</p>

  <input
    id="command-input"
    name="command-input"
    aria-label="Command input"
    class="w-full px-2 bg-transparent outline-none"
    type="text"
    style={`color: ${$theme.foreground}`}
    bind:value={command}
    on:keydown={handleKeyDown}
    bind:this={input}
    disabled={$themeSelectorActive || $historyViewerActive}
  />
</div>

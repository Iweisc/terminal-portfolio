/**
 * Tab completion utility for command line interface
 * Handles both command completion and file argument completion
 */

export interface TabCompletionState {
  index: number;
  matches: string[];
  prefix: string;
}

/**
 * Initialize tab completion state
 */
export function createTabCompletionState(): TabCompletionState {
  return {
    index: -1,
    matches: [],
    prefix: ''
  };
}

/**
 * Reset tab completion state
 */
export function resetTabCompletion(state: TabCompletionState): void {
  state.index = -1;
  state.matches = [];
  state.prefix = '';
}

/**
 * Handle tab completion for commands
 * @param command - Current command string
 * @param availableCommands - List of available commands
 * @returns Completed command or original if no match
 */
export function completeCommand(
  command: string,
  availableCommands: string[]
): string {
  const match = availableCommands.find((cmd) => cmd.startsWith(command));
  return match || command;
}

/**
 * Handle tab completion for file/directory arguments
 * Supports cycling through multiple matches
 * @param command - Full command string
 * @param availableOptions - List of available files/directories (already resolved with full paths)
 * @param state - Tab completion state object
 * @returns Completed command with file or original
 */
export function completeFileArgument(
  command: string,
  availableOptions: string[],
  state: TabCompletionState
): string {
  const parts = command.split(' ');
  
  if (parts.length < 2) {
    return command;
  }
  
  const commandName = parts[0];
  const args = parts.slice(1);
  const partialPath = args[args.length - 1] || '';

  // Check if we're continuing the same tab completion
  if (command.startsWith(state.prefix) && state.matches.length > 0) {
    // Cycle to next match
    state.index = (state.index + 1) % state.matches.length;
    const match = state.matches[state.index];
    return `${commandName} ${match}`;
  }
  
  // New tab completion - find all matches
  const matches = availableOptions;

  if (matches.length > 0) {
    state.matches = matches;
    state.prefix = `${commandName} ${partialPath}`;
    state.index = 0;
    
    // The match already contains the full path from resolvePathForCompletion
    return `${commandName} ${matches[0]}`;
  }
  
  return command;
}

/**
 * Main tab completion handler
 * @param command - Current command string
 * @param availableCommands - List of available commands
 * @param currentDir - Current working directory
 * @param resolvePathFn - Function to resolve paths based on current directory
 * @param state - Tab completion state object
 * @returns Completed command
 */
export function handleTabCompletion(
  command: string,
  availableCommands: string[],
  currentDir: string,
  resolvePathFn: (currentDir: string, partialPath: string, directoriesOnly: boolean) => string[],
  state: TabCompletionState
): string {
  const parts = command.split(' ');
  const commandName = parts[0];

  // Directory completion for cd command
  if (commandName === 'cd' && parts.length >= 2) {
    const partialPath = parts.slice(1).join(' ');
    const matches = resolvePathFn(currentDir, partialPath, true);
    return completeFileArgument(command, matches, state);
  }

  // File/directory completion for cat command
  if (commandName === 'cat' && parts.length >= 2) {
    const partialPath = parts.slice(1).join(' ');
    const matches = resolvePathFn(currentDir, partialPath, false);
    return completeFileArgument(command, matches, state);
  }
  
  // Regular command completion
  const completed = completeCommand(command, availableCommands);
  
  // Reset tab completion state after command completion
  resetTabCompletion(state);
  
  return completed;
}

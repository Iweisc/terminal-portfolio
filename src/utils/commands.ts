import { get } from "svelte/store";
import { history } from "../stores/history";
import { todoManager } from "./todo";
import { themeSelectorActive } from "../stores/themeSelector";
import { currentDirectory } from "../stores/filesystem";
import { filesystem, type FileNode } from "../data/files";
import type { Command } from "../interfaces/command";

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  help: () => {
    const categories = {
      System: ["help", "clear", "date", "exit", "ls", "cat", "pwd", "cd", "tree"],
      Info: ["whoami", "neofetch"],
      Productivity: ["todo", "weather"],
      Customization: ["theme"],
      Contact: ["email", "github"],
      Fun: ["echo", "sudo", "vi", "vim", "emacs"],
    };

    let output = "Available commands:\n\n";

    for (const [category, cmds] of Object.entries(categories)) {
      output += `${category}:\n`;
      output += cmds.map((cmd) => `  ${cmd}`).join("\n");
      output += "\n\n";
    }

    output +=
      'Type "[command] help" or "[command]" without args for more info.';

    return output;
  },
  date: () => new Date().toLocaleString(),
  ls: () => {
    const cwd = get(currentDirectory);
    
    if (cwd === '~') {
      const entries = Object.entries(filesystem).map(([name, node]) => {
        return node.type === 'directory' ? `${name}/` : name;
      });
      return entries.join('\n');
    }
    
    // Navigate to the directory
    const pathParts = cwd.split('/').filter(p => p && p !== '~');
    let current: Record<string, FileNode> = filesystem;
    
    for (const part of pathParts) {
      const node = current[part];
      if (!node || node.type !== 'directory' || !node.children) {
        return `ls: cannot access '${cwd}': No such directory`;
      }
      current = node.children;
    }
    
    const entries = Object.entries(current).map(([name, node]) => {
      return node.type === 'directory' ? `${name}/` : name;
    });
    return entries.join('\n');
  },
  cat: (args: string[]) => {
    if (args.length === 0) {
      return `cat: missing file operand
Try 'cat [filename]' or 'ls' to see available files.`;
    }

    const filepath = args[0];
    const cwd = get(currentDirectory);
    
    // Handle absolute vs relative paths
    let pathParts: string[];
    if (filepath.startsWith('~/') || filepath.startsWith('/')) {
      pathParts = filepath.replace('~/', '').replace(/^\//, '').split('/').filter(p => p);
    } else {
      const cwdParts = cwd.split('/').filter(p => p && p !== '~');
      pathParts = [...cwdParts, ...filepath.split('/').filter(p => p)];
    }
    
    // Navigate to the file
    let current: Record<string, FileNode> = filesystem;
    const filename = pathParts[pathParts.length - 1];
    const dirParts = pathParts.slice(0, -1);
    
    for (const part of dirParts) {
      const node = current[part];
      if (!node || node.type !== 'directory' || !node.children) {
        return `cat: ${filepath}: No such file or directory`;
      }
      current = node.children;
    }
    
    const file = current[filename];
    if (!file) {
      return `cat: ${filepath}: No such file or directory`;
    }
    if (file.type === 'directory') {
      return `cat: ${filepath}: Is a directory`;
    }
    
    return file.content || '';
  },
  vi: () => `why use vi? try 'emacs'`,
  vim: () => `why use vim? try 'emacs'`,
  emacs: () => `why use emacs? try 'vim'`,
  echo: (args: string[]) => args.join(" "),
  sudo: (args: string[]) => {
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    return `Permission denied: unable to run the command '${args[0]}' as root.`;
  },
  theme: () => {
    // Get current history value using get()
    const historySnapshot: Command[] = get(history);
    
    // Store in sessionStorage so ThemeSelector can restore it
    try {
      sessionStorage.setItem('themeCommandHistory', JSON.stringify(historySnapshot));
    } catch (e) {
      console.error('Failed to save history to sessionStorage:', e);
    }
    
    themeSelectorActive.set(true);
    return "";
  },
  clear: () => {
    history.set([]);

    return "";
  },
  email: () => {
    return "coderzawad@gmail.com";
  },
  github: () => {
    const githubUrl = "https://github.com/Iweisc";
    window.open(githubUrl, "_blank");

    return `Opening GitHub profile: ${githubUrl}`;
  },
  weather: async (args: string[]) => {
    const city = args.join("+");

    if (!city) {
      return "Usage: weather [city]. Example: weather Brussels";
    }

    try {
      const weather = await fetch(`https://wttr.in/${city}?ATm`);
      
      if (!weather.ok) {
        return `Error: Unable to fetch weather data for "${args.join(" ")}" (Status: ${weather.status})`;
      }
      
      return await weather.text();
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Unknown error';
      return `Error: Failed to fetch weather data. ${error}`;
    }
  },
  exit: () => {
    return "Please close the tab to exit.";
  },
  todo: (args: string[]) => {
    const usage = `Usage: todo [command] [args]

Commands:
  add <text>     Add a new todo
  ls [filter]    List todos (filter: all, completed, pending)
  done <id>      Mark todo as completed
  rm <id>        Remove a todo
  clear [completed]  Clear todos (add 'completed' to clear only completed)
  stats          Show todo statistics

Examples:
  todo add Buy groceries
  todo ls
  todo ls pending
  todo done 1
  todo rm 2
  todo clear completed`;

    if (args.length === 0) {
      return usage;
    }

    const [subCommand, ...subArgs] = args;

    switch (subCommand) {
      case "add":
        if (subArgs.length === 0) {
          return "Error: Please provide todo text. Example: todo add Buy milk";
        }
        return todoManager.add(subArgs.join(" "));

      case "ls":
      case "list":
        const filter = subArgs[0] as
          | "all"
          | "completed"
          | "pending"
          | undefined;
        if (filter && !["all", "completed", "pending"].includes(filter)) {
          return "Error: Invalid filter. Use: all, completed, or pending";
        }
        return todoManager.list(filter);

      case "done":
      case "complete":
        const completeId = parseInt(subArgs[0]);
        if (isNaN(completeId)) {
          return "Error: Please provide a valid todo ID number";
        }
        return todoManager.complete(completeId);

      case "rm":
      case "remove":
      case "delete":
        const removeId = parseInt(subArgs[0]);
        if (isNaN(removeId)) {
          return "Error: Please provide a valid todo ID number";
        }
        return todoManager.remove(removeId);

      case "clear":
        const onlyCompleted = subArgs[0] === "completed";
        return todoManager.clear(onlyCompleted);

      case "stats":
        return todoManager.stats();

      default:
        return `Unknown todo command: ${subCommand}\n\n${usage}`;
    }
  },
  whoami: () => {
    return `Abdullah Al Zawad

Full-stack developer specializing in MERN/MEAN stack
Passionate about building user-friendly applications

Type 'cat about.txt' for more information
Type 'neofetch' to see my tech stack`;
  },
  pwd: () => {
    return get(currentDirectory);
  },
  cd: (args: string[]) => {
    if (args.length === 0 || args[0] === '~') {
      currentDirectory.set('~');
      return '';
    }
    
    const targetPath = args[0];
    const cwd = get(currentDirectory);
    
    // Handle .. (parent directory)
    if (targetPath === '..') {
      if (cwd === '~') {
        return ''; // Already at root
      }
      const parts = cwd.split('/').filter(p => p && p !== '~');
      parts.pop();
      currentDirectory.set(parts.length === 0 ? '~' : `~/${parts.join('/')}`);
      return '';
    }
    
    // Build the full path
    let pathParts: string[];
    if (targetPath.startsWith('~/') || targetPath.startsWith('/')) {
      pathParts = targetPath.replace('~/', '').replace(/^\//, '').split('/').filter(p => p);
    } else {
      const cwdParts = cwd.split('/').filter(p => p && p !== '~');
      pathParts = [...cwdParts, ...targetPath.split('/').filter(p => p)];
    }
    
    // Verify the directory exists
    let current: Record<string, FileNode> = filesystem;
    for (const part of pathParts) {
      const node = current[part];
      if (!node) {
        return `cd: ${targetPath}: No such file or directory`;
      }
      if (node.type !== 'directory') {
        return `cd: ${targetPath}: Not a directory`;
      }
      if (!node.children) {
        return `cd: ${targetPath}: Permission denied`;
      }
      current = node.children;
    }
    
    const newPath = pathParts.length === 0 ? '~' : `~/${pathParts.join('/')}`;
    currentDirectory.set(newPath);
    return '';
  },
  tree: () => {
    const buildTree = (node: Record<string, FileNode>, prefix: string = '', isLast: boolean = true): string => {
      const entries = Object.entries(node);
      let result = '';
      
      entries.forEach(([name, fileNode], index) => {
        const isLastEntry = index === entries.length - 1;
        const connector = isLastEntry ? '└── ' : '├── ';
        const displayName = fileNode.type === 'directory' ? `${name}/` : name;
        
        result += prefix + connector + displayName + '\n';
        
        if (fileNode.type === 'directory' && fileNode.children) {
          const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
          result += buildTree(fileNode.children, newPrefix, isLastEntry);
        }
      });
      
      return result;
    };
    
    const cwd = get(currentDirectory);
    let title = cwd === '~' ? '.' : cwd.replace('~/', '');
    
    if (cwd === '~') {
      return title + '\n' + buildTree(filesystem);
    }
    
    // Navigate to current directory
    const pathParts = cwd.split('/').filter(p => p && p !== '~');
    let current: Record<string, FileNode> = filesystem;
    
    for (const part of pathParts) {
      const node = current[part];
      if (!node || node.type !== 'directory' || !node.children) {
        return `tree: ${cwd}: No such directory`;
      }
      current = node.children;
    }
    
    return title + '\n' + buildTree(current);
  },
  neofetch: () => {
    return `
         ___        Abdullah Al Zawad
        (.. |       ---------------------
        (<> |       OS: Web Terminal
       / __  \\      Shell: zedpholio
      ( /  \\ /|     Languages: JavaScript, TypeScript, Python
     _/\\ __)/_)     Frontend: React, Svelte, Angular
     \\/-____\\/      Backend: Node.js, Flask, FastAPI
                    Tools: Docker, Git, Linux
                    
Type 'cat skills.txt' for more details
Type 'cat projects.txt' to see my projects`;
  },
};

import packageJson from "../../package.json";
import themes from "../../themes.json";
import { history } from "../stores/history";
import { theme } from "../stores/theme";
import { todoManager } from "./todo";
import { themeSelectorActive } from "../stores/themeSelector";
import { files, availableFiles } from "../data/files";

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  help: () => {
    const categories = {
      System: ["help", "clear", "date", "exit", "ls", "cat"],
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
    return `welcome.txt
about.txt
projects.txt
skills.txt
contact.txt`;
  },
  cat: (args: string[]) => {
    if (args.length === 0) {
      return `cat: missing file operand
Try 'cat [filename]' or 'ls' to see available files.`;
    }

    const filename = args[0];
    const content = files[filename];

    if (content) {
      return content;
    } else {
      return `cat: ${filename}: No such file or directory
Try 'ls' to see available files.`;
    }
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
    // Get current history value
    let historySnapshot: any[] = [];
    const unsubscribe = history.subscribe(h => {
      historySnapshot = [...h];
    });
    unsubscribe();
    
    // Store in sessionStorage so ThemeSelector can restore it
    sessionStorage.setItem('themeCommandHistory', JSON.stringify(historySnapshot));
    
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

    const weather = await fetch(`https://wttr.in/${city}?ATm`);

    return weather.text();
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
};

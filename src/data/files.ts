// File system structure
export interface FileNode {
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileNode>;
}

export const filesystem: Record<string, FileNode> = {
  'welcome.txt': {
    type: 'file',
    content: `╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  Welcome to Abdullah Al Zawad's Terminal Portfolio!          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

Hi there! Thanks for checking out my portfolio.

Getting Started:
  • Type 'help' to see all available commands
  • Type 'ls' to list files about me
  • Type 'cat <filename>' to read a file (e.g., 'cat about.txt')
  
Quick Links:
  • 'github' - Open my GitHub profile
  • 'email' - Get my email address
  
Explore:
  • 'theme' - Customize the terminal theme
  • 'todo' - Try the todo manager
Fun:
  • 'vi' - Open the vi editor
  • 'vim' - Open the vim editor
  • 'emacs' - Open the emacs editor
  • 'sudo' - Try it out and find out what happens
  • 'echo' - Print the given argument

Type any command to get started!`
  },
  'about.txt': {
    type: 'file',
    content: `Hi! I'm Abdullah Al Zawad,  

I love working with modern web technologies and building
user-friendly applications, let's work as an agile team together. 

I specialize in MERN/MEAN stack, for lightweight applications i like to use MFRN stack (F=Flask)`
  },
  'docs': {
    type: 'directory',
    children: {
      'skills.txt': {
        type: 'file',
        content: `Technical Skills:
==================

Languages:
  • JavaScript/TypeScript
  • Python
  • HTML/CSS

Frameworks & Libraries:
  • Svelte/SvelteKit
  • React
  • Node.js
  • Uvicorn 
  • Flask 
  • Angular 


Tools & Technologies:
  • Git & GitHub
  • Docker
  • Linux/Unix
  • VS Code
  • MacOS

Currently Learning:
  • I'm currently learning Svelte`
      },
      'experience.txt': {
        type: 'file',
        content: `Work Experience:
================

[Add your work experience here]

Format:
-------
Position Title | Company Name
Duration: Month Year - Present/Month Year
Location: City, Country

• Key responsibility or achievement
• Key responsibility or achievement
• Key responsibility or achievement

---

Use 'cat docs/experience.txt' to view this file.`
      },
      'education.txt': {
        type: 'file',
        content: `Education:
==========

[Add your education details here]

Format:
-------
Degree Name
Institution Name
Duration: Year - Year
Location: City, Country

• Relevant coursework
• Academic achievements
• Extracurricular activities

---

Use 'cat docs/education.txt' to view this file.`
      }
    }
  },
  'contact': {
    type: 'directory',
    children: {
      'info.txt': {
        type: 'file',
        content: `Contact Information:
====================

Feel free to reach out to me:

Email: coderzawad@gmail.com
GitHub: github.com/Iweisc

Commands:
  • Type 'email' to see my email
  • Type 'github' to open my GitHub profile

I'm always open to interesting projects and opportunities!`
      },
      'social-links.txt': {
        type: 'file',
        content: `Social Links:
=============

GitHub:
  • https://github.com/Iweisc
  • Command: 'github'

Email:
  • coderzawad@gmail.com
  • Command: 'email'

LinkedIn:
  • https://www.linkedin.com/in/abdullah-al-zawad-0bb88b340/

Twitter/X:
  • https://x.com/coderzawad

Portfolio:
  • You're already here!

---

Use 'cat contact/social-links.txt' to view this file.`
      }
    }
  },
  'misc': {
    type: 'directory',
    children: {
      'quotes.txt': {
        type: 'file',
        content: `Favorite Quotes:
================

"Code is like humor. When you have to explain it, it's bad."
  - Cory House

"First, solve the problem. Then, write the code."
  - John Johnson

"The best error message is the one that never shows up."
  - Thomas Fuchs

"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
  - Martin Fowler

---

Use 'cat misc/quotes.txt' to view this file.`
      },
      'easter-eggs.txt': {
        type: 'file',
        content: `Easter Eggs:
============

Congratulations! You found the easter eggs file!

Here are some fun commands to try:
  • 'sudo' - What happens when you try to use sudo?
  • 'vi' or 'vim' - Editor jokes
  • 'emacs' - Another editor joke
  • 'tree' - See the full file structure

Hidden features:
  • Press 'i' in theme selector to search
  • Use hjkl or arrow keys in theme selector
  • Tab completion works with file paths

More secrets:
  • Try misspelling commands to see smart suggestions
  • The terminal remembers your username
  • Themes persist across sessions

---

Use 'cat misc/easter-eggs.txt' to view this file.`
      }
    }
  },
  'projects': {
    type: 'directory',
    children: {
      'README.md': {
        type: 'file',
        content: `Projects Directory
==================

This directory contains detailed information about my projects.

Available projects:
  • verisum.md - Instant website information finder
  • readaloud.md - PDF/ebook reader reimagined
  • censorship-api.md - High-performance censorship API

Usage:
  cd projects          Navigate to this directory
  ls                   List all project files
  cat verisum.md      Read about Verisum project
  
Or directly from ~:
  cat projects/verisum.md`
      },
      'verisum.md': {
        type: 'file',
        content: `Verisum
=======

Instantly find, summarize, and verify information from a website

Tech Stack:
-----------
  - Preact
  - TypeScript
  - OpenAI backend
  - tts-service (self-hostable)
  - VectorDB & embeddings
  - chrome:storage

Features:
---------
  - Spotlight: Instantly do Q&A with data pulled directly 
    from the website
  - PopUP: Do Q&A and verify the websites information

Links:
------
  Type 'github' to see more projects on GitHub!`
      },
      'readaloud.md': {
        type: 'file',
        content: `ReadAloud
=========

Reading pdf/ebooks reimagined

Tech Stack:
-----------
  - React
  - Flask
  - Custom PDF processor
  - Kokoro.js
  - Transformers.js
  - Custom flipbook reader
  - Custom PDF viewer
  - OCR
  - Custom image processor

Features:
---------
  - Natural reading experience with flipbook interface
  - Text-to-speech integration for accessibility
  - Smart page turning algorithms
  - OCR for scanned documents

Links:
------
  Type 'github' to see more projects on GitHub!`
      },
      'censorship-api.md': {
        type: 'file',
        content: `Censorship API
==============

A highly performant censorship API

Performance:
------------
  - Text input: sub-10ms average
  - Large PDF files: 2-3s processing time
  - With cache: as low as 0.6ms

Tech Stack:
-----------
  - FastAPI
  - RoBERTa-large
  - Pillow
  - pdf2image
  - pytesseract
  - thefuzz
  - uvicorn

Features:
---------
  - Real-time text censorship with high accuracy
  - Batch PDF file processing
  - Intelligent caching system
  - High throughput for production use

Links:
------
  Type 'github' to see more projects on GitHub!`
      }
    }
  }
};

// Helper to get all files and directories recursively
function getAllPaths(fs: Record<string, FileNode>, prefix = ''): string[] {
  const paths: string[] = [];
  
  for (const [name, node] of Object.entries(fs)) {
    const fullPath = prefix ? `${prefix}/${name}` : name;
    paths.push(fullPath);
    
    if (node.type === 'directory' && node.children) {
      paths.push(...getAllPaths(node.children, fullPath));
    }
  }
  
  return paths;
}

// Helper to get only directories (for cd command)
function getAllDirectories(fs: Record<string, FileNode>, prefix = ''): string[] {
  const dirs: string[] = [];
  
  for (const [name, node] of Object.entries(fs)) {
    if (node.type === 'directory') {
      const fullPath = prefix ? `${prefix}/${name}` : name;
      dirs.push(fullPath);
      
      if (node.children) {
        dirs.push(...getAllDirectories(node.children, fullPath));
      }
    }
  }
  
  return dirs;
}

/**
 * Get files and directories in a specific directory
 * @param currentDir - Current working directory (e.g., '~', '~/docs')
 * @returns Array of files and directories in current directory
 */
export function getFilesInDirectory(currentDir: string): string[] {
  if (currentDir === '~') {
    return Object.keys(filesystem);
  }
  
  // Navigate to the directory
  const pathParts = currentDir.split('/').filter(p => p && p !== '~');
  let current: Record<string, FileNode> = filesystem;
  
  for (const part of pathParts) {
    const node = current[part];
    if (!node || node.type !== 'directory' || !node.children) {
      return [];
    }
    current = node.children;
  }
  
  return Object.keys(current);
}

/**
 * Get only directories in a specific directory
 * @param currentDir - Current working directory
 * @returns Array of directories in current directory
 */
export function getDirectoriesInDirectory(currentDir: string): string[] {
  if (currentDir === '~') {
    return Object.entries(filesystem)
      .filter(([_, node]) => node.type === 'directory')
      .map(([name]) => name);
  }
  
  // Navigate to the directory
  const pathParts = currentDir.split('/').filter(p => p && p !== '~');
  let current: Record<string, FileNode> = filesystem;
  
  for (const part of pathParts) {
    const node = current[part];
    if (!node || node.type !== 'directory' || !node.children) {
      return [];
    }
    current = node.children;
  }
  
  return Object.entries(current)
    .filter(([_, node]) => node.type === 'directory')
    .map(([name]) => name);
}

/**
 * Resolve a path relative to current directory
 * @param currentDir - Current working directory
 * @param partialPath - Partial path being typed (could be relative or absolute)
 * @returns Resolved options for tab completion
 */
export function resolvePathForCompletion(
  currentDir: string,
  partialPath: string,
  directoriesOnly = false
): string[] {
  // Handle absolute paths (starting with ~/ or /)
  if (partialPath.startsWith('~/') || partialPath.startsWith('/')) {
    const cleanPath = partialPath.replace('~/', '').replace(/^\//, '');
    const parts = cleanPath.split('/');
    const dirPart = parts.slice(0, -1).join('/');
    const filePart = parts[parts.length - 1];
    
    // Get files in the target directory
    const targetDir = dirPart ? `~/${dirPart}` : '~';
    const options = directoriesOnly 
      ? getDirectoriesInDirectory(targetDir)
      : getFilesInDirectory(targetDir);
    
    return options
      .filter(name => name.startsWith(filePart))
      .map(name => dirPart ? `${dirPart}/${name}` : name);
  }
  
  // Handle relative paths
  const parts = partialPath.split('/');
  
  if (parts.length === 1) {
    // Just a filename/dirname in current directory
    const options = directoriesOnly 
      ? getDirectoriesInDirectory(currentDir)
      : getFilesInDirectory(currentDir);
    return options.filter(name => name.startsWith(partialPath));
  }
  
  // Navigate through relative path
  const dirParts = parts.slice(0, -1);
  const filePart = parts[parts.length - 1];
  
  // Build the target directory path
  let targetDir = currentDir;
  for (const part of dirParts) {
    if (part === '..') {
      // Go up one directory
      const targetParts = targetDir.split('/').filter(p => p && p !== '~');
      targetParts.pop();
      targetDir = targetParts.length > 0 ? `~/${targetParts.join('/')}` : '~';
    } else if (part !== '.') {
      targetDir = targetDir === '~' ? `~/${part}` : `${targetDir}/${part}`;
    }
  }
  
  const options = directoriesOnly 
    ? getDirectoriesInDirectory(targetDir)
    : getFilesInDirectory(targetDir);
  
  return options
    .filter(name => name.startsWith(filePart))
    .map(name => `${dirParts.join('/')}/${name}`);
}

// Export available files for tab completion
export const availableFiles = Object.keys(filesystem);

// Export all paths (files and directories) for cat/ls tab completion
export const allPaths = getAllPaths(filesystem);

// Export all directories for cd tab completion
export const allDirectories = getAllDirectories(filesystem);



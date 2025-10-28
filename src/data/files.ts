export const files: Record<string, string> = {
  "welcome.txt": `╔══════════════════════════════════════════════════════════════╗
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

Type any command to get started!`,

  "about.txt": `Hi! I'm Abdullah Al Zawad,  

I love working with modern web technologies and building
user-friendly applications, let's work as an agile team together. 

I specialize in MERN/MEAN stack, for lightweight applications i like to use MFRN stack (F=Flask)`,

  "projects.txt": `Current Projects:
==================

1. Verisum
   - Instantly find, summarize, and verify information from a website  
   - Built with Preact, TypeScript, OpenAI backend, tts-service(self-hostable), vectorDB, embeddings, chrome:storage. 
   - Features: Spotlight (Instantly do Q&A with data pulled directly from the website), PopUP (Do Q&A and verify the websites information) 

2. ReadAloud 
   - Reading pdf/ebooks reimagined. 
   - Bult with React, Flask, custom pdf processor, kokoro.js, transformers.js, custom flipbook reader, custom pdf viewer, OCR, custom image processor. 

3. Censorship API
   - Its a highly performant censorship api that censors text input under ≈ sub-10ms. The api is also capable of censor large pdf files under 2-3s (With cache can go as low as 0.6ms)
   - Built with FastAPI, RoBERTa-large, pillow, pdf2image, pytesseract, thefuzz, uvicorn.  

Try 'github' to see more on my GitHub profile!`,

  "skills.txt": `Technical Skills:
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
  • I'm currently learning Svelte`,

  "contact.txt": `Contact Information:
====================

Feel free to reach out to me:

Email: coderzawad@gmail.com
GitHub: github.com/Iweisc

Commands:
  • Type 'email' to see my email
  • Type 'github' to open my GitHub profile

I'm always open to interesting projects and opportunities!`,
};

// Export the list of available files for tab completion
export const availableFiles = Object.keys(files);

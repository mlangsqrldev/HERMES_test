# HERMES (Heritage Metadata Entry System)

HERMES is a desktop application built with [Tauri](https://tauri.app/) and [Vue 3](https://vuejs.org/) (via [Vite](https://vitejs.dev/)). It facilitates the entry and management of heritage metadata, providing a user-friendly interface with support for English and German languages. Metadata can be exported as BagIt archive or CARARE XML.

## Features

- Built with Tauri, Vue 3, Tailwind CSS, and DaisyUI.
- Cross-platform desktop application.
- Multi-language support (English / German).
- Local storage and metadata entry functionalities.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the application in development mode:

   ```bash
   npm run tauri dev
   ```

3. Build the application:
   ```bash
   npm run tauri build
   ```

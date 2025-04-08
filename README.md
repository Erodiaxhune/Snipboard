# Snipboard

Snipboard is an open-source, free-to-use clipboard manager inspired by [pasteboard.app](https://www.pasteboard.app). It helps you manage your code snippets, images, text, and URLs all in one place. Built on **Electron** and **Vite React**, Snipboard provides a lightweight yet powerful experience, backed by **LevelDB** for persistent storage.

## Key Features

- **Multiple Snip Types**: Supports code, text, image, and URL entries.
- **Persistent Storage**: Stores your clipboard history in a LevelDB database for fast lookups and reliability.
- **Lightweight**: Built with Electron and optimized with Vite React for a quick startup and smooth performance.
- **Visual Data Display**: Uses [deck.gl](https://deck.gl/) canvas for an interactive and modern UI.
- **Build with Electron Forge**: Easily package, distribute, and auto-update your Snipboard app.

## Upcoming Features

- **Storage Backup**: Automatic backups and restore functionality.
- **Cross-Device Access**: Seamlessly sync your snips across devices.
- **UI/UX Improvements**: Refined design for a better user experience.
- **Enhanced Persistence**: More robust data storage solutions.
- **Faster Response**: Performance optimizations and caching strategies.

## Technology Stack

- **Electron**: Cross-platform desktop application framework.
- **Vite + React**: Lightning-fast development server and modern UI library.
- **TailwindCSS**: Fast lightweight clean styling framework.
- **deck.gl**: High-performance data visualization for the canvas.
- **Level**: Embedded key-value database (LevelDB) for persistence.
- **Electron Forge**: Streamlined build and packaging process.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Bamsey857/Snipboard.git
   ```

2. **Navigate into the project directory**:
   ```bash
   cd Snipboard
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Start the development build**:
   ```bash
   pnpm run dev
   ```
5. **Build the production package** (optional):
   ```bash
   pnpm run make
   ```
   This command uses Electron Forge to package the app for your current platform.

## Usage

- **Run**: Once the app starts, you can copy any text, code, image, or URL, and it will appear in your Snipboard history.
- **Search**: Quickly filter your snips by using the built-in search bar.
- **Pinning**: Keep important snips at the top of your list by pinning them.
- **Clearing**: Easily clear non-pinned snips when you need a fresh start.

## Contributing

Contributions are welcome! Whether you’re fixing a bug, adding a feature, or improving documentation, we appreciate your help. Please open an issue or submit a pull request on GitHub.

1. Fork the project
2. Create a new feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

Snipboard is released under the [MIT License](./LICENSE). Feel free to use, modify, and distribute this software as you wish.

---

Enjoy using **Snipboard**! We’re excited to hear your feedback and contributions as we continue to add new features and refine the experience.

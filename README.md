# FinishLine – Session and Task Tracker

A modern productivity app built with [Preact](https://preactjs.com/) and [DaisyUI](https://daisyui.com/) for tracking sessions and tasks, complete with analytics, keyboard shortcuts, and theme switching.


## ✨ Features

- **Sessions:** Create, edit, delete, and export task sessions
- **Task Timer:** Track time per task with pause/resume
- **Analytics:** Visualize progress/history with live charts
- **Deadlines & ETA:** See dynamic alerts and completion forecasts
- **Undo/Redo:** Revert or repeat actions easily
- **Keyboard Shortcuts:** Fast workflow for power users
- **Light/Dark Theme Switch:** Persistent, one-click toggle


## 🔑 Keyboard Shortcuts

| Shortcut         | Action              |
|------------------|--------------------|
| Space            | Complete task      |
| Ctrl/Cmd + Z     | Undo               |
| Ctrl/Cmd + Y     | Redo               |
| Ctrl/Cmd + N     | New session       |
| Ctrl/Cmd + S     | Edit session       |
| Ctrl/Cmd + P     | Start/Pause        |


## 📁 Project Structure
```
src/
    App.tsx # Main application container
    components/ # UI components (Navbar, Modals, Stats, etc.)
    hooks/ # Custom React/Preact hooks
    utils/ # Utility functions (formatting, storage, etc.)
    context/
        ThemeContext.tsx # Global theme context/provider
    types.ts # TypeScript type definitions
    constants.ts # App constants (keys, etc.)
    index.css # Tailwind/DaisyUI styles
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or newer recommended)
- **npm** (v9 or newer)

### Installation

```
npm install
```

### Development

```
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```
npm run build
npm run preview
```

This will build and preview your production-ready app.

## 🤝 Contributing

Bug reports, feature requests, and pull requests are welcome!
Please open an issue or PR if you have suggestions or find a bug.

## 📄 License

MIT

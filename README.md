# Memory

A browser-based two-player card memory game built with TypeScript, Vite, and SCSS — no external UI framework.

---

## Features

- **Two themes** — Code Vibes (tech icons) and Gaming (retro game icons)
- **Two players** — Blue and Orange, taking turns
- **Three board sizes** — 16, 24, or 36 cards
- **Fisher-Yates shuffle** — randomised card placement every game
- **Score tracking** — per-player score updated in real time
- **End-game overlay** — shows the winner or a draw with theme-specific visuals
- **Exit confirmation popup** — slide-in popup with backdrop to prevent accidental exits
- **Settings persistence** — selections stored in `localStorage` and read back on game start
- **TypeDoc API documentation** — auto-generated from JSDoc comments

---

## Tech Stack

| Tool                                          | Purpose                                      |
| --------------------------------------------- | -------------------------------------------- |
| [TypeScript](https://www.typescriptlang.org/) | Typed application logic                      |
| [Vite](https://vitejs.dev/)                   | Dev server, multi-page build, asset bundling |
| [Sass / SCSS](https://sass-lang.com/)         | Modular stylesheets                          |
| [TypeDoc](https://typedoc.org/)               | API documentation generation                 |

---

## Project Structure

```
memory/
├── index.html                  # Landing page
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── fonts/                  # Variable fonts (Red Rose, Orbitron)
│   └── img/
│       ├── code-theme/         # SVG icons for the Code Vibes theme
│       └── gaming-theme/       # SVG icons for the Gaming theme
├── src/
│   ├── main.ts                 # Entry point for the landing page
│   ├── global.d.ts             # Global type declarations
│   ├── models/
│   │   └── card.class.ts       # Card class (state + DOM rendering)
│   ├── pages/
│   │   ├── settings.html       # Settings page
│   │   └── game.html           # Game page
│   ├── scripts/
│   │   ├── settings.ts         # Settings page logic
│   │   └── game.ts             # Core game logic
│   └── styles/
│       ├── styles.scss         # Global styles & fonts
│       ├── landingPage.scss
│       ├── settings.scss
│       ├── game.scss
│       └── components/
│           ├── _button.scss
│           └── _card.scss
└── docs/                       # TypeDoc output (generated)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### Install

```bash
npm install
```

### Available Scripts

| Script           | Command           | Description                                    |
| ---------------- | ----------------- | ---------------------------------------------- |
| Dev server       | `npm run dev`     | Starts Vite dev server with HMR                |
| Production build | `npm run build`   | Type-checks with `tsc`, then bundles with Vite |
| Preview build    | `npm run preview` | Serves the production build locally            |
| Generate docs    | `npm run docs`    | Runs TypeDoc and outputs to `docs/`            |

#### Details

**`npm run dev`**
Starts the Vite development server at `http://localhost:5173` (default). Hot Module Replacement (HMR) applies CSS and script changes instantly without a full page reload.

**`npm run build`**
Runs in two steps:

1. `tsc -noEmit` — type-checks the entire project without emitting any files; the build aborts on type errors.
2. `vite build` — bundles all three entry points (`index.html`, `src/pages/settings.html`, `src/pages/game.html`) into `dist/` with the base path `/memory/`.

**`npm run preview`**
Serves the contents of `dist/` locally so you can verify the production build before deploying. Requires `npm run build` to have been run first.

**`npm run docs`**
Runs TypeDoc with `--entryPointStrategy expand` across the entire `src/` directory and writes the generated API documentation to `docs/`. Open `docs/index.html` in a browser to browse it.

---

## How to Play

1. **Landing page** — Click **Play** to open the settings page.
2. **Settings page** — Choose your options:
   - **Theme** — Code Vibes or Gaming
   - **Starting player** — Blue or Orange
   - **Board size** — 16, 24, or 36 cards

   The **Start** button activates only when all three options are selected. Selections are saved to `localStorage` before navigating to the game.

3. **Game page** — Players take turns flipping two cards:
   - **Match** — Both cards stay face-up; the current player scores a point and takes another turn.
   - **Mismatch** — Both cards flip back after a short delay; the turn passes to the other player.
4. **End screen** — When all pairs are matched, an overlay appears showing the winner (or a draw). Theme-specific visuals are shown (trophy for Gaming theme, confetti + winner badge for Code Vibes theme).

5. **Exit** — Click the exit button in the header to open a confirmation popup. Confirm to return to the landing page, or dismiss to keep playing.

---

## Architecture

### `Card` Class (`src/models/card.class.ts`)

Represents a single card on the board.

| Member                             | Description                                           |
| ---------------------------------- | ----------------------------------------------------- |
| `id`                               | Unique string identifier                              |
| `value`                            | Card name used for match comparison                   |
| `frontImagePath` / `backImagePath` | SVG asset paths                                       |
| `isFlipped`                        | Whether the card is currently face-up                 |
| `isMatched`                        | Whether the card has been matched                     |
| `flip()`                           | Toggles `isFlipped` and the `is-flipped` CSS class    |
| `setMatched(true)`                 | Marks the card as permanently matched                 |
| `render()`                         | Creates and returns the card's `<button>` DOM element |

### Settings (`src/scripts/settings.ts`)

The settings page reads radio inputs for **theme**, **player**, and **boardSize**, updates a live summary, and persists the selections to `localStorage` as `gameSettings` when **Start** is clicked.

### Game Logic (`src/scripts/game.ts`)

The game loads `gameSettings` from `localStorage` on init and manages the following state:

| Variable        | Description                                             |
| --------------- | ------------------------------------------------------- |
| `cards`         | Array of all `Card` instances for the current game      |
| `currentPlayer` | `"blue"` or `"orange"`                                  |
| `scores`        | `{ blue: number, orange: number }`                      |
| `flippedCards`  | Cards currently flipped and awaiting comparison (max 2) |
| `isLocked`      | Prevents clicks during mismatch animation               |

Key initialisation steps on `DOMContentLoaded`:

1. `loadSettings()` — reads `gameSettings` from `localStorage`
2. `createCards()` — picks a shuffled subset of theme icons, creates card pairs
3. `renderCards()` — appends card elements to the grid and sets `--grid-cols` CSS variable
4. `updatePlayerIcons()` — sets theme-correct player avatars
5. `setupExitPopup()` / `setupExitButtonHover()` — attaches UI event listeners

---

## Themes

### Code Vibes Theme

18 tech-icon cards (Angular, Bootstrap, CSS, Django, Firebase, Git, GitHub, HTML, JavaScript, Node, Python, React, Sass, TypeScript, VS Code, Vue, …). Player avatars and the overlay winner badge use matching code-theme SVGs.

### Gaming Theme

18 retro-gaming icon cards (Banana, Coin, Controller, Dice, Game Boy, Labyrinth, Mushroom, Pac-Man, Pixel Face, Snake, …). The end-game overlay shows a trophy instead of a winner badge.

---

## API Documentation

Generate and open the TypeDoc documentation:

```bash
npm run docs
```

Output is written to `docs/`. Open `docs/index.html` in a browser to browse the full API reference.

---

## License

ISC

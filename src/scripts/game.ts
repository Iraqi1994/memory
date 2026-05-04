import "../styles/styles.scss";
import "../styles/game.scss";
import { Card } from "../models/card.class";

const CODE_THEME_CARDS = [
  "angular",
  "bootstrap",
  "cli",
  "css",
  "database",
  "django",
  "firebase",
  "git",
  "github",
  "html",
  "javascript",
  "node",
  "python",
  "react",
  "sass",
  "typescript",
  "vscode",
  "vue",
];

const GAMING_THEME_CARDS = [
  "banana",
  "card",
  "circle",
  "coin",
  "controller",
  "dice",
  "gameboy",
  "labyrinth",
  "levelup",
  "mushroom",
  "pacman",
  "pacman2",
  "pixelface",
  "play",
  "puzzle",
  "rectangle",
  "snake",
  "triangle",
];

const GRID_COLS: Record<string, number> = {
  "16": 4,
  "24": 6,
  "36": 6,
};

interface GameSettings {
  theme: string;
  player: "blue" | "orange";
  boardSize: string;
}

let cards: Card[] = [];
let currentPlayer: "blue" | "orange" = "blue";
let scores = { blue: 0, orange: 0 };
let flippedCards: Card[] = [];
let isLocked = false;

let settings: GameSettings | null = null;
let fieldRef: HTMLElement | null = null;
let currentPlayerImg: HTMLImageElement | null = null;
let scoreBlueEl: HTMLElement | null = null;
let scoreOrangeEl: HTMLElement | null = null;
let overlay: HTMLElement | null = null;
let overlayTitle: HTMLElement | null = null;
let overlayScores: HTMLElement | null = null;
let playerBlueImg: HTMLImageElement | null = null;
let playerOrangeImg: HTMLImageElement | null = null;
let exitButton: HTMLButtonElement | null = null;
let exitButtonImg: HTMLImageElement | null = null;
let exitPopupBackdrop: HTMLElement | null = null;
let exitPopup: HTMLElement | null = null;
let backToGameButton: HTMLButtonElement | null = null;

const base = import.meta.env.BASE_URL;

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initDOMElements(): void {
  fieldRef = document.querySelector<HTMLElement>("#field");
  currentPlayerImg = document.querySelector<HTMLImageElement>("#currentPlayerImg");
  scoreBlueEl = document.querySelector<HTMLElement>("#scoreBlue");
  scoreOrangeEl = document.querySelector<HTMLElement>("#scoreOrange");
  overlay = document.querySelector<HTMLElement>("#gameOverlay");
  overlayTitle = document.querySelector<HTMLElement>("#overlayTitle");
  overlayScores = document.querySelector<HTMLElement>("#overlayScores");
  playerBlueImg = document.querySelector<HTMLImageElement>(".player-blue img");
  playerOrangeImg = document.querySelector<HTMLImageElement>(".player-orange img");
  exitButton = document.querySelector<HTMLButtonElement>("header .button");
  exitButtonImg = exitButton?.querySelector<HTMLImageElement>("img") ?? null;
  exitPopupBackdrop = document.querySelector<HTMLElement>("#exitPopupBackdrop");
  exitPopup = document.querySelector<HTMLElement>("#exitPopup");
  backToGameButton = document.querySelector<HTMLButtonElement>("#backToGameButton");
}

function loadSettings(): void {
  const raw = localStorage.getItem("gameSettings");
  settings = raw ? JSON.parse(raw) : null;
}

function createCards(): void {
  if (!settings) return;
  const isGaming = settings.theme === "gamingTheme";
  const pool = isGaming ? GAMING_THEME_CARDS : CODE_THEME_CARDS;
  const folder = isGaming ? "gaming-theme" : "code-theme";
  const backName = isGaming ? "card-back-gaming-theme" : "card-back-code-theme";
  const backPath = `${base}img/${folder}/${backName}.svg`;
  const pairsNeeded = Number(settings.boardSize) / 2;
  const selected = shuffle(pool).slice(0, pairsNeeded);
  let idCounter = 0;
  cards = shuffle(
    selected.flatMap((name) => [
      new Card(String(++idCounter), name, `${base}img/${folder}/${name}.svg`, backPath),
      new Card(String(++idCounter), name, `${base}img/${folder}/${name}.svg`, backPath),
    ]),
  );
}

function renderCards(): void {
  if (!fieldRef || !settings) return;

  fieldRef.style.setProperty("--grid-cols", String(GRID_COLS[settings.boardSize] ?? 4));
  cards.forEach((card) => fieldRef!.appendChild(card.render()));
}

function updatePlayerIcons(): void {
  if (!settings) return;

  const isGaming = settings.theme === "gamingTheme";
  const themeFolder = isGaming ? "gaming-theme" : "code-theme";
  const themeSuffix = isGaming ? "gaming-theme" : "code-theme";

  if (playerBlueImg) {
    playerBlueImg.src = `${base}img/${themeFolder}/blue-${themeSuffix}.svg`;
  }
  if (playerOrangeImg) {
    playerOrangeImg.src = `${base}img/${themeFolder}/orange-${themeSuffix}.svg`;
  }
  if (currentPlayerImg) {
    currentPlayerImg.src = `${base}img/${themeFolder}/${currentPlayer}-${themeSuffix}.svg`;
    currentPlayerImg.alt = currentPlayer === "blue" ? "Blue Player" : "Orange Player";
  }
}

function updateCurrentPlayerDisplay(): void {
  if (!currentPlayerImg || !settings) return;

  const isGaming = settings.theme === "gamingTheme";
  const themeFolder = isGaming ? "gaming-theme" : "code-theme";
  const themeSuffix = isGaming ? "gaming-theme" : "code-theme";

  currentPlayerImg.src = `${base}img/${themeFolder}/${currentPlayer}-${themeSuffix}.svg`;
  currentPlayerImg.alt = currentPlayer === "blue" ? "Blue Player" : "Orange Player";
}

function updateScores(): void {
  if (scoreBlueEl) scoreBlueEl.textContent = String(scores.blue);
  if (scoreOrangeEl) scoreOrangeEl.textContent = String(scores.orange);
}

function handleMatch(): void {
  flippedCards[0].setMatched(true);
  flippedCards[1].setMatched(true);
  scores[currentPlayer]++;
  updateScores();
  flippedCards = [];
  isLocked = false;

  if (cards.every((c) => c.isMatched)) {
    setTimeout(() => showOverlay(), 400);
  }
}

function handleMismatch(): void {
  const [first, second] = flippedCards;
  flippedCards = [];
  setTimeout(() => {
    first.flip();
    second.flip();
    currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
    updateCurrentPlayerDisplay();
    isLocked = false;
  }, 1000);
}

function showOverlay(): void {
  if (!overlay || !overlayTitle || !overlayScores) return;

  if (scores.blue > scores.orange) {
    overlayTitle.textContent = "BLUE WINS!";
  } else if (scores.orange > scores.blue) {
    overlayTitle.textContent = "ORANGE WINS!";
  } else {
    overlayTitle.textContent = "DRAW";
  }

  overlayScores.textContent = `Blue ${scores.blue} – ${scores.orange} Orange`;
  overlay.classList.add("game-overlay--visible");
}

function showExitPopup(): void {
  if (!exitPopupBackdrop || !exitPopup) return;
  exitPopup.classList.remove("exit-popup--slide-out");
  exitPopupBackdrop.classList.add("exit-popup-backdrop--visible");
  exitPopup.classList.add("exit-popup--slide-in");
}

function hideExitPopup(): void {
  if (!exitPopupBackdrop || !exitPopup) return;
  exitPopup.classList.remove("exit-popup--slide-in");
  exitPopup.classList.add("exit-popup--slide-out");
  exitPopup.addEventListener(
    "animationend",
    () => {
      exitPopupBackdrop!.classList.remove("exit-popup-backdrop--visible");
    },
    { once: true },
  );
}

function setupExitPopup(): void {
  if (!exitButton || !backToGameButton || !exitPopupBackdrop) return;
  exitButton.addEventListener("click", showExitPopup);
  backToGameButton.addEventListener("click", hideExitPopup);
  exitPopupBackdrop.addEventListener("click", (event) => {
    if (event.target === exitPopupBackdrop) hideExitPopup();
  });
}

function setupExitButtonHover(): void {
  if (!exitButton || !exitButtonImg || !settings) return;

  const isGaming = settings.theme === "gamingTheme";
  const defaultIcon = `${base}img/exit-game.svg`;
  const hoverIcon = isGaming ? `${base}img/exit-game-red.svg` : `${base}img/exit-game.svg`;

  exitButton.addEventListener("mouseenter", () => {
    if (exitButtonImg) {
      exitButtonImg.src = hoverIcon;
    }
  });

  exitButton.addEventListener("mouseleave", () => {
    if (exitButtonImg) {
      exitButtonImg.src = defaultIcon;
    }
  });
}

function handleCardClick(event: Event): void {
  if (isLocked) return;

  const cardElement = (event.target as HTMLElement).closest(".card") as HTMLButtonElement;
  if (!cardElement) return;

  const cardId = cardElement.dataset.cardId;
  const card = cards.find((c) => c.id === cardId);
  if (!card || card.isFlipped || card.isMatched) return;

  card.flip();
  flippedCards.push(card);

  if (flippedCards.length < 2) return;

  isLocked = true;

  if (flippedCards[0].value === flippedCards[1].value) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

function init(): void {
  loadSettings();
  if (!settings) return;
  initDOMElements();
  if (!fieldRef) return;
  document.body.dataset.theme = settings.theme;
  currentPlayer = settings.player;
  createCards();
  renderCards();
  updatePlayerIcons();
  updateCurrentPlayerDisplay();
  setupExitButtonHover();
  setupExitPopup();
  fieldRef.addEventListener("click", handleCardClick);
}

init();

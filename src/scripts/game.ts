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
let overlaySubtitle: HTMLElement | null = null;
let overlayTopImg: HTMLImageElement | null = null;
let overlayWinnerImg: HTMLImageElement | null = null;
let playerBlueImg: HTMLImageElement | null = null;
let playerOrangeImg: HTMLImageElement | null = null;
let exitButton: HTMLButtonElement | null = null;
let exitButtonImg: HTMLImageElement | null = null;
let overlayDraw: HTMLElement | null = null;
let overlayDrawIcon: HTMLImageElement | null = null;
let exitPopupBackdrop: HTMLElement | null = null;
let exitPopup: HTMLElement | null = null;
let backToGameButton: HTMLButtonElement | null = null;

const base = import.meta.env.BASE_URL;

/** Shuffles an array in place using Fisher-Yates and returns a new shuffled copy.
 * @param array - The array to shuffle.
 * @returns A new shuffled array.
 */
const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/** Queries and assigns all required DOM element references to module-level variables. */
const initDOMElements = (): void => {
  fieldRef = document.querySelector<HTMLElement>("#field");
  currentPlayerImg = document.querySelector<HTMLImageElement>("#currentPlayerImg");
  scoreBlueEl = document.querySelector<HTMLElement>("#scoreBlue");
  scoreOrangeEl = document.querySelector<HTMLElement>("#scoreOrange");
  overlay = document.querySelector<HTMLElement>("#gameOverlay");
  overlayTitle = document.querySelector<HTMLElement>("#overlayTitle");
  overlaySubtitle = document.querySelector<HTMLElement>("#overlaySubtitle");
  overlayTopImg = document.querySelector<HTMLImageElement>("#overlayTopImg");
  overlayWinnerImg = document.querySelector<HTMLImageElement>("#overlayWinnerImg");
  playerBlueImg = document.querySelector<HTMLImageElement>(".player-blue img");
  playerOrangeImg = document.querySelector<HTMLImageElement>(".player-orange img");
  exitButton = document.querySelector<HTMLButtonElement>("header .button");
  exitButtonImg = exitButton?.querySelector<HTMLImageElement>("img") ?? null;
  overlayDraw = document.querySelector<HTMLElement>("#overlayDraw");
  overlayDrawIcon = document.querySelector<HTMLImageElement>("#overlayDrawIcon");
  exitPopupBackdrop = document.querySelector<HTMLElement>("#exitPopupBackdrop");
  exitPopup = document.querySelector<HTMLElement>("#exitPopup");
  backToGameButton = document.querySelector<HTMLButtonElement>("#backToGameButton");
};

/** Loads game settings from `localStorage` into the `settings` variable. */
const loadSettings = (): void => {
  const raw = localStorage.getItem("gameSettings");
  settings = raw ? JSON.parse(raw) : null;
};

/** Creates and shuffles the full set of card pairs based on the current settings. */
const createCards = (): void => {
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
};

/** Sets the CSS grid column count and appends all card elements to the field. */
const renderCards = (): void => {
  if (!fieldRef || !settings) return;

  fieldRef.style.setProperty("--grid-cols", String(GRID_COLS[settings.boardSize] ?? 4));
  cards.forEach((card) => fieldRef!.appendChild(card.render()));
};

/** Sets the theme-correct icon for both player avatars and the current-player indicator. */
const updatePlayerIcons = (): void => {
  if (!settings) return;
  const isGaming = settings.theme === "gamingTheme";
  const themeFolder = isGaming ? "gaming-theme" : "code-theme";
  const themeSuffix = isGaming ? "gaming-theme" : "code-theme";
  applyPlayerIconSrcs(themeFolder, themeSuffix);
};

/** Applies theme-correct image sources to the blue player, orange player, and current-player indicator elements.
 * @param themeFolder - The image sub-folder for the active theme (e.g. `"code-theme"`).
 * @param themeSuffix - The filename suffix for the active theme (e.g. `"code-theme"`).
 */
const applyPlayerIconSrcs = (themeFolder: string, themeSuffix: string): void => {
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
};

/** Updates the current-player indicator image to reflect `currentPlayer` and the active theme. */
const updateCurrentPlayerDisplay = (): void => {
  if (!currentPlayerImg || !settings) return;

  const isGaming = settings.theme === "gamingTheme";
  const themeFolder = isGaming ? "gaming-theme" : "code-theme";
  const themeSuffix = isGaming ? "gaming-theme" : "code-theme";

  currentPlayerImg.src = `${base}img/${themeFolder}/${currentPlayer}-${themeSuffix}.svg`;
  currentPlayerImg.alt = currentPlayer === "blue" ? "Blue Player" : "Orange Player";
};

/** Renders the current blue and orange scores to the DOM. */
const updateScores = (): void => {
  if (scoreBlueEl) scoreBlueEl.textContent = String(scores.blue);
  if (scoreOrangeEl) scoreOrangeEl.textContent = String(scores.orange);
};

/** Marks both flipped cards as matched, increments the current player's score, and checks for game end. */
const handleMatch = (): void => {
  flippedCards[0].setMatched(true);
  flippedCards[1].setMatched(true);
  scores[currentPlayer]++;
  updateScores();
  flippedCards = [];
  isLocked = false;

  if (cards.every((c) => c.isMatched)) {
    setTimeout(() => showOverlay(), 400);
  }
};

/** Flips both non-matching cards back over and switches to the other player after a short delay. */
const handleMismatch = (): void => {
  const [first, second] = flippedCards;
  flippedCards = [];
  setTimeout(() => {
    first.flip();
    second.flip();
    currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
    updateCurrentPlayerDisplay();
    isLocked = false;
  }, 1000);
};

/** Configures the overlay for a draw result: shows the draw group and hides all winner elements. */
const setOverlayDrawState = (): void => {
  if (overlayTitle) overlayTitle.style.display = "none";
  if (overlaySubtitle) overlaySubtitle.style.display = "none";
  if (overlayTopImg) overlayTopImg.style.display = "none";
  if (overlayWinnerImg) overlayWinnerImg.style.display = "none";
  if (overlayDraw) overlayDraw.style.display = "flex";
  if (overlayDrawIcon && settings) {
    const isGaming = settings.theme === "gamingTheme";
    overlayDrawIcon.src = isGaming
      ? `${base}img/gaming-theme/draw-icon-gaming-theme.svg`
      : `${base}img/code-theme/draw-icon-code-theme.svg`;
  }
};

/** Shows the trophy image on the overlay for the gaming theme winner state. */
const setOverlayGamingWinnerImages = (): void => {
  if (overlayTopImg) overlayTopImg.style.display = "none";
  if (overlayWinnerImg) {
    overlayWinnerImg.src = `${base}img/gaming-theme/trophy.svg`;
    overlayWinnerImg.alt = "Trophy";
    overlayWinnerImg.style.display = "";
  }
};

/** Shows the confetti and winner-specific image on the overlay for the code theme winner state.
 * @param winner - The winning player colour (`"blue"` or `"orange"`).
 */
const setOverlayCodeWinnerImages = (winner: string): void => {
  if (overlayTopImg) {
    overlayTopImg.src = `${base}img/code-theme/confetti.svg`;
    overlayTopImg.alt = "Confetti";
    overlayTopImg.style.display = "";
  }
  if (overlayWinnerImg) {
    overlayWinnerImg.src = `${base}img/code-theme/${winner}-winner-code-theme.svg`;
    overlayWinnerImg.alt = `${winner} winner`;
    overlayWinnerImg.style.display = "";
  }
};

/** Sets the overlay title and delegates image setup to the theme-specific helper.
 * @param winner - The winning player colour (`"blue"` or `"orange"`).
 * @param isGaming - Whether the gaming theme is active.
 */
const setOverlayWinnerState = (winner: string, isGaming: boolean): void => {
  if (!overlayTitle) return;
  overlayTitle.textContent = `${winner.toUpperCase()} PLAYER`;
  overlayTitle.classList.add(`game-overlay__title--${winner}`);
  if (overlaySubtitle) overlaySubtitle.style.display = "";
  if (isGaming) {
    setOverlayGamingWinnerImages();
  } else {
    setOverlayCodeWinnerImages(winner);
  }
};

/** Hides the draw group and restores the winner elements, then delegates to the theme-specific winner helper.
 * @param winner - The winning player colour (`"blue"` or `"orange"`).
 * @param isGaming - Whether the gaming theme is active.
 */
const setOverlayWinnerDisplay = (winner: string, isGaming: boolean): void => {
  if (overlayDraw) overlayDraw.style.display = "none";
  if (overlayTitle) overlayTitle.style.display = "";
  if (overlaySubtitle) overlaySubtitle.style.display = "";
  setOverlayWinnerState(winner, isGaming);
};

/** Determines the game result and makes the end-game overlay visible. */
const showOverlay = (): void => {
  if (!overlay || !overlayTitle || !settings) return;
  const isGaming = settings.theme === "gamingTheme";
  const isDraw = scores.blue === scores.orange;
  const winner = scores.blue > scores.orange ? "blue" : "orange";
  overlayTitle.classList.remove("game-overlay__title--blue", "game-overlay__title--orange");
  if (isDraw) {
    setOverlayDrawState();
  } else {
    setOverlayWinnerDisplay(winner, isGaming);
  }
  overlay.classList.add("game-overlay--visible");
};

/** Slides the exit-confirmation popup into view. */
const showExitPopup = (): void => {
  if (!exitPopupBackdrop || !exitPopup) return;
  exitPopup.classList.remove("exit-popup--slide-out");
  exitPopupBackdrop.classList.add("exit-popup-backdrop--visible");
  exitPopup.classList.add("exit-popup--slide-in");
};

/** Slides the exit-confirmation popup out of view and removes the backdrop after the animation ends. */
const hideExitPopup = (): void => {
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
};

/** Attaches click listeners to open/close the exit-confirmation popup. */
const setupExitPopup = (): void => {
  if (!exitButton || !backToGameButton || !exitPopupBackdrop) return;
  exitButton.addEventListener("click", showExitPopup);
  backToGameButton.addEventListener("click", hideExitPopup);
  exitPopupBackdrop.addEventListener("click", (event) => {
    if (event.target === exitPopupBackdrop) hideExitPopup();
  });
};

/** Swaps the exit button icon on hover based on the active theme. */
const setupExitButtonHover = (): void => {
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
};

/** Handles a click on the card field: flips the target card and triggers match or mismatch logic.
 * @param event - The click event from the card field.
 */
const handleCardClick = (event: Event): void => {
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
};

/** Bootstraps the game: loads settings, builds the board, and wires up all event listeners. */
const init = (): void => {
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
};

init();

import "../styles/components/_button.scss";
import "../styles/settings.scss";
import "../styles/styles.scss";

const themeRadios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
const playerRadios = document.querySelectorAll<HTMLInputElement>('input[name="player"]');
const boardSizeRadios = document.querySelectorAll<HTMLInputElement>('input[name="boardSize"]');
const previewImage = document.getElementById("preview-image") as HTMLImageElement;
const summaryTheme = document.getElementById("summary-theme") as HTMLSpanElement;
const summaryPlayer = document.getElementById("summary-player") as HTMLSpanElement;
const summaryBoardSize = document.getElementById("summary-boardSize") as HTMLSpanElement;
const startButton = document.getElementById("start-button") as HTMLAnchorElement;

const selections = {
  theme: null as string | null,
  player: null as string | null,
  boardSize: null as string | null,
};

const labelMappings = {
  theme: {
    codeTheme: "Code vibes theme",
    gamingTheme: "Gaming theme",
  },
  player: {
    blue: "Blue",
    orange: "Orange",
  },
  boardSize: {
    "16": "16 cards",
    "24": "24 cards",
    "36": "36 cards",
  },
};

/** Updates the theme preview image based on the selected theme.
 * @param theme - The selected theme value (`"codeTheme"` or `"gamingTheme"`).
 */
const updateThemePreview = (theme: string) => {
  if (theme === "codeTheme") {
    previewImage.src = import.meta.env.BASE_URL + "img/code-theme-preview.svg";
    previewImage.style.display = "block";
  } else if (theme === "gamingTheme") {
    previewImage.src = import.meta.env.BASE_URL + "img/gaming-theme-preview.svg";
    previewImage.style.display = "block";
  }
};

/** Reflects the current selections in the summary labels and re-validates the form. */
const updateSummary = () => {
  if (selections.theme) {
    summaryTheme.textContent = labelMappings.theme[selections.theme as keyof typeof labelMappings.theme];
  }
  if (selections.player) {
    summaryPlayer.textContent = labelMappings.player[selections.player as keyof typeof labelMappings.player];
  }
  if (selections.boardSize) {
    summaryBoardSize.textContent = labelMappings.boardSize[selections.boardSize as keyof typeof labelMappings.boardSize];
  }

  validateSelections();
};

/** Enables the start button when all options are selected, otherwise disables it. */
const validateSelections = () => {
  const allSelected = selections.theme && selections.player && selections.boardSize;

  if (allSelected) {
    startButton.classList.remove("button--disabled");
  } else {
    startButton.classList.add("button--disabled");
  }
};

/** Persists the current selections object to `localStorage`. */
const saveSelections = () => {
  localStorage.setItem("gameSettings", JSON.stringify(selections));
};

/** Resets all radio inputs, selections, summary labels, and the preview image to their default state. */
const resetSettings = () => {
  themeRadios.forEach((radio) => (radio.checked = false));
  playerRadios.forEach((radio) => (radio.checked = false));
  boardSizeRadios.forEach((radio) => (radio.checked = false));
  selections.theme = null;
  selections.player = null;
  selections.boardSize = null;
  summaryTheme.textContent = "Theme";
  summaryPlayer.textContent = "Player";
  summaryBoardSize.textContent = "Board Size";
  previewImage.style.display = "none";
  startButton.classList.add("button--disabled");
};

/** Reads any pre-checked radio inputs on page load and populates `selections` and the summary accordingly. */
const initializeSelections = () => {
  const checkedTheme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
  const checkedPlayer = document.querySelector<HTMLInputElement>('input[name="player"]:checked');
  const checkedBoardSize = document.querySelector<HTMLInputElement>('input[name="boardSize"]:checked');

  if (checkedTheme) {
    selections.theme = checkedTheme.value;
    updateThemePreview(checkedTheme.value);
  } else {
    updateThemePreview("codeTheme");
  }
  if (checkedPlayer) selections.player = checkedPlayer.value;
  if (checkedBoardSize) selections.boardSize = checkedBoardSize.value;
  updateSummary();
};

/** Handles theme radio change — updates the preview image and selections. */
const handleThemeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateThemePreview(target.value);
  selections.theme = target.value;
  updateSummary();
};

/** Handles player radio change — updates the selected player in selections. */
const handlePlayerChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selections.player = target.value;
  updateSummary();
};

/** Handles board size radio change — updates the selected board size in selections. */
const handleBoardSizeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selections.boardSize = target.value;
  updateSummary();
};

/** Registers change event listeners on all radio input groups. */
const registerEventListeners = () => {
  themeRadios.forEach((radio) => radio.addEventListener("change", handleThemeChange));
  playerRadios.forEach((radio) => radio.addEventListener("change", handlePlayerChange));
  boardSizeRadios.forEach((radio) => radio.addEventListener("change", handleBoardSizeChange));
};

/** Handles the start button click — saves selections to `localStorage` and resets the form. */
export const handleStartButtonClick = (event: MouseEvent) => {
  saveSelections();
  resetSettings();
};

/** Initializes the settings page by registering listeners and loading any pre-existing state. */
export const init = () => {
  registerEventListeners();
  initializeSelections();
};

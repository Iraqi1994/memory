import "../styles/components/_button.scss";
import "../styles/settings.scss";
import "../styles/styles.scss";

const themeRadios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
const previewImage = document.getElementById("preview-image") as HTMLImageElement;

const updateThemePreview = (theme: string) => {
  if (theme === "codeTheme") {
    previewImage.src = import.meta.env.BASE_URL + "img/code-theme-preview.svg";
    previewImage.style.display = "block";
  } else if (theme === "gamingTheme") {
    previewImage.src = import.meta.env.BASE_URL + "img/gaming-theme-preview.svg";
    previewImage.style.display = "block";
  }
};

themeRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    updateThemePreview(target.value);
  });
});

const checkedTheme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
if (checkedTheme) {
  updateThemePreview(checkedTheme.value);
} else {
  updateThemePreview("codeTheme");
}

const playerRadios = document.querySelectorAll<HTMLInputElement>('input[name="player"]');
const boardSizeRadios = document.querySelectorAll<HTMLInputElement>('input[name="boardSize"]');

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

const validateSelections = () => {
  const allSelected = selections.theme && selections.player && selections.boardSize;

  if (allSelected) {
    startButton.classList.remove("button--disabled");
  } else {
    startButton.classList.add("button--disabled");
  }
};

themeRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    selections.theme = target.value;
    updateSummary();
  });
});

playerRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    selections.player = target.value;
    updateSummary();
  });
});

boardSizeRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    selections.boardSize = target.value;
    updateSummary();
  });
});

const checkedPlayer = document.querySelector<HTMLInputElement>('input[name="player"]:checked');
const checkedBoardSize = document.querySelector<HTMLInputElement>('input[name="boardSize"]:checked');

if (checkedTheme) selections.theme = checkedTheme.value;
if (checkedPlayer) selections.player = checkedPlayer.value;
if (checkedBoardSize) selections.boardSize = checkedBoardSize.value;

updateSummary();

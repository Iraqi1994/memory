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
}

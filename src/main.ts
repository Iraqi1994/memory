import "./styles/styles.scss";

init();

function init() {
  const fieldRef = document.querySelector("#field");
  if (fieldRef) {
    fieldRef.addEventListener("click", (event) => {
      const card = (event.target as HTMLElement).closest(".card") as HTMLButtonElement;
      if (card) {
        card.classList.toggle("is-flipped");
      }
    });
  }
}

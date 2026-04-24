import "./styles/styles.scss";
import "./styles/_button.scss";
import "./styles/_landingPage.scss";
import { Card } from "./models/card.class";

init();

function init() {
  const fieldRef = document.querySelector("#field");
  if (!fieldRef) return;

  const cards = [new Card("1", "A"), new Card("2", "A"), new Card("3", "B"), new Card("4", "B")];

  cards.forEach((card) => {
    const cardElement = card.render();
    fieldRef.appendChild(cardElement);
  });

  fieldRef.addEventListener("click", (event) => {
    const cardElement = (event.target as HTMLElement).closest(".card") as HTMLButtonElement;
    if (!cardElement) return;

    const cardId = cardElement.dataset.cardId;
    const card = cards.find((c) => c.id === cardId);

    if (card) {
      card.flip();
    }
  });
}

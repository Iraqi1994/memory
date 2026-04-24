export class Card {
  private _isFlipped: boolean = false;
  private _isMatched: boolean = false;
  private _element: HTMLButtonElement | null = null;

  constructor(
    public id: string,
    public value: string,
  ) {}

  get isFlipped(): boolean {
    return this._isFlipped;
  }

  get isMatched(): boolean {
    return this._isMatched;
  }

  get element(): HTMLButtonElement | null {
    return this._element;
  }

  flip(): void {
    if (this._isMatched) return;

    this._isFlipped = !this._isFlipped;

    if (this._element) {
      this._element.classList.toggle("is-flipped");
    }
  }

  setMatched(matched: boolean): void {
    this._isMatched = matched;
  }

  render(): HTMLButtonElement {
    const card = document.createElement("button");
    card.className = "card";
    card.dataset.cardId = this.id;

    const inner = document.createElement("div");
    inner.className = "card__inner";

    const front = document.createElement("div");
    front.className = "card__face card__face--front";

    const back = document.createElement("div");
    back.className = "card__face card__face--back";

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    this._element = card;
    return card;
  }
}

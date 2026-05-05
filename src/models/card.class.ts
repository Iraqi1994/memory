export class Card {
  private _isFlipped: boolean = false;
  private _isMatched: boolean = false;
  private _element: HTMLButtonElement | null = null;

  /**
   * @param id - Unique card identifier.
   * @param value - Card name used for match comparison.
   * @param frontImagePath - Path to the card's front image.
   * @param backImagePath - Path to the card's back image.
   */
  constructor(
    public id: string,
    public value: string,
    public frontImagePath: string,
    public backImagePath: string,
  ) {}

  /** Whether the card is currently flipped face-up. */
  get isFlipped(): boolean {
    return this._isFlipped;
  }

  /** Whether the card has been matched. */
  get isMatched(): boolean {
    return this._isMatched;
  }

  /** The rendered DOM element, or `null` before `render()` is called. */
  get element(): HTMLButtonElement | null {
    return this._element;
  }

  /** Toggles the flipped state and the `is-flipped` CSS class. No-op if already matched. */
  flip(): void {
    if (this._isMatched) return;
    this._isFlipped = !this._isFlipped;
    if (this._element) {
      this._element.classList.toggle("is-flipped");
    }
  }

  /**
   * Sets the matched state of the card.
   * @param matched - `true` to mark the card as matched.
   */
  setMatched(matched: boolean): void {
    this._isMatched = matched;
  }

  /** Creates the front face element displaying the card back image. */
  private createFrontFace(): HTMLDivElement {
    const front = document.createElement("div");
    front.className = "card__face card__face--front";
    const img = document.createElement("img");
    img.src = this.backImagePath;
    img.alt = "card back";
    front.appendChild(img);
    return front;
  }

  /** Creates the back face element displaying the card front image. */
  private createBackFace(): HTMLDivElement {
    const back = document.createElement("div");
    back.className = "card__face card__face--back";
    const img = document.createElement("img");
    img.src = this.frontImagePath;
    img.alt = this.value;
    back.appendChild(img);
    return back;
  }

  /** Builds and returns the card button element, and stores a reference in `_element`. */
  render(): HTMLButtonElement {
    const card = document.createElement("button");
    card.className = "card";
    card.dataset.cardId = this.id;
    const inner = document.createElement("div");
    inner.className = "card__inner";
    inner.appendChild(this.createFrontFace());
    inner.appendChild(this.createBackFace());
    card.appendChild(inner);
    this._element = card;
    return card;
  }
}

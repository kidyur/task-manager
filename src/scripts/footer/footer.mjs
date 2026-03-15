import "./footer.css";

class Footer {
  #element = null;

  constructor() {
    this.#render();
  }

  #render() {
    this.#element = document.createElement("div");
    this.#element.className = "footer";
    this.#element.innerHTML = `
      <button class="footer__btn">
        <p class="footer__btn-title">Задачи</p>
        <div class="footer__icon"></div>
      </button>
      <button class="footer__btn">
        <p class="footer__btn-title">Календарь</p>
        <div class="footer__icon"></div>
      </button>
      <button class="footer__btn">
        <p class="footer__btn-title">Расписания</p>
        <div class="footer__icon"></div>
      </button>
    `;
    document.querySelector('body').appendChild(this.#element);
  }
}

export default Footer;
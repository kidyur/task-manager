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
        <div class="footer__icon"></div>
        <p class="footer__btn-title">Задачи</p>
      </button>
      <button class="footer__btn">
        <div class="footer__icon"></div>
        <p class="footer__btn-title">Календарь</p>
      </button>
      <button class="footer__btn">
        <div class="footer__icon"></div>
        <p class="footer__btn-title">Расписания</p>
      </button>
    `;
    document.querySelector('body').appendChild(this.#element);
  }
}

export default Footer;
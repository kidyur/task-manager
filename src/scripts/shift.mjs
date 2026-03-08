import Editor from "./editor.mjs";


class Shift {
    #element   = null;
    #title      = "";
    #isCurrent = false;
    #icon   = "";

    constructor(title, icon) {
        this.#title = title;
        this.#icon = icon;
        this.#render();
        this.#pinListeners();
    }

    setTitle(title) {
        this.#title = title;
    }

    getIcon() {
        return this.#icon; 
    }

    setIcon(icon) {
        this.#icon = icon;
    }

    #render() {
        this.#element = document.createElement('div');
        this.#element.className = 'shift';
        this.#element.innerHTML = `
            <div class="shift__main">
                <div class="shift__left-block">
                    <input class="shift__input" maxlength=24 placeholder="День">
                </div>
                <div class="shift__right-block"></div>
            </div>
            <button class="set-current-day-btn">Дважды кликните на название, чтобы выбрать день текущим</button>
        `;
        document.getElementById('schedule-page__shift-list').appendChild(this.#element);
    }

    #pinListeners() {
        this.#element.addEventListener("click", () => {
            const editor = new Editor();
            editor.open(this);
        });
    }
}

export default Shift;
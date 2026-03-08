import Editor from "./editor.mjs";
import Calendar from "./calendar.mjs";
import "./shift.css";


class Shift {
    #element   = null;
    #title      = "";
    #isCurrent = false;
    #icon   = "";

    constructor(title, icon="student") {
        this.#render();
        this.setValues(title, icon);
        this.#pinListeners();
    }

    setValues(title, icon) {
        this.#setTitle(title);
        this.#setIcon(icon);
        
        this.#notifyObservers();
    }

    getTitle() {
        return this.#title;
    }
    
    getIcon() {
        return this.#icon; 
    }

    #setTitle(title) {
        this.#title = title;
        this.#element.querySelector(".shift__title").textContent = this.#title;
    }

    #setIcon(icon) {
        this.#icon = icon;
        this.#element.querySelector(".shift__icon").setAttribute("shift-icon", icon);
    }

    #render() {
        this.#element = document.createElement('div');
        this.#element.className = 'shift';
        this.#element.innerHTML = `
            <p class="shift__title"></p>
            <div class="shift__icon"></div>
        `;
        document.querySelector('.schedule-page__shift-list').appendChild(this.#element);
    }

    #pinListeners() {
        this.#element.addEventListener("click", () => {
            const editor = new Editor();
            editor.open(this);
        });
    }

    #notifyObservers() {
        const calendar = new Calendar();
        calendar.updateView();
    }
}

export default Shift;
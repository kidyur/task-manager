import "./editor.css";
import SchedulesData from "./schedulesData.mjs";
import Shift from "./shift.mjs";


class Editor {
    #element = null;
    static #instance = null;
    #activeIcon = "";
    #shift = null;

    constructor() {
        if (Editor.#instance) {
            return Editor.#instance;
        } else {
            Editor.#instance = this;
        }

        this.#render();
        this.#addListeners();
    }
    
    hide() {
        this.#element.style.display = "none";
    }

    open(shift) {
        if ( !(shift instanceof Shift) ) {
            throw new TypeError("editor.open(shift) - 'shift' must be instance of 'Shift' class");
        }
        this.#element.style.display = "flex";
        this.#setShift(shift);
    }

    #setShift(shift) {
        this.#shift = shift;
        this.#element.querySelector(".editor__input").placeholder = this.#shift.getTitle();
    }

    #render() {
        this.#element = document.createElement("div");
        this.#element.className = "editor-outer";
        this.#element.innerHTML = `
            <div class="editor">
                <h1>Редактор смены</h1>
                <div class="editor__icons-grid"></div>
                <input class="editor__input" placeholder="Название смены">
                <button class="editor__hide-btn">Отмена</button>
                <button class="editor__submit-btn">Изменить</button>
                <button class="editor__remove-btn">Удалить смену</button>
            </div>
        `;
        this.#renderIconsGrid();
        
        document.querySelector("body").appendChild(this.#element);
    }

    #renderIconsGrid() {
        const iconTags = [
            'moon_and_sun', 'moon', 'notebook',
            'plant', 'sleep', 'student', 
            'sun_and_moon', 'sun', 'sunset'
        ];
        for (const tag of iconTags) {
            const btn = document.createElement('button');
            btn.className = 'editor__icon';
            btn.setAttribute('shift-icon', tag);
            btn.addEventListener('click', () => {
                this.#activeIcon = tag;
                this.#offActiveIcon();
                btn.className = "editor__icon editor__icon--active";
            })
            this.#element.querySelector(".editor__icons-grid").appendChild(btn);
        }
    }

    #offActiveIcon() {
        const activeIcon = this.#element.querySelector(".editor__icon--active");
        if (activeIcon) {
            activeIcon.className = "editor__icon";
        }
    }

    #addListeners() {
        this.#element.querySelector(".editor__hide-btn")
                     .addEventListener("click", () => this.hide());

        this.#element.querySelector(".editor__submit-btn")
                     .addEventListener("click", () => this.#submit());

        this.#element.querySelector(".editor__remove-btn")
                     .addEventListener("click", () => this.#removeShift());
    }

    #removeShift() {
        const schedulesData = new SchedulesData();
        schedulesData.currentSchedule.removeShift(this.#shift);
        
        this.hide();
    }

    #submit() {
        const title = this.#element.querySelector(".editor__input").value;
        this.#shift.setValues(title, this.#activeIcon);
        this.hide();
    }
}

export default Editor;
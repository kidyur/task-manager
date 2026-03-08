import "./editor.css";


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
        this.#renderIconsGrid();
        this.#addListeners();
    }
    
    hide() {
        this.#element.style.display = "none";
    }

    open(shift) {
        this.#shift = shift;
        this.#element.style.display = "flex";
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
            </div>
        `;
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
                btn.style.opacity = '100%';
            })
            this.#element.querySelector(".editor__icons-grid").appendChild(btn);
        }
    }

    #addListeners() {
        this.#element.querySelector(".editor__hide-btn")
                     .addEventListener("click", () => this.hide());
        this.#element.querySelector(".editor__submit-btn")
                     .addEventListener("click", () => this.#submit());
    }

    #submit() {
        const title = this.#element.querySelector(".editor__input").value;
        this.#shift.setTitle(title);
        this.#shift.setIcon(icon);
    }
}

export default Editor;
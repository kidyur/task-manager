class Editor {
    #element = null;
    static #instance = null;

    constructor() {
        if (Editor.#instance) {
            return Editor.#instance;
        } else {
            Editor.#instance = this;
        }

        this.#render();
    }
    
    hide() {
        this.#element.style.display = "none";
    }

    open() {
        this.#element.style.dislay = "flex";
    }

    #render() {
        this.#element = document.createElement("div");
        this.#element.className = "editor-outer";
        this.#element.innerHTML = `
            <div class="editor"></div>
        `;
        document.querySelector("body").appendChild(this.#element);
    }
}

export default Editor;
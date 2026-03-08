class Window {
    #element = null;
    static #instance = null;

    constructor() {
        if (Window.#instance) {
            return Window.#instance;
        } else {
            Window.#instance = this;
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
        this.#element.className = "window-outer";
        this.#element.innerHTML = `
            <div class="window"></div>
        `;
        document.querySelector("body").appendChild(this.#element);
    }
}

export default Window;
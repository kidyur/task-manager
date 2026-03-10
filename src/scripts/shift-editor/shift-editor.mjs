import "./shift-editor.css";
import SchedulesTableModel from "../schedules-table/schedules-table-model.mjs";

class ShiftEditor {
    #element = null;
    static #instance = null;
    #activeIcon = "";
    #shift = null;

    constructor() {
        if (ShiftEditor.#instance) {
            return ShiftEditor.#instance;
        } else {
            ShiftEditor.#instance = this;
        }

        this.#render();
        this.#addListeners();
    }
    
    close() {
        this.#element.style.display = "none";
        this.#setActiveIcon("");
        this.#element.querySelector(".shift-editor__input").value = "";
    }

    open(shift = null) {
        this.#shift = shift;
        this.updateView();
        this.#element.style.display = "flex";
    }

    updateView() {
        if (this.#shift == null) {
            this.#element.querySelector("h1").textContent = "Создать смену";
            this.#element.querySelector(".shift-editor__remove-btn").style.display = "none";
            this.#element.querySelector(".shift-editor__submit-btn").textContent = "Создать";
        } else {
            this.#setActiveIcon(this.#shift.getIcon());
            this.#element.querySelector("h1").textContent = "Изменить смену";
            this.#element.querySelector(".shift-editor__input").value = this.#shift.getTitle();
            this.#element.querySelector(".shift-editor__remove-btn").style.display = "inline-block";
            this.#element.querySelector(".shift-editor__submit-btn").textContent = "Изменить";
        }
    }

    #setActiveIcon(icon) {
        if (this.#activeIcon != "") {
            const prevActiveIcon = this.#element.querySelector("." + this.#activeIcon);
            prevActiveIcon.style.opacity = "40%";
        }
        this.#activeIcon = icon;
        if (icon != "") {
            this.#element.querySelector(`.${icon}`).style.opacity = "100%";
        }
    }

    #render() {
        this.#element = document.createElement("div");
        this.#element.className = "shift-editor-outer";
        this.#element.innerHTML = `
            <div class="shift-editor">
                <h1>Редактор смены</h1>
                <div class="shift-editor__icons-grid"></div>
                <input class="shift-editor__input" placeholder="Название смены">
                <button class="shift-editor__hide-btn">Отмена</button>
                <button class="shift-editor__submit-btn">Изменить</button>
                <button class="shift-editor__remove-btn">Удалить</button>
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
            btn.className = 'shift-editor__icon' + ' ' + tag;
            btn.setAttribute('shift-icon', tag);
            btn.addEventListener('click', () => { this.#setActiveIcon(tag); })
            this.#element.querySelector(".shift-editor__icons-grid").appendChild(btn);
        }
    }

    #addListeners() {
        this.#element.querySelector(".shift-editor__hide-btn")
                     .addEventListener("click", () => this.close());

        this.#element.querySelector(".shift-editor__submit-btn")
                     .addEventListener("click", () => this.#submit());

        this.#element.querySelector(".shift-editor__remove-btn")
                     .addEventListener("click", () => this.#removeShift());
    }

    #removeShift() {
        const schedulesTableModel = new SchedulesTableModel();
        schedulesTableModel.currentSchedule.removeShift(this.#shift);
        
        this.close();
    }

    #submit() {
        const title = this.#element.querySelector(".shift-editor__input").value;
        if (title == "" || this.#activeIcon == null) {
            return;
        }
        if (this.#shift != null) {
            this.#shift.setValues(title, this.#activeIcon);
        } else {
            const schedulesTable = new SchedulesTableModel();
            schedulesTable.currentSchedule.addShift(title, this.#activeIcon);
        }

        this.close();
    }
}

export default ShiftEditor;
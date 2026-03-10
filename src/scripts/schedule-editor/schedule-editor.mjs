import SchedulesTableModel from "../schedules-table/schedules-table-model.mjs";
import "./schedule-editor.css";


class ScheduleEditor {
    #element = null;
    static #instance = null;
    #schedule = null;

    constructor() {
        if (ScheduleEditor.#instance) {
            return ScheduleEditor.#instance;
        } else {
            ScheduleEditor.#instance = this;
        }

        this.#render();
        this.#addListeners();
    }
    
    close() {
        this.#element.style.display = "none";
        this.#element.querySelector('.schedule-editor__input').value = ""; 
    }

    updateView() {
        if (this.#schedule != null) {
            this.#element.querySelector('h1').textContent = "Изменение расписания"; 
            this.#element.querySelector('.schedule-editor__remove-btn').style.display = "inline-block";
        } else {
            this.#element.querySelector('h1').textContent = "Создание расписания"; 
            this.#element.querySelector('.schedule-editor__remove-btn').style.display = "none"; 
        }
    }

    open(schedule = null) {
        this.#schedule = schedule;
        this.updateView();
        this.#element.style.display = "flex";
    }

    #render() {
        this.#element = document.createElement("div");
        this.#element.className = "schedule-editor-outer";
        this.#element.innerHTML = `
            <div class="schedule-editor">
                <h1>Редактор расписания</h1>
                <input class="schedule-editor__input" placeholder="Название расписания">
                <button class="schedule-editor__hide-btn">Отмена</button>
                <button class="schedule-editor__submit-btn">Создать</button>
                <button class="schedule-editor__remove-btn">Удалить расписание</button>
            </div>
        `;
        document.querySelector("body").appendChild(this.#element);
    }

    #addListeners() {
        this.#element.querySelector(".schedule-editor__hide-btn")
                     .addEventListener("click", () => this.close());

        this.#element.querySelector(".schedule-editor__submit-btn")
                     .addEventListener("click", () => this.#submit());

        this.#element.querySelector(".schedule-editor__remove-btn")
                     .addEventListener("click", () => this.#removeSchedule());
    }

    #submit() {
        const title = this.#element.querySelector(".schedule-editor__input").value;
        if (title == "") {
            return;
        }
        if (this.#schedule != null) {
            this.#schedule.setTitle(title);
        } else {
            const schedulesTable = new SchedulesTableModel();
            schedulesTable.addSchedule(title);
        }
        this.close();
    }

    #removeSchedule() {
        const schedulesTable = new SchedulesTableModel();
        schedulesTable.removeCurrentSchedule()
    }
}

export default ScheduleEditor;
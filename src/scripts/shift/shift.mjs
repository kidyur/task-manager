import ShiftEditor from "../shift-editor/shift-editor.mjs";
import CalendarView from "../calendar/calendar-view.mjs";
import "./shift.css";
import SchedulesTableModel from "../schedules-table/schedules-table-model.mjs";


class Shift {
    #element   = null;
    #title      = "";
    #isCurrent = false;
    #icon   = "";
    get icon() { return this.#icon; }
    get title() { return this.#title; }

    constructor(title, icon) {
        this.#render();
        this.setValues(title, icon);
        this.#pinListeners();
    }

    destructor() {
        document.querySelector('.schedule__shifts-list--visible').removeChild(this.#element);
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
            <div class="shift__icon"></div>
            <p class="shift__title"></p>
        `;
        document.querySelector('.schedule__shifts-list--visible').appendChild(this.#element);
    }

    #pinListeners() {
        this.#element.querySelector(".shift__icon").addEventListener("click", () => {
            const shiftEditor = new ShiftEditor();
            shiftEditor.open(this);
        });
    }

    #notifyObservers() {
        const calendarView = new CalendarView();
        calendarView.updateView();
    }
}

export default Shift;
import SchedulesTableModel from "../schedules-table/schedules-table-model.mjs";
import CalendarView from "../calendar/calendar-view.mjs";
import Shift from "../shift/shift.mjs";
import Editor from "../editor/editor.mjs";
import "./schedule.css";

class Schedule {
    #element         = undefined;
    #shifts          = [];
    #title            = "";   
    #beginningDate   = null;
    #beginningShift  = null;

    constructor(title) {
        this.#title = title;
        this.#render();
        this.#pinListeners();
        this.select();
    }  

    getBeginningShift() {
        return this.#beginningShift;
    }

    getBeginningDate() {
        return new Date(this.#beginningDate);
    }

    getTitle() {
        return this.#title;
    }

    #pinListeners() {
        const schedulesTableModel = new SchedulesTableModel();
        this.#element.addEventListener('click', () => {
            this.select();
            schedulesTableModel.currentSchedule = this;
        })
    }

    #render() {
        this.#element = document.createElement('div');
        this.#element.className = "schedule-page__group schedule-page__group--active";
        this.#element.innerHTML = `
            <input placeholder=${this.#title} class="schedule__input" maxlength=24>
        `;
        document.getElementById('schedule-page__groups-sector').appendChild(this.#element);
    }    

    setBeginning(shift) {
        this.#beginningDate = new Date();
        this.#beginningDate.setHours(0, 0, 0, 0);
        this.#beginningShift = shift;

        this.#notifyObservers();
    }
    
    select() {
        this.#element.className = 'schedule-page__group schedule-page__group--active';
        const schedulesTableModel = new SchedulesTableModel();
        schedulesTableModel.currentSchedule = this;
    }

    addShift(title = "Придумайте название дню", icon = "") {
        const shift = new Shift(title, icon);
        this.#shifts.push(shift);
        if (this.#shifts.length == 1) {
            this.setBeginning(shift);
        }
        const editor = new Editor();
        editor.open(shift);
        
        this.#notifyObservers();
    }

    getShiftsCopy() {
        return [...this.#shifts];
    }
    
    removeShift(shift) {
        const idx = this.#shifts.indexOf(shift);
        if (idx != -1) {
            this.#shifts.splice(idx, 1);
        }

        this.#notifyObservers();
    }
    
    #notifyObservers() {
        const calendarView = new CalendarView();
        calendarView.updateView();
    }
}

export default Schedule;
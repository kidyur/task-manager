import SchedulesTableModel from "../schedules-table/schedules-table-model.mjs";
import CalendarView from "../calendar/calendar-view.mjs";
import Shift from "../shift/shift.mjs";
import ShiftEditor from "../shift-editor/shift-editor.mjs";
import "./schedule.css";
import ScheduleEditor from "../schedule-editor/schedule-editor.mjs";

class Schedule {
    #element         = null;
    #shifts          = [];
    #title            = "";   
    #beginningDate   = null;
    #beginningShift  = null;

    constructor(title) {
        this.#render();
        this.#pinListeners();
        this.setTitle(title);
    }  

    destructor() {
        document.querySelector(".schedules-table__table").removeChild(this.#element);
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

    setTitle(title) {
        this.#title = title;
        this.#element.querySelector(".schedule__title").innerHTML = title;
    }

    #pinListeners() {
        this.#element.addEventListener('click', () => {
            this.select();
        })

        this.#element.querySelector(".schedule__add-shift-btn").addEventListener('click', () => {
            const shiftEditor = new ShiftEditor();
            shiftEditor.open();
        })

        this.#element.querySelector(".schedule__edit-btn").addEventListener('click', () => {
            const scheduleEditor = new ScheduleEditor();
            scheduleEditor.open(this);
        })
    }

    #render() {
        this.#element = document.createElement('div');
        this.#element.className = "schedule";
        this.#element.innerHTML = `
            <div class="schedule__header">
                <p class="schedule__title">${this.#title}</p>
                <button class="schedule__edit-btn">Ред</button>
            </div>
            
            <div class="schedule__shifts-list"></div>
            <button class="schedule__add-shift-btn">Добавить день</button> 
        `;
        document.querySelector('.schedules-table__table').appendChild(this.#element);
    }    

    updateView() {
        const schedulesTable = new SchedulesTableModel();
        if (schedulesTable.currentSchedule == this) {
            this.#element.className = "schedule schedule--active";
            this.#element.querySelector(".schedule__shifts-list").style.display = "block";
            this.#element.querySelector(".schedule__add-shift-btn").style.display = "block";
            this.#element.querySelector(".schedule__edit-btn").style.display = "inline";
            this.#element.querySelector(".schedule__shifts-list").className = "schedule__shifts-list schedule__shifts-list--visible";
        } else {
            this.#element.className = "schedule";
            this.#element.querySelector(".schedule__shifts-list").style.display = "none";
            this.#element.querySelector(".schedule__edit-btn").style.display = "none";
            this.#element.querySelector(".schedule__add-shift-btn").style.display = "none";
            this.#element.querySelector(".schedule__shifts-list").className = "schedule__shifts-list";
        }
    }

    setBeginning(shift) {
        this.#beginningDate = new Date();
        this.#beginningDate.setHours(0, 0, 0, 0);
        this.#beginningShift = shift;

        this.#notifyObservers();
    }
    
    select() {
        const schedulesTableModel = new SchedulesTableModel();
        this.#element.className = "schedule";
        schedulesTableModel.currentSchedule = this;

        this.#notifyObservers();
    }

    addShift(title = "Придумайте название дню", icon = "") {
        const shift = new Shift(title, icon);
        this.#shifts.push(shift);
        if (this.#shifts.length == 1) {
            this.setBeginning(shift);
        }
        
        this.#notifyObservers();
    }

    getShiftsCopy() {
        return [...this.#shifts];
    }
    
    removeShift(shift) {
        const idx = this.#shifts.indexOf(shift);
        if (idx != -1) {
            this.#shifts[idx].destructor();
            this.#shifts.splice(idx, 1);
        }

        this.#notifyObservers();
    }
    
    #notifyObservers() {
        const calendarView = new CalendarView();
        calendarView.updateView();
        const schedulesTable = new SchedulesTableModel();
        schedulesTable.updateView();
    }
}

export default Schedule;
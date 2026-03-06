import SchedulesData from "./schedulesData.mjs";
import Calendar from "./calendar.mjs";
import Shift from "./shift.mjs";

class Schedule {
    #element         = undefined;
    #shifts          = [];
    get shifts() {return this.#shifts}

    #title            = "";   
    get title() { return this.#title }
    set title(n) { 
        this.#title = n;
        this.#input.value = n;
    }
    #input           = undefined;
    #beginningDate   = undefined;
    get beginningDate() {
        const date = new Date(this.#beginningDate);
        return date;
    }
    #beginningShift  = Shift;
    get beginningShift() {
        return this.#beginningShift;
    }
    set beginningShift(shift) {
        this.#beginningShift = shift;
        this.setBeginning(shift);
        shift.tagAsCurrent();
    }

    constructor(title) {
        this.#title = title;
        this.#render();
        this.#pinListeners();
        this.select();
    }  

    #pinListeners() {
        const schedulesData = new SchedulesData();
        this.#element.addEventListener('click', () => {
            this.select();
            schedulesData.currentSchedule = this;
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
        const calendar = new Calendar();
        calendar.updateView();
    }
    
    select() {
        this.#element.className = 'schedule-page__group schedule-page__group--active';
        const schedulesData = new SchedulesData();
        schedulesData.currentSchedule = this;
    }

    addShift(shift) {
        this.#shifts.push(shift);
        const calendar = new Calendar();
        calendar.updateView();
    }
    
    removeShift(shift) {
        const idx = this.#shifts.indexOf(shift);
        if (idx != -1) {
            this.#shifts.splice(idx, 1);
        }
        const calendar = new Calendar();
        calendar.updateView();
    }

    getShiftsCopy() {
        const copy = this.#shifts;
        return copy;
    }

    getShiftsLength() {
        return this.#shifts.length;
    }
}

export default Schedule;
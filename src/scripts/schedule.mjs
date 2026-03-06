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
        this.#element = document.createElement('div');
        const schedulesData = new SchedulesData();
        this.#element.addEventListener('click', () => {
            this.select();
            schedulesData.currentSchedule = this;
        })
        this.#createInput();
        this.#appendToSchedulesList();
        this.#input.focus();
        this.select();
    }  

    static #setupAddShiftBtn() {
        const btn = document.getElementById('schedule-page__add-shift-btn');
        btn.addEventListener('click', async () => {
            const shift = new Shift();
            shift.select();
            const calendar = new Calendar();
            calendar.updateView();
        })
    }
    

    static #setupCreateScheduleBtn() {
        const btn = document.getElementById('schedule-page__add-schedule-btn');
        btn.addEventListener('click', () => {
            const schedulesData = new SchedulesData();
            schedulesData.addSchedule(schedulesData.getSchedulesSize());
        })
    }

    static setupScheduleManager() {
        Schedule.#setupDeleteBtn();
        Schedule.#setupAddShiftBtn();
        Schedule.#setupCreateScheduleBtn();
    }

    static updateScheduleManager() {
        const manager = document.getElementById('schedule-page__manager');
        const hint = document.getElementById('schedule-page__hint');
        const schedulesData = new SchedulesData();

        if (schedulesData.getSchedulesSize() == 0) {
            manager.style.display = 'none';
            hint.style.display = 'flex';
        } else {
            manager.style.display = 'flex';
            hint.style.display = 'none';
        }
    }

    static offAllSchedules() {
        const elements = document.getElementsByClassName('schedule-page__group');
        for (const group of elements) {
            group.className = 'schedule-page__group';
        }
    }

    setBeginning(shift) {
        this.#beginningDate = new Date();
        this.#beginningDate.setHours(0, 0, 0, 0);
        this.#beginningShift = shift;
        const calendar = new Calendar();
        calendar.updateView();
    }

    #listShifts() {
        const shiftList = document.getElementById('schedule-page__shift-list');
        shiftList.innerHTML = '';
        for (const shift of this.#shifts) {
            shift.appendToShiftsList();
        }
    }
    
    static #setupDeleteBtn() {
        const deleteBtn = document.getElementById('schedule-page__delete-schedule-btn');
        deleteBtn.addEventListener('click', async () => {
            const activeScheduleElement = document.getElementsByClassName('schedule-page__group--active')[0];  
            activeScheduleElement.remove();
            const schedulesData = new SchedulesData();
            schedulesData.removeSchedule(schedulesData.currentSchedule);
            schedulesData.currentSchedule = new Schedule(true); 
            Schedule.updateScheduleManager();
        })
    }
    
    #createInput() {
        const input = document.createElement('input');
        input.placeholder = "Ваше расписание";
        input.className = 'schedule__input';
        input.maxLength = 24;
        input.addEventListener('blur', async () => {
            this.name = input.value;
        })
        this.#input = input;
        this.#element.appendChild(input);
    }
    
    #appendToSchedulesList() {
        const sector = document.getElementById('schedule-page__groups-sector');
        sector.appendChild(this.#element);
    }
    
    select() {
        Schedule.offAllSchedules();
        this.#element.className = 'schedule-page__group schedule-page__group--active';
        const schedulesData = new SchedulesData();
        schedulesData.currentSchedule = this;
        this.#listShifts();
        this.#input.focus();
    }

    addShift(shift) {
        this.#shifts.push(shift);
        this.#listShifts();
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
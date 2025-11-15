import SchedulesData from "./schedulesData.mjs";
import Calendar from "./calendar.mjs";
import Shift from "./shift.mjs";

class Schedule {
    #element        = HTMLDivElement;
    #shifts         = [];
    #name           = "";   
    #input          = HTMLInputElement;
    #beginningDay   = "";
    #beginningShift = Shift;
    get beginningShift() {
        return this.#beginningShift;
    }

    constructor(empty_flag=false) {
        if (!empty_flag) {
            const group = document.createElement('div');
            this.#element = group;
            group.addEventListener('click', () => {
                this.select();
                SchedulesData.currentSchedule = this;
            })
            this.#createInput();
            this.#appendToSchedulesList();
            this.#input.focus();
        } else {
            // Cleaning of shifts list view
            const shiftList = document.getElementById('schedule-page__shift-list');
            shiftList.innerHTML = '';
        }
    }  

    static #setupAddShiftBtn() {
        const btn = document.getElementById('schedule-page__add-shift-btn');
        btn.addEventListener('click', () => {
            const shift = new Shift();
            SchedulesData.currentSchedule.addShift(shift);
            Shift.offLastActiveShift();
            shift.select();
            Calendar.update();
        })
    }


    static #setupCreateScheduleBtn() {
        const btn = document.getElementById('schedule-page__add-schedule-btn');
        btn.addEventListener('click', () => {
            const schedule = new Schedule();
            SchedulesData.addSchedule(schedule);
            schedule.select();
            Schedule.updateScheduleManager();
        })
    }

    static setupScheduleManager() {
        Schedule.#setupDeleteBtn();
        Schedule.#setupAddShiftBtn();
        Schedule.#setupCreateScheduleBtn();
    }

    static updateScheduleManager() {
        const manager = document.getElementById('schedule-page__manager');
        if (SchedulesData.getSchedulesLength() == 0) {
            manager.style.display = 'none';
        } else {
            manager.style.display = 'flex';
        }
    }

    static offAllSchedules() {
        const elements = document.getElementsByClassName('schedule-page__group');
        for (const group of elements) {
            group.className = 'schedule-page__group';
        }
    }

    setBeginning(shift) {
        this.#beginningDay = new Date();
        this.#beginningDay.setHours(0, 0, 0, 0);
        this.#beginningShift = shift;
        console.log(this.#beginningShift);
        Calendar.update();
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
        deleteBtn.addEventListener('click', () => {
            const activeScheduleElement = document.getElementsByClassName('schedule-page__group--active')[0];  
            activeScheduleElement.remove();
            SchedulesData.removeSchedule(SchedulesData.currentSchedule);
            SchedulesData.currentSchedule = new Schedule(true); 
            Schedule.updateScheduleManager();
        })
    }
    
    #createInput() {
        const input = document.createElement('input');
        input.placeholder = "Ваше расписание";
        input.className = 'schedule__input';
        input.maxLength = 24;
        input.value = '';
        input.addEventListener('blur', () => {
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
        SchedulesData.currentSchedule = this;
        this.#listShifts();
        this.#input.focus();
    }

    addShift(shift) {
        if (shift.constructor.name != "Shift") {
            alert("Попытка добавить в список смен объект, не являющийся сменой");
        } else {
            this.#shifts.push(shift);
            Calendar.update();
        }
    }
    
    removeShift(shift) {
        const idx = this.#shifts.indexOf(shift);
        if (idx != -1) {
            this.#shifts.splice(idx, 1);
        }
        Calendar.update();
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
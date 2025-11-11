import SchedulesData from "./schedulesData.mjs";
import Calendar from "./calendar.mjs";
import Shift from "./shift.mjs";

class Schedule {
    #element    = HTMLDivElement;
    #shifts     = [];
    #name       = "";   
    #input      = HTMLInputElement;

    constructor(empty_flag=false) {
        if (!empty_flag) {
            const group = document.createElement('div');
            this.#element = group;
            group.addEventListener('click', () => {
                this.select();
                SchedulesData.currentSchedule = this;
            })
            this.createDeleteBtn();
            this.createInput();
            this.appendToSchedulesList();
            this.#input.focus();
        }
    }  

    listShifts() {
        const shiftList = document.getElementById('schedule-page__shift-list');
        shiftList.innerHTML = '';
        for (const shift of this.#shifts) {
            shift.appendToShiftsList();
        }
    }

    select() {
        offAllSchedules();
        this.#element.className = 'schedule-page__group schedule-page__group--active';
        SchedulesData.currentSchedule = this;
        this.listShifts();
        this.#input.focus();
    }

    createDeleteBtn() {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'schedule__delete-btn';
        deleteBtn.addEventListener('click', () => {
            SchedulesData.removeSchedule(this);
            SchedulesData.currentSchedule = new Schedule(); 
            const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
            addShiftBtn.style.display = 'none';
            const groupsLine = document.getElementById('schedule-page__groups-sector');
            updateCreateScheduleBtn();
            groupsLine.removeChild(this.#element);
        })
        this.#element.appendChild(deleteBtn);
    }

    createInput() {
        const input = document.createElement('input')
        input.className = 'schedule__input';
        input.value = '';
        input.addEventListener('blur', () => {
            this.name = input.value;
        })
        this.#input = input;
        this.#element.appendChild(input);
    }

    appendToSchedulesList() {
        const sector = document.getElementById('schedule-page__groups-sector');
        sector.appendChild(this.#element);
    }

    addShift(shift) {
        if (shift.constructor.name != "Shift") {
            alert("Попытка добавить в список смен объект, не являющийся сменой");
        } else {
            this.#shifts.push(shift);
        }
    }

    removeShift(shift) {
        const idx = this.#shifts.indexOf(shift);
        if (idx != -1) {
            this.#shifts.splice(idx, 1);
        }
    }

    getShiftsCopy() {
        const copy = this.#shifts;
        return copy;
    }
}

function updateCreateScheduleBtn() {
    const btn = document.getElementById('schedule-page__add-schedule-btn');
    if (SchedulesData.getSchedulesLength() >= 3) {
        btn.classList.add('schedule-page__add-schedule-btn--passive');
    } else {
        btn.className = 'schedule-page__add-schedule-btn';
    }
}

function updateCreateShiftBtn() {
    const btn = document.getElementById('schedule-page__add-shift-btn');
    if (SchedulesData.getSchedulesLength() >= 1) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
}

function offLastActiveShift() {
    const shift = document.getElementsByClassName('shift_editing')[0];
    if (shift) {
        shift.className = 'shift';
    }
}

function setupAddShiftBtn() {
    const btn = document.getElementById('schedule-page__add-shift-btn');
    btn.addEventListener('click', () => {
        const shift = new Shift();
        SchedulesData.currentSchedule.addShift(shift);
        offLastActiveShift();
        shift.select();
        Calendar.update();
    })
}

function setupAddScheduleBtn() {
    const btn = document.getElementById('schedule-page__add-schedule-btn');
    btn.addEventListener('click', () => {
        const schedule = new Schedule();
        SchedulesData.addSchedule(schedule);
        SchedulesData.currentSchedule = schedule;
        updateCreateShiftBtn();
        updateCreateScheduleBtn();
        schedule.select();
        Calendar.update();
    })
}

function offAllSchedules() {
    const elements = document.getElementsByClassName('schedule-page__group');
    for (const group of elements) {
        group.className = 'schedule-page__group';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setupAddScheduleBtn();
    setupAddShiftBtn();
})

export default Schedule;
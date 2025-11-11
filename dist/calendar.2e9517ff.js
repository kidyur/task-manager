// import { SchedulesData } from "./app";
class Shift {
    #element = HTMLDivElement;
    #leftBlock = HTMLDivElement;
    #name = "";
    #input = HTMLInputElement;
    #iconURL = "";
    constructor(){
        const shiftEl = document.createElement('div');
        shiftEl.className = 'shift shift--editing';
        this.#element = shiftEl;
        const leftBlock = document.createElement('div');
        leftBlock.className = 'shift__left-block';
        this.#leftBlock = leftBlock;
        shiftEl.appendChild(leftBlock);
        shiftEl.addEventListener('click', ()=>{
            this.select();
        });
        this.createIconsField();
        this.createInput();
        this.createDeleteBtn();
        this.appendToShiftsList();
    }
    createInput() {
        const input = document.createElement('input');
        input.className = 'shift__input';
        input.maxLength = 24;
        input.placeholder = "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0441\u043C\u0435\u043D\u044B";
        input.addEventListener('blur', ()=>{
            this.#name = input.value;
        });
        input.focus();
        this.#input = input;
        this.#leftBlock.appendChild(input);
    }
    createDeleteBtn() {
        const btn = document.createElement('button');
        btn.className = 'shift__delete-btn';
        btn.addEventListener('click', ()=>{
            SchedulesData.currentSchedule.removeShift(this);
            const shiftList = document.getElementById('schedule-page__shift-list');
            shiftList.removeChild(this.#element);
            calendar.update();
        });
        this.#leftBlock.appendChild(btn);
    }
    createIconsField() {
        const iconPaths = [
            'books.svg',
            'moon_and_sun.svg',
            'moon.svg',
            'notebook.svg',
            'plant.svg',
            'sleep.svg',
            'student.svg',
            'sun_and_moon.svg',
            'sun.svg',
            'sunset.svg'
        ];
        const field = document.createElement('div');
        field.className = 'shift__right-block';
        for (const path of iconPaths){
            const btn = document.createElement('button');
            btn.className = 'shift__icon';
            btn.style.backgroundImage = 'url(../icons/' + path + ')';
            btn.addEventListener('click', ()=>{
                this.iconURL = 'url(../icons/' + path + ')';
                const prevIcon = field.getElementsByClassName('shift__icon--first')[0];
                if (prevIcon) prevIcon.className = 'shift__icon';
                btn.className = 'shift__icon shift__icon--first';
                calendar.update();
            });
            field.appendChild(btn);
        }
        this.#element.appendChild(field);
    }
    appendToShiftsList() {
        const shiftList = document.getElementById('schedule-page__shift-list');
        shiftList.appendChild(this.#element);
    }
    select() {
        offLastActiveShift();
        this.#element.className = 'shift shift--editing';
        this.#input.focus();
    }
}
function offLastActiveShift() {
    const shift = document.getElementsByClassName('shift--editing')[0];
    if (shift) shift.className = 'shift';
}
class Schedule {
    #element = HTMLDivElement;
    #shifts = [];
    #name = "";
    #input = HTMLInputElement;
    constructor(empty_flag = false){
        if (!empty_flag) {
            const group = document.createElement('div');
            this.#element = group;
            group.addEventListener('click', ()=>{
                this.select();
                SchedulesData.currentSchedule = this;
            });
            this.createDeleteBtn();
            this.createInput();
            this.appendToSchedulesList();
            this.#input.focus();
        }
    }
    listShifts() {
        const shiftList = document.getElementById('schedule-page__shift-list');
        shiftList.innerHTML = '';
        for (const shift of this.#shifts)shift.appendToShiftsList();
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
        deleteBtn.addEventListener('click', ()=>{
            SchedulesData.removeSchedule(this);
            SchedulesData.currentSchedule = new Schedule();
            const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
            addShiftBtn.style.display = 'none';
            const groupsLine = document.getElementById('schedule-page__groups-sector');
            updateCreateScheduleBtn();
            groupsLine.removeChild(this.#element);
        });
        this.#element.appendChild(deleteBtn);
    }
    createInput() {
        const input = document.createElement('input');
        input.className = 'schedule__input';
        input.value = SchedulesData.getSchedulesLength();
        input.addEventListener('blur', ()=>{
            this.name = input.value;
        });
        this.#input = input;
        this.#element.appendChild(input);
    }
    appendToSchedulesList() {
        const sector = document.getElementById('schedule-page__groups-sector');
        sector.appendChild(this.#element);
    }
    addShift(shift) {
        if (shift.constructor.name != "Shift") alert("\u041F\u043E\u043F\u044B\u0442\u043A\u0430 \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u0441\u043F\u0438\u0441\u043E\u043A \u0441\u043C\u0435\u043D \u043E\u0431\u044A\u0435\u043A\u0442, \u043D\u0435 \u044F\u0432\u043B\u044F\u044E\u0449\u0438\u0439\u0441\u044F \u0441\u043C\u0435\u043D\u043E\u0439");
        else this.#shifts.push(shift);
    }
    removeShift(shift) {
        const idx = this.#shifts.indexOf(shift);
        if (idx != -1) this.#shifts.splice(idx, 1);
    }
    getShiftsCopy() {
        const copy = this.#shifts;
        return copy;
    }
}
function updateCreateScheduleBtn() {
    const btn = document.getElementById('schedule-page__add-schedule-btn');
    if (SchedulesData.getSchedulesLength() >= 3) btn.classList.add('schedule-page__add-schedule-btn--passive');
    else btn.className = 'schedule-page__add-schedule-btn';
}
function updateCreateShiftBtn() {
    const btn = document.getElementById('schedule-page__add-shift-btn');
    if (SchedulesData.getSchedulesLength() >= 1) btn.style.display = 'block';
    else btn.style.display = 'none';
}
function setupAddShiftBtn() {
    const btn = document.getElementById('schedule-page__add-shift-btn');
    btn.addEventListener('click', ()=>{
        const shift = new Shift();
        SchedulesData.currentSchedule.addShift(shift);
        offLastActiveShift();
        shift.select();
        calendar.update();
    });
}
function setupAddScheduleBtn() {
    const btn = document.getElementById('schedule-page__add-schedule-btn');
    btn.addEventListener('click', ()=>{
        schedule = new Schedule();
        SchedulesData.addSchedule(schedule);
        SchedulesData.currentSchedule = schedule;
        updateCreateShiftBtn();
        updateCreateScheduleBtn();
        schedule.select();
        calendar.update();
    });
}
function offAllSchedules() {
    const elements = document.getElementsByClassName('schedule-page__group');
    for (const group of elements)group.className = 'schedule-page__group';
}
window.addEventListener('DOMContentLoaded', ()=>{
    setupAddScheduleBtn();
    setupAddShiftBtn();
});

//# sourceMappingURL=calendar.2e9517ff.js.map

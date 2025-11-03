let currSchedule = [];
const schedules = [];

class Shift {
    #shiftEl = undefined;
    #leftBlock = undefined;
    #name = '';
    #input = undefined;
    iconURL = ''; // We make it public to access via calendar

    createInput() {
        const input = document.createElement('input');
        input.className = 'shift__input';
        input.maxLength = 24;
        input.placeholder = "Введите название смены";
        input.addEventListener('blur', () => {
            this.#name = input.value;
        })
        input.focus();
        this.#input = input;
        this.#leftBlock.appendChild(input);
    }

    createDeleteBtn() {
        const btn = document.createElement('button');
        btn.className = 'shift__delete-btn';
        btn.addEventListener('click', () => {
            currSchedule.shifts.splice(currSchedule.shifts.indexOf(this), 1);
            const shiftList = document.getElementById('schedule-page__shift-list');
            shiftList.removeChild(this.#shiftEl);
            updateCalendar();
        })
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
        for (const path of iconPaths) {
            const btn = document.createElement('button');
            btn.className = 'shift__icon';
            btn.style.backgroundImage = 'url(../icons/' + path + ')';
            btn.addEventListener('click', () => {
                this.iconURL = 'url(../icons/' + path + ')';
                const prevIcon = field.getElementsByClassName('shift__icon--first')[0];
                if (prevIcon) {
                    prevIcon.className = 'shift__icon';
                }
                btn.className = 'shift__icon shift__icon--first';
                updateCalendar();
            })
            field.appendChild(btn);
        }
        this.#shiftEl.appendChild(field);
    }

    appendToShiftsList() {
        const shiftList = document.getElementById('schedule-page__shift-list');
        shiftList.appendChild(this.#shiftEl);
    }

    select() {
        offLastActiveShift();
        this.#shiftEl.className = 'shift shift--editing';
        this.#input.focus();
    }

    constructor() {
        const shiftEl = document.createElement('div');
        shiftEl.className = 'shift shift--editing';
        this.#shiftEl = shiftEl;

        const leftBlock = document.createElement('div');
        leftBlock.className = 'shift__left-block';
        this.#leftBlock = leftBlock;
        shiftEl.appendChild(leftBlock);
        
        shiftEl.addEventListener('click', () => {
            this.select();
        })

        this.createIconsField();
        this.createInput();
        this.createDeleteBtn();
        this.appendToShiftsList();
    }
}

function offLastActiveShift() {
    const shift = document.getElementsByClassName('shift--editing')[0];
    if (shift) {
        shift.className = 'shift';
    }
}

class Schedule {
    #scheduleEl = undefined;
    shifts = []; // We make it public to access it via calendar
    name = "";   // It also

    listShifts() {
        const shiftList = document.getElementById('schedule-page__shift-list');
        shiftList.innerHTML = '';
        for (const shift of this.shifts) {
            appendShift(shift);
        }
    }

    select() {
        offAllSchedules();
        this.#scheduleEl.className = 'schedule-page__group schedule-page__group--active';
        currSchedule = this;
        this.listShifts();
        updateCalendar();
    }

    createDeleteBtn() {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'schedule__delete-btn';
        deleteBtn.addEventListener('click', () => {
            schedules.splice(schedules.indexOf(this), 1);
            if (schedules.length == 0) {
                currSchedule = {shifts: []}; 
                const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
                addShiftBtn.style.display = 'none';
            } else {
                this.select();
            }
            const groupsLine = document.getElementById('schedule-page__groups-sector');
            updateCreateScheduleBtn();
            updateCalendar();

            groupsLine.removeChild(this.#scheduleEl);
        })
        this.#scheduleEl.appendChild(deleteBtn);
    }

    createInput() {
        const input = document.createElement('input')
        input.className = 'schedule__input';
        input.value = schedules.length;
        input.addEventListener('blur', () => {
            this.name = input.value;
        })
        input.focus();
        this.#scheduleEl.appendChild(input);
    }

    appendToSchedulesList() {
        const sector = document.getElementById('schedule-page__groups-sector');
        sector.appendChild(this.#scheduleEl);
    }

    constructor() {
        const group = document.createElement('div');
        this.#scheduleEl = group;
        group.addEventListener('click', () => {
            this.select();
        })
        this.createDeleteBtn();
        this.createInput();
        this.appendToSchedulesList();
        this.select();
    }    
}

function updateCreateScheduleBtn() {
    const btn = document.getElementById('schedule-page__add-schedule-btn');
    if (schedules.length == 3) {
        btn.className.add('schedule-page__add-schedule-btn--passive');
    } else {
        btn.className = 'schedule-page__add-schedule-btn';
    }
}

function updateCreateShiftBtn() {
    const btn = document.getElementById('schedule-page__add-shift-btn');
    if (schedules.length >= 1) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
    console.log(btn)
}

function setupAddShiftBtn() {
    const btn = document.getElementById('schedule-page__add-shift-btn');
    btn.addEventListener('click', () => {
        const shift = new Shift();
        currSchedule.shifts.push(shift);
        offLastActiveShift();
        updateCalendar();
        shift.select();
    })
}

function setupAddScheduleBtn() {
    const btn = document.getElementById('schedule-page__add-schedule-btn');
    btn.addEventListener('click', () => {
        schedule = new Schedule();
        schedules.push(schedule);
        updateCalendar();
        updateCreateShiftBtn();
        updateCreateScheduleBtn();
        schedule.select();
    })
}

function offAllSchedules() {
    const scheduleEls = document.getElementsByClassName('schedule-page__group');
    for (const group of scheduleEls) {
        group.className = 'schedule-page__group';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setupAddScheduleBtn();
    setupAddShiftBtn();
})




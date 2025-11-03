let currSchedule = [];
const schedules = [];

class Shift {
    #element = undefined;
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
        return input;
    }

    createDeleteBtn() {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'shift__delete-btn';
        
        deleteBtn.addEventListener('click', () => {
            currSchedule.shifts.splice(currSchedule.shifts.indexOf(this), 1);
            const shiftList = document.getElementById('schedule-page__shift-list');
            shiftList.removeChild(this.#element);
            updateCalendar();
        })
        return deleteBtn;
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
        return field;
    }


    constructor() {
        const shiftList = document.getElementById('schedule-page__shift-list');
        const shiftEl = document.createElement('div');
        this.#element = shiftEl;
        const elToDeactivate = document.getElementsByClassName('shift--editing')[0];
        if (elToDeactivate) {
            elToDeactivate.className = 'shift';
        }
        shiftEl.className = 'shift shift--editing';

        const leftBlock = document.createElement('div');
        leftBlock.className = 'shift__left-block';
        leftBlock.appendChild(this.createInput());
        leftBlock.appendChild(this.createDeleteBtn());
        
        shiftEl.addEventListener('click', () => {
            if (shiftEl.className != "shift shift--editing") {
                const elToDeactivate = document.getElementsByClassName('shift--editing')[0];
                if (elToDeactivate) {
                    elToDeactivate.className = 'shift';
                }
                shiftEl.className = 'shift shift--editing';
                this.#input.focus();
            }
        })

        shiftEl.appendChild(leftBlock);
        shiftEl.appendChild(this.createIconsField());
        shiftList.appendChild(shiftEl);
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
        this.createInput();
        this.createDeleteBtn();
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
        currSchedule.shifts.push(new Shift());
        updateCalendar();
    })
}

function setupAddScheduleBtn() {
    const btn = document.getElementById('schedule-page__add-schedule-btn');
    btn.addEventListener('click', () => {
        schedules.push(new Schedule());
        updateCalendar();
        updateCreateShiftBtn();
        updateCreateScheduleBtn();
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




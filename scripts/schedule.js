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
            updateCalendarView();
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
                updateCalendarView();
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
    #group = undefined;
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
        offAllGroups();
        this.#group.className = 'schedule-page__group schedule-page__group--active';
        currSchedule = this;
        this.listShifts();
        updateCalendarView();
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
            addScheduleBtn.className = "schedule-page__add-schedule-btn";
            const groupsLine = document.getElementById('schedule-page__groups-sector');
            updateCalendarView();

            groupsLine.removeChild(this.#group);
        })
        return deleteBtn;
    }

    createInput() {
        const input = document.createElement('input')
        input.className = 'schedule__input';
        input.value = schedules.length;
        input.addEventListener('blur', () => {
            this.name = input.value;
        })
        input.focus();
        return input;
    }

    constructor() {
        const sector = document.getElementById('schedule-page__groups-sector');
        const group = document.createElement('div');
        sector.appendChild(group);
        group.appendChild(this.createDeleteBtn());
        group.appendChild(this.createInput());
        group.addEventListener('click', () => {
            this.select();
        })
        if (schedules.length == 1) {
            showAddShiftBtn();
        }
        if (schedules.length == 3) {
            const addScheduleBtn = document.getElementById('schedule-page__add-schedule-btn');
            addScheduleBtn.className = 'schedule-page__add-schedule-btn--passive';
        }
        const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
        addShiftBtn.style.display = 'block';
        this.#group = group;
        this.select();
    }    
}

const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
addShiftBtn.addEventListener('click', () => {
    currSchedule.shifts.push(new Shift());
    updateCalendarView();
})

function showAddShiftBtn() {
    const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
    addShiftBtn.style.display = 'block';
}

function offAllGroups() {
    const chooseButtons = document.getElementsByClassName('schedule__input--active');
    for (const button of chooseButtons) {
        button.className = 'schedule__input';
    }

    const groups = document.getElementsByClassName('schedule-page__group');
    for (const group of groups) {
        group.className = 'schedule-page__group';
    }

    const editButtons = document.getElementsByClassName('schedule-page__edit-group-btn');
    for (const button of editButtons) {
        button.className = 'schedule-page__edit-group-btn';
    }
}

const addScheduleBtn = document.getElementById('schedule-page__add-group-btn');

addScheduleBtn.addEventListener('click', () => {
    schedules.push(new Schedule());
})


let currSchedule = [];
const schedules = [];

class Shift {
    iconURL = '';
    
    constructor(name) {
        this.name = name;
    }
}

class Schedule {
    shifts = [];

    constructor(el, name, chooseBtn, editBtn) {
        this.name = name;
        this.element = el;
        this.chooseBtn = chooseBtn;
        this.editBtn = editBtn;
    }    
}

const shiftInput = document.getElementById('schedule-page__shift-input');
const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
addShiftBtn.addEventListener('click', () => {
    const shift = new Shift("1");
    currSchedule.shifts.push(shift);
    appendShift(shift);
    updateCalendarView();
})




const addScheduleBtn = document.getElementById('schedule-page__add-group-btn');

function appendShift(shift) {
    const shiftList = document.getElementById('schedule-page__shift-list');
    const shiftEl = document.createElement('div');
    const elToDeactivate = document.getElementsByClassName('shift--editing')[0];
    if (elToDeactivate) {
        elToDeactivate.className = 'shift';
    }
    shiftEl.className = 'shift shift--editing';

    const leftBlock = document.createElement('div');
    leftBlock.className = 'shift__left-block';
    const rightBlock = document.createElement('div');
    rightBlock.className = 'shift__right-block';

    const input = document.createElement('input');
    input.className = 'shift__input';
    input.maxLength = 24;
    input.placeholder = "Введите название смены";
    leftBlock.appendChild(input);

    input.addEventListener('blur', () => {
        shift.name = input.value;
    })

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'shift__delete-btn';
    
    deleteBtn.addEventListener('click', () => {
        currSchedule.shifts.splice(currSchedule.shifts.indexOf(shift), 1);
        shiftList.removeChild(shiftEl);
        updateCalendarView();
    })
    
    shiftEl.addEventListener('click', () => {
        if (shiftEl.className != "shift shift--editing") {
            const elToDeactivate = document.getElementsByClassName('shift--editing')[0];
            if (elToDeactivate) {
                elToDeactivate.className = 'shift';
            }
            shiftEl.className = 'shift shift--editing';
            input.focus();
        }
    })

    shiftEl.appendChild(leftBlock);
    shiftEl.appendChild(getIconsField(shift));
    shiftList.appendChild(shiftEl);
    leftBlock.appendChild(deleteBtn);
    input.focus();
}


function showAddShiftBtn() {
    const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
    addShiftBtn.style.display = 'block';
}

function listShifts() {
    const shiftList = document.getElementById('schedule-page__shift-list');
    shiftList.innerHTML = '';
    for (const shift of currSchedule.shifts) {
        appendShift(shift);
    }
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

function chooseSchedule(schedule) {
    offAllGroups();
    schedule.element.className = 'schedule-page__group schedule-page__group--active';
    schedule.chooseBtn.className = 'schedule__input schedule__input--active';
    currSchedule = schedule;
    listShifts(schedule);
    updateCalendarView();
}

function addSchedule() {
    const sector = document.getElementById('schedule-page__groups-sector');
    const group = document.createElement('div');
    sector.appendChild(group);
    
    const groupName = '№' + (schedules.length+1);
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'schedule__delete-btn';
    deleteBtn.addEventListener('click', () => {
        schedules.splice(schedules.indexOf(schedule), 1);
        const groupsLine = document.getElementById('schedule-page__groups-sector');
        if (schedules.length == 0) {
            currSchedule = {shifts: []};
            console.log(currSchedule);
            const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
            addShiftBtn.style.display = 'none';
        } else {
            chooseSchedule(schedules[0]);
        }
        listShifts();
        updateCalendarView();
        addScheduleBtn.className = "schedule-page__add-schedule-btn";
        groupsLine.removeChild(schedule.element);
    })
    const input = document.createElement('input');
    input.addEventListener('blur', () => {
        schedule.name = input.value;
    })
    input.className = 'schedule__input';
    const schedule = new Schedule(group, groupName, input, deleteBtn);
    schedules.push(schedule);

    group.appendChild(deleteBtn);

    input.value = groupName;
    input.addEventListener('click', () => {
        if (currSchedule != schedule) {
            chooseSchedule(schedule)
        }
    });
    group.appendChild(input);
    
    chooseSchedule(schedule);

    if (schedules.length == 1) {
        showAddShiftBtn();
    }
    if (schedules.length == 3) {
        addScheduleBtn.className = 'schedule-page__add-schedule-btn--passive';
    }
    input.focus();
}

addScheduleBtn.addEventListener('click', () => {
    addSchedule();
})


function closeIconField() {
    const field = document.getElementById('icons-window');
    field.style.display = 'none';
}

function getIconsField(shift) {
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
            shift.iconURL = 'url(../icons/' + path + ')';
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

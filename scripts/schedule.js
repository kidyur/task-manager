
let currScheduleIdx = 0;

class Shift {
    iconURL = 'url("../icons/question.svg")';

    constructor(name) {
        this.name = name;
    }
}

const shiftInput = document.getElementById('schedule-page__shift-input');
const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
addShiftBtn.addEventListener('click', () => {
    const shift = new Shift("1");
    schedules[currScheduleIdx].shifts.push(shift);
    appendShift(shift);
    updateCalendarView();
})


class Schedule {
    shifts = [];
    element = null;

    constructor(el, name, chooseBtn, editBtn) {
        this.name = name;
        this.element = el;
        this.chooseBtn = chooseBtn;
        this.editBtn = editBtn;
    }    
}

const schedules = [];

const addScheduleBtn = document.getElementById('schedule-page__add-group-btn');

function appendShift(shift) {
    console.log(1);
    const shiftList = document.getElementById('schedule-page__shift-list');
    const shiftEl = document.createElement('div');
    shiftEl.className = 'schedule-page__shift';

    const editZone = document.createElement('div');
    editZone.className = 'schedule-page__shift-edit-zone';
    shiftEl.appendChild(editZone);

    const icon = document.createElement('button');
    icon.className = 'schedule-page__shift-icon';
    icon.addEventListener('click', () => {
        const field = document.getElementById('icons-window');
        field.style.display = 'block';
        const iconButtons = document.getElementsByClassName('icons-window__icon');
        for (const btn of iconButtons) {
            btn.onclick = () => {
                icon.style.backgroundImage = btn.style.backgroundImage;
                shift.iconURL = btn.style.backgroundImage;
                closeIconField();
                updateCalendarView();
            }
        }
    })
    editZone.appendChild(icon);

    const input = document.createElement('input');
    input.className = 'schedule-page__shift-input';
    input.value = shift.name;
    editZone.appendChild(input);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'schedule-page__delete-shift-btn';
    shiftEl.appendChild(deleteBtn);

    if (shift == 0) {

    }

    deleteBtn.addEventListener('click', () => {
        schedules[currScheduleIdx].shifts.splice(schedules[currScheduleIdx].shifts.indexOf(shift), 1)
        shiftList.removeChild(shiftEl);
        updateCalendarView();
    })

    shiftList.appendChild(shiftEl);
}

function showAddShiftBtn() {
    const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
    addShiftBtn.style.display = 'block';
}

function listShifts(schedule=0) {
    const shiftList = document.getElementById('schedule-page__shift-list');
    shiftList.innerHTML = '';
    if (schedule) {
        for (const shift of schedule.shifts) {
            appendShift(shift);
        }
    }
}

function offAllGroups() {
    const chooseButtons = document.getElementsByClassName('schedule-page__choose-group-btn');
    for (const button of chooseButtons) {
        button.className = 'schedule-page__choose-group-btn';
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
    console.log(0)
    offAllGroups();
    console.log(1)
    schedule.element.className = 'schedule-page__group schedule-page__group--active';
    schedule.chooseBtn.className = 'schedule-page__choose-group-btn schedule-page__choose-group-btn--active';
    schedule.editBtn.className = 'schedule-page__edit-group-btn schedule-page__edit-group-btn--active'; 
    currScheduleIdx = schedules.indexOf(schedule);
    shifts = schedules[currScheduleIdx].shifts;
    listShifts(schedule);
    console.log(2)
    updateCalendarView();
    console.log(3);
}

addScheduleBtn.addEventListener('click', () => {
    if (schedules.length < 3) {
        const sector = document.getElementById('schedule-page__groups-sector');
        const group = document.createElement('div');
        sector.appendChild(group);
        
        const groupName = 'График №' + schedules.length;
        const editBtn = document.createElement('button');
        const chooseBtn = document.createElement('button');
        const schedule = new Schedule(group, groupName, chooseBtn, editBtn);
        schedules.push(schedule);

        editBtn.addEventListener('click', () => openEditor(schedule));
        group.appendChild(editBtn);

        chooseBtn.textContent = groupName;
        chooseBtn.addEventListener('click', () => chooseSchedule(schedule));
        group.appendChild(chooseBtn);
        
        chooseSchedule(schedule);

        if (schedules.length == 1) {
            showAddShiftBtn();
        }
    } else {
        alert("Слишком много графиков!!!");
    }
})


const closeEditorBtn = document.getElementById('group-editor__close-btn');

function closeEditor() {
    const editor = document.getElementById('group-editor');
    editor.style.display = 'none';
}

closeEditorBtn.addEventListener('click', () => closeEditor())


function openEditor(schedule) {
    const editor = document.getElementById('group-editor');
    editor.style.display = 'flex';
    const title = document.getElementById('group-editor__group-name');
    title.textContent = schedule.name;

    const deleteBtn = document.getElementById('group-editor__delete-btn');
    deleteBtn.addEventListener('click', () => {
        schedules.splice(schedules.indexOf(schedule), 1);
        const groupsLine = document.getElementById('schedule-page__groups-sector');
        groupsLine.removeChild(schedule.element);
        closeEditor();
        listShifts();
        if (schedules.length == 0) {
            const addShiftBtn = document.getElementById('schedule-page__add-shift-btn');
            addShiftBtn.style.display = 'none';
        } else {
            chooseSchedule(schedules[0]);
        }
        updateCalendarView();
    })

    const renameBtn = document.getElementById('group-editor__rename-btn');
    renameBtn.addEventListener('click', () => {
        const input = document.getElementById('group-editor__input');
        if (input.value != '') {
            schedule.name = input.value;
            const groupTitle = document.getElementsByClassName('schedule-page__choose-group-btn--active')[0];
            groupTitle.textContent = input.value;
            input.value = '';
            closeEditor();
        }
    })
}

function closeIconField() {
    const field = document.getElementById('icons-window');
    field.style.display = 'none';
}

function addIconButtons() {
    const iconPaths = [
        'question.svg',
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
    ]
    const field = document.getElementById('icons-window');
    for (const path of iconPaths) {
        const btn = document.createElement('button');
        btn.className = 'icons-window__icon';
        btn.style.backgroundImage = 'url(../icons/' + path + ')';
        field.appendChild(btn);
    }
}

addIconButtons();
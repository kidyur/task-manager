let currSchedule = [];
const schedules = [];

class Shift {
    iconURL = 'url("../icons/books.svg")';
    
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
        console.log(shift.name)
    })

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'shift__delete-btn';
    
    deleteBtn.addEventListener('click', () => {
        currSchedule.shifts.splice(currSchedule.shifts.indexOf(shift), 1);
        shiftList.removeChild(shiftEl);
        updateCalendarView();
    })
    
    shiftEl.addEventListener('click', () => {
        const elToDeactivate = document.getElementsByClassName('shift--editing')[0];
        if (elToDeactivate) {
            elToDeactivate.className = 'shift';
        }
        shiftEl.className = 'shift shift--editing';
        input.focus();
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
    offAllGroups();
    schedule.element.className = 'schedule-page__group schedule-page__group--active';
    schedule.chooseBtn.className = 'schedule-page__choose-group-btn schedule-page__choose-group-btn--active';
    schedule.editBtn.className = 'schedule-page__edit-group-btn schedule-page__edit-group-btn--active'; 
    currSchedule = schedule;
    listShifts(schedule);
    updateCalendarView();
}

function addSchedule() {
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
    if (schedules.length == 3) {
        addScheduleBtn.style.display = "none";
    }
}

addScheduleBtn.addEventListener('click', () => {
    addSchedule();
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
        addScheduleBtn.style.display = "inline-block";
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
        })
        field.appendChild(btn);
    }
    return field;
}

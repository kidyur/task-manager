const taskContainer = document.getElementById("tasks-page__task-list");
const addTaskButton = document.getElementById("tasks-page__add-task-button");
const taskNameInput = document.getElementById("tasks-page__task-name-input");
const dateInput = document.getElementById("tasks-page__date-input");
let tasks = [];
let dates = {};
dateInput.value = new Date().toISOString().split('T')[0];
addTaskButton.addEventListener('click', ()=>{
    createTask(taskNameInput.value, dateInput.value);
    taskNameInput.value = '';
});
const today = new Date().toISOString().split('T')[0];
class Task {
    constructor(name, date, element){
        this.name = name;
        this.date = date;
        this.element = element;
    }
    remove() {
        this.date.changeTasksCount(-1);
        this.element.remove();
    }
}
class TaskDate {
    tasksCount = 1;
    constructor(element, dateStr){
        this.element = element;
        this.dateStr = dateStr;
    }
    changeTasksCount(value) {
        this.tasksCount += value;
        if (this.tasksCount <= 0) this.remove();
    }
    remove() {
        delete dates[this.dateStr];
        this.element.remove();
    }
}
function createTask(name, dateStr) {
    let date = null;
    if (dates[dateStr]) {
        date = dates[dateStr];
        date.changeTasksCount(1);
    } else {
        dateElement = createSeparator(dateStr);
        date = new TaskDate(dateElement, dateStr);
        dates[dateStr] = date;
    }
    let element = document.createElement('div');
    let newTask = new Task(name, date, element);
    element.className = 'tasks-page__task';
    element.innerHTML = `
        <div class="tasks-page__task-name"></div>
        <button class="tasks-page__complete-task-btn"></button>
    `;
    element.getElementsByClassName('tasks-page__complete-task-btn')[0].addEventListener('click', ()=>newTask.remove());
    element.getElementsByClassName('tasks-page__task-name')[0].textContent = name;
    let nextElement = null;
    for (let i of Array.from(taskContainer.children))if (i.id.startsWith('tasks-page__task-date--')) {
        let curDate = i.id.replace('tasks-page__task-date--', '');
        if (date.dateStr < curDate) {
            nextElement = i;
            break;
        }
    }
    if (nextElement) taskContainer.insertBefore(element, nextElement);
    else taskContainer.appendChild(element);
}
function createSeparator(dateStr) {
    let nextElement;
    for (let i of Array.from(taskContainer.children))if (i.id.startsWith('tasks-page__task-date--')) {
        let curDate = i.id.replace('tasks-page__task-date--', '');
        if (dateStr < curDate) {
            nextElement = i;
            break;
        }
    }
    dateElement = document.createElement(`div`);
    dateElement.id = `tasks-page__task-date--${dateStr}`;
    dateElement.innerHTML = `<div class="tasks-page__separator">
        <div class="tasks-page__separator-date">${dateStr}</div>
        <div class="tasks-page__separator-line"></div>
    `;
    if (nextElement) taskContainer.insertBefore(dateElement, nextElement);
    else taskContainer.appendChild(dateElement);
    return dateElement;
}

//# sourceMappingURL=calendar.5b93eee9.js.map

const taskContainer = document.getElementById("tasks-page__task-list");
const addTaskButton = document.getElementById("tasks-page__add-task-btn");
const taskNameInput = document.getElementById("tasks-page__task-name-input");
const dateInput = document.getElementById("tasks-page__date-input")
const tagLine = document.getElementById("tasks-page__tag-line")
const tagInput = document.getElementById("tasks-page__tag-input")
const addTagButton = document.getElementById("tasks-page__add-tag-button")
const filterButton = document.getElementById("tasks-page__filter-btn")

let tags = [];
let tasks = [];
let dates = [];

//Перенести CreateTask в конструктор

class Task {
    name = '';
    date;
    el;
    tags = [];

    hidden = false;

    hide() {
        if (!this.hidden) {
            this.el.style.display = 'none';        
            this.hidden = true;
        }
    }

    show() {
        if (this.hidden) {
            this.el.style.display = 'flex';
            this.hidden = false;
        }
    }

    remove() {
        this.el.remove();
        this.date.tasks.pop(this);        
        this.date.update();
        tasks.splice(tasks.indexOf(this), 1);        
    }
}

class TaskDate {   
    el;
    dateStr;
    tasks = [];

    constructor() {
        dates.push(this);
    }

    update() {             
        if (this.tasks.length == 0) {  
            this.remove();
            return;
        }

        for (let t of this.tasks) {
            if (!t.hidden) {
                this.show();
                return;
            }
        }
        this.hide()        
    }
    
    hide() {
        this.el.style.display = 'none';
    }

    show() {
        this.el.style.display = 'flex';
    }

    remove() {
        this.el.remove(); 
        dates.splice(dates.indexOf(this), 1);
    }
}

class Tag {
    name;
    el;

    selected = false;


    setSelected(val) {
        if (val != this.selected) {            
            if (val) {            
                this.el.className = 'tasks-page__tag--enabled';
            }
            else {
                this.el.className = 'tasks-page__tag';
            }
        }
        this.selected = val;
    }
}


start();

function start() {      
    let zeroTask = new Task();
    let zeroTaskEl = document.createElement('div');
    taskContainer.appendChild(zeroTaskEl);
    let zeroDate = new TaskDate();
    zeroDate.tasks.push(zeroTask);
    zeroDate.el = document.createElement('div');
    zeroDate.dateStr = new Date(1971, 0, 1).toISOString();
    zeroTask.date = zeroDate;
    zeroTask.el = zeroTaskEl;    
    
    console.log(new Date().getTime());

    tasks.push(zeroTask);

    createTag('вычмаш');
    createTag('ангем');

    dateInput.value = new Date().toISOString().split('T')[0];
    

    addTagButton.addEventListener('click', () => {
        createTag(tagInput.value);
        tagInput.value = '';    
    });    
    addTaskButton.addEventListener('click', () => {
        createTask(taskNameInput.value, dateInput.value);    
        taskNameInput.value = '';
    });
    filterButton.addEventListener('click', () => {
        filter(); 
    });
}
                 

function createTask(name, dateStr) {
    cancelFilter();

    console.log(typeof(dateStr))

    let task = new Task();
    task.name = name;

    let pos = null;

         
    for (let i = tasks.length - 1; i >= 0; i--) {                
        if (dateStr >= tasks[i].date.dateStr) {                
            pos = tasks[i];
            tasks.splice(i + 1, 0, task);
            break;
        }
    }  

    let element = document.createElement('div');       
    task.el = element; 
        
    if (pos) {
        if (pos.date.dateStr != dateStr) {
            let dateElement = createDateSeparatorElement(dateStr);
            
            pos.el.insertAdjacentElement('afterend', dateElement);
            dateElement.insertAdjacentElement('afterend', element);

            let date = new TaskDate();
            date.dateStr = dateStr;
            date.el = dateElement;
            task.date = date;
        }
        else {
            pos.el.insertAdjacentElement('afterend', element);
            task.date = pos.date;                       
        }
    }


    element.className = 'tasks-page__task';
    element.innerHTML = `
        <div class="tasks-page__task-name"></div>
        <div class="tasks-page__task-tags"></div>
        <button class="tasks-page__complete-task-btn"></button>
    `;
    
    element.getElementsByClassName('tasks-page__complete-task-btn')[0].addEventListener('click', () => task.remove());
    element.getElementsByClassName('tasks-page__task-name')[0].textContent = name;
        
    taskTagsEl = element.getElementsByClassName('tasks-page__task-tags')[0];
    for (let t of tags) {
        if (t.selected) {
            taskTagsEl.innerHTML += `<div class="tasks-page__tag-in-task">#${t.name}\n</div>`;
            task.tags.push(t.name);
        }
    }

    task.date.tasks.push(task);

    deselectAllTags();
}

function createDateSeparatorElement(dateStr) {
    let dateElement = document.createElement(`div`);        
    dateElement.className = "tasks-page__separator";
    let elDateStr = dateStr;
    dateElement.innerHTML = `        
        <div class="tasks-page__separator-line"></div>
        <div class="tasks-page__separator-date">${dateStr}</div>
        <div class="tasks-page__separator-line"></div>
    `;
    return dateElement;
}

function createTag(name) {   
    let tagEl = document.createElement('button');
    tagEl.className = 'tasks-page__tag';
    tagEl.innerHTML = '#' + name;    

    let tag = new Tag();
    tag.name = name;
    tag.el = tagEl;
    
    tagEl.addEventListener('click', () => {
        tag.setSelected(!tag.selected);
    });    

    tags.push(tag);
    
    tagLine.appendChild(tagEl);
}

function deselectAllTags() {
    for (let t of tags) {
        t.setSelected(false);   
    }
}

function filter() {
    let isCancelFilter = true;
    for (let tag of tags) {
        if (tag.selected) {
            isCancelFilter = false;
        }
    }

    if (isCancelFilter) {
        cancelFilter();
        return;
    }


    for (let task of tasks) {
        hide = true;
        for (let tag of tags) {
            if (tag.selected) {
                if (task.tags.includes(tag.name)) {
                    hide = false;
                    break;
                }
            }
        }
        if (hide) {
            task.hide();
        }
        else {
            task.show();
        }
    }
    

    for (let d of dates) {
        d.update();
    }

    deselectAllTags();
}

function cancelFilter() {
    for (let task of tasks) {
        task.show(); 
    }

    for (let d of dates) {
        d.update();
    }
}

function toUserDateStr(date) {
    
}
    
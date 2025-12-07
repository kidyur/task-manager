import TaskList from "./taskList.mjs"
import TaskDate from "./taskDate.mjs"

class Task {
    name = '';
    taskDate;
    el;
    tags = [];

    dateHidden = false;
    tagHidden = false;

    init(name, date) {     
        TaskList.cancelFilter();

        this.name = name;
        this.date = date;

        let pos = null;        
        for (let i = TaskList.tasks.length - 1; i >= 0; i--) {  
            if (date >= TaskList.tasks[i].taskDate.date) {                
                pos = TaskList.tasks[i];
                TaskList.tasks.splice(i + 1, 0, this);
                break;
            }
        }  
        
        let element = document.createElement('div');             
        element.className = 'tasks-page__task';
        element.innerHTML = `
            <div class="tasks-page__task-name"></div>
            <div class="tasks-page__task-tags"></div>
            <button class="tasks-page__complete-task-btn"></button>
        `;    
        element.getElementsByClassName('tasks-page__complete-task-btn')[0].addEventListener('click', () => this.remove());
        element.getElementsByClassName('tasks-page__task-name')[0].textContent = name;  
        let taskTagsEl = element.getElementsByClassName('tasks-page__task-tags')[0];
        this.el = element; 
        for (let t of TaskList.tags) {
            if (t.selected) {
                let newTagEl = document.createElement('div');
                newTagEl.className = 'tasks-page__tag-in-task';
                newTagEl.innerHTML = "#" + t.name;
                taskTagsEl.appendChild(newTagEl);
                this.tags.push(t.name);
            }
        }

        if (pos) {
            if (pos.taskDate.date.valueOf() != date.valueOf()) {              
                let taskDate = new TaskDate();
                taskDate.init(date);
                this.taskDate = taskDate;
                
                pos.el.insertAdjacentElement('afterend', this.taskDate.el);
                taskDate.el.insertAdjacentElement('afterend', element);
            }
            else {
                pos.el.insertAdjacentElement('afterend', element);
                this.taskDate = pos.taskDate;                       
            }
        }       
        
        TaskList.tasks.push(this);

        TaskList.deselectAllTags();
    }

    hide() {
        if (!this.isHidden()) {
            this.el.style.display = 'none';        
        }
    }

    show() {
        if (this.isHidden()) {
            this.el.style.display = 'flex';
        }
    }

    isHidden() {
        return this.dateHidden && this.tagHidden;
    }

    remove() {
        this.el.remove();
        this.taskDate.tasks.splice(this.taskDate.tasks.indexOf(this), 1);       
        this.taskDate.update();
        TaskList.tasks.splice(TaskList.tasks.indexOf(this), 1);
        // Сохраняем данные
        saveAppData();
    }

    toJSON() {
        let obj = {};
        obj.name = this.name;
        if (this.tags.length == 0) {
            obj.tag = "";
        }
        else {
            obj.tag = this.tags[0].name;
        }
        obj.date = [this.taskDate.date.getDate(), this.taskDate.date.getMonth(), this.taskDate.date.getYear()];
        return obj;
    }
}

export default Task;


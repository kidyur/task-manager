import TaskList from "./taskList.mjs"
import TaskDate from "./taskDate.mjs"

class Task {
    name = '';
    taskDate;
    el;
    tag = '';

    dateHidden = false;
    tagHidden = false;

    init(name, date, tag) {     
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
            <button class="tasks-page__complete-task-btn">+</button>
        `;    
        element.getElementsByClassName('tasks-page__complete-task-btn')[0].addEventListener('click', () => this.remove());
        element.getElementsByClassName('tasks-page__task-name')[0].textContent = name;  
        let taskTagsEl = element.getElementsByClassName('tasks-page__task-tags')[0];
        this.el = element; 

        if (tag != '') {
            let newTagEl = document.createElement('div');
            newTagEl.className = 'tasks-page__tag-in-task';
            newTagEl.innerHTML = "#" + tag;
            taskTagsEl.appendChild(newTagEl);
            this.tag = tag;
                    
        }


        console.log(pos);
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
        else {   
            if (TaskList.tasks.length == 0) {
                let taskDate = new TaskDate();
                taskDate.init(date);
                this.taskDate = taskDate;
                    
                TaskList.taskContainer.appendChild(taskDate.el);
                taskDate.el.insertAdjacentElement('afterend', element);

                TaskList.tasks.push(this);
            }
            else {
                let taskDate = new TaskDate();
                taskDate.init(date);
                this.taskDate = taskDate;
                    
                TaskList.tasks[0].taskDate.el.insertAdjacentElement('beforebegin', taskDate.el); 
                taskDate.el.insertAdjacentElement('afterend', element);

                TaskList.tasks.splice(0, 0, this);                
            }
        }       

        this.taskDate.tasks.push(this);
        
        TaskList.deselectAllTags();
    }

    update() {
        if (this.isHidden()) {
            this.hide(); 
        }
        else {
            this.show(); 
        }
    }

    hide() {
        this.el.style.display = 'none';        
    }

    show() {
        this.el.style.display = 'flex';
    }

    isHidden() {
        return this.dateHidden || this.tagHidden;
    }

    remove() {
        this.el.remove();
        this.taskDate.tasks.splice(this.taskDate.tasks.indexOf(this), 1);       
        this.taskDate.update();
        TaskList.tasks.splice(TaskList.tasks.indexOf(this), 1);
    }

    toJSON() {
        let obj = {};
        obj.name = this.name;
        obj.tag = this.tag;
        obj.date = [this.taskDate.date.getYear() + 1900, this.taskDate.date.getMonth(), this.taskDate.date.getDate()];
        return obj;
    }
}

export default Task;


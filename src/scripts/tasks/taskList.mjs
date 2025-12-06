import TaskDate from "./taskDate.mjs";
import Task from "./task.mjs";
import Tag from "./tag.mjs"
import DateData from "../dateData.mjs"



class TaskList {
    static tags = [];
    static tasks = [];
    static dates = [];
    
    static taskContainer = document.getElementById("tasks-page__task-list");
    static tagLine = document.getElementById("tasks-page__tag-line");

    static taskNameInput = document.getElementById("tasks-page__task-name-input");
    static tagInput = document.getElementById("tasks-page__tag-input");

    static addTaskButton = document.getElementById("tasks-page__add-task-btn");
    static addTagButton = document.getElementById("tasks-page__add-tag-button");
    static filterButton = document.getElementById("tasks-page__filter-btn");
        

    static start() {      
        let zeroTask = new Task();
        let zeroTaskEl = document.createElement('div');
        this.taskContainer.appendChild(zeroTaskEl);
        let zeroDate = new TaskDate();
        zeroDate.tasks.push(zeroTask);
        zeroDate.el = document.createElement('div');
        zeroDate.date = new Date(1971, 0, 1);
        zeroTask.taskDate = zeroDate;
        zeroTask.el = zeroTaskEl;    
        
        this.tasks.push(zeroTask);
        this.dates.push(zeroDate);
        
        new Tag(this).init('вычмаш');
        new Tag(this).init('ангем');
        

        this.addTagButton.addEventListener('click', () => {
            this.addTag();
        });    
        this.addTaskButton.addEventListener('click', () => {
            this.addTask();
        });
        this.filterButton.addEventListener('click', () => {
            this.filter(); 
        });
    }

    static deselectAllTags() {
        for (let t of this.tags) {
            t.setSelected(false);   
        }
    }

    static filter() {
        let isCancelFilter = true;
        for (let tag of this.tags) {
            if (tag.selected) {
                isCancelFilter = false;
            }
        }

        if (isCancelFilter) {
            this.cancelFilter();
            return;
        }


        for (let task of this.tasks) {
            let hide = true;
            for (let tag of this.tags) {
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
        

        for (let d of this.dates) {
            d.update();
        }

        this.deselectAllTags();
    }

    static cancelFilter() {
        for (let task of this.tasks) {
            task.show(); 
        }

        for (let d of this.dates) {
            d.update();
        }
    }

    static addTask() {
        if (this.taskNameInput.value != '') {
            new Task().init(this.taskNameInput.value, new Date(DateData.chosenYear, DateData.chosenMonth-1, DateData.chosenDay));
            this.taskNameInput.value = '';
        }
    }

    static addTag() {        
        if (this.tagInput.value != '' && this.tags.length < 7) {                
            for (let t of this.tags) {                
                if (t.name == this.tagInput.value) {
                    return;
                }
            }            
            new Tag().init(this.tagInput.value);
            TaskList.tagInput.value = '';                    
        }
    }
}

export default TaskList
    
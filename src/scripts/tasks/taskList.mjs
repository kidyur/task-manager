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
        this.addTagButton.addEventListener('click', () => {
            this.addTag(this.tagInput.value);
        });    
        this.addTaskButton.addEventListener('click', () => {
            this.addTask(this.taskNameInput.value, new Date(DateData.chosenYear, DateData.chosenMonth-1, DateData.chosenDay));
        });
        this.filterButton.addEventListener('click', () => {
            this.filterByTag(); 
        });

    }

    static deselectAllTags() {
        for (let t of this.tags) {
            t.setSelected(false);   
        }
    }

    static update() {        
        for (const task of this.tasks) {
            if (task.isHidden()) {
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

    static filterByTag() {
        let cancelFilter = true;
        for (let tag of this.tags)  {
            if (tag.selected) {
                cancelFilter = false;
                break;
            }
        }

        if (cancelFilter) {
            for (let task of this.tasks) {
                task.tagHidden = false;
            }
        }
        else {
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

                task.tagHidden = hide;
            }   
        }

        this.update();   
    }

    static filterByDate() {         
        let chosedDate = Date(DateData.chosenYear, DateData.chosenMonth, DateData.chosenDay);
        for (let task of this.tasks) {
            let hide = true;
                        
            if (task.taskDate.date.valueOf() < chosedDate.valueOf()) {
                hide = false;
            }            

            task.tagHidden = hide;
        }         

        this.update();
    }

    static parseJSON(list) {  
        console.log(list.tasks);

        for (const task of list.tasks) {   
            this.addTask(task.name, new Date(task.date[0], task.date[1], task.date[2]));
        }        
        for (const tag of list.tags) {
            this.addTag(tag.name);
        }

    }

    static toJSON2() {
        let res = {};
        let res_tasks = [];
        let res_tags = [];
        for (const task of this.tasks) {
            res_tasks.push(task.toJSON());
        }                
        for (const tag of this.tags) {
            res_tags.push(tag.name);
        }

        res.tasks = res_tasks;
        res.tags = res_tags;
        
        return res;
    }

    static cancelFilter() {
        for (let task of this.tasks) {
            task.show(); 
        }

        for (let d of this.dates) {
            d.update();
        }
    }

    static addTask(name, date) {
        if (name != '') {
            console.log('COCKISHE');
            new Task().init(name, date);
            this.taskNameInput.value = '';
        }
    }

    static addTag(name) {        
        if (name != '') {                
            for (let t of this.tags) {                
                if (t.name == this.tagInput.value) {
                    return;
                }
            }            
            new Tag().init(name);
            this.tagInput.value = '';                    
        }
    }
}

export default TaskList
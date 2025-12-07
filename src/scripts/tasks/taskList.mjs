import TaskDate from "./taskDate.mjs";
import Task from "./task.mjs";
import Tag from "./tag.mjs"
import DateData from "../dateData.mjs"


class TaskList {
    static tasks = [];
    static dates = [];
    static tags = [];
    static selectedTag = null;
    
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
            if (this.selectedTag) {
                this.addTask(this.taskNameInput.value, new Date(DateData.chosenYear, DateData.chosenMonth-1, DateData.chosenDay), this.selectedTag.name);
            }
            else {
                this.addTask(this.taskNameInput.value, new Date(DateData.chosenYear, DateData.chosenMonth-1, DateData.chosenDay), '');
            }
        });
        this.filterButton.addEventListener('click', () => {
            this.filterByTag(); 
        });
        

    }

    static deselectAllTags() {
        this.selectedTag = null;
        for (let t of this.tags) {
            t.setSelected(false);   
        }
    }

    static update() {        
        for (const task of this.tasks) {
            task.update();
        }

        for (let d of this.dates) {
            d.update();
        }

        this.deselectAllTags();
    }

    static filterByTag() {
        if (this.selectedTag == null) {
            for (let task of this.tasks) {
                task.tagHidden = false;
            }
        }
        else {
            for (let task of this.tasks) {
                let hide = true;            

                if (task.tag == this.selectedTag.name) {
                    hide = false;
                }   

                task.tagHidden = hide;
            }   
        }

        this.update();   
    }

    static filterByDate(chosenDate) {         
        console.log(chosenDate);
        for (let task of this.tasks) {
            let hide = true;
                        
            if (task.taskDate.date.valueOf() >= chosenDate.valueOf()) {
                hide = false;
            }            

            task.dateHidden = hide;
        }         

        this.update();
    }

    static parseJSON(list) {  
        for (const task of list.tasks) {   
            this.addTask(task.name, new Date(task.date[0], task.date[1], task.date[2]), task.tag);
        }        
        for (const tag of list.tags) {
            this.addTag(tag);
        }

    }

    static toJSON() {
        let res = {};
        let res_tasks = [];
        let res_tags = [];
        for (const task of this.tasks) {
            console.log("COCK");
            res_tasks.push(task.toJSON());
        }                
        for (const tag of this.tags) {
            res_tags.push(tag.name);
        }

        res.tasks = res_tasks;
        res.tags = res_tags;
        
        return res;
    }

    static addTask(name, date, tag) {
        if (name != '') {
            new Task().init(name, date, tag);
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
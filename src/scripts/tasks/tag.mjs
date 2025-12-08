import TaskList from "./taskList.mjs";

class Tag {
    name;
    el;

    selected = false;


    init(name) {        
        this.name = name;

        this.el = document.createElement('button');
        this.el.className = 'tasks-page__tag';
        this.el.innerHTML = '#' + name;    
        
        const delBtn = document.createElement('button');
        delBtn.className = 'tasks-page__delete-tag-btn';
        delBtn.addEventListener('click', () => {
           this.remove(); 
        });

        this.el.appendChild(delBtn);

        this.el.addEventListener('click', () => {
            this.setSelected(!this.selected);
        });    

        TaskList.tags.push(this);
        
        TaskList.tagLine.appendChild(this.el);
    }

    setSelected(val) {
        if (val != this.selected) {            
            if (val) {            
                TaskList.deselectAllTags();
                this.el.className = 'tasks-page__tag--enabled';
                TaskList.selectedTag = this;
            }
            else {
                this.el.className = 'tasks-page__tag';
            }
        }
        this.selected = val;
    }

    remove() {
        console.log(TaskList.tags);
        this.el.remove();        
        TaskList.tags.splice(TaskList.tags.indexOf(this), 1);
        TaskList.selectedTag = null;
        console.log(TaskList.tags); 
    }

}

export default Tag
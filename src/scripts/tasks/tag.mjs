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
}

export default Tag
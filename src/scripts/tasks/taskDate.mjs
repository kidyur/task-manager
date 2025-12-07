import TaskList from "./taskList.mjs";

class TaskDate {   
    el;
    dateStr;
    date;
    tasks = [];
    
    init(date) {
        TaskList.dates.push(this);

        this.date = date;
        this.dateStr = this.#getUserStr();
        
        this.el = document.createElement(`div`);        
        this.el.className = "tasks-page__separator";
        this.el.innerHTML = `        
            <div class="tasks-page__separator-line"></div>
            <div class="tasks-page__separator-date">${this.dateStr}</div>
            <div class="tasks-page__separator-line"></div>
        `;
    }

    update() {             
        if (this.tasks.length == 0) {  
            this.remove();
            return;
        }

        console.log(this.tasks);
        for (let t of this.tasks) {
            if (!t.isHidden()) {
                this.show();
                return;
            }
        }
        this.hide();
    }
    
    hide() {
        this.el.style.display = 'none';
    }

    show() {
        this.el.style.display = 'flex';
    }

    remove() {
        this.el.remove(); 
        TaskList.dates.splice(TaskList.dates.indexOf(this), 1);
    }    

    #getUserStr() {
        let convertValue = 1000 * 60 * 60 * 24;
        let dif = Math.floor(this.date.valueOf() / convertValue) - Math.floor(Date.now() / convertValue);
        if (dif == 0) {
            return 'Сегодня';
        }
        else if (dif == 1) {
            return 'Завтра';
        }
        else {
            const monthNames = [
                "Января",   "Февраля", 
                "Марта",     "Апреля",  "Мая", 
                "Июня",     "Июль",    "Августа", 
                "Сентября", "Октября", "Ноября",
                "Декабря"
            ];    
            let month = '';
            let res = this.date.getDate() + " " + monthNames[this.date.getMonth()];            
            return res;
        }
    }
}

export default TaskDate
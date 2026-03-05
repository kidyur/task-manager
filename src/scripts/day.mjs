import SchedulesData from "./schedulesData.mjs";
import DateData from "./dateData.mjs";
import Calendar from "./calendar.mjs";
import TaskList from "./tasks/taskList.mjs"

class Day {
    #borderFlag = false;
    #element    = undefined;
    #iconURL    = "";
    #idx        = 0;
    #value = 0;
    #title = '';
    
    constructor(idx, borderFlag = false, iconTag = "") {
        const el = document.createElement('div');
        this.#element = el;
        this.#idx = idx;
        this.#borderFlag = borderFlag;
        el.innerText = idx;
        el.className = 'calendar__day calendar__day_month';
        el.addEventListener('click', () => {
            this.select();
        })
        
        if (SchedulesData.currentSchedule.getShiftsLength() > 0) {
            this.#createIcon(iconTag);
            this.#upperline();
        } 

        const calendarEl = document.getElementById('calendar');
        calendarEl.appendChild(el);
    }

    updateView(title, border = false, icon = "") {
        this.#title = title;
        this.#element.textContent = title;
        this.#borderFlag = border;
        this.#iconURL = icon;
        this.#upperline();
    }

    #createIcon(iconTag) {
        const icon = document.createElement('div');
        icon.setAttribute('shift-icon', iconTag);
        icon.className = 'calendar__icon';
        this.#element.appendChild(icon);
    }

    #upperline() {
        if (this.#title == '') {
            this.#element.style.borderTop = '';
            return;
        }
        if (this.#borderFlag) {
            this.#element.style.borderTop = '3px solid white';
        } else {
            this.#element.style.borderTop = '3px solid red';
        }
    }

    select() {
        DateData.chosenDay = this.#idx;
        const m = DateData.month;
        DateData.chosenMonth = m;
        const y = DateData.year;
        DateData.chosenYear = y;
        Calendar.offLastWeek();
        const calendar = document.getElementById('calendar');
        const days = calendar.getElementsByClassName('calendar__day_month');
        for (let i = 0; i < days.length; i++) {
            if (days[i] == this.#element) {
                Calendar.onWeek(i);
                break;
            }
        }
        if (this.#borderFlag) {
            this.#element.classList.add('calendar__day--active1');
        } else {
            this.#element.classList.add('calendar__day--active2');
        }
        TaskList.filterByDate(new Date(DateData.chosenYear, DateData.chosenMonth - 1, DateData.chosenDay));
    }
}

export default Day;
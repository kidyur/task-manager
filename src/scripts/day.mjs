import DateData from "./dateData.mjs";
import Calendar from "./calendar.mjs";
import TaskList from "./tasks/taskList.mjs"

class Day {
    #borderFlag = false;
    #element    = null;
    #idx        = 0;
    #title = '';
    
    constructor(title) {
        this.#render();
        this.#setTitle(title);
        this.#element.addEventListener('click', () => {
            this.#select();
        })
    }
    
    #render() {
        this.#element = document.createElement('div');
        this.#element.className = 'calendar__day calendar__day_month';
        this.#element.innerHTML = `
            <div class="day__title"></div>
            <div class="calendar__icon"></div>
        `;
        const calendarEl = document.querySelector('.calendar');
        calendarEl.appendChild(this.#element);
    }

    updateView(title, border = false, icon = "") {
        this.#setTitle(title);
        this.#setBorder(border);
        this.#setIcon(icon);
    }

    #setBorder(border) {
        this.#borderFlag = border;
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

    #setTitle(title) {
        this.#title = title;
        this.#element.querySelector(".day__title").innerHTML = title;
    }

    #setIcon(icon) {
        this.#element.querySelector('.calendar__icon').setAttribute('shift-icon', icon);
    }

    #select() {
        const cal = new Calendar();
        const dateData = new DateData();
        dateData.setDate(this.#idx);
        cal.offLastWeek();
        const calendar = document.getElementById('calendar');
        const days = calendar.getElementsByClassName('calendar__day_month');
        for (let i = 0; i < days.length; i++) {
            if (days[i] == this.#element) {
                cal.onWeek(i);
                break;
            }
        }
        if (this.#borderFlag) {
            this.#element.classList.add('calendar__day--active1');
        } else {
            this.#element.classList.add('calendar__day--active2');
        }
        TaskList.filterByDate(new Date(dateData.year, dateData.month - 1, dateData.day));
    }
}

export default Day;
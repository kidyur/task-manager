class Day {
    #borderFlag = false;
    #element    = HTMLButtonElement;
    #iconURL    = "";
    #idx        = 0;
    
    constructor(idx, borderFlag, iconURL) {
        const el = document.createElement('div');
        this.#element = el;
        this.#idx = idx;
        this.#borderFlag = borderFlag;
        this.#iconURL = iconURL;
        el.innerText = idx;
        el.className = 'calendar__day calendar__day_month';
        el.addEventListener('click', () => {
            this.select();
        })
        
        if (SchedulesData.getSchedulesLength() > 0) {
            this.#createIcon();
            this.#upperline();
        } 

        const calendarEl = document.getElementById('calendar');
        calendarEl.appendChild(el);
        if (idx == datePicker.day) {
            this.select();
        }
    }

    #createIcon() {
        const icon = document.createElement('div');
        icon.style.backgroundImage = this.#iconURL;
        icon.className = 'calendar__icon';
        this.#element.appendChild(icon);
    }

    #upperline() {
        if (this.#borderFlag) {
            this.#element.style.borderTop = '3px solid white';
        } else {
            this.#element.style.borderTop = '3px solid red';
        }
    }

    select() {
        datePicker.day = this.#idx;
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
    }

    get iconURL() {
        return this.#iconURL;
    }
}

export default Day;
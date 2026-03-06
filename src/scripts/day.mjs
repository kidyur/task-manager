import DateData from "./dateData.mjs";

class Day {
    #borderFlag = false;
    #element    = null;
    #idx        = 0;
    
    constructor(idx) {
        this.#render();
        this.#setIdx(idx);
        this.#element.addEventListener('click', () => {
            const dateData = new DateData();
            dateData.setDate(this.#idx);
        })
    }

    updateView(idx, border = false, icon = "") {
        this.#setIdx(idx);
        this.#setBorder(border);
        this.#setIcon(icon);
        this.#setClass();
    }
    
    #render() {
        this.#element = document.createElement('div');
        this.#element.className = 'calendar__day';
        this.#element.innerHTML = `
            <div class="day__title"></div>
            <div class="calendar__icon"></div>
        `;
        const calendarEl = document.querySelector('.calendar');
        calendarEl.appendChild(this.#element);
    }

    /**
     * It makes opacity: 100% for all days of chosen week.
     * It makes bigger the day you have chosen.
     */
    #setClass() {
        let classname = "calendar__day";
        const dateData = new DateData();
        if (dateData.day == this.#idx) {
            if (this.#borderFlag) {
                classname += ' calendar__day--active1';
            } else {
                classname += ' calendar__day--active2';
            }
        }
        const hook = dateData.day + dateData.getFirstDayIdxOfCurrMonth() - 1;
        const weekBeginningIdx = hook - hook % 7;
        if (this.#idx + dateData.getFirstDayIdxOfCurrMonth() <= weekBeginningIdx + 7 && this.#idx + dateData.getFirstDayIdxOfCurrMonth() > weekBeginningIdx) {
            classname += ' calendar__day_week';
        }
        this.#element.className = classname;
    }

    #setBorder(border) {
        this.#borderFlag = border;
        if (this.#idx == -1 || !Number.isInteger(this.#idx)) {
            this.#element.style.borderTop = '';
            return;
        }
        if (this.#borderFlag) {
            this.#element.style.borderTop = '3px solid white';
        } else {
            this.#element.style.borderTop = '3px solid red';
        }
    }

    #setIdx(idx) {
        this.#idx = idx;
        if (idx == -1) {
            this.#element.querySelector(".day__title").innerHTML = '';
        } else {
            this.#element.querySelector(".day__title").innerHTML = idx;
        }
    }

    #setIcon(icon) {
        this.#element.querySelector('.calendar__icon').setAttribute('shift-icon', icon);
    }
}

export default Day;
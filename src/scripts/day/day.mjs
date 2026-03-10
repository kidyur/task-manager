import CalendarModel from "../calendar/calendar-model.mjs";
import "./day.css";


class Day {
    #borderFlag = false;
    #element    = null;
    #idx        = 0;
    
    constructor(idx) {
        this.#render();
        this.#setIdx(idx);
        this.#element.addEventListener('click', () => {
            const calendarViewModel = new CalendarModel();
            calendarViewModel.setDate(this.#idx);
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
        this.#element.className = 'calendarView__day';
        this.#element.innerHTML = `
            <div class="day__title"></div>
            <div class="calendarView__icon"></div>
        `;
        const grid = document.querySelector('.calendarView__days-grid');
        grid.appendChild(this.#element);
    }

    /**
     * It makes opacity: 100% for all days of chosen week.
     * It makes bigger the day you have chosen.
     */
    #setClass() {
        let classname = "calendarView__day";
        const calendarViewModel = new CalendarModel();
        if (calendarViewModel.day == this.#idx) {
            if (this.#borderFlag) {
                classname += ' calendarView__day--active1';
            } else {
                classname += ' calendarView__day--active2';
            }
        }
        const hook = calendarViewModel.day + calendarViewModel.getFirstDayIdxOfCurrMonth() - 1;
        const weekBeginningIdx = hook - hook % 7;
        if (this.#idx + calendarViewModel.getFirstDayIdxOfCurrMonth() <= weekBeginningIdx + 7 && this.#idx + calendarViewModel.getFirstDayIdxOfCurrMonth() > weekBeginningIdx) {
            classname += ' calendarView__day_week';
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
        this.#element.querySelector('.calendarView__icon').setAttribute('shift-icon', icon);
    }
}

export default Day;
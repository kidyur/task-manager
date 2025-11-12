import DateData from "./dateData.mjs";
import Calendar from "./calendar.mjs";

class Month {
    #element;
    #idx;
    #year;

    constructor(listEl, idx, year, DateData) {
        this.#idx = idx;
        this.#year = year;
        
        const el = document.createElement('button');
        el.addEventListener('click', () => {
            this.select();
        })
        this.#element = el;
        listEl.appendChild(el);
        el.className = 'month-picker__month';
        el.textContent = idx;
        if (year == this.#year) {
            this.#element.classList.add('month-picker__month_current')
        }
        if (DateData.month == this.#idx && 
            DateData.year  == this.#year) {
            this.#element.classList.add('month-picker__month--active');
        }
    }

    select() {
        DateData.offLastYear();
        DateData.onMonth(this.#element);
        DateData.setDate(-1, this.#idx, this.#year);
        Calendar.update();
        DateData.hide();
    }
}

export default Month;
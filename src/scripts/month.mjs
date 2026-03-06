import DateData from "./dateData.mjs";
import Calendar from "./calendar.mjs";
import DatePicker from "./datePicker.mjs";

class Month {
    #element = undefined;
    #idx     = 0;

    constructor(listEl, idx) {
        this.#idx = idx;
        
        const el = document.createElement('button');
        if (idx != 0) {
            el.addEventListener('click', () => {
                this.select();
            })
            const name = document.createElement('div');
            const dateData = new DateData();
            name.textContent = dateData.getMonthName(idx-1);
            el.appendChild(name);
            if (dateData.month == this.#idx) {
                el.classList.add('month-picker__month--active');
            }
        } 

        this.#element = el;
        listEl.appendChild(el);
        el.className = 'month-picker__month';
    }

    makeAsSeason(text) {
        this.#element.textContent = text;
    }

    setIcon(seasonTag) {
        const icon = document.createElement('div');
        icon.className = 'month__icon';
        icon.setAttribute('season', seasonTag);
        this.#element.appendChild(icon);
    }

    select() {
        const dateData = new DateData();
        const datePicker = new DatePicker();
        datePicker.offLastSeason();
        datePicker.onMonth(this.#element);
        dateData.setDate(dateData.day, this.#idx);
        datePicker.monthEl = this.#element;
        datePicker.hide();
    }
}

export default Month;
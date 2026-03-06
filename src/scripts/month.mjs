import DateData from "./dateData.mjs";
import Calendar from "./calendar.mjs";

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
        const calendar = new Calendar();
        const dateData = new DateData();
        dateData.offLastSeason();
        dateData.onMonth(this.#element);
        dateData.setDate(dateData.day, this.#idx);
        dateData.monthEl = this.#element;
        calendar.update();
        dateData.hide();
    }
}

export default Month;
import DateData from "./dateData.mjs";
import Calendar from "./calendar.mjs";

class Month {
    #element = HTMLButtonElement;
    #idx     = 0;

    constructor(listEl, idx) {
        this.#idx = idx;
        
        const el = document.createElement('button');
        if (idx != 0) {
            el.addEventListener('click', () => {
                this.select();
            })
            const name = document.createElement('div');
            name.textContent = DateData.getMonthName(idx-1);
            el.appendChild(name);
            if (DateData.month == this.#idx) {
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

    setIcon(imageURL) {
        const icon = document.createElement('div');
        icon.className = 'month__icon';
        icon.style.backgroundImage = 'url("./src/icons/' + imageURL + '")';
        this.#element.appendChild(icon);
    }

    select() {
        DateData.offLastSeason();
        DateData.onMonth(this.#element);
        DateData.chosenMonth = this.#idx;
        DateData.chosenYear = DateData.year;
        DateData.monthEl = this.#element;
        DateData.setDate(-1, this.#idx, DateData.year);
        Calendar.update();
        DateData.hide();
    }
}

export default Month;
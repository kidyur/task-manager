class Month {
    #element;
    #name;
    #idx;
    #year;

    constructor(listEl, idx, year, datePicker) {
        this.#idx = idx;
        this.#year = year;

        const el = document.createElement('button');
        this.#element = el;
        listEl.appendChild(el);
        el.className = 'month-picker__month';
        el.textContent = idx;
        if (year == this.#year) {
            this.#element.classList.add('month-picker__month_current')
        }
        if (datePicker.month == this.#idx && 
            datePicker.year  == this.#year) {
            this.#element.classList.add('month-picker__month--active');
        }
    }

    select() {
        datePicker.offLastYear();
        datePicker.onMonth(this.#element);
        datePicker.hide();
        datePicker.setDate(-1, this.#idx, this.#year);
        calendar.update();
    }

    get element() {
        return this.#element;
    }
}

export default Month;
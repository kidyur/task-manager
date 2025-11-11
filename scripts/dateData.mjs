class DateData {
    static #month = 0;
    static #year = 0;
    static #day = 0;
    #element = HTMLDivElement;
    
    #monthsNames = [
        "Январь",   "Февраль", 
        "Март",     "Апрель",  "Май", 
        "Июнь",     "Июль",    "Август", 
        "Сентябрь", "Октябрь", "Ноябрь",
        "Декабрь"
    ];
    
    constructor() {
        this.setCurrentDate();
        this.#setupButton();
        const picker = document.getElementById('month-picker');
        this.#element = picker;
        const now = new Date();
        const currYear = now.getFullYear();
        for (let year = currYear; year <= currYear+4; year++) {
            const yearEl = document.createElement('div');
            picker.appendChild(yearEl);
            yearEl.className = 'month-picker__year';
            yearEl.textContent = year;
            this.#createSeparator();
            const monthsBlock = document.createElement('div');
            picker.appendChild(monthsBlock);
            monthsBlock.className = 'month-picker__months-block';
            for (let m = 1; m <= 12; m++) {
                const month = new Month(monthsBlock, m, year, this);
                month.element.addEventListener('click', () => {
                    month.select();
                })
            }
        }
    }

    #updateTitle() {
        const title = document.getElementById("calendar-page__title");
        title.innerText = DatePicker.#year + ' ' + this.#monthsNames[DatePicker.#month - 1];
    }

    offLastYear() {
        const prevMonths = document.querySelectorAll('.month-picker__month_current');
        for (const m of prevMonths) {
            m.className = 'month-picker__month';
        }
    }

    setCurrentDate() {
        const currentDate = new Date();
        DatePicker.#day = currentDate.getDate();
        DatePicker.#month = currentDate.getMonth() + 1;
        DatePicker.#year = currentDate.getFullYear();
        this.#updateTitle();
    }

    setDate(day, month, year) {
        DatePicker.#day = day;
        DatePicker.#month = month;
        DatePicker.#year = year;
        this.#updateTitle();
    }

    onMonth(element) {
        const currMonths = element.parentNode.getElementsByClassName('month-picker__month');
        for (const m of currMonths) {
            m.classList.add('month-picker__month_current');
        }
        element.classList.add('month-picker__month--active');
    }

    hide() {
        this.#element.style.display = 'none';
    }

    #setupButton() {
        const monthPickerBtn = document.getElementById('calendar-page__month-picker-btn');
        monthPickerBtn.addEventListener('click', () => {
            const picker = document.getElementById('month-picker');
            picker.style.display = 'block';
        })
    }

    #createSeparator() {
        const seasons = [
            'Зима', "Весна", "Лето", "Осень"
        ];
        const separatorLine = document.createElement('div');
        separatorLine.className = 'month-picker__separator-line';
        for (let i = 0; i < 4; i++) {
            const season = document.createElement('div');
            season.className = 'month-picker__season';
            season.textContent = seasons[i];
            separatorLine.appendChild(season);
        }
        const yearEl = document.createElement('div');
        this.#element.appendChild(separatorLine);
    }

    get month() {
        return DatePicker.#month;
    }

    get year() {
        return DatePicker.#year;
    }

    get day() {
        return DatePicker.#day;
    }

    set day(d) {
        if (d > 0 && d.constructor.name == "Number") {
            DatePicker.#day = d;
        } else {
            alert("Попытка присвоить некорректное значение дню")
        }
    }
}

export default DateData;
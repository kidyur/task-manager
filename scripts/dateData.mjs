import Month from "./month.mjs";

class DateData {
    static #month = 0;
    static get month() { return DateData.#month };

    static #year = 0;
    static get year() { return DateData.#year };

    static #day = 0;
    static get day() { return DateData.#day };
    static set day(d) {
        if (d > 0 && d.constructor.name == "Number") {
            DateData.#day = d;
        } else {
            alert("Попытка присвоить некорректное значение дню")
        }
    }

    static #element = HTMLDivElement;
    static #monthsNames = [
        "Январь",   "Февраль", 
        "Март",     "Апрель",  "Май", 
        "Июнь",     "Июль",    "Август", 
        "Сентябрь", "Октябрь", "Ноябрь",
        "Декабрь"
    ];
    
    constructor() { }
    
    static initDatePicker() {
        DateData.setCurrentDate();
        DateData.#setupButton();
        const picker = document.getElementById('month-picker');
        DateData.#element = picker;
        const now = new Date();
        const currYear = now.getFullYear();
        for (let year = currYear; year <= currYear+4; year++) {
            const yearEl = document.createElement('div');
            picker.appendChild(yearEl);
            yearEl.className = 'month-picker__year';
            yearEl.textContent = year;
            DateData.#createSeparator();
            const monthsBlock = document.createElement('div');
            picker.appendChild(monthsBlock);
            monthsBlock.className = 'month-picker__months-block';
            for (let m = 1; m <= 12; m++) {
                const month = new Month(monthsBlock, m, year, this);
            }
        }
    }

    static #updateTitle() {
        const title = document.getElementById("calendar-page__title");
        title.innerText = DateData.#year + ' ' + this.#monthsNames[DateData.#month - 1];
    }

    static offLastYear() {
        const prevMonths = document.querySelectorAll('.month-picker__month_current');
        for (const m of prevMonths) {
            m.className = 'month-picker__month';
        }
    }

    static setCurrentDate() {
        const currentDate = new Date();
        DateData.#day = currentDate.getDate();
        DateData.#month = currentDate.getMonth() + 1;
        DateData.#year = currentDate.getFullYear();
        DateData.#updateTitle();
    }

    static setDate(day, month, year) {
        DateData.#day = day;
        DateData.#month = month;
        DateData.#year = year;
        DateData.#updateTitle();
    }

    static onMonth(element) {
        const currMonths = element.parentNode.getElementsByClassName('month-picker__month');
        for (const m of currMonths) {
            m.classList.add('month-picker__month_current');
        }
        element.classList.add('month-picker__month--active');
    }

    static hide() {
        DateData.#element.style.display = 'none';
    }

    static #setupButton() {
        const monthPickerBtn = document.getElementById('calendar-page__month-picker-btn');
        monthPickerBtn.addEventListener('click', () => {
            const picker = document.getElementById('month-picker');
            picker.style.display = 'block';
        })
    }

    static #createSeparator() {
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
        DateData.#element.appendChild(separatorLine);
    }
}

export default DateData;
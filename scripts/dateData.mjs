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
        const prevYearBtn = document.getElementsByClassName('month-picker__btn')[0];
        prevYearBtn.addEventListener('click', () => DateData.setPrevYear());
        const nextYearBtn = document.getElementsByClassName('month-picker__btn')[1];
        nextYearBtn.addEventListener('click', () => DateData.setNextYear());
        const now = new Date();
        let monthIdx = 1;
        for (let i = 0; i < 5; i++) {
            const seasonBlock = document.createElement('div');
            DateData.#element.appendChild(seasonBlock);
            seasonBlock.className = 'season';
            for (let m = 0; m < 3; m++) {
                if (i == 0 && m == 0 || monthIdx > 12) {
                    const month = new Month(seasonBlock, 0);
                } else {
                    const month = new Month(seasonBlock, monthIdx);
                    monthIdx++;
                } 
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

    static getMonthName(idx) {
        return this.#monthsNames[idx];
    }

    static setCurrentDate() {
        const currentDate = new Date();
        DateData.#day = currentDate.getDate();
        DateData.#month = currentDate.getMonth() + 1;
        DateData.#year = currentDate.getFullYear();
        const monthPickerYear = document.getElementById('month-picker__year');
        monthPickerYear.textContent = DateData.#year;
        DateData.#updateTitle();
    }

    static setNextYear() {
        DateData.setDate(DateData.day, DateData.month, DateData.year + 1);
    }

    static setPrevYear() {
        DateData.setDate(DateData.day, DateData.month, DateData.year - 1);
    }

    static setDate(day, month, year) {
        DateData.#day = day;
        DateData.#month = month;
        DateData.#year = year;
        const monthPickerYear = document.getElementById('month-picker__year');
        monthPickerYear.textContent = DateData.#year;
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
}

export default DateData;
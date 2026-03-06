import Month from "./month.mjs";

class DateData {
    static #month = 0;
    static get month() { return DateData.#month };

    static #year = 0;
    static get year() { return DateData.#year };

    static #chosenYear = 1975;
    static get chosenYear() {
        return this.#chosenYear;
    }
    static set chosenYear(year) {
        this.#chosenYear = year;
    }

    static #chosenMonth = 1;
    static get chosenMonth() {
        return this.#chosenMonth;
    }
    static set chosenMonth(month) {
        this.#chosenMonth = month;
    }

    static #chosenDay = 1;
    static get chosenDay() {
        return this.#chosenDay;
    }
    static set chosenDay(day) {
        this.#chosenDay = day;
    }

    static #element = undefined;
    static #monthsNames = [
        "Январь",   "Февраль", 
        "Март",     "Апрель",  "Май", 
        "Июнь",     "Июль",    "Август", 
        "Сентябрь", "Октябрь", "Ноябрь",
        "Декабрь"
    ];

    static monthEl = undefined;
    
    constructor() { }
    
    static getFirstDayIdxOfCurrMonth() {
        let m = DateData.month + '';
        if (m < 10) {
            m = '0' + m;
        }
        const monthBeginning = new Date(`${DateData.year}-${m}-01`);
        return monthBeginning.getDay() + (monthBeginning.getDay() == 0 ? 6 : 0);
    }

    static getDaysInCurrMonth() {
        const daysInMonths = [
            31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ] 
        if (DateData.year % 4 == 0) {
            daysInMonths[1] -= 1; // For leap year
        }
        return daysInMonths[DateData.month - 1];
    }

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
        const seasons = ['Зима', "Весна", "Лето", "Осень", "Зима"];
        let activeMonth = 0;
        const seasonsTags = [
            'winter',
            'spring',
            'summer',
            'fall',
            'winter'
        ]
        for (let i = 0; i < 5; i++) {
            const seasonBlock = document.createElement('div');
            DateData.#element.appendChild(seasonBlock);
            seasonBlock.className = 'season';
            for (let m = 0; m < 4; m++) {
                if (m == 0 || i == 0 && m == 1 || monthIdx > 12) {
                    const month = new Month(seasonBlock, 0);
                    if (m == 0) {
                        month.makeAsSeason(seasons[i]);
                        month.setIcon(seasonsTags[i]);
                    }
                } else {
                    const month = new Month(seasonBlock, monthIdx);
                    if (DateData.month-1 == monthIdx-1) {
                        activeMonth = month;
                    }
                    monthIdx++;
                } 
            }
        }
        activeMonth.select();
    }

    static #updateTitle() {
        const title = document.getElementById("calendar-page__title");
        title.innerText = DateData.#year + ' ' + this.#monthsNames[DateData.#month - 1];
    }

    static offLastSeason() {
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
        DateData.#month = currentDate.getMonth() + 1;
        DateData.#year = currentDate.getFullYear();
        DateData.#chosenMonth = currentDate.getMonth() + 1;
        DateData.#chosenYear = currentDate.getFullYear();
        const monthPickerYear = document.getElementById('month-picker__year');
        monthPickerYear.textContent = DateData.#year;
        DateData.#updateTitle();
    }

    static setNextYear() {
        if (DateData.year < 2040) {
            DateData.offLastSeason();
            DateData.setDate(DateData.day, DateData.month, DateData.year + 1);
            if (DateData.month == DateData.chosenMonth && DateData.year == DateData.chosenYear) {
                DateData.onMonth(DateData.monthEl);
            }
        }
    }

    static setPrevYear() {
        if (DateData.year > 2000) {
            DateData.offLastSeason();
            DateData.setDate(DateData.day, DateData.month, DateData.year - 1);
            if (DateData.month == DateData.chosenMonth && DateData.year == DateData.chosenYear) {
                DateData.onMonth(DateData.monthEl);
            }
        }
    }

    static setDate(day, month, year) {
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
        const picker = document.getElementById('month-picker');
        picker.style.display = 'none';
        const title = document.getElementById('calendar-page__title');
        title.style.display = 'block';
        const header = document.getElementById('month-picker__header');
        header.style.display = 'none';
    }

    static #setupButton() {
        const monthPickerBtn = document.getElementById('calendar-page__month-picker-btn');
        monthPickerBtn.addEventListener('click', () => {
            const picker = document.getElementById('month-picker');
            picker.style.display = 'block';
            const title = document.getElementById('calendar-page__title');
            title.style.display = 'none';
            const header = document.getElementById('month-picker__header');
            header.style.display = 'flex';
        })
    }
}

export default DateData;
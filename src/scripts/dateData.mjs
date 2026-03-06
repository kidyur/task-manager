import Calendar from "./calendar.mjs";
import Month from "./month.mjs";

class DateData {
    #month = 0;
    get month() { return this.#month; }

    #year = 0;
    get year() { return this.#year; }

    #day = 0;
    get day() { return this.#day; }

    #element = undefined;

    static #instance = null;

    monthEl = undefined;
    
    constructor() { 
        if (DateData.#instance) {
            return DateData.#instance;
        } else {
            DateData.#instance = this;
        }

        this.setCurrentDate();
        this.#setupButton();
        this.#initDatePicker();
    }
    
    getFirstDayIdxOfCurrMonth() {
        let m = this.month + '';
        if (m < 10) {
            m = '0' + m;
        }
        const monthBeginning = new Date(`${this.year}-${m}-01`);
        return monthBeginning.getDay() + (monthBeginning.getDay() == 0 ? 6 : 0);
    }

    getDaysInCurrMonth() {
        const daysInMonths = [
            31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ] 
        if (this.year % 4 == 0) {
            daysInMonths[1] -= 1; // For leap year
        }
        return daysInMonths[this.month - 1];
    }

    #initDatePicker() {
        const picker = document.getElementById('month-picker');
        this.#element = picker;
        const prevYearBtn = document.getElementsByClassName('month-picker__btn')[0];
        prevYearBtn.addEventListener('click', () => this.setPrevYear());
        const nextYearBtn = document.getElementsByClassName('month-picker__btn')[1];
        nextYearBtn.addEventListener('click', () => this.setNextYear());
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
            this.#element.appendChild(seasonBlock);
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
                    if (this.month-1 == monthIdx-1) {
                        activeMonth = month;
                    }
                    monthIdx++;
                } 
            }
        }
        activeMonth.select();
    }

    #updateTitle() {
        const title = document.getElementById("calendar-page__title");
        title.innerText = this.year + ' ' + this.getMonthName(this.#month - 1);
    }

    offLastSeason() {
        const prevMonths = document.querySelectorAll('.month-picker__month_current');
        for (const m of prevMonths) {
            m.className = 'month-picker__month';
        }
    }

    getMonthName(idx) {
        const monthsNames = [
            "Январь",   "Февраль", 
            "Март",     "Апрель",  "Май", 
            "Июнь",     "Июль",    "Август", 
            "Сентябрь", "Октябрь", "Ноябрь",
            "Декабрь"
        ];
        return monthsNames[idx];
    }

    #notifyObservers() {
        const calendar = new Calendar();
        calendar.update();        
        const monthPickerYear = document.getElementById('month-picker__year');
        monthPickerYear.textContent = this.#year;
        this.#updateTitle();
    }

    setCurrentDate() {
        const date = new Date();
        this.setDate(date.getDate(), date.getMonth() + 1, date.getFullYear());

        this.#notifyObservers();
    }

    setNextYear() {
        if (this.year < 2040) {
            this.offLastSeason();
            this.setDate(this.day, this.month, this.year + 1);
            this.onMonth(this.monthEl);
        }

        this.#notifyObservers();
    }

    setPrevYear() {
        if (this.year > 2000) {
            this.offLastSeason();
            this.setDate(this.day, this.month, this.year - 1);
            this.onMonth(this.monthEl);
        }

        this.#notifyObservers();
    }

    setDate(day, month = this.month, year = this.year) {
        this.#month = month;
        this.#year = year;
        this.#day = day;

        this.#notifyObservers();
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
        const picker = document.getElementById('month-picker');
        picker.style.display = 'none';
        const title = document.getElementById('calendar-page__title');
        title.style.display = 'block';
        const header = document.getElementById('month-picker__header');
        header.style.display = 'none';
    }

    #setupButton() {
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
import DateData from "./dateData.mjs";
import Month from "./month.mjs";

class DatePicker {
    #element = undefined;

    monthEl = undefined;

    static #instance = null;

    constructor() {
        if (DatePicker.#instance) {
            return DatePicker.#instance;
        } else {
            DatePicker.#instance = this;
        }

        this.#setupButton();
        this.#element = document.getElementById('month-picker');
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
                    const dateData = new DateData();
                    if (dateData.month-1 == monthIdx-1) {
                        activeMonth = month;
                    }
                    monthIdx++;
                } 
            }
        }
        activeMonth.select(); 
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
    
    #updateYear() {
        const monthPickerYear = document.getElementById('month-picker__year');
        const dateData = new DateData();
        monthPickerYear.textContent = dateData.year;
    }

    updateView() {
        this.#updateYear();
        this.#updateTitle();
    }

    #updateTitle() {
        const title = document.getElementById("calendar-page__title");
        const dateData = new DateData();
        title.innerText = dateData.year + ' ' + dateData.getMonthName(dateData.month - 1);
    }

    offLastSeason() {
        const prevMonths = document.querySelectorAll('.month-picker__month_current');
        for (const m of prevMonths) {
            m.className = 'month-picker__month';
        }
    }
    
}

export default DatePicker;
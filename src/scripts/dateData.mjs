import Calendar from "./calendar.mjs";
import DatePicker from "./datePicker.mjs";
import TaskList from "./tasks/taskList.mjs";

class DateData {
    #month = 0;
    get month() { return this.#month; }

    #year = 0;
    get year() { return this.#year; }

    #day = 0;
    get day() { return this.#day; }

    static #instance = null;
    
    constructor() { 
        if (DateData.#instance) {
            return DateData.#instance;
        } else {
            DateData.#instance = this;
        }

        this.setCurrentDate();
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

    setCurrentDate() {
        const date = new Date();
        this.setDate(date.getDate(), date.getMonth() + 1, date.getFullYear());

        this.#notifyObservers();
    }

    setDate(day, month = this.month, year = this.year) {
        this.#month = month;
        this.#year = year;
        this.#day = day;

        this.#notifyObservers();
    }

    #notifyObservers() {
        const calendar = new Calendar();
        calendar.updateView();  
        const datePicker = new DatePicker();
        datePicker.updateView();
        TaskList.filterByDate(new Date(this.year, this.month - 1, this.day));
    }
}

export default DateData;
import CalendarView from "./calendar-view.mjs";

class CalendarModel {
    #month = 0;
    get month() { return this.#month; }

    #year = 0;
    get year() { return this.#year; }

    #day = 0;
    get day() { return this.#day; }

    static #instance = null;
    
    constructor() { 
        if (CalendarModel.#instance) {
            return CalendarModel.#instance;
        } else {
            CalendarModel.#instance = this;
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
            31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ] 
        if (this.year % 4 == 0) {
            daysInMonths[1] += 1; // For leap year
        }
        return daysInMonths[this.month - 1];
    }

    setCurrentDate() {
        const date = new Date();
        this.setDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
    }

    setNextMonth() {
        let month = this.#month;
        let year = this.#year;
        month += 1;
        if (month == 13) {
            month = 1;
            year += 1;
        }
        this.setDate(this.#day, month, year);
    }

    setPreviousMonth() {
        let month = this.#month;
        let year = this.#year;
        month -= 1;
        if (month == 0) {
            month = 12;
            year -= 1;
        }
        this.setDate(this.#day, month, year);
    }

    setDate(day, month = this.month, year = this.year) {
        this.#month = month;
        this.#year = year;
        this.#day = day;

        this.#notifyObservers();
    }

    #notifyObservers() {
        const calendarView = new CalendarView();
        calendarView.updateView();  
    }
}

export default CalendarModel;
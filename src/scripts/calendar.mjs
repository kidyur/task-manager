import SchedulesData from "./schedulesData.mjs";
import DateData from "./dateData.mjs";
import Day from './day.mjs';
import { getFirstShiftIdxOfMonth } from "./sched-seq-algo.mjs";

class Calendar {
    #calendarEl = undefined;
    #borderFlag = true;
    static #instance = null

    days = [];

    constructor() {
        if (Calendar.#instance != null) {
            return Calendar.#instance;
        } else {
            Calendar.#instance = this;
        }

        this.#calendarEl = document.getElementById('calendar');
        this.#createDays();
    };

    getAmountOfDaysInCurrentMonth() {
        const daysInMonths = [
            31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ] 
        if (DateData.year % 4 == 0) {
            daysInMonths[1] -= 1; // For leap year
        }
        return daysInMonths[DateData.month - 1];
    }

    update() {
        this.#updateDays();
    }

    offLastWeek() {
        const days = document.querySelectorAll('.calendar__day_week');
        for (let day of days) {
            day.className = 'calendar__day calendar__day_month calendar__day_active';
        }
    }

    onWeek(dayIndex) {
        const daysElements = document.getElementsByClassName('calendar__day_month');
        const weekBeginningIdx = dayIndex - dayIndex % 7;
        for (let i = 0; i < 7; i++) {
            if (weekBeginningIdx + i >= daysElements.length) {
                break;
            }
            daysElements[weekBeginningIdx + i].classList.add('calendar__day_week');
        }
    }

    #createDays() {
        const week = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        for (const day of week) {
            const d = new Day(day);
        }
        const month = 42; // 7 days * 6 weeks. Since in worst case one month takes 6 weeks
        for (let day = 0; day < month; day++) {
            const d = new Day('', this.#borderFlag, "");
            this.days.push(d);
        }
    }

    #updateDays() { // FIX: updates twice on shift adding
        let shiftIdx = getFirstShiftIdxOfMonth();
        const amountOfDays = this.getAmountOfDaysInCurrentMonth();
        const shifts = SchedulesData.currentSchedule.getShiftsCopy();

        let m = DateData.month + '';
        if (m < 10) {
            m = '0' + m;
        }
        const monthBeginning = new Date(`${DateData.year}-${m}-01`);
        const amountOfEmptyDays = monthBeginning.getDay() + (monthBeginning.getDay() == 0 ? 6 : 0);
        for (let d = 0; d < amountOfEmptyDays + amountOfDays; d++) {
            if (d < amountOfEmptyDays) {
                this.days[d].updateView('');
                continue;
            }

            let icon = "";
            if (shiftIdx != -1) {
                if (shiftIdx == shifts.indexOf(SchedulesData.currentSchedule.beginningShift)) {
                    this.#borderFlag = !this.#borderFlag;
                }
                icon = (shifts.length ? shifts[shiftIdx].iconTag : "");
                shiftIdx = (shiftIdx + 1) % shifts.length;
            }
            this.days[d].updateView(d - amountOfEmptyDays + 1, this.#borderFlag, icon);
        }
        this.#borderFlag = true;
    }
}

export default Calendar;
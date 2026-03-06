import SchedulesData from "./schedulesData.mjs";
import DateData from "./dateData.mjs";
import Day from './day.mjs';
import { getFirstShiftIdxOfCurrMonth } from "./sched-seq-algo.mjs";

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

        this.#render();
        this.#createDays();
    };

    updateView() {
        this.#updateDays();
    }

    #render() {
        this.#calendarEl = document.createElement("div");
        this.#calendarEl.className = "calendar";
        document.querySelector(".calendar-page").appendChild(this.#calendarEl);
    }

    #createDays() {
        const week = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        for (const day of week) {
            const d = new Day(day);
        }
        const month = 42; // 7 days * 6 weeks. Since in worst case one month takes 6 weeks
        for (let day = 0; day < month; day++) {
            const d = new Day(-1, this.#borderFlag, "");
            this.days.push(d);
        }
    }

    #updateDays() { // FIX: updates twice on shift adding
        const dateData = new DateData();
        const firstDay = dateData.getFirstDayIdxOfCurrMonth();
        let shiftIdx = getFirstShiftIdxOfCurrMonth();
        const amountOfDays = dateData.getDaysInCurrMonth();
        const shifts = SchedulesData.currentSchedule.getShiftsCopy();
        for (let d = 0; d < firstDay + amountOfDays; d++) {
            if (d < firstDay) {
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
            this.days[d].updateView(d - firstDay + 1, this.#borderFlag, icon);
        }
        this.#borderFlag = true;
    }
}

export default Calendar;
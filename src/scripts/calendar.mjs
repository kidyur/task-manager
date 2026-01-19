import SchedulesData from "./schedulesData.mjs";
import DateData from "./dateData.mjs";
import Day from './day.mjs';

const MILISEC_IN_DAY = 24 * 60 * 60 * 1000;

class Calendar {
    static #calendarEl = undefined;
    static #borderFlag = true;

    constructor() { };

    static init() {
        const calendar = document.getElementById('calendar');
        Calendar.#calendarEl = calendar;
        Calendar.#createWeekDays();
    }

    static getAmountOfDaysInCurrentMonth() {
        const daysInMonths = [
            31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ] 
        if (DateData.year % 4 == 0) {
            daysInMonths[1] -= 1; // For leap year
        }
        return daysInMonths[DateData.month - 1];
    }

    static #removeDays() {
        const previousDays = document.querySelectorAll('.calendar__day_month');
        for (const d of previousDays) {
            Calendar.#calendarEl.removeChild(d);
        }
    }

    static #getCorrectShiftsSequenceForCurrentMonth() {
        const seq = [];
        const shifts = SchedulesData.currentSchedule.getShiftsCopy();
        if (shifts && shifts.length > 1) {
            const scheduleMonthBeginningDate = SchedulesData.currentSchedule.beginningDate;
            scheduleMonthBeginningDate.setDate(1);
            scheduleMonthBeginningDate.setHours(0, 0, 0, 0);

            const monthFmt = (DateData.month < 10 ? '0': '') + DateData.month;
            const monthBeginning = new Date(`${DateData.year}-${monthFmt}-01`);
            
            const gap = Math.floor((monthBeginning - scheduleMonthBeginningDate) / MILISEC_IN_DAY);
            const beginningDate = SchedulesData.currentSchedule.beginningDate;
            let remainder = (beginningDate.getDate()) % shifts.length;
            let idx = shifts.indexOf(SchedulesData.currentSchedule.beginningShift);
            // Мы доводим до того остатка, с которого начнём 
            // заполнять календарь.
            let diff = shifts.length - remainder + 1;
            idx = (idx + diff) % shifts.length;
            for (let i = 0; i < shifts.length; i++) {
                seq.push((idx + i + gap) % shifts.length);
                if (seq[i] < 0) {
                    seq[i] = shifts.length + seq[i];
                }
            }
        } else if (shifts && shifts.length == 1) {
            seq.push(0);
        }
        return seq;
    }

    static #appendDays() {
        const seq = this.#getCorrectShiftsSequenceForCurrentMonth();
        const amountOfDays = Calendar.getAmountOfDaysInCurrentMonth();
        const shifts = SchedulesData.currentSchedule.getShiftsCopy();
        for (let day = 0; day < amountOfDays; day++) {
            if (seq[day % seq.length] == shifts.indexOf(SchedulesData.currentSchedule.beginningShift)) {
                Calendar.#borderFlag = !Calendar.#borderFlag;
            }
            const icon = (seq.length ? shifts[seq[day % seq.length]].iconTag : "");
            const d = new Day(day + 1, this.#borderFlag, icon);
        }
        Calendar.#borderFlag = true;
    }

    static update() {
        Calendar.#removeDays();
        Calendar.#createEmptyDays();
        Calendar.#appendDays();
    }

    static offLastWeek() {
        const days = document.querySelectorAll('.calendar__day_week');
        for (let day of days) {
            day.className = 'calendar__day calendar__day_month calendar__day_active';
        }
    }

    static onWeek(dayIndex) {
        const daysElements = document.getElementsByClassName('calendar__day_month');
        const weekBeginningIdx = dayIndex - dayIndex % 7;
        for (let i = 0; i < 7; i++) {
            if (weekBeginningIdx + i >= daysElements.length) {
                break;
            }
            daysElements[weekBeginningIdx + i].classList.add('calendar__day_week');
        }
    }

    static #createWeekDays() {
        const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
        for (const day of weekDays) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar__day calendar__day_name';
            dayEl.innerText = day;
            Calendar.#calendarEl.appendChild(dayEl);
        }
    }

    static #createEmptyDays() {
        let m = DateData.month + '';
        if (m < 10) {
            m = '0' + m;
        }
        const monthBeginning = new Date(`${DateData.year}-${m}-01`);
        const amountOfEmptyDays = monthBeginning.getDay() + (monthBeginning.getDay() == 0 ? 7 : 0);
        for (let i = 0; i < amountOfEmptyDays-1; ++i) {
            const el = document.createElement('div');
            el.className = 'calendar__day calendar__day_empty calendar__day_month';
            Calendar.#calendarEl.appendChild(el);
        }
    }
}

export default Calendar;



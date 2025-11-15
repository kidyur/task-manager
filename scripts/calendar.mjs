import SchedulesData from "./schedulesData.mjs";
import DateData from "./dateData.mjs";
import Day from './day.mjs';

class Calendar {
    static #calendarEl = HTMLDivElement;
    static #borderFlag = true;

    constructor() { };

    static init() {
        const calendar = document.getElementById('calendar');
        Calendar.#calendarEl = calendar;
        Calendar.#createWeekDays();
    }

    static update() {
        let [year, month] = [DateData.year, DateData.month];
        let nextMonth = month + 1;
        let nextYear = year;
        if (nextMonth > 12) {
            nextMonth = 1;
            ++nextYear;
        }
        nextMonth += '';
        if (nextMonth.length == 1) {
            nextMonth = '0' + nextMonth;
        }
        month += '';
        if (month.length == 1) {
            month = '0' + month;
        }
        const monthBeginning = new Date(`${year}-${month}-01`);
        const nextMonthBeginning = new Date(`${nextYear}-${nextMonth}-01`);
        const msInDay = 24 * 60 * 60 * 1000;
        const amountOfDays = Math.floor((nextMonthBeginning - monthBeginning) / msInDay);
        const currentMonthBeginning = new Date();
        currentMonthBeginning.setDate(1);
        currentMonthBeginning.setHours(0, 0, 0, 0);
        let gap = 0;
        if (currentMonthBeginning.getMonth() != monthBeginning.getMonth()) {
            gap = Math.floor((monthBeginning - currentMonthBeginning) / msInDay);
        }

        const previousDays = document.querySelectorAll('.calendar__day_month');
        for (const d of previousDays) {
            Calendar.#calendarEl.removeChild(d);
        }

        Calendar.#createEmptyDays();

        const seq = [];
        const shifts = SchedulesData.currentSchedule.getShiftsCopy();
        if (shifts && shifts.length > 1) {
            let remainder = (DateData.day) % shifts.length;
            let idx = shifts.indexOf(SchedulesData.currentSchedule.beginningShift);
            // Мы доводим до того остатка, с которого начнём 
            // заполнять календарь.
            while (remainder != 1) {
                idx = (idx + 1) % shifts.length;
                remainder = (remainder + 1) % shifts.length; 
            }
            for (let i = 0; i < shifts.length; i++) {
                seq.push((idx + i + gap) % shifts.length);
                if (seq[i] < 0) {
                    seq[i] = shifts.length + seq[i];
                }
            }
        } else if (shifts && shifts.length == 1) {
            seq.push(0);
        }

        let chosenDay = 0;
        for (let day = 1; day <= amountOfDays; day += 1) {
            if (seq[(day-1) % seq.length] == shifts.indexOf(SchedulesData.currentSchedule.beginningShift)) {
                Calendar.#borderFlag = !Calendar.#borderFlag;
            }
            const icon = (seq.length ? shifts[seq[(day-1) % seq.length]].iconURL : "");
            const d = new Day(day, this.#borderFlag, icon);
            if (day == DateData.day) {
                chosenDay = d;
            }
        }
        if (chosenDay != 0) {
            chosenDay.select();
        }
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
        const weekDays = ['п', 'в', 'с', 'ч', 'п', 'с', 'в'];
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


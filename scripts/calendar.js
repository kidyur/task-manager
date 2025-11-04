
function offLastWeek() {
    const days = document.querySelectorAll('.calendar__day_week');
    for (let day of days) {
        day.className = 'calendar__day calendar__day_month calendar__day_active';
    }
}

function onWeek(dayIndex) {
    const daysElements = document.getElementsByClassName('calendar__day_month');
    const weekBeginningIdx = dayIndex - dayIndex % 7;
    for (let i = 0; i < 7; i++) {
        if (weekBeginningIdx + i >= daysElements.length) {
            break;
        }
        daysElements[weekBeginningIdx + i].classList.add('calendar__day_week');
    }
}


let currentDay = 0;

function selectCurrentDay() {
    currentDay.select();
}

class Day {
    #borderFlag = undefined;
    #dayEl = undefined;
    iconURL = undefined;
    
    constructor(day, borderFlag, iconURL) {
        const el = document.createElement('div');
        this.#dayEl = el;
        this.#borderFlag = borderFlag;
        this.iconURL = iconURL;
        el.innerText = day;
        el.className = 'calendar__day calendar__day_month';
        el.addEventListener('click', () => {
            this.select();
        })
        
        if (currSchedule.shifts.length > 0) {
            this.createIcon();
            this.upperline();
        } 

        const calendarEl = document.getElementById('calendar');
        calendarEl.appendChild(el);
        if (day == activeDay) {
            currentDay = this;
        }
    }

    createIcon() {
        const icon = document.createElement('div');
        icon.style.backgroundImage = this.iconURL;
        icon.className = 'calendar__icon';
        this.#dayEl.appendChild(icon);
    }

    upperline() {
        if (this.#borderFlag) {
            this.#dayEl.style.borderTop = '3px solid white';
        } else {
            this.#dayEl.style.borderTop = '3px solid red';
        }
    }

    select() {
        offLastWeek();
        const calendar = document.getElementById('calendar');
        const days = calendar.getElementsByClassName('calendar__day_month');
        for (let i = 0; i < days.length; i++) {
            if (days[i] == this.#dayEl) {
                onWeek(i);
                break;
            }
        }
        if (this.#borderFlag) {
            this.#dayEl.classList.add('calendar__day--active1');
        } else {
            this.#dayEl.classList.add('calendar__day--active2');
        }
    }
}

let activeMonth = 0;
let activeYear = 0;
let activeDay = 0;

function setActiveDate() {
    const currentDate = new Date();
    activeMonth = currentDate.getMonth()+1;
    activeYear = currentDate.getFullYear();
    activeDay = currentDate.getDate();
}

let calendar = undefined;

window.addEventListener('DOMContentLoaded', () => {
    calendar = new Calendar();
    setMonthPicker();
    selectCurrentDay();
})

let borderFlag = true;

class Calendar {
    #calendarEl = undefined;

    constructor() {
        setActiveDate();
        const calendar = document.getElementById('calendar');
        this.#calendarEl = calendar;

        this.createWeekDays();
        this.update();
    }

    update() {
        const [year, month] = [activeYear, activeMonth];
        let nextMonth = month + 1;
        let nextYear = year;
        if (nextMonth > 12) {
            nextMonth = 1;
            ++nextYear;
        }
        const monthBeginning = new Date(`${year}-${month}-1`);
        const nextMonthBeginning = new Date(`${nextYear}-${nextMonth}-1`);
        const msInDay = 24 * 60 * 60 * 1000;
        const amountOfDays = Math.floor((nextMonthBeginning - monthBeginning) / msInDay);
        const currentMonthBeginning = new Date();
        currentMonthBeginning.setDate(1);
        let gap = 0;
        if (currentMonthBeginning.getMonth() != monthBeginning.getMonth()) {
            gap = Math.floor((monthBeginning - currentMonthBeginning) / msInDay);
        }

        const previousDays = document.querySelectorAll('.calendar__day_month');
        for (const d of previousDays) {
            this.#calendarEl.removeChild(d);
        }

        this.createEmptyDays();

        const seq = [];
        const shifts = currSchedule.shifts;
        if (shifts && shifts.length > 1) {
            const date = new Date();
            let remainder = date.getDate() % shifts.length;
            let idx = 0;

            // Мы доводим до того остатка, с которого начнём 
            // заполнять календарь.
            while (remainder != 1) {
                ++idx;
                remainder = (remainder + 1) % shifts.length; 
            }
        
            for (let i = 0; i < shifts.length; i++) {
                seq.push((idx + i + gap) % shifts.length);
                if (seq[i] < 0) {
                    seq[i] = shifts.length + seq[i];
                }
            }
        } 
        for (let day = 1; day <= amountOfDays; day += 1) {
            if (seq[(day-1) % seq.length] == 0) {
                borderFlag = !borderFlag;
            }
            const icon = (seq.length ? currSchedule.shifts[seq[(day-1) % seq.length]].iconURL : "");
            const d = new Day(day, borderFlag, icon);
        }
    }

    createWeekDays() {
        const weekDays = ['п', 'в', 'с', 'ч', 'п', 'с', 'в'];
        for (const day of weekDays) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar__day calendar__day_name';
            dayEl.innerText = day;
            this.#calendarEl.appendChild(dayEl);
            console.log();
        }
    }

    createEmptyDays() {
        const monthBeginning = new Date(`${activeYear}-${activeMonth}-1`);
        const amountOfEmptyDays = monthBeginning.getDay() + (monthBeginning.getDay() == 0 ? 7 : 0);
        for (let i = 0; i < amountOfEmptyDays-1; ++i) {
            const el = document.createElement('div');
            el.className = 'calendar__day calendar__day_empty calendar__day_month';
            this.#calendarEl.appendChild(el);
        }
    }
}

function setMonthPicker() {
    const months = [
        "Январь",   "Февраль", 
        "Март",     "Апрель",  "Май", 
        "Июнь",     "Июль",    "Август", 
        "Сентябрь", "Октябрь", "Ноябрь",
        "Декабрь"
    ];
    const seasons = [
        'Зима', "Весна", "Лето", "Осень"
    ];
    const picker = document.getElementById('month-picker');
    const now = new Date();
    const currYear = now.getFullYear();
    for (let year = currYear; year <= currYear+4; year++) {
        const separatorLine = document.createElement('div');
        separatorLine.className = 'month-picker__separator-line';
        for (let i = 0; i < 4; i++) {
            const season = document.createElement('div');
            season.className = 'month-picker__season';
            season.textContent = seasons[i];
            separatorLine.appendChild(season);
        }
        const yearEl = document.createElement('div');
        picker.appendChild(yearEl);
        picker.appendChild(separatorLine);
        yearEl.className = 'month-picker__year';
        yearEl.textContent = year;
        const monthsBlock = document.createElement('div');
        picker.appendChild(monthsBlock);
        monthsBlock.className = 'month-picker__months-block';
        for (let month = 1; month <= 12; month++) {
            const monthEl = document.createElement('button');
            monthsBlock.appendChild(monthEl);
            monthEl.className = 'month-picker__month';
            monthEl.textContent = month;
            if (month == activeMonth && year == activeYear) {
                monthEl.className = 'month-picker__month month-picker__month--active';
            }
            monthEl.addEventListener('click', () => {
                activeMonth = month;
                activeYear = year;
                activeDay = -1;
                const activeMonthEl = document.getElementById('calendar-page__month');
                activeMonthEl.textContent = months[month-1];
                const activeYearEl = document.getElementById('calendar-page__year');
                activeYearEl.textContent = year;
                picker.style.display = 'none';
                calendar.update();
            })
            if (year == activeYear && month == activeMonth) {
                activeMonth = month;
                activeYear = year;
                const activeMonthEl = document.getElementById('calendar-page__month');
                activeMonthEl.textContent = months[month-1];
                const activeYearEl = document.getElementById('calendar-page__year');
                activeYearEl.textContent = year;
                picker.style.display = 'none';
            }
        }
    }
}

const monthPickerBtn = document.getElementById('calendar-page__month-picker-btn');
monthPickerBtn.addEventListener('click', () => {
    const picker = document.getElementById('month-picker');
    picker.style.display = 'block';
})
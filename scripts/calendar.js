
function offLastActiveWeek() {
    const prevActiveWeekDays = document.querySelectorAll('.calendar__day--current-week');
    for (let day of prevActiveWeekDays) {
        day.className = 'calendar__day';
    }
}

function onWeek(dayIndex) {
    const daysElements = document.getElementsByClassName('calendar__day');
    const weekDay = (dayIndex - 1) % 7;
    const monthDay = dayIndex + 7 - 1;
    for (let i = weekDay; i >= 1; i--) {
        daysElements[monthDay - i].classList.add('calendar__day--current-week');
    }
    for (let i = weekDay; i < 7; i++) {
        daysElements[monthDay + i - weekDay].classList.add('calendar__day--current-week');
    }
}

class Day {
    #borderFlag = undefined;
    #dayIndex = undefined;
    #dayEl = undefined;
    #emptyDays = 0;
    
    constructor(day, borderFlag, emptyDays) {
        const el = document.createElement('div');
        this.#dayEl = el;
        this.#dayIndex = day;
        this.#borderFlag = borderFlag;
        this.#emptyDays = emptyDays;
        el.innerText = day;
        el.className = 'calendar__day';
        el.addEventListener('click', () => {
            this.select();
        })
        if (seq.length > 0) {
            this.createIcon();
        } 
        this.upperline();
        const calendar = document.getElementById('calendar-page__calendar');
        calendar.appendChild(el);
    }

    createIcon() {
        const icon = document.createElement('div');
        icon.style.backgroundImage = shifts[seq[(day-1) % seq.length]].iconURL;
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
        offLastActiveWeek();
        onWeek(this.#dayIndex + this.#emptyDays + 7);
        if (this.#borderFlag) {
            this.#dayEl.classList.add('calendar__day--selected1');
        } else {
            this.#dayEl.className.add('calendar__day--selected2');
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

window.addEventListener('DOMContentLoaded', () => {
    setActiveDate();
    setMonthPicker();
    updateCalendar();
})

let borderFlag = false;

class Calendar {
    #calendarEl = undefined;

    constructor() {
        const calendar = document.getElementById('calendar');
        this.#calendarEl = calendar;
        const monthBeginning = new Date(`${activeYear}-${activeMonth}-1`);
        const weekIdxOfFirstMonthDay = monthBeginning.getDay() + (monthBeginning.getDay() == 0 ? 7 : 0);
        this.createEmptyDays(weekIdxOfFirstMonthDay);
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
        const gap = Math.floor((monthBeginning - currentMonthBeginning) / msInDay);

        this.#calendarEl.innerHTML = '';
        const seq = [];
        const shifts = currSchedule.shifts;
        if (shifts && shifts.length > 1) {
            const date = new Date();
            let remainder = date.getDate() % shifts.length;
            let idx = 0;
            while (remainder != 1) {
                ++idx;
                remainder = (remainder + 1) % shifts.length; 
            }
        
            for (let i = 0; i < shifts.length; i++) {
                seq.push((idx + i + gap) % shifts.length);
                if (seq[i] < 0) {
                    seq[i] = 4 + seq[i];
                }
            }
        } 
        
        for (let day = 1; day <= amountOfDays; day += 1) {
            const day = new Day();
            if (seq[(day-1) % seq.length] == 0) {
                borderFlag = !borderFlag;
            }
        }
    }

    createWeekDays() {
        const weekDays = ['п', 'в', 'с', 'ч', 'п', 'с', 'в'];
        for (const day of weekDays) {
            const dayEl = document.createElement('div');
            dayEl.innerText = day;
            dayEl.className = 'calendar__day week-day-name';
            this.#calendarEl.appendChild(dayEl);
        }
    }

    createEmptyDays(amountOfEmptyDays) {
        for (let i = 0; i < amountOfEmptyDays-1; ++i) {
            const el = document.createElement('div');
            el.className = 'calendar__day';
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
                updateCalendar();
            })
            if (year == activeYear && month == activeMonth) {
                activeMonth = month;
                activeYear = year;
                const activeMonthEl = document.getElementById('calendar-page__month');
                activeMonthEl.textContent = months[month-1];
                const activeYearEl = document.getElementById('calendar-page__year');
                activeYearEl.textContent = year;
                picker.style.display = 'none';
                updateCalendar();
            }
        }
    }
}

const monthPickerBtn = document.getElementById('calendar-page__month-picker-btn');
monthPickerBtn.addEventListener('click', () => {
    const picker = document.getElementById('month-picker');
    picker.style.display = 'block';
})
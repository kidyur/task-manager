// import { state } from "./app";

class Day {
    #borderFlag = false;
    #element    = HTMLButtonElement;
    #iconURL    = "";
    #idx        = 0;
    
    constructor(idx, borderFlag, iconURL) {
        const el = document.createElement('div');
        this.#element = el;
        this.#idx = idx;
        this.#borderFlag = borderFlag;
        this.#iconURL = iconURL;
        el.innerText = idx;
        el.className = 'calendar__day calendar__day_month';
        el.addEventListener('click', () => {
            this.select();
        })
        
        if (state.getSchedulesLength() > 0) {
            this.#createIcon();
            this.#upperline();
        } 

        const calendarEl = document.getElementById('calendar');
        calendarEl.appendChild(el);
        if (idx == datePicker.day) {
            this.select();
        }
    }

    #createIcon() {
        const icon = document.createElement('div');
        icon.style.backgroundImage = this.#iconURL;
        icon.className = 'calendar__icon';
        this.#element.appendChild(icon);
    }

    #upperline() {
        if (this.#borderFlag) {
            this.#element.style.borderTop = '3px solid white';
        } else {
            this.#element.style.borderTop = '3px solid red';
        }
    }

    select() {
        datePicker.day = this.#idx;
        Calendar.offLastWeek();
        const calendar = document.getElementById('calendar');
        const days = calendar.getElementsByClassName('calendar__day_month');
        for (let i = 0; i < days.length; i++) {
            if (days[i] == this.#element) {
                Calendar.onWeek(i);
                break;
            }
        }
        if (this.#borderFlag) {
            this.#element.classList.add('calendar__day--active1');
        } else {
            this.#element.classList.add('calendar__day--active2');
        }
    }

    get iconURL() {
        return this.#iconURL;
    }
}

class Calendar {
    #calendarEl = HTMLDivElement;
    #borderFlag = true;

    constructor() {
        const calendar = document.getElementById('calendar');
        this.#calendarEl = calendar;
        this.#createWeekDays();
    }

    update() {
        let [year, month] = [datePicker.year, datePicker.month];
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
            this.#calendarEl.removeChild(d);
        }

        this.#createEmptyDays();

        const seq = [];
        const shifts = state.currentSchedule.getShiftsCopy();
        if (shifts && shifts.length > 1) {
            let remainder = datePicker.day % shifts.length;
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

        let chosenDay = 0;
        for (let day = 1; day <= amountOfDays; day += 1) {
            if (seq[(day-1) % seq.length] == 0) {
                this.#borderFlag = !this.#borderFlag;
            }
            const icon = (seq.length ? shifts[seq[(day-1) % seq.length]].iconURL : "");
            const d = new Day(day, this.#borderFlag, icon);
            if (day == datePicker.day) {
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

    #createWeekDays() {
        const weekDays = ['п', 'в', 'с', 'ч', 'п', 'с', 'в'];
        for (const day of weekDays) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar__day calendar__day_name';
            dayEl.innerText = day;
            this.#calendarEl.appendChild(dayEl);
        }
    }

    #createEmptyDays() {
        let m = datePicker.month + '';
        if (datePicker.month < 10) {
            m = '0' + m;
        }
        const monthBeginning = new Date(`${datePicker.year}-${m}-01`);
        const amountOfEmptyDays = monthBeginning.getDay() + (monthBeginning.getDay() == 0 ? 7 : 0);
        for (let i = 0; i < amountOfEmptyDays-1; ++i) {
            const el = document.createElement('div');
            el.className = 'calendar__day calendar__day_empty calendar__day_month';
            this.#calendarEl.appendChild(el);
        }
    }
}

class DatePicker {
    #month = 0;
    #year = 0;
    #day = 0;
    #element = HTMLDivElement;
    #monthsNames = [
        "Январь",   "Февраль", 
        "Март",     "Апрель",  "Май", 
        "Июнь",     "Июль",    "Август", 
        "Сентябрь", "Октябрь", "Ноябрь",
        "Декабрь"
    ];
    
    constructor() {
        this.setCurrentDate();
        this.#setupButton();
        const picker = document.getElementById('month-picker');
        this.#element = picker;
        const now = new Date();
        const currYear = now.getFullYear();
        for (let year = currYear; year <= currYear+4; year++) {
            const yearEl = document.createElement('div');
            picker.appendChild(yearEl);
            yearEl.className = 'month-picker__year';
            yearEl.textContent = year;
            this.#createSeparator();
            const monthsBlock = document.createElement('div');
            picker.appendChild(monthsBlock);
            monthsBlock.className = 'month-picker__months-block';
            for (let m = 1; m <= 12; m++) {
                const month = new Month(monthsBlock, m, year, this);
                month.element.addEventListener('click', () => {
                    month.select();
                })
            }
        }
    }

    #updateTitle() {
        const title = document.getElementById("calendar-page__title");
        title.innerText = this.#year + ' ' + this.#monthsNames[this.#month - 1];
    }

    offLastYear() {
        const prevMonths = document.querySelectorAll('.month-picker__month_current');
        for (const m of prevMonths) {
            m.className = 'month-picker__month';
        }
    }

    setCurrentDate() {
        const currentDate = new Date();
        this.#day = currentDate.getDate();
        this.#month = currentDate.getMonth() + 1;
        this.#year = currentDate.getFullYear();
        this.#updateTitle();
    }

    setDate(day, month, year) {
        this.#day = day;
        this.#month = month;
        this.#year = year;
        this.#updateTitle();
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
    }

    #setupButton() {
        const monthPickerBtn = document.getElementById('calendar-page__month-picker-btn');
        monthPickerBtn.addEventListener('click', () => {
            const picker = document.getElementById('month-picker');
            picker.style.display = 'block';
        })
    }

    #createSeparator() {
        const seasons = [
            'Зима', "Весна", "Лето", "Осень"
        ];
        const separatorLine = document.createElement('div');
        separatorLine.className = 'month-picker__separator-line';
        for (let i = 0; i < 4; i++) {
            const season = document.createElement('div');
            season.className = 'month-picker__season';
            season.textContent = seasons[i];
            separatorLine.appendChild(season);
        }
        const yearEl = document.createElement('div');
        this.#element.appendChild(separatorLine);
    }

    get month() {
        return this.#month;
    }

    get year() {
        return this.#year;
    }

    get day() {
        return this.#day;
    }

    set day(d) {
        if (d > 0 && d.constructor.name == "Number") {
            this.#day = d;
        } else {
            alert("Попытка присвоить некорректное значение дню")
        }
    }
}

class Month {
    #element;
    #name;
    #idx;
    #year;

    constructor(listEl, idx, year, datePicker) {
        this.#idx = idx;
        this.#year = year;

        const el = document.createElement('button');
        this.#element = el;
        listEl.appendChild(el);
        el.className = 'month-picker__month';
        el.textContent = idx;
        if (year == this.#year) {
            this.#element.classList.add('month-picker__month_current')
        }
        if (datePicker.month == this.#idx && 
            datePicker.year  == this.#year) {
            this.#element.classList.add('month-picker__month--active');
        }
    }

    select() {
        datePicker.offLastYear();
        datePicker.onMonth(this.#element);
        datePicker.hide();
        datePicker.setDate(-1, this.#idx, this.#year);
        calendar.update();
    }

    get element() {
        return this.#element;
    }
}


class State {
    #SCHEDULES_LIMIT = 3;
    #currentSchedule = Object;
    #schedules       = [];
    #tasks           = []; // TODO: move all tasks here

    constructor() { }
    
    reload() {
        this.#currentSchedule = new Schedule(true);
        this.#schedules = [];
    }

    get currentSchedule() {
        return this.#currentSchedule;
    }

    set currentSchedule(schedule) {
        if (schedule.constructor.name != "Schedule") {
            alert("Попытка присвоить текущему расписанию некорректное значение");
        } else {
            this.#currentSchedule = schedule;
        }
    }

    addSchedule(schedule) {
        if (schedule.constructor.name != "Schedule") {
            alert("Попытка добавить в список расписаний некорректное значение");
        } else {
            if (this.getSchedulesLength() <= this.#SCHEDULES_LIMIT) {
                this.#schedules.push(schedule);
                calendar.update();
            } else {
                alert("Достигнуто максимальное количество расписаний");
            }
        }
    }

    removeSchedule(schedule) {
        if (schedule.constructor.name != "Schedule") {
            alert("Попытка удалить некорректное значение из списка расписаний");
        } else {
            const idx = this.#schedules.indexOf(schedule);
            if (idx != -1) {
                this.#schedules.splice(idx, 1);
            }
            calendar.update();
        }
    }

    getSchedulesLength() {
        return this.#schedules.length;
    }
}

const state = new State();
const calendar = new Calendar();
const datePicker = new DatePicker();

window.addEventListener('DOMContentLoaded', () => {
    state.reload();
    calendar.update();
})

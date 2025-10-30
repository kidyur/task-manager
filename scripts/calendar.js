function fillCalendar(amountOfDays, gap=0, WeekIdxOfFirstMonthDay=0) {
    const shifts = currSchedule.shifts;
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const weekDays = ['п', 'в', 'с', 'ч', 'п', 'с', 'в'];
    for (const day of weekDays) {
        const el = document.createElement('div');
        el.innerText = day;
        el.className = 'calendar__day week-day-name';
        calendar.appendChild(el);
    }

    for (let i = 0; i < WeekIdxOfFirstMonthDay-1; ++i) {
        const el = document.createElement('div');
        el.className = 'calendar__day week-day-name';
        calendar.appendChild(el);
    }

    const seq = [];
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
        const el = document.createElement('div');
        el.innerText = day;
        el.className = 'calendar__day';
        calendar.appendChild(el);
        if (seq.length > 0) {
            const icon = document.createElement('div');
            icon.style.backgroundImage = shifts[seq[(day-1) % seq.length]].iconURL;
            icon.className = 'calendar__icon';
            el.appendChild(icon);
        } 
    }
}

activeMonth = 0;
activeYear = 0;
function setActiveDate() {
    const currentDate = new Date();
    activeMonth = currentDate.getMonth()+1;
    activeYear = currentDate.getFullYear();
    updateCalendarView();
}

window.addEventListener('DOMContentLoaded', () => {
    setActiveDate();
    setMonthPicker();
})

function updateCalendarView() {
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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth()+1;
    const currentYear = currentDate.getFullYear();
    const currentMonthBeginning = new Date(`${currentYear}-${currentMonth}-1`);
    fillCalendar(amountOfDays, Math.floor((monthBeginning - currentMonthBeginning) / msInDay), monthBeginning.getDay() + (monthBeginning.getDay() == 0 ? 7 : 0));
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
                const activeMonthEl = document.getElementById('calendar-page__month');
                activeMonthEl.textContent = months[month-1];
                const activeYearEl = document.getElementById('calendar-page__year');
                activeYearEl.textContent = year;
                picker.style.display = 'none';
                updateCalendarView();
            })
        }
    }
}

const monthPickerBtn = document.getElementById('calendar-page__month-picker-btn');
monthPickerBtn.addEventListener('click', () => {
    const picker = document.getElementById('month-picker');
    picker.style.display = 'block';
})
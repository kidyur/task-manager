function fillCalendar(amountOfDays, gap=0, WeekIdxOfFirstMonthDay=0) {
    const shifts = currSchedule.shifts;
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
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


const monthInput = document.getElementById('month-input');

function updateCalendarView() {
    const [year, month] = monthInput.value.split('-').map(el => parseInt(el));
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

window.addEventListener('DOMContentLoaded', () => {
    monthInput.addEventListener('change', () => updateCalendarView());
    const today = new Date();
    monthInput.value = today.toISOString().slice(0, 7);
    monthInput.dispatchEvent(new Event('change'));
})
// import { SchedulesData } from "./app";
class Day {
    #borderFlag = false;
    #element = HTMLButtonElement;
    #iconURL = "";
    #idx = 0;
    constructor(idx, borderFlag, iconURL){
        const el = document.createElement('div');
        this.#element = el;
        this.#idx = idx;
        this.#borderFlag = borderFlag;
        this.#iconURL = iconURL;
        el.innerText = idx;
        el.className = 'calendar__day calendar__day_month';
        el.addEventListener('click', ()=>{
            this.select();
        });
        if (SchedulesData.getSchedulesLength() > 0) {
            this.#createIcon();
            this.#upperline();
        }
        const calendarEl = document.getElementById('calendar');
        calendarEl.appendChild(el);
        if (idx == datePicker.day) this.select();
    }
    #createIcon() {
        const icon = document.createElement('div');
        icon.style.backgroundImage = this.#iconURL;
        icon.className = 'calendar__icon';
        this.#element.appendChild(icon);
    }
    #upperline() {
        if (this.#borderFlag) this.#element.style.borderTop = '3px solid white';
        else this.#element.style.borderTop = '3px solid red';
    }
    select() {
        datePicker.day = this.#idx;
        Calendar.offLastWeek();
        const calendar1 = document.getElementById('calendar');
        const days = calendar1.getElementsByClassName('calendar__day_month');
        for(let i = 0; i < days.length; i++)if (days[i] == this.#element) {
            Calendar.onWeek(i);
            break;
        }
        if (this.#borderFlag) this.#element.classList.add('calendar__day--active1');
        else this.#element.classList.add('calendar__day--active2');
    }
    get iconURL() {
        return this.#iconURL;
    }
}
class Calendar {
    #calendarEl = HTMLDivElement;
    #borderFlag = true;
    constructor(){
        const calendar1 = document.getElementById('calendar');
        this.#calendarEl = calendar1;
        this.#createWeekDays();
    }
    update() {
        let [year, month] = [
            DatePicker.year,
            DatePicker.month
        ];
        let nextMonth = month + 1;
        let nextYear = year;
        if (nextMonth > 12) {
            nextMonth = 1;
            ++nextYear;
        }
        nextMonth += '';
        if (nextMonth.length == 1) nextMonth = '0' + nextMonth;
        month += '';
        if (month.length == 1) month = '0' + month;
        const monthBeginning = new Date(`${year}-${month}-01`);
        const nextMonthBeginning = new Date(`${nextYear}-${nextMonth}-01`);
        const msInDay = 86400000;
        const amountOfDays = Math.floor((nextMonthBeginning - monthBeginning) / msInDay);
        const currentMonthBeginning = new Date();
        currentMonthBeginning.setDate(1);
        currentMonthBeginning.setHours(0, 0, 0, 0);
        let gap = 0;
        if (currentMonthBeginning.getMonth() != monthBeginning.getMonth()) gap = Math.floor((monthBeginning - currentMonthBeginning) / msInDay);
        const previousDays = document.querySelectorAll('.calendar__day_month');
        for (const d of previousDays)this.#calendarEl.removeChild(d);
        this.#createEmptyDays();
        const seq = [];
        const shifts = SchedulesData.currentSchedule.getShiftsCopy();
        if (shifts && shifts.length > 1) {
            let remainder = datePicker.day % shifts.length;
            let idx = 0;
            // Мы доводим до того остатка, с которого начнём 
            // заполнять календарь.
            while(remainder != 1){
                ++idx;
                remainder = (remainder + 1) % shifts.length;
            }
            for(let i = 0; i < shifts.length; i++){
                seq.push((idx + i + gap) % shifts.length);
                if (seq[i] < 0) seq[i] = shifts.length + seq[i];
            }
        }
        let chosenDay = 0;
        for(let day = 1; day <= amountOfDays; day += 1){
            if (seq[(day - 1) % seq.length] == 0) this.#borderFlag = !this.#borderFlag;
            const icon = seq.length ? shifts[seq[(day - 1) % seq.length]].iconURL : "";
            const d = new Day(day, this.#borderFlag, icon);
            if (day == datePicker.day) chosenDay = d;
        }
        if (chosenDay != 0) chosenDay.select();
    }
    static offLastWeek() {
        const days = document.querySelectorAll('.calendar__day_week');
        for (let day of days)day.className = 'calendar__day calendar__day_month calendar__day_active';
    }
    static onWeek(dayIndex) {
        const daysElements = document.getElementsByClassName('calendar__day_month');
        const weekBeginningIdx = dayIndex - dayIndex % 7;
        for(let i = 0; i < 7; i++){
            if (weekBeginningIdx + i >= daysElements.length) break;
            daysElements[weekBeginningIdx + i].classList.add('calendar__day_week');
        }
    }
    #createWeekDays() {
        const weekDays = [
            "\u043F",
            "\u0432",
            "\u0441",
            "\u0447",
            "\u043F",
            "\u0441",
            "\u0432"
        ];
        for (const day of weekDays){
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar__day calendar__day_name';
            dayEl.innerText = day;
            this.#calendarEl.appendChild(dayEl);
        }
    }
    #createEmptyDays() {
        let m = DatePicker.month + '';
        if (m < 10) m = '0' + m;
        const monthBeginning = new Date(`${DatePicker.year}-${m}-01`);
        const amountOfEmptyDays = monthBeginning.getDay() + (monthBeginning.getDay() == 0 ? 7 : 0);
        for(let i = 0; i < amountOfEmptyDays - 1; ++i){
            const el = document.createElement('div');
            el.className = 'calendar__day calendar__day_empty calendar__day_month';
            this.#calendarEl.appendChild(el);
        }
    }
}
class DatePicker {
    static #month = 0;
    static #year = 0;
    static #day = 0;
    #element = HTMLDivElement;
    #monthsNames = [
        "\u042F\u043D\u0432\u0430\u0440\u044C",
        "\u0424\u0435\u0432\u0440\u0430\u043B\u044C",
        "\u041C\u0430\u0440\u0442",
        "\u0410\u043F\u0440\u0435\u043B\u044C",
        "\u041C\u0430\u0439",
        "\u0418\u044E\u043D\u044C",
        "\u0418\u044E\u043B\u044C",
        "\u0410\u0432\u0433\u0443\u0441\u0442",
        "\u0421\u0435\u043D\u0442\u044F\u0431\u0440\u044C",
        "\u041E\u043A\u0442\u044F\u0431\u0440\u044C",
        "\u041D\u043E\u044F\u0431\u0440\u044C",
        "\u0414\u0435\u043A\u0430\u0431\u0440\u044C"
    ];
    constructor(){
        this.setCurrentDate();
        this.#setupButton();
        const picker = document.getElementById('month-picker');
        this.#element = picker;
        const now = new Date();
        const currYear = now.getFullYear();
        for(let year = currYear; year <= currYear + 4; year++){
            const yearEl = document.createElement('div');
            picker.appendChild(yearEl);
            yearEl.className = 'month-picker__year';
            yearEl.textContent = year;
            this.#createSeparator();
            const monthsBlock = document.createElement('div');
            picker.appendChild(monthsBlock);
            monthsBlock.className = 'month-picker__months-block';
            for(let m = 1; m <= 12; m++){
                const month = new Month(monthsBlock, m, year, this);
                month.element.addEventListener('click', ()=>{
                    month.select();
                });
            }
        }
    }
    #updateTitle() {
        const title = document.getElementById("calendar-page__title");
        title.innerText = DatePicker.#year + ' ' + this.#monthsNames[DatePicker.#month - 1];
    }
    offLastYear() {
        const prevMonths = document.querySelectorAll('.month-picker__month_current');
        for (const m of prevMonths)m.className = 'month-picker__month';
    }
    setCurrentDate() {
        const currentDate = new Date();
        DatePicker.#day = currentDate.getDate();
        DatePicker.#month = currentDate.getMonth() + 1;
        DatePicker.#year = currentDate.getFullYear();
        this.#updateTitle();
    }
    setDate(day, month, year) {
        DatePicker.#day = day;
        DatePicker.#month = month;
        DatePicker.#year = year;
        this.#updateTitle();
    }
    onMonth(element) {
        const currMonths = element.parentNode.getElementsByClassName('month-picker__month');
        for (const m of currMonths)m.classList.add('month-picker__month_current');
        element.classList.add('month-picker__month--active');
    }
    hide() {
        this.#element.style.display = 'none';
    }
    #setupButton() {
        const monthPickerBtn = document.getElementById('calendar-page__month-picker-btn');
        monthPickerBtn.addEventListener('click', ()=>{
            const picker = document.getElementById('month-picker');
            picker.style.display = 'block';
        });
    }
    #createSeparator() {
        const seasons = [
            "\u0417\u0438\u043C\u0430",
            "\u0412\u0435\u0441\u043D\u0430",
            "\u041B\u0435\u0442\u043E",
            "\u041E\u0441\u0435\u043D\u044C"
        ];
        const separatorLine = document.createElement('div');
        separatorLine.className = 'month-picker__separator-line';
        for(let i = 0; i < 4; i++){
            const season = document.createElement('div');
            season.className = 'month-picker__season';
            season.textContent = seasons[i];
            separatorLine.appendChild(season);
        }
        const yearEl = document.createElement('div');
        this.#element.appendChild(separatorLine);
    }
    get month() {
        return DatePicker.#month;
    }
    get year() {
        return DatePicker.#year;
    }
    get day() {
        return DatePicker.#day;
    }
    set day(d) {
        if (d > 0 && d.constructor.name == "Number") DatePicker.#day = d;
        else alert("\u041F\u043E\u043F\u044B\u0442\u043A\u0430 \u043F\u0440\u0438\u0441\u0432\u043E\u0438\u0442\u044C \u043D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0434\u043D\u044E");
    }
}
class Month {
    #element;
    #name;
    #idx;
    #year;
    constructor(listEl, idx, year, datePicker1){
        this.#idx = idx;
        this.#year = year;
        const el = document.createElement('button');
        this.#element = el;
        listEl.appendChild(el);
        el.className = 'month-picker__month';
        el.textContent = idx;
        if (year == this.#year) this.#element.classList.add('month-picker__month_current');
        if (datePicker1.month == this.#idx && datePicker1.year == this.#year) this.#element.classList.add('month-picker__month--active');
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

//# sourceMappingURL=calendar.3d0f1269.js.map

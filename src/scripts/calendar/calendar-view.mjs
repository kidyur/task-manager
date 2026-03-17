import SchedulesTableModel from "../schedules-table/schedules-table-model.mjs";
import CalendarModel from "./calendar-model.mjs";
import Day from "../day/day.mjs";
import { getFirstShiftIdxOfCurrMonth } from "../common/sched-seq-algo.mjs";
import "./calendar.css";


class CalendarView {
    #element = undefined;
    #borderFlag = true;
    static #instance = null

    days = [];

    constructor() {
        if (CalendarView.#instance != null) {
            return CalendarView.#instance;
        } else {
            CalendarView.#instance = this;
        }

        this.#render();
        this.#createDays();
        this.#pinListeners();
    };

    updateView() {
        this.#updateDays();
        this.#updateDateTitle();
    }

    close() {
        this.#element.style.display = "none";
    }

    open() {
        this.#element.style.display = "flex";
    }

    #updateDateTitle() {
        const calendarViewModel = new CalendarModel();
        const title = this.#element.querySelector(".calendarView__date-title");
        const monthsNames = [
             'Январь' , 'Февраль' , 
             'Март' , 'Апрель' , 'Май' , 
             'Июнь' , 'Июль' , 'Август' , 
             'Сентябрь' , 'Октябрь' , 'Ноябрь' , 
             'Декабрь'
        ];
        let newTitle = `${calendarViewModel.year}, ${monthsNames[calendarViewModel.month - 1]}`;
        title.innerHTML = newTitle;
    }

    #render() {
        this.#element = document.createElement("div");
        this.#element.className = "calendarView";
        this.#element.innerHTML = `
        <h1 class="calendar__title">Календарь</h1>
        <div class="calendarView__months-roulette">
            <button class="calendarView__arrow-btn"></button>
            <p class="calendarView__date-title">Текущая дата</p>
            <button class="calendarView__arrow-btn"></button>
        </div>
            <div class="calendarView__days-grid"></div>
        `;
        document.querySelector("body").appendChild(this.#element);
    }

    #pinListeners() {
        const calendarViewModel = new CalendarModel();

        this.#element.querySelectorAll(".calendarView__arrow-btn")[0]
                        .addEventListener("click", () => {
            calendarViewModel.setPreviousMonth();
        })

        this.#element.querySelectorAll(".calendarView__arrow-btn")[1]
                        .addEventListener("click", () => {
            calendarViewModel.setNextMonth();
        })
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

    #updateDays() {
        const calendarViewModel = new CalendarModel();
        const firstDay = calendarViewModel.getFirstDayIdxOfCurrMonth();
        let shiftIdx = getFirstShiftIdxOfCurrMonth();
        const amountOfDays = calendarViewModel.getDaysInCurrMonth();
        const schedulesTableModel = new SchedulesTableModel();
        let shifts = []
        if (schedulesTableModel.currentSchedule != null) {
            shifts = schedulesTableModel.currentSchedule.getShiftsCopy();
        }
        for (let d = 0; d < this.days.length; d++) {
            if (d < firstDay) {
                this.days[d].updateView('');
                continue;
            }
            if (d >= firstDay + amountOfDays) {
                this.days[d].updateView('');
                continue;
            }
            let icon = "";
            if (shiftIdx != -1) {
                if (shiftIdx == shifts.indexOf(schedulesTableModel.currentSchedule.getBeginningShift())) {
                    this.#borderFlag = !this.#borderFlag;
                }
                icon = shifts[shiftIdx].getIcon()
                shiftIdx = (shiftIdx + 1) % shifts.length;
            }
            this.days[d].updateView(d - firstDay + 1, this.#borderFlag, icon);
            
        }
        this.#borderFlag = true;
    }
}

export default CalendarView;
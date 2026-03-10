import Schedule from "../schedule/schedule.mjs";
import CalendarView from "../calendar/calendar-view.mjs";
import Shift from "../shift/shift.mjs";
import "./schedules-table.css";

class SchedulesTableModel {
    #SCHEDULES_LIMIT = 3;
    #currentSchedule = null;
    get currentSchedule() { return this.#currentSchedule };
    set currentSchedule(schedule) {
        this.#currentSchedule = schedule;
        const calendarView = new CalendarView();
        calendarView.updateView();
    }
    #schedules = new Map();
    #element = null;

    static #instance = null;

    constructor() {
        if (SchedulesTableModel.#instance) {
            return SchedulesTableModel.#instance;
        } else {
            SchedulesTableModel.#instance = this;
        }

        this.#render();
        this.#pinListeners();
    }

    getSchedulesSize() {
        return this.#schedules.size;
    }

    addSchedule(title) {
        if (this.#schedules.size < this.#SCHEDULES_LIMIT) {
            this.#schedules.set(title, new Schedule(title));

            this.#notifyObservers();
        } 
    }

    clear() {
        this.#schedules.clear();

        this.#notifyObservers();
    }

    removeCurrentSchedule() {
        this.#schedules.delete(this.#currentSchedule.getTitle());

        this.#notifyObservers();
    }

    removeSchedule(title) {
        this.#schedules.delete(title);

        this.#notifyObservers();
    }

    toJSON() {
        let obj = [];
        for (const schedule of this.schedules) {
            const scheduleFmt = {
                name: schedule.name,
                shifts: []
            };
            for (const shift of schedule.shifts) {
                scheduleFmt.shifts.push({
                    name: shift.name, 
                    iconTag: shift.getIcon(),
                })
            }
            obj.push(scheduleFmt);
        }
        return obj;
    }

    parseJSON(list) {
        for (const schedule of list) {
            const schedule_item = new Schedule();
            schedule_item.name = schedule.name;
            for (const shift_item of schedule.shifts) {
                const shift = new Shift(shift_item.getTitle(), shift_item.getIcon());
            }
        }
    }

    #render() {
        this.#element = document.createElement("div");
        this.#element.className = "schedules-table";
        this.#element.innerHTML = `
            <div id="schedule-page__groups-line">
                <div id="schedule-page__groups-sector"></div>
                <button id="schedule-page__add-schedule-btn" class="schedule-page__add-schedule-btn">+</button>
            </div>

            <div class="schedule-page__shift-list"></div>
            
            <div id="schedule-page__manager">
                <button id="schedule-page__add-shift-btn">+ Добавить день</button> 
                <button id="schedule-page__delete-schedule-btn">Удалить расписание</button>
            </div>

            <div id="schedule-page__hint">
                <div id="long-arrow"></div>
                <div id="lightbulb"></div>
                <p>Создайте своё первое <br> расписание</p>
            </div>
        `;
        document.querySelector("body").appendChild(this.#element);
    }

    #pinListeners() {
        this.#element.querySelector('#schedule-page__delete-schedule-btn')
                     .addEventListener("click", () => {
            this.removeCurrentSchedule();

            this.#notifyObservers();
        });
    
        this.#element.querySelector('#schedule-page__add-shift-btn')
                     .addEventListener("click", () => {
            this.#currentSchedule.addShift();

            this.#notifyObservers();
        });

        this.#element.querySelector('#schedule-page__add-schedule-btn')
                     .addEventListener("click", () => {
            this.addSchedule("helloworldd!");

            this.#notifyObservers();
        });
    }

    #updateScheduleManager() {
        const manager = document.getElementById('schedule-page__manager');
        const hint = document.getElementById('schedule-page__hint');

        if (this.getSchedulesSize() == 0) {
            manager.style.display = 'none';
            hint.style.display = 'flex';
        } else {
            manager.style.display = 'flex';
            hint.style.display = 'none';
        }
    }

    #updateView() {
        const shiftsList = this.#element.querySelector(".schedule-page__shift-list");
        shiftsList.innerHTML = "";
        const shifts = this.#currentSchedule.getShiftsCopy();
        for (let i = 0; i < shifts.length; i++) {
            // const shiftEl = 
        }
    }

    #notifyObservers() {
        const calendarView = new CalendarView();
        calendarView.updateView();
        this.#updateScheduleManager();
    }
}

export default SchedulesTableModel;



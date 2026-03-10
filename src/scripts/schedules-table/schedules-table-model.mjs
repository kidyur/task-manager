import Schedule from "../schedule/schedule.mjs";
import CalendarView from "../calendar/calendar-view.mjs";
import Shift from "../shift/shift.mjs";
import ScheduleEditor from "../schedule-editor/schedule-editor.mjs";
import "./schedules-table.css";


class SchedulesTableModel {
    #SCHEDULES_LIMIT = 3;
    #currentSchedule = null;
    get currentSchedule() { return this.#currentSchedule };
    set currentSchedule(schedule) {
        this.#currentSchedule = schedule;


        this.#notifyObservers();
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
            const schedule = new Schedule(title);
            this.#schedules.set(new Date(), schedule);
            schedule.select();

            this.#notifyObservers();
        } 
    }

    clear() {
        this.#schedules.clear();

        this.#notifyObservers();
    }

    removeCurrentSchedule() {
        this.#currentSchedule.destructor();
        this.#schedules.delete(this.#currentSchedule.getTitle());

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

    updateView() {
        for (const [title, schedule] of this.#schedules) {
            schedule.updateView();
        }
    }

    #render() {
        this.#element = document.createElement("div");
        this.#element.className = "schedules-table";
        this.#element.innerHTML = `
        <div class="schedules-table__table"></div>
        <div class="schedules-table__footer">
            <button class="schedules-table__add-btn">
                +
            </button>
        </div>
        `;
        document.querySelector("body").appendChild(this.#element);
    }

    #pinListeners() {
        this.#element.querySelector('.schedules-table__add-btn')
                     .addEventListener("click", () => {
            const scheduleEditor = new ScheduleEditor()
            scheduleEditor.open();

            this.#notifyObservers();
        });
    }

    #notifyObservers() {
        const calendarView = new CalendarView();
        calendarView.updateView();
    }
}

export default SchedulesTableModel;



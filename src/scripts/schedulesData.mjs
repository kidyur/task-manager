import Schedule from "./schedule.mjs";
import Calendar from "./calendar.mjs";
import Shift from "./shift.mjs";

class SchedulesData {
    #SCHEDULES_LIMIT = 3;
    
    #currentSchedule = null;
    get currentSchedule() { return this.#currentSchedule };
    set currentSchedule(schedule) {
        this.#currentSchedule = schedule;
        const calendar = new Calendar();
        calendar.updateView();
    }

    #schedules = new Map();

    static #instance = null;

    constructor() {
        if (SchedulesData.#instance) {
            return SchedulesData.#instance;
        } else {
            SchedulesData.#instance = this;
        }
    }

    getSchedulesSize() {
        return this.#schedules.size;
    }

    addSchedule(title) {
        if (this.#schedules.size < this.#SCHEDULES_LIMIT) {
            this.#schedules.set(title, new Schedule(title));
            console.log(this.#schedules);

            this.#notifyObservers();
        } 
    }

    removeSchedule(title) {
        this.#schedules.delete(title);

        this.#notifyObservers();
    }

    toJSON() {
        let obj = [];
        for (const schedule of this.schedules) {
            console.log("Schedule processed")
            const scheduleFmt = {
                name: schedule.name,
                shifts: []
            };
            for (const shift of schedule.shifts) {
                scheduleFmt.shifts.push({
                    name: shift.name, 
                    iconTag: shift.iconTag,
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
                const shift = new Shift(shift_item.name, shift_item.iconTag);
            }
        }
    }

    #notifyObservers() {
        const calendar = new Calendar();
        calendar.updateView();
    }

}

export default SchedulesData;



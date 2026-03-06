import Schedule from "./schedule.mjs";
import Calendar from "./calendar.mjs";
import Shift from "./shift.mjs";

class SchedulesData {
    #SCHEDULES_LIMIT = 3;
    
    #currentSchedule = new Schedule(true);
    get currentSchedule() { return this.#currentSchedule };
    set currentSchedule(schedule) {
        this.#currentSchedule = schedule;
        const calendar = new Calendar();
        calendar.updateView();
    }

    #schedules = [];
    get schedules() { 
        return [...this.#schedules];
    }
    set schedules(s) { this.#schedules = s }

    static #instance = null;

    constructor() {
        if (SchedulesData.#instance) {
            return SchedulesData.#instance;
        } else {
            SchedulesData.#instance = this;
        }
    }
    
    reload() {
        this.#schedules = [];
        const calendar = new Calendar();
        calendar.updateView();
    }

    addSchedule(schedule) {
        if (this.getSchedulesLength() <= this.#SCHEDULES_LIMIT) {
            this.#schedules.push(schedule);
            const calendar = new Calendar();
            calendar.updateView();
        } 
    }

    removeSchedule(schedule) {
        const idx = this.#schedules.indexOf(schedule);
        if (idx != -1) {
            this.#schedules.splice(idx, 1);
        }
        const calendar = new Calendar();
        calendar.updateView();
    }

    getSchedulesLength() {
        return this.#schedules.length;
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
}

export default SchedulesData;



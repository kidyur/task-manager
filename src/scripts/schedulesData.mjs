import Schedule from "./schedule.mjs";
import Calendar from "./calendar.mjs";
import Shift from "./shift.mjs";

class SchedulesData {
    static #SCHEDULES_LIMIT = 3;
    
    static #currentSchedule = new Schedule(true);
    static get currentSchedule() { return SchedulesData.#currentSchedule };
    static set currentSchedule(schedule) {
        SchedulesData.#currentSchedule = schedule;
        Calendar.update();
    }

    static #schedules = [];
    static get schedules() { 
        return [...this.#schedules];
    }
    static set schedules(s) { this.#schedules = s }

    constructor() { }
    
    static reload() {
        SchedulesData.#schedules = [];
        Calendar.update();
    }

    static addSchedule(schedule) {
        if (this.getSchedulesLength() <= SchedulesData.#SCHEDULES_LIMIT) {
            SchedulesData.#schedules.push(schedule);
            Calendar.update();
        } 
    }

    static removeSchedule(schedule) {
        const idx = SchedulesData.#schedules.indexOf(schedule);
        if (idx != -1) {
            SchedulesData.#schedules.splice(idx, 1);
        }
        Calendar.update();
    }

    static getSchedulesLength() {
        return SchedulesData.#schedules.length;
    }

    static toJSON() {
        let obj = [];
        for (const schedule of SchedulesData.schedules) {
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

    static parseJSON(list) {
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



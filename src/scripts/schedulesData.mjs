import Schedule from "./schedule.mjs";
import Calendar from "./calendar.mjs";

class SchedulesData {
    static #SCHEDULES_LIMIT = 3;
    
    static #currentSchedule = new Schedule(true);
    static get currentSchedule() { return SchedulesData.#currentSchedule };
    static set currentSchedule(schedule) {
        if (schedule.constructor.name != "Schedule") {
            alert("Попытка присвоить текущему расписанию некорректное значение");
        } else {
            SchedulesData.#currentSchedule = schedule;
            Calendar.update();
        }
    }

    static #schedules = [];

    constructor() { }
    
    static reload() {
        SchedulesData.#schedules = [];
        Calendar.update();
    }

    static addSchedule(schedule) {
        if (schedule.constructor.name != "Schedule") {
            alert("Попытка добавить в список расписаний некорректное значение");
        } else {
            if (this.getSchedulesLength() <= SchedulesData.#SCHEDULES_LIMIT) {
                SchedulesData.#schedules.push(schedule);
                Calendar.update();
            } else {
                alert("Достигнуто максимальное количество расписаний");
            }
        }
    }

    static removeSchedule(schedule) {
        if (schedule.constructor.name != "Schedule") {
            alert("Попытка удалить некорректное значение из списка расписаний");
        } else {
            const idx = SchedulesData.#schedules.indexOf(schedule);
            if (idx != -1) {
                SchedulesData.#schedules.splice(idx, 1);
            }
            Calendar.update();
        }
    }

    static getSchedulesLength() {
        return SchedulesData.#schedules.length;
    }

    static getSchedules() {
        return SchedulesData.#schedules;
    }
}

export default SchedulesData;



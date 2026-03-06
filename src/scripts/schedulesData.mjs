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

        this.#setupScheduleManager();
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

    #setupAddShiftBtn() {
        const btn = document.getElementById('schedule-page__add-shift-btn');
        btn.addEventListener('click', () => {
            this.#currentSchedule.addShift(new Shift("hi!", "There!"));
            const calendar = new Calendar();
            calendar.updateView();
        })
    }

    #setupCreateScheduleBtn() {
        const btn = document.getElementById('schedule-page__add-schedule-btn');
        btn.addEventListener('click', () => {
            const schedulesData = new SchedulesData();
            schedulesData.addSchedule(schedulesData.getSchedulesSize());
        })
    }

    #setupScheduleManager() {
        this.#setupDeleteBtn();
        this.#setupAddShiftBtn();
        this.#setupCreateScheduleBtn();
    }

    #updateScheduleManager() {
        const manager = document.getElementById('schedule-page__manager');
        const hint = document.getElementById('schedule-page__hint');
        const schedulesData = new SchedulesData();

        if (schedulesData.getSchedulesSize() == 0) {
            manager.style.display = 'none';
            hint.style.display = 'flex';
        } else {
            manager.style.display = 'flex';
            hint.style.display = 'none';
        }
    }

    #offAllSchedules() {
        const elements = document.getElementsByClassName('schedule-page__group');
        for (const group of elements) {
            group.className = 'schedule-page__group';
        }
    }
    
    #listShifts() {
        const shiftList = document.getElementById('schedule-page__shift-list');
        shiftList.innerHTML = '';
        for (const shift of this.#currentSchedule.shifts) {
            shift.appendToShiftsList();
        }
    }
    
    #setupDeleteBtn() {
        const deleteBtn = document.getElementById('schedule-page__delete-schedule-btn');
        deleteBtn.addEventListener('click', async () => {
            const activeScheduleElement = document.getElementsByClassName('schedule-page__group--active')[0];  
            activeScheduleElement.remove();
            const schedulesData = new SchedulesData();
            schedulesData.removeSchedule(schedulesData.currentSchedule);
            schedulesData.currentSchedule = new Schedule(true); 
            Schedule.updateScheduleManager();
        })
    }

    #notifyObservers() {
        const calendar = new Calendar();
        calendar.updateView();
        this.#updateScheduleManager();
    }
}

export default SchedulesData;


